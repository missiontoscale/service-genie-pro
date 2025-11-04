import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Receipt, Zap, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-business.jpg";
import Footer from "@/components/Footer";

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
          <div className="flex items-center justify-between">
            {/* Left: Logo + Name */}
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                QuoteFlow AI
              </span>
            </Link>

            {/* Center: Main Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
            </nav>

            {/* Right: Dashboard */}
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
          <div className="absolute inset-0 opacity-30">
            <img 
              src={heroImage} 
              alt="Professional business platform" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative container mx-auto px-6 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Professional Quotes & Invoices
                <span className="block text-primary mt-2">Powered by AI</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create stunning quotes and invoices in minutes. Perfect for engineers, 
                designers, consultants, and service providers.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 shadow-lg">
                    <Sparkles className="h-5 w-5" />
                    Start Creating
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Everything You Need</h3>
              <p className="text-muted-foreground text-lg">
                Powerful features designed for modern professionals
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
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust QuoteFlow AI for their business needs
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 shadow-lg">
                <Sparkles className="h-5 w-5" />
                Create Your First Quote
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
