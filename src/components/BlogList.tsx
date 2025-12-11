import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
  author: string;
}

const BlogList = ({ authorId }: { authorId: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/author/${authorId}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchPosts();
  }, [authorId]);

  const handleDelete = async (id: string) => {
    try {
      if (!user || !("getIdToken" in user)) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete post");
      }

      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!posts.length) return <div className="text-muted-foreground">No posts yet.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">My Blogs</h2>
      {posts.map(post => (
        <div key={post.id} className="rounded-lg border p-4 bg-card space-y-2">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-sm text-muted-foreground">Created: {post.date}</p>
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Link to={`/blog/${post.id}`}>
              <Button variant="outline" size="sm">View</Button>
            </Link>
            <Link to={`/blog/${post.id}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(post.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
