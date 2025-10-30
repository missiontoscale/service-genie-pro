import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NewInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invoice created!",
      description: "Your invoice has been created successfully.",
    });
    navigate("/dashboard/invoices");
  };

  const generateWithAI = () => {
    toast({
      title: "AI Generation",
      description: "AI-powered invoice generation coming soon!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">New Invoice</h2>
          <p className="text-muted-foreground mt-1">
            Create a professional invoice for your client
          </p>
        </div>
        <Button variant="outline" onClick={generateWithAI} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" placeholder="Enter client name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Client Email</Label>
                <Input id="email" type="email" placeholder="client@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" placeholder="INV-2024-" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Payment terms and additional notes..."
                rows={3}
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
                    <Input placeholder="Service or product description" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Quantity</Label>
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-xs">Rate</Label>
                    <Input type="number" min="0" step="0.01" placeholder="0.00" />
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
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Invoice
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

export default NewInvoice;
