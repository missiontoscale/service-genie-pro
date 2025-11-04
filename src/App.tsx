import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Quotes from "./pages/Quotes";
import Invoices from "./pages/Invoices";
import NewQuote from "./pages/NewQuote";
import NewInvoice from "./pages/NewInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="quotes/new" element={<NewQuote />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/new" element={<NewInvoice />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
