import { Link, Outlet, useLocation } from "react-router-dom";
import { FileText, Receipt, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
];

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              QuoteFlow AI
            </h1>
          </div>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <nav className="flex gap-2 mb-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card hover:bg-muted text-card-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
