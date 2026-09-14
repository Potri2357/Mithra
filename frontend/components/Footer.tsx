import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  MapPin,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const modules = [
  { href: "/standards", label: "Standards Directory" },
  { href: "/schemes",   label: "Certification Schemes" },
  { href: "/hallmark",  label: "Hallmark & HUID" },
  { href: "/labs",      label: "Accredited Labs" },
  { href: "/consumer",  label: "Consumer Protection" },
  { href: "/chat",      label: "AI Chat Assistant" },
];

const certRoutes = [
  { href: "/schemes", label: "ISI Mark (Scheme I)" },
  { href: "/schemes", label: "CRS (Scheme II)" },
  { href: "/schemes", label: "FMCS (Foreign Mfr)" },
  { href: "/schemes", label: "MSME Concessions" },
  { href: "/consumer", label: "Verify CM/L License" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-text-body)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl border border-[var(--color-border)] flex items-center justify-center shadow-xs flex-shrink-0">
                <Image
                  src="/bis_logo.png"
                  alt="Bureau of Indian Standards"
                  width={32}
                  height={32}
                  className="object-contain h-7 w-auto"
                />
              </div>
              <div>
                <div className="font-extrabold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--blue-600)] transition-colors">
                  Mithra
                </div>
                <div className="text-[11px] text-[var(--red-700)] font-semibold">
                  Bureau of Indian Standards
                </div>
              </div>
            </Link>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Official conversational intelligence platform for Indian Standards, certification
              schemes, HUID verification, and accredited laboratory networks.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--blue-50)] text-[var(--blue-700)] font-medium text-xs border border-[var(--blue-100)]">
                <ShieldCheck size={12} />
                BIS Act 2016 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-100">
                <CheckCircle size={12} />
                22,000+ Standards
              </span>
            </div>
          </div>

          {/* Col 2 — Core Modules */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-xs uppercase tracking-widest mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5">
              {modules.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--blue-600)] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Certification Routes */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-xs uppercase tracking-widest mb-4">
              Certification Routes
            </h4>
            <ul className="space-y-2.5">
              {certRoutes.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--blue-600)] transition-colors group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] text-xs uppercase tracking-widest mb-4">
              Consumer Support
            </h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[var(--blue-600)] flex-shrink-0" />
                <span>Helpline: <strong className="text-[var(--color-text-primary)]">1800-11-4000</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[var(--blue-600)] flex-shrink-0" />
                <a href="mailto:complaints@bis.gov.in" className="hover:text-[var(--blue-600)] hover:underline transition-colors">
                  complaints@bis.gov.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-[var(--blue-600)] flex-shrink-0 mt-0.5" />
                <span>Manak Bhavan, 9 B.S. Zafar Marg, New Delhi 110 002</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--blue-600)] font-semibold hover:underline"
                >
                  Official BIS Web Portal
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Bureau of Indian Standards (BIS). Mithra Intelligent Advisory System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <Link href="/consumer" className="hover:text-[var(--blue-600)] hover:underline transition-colors">
              Consumer Rights
            </Link>
            <span className="text-[var(--color-border)]">•</span>
            <Link href="/standards" className="hover:text-[var(--blue-600)] hover:underline transition-colors">
              Standards Matrix
            </Link>
            <span className="text-[var(--color-border)]">•</span>
            <span className="font-semibold text-[var(--blue-600)]">SIH PS 26107</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
