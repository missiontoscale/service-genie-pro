import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type } = await req.json();
    console.log('Received request:', { type, promptLength: prompt?.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('AI service not configured');
    }

    const systemPrompt = type === 'quote' 
      ? `You are a professional business assistant helping to create quotes. Based on the user's description, generate:
1. A professional title
2. Line items with descriptions, quantities, and rates
3. Keep rates realistic and market-appropriate

Return a JSON object with this structure:
{
  "title": "string",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "rate": number
    }
  ]
}`
      : `You are a professional business assistant helping to create invoices. Based on the user's description, generate:
1. A professional invoice number (format: INV-YYYY-MMDD-XXX)
2. Line items with descriptions, quantities, and rates
3. Keep rates realistic and market-appropriate

Return a JSON object with this structure:
{
  "invoiceNumber": "string",
  "items": [
    {
      "description": "string",
      "quantity": number,
      "rate": number
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    const content = data.choices[0].message.content;
    let generatedData;
    
    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        generatedData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(generatedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in generate-with-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
