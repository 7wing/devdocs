import { useEffect, useState } from "react";
import { User } from "./types/User";

const StatsCard = ({ user }: { user: User }) => {
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/posts/author/${user.uid}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setTotalPosts(data.length);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [user.uid]);

  const formatDate = (dateString: string | number | Date) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-lg border p-6 bg-card flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">Your Stats</h2>
        <p className="text-muted-foreground">Total Posts: {totalPosts}</p>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>
          Joined:{" "}
          {user.metadata?.creationTime
            ? formatDate(user.metadata.creationTime)
            : "N/A"}
        </p>
        <p>Last Updated: {formatDate(new Date())}</p>
      </div>
    </div>
  );
};

export default StatsCard;
