import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Check, Sparkles, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Up to 10 quotes/invoices per month",
      "Basic AI generation",
      "Email support",
      "Standard templates",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for growing businesses",
    features: [
      "Unlimited quotes/invoices",
      "Advanced AI generation",
      "Priority support",
      "Custom templates",
      "Analytics dashboard",
      "Export to PDF",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "Team collaboration",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-primary">
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
        <section className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that's right for your business. All plans include a 14-day free trial.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`relative ${
                    tier.popular
                      ? "border-primary shadow-[var(--shadow-medium)] scale-105"
                      : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/signup">
                      <Button
                        className="w-full"
                        variant={tier.popular ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
