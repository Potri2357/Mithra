"use client";

import { useState } from "react";
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
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Portal", icon: Sparkles },
    { href: "/standards", label: "Standards Catalogue", icon: BookOpen },
    { href: "/schemes", label: "Certification Schemes", icon: Award },
    { href: "/hallmark", label: "Hallmark Authenticator", icon: Award },
    { href: "/labs", label: "Testing Labs", icon: FlaskConical },
    { href: "/consumer", label: "Consumer Grievances", icon: ShieldAlert },
    { href: "/chat", label: "AI Saathi", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070D1A]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Logo & National Motto */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
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
              <span className="text-white font-extrabold text-base tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                BIS Saathi
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 hidden sm:inline-block">
                मानकः पथप्रदर्शकः
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-none mt-1">
              Bureau of Indian Standards Advisory
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  isActive ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <Link href="/chat">
            <button className="btn-primary py-2 px-3.5 text-xs rounded-lg" aria-label="Consult AI Assistant">
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Ask Saathi</span>
              <ChevronRight size={13} className="hidden sm:inline" />
            </button>
          </Link>

          <button
            className="btn-icon w-8 h-8 xl:hidden text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B1324] border-b border-slate-800 px-4 py-3 space-y-1 fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? "bg-[#024DA1] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
