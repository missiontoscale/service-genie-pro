import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreVertical, Pencil, Download, Trash2 } from "lucide-react";
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
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const Quotes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchQuotes();
  }, []);

  const checkAuthAndFetchQuotes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }
    
    fetchQuotes();
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
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
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      fetchQuotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/quotes/edit/${id}`);
  };

  const handleExport = (quote: any, format: 'json' | 'csv' | 'pdf') => {
    const fileName = `quote-${quote.title.replace(/\s+/g, '-').toLowerCase()}`;
    
    switch (format) {
      case 'json':
        exportToJSON(quote, fileName);
        break;
      case 'csv':
        exportToCSV([quote], fileName);
        break;
      case 'pdf':
        exportToPDF(quote, fileName, 'quote');
        break;
    }
    
    toast({
      title: "Success",
      description: `Quote exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-heading tracking-tight">Quotes</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all your quotes
          </p>
        </div>
        <Link to="/dashboard/quotes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Quote
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Loading quotes...
            </CardContent>
          </Card>
        ) : quotes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No quotes found. Create your first quote to get started!
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{quote.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {quote.client_name} • {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                      {quote.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground mt-1 inline-block">
                          {quote.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${quote.total?.toFixed(2)}</p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          statusColors[quote.status as keyof typeof statusColors]
                        } inline-block mt-1`}
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-background">
                        <DropdownMenuItem onClick={() => handleEdit(quote.id)}>
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
                            <DropdownMenuItem onClick={() => handleExport(quote, 'json')}>
                              JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport(quote, 'csv')}>
                              CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport(quote, 'pdf')}>
                              PDF
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(quote.id)}
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

export default Quotes;
