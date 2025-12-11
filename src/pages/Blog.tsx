import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  date: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch posts");
        }
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold">
              Latest <span className="gradient-text">Posts</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore tutorials, insights and project documentation from developers around the world.
            </p>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
