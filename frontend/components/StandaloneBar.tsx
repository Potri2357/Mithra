"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { MithraLogo } from "@/components/MithraLogo";
import { useLanguage } from "@/context/LanguageContext";

interface StandaloneBarProps {
  /** The translated page title string to display in the header */
  title: string;
  /** Optional subtitle / section name shown in muted text */
  subtitle?: string;
}

/**
 * A slim, minimal top-bar shown when a portal/tool page is opened in standalone
 * mode (i.e. via `?standalone=1`). Replaces the full Navbar with just:
 *   • Logo + page title
 *   • Language switcher
 *   • Dark / Light mode toggle
 */
export default function StandaloneBar({ title, subtitle }: StandaloneBarProps) {
  const { cycleLanguage, langLabel, t } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.location.search.includes("standalone=1")) {
      setIsStandalone(true);
    }
    const saved = (
      localStorage.getItem("mithra-theme") || localStorage.getItem("maanak-theme")
    ) as "light" | "dark" | null;
    if (saved && (saved === "light" || saved === "dark")) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      if (saved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("mithra-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // Only render if we are in standalone mode
  if (!mounted || !isStandalone) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#181816]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#34332E] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 gap-4">
        {/* Left: Logo + Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <MithraLogo size={30} darkMode={theme === "dark"} className="shrink-0" />
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] font-extrabold text-slate-900 dark:text-[#F5F4ED] truncate tracking-tight">
              {title}
            </div>
            {subtitle && (
              <div className="text-[11px] text-slate-500 dark:text-[#9C9A91] font-medium truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Right: Language + Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={cycleLanguage}
            className="inline-flex items-center gap-1 px-2.5 h-8 rounded-md border border-slate-200 dark:border-[#34332E] text-xs font-semibold text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-50 dark:hover:bg-[#2B2A26] transition-colors cursor-pointer"
            title={t("nav.switchLang")}
            aria-label={`Current language: ${langLabel}. Click to cycle.`}
          >
            <span className="font-bold text-[#005EB8] dark:text-[#E6E4DD]">{langLabel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-[#9C9A91]" />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md text-slate-600 dark:text-[#9C9A91] hover:bg-slate-100 dark:hover:bg-[#2B2A26] flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-[#34332E]"
            title={mounted && theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
            aria-label="Toggle Theme"
            suppressHydrationWarning
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
