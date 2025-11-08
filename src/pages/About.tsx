import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Target, Users, Zap } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-32">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quotla
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-primary">
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

      <main className="flex-1">
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Streamlining Business Documentation with AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Quotla was built to solve a simple problem: creating professional quotes and invoices shouldn't take hours. With our AI-powered platform, you can generate beautiful, accurate business documents in minutes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Mission</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-left">Simplicity First</h3>
                  <p className="text-muted-foreground text-left">
                    We believe powerful tools should be easy to use. Our interface is designed for professionals who value their time.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-left">AI-Powered Efficiency</h3>
                  <p className="text-muted-foreground text-left">
                    Leverage artificial intelligence to automate repetitive tasks and focus on what matters most—growing your business.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-left">Built for Professionals</h3>
                  <p className="text-muted-foreground text-left">
                    From freelancers to enterprises, we understand the needs of modern professionals across all industries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold font-heading">Why Quotla?</h2>
              <p className="text-lg text-muted-foreground">
                In today's fast-paced business environment, time is your most valuable asset. Traditional invoicing and quoting tools are often complex, requiring extensive setup and training. Quotla changes that.
              </p>
              <p className="text-lg text-muted-foreground">
                Our platform combines the power of artificial intelligence with an intuitive interface, allowing you to create professional documents in minutes, not hours. Whether you're a freelance designer, consultant, or running a service-based business, Quotla adapts to your workflow.
              </p>
              <p className="text-lg text-muted-foreground">
                With support for multiple currencies, customizable templates, and seamless export options, we've built a tool that scales with your business—from your first client to your hundredth.
              </p>
              <div className="pt-8">
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
