import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-playfair font-bold text-lg">Quotla</span>
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact & Support</h1>
              <p className="text-xl text-muted-foreground">
                We're here to help you succeed with Quotla
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <a href="mailto:chibuzordev@gmail.com" className="text-primary hover:underline font-medium">
                    chibuzordev@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Reach us by phone during business hours.
                  </p>
                  <a href="tel:+2347032589067" className="text-primary hover:underline font-medium">
                    +234 703258 9067
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">
                    Chat with our support team in real-time.
                  </p>
                  <button className="text-primary hover:underline font-medium">
                    Start Chat
                  </button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">How do I get started with Quotla?</h3>
                  <p className="text-muted-foreground">
                    Simply sign up for a free account, complete the onboarding process to set up your business profile, and start creating professional quotes and invoices immediately.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards, debit cards, and popular payment methods. Billing is secure and encrypted.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I export my quotes and invoices?</h3>
                  <p className="text-muted-foreground">
                    Yes! You can export your documents as PDF for professional delivery, CSV for accounting software, or JSON for system integration.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How does the AI generation work?</h3>
                  <p className="text-muted-foreground">
                    Simply describe your project or service in the notes field, and our AI will automatically generate appropriate line items with estimated pricing based on your description and context.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is my data secure?</h3>
                  <p className="text-muted-foreground">
                    Absolutely. We use industry-standard encryption to protect your data. All documents are stored securely and are only accessible to you. See our Privacy Policy for more details.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time from your account settings. Your data will remain accessible during your billing period.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-4">
                Check out our comprehensive documentation for detailed guides and tutorials.
              </p>
              <Link to="/documentation" className="text-primary hover:underline font-medium">
                View Documentation →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
