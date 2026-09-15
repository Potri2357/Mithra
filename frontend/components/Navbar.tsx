"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MithraLogo } from "@/components/MithraLogo";
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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const { language, cycleLanguage, langLabel, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = (localStorage.getItem("mithra-theme") || localStorage.getItem("maanak-theme")) as "light" | "dark" | null;
      return saved || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 ${
        scrolled ? "shadow-sm shadow-slate-900/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <MithraLogo size={36} className="shadow-xs group-hover:scale-105 transition-transform" />
          <div className="leading-tight">
            <div className="text-slate-900 dark:text-white font-bold text-base tracking-tight group-hover:text-[#005EB8] dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0052CC] bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("nav.tools")}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Interactive Tools
                </div>
                {toolLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0052CC] dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0052CC] dark:group-hover:text-blue-400 transition-colors">
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
                  className="w-48 sm:w-64 h-9 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md outline-none focus:border-[#005EB8] focus:ring-1 focus:ring-[#005EB8]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center cursor-pointer"
                  title="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
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
            className="inline-flex items-center gap-1 px-2.5 h-9 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
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
            className="w-9 h-9 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={theme === "light" ? t("nav.darkMode") : t("nav.lightMode")}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Clean Enterprise Chat Assistant Button */}
          <Link href="/chat">
            <Button
              size="sm"
              className="bg-[#005EB8] hover:bg-[#004b94] text-white text-xs font-bold rounded-md px-3.5 shadow-xs flex items-center gap-1.5"
            >
              <span>{t("nav.chatAssistant")}</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4 shadow-md animate-fadeIn">
          {/* Portals Section */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
              {t("nav.portals")}
            </div>
            <nav className="flex flex-col gap-0.5">
              {portalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-50/60 dark:hover:bg-blue-950/40"
                >
                  <tool.icon className="w-3.5 h-3.5 text-[#0052CC] dark:text-blue-400 shrink-0" />
                  <span>{tool.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="py-1 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={cycleLanguage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <span>{t("nav.switchLang")}: {langLabel}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button size="sm" className="bg-[#024DA1] hover:bg-[#023A79] text-white text-xs font-semibold rounded-full px-4">
                {t("common.askMithra")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
