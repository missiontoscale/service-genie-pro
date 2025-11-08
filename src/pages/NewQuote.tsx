import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Plus, Trash2, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { currencies, convertCurrency, getCurrencySymbol, detectCurrencyFromText } from "@/lib/currencyUtils";
import { exportToPDF, exportToCSV, exportToJSON } from "@/lib/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NewQuote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConversion, setShowConversion] = useState(false);
  const [createdQuoteData, setCreatedQuoteData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    loadUserProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
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
        setProviderName(profile.business_name || "");
        setProviderEmail(profile.business_email || "");
        setProviderAddress(profile.business_address || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      const { quoteSchema } = await import("@/lib/formSchemas");
      
      const validatedData = quoteSchema.parse({
        clientName,
        clientEmail,
        providerName,
        providerEmail,
        providerAddress,
        title,
        description,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })),
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { subtotal, tax, total } = calculateTotals();

      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          user_id: session.user.id,
          client_name: clientName,
          client_email: clientEmail,
          provider_name: providerName,
          provider_email: providerEmail,
          provider_address: providerAddress,
          title,
          description,
          category: category || undefined,
          currency,
          subtotal,
          tax,
          total,
          status: "draft",
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      const itemsToInsert = items.map(item => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setCreatedQuoteData({
        number: title,
        clientName,
        clientEmail,
        providerName,
        providerEmail,
        providerAddress,
        items,
        subtotal,
        tax,
        total,
        currency,
        date: new Date().toLocaleDateString(),
        notes: description,
        type: 'quote' as const,
      });

      toast({
        title: "Quote created!",
        description: "Your quote has been created successfully.",
      });
    } catch (error: any) {
      console.error("Quote creation error:", error);
      toast({
        title: "Error",
        description: error.errors?.[0]?.message || error.message || "Failed to create quote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvertCurrency = (newCurrency: string) => {
    const convertedItems = items.map(item => ({
      ...item,
      rate: convertCurrency(item.rate, currency, newCurrency),
    }));
    setItems(convertedItems);
    setCurrency(newCurrency);
    setShowConversion(false);
    toast({
      title: "Currency converted",
      description: `All amounts have been converted to ${newCurrency}`,
    });
  };

  const generateWithAI = async () => {
    if (!description) {
      toast({
        title: "Description required",
        description: "Please provide a description for AI to generate items.",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      // Detect currency from description
      const detectedCurrency = detectCurrencyFromText(description);
      if (detectedCurrency !== currency) {
        setCurrency(detectedCurrency);
        toast({
          title: "Currency detected",
          description: `Detected ${detectedCurrency} from your description`,
        });
      }

      const { data, error } = await supabase.functions.invoke("generate-with-ai", {
        body: { prompt: description, type: "quote" }
      });

      if (error) throw error;

      if (data.title) setTitle(data.title);
      if (data.items && data.items.length > 0) {
        setItems(data.items.map((item: any, index: number) => ({
          id: Date.now() + index,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })));
      }

      toast({
        title: "AI Generated!",
        description: "Quote details have been generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate quote with AI",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (createdQuoteData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quote Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your quote has been created. You can now export it in your preferred format.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={() => exportToPDF(createdQuoteData, `quote-${createdQuoteData.title.replace(/\s+/g, '-').toLowerCase()}`, 'quote')} className="gap-2">
                <Download className="h-4 w-4" />
                Export as PDF
              </Button>
              <Button onClick={() => exportToCSV([createdQuoteData], `quote-${createdQuoteData.title.replace(/\s+/g, '-').toLowerCase()}`)} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
              <Button onClick={() => exportToJSON(createdQuoteData, `quote-${createdQuoteData.title.replace(/\s+/g, '-').toLowerCase()}`)} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export as JSON
              </Button>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => navigate("/dashboard/quotes")} className="flex-1">
                View All Quotes
              </Button>
              <Button
                onClick={() => {
                  setCreatedQuoteData(null);
                  setClientName("");
                  setClientEmail("");
                  setTitle("");
                  setDescription("");
                  setItems([{ id: 1, description: "", quantity: 1, rate: 0 }]);
                }}
                variant="outline"
              >
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Quote</h2>
          <p className="text-muted-foreground mt-1">
            Create a professional quote for your client
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu open={showConversion} onOpenChange={setShowConversion}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Convert Currency
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {currencies.map((curr) => (
                <DropdownMenuItem
                  key={curr.code}
                  onClick={() => handleConvertCurrency(curr.code)}
                  disabled={curr.code === currency}
                >
                  {curr.symbol} {curr.code} - {curr.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            onClick={generateWithAI} 
            className="gap-2"
            disabled={aiLoading}
          >
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Service Provider Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-name">Your Business Name</Label>
                  <Input 
                    id="provider-name" 
                    placeholder="Your business name"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-email">Your Business Email</Label>
                  <Input 
                    id="provider-email" 
                    type="email" 
                    placeholder="business@example.com"
                    value={providerEmail}
                    onChange={(e) => setProviderEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider-address">Your Business Address</Label>
                <Textarea
                  id="provider-address"
                  placeholder="Street address, City, State, ZIP"
                  value={providerAddress}
                  onChange={(e) => setProviderAddress(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Client Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input 
                    id="client" 
                    placeholder="Enter client name" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Client Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quote Title</Label>
                <Input 
                  id="title" 
                  placeholder="E.g., Website Development Project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the scope of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Line Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6 space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input 
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs">Rate</Label>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="col-span-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{getCurrencySymbol(currency)}{calculateTotals().subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">{getCurrencySymbol(currency)}{calculateTotals().tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{getCurrencySymbol(currency)}{calculateTotals().total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Creating..." : "Create Quote"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/quotes")}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default NewQuote;
