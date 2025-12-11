import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
} from "firebase/auth";

// ---------------------------
// 1. TYPES
// ---------------------------

export type AuthUser = User | null;

interface AuthContextType {
  user: AuthUser;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ---------------------------
// 2. CONTEXT AND HOOK
// ---------------------------

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ---------------------------
// 3. PROVIDER COMPONENT
// ---------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setError(null);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    clearError();
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  };

  const loginWithGithub = async () => {
    clearError();
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (err) {
      console.error("GitHub sign-in failed:", err);
      setError("Failed to sign in with GitHub. Please try again.");
    }
  };

  const logout = async () => {
    clearError();
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loginWithGoogle,
        loginWithGithub,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
