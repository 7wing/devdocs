import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";
import { useAuth } from "@/hooks/AuthProvider";

const Hero = () => {
  const { user } = useAuth();

  const welcomeMessage = user?.displayName
    ? `Welcome, ${user.displayName}`
    : "Document Your Developer Journey";

  const isAuthenticated = !!user;

  const startWritingButton = isAuthenticated ? (
    <Link to="/new-post">
      <Button size="lg" variant="outline" className="gap-2" aria-label="Start Writing a New Post">
        <Code2 className="h-5 w-5" />
        Start Writing
      </Button>
    </Link>
  ) : (
    <Link to="/welcome">
      <Button size="lg" variant="outline" className="gap-2" aria-label="Login or Sign Up">
        <Code2 className="h-5 w-5" />
        Login / Sign Up
      </Button>
    </Link>
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-0" />

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
            <Code2 className="h-4 w-4" />
            <span>{welcomeMessage}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build in Public,
            <br />
            <span className="gradient-text">Share Your Code</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern blogging platform designed for developers to document their projects,
            share insights and grow their technical portfolio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/blog">
              <Button size="lg" className="gap-2 glow-primary" aria-label="Explore Blog Posts">
                Explore Posts
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            {startWritingButton}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
