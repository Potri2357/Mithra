"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Moon,
  Sun,
  Sparkles,
  LogOut,
} from "lucide-react";
import { MithraLogo } from "@/components/MithraLogo";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDarkMode } from "@/hooks/useDarkMode";
import { createClient } from "@/utils/supabase/client";

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface AuthViewProps {
  initialMode?: "login" | "signup";
}

export function AuthView({ initialMode = "login" }: AuthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/chat";
  const errorParam = searchParams.get("error");

  const isDark = useDarkMode();
  const toggleDarkMode = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const next = isCurrentlyDark ? "light" : "dark";
    localStorage.setItem("mithraa-theme", next);
    localStorage.setItem("mithra-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };
  const { cycleLanguage, langLabel, t } = useLanguage();
  const {
    user,
    isLoading: authLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const getFriendlyError = (raw: string | null) => {
    if (!raw) return null;
    const decoded = decodeURIComponent(raw);
    if (
      decoded.toLowerCase().includes("provider is not enabled") ||
      decoded.toLowerCase().includes("unsupported provider") ||
      decoded.toLowerCase().includes("validation_failed")
    ) {
      return "Google Sign-In is not enabled in your Supabase project yet. Please enable Google under Authentication > Providers in the Supabase Dashboard.";
    }
    if (decoded === "auth-code-error" || decoded === "no_auth_code") {
      return "Authentication session could not be established. Please try signing in again.";
    }
    return decoded;
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(() => getFriendlyError(errorParam));
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const switchMode = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (newMode === "login") {
      router.replace(`/login${nextUrl !== "/chat" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`, { scroll: false });
    } else if (newMode === "signup") {
      router.replace(`/signup${nextUrl !== "/chat" ? `?next=${encodeURIComponent(nextUrl)}` : ""}`, { scroll: false });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg(null);
      const { error } = await signInWithGoogle(nextUrl);
      if (error) {
        const friendly = getFriendlyError(error.message);
        setErrorMsg(friendly || "Failed to initiate Google sign in. Please verify Google OAuth configuration in Supabase.");
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during Google sign in";
      setErrorMsg(getFriendlyError(message) || message);
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (mode === "forgot") {
      setLoading(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        setSuccessMsg("Password reset link has been dispatched to your email address.");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to send reset link.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please re-enter.");
        return;
      }

      setLoading(true);
      try {
        const { error, data } = await signUpWithEmail(email, password, fullName);
        if (error) throw error;

        // Check if email confirmation is required by Supabase
        if (data?.user && !data.session) {
          setSuccessMsg(
            "Account registered successfully! A confirmation link has been sent to your email. Please verify to activate your account."
          );
        } else {
          setSuccessMsg("Account created successfully! Redirecting...");
          setTimeout(() => {
            router.push(nextUrl);
          }, 800);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Registration failed.";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      setLoading(true);
      try {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        setSuccessMsg("Signed in successfully! Redirecting...");
        setTimeout(() => {
          router.push(nextUrl);
        }, 500);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to sign in. Please verify your credentials.";
        if (message.includes("Invalid login credentials")) {
          setErrorMsg("Invalid email or password. Please try again.");
        } else {
          setErrorMsg(message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] relative overflow-hidden transition-colors selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full ambient-glow-blue blur-3xl opacity-60 dark:opacity-40" />
        <div className="absolute top-1/3 -right-36 w-80 h-80 rounded-full ambient-glow-amber blur-3xl opacity-50 dark:opacity-30" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full ambient-glow-blue blur-3xl opacity-50 dark:opacity-30" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Lockup Center */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <MithraLogo size={32} darkMode={isDark} className="group-hover:scale-105 transition-transform" />
          <div className="leading-tight">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white block">
              {t("brand.title")}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {t("brand.subtitle")}
            </span>
          </div>
        </Link>

        {/* Right Controls: Language & Theme */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleLanguage}
            className="inline-flex items-center gap-1 px-3 h-8.5 rounded-full neu-pill-btn text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-white cursor-pointer"
            title={t("nav.switchLang")}
          >
            <span className="font-bold text-[#005EB8] dark:text-blue-400">{langLabel}</span>
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-8.5 h-8.5 rounded-full neu-pill-btn text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            title={isDark ? t("nav.lightMode") : t("nav.darkMode")}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Auth Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] mx-auto animate-fade-up">
          {/* Card Container */}
          <div className="bg-white/95 dark:bg-[#21201C]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#34332E] shadow-2xl rounded-3xl p-6 sm:p-8 transition-all">
            
            {/* If user is already authenticated */}
            {user && !authLoading ? (
              <div className="text-center py-4 space-y-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mx-auto text-[#005EB8] dark:text-blue-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Already Signed In
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mx-auto">
                    Logged in as <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <Link
                    href={nextUrl}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#024DA1] to-[#005EB8] hover:from-[#003d80] hover:to-[#024DA1] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Compliance Assistant</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full h-10 rounded-xl border border-slate-200 dark:border-[#3D3B35] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2B2A26] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Brand & Title Header */}
                <div className="text-center space-y-2 mb-6">
                  <div className="flex items-center justify-center mb-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-200/70 text-[#0052CC] dark:bg-[#2B2A26] dark:border-[#3D3B35] dark:text-blue-300">
                      <Sparkles className="w-3 h-3 text-[#0052CC] dark:text-blue-400" />
                      <span>Bureau of Indian Standards Intelligence</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {mode === "login"
                      ? t("auth.welcomeBack") || "Welcome Back"
                      : mode === "signup"
                      ? t("auth.createAccount") || "Create Account"
                      : t("auth.resetPassword") || "Reset Password"}
                  </h1>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {mode === "login"
                      ? t("auth.loginSubtitle") || "Sign in to access compliance intelligence, projects & history"
                      : mode === "signup"
                      ? t("auth.signupSubtitle") || "Join Mithraa to query 22,000+ Indian Standards with AI advisory"
                      : "Enter your verified email address to receive password reset instructions"}
                  </p>
                </div>

                {/* Constant Segmented Tab Switcher (Sign In vs Create Account) */}
                {mode !== "forgot" && (
                  <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-slate-100 dark:bg-[#181816] border border-slate-200/80 dark:border-[#34332E]">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        mode === "login"
                          ? "bg-white dark:bg-[#2B2A26] text-[#005EB8] dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{t("auth.signIn") || "Sign In"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        mode === "signup"
                          ? "bg-white dark:bg-[#2B2A26] text-[#005EB8] dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{t("auth.signUp") || "Create Account"}</span>
                    </button>
                  </div>
                )}

                {/* Google Login Button - Constant across both screens */}
                {mode !== "forgot" && (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading || loading}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-[#3D3B35] bg-white dark:bg-[#2B2A26] hover:bg-slate-50 dark:hover:bg-[#34332E] text-slate-700 dark:text-[#E6E4DD] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      ) : (
                        <GoogleIcon className="w-4.5 h-4.5 shrink-0" />
                      )}
                      <span>
                        {mode === "login"
                          ? t("auth.continueWithGoogle") || "Continue with Google"
                          : t("auth.signUpWithGoogle") || "Sign up with Google"}
                      </span>
                    </button>

                    {/* Divider with subtle line */}
                    <div className="relative flex py-4 items-center">
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                      <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {t("auth.orEmail") || "or continue with email"}
                      </span>
                      <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
                    </div>
                  </>
                )}

                {/* Error Banner */}
                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <span className="flex-1 leading-relaxed">{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="flex-1 leading-relaxed">{successMsg}</span>
                  </div>
                )}

                {/* Email Password Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                  {/* Full Name (Sign Up only) */}
                  {mode === "signup" && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t("auth.fullName") || "Full Name"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          required
                          className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl bg-slate-50/80 dark:bg-[#181816] border border-slate-200 dark:border-[#3D3B35] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005EB8] dark:focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t("auth.email") || "Email Address"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.gov.in"
                        required
                        autoComplete="email"
                        className="w-full h-10 pl-9 pr-3 text-xs sm:text-sm rounded-xl bg-slate-50/80 dark:bg-[#181816] border border-slate-200 dark:border-[#3D3B35] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005EB8] dark:focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  {mode !== "forgot" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          {t("auth.password") || "Password"}
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => switchMode("forgot")}
                            className="text-[11px] font-semibold text-[#005EB8] dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            {t("auth.forgotPassword") || "Forgot password?"}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete={mode === "login" ? "current-password" : "new-password"}
                          className="w-full h-10 pl-9 pr-10 text-xs sm:text-sm rounded-xl bg-slate-50/80 dark:bg-[#181816] border border-slate-200 dark:border-[#3D3B35] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005EB8] dark:focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password (Sign Up only) */}
                  {mode === "signup" && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {t("auth.confirmPassword") || "Confirm Password"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                          className="w-full h-10 pl-9 pr-10 text-xs sm:text-sm rounded-xl bg-slate-50/80 dark:bg-[#181816] border border-slate-200 dark:border-[#3D3B35] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005EB8] dark:focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#024DA1] to-[#005EB8] hover:from-[#003d80] hover:to-[#024DA1] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>
                          {mode === "login"
                            ? t("auth.signIn") || "Sign In to Mithraa"
                            : mode === "signup"
                            ? t("auth.createAccount") || "Create Account"
                            : t("auth.sendResetLink") || "Send Reset Link"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                  {mode === "login" ? (
                    <div>
                      <span>{t("auth.noAccount") || "Don't have an account?"} </span>
                      <button
                        type="button"
                        onClick={() => switchMode("signup")}
                        className="font-bold text-[#005EB8] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {t("auth.signUp") || "Create an account"}
                      </button>
                    </div>
                  ) : mode === "signup" ? (
                    <div>
                      <span>{t("auth.haveAccount") || "Already have an account?"} </span>
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="font-bold text-[#005EB8] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {t("auth.signIn") || "Sign in here"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="font-bold text-[#005EB8] dark:text-blue-400 hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t("auth.backToSignIn") || "Back to sign in"}</span>
                    </button>
                  )}
                </div>

                {/* Security Tagline */}
                <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Secured by Supabase Authentication • 256-bit encryption</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
        Bureau of Indian Standards AI Advisory Intelligence • Ministry of Consumer Affairs, Food & Public Distribution
      </footer>
    </div>
  );
}
