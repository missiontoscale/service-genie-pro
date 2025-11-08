import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { detectCurrencyFromText, getCurrencySymbol } from "@/lib/currencyUtils";

const ChatQuote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerAddress, setProviderAddress] = useState("");

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    loadUserProfile();
  };

  const loadUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (profile) {
        setProviderName(profile.business_name || profile.full_name || "");
        setProviderEmail(profile.business_email || "");
        setProviderAddress(profile.business_address || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const extractClientDetails = (text: string) => {
    // Simple NLP to extract client details from description
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emails = text.match(emailRegex) || [];

    // Extract potential client name (look for "for [Name]" or "client: [Name]")
    const namePatterns = [
      /(?:for|client|customer)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /(?:to|preparing for)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    ];

    let clientName = "";
    for (const pattern of namePatterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        clientName = match[1];
        break;
      }
    }

    return {
      clientName,
      clientEmail: emails[0] || "",
    };
  };

  const handleGenerateQuote = async () => {
    if (!description.trim()) {
      toast({
        title: "Description required",
        description: "Please describe the job/service you want to quote for.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      // Detect currency from description
      const detectedCurrency = detectCurrencyFromText(description);

      // Extract client details using simple NLP
      const { clientName, clientEmail } = extractClientDetails(description);

      // Generate quote items with AI
      const { data, error } = await supabase.functions.invoke("generate-with-ai", {
        body: { prompt: description, type: "quote" }
      });

      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      // Calculate totals
      const items = data.items || [];
      const subtotal = items.reduce((sum: number, item: any) =>
        sum + (item.quantity * item.rate), 0
      );
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      // Create quote in database
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          user_id: session.user.id,
          client_name: clientName || "Client",
          client_email: clientEmail || "",
          provider_name: providerName,
          provider_email: providerEmail,
          provider_address: providerAddress,
          title: data.title || "Quote",
          description: description,
          currency: detectedCurrency,
          subtotal,
          tax,
          total,
          status: "draft",
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Insert quote items
      if (items.length > 0) {
        const itemsToInsert = items.map((item: any) => ({
          quote_id: quote.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        }));

        const { error: itemsError } = await supabase
          .from("quote_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Quote created!",
        description: `Your quote "${data.title}" has been created successfully.`,
      });

      // Navigate to quotes page
      navigate("/dashboard/quotes");
    } catch (error: any) {
      console.error("Quote generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quote with AI",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Quote with AI</h2>
          <p className="text-muted-foreground mt-1">
            Describe your job and let AI create a professional quote
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Describe Your Job
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Example: I need a quote for web development services for John Doe (john@example.com). Build a 5-page business website with contact form, about page, services page, blog, and homepage. Timeline is 2 weeks. Budget in USD."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              💡 Tip: Include client name/email, job description, currency (USD, NGN, EUR, etc.),
              and any other relevant details. AI will extract client info and generate line items.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerateQuote}
              className="flex-1 gap-2"
              disabled={aiLoading || !description.trim()}
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Generate Quote
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/quotes/new")}
            >
              Create Manually
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 text-sm">Example Descriptions:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Web Development:</strong> "Quote for Sarah Johnson (sarah@tech.com).
              Build e-commerce website with 10 product pages, shopping cart, payment integration.
              Budget: $5000 USD."
            </li>
            <li>
              <strong>Consulting:</strong> "Consulting services for Chidi Okafor at chidi@company.ng.
              Business strategy consultation, 10 hours at 50,000 NGN per hour. 2-week engagement."
            </li>
            <li>
              <strong>Design:</strong> "Logo design for Amara Ltd. 3 concepts, 2 revisions,
              final files in all formats. €800 EUR."
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatQuote;
