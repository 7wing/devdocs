import { useEffect } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useForceDarkTheme } from "@/hooks/useForceDarkTheme";

const Welcome = () => {
  const { loginWithGoogle, loginWithGithub, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useForceDarkTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center space-y-8">
      <h1 className="text-5xl font-bold gradient-text">Welcome to DevDocs</h1>
      <p className="text-xl text-muted-foreground max-w-lg">
        Document your developer journey, share your code and grow your technical portfolio.
      </p>

      {!user && (
        <div className="flex flex-col space-y-4 max-w-xs w-full">
          <Button onClick={loginWithGoogle} size="lg" className="gap-2">
            Continue with Google
          </Button>

          <Button onClick={loginWithGithub} size="lg" className="gap-2">
            Continue with GitHub
          </Button>
        </div>
      )}

      {user && (
        <p className="text-lg text-primary">
          Logging you in and redirecting to the main page...
        </p>
      )}
    </div>
  );
};

export default Welcome;
