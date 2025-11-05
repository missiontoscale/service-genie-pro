import { Link, useParams } from "react-router-dom";
import { Sparkles, Calendar, User, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const blogContent = {
  "ai-powered-invoicing": {
    title: "Getting Started with AI-Powered Invoicing",
    author: "Sarah Johnson",
    date: "2024-01-15",
    category: "Tutorial",
    content: [
      {
        heading: "Introduction to AI-Powered Invoicing",
        text: "Traditional invoicing can be time-consuming and prone to errors. With QuoteFlow AI, you can leverage artificial intelligence to streamline your entire invoicing workflow. In this comprehensive guide, we'll walk you through everything you need to know to get started."
      },
      {
        heading: "Setting Up Your First Invoice",
        text: "Creating your first invoice with QuoteFlow AI is incredibly simple. Start by navigating to the dashboard and clicking 'New Invoice'. The AI will guide you through the process, automatically formatting your document and suggesting line items based on your business type."
      },
      {
        heading: "Leveraging AI for Accuracy",
        text: "One of the biggest advantages of using AI for invoicing is the reduction in human error. Our system automatically validates currency formats, calculates taxes correctly, and ensures all required fields are completed. This means less time double-checking and more time focusing on your business."
      },
      {
        heading: "Multi-Currency Support",
        text: "Working with international clients? QuoteFlow AI supports multiple currencies including USD, EUR, GBP, NGN, and many African currencies. The system can even help you convert between currencies at current exchange rates, making global business operations seamless."
      },
      {
        heading: "Export and Share",
        text: "Once your invoice is ready, export it in multiple formats including PDF, CSV, DOCX, or JSON. Share directly with clients via email or download for your records. All documents are professionally formatted and ready for immediate use."
      }
    ]
  },
  "quote-management": {
    title: "5 Tips for Better Quote Management",
    author: "Michael Chen",
    date: "2024-01-10",
    category: "Best Practices",
    content: [
      {
        heading: "Why Quote Management Matters",
        text: "Effective quote management is crucial for converting prospects into paying customers. A well-organized quote system helps you respond quickly to opportunities, maintain professional standards, and track your sales pipeline efficiently."
      },
      {
        heading: "Tip 1: Standardize Your Templates",
        text: "Create consistent, professional templates for different service types. QuoteFlow AI allows you to save custom templates that reflect your brand while maintaining flexibility for customization. This ensures every quote looks polished and professional."
      },
      {
        heading: "Tip 2: Track Quote Status",
        text: "Keep tabs on which quotes are pending, accepted, or rejected. Our dashboard provides a clear overview of all your quotes, helping you follow up at the right time and understand your conversion rates."
      },
      {
        heading: "Tip 3: Use Accurate Pricing",
        text: "Leverage the AI to suggest pricing based on industry standards and your historical data. This helps you stay competitive while maintaining healthy profit margins."
      },
      {
        heading: "Tip 4: Respond Quickly",
        text: "Speed matters in business. With QuoteFlow AI, you can generate professional quotes in minutes, not hours. Quick response times can be the difference between winning and losing a deal."
      },
      {
        heading: "Tip 5: Learn from Your Data",
        text: "Analyze your quote acceptance rates and identify patterns. Which services have the highest conversion? What price points work best? Use these insights to refine your strategy over time."
      }
    ]
  },
  "future-of-business": {
    title: "The Future of Business Documentation",
    author: "Emily Davis",
    date: "2024-01-05",
    category: "Industry Insights",
    content: [
      {
        heading: "The Evolution of Business Documents",
        text: "Business documentation has come a long way from handwritten ledgers and typewritten invoices. Today, we're witnessing another revolution driven by artificial intelligence and automation. Let's explore what the future holds."
      },
      {
        heading: "AI as Your Business Assistant",
        text: "Modern AI doesn't just format documents—it understands context, suggests improvements, and learns from your preferences. QuoteFlow AI represents this new generation of intelligent tools that adapt to your unique business needs."
      },
      {
        heading: "Automation Without Losing the Human Touch",
        text: "While automation speeds up processes, maintaining personalization is crucial. The best AI tools enhance human creativity rather than replace it. Our platform automates repetitive tasks while leaving room for your unique voice and branding."
      },
      {
        heading: "Global Business Made Easy",
        text: "As businesses increasingly operate across borders, tools must support multiple currencies, languages, and regulations. AI-powered platforms can automatically adapt to different regional requirements, making international business more accessible."
      },
      {
        heading: "Security and Compliance",
        text: "The future of business documentation includes enhanced security measures and automated compliance checking. AI can help ensure your documents meet regulatory requirements while protecting sensitive client information."
      },
      {
        heading: "What's Next?",
        text: "We're just scratching the surface of what's possible. Future developments may include real-time collaboration, predictive analytics for cash flow, and even deeper integration with other business tools. The goal remains constant: empowering professionals to work smarter, not harder."
      }
    ]
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug as keyof typeof blogContent] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Link to="/blog" className="text-sm font-medium text-primary">
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
        <article className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mb-8">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-left">{section.heading}</h2>
                  <p className="text-muted-foreground leading-relaxed text-left">{section.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <Link to="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Read More Articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
