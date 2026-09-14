"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Moon, Sun, MessageSquare } from "lucide-react";

const navLinks = [
  { href: "/",         label: "Home" },
  { href: "/standards", label: "Standards" },
  { href: "/schemes",  label: "Certification" },
  { href: "/hallmark", label: "Hallmark" },
  { href: "/labs",     label: "Testing Labs" },
  { href: "/consumer", label: "Consumer" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/97 backdrop-blur-lg shadow-sm border-b border-slate-200/80"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/70"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-6 px-4 sm:px-6 h-14">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs overflow-hidden flex-shrink-0 group-hover:border-blue-300 transition-colors">
            <Image
              src="/bis_logo.png"
              alt="BIS"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-none">
            <div className="text-slate-900 font-extrabold text-[15px] tracking-tight group-hover:text-[#024DA1] transition-colors">
              Mithra
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-px">
              Bureau of Indian Standards
            </div>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden lg:block w-px h-5 bg-slate-200" />

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Language */}
          <button
            onClick={cycleLang}
            className="btn-ghost px-2.5 py-1.5 text-xs font-semibold min-h-0 h-8"
            title="Switch Language"
          >
            <span>{currentLang}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">▾</span>
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="btn-icon w-8 h-8"
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* CTA */}
          <Link href="/chat" className="hidden sm:block">
            <button className="btn-primary min-h-0 h-8 px-4 text-sm rounded-lg gap-1.5">
              <MessageSquare size={13} />
              <span>Ask Mithra</span>
            </button>
          </Link>

          {/* Mobile Menu */}
          <button
            className="btn-icon w-8 h-8 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-0.5 animate-fade-in">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-[#024DA1] font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 pb-1">
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full rounded-lg text-sm"
            >
              <MessageSquare size={14} />
              Ask Mithra
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
