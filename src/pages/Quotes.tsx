import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const quotes = [
  {
    id: 1,
    title: "Website Redesign",
    client: "ABC Corp",
    amount: "$5,200",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Mobile App Development",
    client: "XYZ Inc",
    amount: "$12,500",
    status: "accepted",
    date: "2024-01-12",
  },
  {
    id: 3,
    title: "Brand Identity Package",
    client: "StartUp Co",
    amount: "$3,800",
    status: "pending",
    date: "2024-01-10",
  },
  {
    id: 4,
    title: "E-commerce Platform",
    client: "Retail Plus",
    amount: "$18,900",
    status: "rejected",
    date: "2024-01-08",
  },
];

const statusColors = {
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const Quotes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quotes</h2>
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
        {quotes.map((quote) => (
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
                      {quote.client} • {new Date(quote.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{quote.amount}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        statusColors[quote.status as keyof typeof statusColors]
                      } inline-block mt-1`}
                    >
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
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

export default Quotes;
