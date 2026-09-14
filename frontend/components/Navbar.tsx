"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/standards", label: "Standards" },
    { href: "/schemes", label: "Certification" },
    { href: "/hallmark", label: "Hallmark & HUID" },
    { href: "/labs", label: "Testing Labs" },
    { href: "/consumer", label: "Consumer Support" },
    { href: "/chat", label: "Resources" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center flex-shrink-0">
            <Image
              src="/bis_logo.png"
              alt="Bureau of Indian Standards"
              width={38}
              height={38}
              className="object-contain h-8 w-auto"
              priority
            />
          </div>
          <div>
            <div className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight leading-none group-hover:text-[#024DA1] transition-colors">
              Mithra
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none mt-1">
              Bureau of Indian Standards
            </div>
          </div>
        </Link>

        {/* Center: Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold px-3.5 py-1.5 transition-all ${
                  isActive
                    ? "bg-blue-50/90 text-[#024DA1] border border-blue-200/90 rounded-full shadow-xs"
                    : "text-slate-600 hover:text-[#024DA1] rounded-full hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Utility Bar: Language, Search, Dark mode, Login */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={cycleLang}
            className="flex items-center gap-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
            title="Switch Language"
          >
            <span>{currentLang}</span>
            <span className="text-[10px] text-slate-400">▾</span>
          </button>

          {/* Search trigger */}
          <Link href="/chat">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Search"
              title="Search standards"
            >
              <Search size={15} />
            </button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Login / Auth Button */}
          <Link href="/chat">
            <button className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-colors hidden sm:inline-flex items-center justify-center">
              Login
            </button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="w-8 h-8 lg:hidden flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-[#024DA1] font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
