"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import type { User, Session, AuthError, AuthChangeEvent } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{
    error: AuthError | Error | null;
    data?: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Error refreshing user:", e);
      setUser(null);
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Initial auth fetch error:", err);
        if (mounted) setIsLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithGoogle = async (redirectToParam?: string) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const targetPath = redirectToParam || "/chat";
      const redirectUri = `${origin}/auth/callback?next=${encodeURIComponent(targetPath)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      console.error("Google sign in error:", err);
      return { error: err as Error };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || "",
            name: fullName?.trim() || "",
          },
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }
      return { error: null, data };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      setSession(null);
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
