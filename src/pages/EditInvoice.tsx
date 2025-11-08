import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { currencies, getCurrencySymbol } from "@/lib/currencyUtils";

const EditInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerEmail, setProviderEmail] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadInvoice();
  }, [id]);

  const checkAuthAndLoadInvoice = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Invoice ID is required",
        variant: "destructive",
      });
      navigate("/dashboard/invoices");
      return;
    }

    await loadInvoice();
  };

  const loadInvoice = async () => {
    try {
      // Load invoice data
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (invoiceError) throw invoiceError;

      if (!invoice) {
        throw new Error("Invoice not found");
      }

      // Load invoice items
      const { data: invoiceItems, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id);

      if (itemsError) throw itemsError;

      // Populate form with existing data
      setClientName(invoice.client_name || "");
      setClientEmail(invoice.client_email || "");
      setProviderName(invoice.provider_name || "");
      setProviderEmail(invoice.provider_email || "");
      setProviderAddress(invoice.provider_address || "");
      setInvoiceNumber(invoice.invoice_number || "");
      setDueDate(invoice.due_date || "");
      setNotes(invoice.notes || "");
      setCategory(invoice.category || "");
      setCurrency(invoice.currency || "USD");
      setStatus(invoice.status || "pending");

      if (invoiceItems && invoiceItems.length > 0) {
        setItems(
          invoiceItems.map((item, index) => ({
            id: Date.now() + index,
            description: item.description || "",
            quantity: item.quantity || 1,
            rate: item.rate || 0,
          }))
        );
      }

      toast({
        title: "Invoice loaded",
        description: "Invoice data loaded successfully",
      });
    } catch (error: any) {
      console.error("Error loading invoice:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load invoice",
        variant: "destructive",
      });
      navigate("/dashboard/invoices");
    } finally {
      setInitialLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (itemId: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== itemId));
    }
  };

  const updateItem = (itemId: number, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { subtotal, tax, total } = calculateTotals();

      // Update invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          client_name: clientName,
          client_email: clientEmail,
          provider_name: providerName,
          provider_email: providerEmail,
          provider_address: providerAddress,
          invoice_number: invoiceNumber,
          due_date: dueDate,
          notes,
          category: category || null,
          currency,
          status,
          subtotal,
          tax,
          total,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (invoiceError) throw invoiceError;

      // Delete existing invoice items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);

      if (deleteError) throw deleteError;

      // Insert updated invoice items
      const itemsToInsert = items.map((item) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast({
        title: "Invoice updated!",
        description: "Your invoice has been updated successfully.",
      });

      navigate("/dashboard/invoices");
    } catch (error: any) {
      console.error("Invoice update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading invoice...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Invoice</h2>
          <p className="text-muted-foreground mt-1">
            Update invoice details and save changes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
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
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  placeholder="INV-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="E.g., Web Development"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or payment terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Line Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="gap-2"
                >
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
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
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
                      onChange={(e) =>
                        updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                      }
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
                <span className="font-medium">
                  {getCurrencySymbol(currency)}
                  {calculateTotals().subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">
                  {getCurrencySymbol(currency)}
                  {calculateTotals().tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>
                  {getCurrencySymbol(currency)}
                  {calculateTotals().total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/invoices")}
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

export default EditInvoice;
