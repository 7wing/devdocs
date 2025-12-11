import { Link } from "react-router-dom";
import { Code2, User, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const { toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Brand link should go to root (/) */}
          <Link to="/" className="flex items-center gap-2 group">
            <Code2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold">DevDocs</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SunMoon className="h-5 w-5" />
            </Button>

            {/* Profile button */}
            <Link to="/profile">
              <Button variant="default" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                My Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
