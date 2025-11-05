import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Calendar, User, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const blogPosts = [
  {
    slug: "ai-powered-invoicing",
    title: "Getting Started with AI-Powered Invoicing",
    description: "Learn how to create professional invoices in minutes using AI technology. Discover best practices for leveraging automation while maintaining a personal touch.",
    date: "2024-01-15",
    author: "Sarah Johnson",
    category: "Tutorial",
  },
  {
    slug: "quote-management",
    title: "5 Tips for Better Quote Management",
    description: "Maximize your efficiency with these essential quote management strategies. From templates to tracking, learn how to convert more prospects into clients.",
    date: "2024-01-10",
    author: "Michael Chen",
    category: "Best Practices",
  },
  {
    slug: "future-of-business",
    title: "The Future of Business Documentation",
    description: "How AI is revolutionizing the way we create and manage business documents. Explore trends shaping the future of professional services.",
    date: "2024-01-05",
    author: "Emily Davis",
    category: "Industry Insights",
  },
];

const Blog = () => {
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
        <section className="py-24 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="container mx-auto px-6">
            <div className="mb-16 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Insights & Resources
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn how to streamline your business with tips, tutorials, and industry insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogPosts.map((post) => (
                <Card key={post.title} className="hover:shadow-[var(--shadow-medium)] transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full">
                        Read Article
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

export default Blog;
