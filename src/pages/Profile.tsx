import { useEffect } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import ProfileHeader from "@/components/ProfileHeader";
import StatsCard from "@/components/StatsCard";
import BlogList from "@/components/BlogList";
import { User } from "../components/types/User";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, logout } = useAuth() as { user: User | null; logout: () => Promise<void> };
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/welcome");
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Button variant="destructive" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <ProfileHeader user={user} />
      <StatsCard user={user} />
      <BlogList authorId={user.uid} />
    </div>
  );
};

export default Profile;
