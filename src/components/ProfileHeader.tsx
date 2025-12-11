import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "./types/User";

// Simple regex for email format validation
const isValidEmailFormat = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ProfileHeader = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!isValidEmailFormat(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSaving(true);
    try {
      // PATCH request to backend
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name, email }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update profile.");
      }

      toast.success("Profile updated!");
      setIsDirty(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-lg border p-6 bg-card space-y-4">
      <h2 className="text-xl font-bold">Edit Profile</h2>
      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Name"
        />
        <Input
          type="email" 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsDirty(true);
          }}
          placeholder="Email"
        />
        <Button
          onClick={handleSave}
          disabled={!isDirty || !isValidEmailFormat(email) || isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
