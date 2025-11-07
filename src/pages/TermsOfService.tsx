import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const TermsOfService = () => {
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
              <Link to="/pricing" className="text-sm font-medium text-muted-foreground transition-colors">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Terms of Service</h1>
            <p className="text-center text-muted-foreground mb-12">Last updated: January 2025</p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Quotla ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  Quotla provides AI-powered quote and invoice generation services for businesses and professionals. The Service allows users to create, manage, and export professional quotes and invoices with the assistance of artificial intelligence.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">
                  To use certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Violate or infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to the Service or related systems</li>
                  <li>Use the Service to harass, abuse, or harm others</li>
                  <li>Reverse engineer or attempt to extract source code from the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Service and its original content, features, and functionality are owned by Quotla and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of any content you create using the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. AI-Generated Content</h2>
                <p className="text-muted-foreground">
                  While we strive for accuracy, AI-generated content may contain errors or inaccuracies. You are responsible for reviewing and verifying all AI-generated quotes and invoices before sending them to clients. We are not liable for any errors in AI-generated content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Payment and Billing</h2>
                <p className="text-muted-foreground">
                  Some features of the Service require payment. You agree to provide accurate payment information and authorize us to charge the applicable fees. Subscription fees are non-refundable except as required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Data and Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of the Service is subject to our Privacy Policy. We collect and use your data as described in our Privacy Policy to provide and improve the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Service Availability</h2>
                <p className="text-muted-foreground">
                  We strive to maintain continuous Service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of the Service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, Quotla shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Quotla operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-muted-foreground mt-2">
                  Email: chibuzordev@gmail.com<br />
                  Phone: +234 703258 9067
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
