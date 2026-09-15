"use client";

import Link from "next/link";
import { MithraLogo } from "@/components/MithraLogo";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  ShieldCheck,
  BookOpen,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const isDark = useDarkMode();

  const portals = [
    { href: "/standards", label: t("nav.standards") },
    { href: "/schemes",   label: t("nav.schemes") },
    { href: "/hallmark",  label: t("nav.hallmark") },
    { href: "/labs",      label: t("nav.labs") },
    { href: "/consumer",  label: t("nav.consumer") },
  ];

  const tools = [
    { href: "/projects", label: `${t("nav.projects")} Workspace` },
    { href: "/tools/cost-estimator", label: t("nav.estimator") },
    { href: "/tools/complaint-drafter", label: t("nav.complaintDrafter") },
    { href: "/tools/whatsapp", label: t("nav.whatsapp") },
    { href: "/chat", label: t("nav.chatAssistant") },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-9">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6">
          {/* Col 1 — Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <MithraLogo size={32} darkMode={isDark} className="shadow-xs group-hover:scale-105 transition-transform" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#005EB8] dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {t("brand.title")}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {t("brand.subtitle")}
                </div>
              </div>
            </Link>

            <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-normal">
              {t("brand.tagline")}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005EB8] dark:text-blue-400" />
                <span>BIS Act 2016</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                <BookOpen className="w-3.5 h-3.5 text-[#005EB8] dark:text-blue-400" />
                <span>22,000+ Standards</span>
              </span>
            </div>
          </div>

          {/* Col 2 — Reference Portals */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider mb-2.5">
              {t("nav.portals")}
            </h4>
            <ul className="space-y-1.5">
              {portals.map((m) => (
                <li key={m.href + m.label}>
                  <Link
                    href={m.href}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#024DA1] dark:hover:text-blue-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>{m.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Interactive Tools */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider mb-2.5 text-[#0052CC] dark:text-blue-400">
              {t("nav.tools")}
            </h4>
            <ul className="space-y-1.5">
              {tools.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-[#024DA1] dark:hover:text-blue-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>{r.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Col 4 — Consumer Support & Grievances */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider mb-2.5">
              {t("footer.consumerSupport")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#024DA1] dark:text-blue-400 shrink-0" />
                <span>{t("footer.tollFree")} <strong className="text-slate-900 dark:text-white font-mono">1800-11-4000</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#024DA1] dark:text-blue-400 shrink-0" />
                <a href="mailto:complaints@bis.gov.in" className="hover:text-[#024DA1] dark:hover:text-blue-400 hover:underline transition-colors truncate">
                  complaints@bis.gov.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#024DA1] dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{t("footer.address")}</span>
              </li>
              <li className="pt-0.5">
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#024DA1] dark:text-blue-400 hover:underline"
                >
                  <span>{t("footer.officialPortal")}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <Link href="/consumer" className="hover:text-[#024DA1] dark:hover:text-blue-400 transition-colors">
              {t("footer.grievance")}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/standards" className="hover:text-[#024DA1] dark:hover:text-blue-400 transition-colors">
              {t("footer.standardsMatrix")}
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/chat" className="hover:text-[#024DA1] dark:hover:text-blue-400 transition-colors font-semibold text-[#024DA1] dark:text-blue-400">
              {t("common.askMithra")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
