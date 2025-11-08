import { Link, useParams } from "react-router-dom";
import { Sparkles, Calendar, User, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import blogAiInvoicing from "@/assets/blog-ai-invoicing.jpg";
import blogQuoteManagement from "@/assets/blog-quote-management.jpg";
import blogFutureBusiness from "@/assets/blog-future-business.jpg";

const blogContent = {
  "ai-powered-invoicing": {
    title: "Getting Started with AI-Powered Invoicing",
    author: "Sarah Johnson",
    date: "2024-01-15",
    category: "Tutorial",
    image: blogAiInvoicing,
    content: [
      {
        heading: "The AI Revolution in Business Documentation",
        text: "Artificial intelligence has fundamentally transformed how modern businesses handle documentation. What once took hours of manual data entry, formatting, and calculation can now be accomplished in minutes with AI-powered tools. This paradigm shift isn't just about speed—it's about accuracy, consistency, and freeing professionals to focus on what truly matters: building relationships and growing their business."
      },
      {
        heading: "Why Traditional Invoicing Falls Short",
        text: "Traditional invoicing methods suffer from several critical inefficiencies. Manual data entry introduces human error, inconsistent formatting damages your professional image, and the time spent on administrative tasks directly reduces billable hours. Research shows that professionals spend an average of 2-3 hours per week just on invoice creation and management. For a solo consultant or small business, that's nearly 150 hours annually—equivalent to nearly a month of productive work lost to paperwork."
      },
      {
        heading: "How AI-Powered Invoicing Works",
        text: "Modern AI invoicing platforms like Quotla leverage natural language processing and machine learning to understand your business context. Simply describe your services, client details, and project scope in plain language, and the AI automatically structures this into professional, formatted invoices. The system learns from your patterns—recognizing your common services, typical rates, and preferred formatting—to make each subsequent invoice faster and more accurate than the last."
      },
      {
        heading: "Key Features That Save Time",
        text: "Smart template selection adapts to your industry and client type. Automatic calculation handles taxes, discounts, and currency conversions flawlessly. Client data remembering means you never enter the same information twice. Multi-currency support allows seamless international billing. Version control and history tracking provide complete audit trails. These features combine to reduce invoice creation time from 20-30 minutes to under 2 minutes per document."
      },
      {
        heading: "Best Practices for AI Invoicing",
        text: "To maximize the benefits of AI-powered invoicing, maintain consistent naming conventions for services and clients. Review AI-generated invoices initially to ensure accuracy as the system learns your preferences. Use descriptive project names that help both you and your clients understand the work. Set up templates for recurring clients to streamline the process further. Keep your service catalog updated so the AI has current information to work with."
      },
      {
        heading: "Getting Started Today",
        text: "The barrier to entry for AI invoicing has never been lower. Most platforms offer free tiers that let you create your first invoices immediately without any financial commitment. Start with a simple project—invoice a recent client using AI assistance. Compare the time and effort to your traditional method. Most users report immediate time savings and never look back. The key is to start small, learn the system, and gradually transition your entire invoicing workflow to AI-powered automation."
      }
    ]
  },
  "quote-management": {
    title: "5 Tips for Better Quote Management",
    author: "Michael Chen",
    date: "2024-01-10",
    category: "Best Practices",
    image: blogQuoteManagement,
    content: [
      {
        heading: "Master Your Quote-to-Close Ratio",
        text: "Your quote-to-close ratio is one of the most critical metrics in service-based businesses. It reveals not just your sales effectiveness, but the quality of your lead qualification and pricing strategy. A healthy ratio sits between 20-40% for most professional services. Track every quote you send and its outcome—won, lost, or pending. Analyze patterns: which services convert best? What price points see the highest acceptance? Which client types are most likely to proceed? This data becomes your strategic advantage, informing everything from marketing focus to pricing adjustments."
      },
      {
        heading: "Speed Matters More Than Perfection",
        text: "In competitive markets, response time can be more crucial than price. Studies show that businesses responding to quote requests within one hour are seven times more likely to qualify leads than those waiting even two hours. This doesn't mean sending rushed, unprofessional quotes. Instead, invest in systems that enable rapid, professional responses. AI-powered tools can generate comprehensive, polished quotes in minutes based on brief project descriptions. Build a library of pre-approved service descriptions and pricing frameworks. The goal is to be the first thorough, professional quote a prospect receives—not the cheapest or most detailed arriving days later."
      },
      {
        heading: "Create Tiered Options, Not Single Quotes",
        text: "Present clients with three pricing tiers: a baseline solution, your recommended approach, and a premium option. This strategy serves multiple purposes. It anchors pricing perception—the middle option often appears most reasonable when contrasted with higher and lower alternatives. It educates clients about value differences rather than just price. It captures clients at different budget levels rather than losing them entirely with a single take-it-or-leave-it price. Most importantly, it positions you as a strategic partner offering solutions, not a commodity provider quoting prices. Even when clients choose the baseline, you've established a relationship and credibility that can grow over time."
      },
      {
        heading: "Build Systematic Follow-Up Processes",
        text: "Most sales are lost not to rejection but to neglect. A quote sent without follow-up is essentially money left on the table. Implement a structured follow-up cadence: send the quote immediately with clear next steps, follow up at 3 days if you haven't heard back with additional value or case studies, check in at 7 days offering to answer questions or adjust the scope, make a final courtesy follow-up at 14 days before archiving as inactive. Use CRM tools or simple spreadsheets to track these touches. Make each follow-up valuable—share relevant case studies, offer to discuss specific aspects in detail, or provide market insights. You're not pestering; you're demonstrating commitment and professionalism."
      },
      {
        heading: "Learn From Lost Opportunities",
        text: "Every declined quote is a learning opportunity worth its weight in gold. When you lose a bid, politely ask for feedback. Frame it as professional development, not sales persistence: 'I'm always working to improve my services and proposals. Would you mind sharing what factor ultimately influenced your decision?' You'll be surprised how many people provide valuable insights. Common themes emerge: pricing concerns, scope misalignment, timing issues, or simply choosing a known provider. This intelligence directly informs your quote strategy—adjusting pricing, clarifying scope presentation, or refining your ideal client profile. The businesses that actively learn from lost quotes systematically improve their win rates over time, turning early setbacks into future competitive advantages."
      }
    ]
  },
  "future-of-business": {
    title: "The Future of Business Documentation",
    author: "Emily Davis",
    date: "2024-01-05",
    category: "Industry Insights",
    image: blogFutureBusiness,
    content: [
      {
        heading: "From Paper to Prediction: The Evolution Continues",
        text: "Business documentation has undergone remarkable transformation over the past three decades. We've progressed from typewritten forms and carbon copies, through the desktop publishing revolution, into the cloud-based collaboration era. Now we stand at the threshold of the next paradigm: predictive, intelligent documentation that doesn't just record business activities but actively facilitates them. AI-powered systems are beginning to anticipate documentation needs, auto-generate accurate records from minimal input, and provide strategic insights from the documents they create. This isn't incremental improvement—it's a fundamental reimagining of what business documentation can be."
      },
      {
        heading: "AI as Your Documentation Partner",
        text: "The next generation of business documentation tools won't just execute commands—they'll understand context, learn preferences, and provide strategic guidance. Imagine describing a project to your AI assistant, which then generates not just an invoice, but suggests optimal pricing based on market rates and your historical data, identifies potential scope creep risks based on similar past projects, drafts contract addendums if the work differs from standard terms, and even predicts payment likelihood based on client patterns. This isn't science fiction—these capabilities are emerging now. The AI becomes a strategic business partner, bringing data-driven insights to every transaction while handling the administrative burden entirely."
      },
      {
        heading: "Blockchain and Immutable Business Records",
        text: "Blockchain technology is poised to revolutionize business documentation verification and trust. Imagine invoices, contracts, and quotes that are cryptographically verifiable, automatically enforceable, and permanently auditable without central authority. Smart contracts could automatically release payments when deliverables are verified, eliminating payment delays and disputes. International transactions could settle instantly without bank intermediaries. Audit trails would be unalterable and transparent. While mainstream adoption is still developing, forward-thinking businesses are already experimenting with blockchain-based documentation systems, particularly in industries where verification and trust are paramount—legal services, supply chain management, and financial services."
      },
      {
        heading: "The Rise of Zero-Input Documentation",
        text: "The ultimate efficiency is documentation that creates itself. Advanced AI systems are approaching this reality by monitoring your work, understanding deliverables, and auto-generating appropriate documentation. Your project management tool communicates with your invoicing system, which knows your rates and client terms. When you mark a project phase complete, an invoice is generated, reviewed by AI for accuracy and completeness, and queued for your approval—all without manual data entry. Calendar integrations track billable time automatically. Email analysis understands client conversations and suggests relevant quote updates. The professional's role shifts from data entry to strategic oversight, approving rather than creating, guiding rather than executing."
      },
      {
        heading: "Regulatory Technology and Compliance Automation",
        text: "As regulations grow more complex globally, manual compliance becomes increasingly risky and resource-intensive. AI-powered documentation systems are evolving to embed regulatory intelligence directly into document creation. Your invoicing tool automatically applies correct tax rates based on client location and service type. It flags potential compliance issues before documents are sent. It maintains audit-ready records automatically. For businesses operating internationally, these systems navigate the labyrinth of varying VAT rules, withholding requirements, and documentation standards without requiring deep expertise from users. Compliance becomes automatic, dramatically reducing risk while freeing professionals to focus on their craft rather than regulatory minutiae."
      },
      {
        heading: "Preparing Your Business for the Future",
        text: "The businesses that will thrive in this new era are those preparing today. Start by adopting cloud-based, AI-enhanced tools now—even if you're not using all features yet. Build clean data practices: consistent naming, proper categorization, complete records. These habits ensure your data becomes more valuable as AI capabilities expand. Invest in understanding your documentation data: what patterns exist, what insights are hiding in your invoice history, what your quote-to-close funnel reveals. Stay informed about emerging technologies—not to adopt everything immediately, but to recognize opportunities when they mature. The future of business documentation is being built now. The question isn't whether these changes will come—it's whether your business will be ready to leverage them when they do."
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
              <span className="text-xl font-bold font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quotla
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
        {/* Hero Banner with Image */}
        <div className="relative h-96 w-full overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <article className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-md">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
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
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.map((section: any, index: number) => (
              <div key={index} className="mb-12">
                <h2 className="text-3xl font-bold mb-4 text-center">{section.heading}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Experience the power of AI-driven business documentation
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Try Quotla Free
              </Button>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
