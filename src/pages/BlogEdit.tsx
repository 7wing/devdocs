import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) return;
      const data: Post = await res.json();
      setPost(data);
      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags.join(", "));
    };
    fetchPost();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      if (!user || !("getIdToken" in user)) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(",").map(t => t.trim()),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update post.");
      }

      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!post) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto space-y-10">
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Edit <span className="gradient-text">Post</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Update your blog content and keep it fresh.
            </p>
          </header>

          <form
            onSubmit={handleSave}
            className="space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border/50"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Comma Separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
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

            <Button type="submit" size="lg" disabled={isSaving} className="w-full gap-2">
              <Code2 className="h-5 w-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BlogEdit;
