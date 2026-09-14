import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050912] text-slate-400 text-xs py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 inline-block">
              <Image
                src="/bis_logo.png"
                alt="Bureau of Indian Standards"
                width={48}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-white font-bold text-sm">BIS Saathi</div>
              <div className="text-[11px] text-red-400 font-mono font-medium">मानकः पथप्रदर्शकः</div>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            National Standards Advisory Platform engineered for Smart India Hackathon (SIH 26107).
            Built with strict citation-grounded intelligence over official Bureau of Indian Standards catalogues.
          </p>
        </div>

        {/* Portal Direct Workflows */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Advisory Modules
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/standards" className="hover:text-white transition-colors">
                Standards Catalogue (IS Search)
              </Link>
            </li>
            <li>
              <Link href="/schemes" className="hover:text-white transition-colors">
                Certification Schemes (ISI, CRS, FMCS)
              </Link>
            </li>
            <li>
              <Link href="/hallmark" className="hover:text-white transition-colors">
                Gold Hallmark &amp; HUID Authenticator
              </Link>
            </li>
            <li>
              <Link href="/labs" className="hover:text-white transition-colors">
                NABL &amp; BIS Testing Labs Directory
              </Link>
            </li>
            <li>
              <Link href="/consumer" className="hover:text-white transition-colors">
                Consumer Grievances &amp; Rights
              </Link>
            </li>
          </ul>
        </div>

        {/* Statutory Standards */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Statutory &amp; QCO Orders
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                <span>Central BIS Portal</span>
                <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <a href="https://manakonline.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                <span>Manak Online Services</span>
                <ExternalLink size={10} />
              </a>
            </li>
            <li>
              <span className="text-slate-400 block">Bureau of Indian Standards Act 2016</span>
            </li>
            <li>
              <span className="text-slate-400 block">Quality Control Orders (QCO) Gazette</span>
            </li>
          </ul>
        </div>

        {/* Direct Bureau Helpline */}
        <div>
          <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Bureau Helpdesk
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2 text-white font-semibold">
              <Phone size={14} className="text-red-400 flex-shrink-0" />
              <a href="tel:1800114000" className="hover:text-red-400">
                1800-11-4000 (Toll-Free)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-blue-400 flex-shrink-0" />
              <a href="mailto:info@bis.gov.in" className="hover:text-white">
                info@bis.gov.in
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
        <p>
          © 2026 BIS Saathi • Smart India Hackathon PS 26107 • Bureau of Indian Standards
        </p>
        <p className="text-slate-400">
          Informational guidance only. For formal certification issuance, apply through Manak Online.
        </p>
      </div>
    </footer>
  );
}
