import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Sparkles, FileText, Receipt, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Documentation = () => {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about using Quotla
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Your First Quote</h3>
                    <p className="text-muted-foreground">
                      Navigate to the Dashboard and click "Create Quote". Fill in your business details, client information, and add line items for your services or products. You can use AI to automatically generate quote details by describing your project in the notes field.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Creating Your First Invoice</h3>
                    <p className="text-muted-foreground">
                      Go to Dashboard &gt; Invoices &gt; Create Invoice. Add your business and client details, set a due date, and add invoice line items. The system automatically calculates subtotals, taxes, and totals for you.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Generate with AI</h3>
                    <p className="text-muted-foreground">
                      Use the "Generate with AI" button to automatically create invoice or quote line items. Simply describe your project or services in the notes field, and our AI will intelligently generate appropriate line items with estimated pricing based on your description.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Currency Detection</h3>
                    <p className="text-muted-foreground">
                      The AI can detect currency mentions in your descriptions and automatically set the appropriate currency for your quote or invoice. Mention currencies like "USD", "NGN", "EUR", or "GBP" in your description.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Exporting Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Export Formats</h3>
                    <p className="text-muted-foreground mb-2">
                      After creating a quote or invoice, you can export it in multiple formats:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li><strong>PDF</strong> - Professional formatted documents ready to send to clients</li>
                      <li><strong>CSV</strong> - Spreadsheet format for importing into accounting software</li>
                      <li><strong>JSON</strong> - Raw data format for integration with other systems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Currency Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Currency Support</h3>
                    <p className="text-muted-foreground">
                      Quotla supports major global currencies including USD, EUR, GBP, NGN, and more. Select your currency when creating documents, and use the "Convert Currency" feature to change currencies while preserving relative values.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Account Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Business Profile</h3>
                    <p className="text-muted-foreground">
                      During onboarding, you'll set up your business profile with your business name, email, and address. This information will be automatically populated in your quotes and invoices.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Security & Privacy</h3>
                    <p className="text-muted-foreground">
                      Your data is protected with industry-standard encryption. All documents are stored securely and are only accessible to you. We never share your business or client information with third parties.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center pt-8">
                <p className="text-muted-foreground mb-4">
                  Need more help? Contact our support team.
                </p>
                <Link to="/contact">
                  <Button>Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
