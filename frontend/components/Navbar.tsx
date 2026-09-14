"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/standards", label: "Standards" },
  { href: "/schemes", label: "Certification" },
  { href: "/hallmark", label: "Hallmark & HUID" },
  { href: "/labs", label: "Testing Labs" },
  { href: "/consumer", label: "Consumer Support" },
  { href: "/chat", label: "Resources" },
];

export default function Navbar() {
  const pathname = usePathname();
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
      <div className="site-container flex items-center justify-between h-18">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 dark:border-slate-800 p-1 flex items-center justify-center shadow-2xs group-hover:border-blue-300 transition-colors">
            <Image
              src="/bis_logo.png"
              alt="BIS"
              width={34}
              height={34}
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-slate-900 dark:text-white font-extrabold text-lg tracking-tight group-hover:text-[#0052CC] transition-colors flex items-center gap-1.5">
              <span>Maanak Saathi</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Bureau of Indian Standards
            </div>
          </div>
        </Link>

        {/* Center Nav Pills */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill ${isActive ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nav Search Toggle / Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleNavSearch} className="flex items-center gap-1 animate-fadeIn">
                <input
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Quick search standard or HUID..."
                  autoFocus
                  className="w-48 sm:w-64 h-9 px-3 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full outline-none focus:border-[#0052CC]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center"
                >
                  <MaterialIcon name="close" size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Search"
                title="Search"
              >
                <MaterialIcon name="search" size={19} />
              </button>
            )}
          </div>

          {/* Language Selector Pill */}
          <button
            onClick={cycleLang}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            title="Switch Language"
            aria-label={`Current language: ${currentLang}. Click to cycle.`}
          >
            <span>{currentLang}</span>
            <MaterialIcon name="expand_more" size={16} className="text-slate-400" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            <MaterialIcon name={theme === "light" ? "dark_mode" : "light_mode"} size={18} />
          </button>

          {/* Elite Royal Blue Pill Button (Login / Ask Saathi) */}
          <Link href="/chat">
            <button className="h-9.5 px-6 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1.5 cursor-pointer">
              <span>Login</span>
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden w-9 h-9 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <MaterialIcon name={mobileMenuOpen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/60 text-[#0052CC] dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={cycleLang}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <span>Language: {currentLang}</span>
              <MaterialIcon name="expand_more" size={16} />
            </button>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="h-9 px-5 rounded-full bg-[#0052CC] text-white text-xs font-bold inline-flex items-center"
            >
              Ask Saathi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
