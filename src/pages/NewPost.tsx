import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthProvider";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface AuthUser {
  uid: string;
  displayName?: string;
  getIdToken: () => Promise<string>;
}

function isAuthUser(user: unknown): user is AuthUser {
  if (typeof user !== "object" || user === null) return false;
  const authUser = user as { uid?: unknown; getIdToken?: unknown };
  return (
    "uid" in authUser &&
    typeof authUser.uid === "string" &&
    "getIdToken" in authUser &&
    typeof authUser.getIdToken === "function"
  );
}

const NewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user && !("isSimulated" in user && user.isSimulated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !isAuthUser(user)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const newPostPayload = {
      title,
      content,
      tags: tags
        .split(",")
        .map((tag) => {
          const trimmed = tag.trim();
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        })
        .filter((tag) => tag.length > 0),
    };

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPostPayload),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");
        let errorMessage = "Failed to create post on the server.";
        if (isJson) {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || `${response.status} ${response.statusText || errorMessage}`;
        }
        throw new Error(errorMessage);
      }

      const savedPost = await response.json().catch(() => {
        throw new Error("Post created, but server response was invalid.");
      });

      navigate(`/blog/${savedPost.id}`);
    } catch (err) {
      console.error("Post submission error:", err);
      setError(err instanceof Error ? err.message : "An unknown submission error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Write a <span className="gradient-text">New Post</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Share your insights with the world.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border/50"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Optimizing React Performance"
                required
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Comma Separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., React, Performance, JavaScript"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image", "code-block"],
                    ["clean"],
                  ],
                }}
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/30">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full gap-2">
              <Code2 className="h-5 w-5" />
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewPost;
