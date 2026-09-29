"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MithraLogo } from "@/components/MithraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  Calculator,
  Scale,
  MessageSquare,
  Sparkles,
  FolderKanban,
  User,
  LogOut,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const { language, cycleLanguage, langLabel, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for standalone mode (opened in new tab from chat sidebar)
    if (typeof window !== "undefined" && window.location.search.includes("standalone=1")) {
      setIsStandalone(true);
    }
    const saved = (localStorage.getItem("mithraa-theme") || localStorage.getItem("mithra-theme") || localStorage.getItem("maanak-theme")) as "light" | "dark" | null;
    if (saved && (saved === "light" || saved === "dark")) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);


  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme, mounted]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("mithraa-theme", next);
    localStorage.setItem("mithra-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navSearchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(navSearchQuery.trim())}`);
    setSearchOpen(false);
    setNavSearchQuery("");
  };

  const portalLinks = [
    { href: "/standards", label: t("nav.standards") },
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/labs", label: t("nav.labs") },
    { href: "/hallmark", label: t("nav.hallmark") },
    { href: "/consumer", label: t("nav.consumer") },
  ];

  const toolLinks = [
    { href: "/tools/cost-estimator", label: t("nav.estimator"), icon: Calculator, desc: "Calculate application, audit & MSME marking fees" },
    { href: "/tools/complaint-drafter", label: t("nav.complaintDrafter"), icon: Scale, desc: "Draft legal complaints under BIS Act 2016" },
    { href: "/tools/whatsapp", label: t("nav.whatsapp"), icon: MessageSquare, desc: "Instant compliance assistant on WhatsApp" },
  ];

  if (isStandalone) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/80 dark:bg-[#181816]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 ${
        scrolled ? "shadow-md shadow-black/5 dark:shadow-black/20" : ""
      }`}
      style={{ position: "sticky", top: 0, zIndex: 50 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <MithraLogo size={36} darkMode={theme === "dark"} className="shadow-xs group-hover:scale-105 transition-transform" />
          <div className="leading-tight">
            <div className="text-slate-900 dark:text-white font-bold text-base tracking-tight group-hover:text-[#005EB8] dark:group-hover:text-white transition-colors flex items-center gap-1.5">
              <span>{t("brand.title")}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {t("brand.subtitle")}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {portalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-[#F5F4ED] hover:bg-slate-50 dark:hover:bg-[#2B2A26] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="chip chip-prompt !py-1.5 !px-3 font-bold text-[#0052CC] dark:text-[#E6E4DD] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("nav.tools")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 glass-panel rounded-2xl p-2.5 z-50 animate-fadeIn shadow-2xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Interactive Tools
                </div>
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-50/80 dark:bg-white/10 text-[#0052CC] dark:text-blue-300 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0052CC] dark:group-hover:text-[#F5F4ED] transition-colors">
                        {tool.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {tool.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Projects Link (ChatGPT/Claude Inspired) */}
          <Link
            href="/projects"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-[#F5F4ED] hover:bg-slate-50 dark:hover:bg-[#2B2A26] transition-colors flex items-center gap-1.5"
          >
            <FolderKanban className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("nav.projects")}</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Nav Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleNavSearch} className="flex items-center gap-1.5 animate-fadeIn">
                <input
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder={t("nav.searchPlaceholder")}
                  autoFocus
                  className="w-48 sm:w-64 h-9 px-3.5 text-xs neu-well rounded-full outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full neu-pill-btn text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
                aria-label={t("common.search")}
                title={t("common.search")}
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Selector */}
          <button
            type="button"
            onClick={cycleLanguage}
            className="inline-flex items-center gap-1 px-3 h-9 rounded-full neu-pill-btn text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-white cursor-pointer"
            title={t("nav.switchLang")}
            aria-label={`Current language: ${langLabel}. Click to cycle.`}
          >
            <span className="font-bold text-[#005EB8] dark:text-blue-400">{langLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full neu-pill-btn text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
            title={mounted && theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
            aria-label="Toggle Theme"
            suppressHydrationWarning
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Auth Dropdown or Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-9 h-9 rounded-full neu-pill-btn flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                title={user.user_metadata?.full_name || user.email || "Account"}
                aria-label="Account menu"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-7.5 h-7.5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7.5 h-7.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#005EB8] dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                    {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl p-2 z-50 animate-fadeIn shadow-2xl bg-white/98 dark:bg-[#21201C]/98 border border-slate-200/90 dark:border-[#34332E]"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.user_metadata?.full_name || "Mithraa User"}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/projects"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-amber-500" />
                      <span>My Workspaces</span>
                    </Link>
                    <Link
                      href="/chat"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#005EB8]" />
                      <span>Compliance Chat</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("auth.signOut") || "Sign Out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full neu-pill-btn text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#005EB8] dark:hover:text-white cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#005EB8] dark:text-blue-400" />
              <span>{t("auth.signIn") || "Sign In"}</span>
            </Link>
          )}

          {/* Clean Enterprise Chat Assistant Button */}
          <Link href="/chat">
            <button
              type="button"
              className="neu-pill-btn !bg-gradient-to-r !from-[#024DA1] !to-[#005EB8] !text-white text-xs font-bold px-4 h-9 shadow-md flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
            >
              <span>{t("nav.chatAssistant")}</span>
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative z-50 bg-white/98 dark:bg-[#181816]/98 backdrop-blur-xl border-b border-slate-200/90 dark:border-[#34332E] px-4 py-4 space-y-4 shadow-xl animate-fadeIn max-h-[calc(100dvh-4rem)] overflow-y-auto">
          {/* Portals Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-[#9C9A91] uppercase tracking-wider px-2">
              {t("nav.portals")}
            </div>
            <nav className="flex flex-col gap-0.5">
              {portalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 min-h-[44px] flex items-center rounded-xl text-xs font-semibold text-slate-800 dark:text-[#E6E4DD] hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Tools Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold text-[#0052CC] dark:text-blue-400 uppercase tracking-wider px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{t("nav.tools")}</span>
            </div>
            <nav className="flex flex-col gap-0.5">
              {toolLinks.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-slate-800 dark:text-[#E6E4DD] hover:bg-blue-50/60 dark:hover:bg-[#2B2A26] transition-colors"
                >
                  <tool.icon className="w-4 h-4 text-[#0052CC] dark:text-blue-400 shrink-0" />
                  <span>{tool.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Projects Link Mobile */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              <span>{t("nav.projects")} Workspace</span>
            </Link>
          </div>

          {/* User Auth Section Mobile */}
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#2B2A26] border border-slate-200/60 dark:border-[#3D3B35] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#005EB8] dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 font-bold text-xs text-[#0052CC] dark:text-blue-300 hover:bg-blue-100/70 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{t("auth.signIn") || "Sign In / Register"}</span>
              </Link>
            )}
          </div>

          <div className="py-1 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={cycleLanguage}
              className="inline-flex items-center gap-1 px-3.5 h-10 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-[#E6E4DD] hover:bg-slate-50 dark:hover:bg-[#2B2A26] transition-colors"
            >
              <span>{t("nav.switchLang")}: <strong className="text-[#005EB8] dark:text-blue-400">{langLabel}</strong></span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button size="sm" className="bg-[#005EB8] hover:bg-[#004b94] text-white text-xs font-bold rounded-xl h-10 px-4 shadow-xs">
                {t("common.askMithra")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
