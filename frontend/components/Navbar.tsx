"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [currentLang, setCurrentLang] = useState<"EN" | "हिं" | "த">("EN");

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

  const cycleLang = () => {
    const order: Array<"EN" | "हिं" | "த"> = ["EN", "हिं", "த"];
    const next = order[(order.indexOf(currentLang) + 1) % order.length];
    setCurrentLang(next);
  };

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navSearchQuery.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(navSearchQuery.trim())}`);
    setSearchOpen(false);
    setNavSearchQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 ${
        scrolled ? "shadow-sm shadow-slate-900/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-9 h-9 rounded-md bg-white border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shadow-2xs group-hover:border-[#005EB8] transition-colors">
            <Image
              src="/bis_logo.png"
              alt="BIS Logo"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-slate-900 dark:text-white font-bold text-base tracking-tight group-hover:text-[#005EB8] dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>Mithra</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Bureau of Indian Standards
            </div>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Nav Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleNavSearch} className="flex items-center gap-1.5 animate-fadeIn">
                <input
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Search standard or HUID..."
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
                aria-label="Search"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Selector */}
          <button
            type="button"
            onClick={cycleLang}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 h-9 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            title="Switch Language"
            aria-label={`Current language: ${currentLang}. Click to cycle.`}
          >
            <span className="font-semibold">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          {/* Clean Enterprise Login Button */}
          <Link href="/chat">
            <Button
              size="sm"
              className="bg-[#005EB8] hover:bg-[#004b94] text-white text-xs font-semibold rounded-md px-4 shadow-xs"
            >
              <span>Login</span>
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="sm:hidden w-9 h-9 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shadow-md animate-fadeIn">
          <div className="py-1 flex items-center justify-between">
            <button
              type="button"
              onClick={cycleLang}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <span>Language: {currentLang}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button size="sm" className="bg-[#024DA1] hover:bg-[#023A79] text-white text-xs font-semibold rounded-full px-4">
                Ask Mithra
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
