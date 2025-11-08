import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, MoreVertical, Pencil, Download, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToJSON, exportToCSV, exportToPDF } from "@/lib/exportUtils";

const statusColors = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const Invoices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchInvoices();
  }, []);

  const checkAuthAndFetchInvoices = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    
    fetchInvoices();
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      fetchInvoices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/invoices/edit/${id}`);
  };

  const handleExport = (invoice: any, format: 'json' | 'csv' | 'pdf') => {
    const fileName = `invoice-${invoice.invoice_number.replace(/\s+/g, '-').toLowerCase()}`;
    
    switch (format) {
      case 'json':
        exportToJSON(invoice, fileName);
        break;
      case 'csv':
        exportToCSV([invoice], fileName);
        break;
      case 'pdf':
        exportToPDF(invoice, fileName, 'invoice');
        break;
    }
    
    toast({
      title: "Success",
      description: `Invoice exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight">Invoices</h2>
          <p className="text-muted-foreground mt-1">
            Track payments and manage billing
          </p>
        </div>
        <Link to="/dashboard/invoices/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading invoices...
            </CardContent>
          </Card>
        ) : invoices.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No invoices found. Create your first invoice to get started!
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {invoice.client_name} • Issued {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                      {invoice.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground mt-1 inline-block">
                          {invoice.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${invoice.total?.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            statusColors[invoice.status as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                        {invoice.status !== "paid" && invoice.due_date && (
                          <span className="text-xs text-muted-foreground">
                            Due {new Date(invoice.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-background">
                        <DropdownMenuItem onClick={() => handleEdit(invoice.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="bg-background">
                            <DropdownMenuItem onClick={() => handleExport(invoice, 'json')}>
                              JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport(invoice, 'csv')}>
                              CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport(invoice, 'pdf')}>
                              PDF
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(invoice.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Invoices;
