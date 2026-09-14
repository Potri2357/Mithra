import Link from "next/link";
import Image from "next/image";
import MaterialIcon from "@/components/MaterialIcon";

const modules = [
  { href: "/standards", label: "Standards Catalogue" },
  { href: "/schemes",   label: "Certification Schemes" },
  { href: "/hallmark",  label: "Hallmark & HUID" },
  { href: "/labs",      label: "Testing Labs Directory" },
  { href: "/consumer",  label: "Consumer Grievances" },
  { href: "/chat",      label: "AI Compliance Assistant" },
];

const certRoutes = [
  { href: "/schemes", label: "ISI Mark (Scheme I)" },
  { href: "/schemes", label: "CRS (Scheme II)" },
  { href: "/schemes", label: "FMCS (Foreign Mfr)" },
  { href: "/schemes", label: "MSME Concessions & Fees" },
  { href: "/consumer", label: "Verify CM/L License" },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400">
      <div className="site-container pt-16 pb-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 dark:border-slate-800 p-1 flex items-center justify-center shadow-2xs group-hover:border-blue-300 transition-colors">
                <Image
                  src="/bis_logo.png"
                  alt="Bureau of Indian Standards"
                  width={34}
                  height={34}
                  className="object-contain h-7 w-auto"
                />
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#0052CC] transition-colors">
                  Mithra
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Bureau of Indian Standards
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Official conversational standards intelligence platform for 22,000+ Indian Standards,
              Quality Control Orders (QCOs), certification schemes, and accredited laboratories.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <MaterialIcon name="verified" size={13} className="text-[#0052CC]" />
                BIS Act 2016 Grounded
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <MaterialIcon name="library_books" size={13} className="text-[#0052CC]" />
                22,000+ Standards
              </span>
            </div>
          </div>

          {/* Col 2 — Core Portals */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Compliance Portals
            </h4>
            <ul className="space-y-2.5">
              {modules.map((m) => (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[#0052CC] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <MaterialIcon name="chevron_right" size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>{m.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Certification Schemes */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Certification Pathways
            </h4>
            <ul className="space-y-2.5">
              {certRoutes.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[#0052CC] dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <MaterialIcon name="chevron_right" size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>{r.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Consumer Support & Grievances */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-4">
              Consumer Support
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2.5">
                <MaterialIcon name="call" size={16} className="text-[#0052CC] flex-shrink-0" />
                <span>Toll-Free: <strong className="text-slate-900 dark:text-white font-mono">1800-11-4000</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <MaterialIcon name="mail" size={16} className="text-[#0052CC] flex-shrink-0" />
                <a href="mailto:complaints@bis.gov.in" className="hover:text-[#0052CC] hover:underline transition-colors">
                  complaints@bis.gov.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MaterialIcon name="location_on" size={16} className="text-[#0052CC] flex-shrink-0 mt-0.5" />
                <span>Manak Bhavan, 9 B.S. Zafar Marg, New Delhi 110 002</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0052CC] dark:text-blue-400 hover:underline"
                >
                  <span>Official BIS National Portal</span>
                  <MaterialIcon name="open_in_new" size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Bureau of Indian Standards (BIS). Mithra Intelligent Advisory Platform.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/consumer" className="hover:text-[#0052CC] transition-colors">
              Consumer Grievance
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/standards" className="hover:text-[#0052CC] transition-colors">
              Standards Matrix
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/chat" className="hover:text-[#0052CC] transition-colors font-semibold text-[#0052CC] dark:text-blue-400">
              Ask Mithra
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
