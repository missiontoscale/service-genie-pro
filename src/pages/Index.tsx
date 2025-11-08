import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Receipt, Zap, CheckCircle2, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Leverage artificial intelligence to auto-generate professional quotes and invoices with intelligent field suggestions, saving hours of manual data entry.",
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "Access a library of beautiful, industry-specific templates that automatically adapt to your brand colors, logo, and business identity.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create complete documents in under 60 seconds. Send via email, download as PDF, or export to CSV with a single click for seamless workflow integration.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Management",
    description: "Organize all your quotes and invoices in one secure dashboard. Filter by client, status, or category to find what you need instantly.",
  },
  {
    icon: Users,
    title: "Client Organization",
    description: "Tag and categorize documents by client or project. Track payment status, due dates, and maintain a complete history of all transactions.",
  },
  {
    icon: Receipt,
    title: "Multi-Currency Support",
    description: "Work with clients worldwide. Support for multiple currencies and automatic calculation of taxes, subtotals, and line items for accurate billing.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-32">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quotla
              </span>
            </Link>
            
            <nav className="flex items-center gap-4 md:gap-8">
              <Link to="/" className="text-xs md:text-sm font-medium text-primary">
                Home
              </Link>
              <Link to="/about" className="text-xs md:text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/blog" className="text-xs md:text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/pricing" className="text-xs md:text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
            </nav>
            
            <Link to="/dashboard">
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Users className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-6 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Create Professional Quotes & Invoices in Minutes
                <span className="block text-primary mt-2">Powered by AI</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your business documentation with intelligent automation. Built for freelancers, consultants, and service providers who value their time.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 shadow-lg">
                    <Sparkles className="h-5 w-5" />
                    Start Creating Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Business</h2>
              <p className="text-muted-foreground text-lg">
                Powerful features that save you time and help you look professional
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group p-6 rounded-xl border border-border bg-card hover:shadow-[var(--shadow-medium)] transition-all"
                  >
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold mb-4">Trusted by Professionals Worldwide</h2>
              <p className="text-muted-foreground text-lg">
                See what our users have to say about Quotla
              </p>
            </div>
            <div className="relative overflow-hidden max-w-4xl mx-auto">
              <div className="flex animate-[slide_30s_linear_infinite] hover:[animation-play-state:paused]">
                <div className="flex gap-6 min-w-full">
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"Quotla has transformed how I handle invoicing. What used to take 30 minutes now takes just 2. The AI suggestions are incredibly accurate!"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">SJ</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Freelance Designer</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"The best investment for my consulting business. Clean interface, powerful features, and the multi-currency support is a game-changer."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">MC</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Michael Chen</p>
                        <p className="text-xs text-muted-foreground">Business Consultant</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"I love how organized everything is. Finding old quotes is instant, and the export options make it easy to share with my accountant."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">EP</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Emily Porter</p>
                        <p className="text-xs text-muted-foreground">Marketing Strategist</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 min-w-full" aria-hidden="true">
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"Quotla has transformed how I handle invoicing. What used to take 30 minutes now takes just 2. The AI suggestions are incredibly accurate!"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">SJ</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Freelance Designer</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"The best investment for my consulting business. Clean interface, powerful features, and the multi-currency support is a game-changer."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">MC</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Michael Chen</p>
                        <p className="text-xs text-muted-foreground">Business Consultant</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-80 p-6 rounded-xl border border-border bg-card">
                    <p className="text-muted-foreground mb-4">"I love how organized everything is. Finding old quotes is instant, and the export options make it easy to share with my accountant."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">EP</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Emily Porter</p>
                        <p className="text-xs text-muted-foreground">Marketing Strategist</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join professionals worldwide who save hours every week with AI-powered business documentation
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 shadow-lg">
                  <Sparkles className="h-5 w-5" />
                  Create Your First Document
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
