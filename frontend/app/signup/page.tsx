import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthView } from "@/components/auth/AuthView";

export const metadata: Metadata = {
  title: "Create Account — Mithraa BIS Intelligence",
  description: "Create an account on Mithraa AI platform with Supabase and Google authentication.",
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#181816]">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthView key="signup" initialMode="signup" />
    </Suspense>
  );
}
