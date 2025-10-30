import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const invoices = [
  {
    id: "INV-2024-001",
    client: "Tech Solutions",
    amount: "$3,450",
    status: "due",
    dueDate: "2024-02-01",
    issueDate: "2024-01-15",
  },
  {
    id: "INV-2024-002",
    client: "Design Studio",
    amount: "$8,200",
    status: "paid",
    dueDate: "2024-01-20",
    issueDate: "2024-01-10",
  },
  {
    id: "INV-2024-003",
    client: "Marketing Agency",
    amount: "$5,600",
    status: "overdue",
    dueDate: "2024-01-15",
    issueDate: "2024-01-05",
  },
  {
    id: "INV-2024-004",
    client: "Consulting Group",
    amount: "$12,300",
    status: "paid",
    dueDate: "2024-01-18",
    issueDate: "2024-01-08",
  },
];

const statusColors = {
  paid: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  due: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const Invoices = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
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
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{invoice.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.client} • Issued {new Date(invoice.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{invoice.amount}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          statusColors[invoice.status as keyof typeof statusColors]
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                      {invoice.status !== "paid" && (
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
