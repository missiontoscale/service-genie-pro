import { Link } from "react-router-dom";
import { Sparkles, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PrivacyPolicy = () => {
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

      <main className="flex-1 py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-left">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-left">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Introduction</h2>
              <p className="text-muted-foreground">
                QuoteFlow AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Account information (name, email address, business details)</li>
                <li>Quote and invoice data you create on our platform</li>
                <li>Client information you input for business documentation</li>
                <li>Payment and billing information</li>
                <li>Communications you have with us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Your Rights</h2>
              <p className="text-muted-foreground mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The right to access your personal data</li>
                <li>The right to correct inaccurate data</li>
                <li>The right to delete your data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Third-Party Services</h2>
              <p className="text-muted-foreground">
                We may use third-party services for authentication (such as Google Sign-In), payment processing, and analytics. These services have their own privacy policies governing the use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-left">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@quoteflow.ai
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
