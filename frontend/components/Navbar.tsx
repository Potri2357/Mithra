"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  MessageSquare,
  BookOpen,
  Award,
  FlaskConical,
  ShieldAlert,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("maanak-theme") as "light" | "dark" | null;
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
    localStorage.setItem("maanak-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const cycleLang = () => {
    const order: Array<"EN" | "हिं" | "த"> = ["EN", "हिं", "த"];
    const next = order[(order.indexOf(currentLang) + 1) % order.length];
    setCurrentLang(next);
  };

  const navItems = [
    { href: "/", label: "Portal", icon: Sparkles },
    { href: "/standards", label: "Standards Catalogue", icon: BookOpen },
    { href: "/schemes", label: "Certification Schemes", icon: Award },
    { href: "/hallmark", label: "Hallmark Authenticator", icon: Award },
    { href: "/labs", label: "Testing Labs", icon: FlaskConical },
    { href: "/consumer", label: "Consumer Grievances", icon: ShieldAlert },
    { href: "/chat", label: "Guided Chat", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white px-2 py-1 rounded-lg border border-[var(--color-border)] shadow-xs flex items-center justify-center flex-shrink-0">
            <Image
              src="/bis_logo.png"
              alt="Bureau of Indian Standards"
              width={54}
              height={30}
              className="object-contain h-7 w-auto"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-text-primary)] font-extrabold text-base tracking-tight leading-none group-hover:text-[var(--blue-600)] transition-colors">
                Maanak Saathi
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--red-50)] text-[var(--red-700)] border border-[var(--red-200)] hidden sm:inline-block">
                मानक साथी
              </span>
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] font-medium leading-none mt-1">
              Bureau of Indian Standards Intelligence
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                  isActive ? "active font-bold" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Utility Controls & Action Button */}
        <div className="flex items-center gap-2">
          {/* Flag-Free Language Switcher (Section 4) */}
          <button
            onClick={cycleLang}
            className="btn-ghost px-2.5 py-1.5 text-xs font-semibold tracking-wide"
            title="Switch Language (Flag-Free)"
            aria-label={`Current language: ${currentLang}. Click to change.`}
          >
            <span>{currentLang}</span>
            <span className="text-[10px] text-[var(--color-text-muted)]">▾</span>
          </button>

          {/* Theme Toggle (Section 7) */}
          <button
            onClick={toggleTheme}
            className="btn-icon w-9 h-9"
            title={theme === "light" ? "Switch to Institutional Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Chat CTA Button */}
          <Link href="/chat">
            <button className="btn-primary py-2 px-3.5 text-xs rounded-lg" aria-label="Open Guided Chat Assistant">
              <MessageSquare size={15} />
              <span className="hidden sm:inline">Ask Saathi</span>
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="btn-icon w-9 h-9 xl:hidden text-[var(--color-text-primary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-[var(--blue-100)] text-[var(--blue-700)] font-bold"
                    : "text-[var(--color-text-body)] hover:bg-[var(--blue-50)]"
                }`}
              >
                <Icon size={16} className="text-[var(--blue-600)]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
