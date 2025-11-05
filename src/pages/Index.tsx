import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Receipt, Zap, CheckCircle2, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Let AI help you create professional quotes and invoices in seconds",
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "Beautiful, customizable templates that adapt to your brand",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create, send, and track documents faster than ever before",
  },
  {
    icon: CheckCircle2,
    title: "Easy Management",
    description: "Keep track of all your quotes and invoices in one place",
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
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                QuoteFlow AI
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-primary">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
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
            <div className="max-w-3xl space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-left">
                Create Professional Quotes & Invoices in Minutes
                <span className="block text-primary mt-2">Powered by AI</span>
              </h1>
              <p className="text-xl text-muted-foreground text-left">
                Streamline your business documentation with intelligent automation. Built for freelancers, consultants, and service providers who value their time.
              </p>
              <div className="flex gap-4">
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
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4 text-left">Everything You Need to Manage Your Business</h2>
              <p className="text-muted-foreground text-lg text-left">
                Powerful features that save you time and help you look professional
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4 text-left">Ready to Transform Your Workflow?</h2>
              <p className="text-muted-foreground text-lg mb-8 text-left">
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
