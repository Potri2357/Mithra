import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  MapPin,
  CheckCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] text-[var(--color-text-body)] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/bis_logo.png"
                  alt="Bureau of Indian Standards"
                  width={52}
                  height={32}
                  className="object-contain h-7 w-auto"
                />
              </div>
              <div>
                <span className="font-extrabold text-sm text-[var(--color-text-primary)] block">
                  Mithra
                </span>
                <span className="text-[11px] text-[var(--red-700)] font-semibold">
                  मानकः पथप्रदर्शकः • Bureau of Indian Standards
                </span>
              </div>
            </div>

            <p className="text-[var(--color-text-muted)] leading-relaxed text-xs max-w-sm">
              Official conversational guidance platform for Indian Standards (IS), mandatory certification schemes
              (ISI, CRS, FMCS), gold hallmark verification, and accredited laboratory testing networks across India.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--blue-50)] text-[var(--blue-700)] font-medium text-[11px] border border-[var(--blue-200)]">
                <ShieldCheck size={12} />
                <span>BIS Act, 2016 Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E6F4EA] text-[var(--color-success)] font-medium text-[11px] border border-[#B7E1CD]">
                <CheckCircle size={12} />
                <span>22,000+ Active Standards</span>
              </span>
            </div>
          </div>

          {/* Col 2: Core Digital Modules */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px] mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/standards" className="hover:text-[var(--blue-600)] transition-colors">
                  Standards Directory (IS)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[var(--blue-600)] transition-colors">
                  Certification Schemes Navigator
                </Link>
              </li>
              <li>
                <Link href="/hallmark" className="hover:text-[var(--blue-600)] transition-colors">
                  Hallmark &amp; HUID Authenticator
                </Link>
              </li>
              <li>
                <Link href="/labs" className="hover:text-[var(--blue-600)] transition-colors">
                  Accredited Labs Radar (LRS)
                </Link>
              </li>
              <li>
                <Link href="/consumer" className="hover:text-[var(--blue-600)] transition-colors">
                  Consumer Protection &amp; Grievances
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-[var(--blue-600)] transition-colors">
                  Guided Chat Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Certification Routes */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px] mb-3">
              Certification Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/schemes" className="hover:text-[var(--blue-600)] transition-colors">
                  ISI Mark (Scheme I)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[var(--blue-600)] transition-colors">
                  Compulsory Registration (CRS)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[var(--blue-600)] transition-colors">
                  Foreign Manufacturers (FMCS)
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-[var(--blue-600)] transition-colors">
                  MSME &amp; Start-up Concessions
                </Link>
              </li>
              <li>
                <Link href="/consumer" className="hover:text-[var(--blue-600)] transition-colors">
                  Verify CM/L License Number
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer Redressal & Help */}
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-[11px] mb-3">
              Consumer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-[var(--blue-600)] flex-shrink-0" />
                <span>Helpline: <strong>1800-11-4000</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-[var(--blue-600)] flex-shrink-0" />
                <a href="mailto:complaints@bis.gov.in" className="hover:underline">
                  complaints@bis.gov.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-[var(--blue-600)] flex-shrink-0" />
                <span>Manak Bhavan, 9 B.S. Zafar Marg, New Delhi</span>
              </li>
              <li className="pt-1">
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--blue-600)] font-semibold hover:underline"
                >
                  <span>Official BIS Web Portal</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-text-muted)]">
          <div>
            © {new Date().getFullYear()} Bureau of Indian Standards (BIS). Mithra Intelligent Advisory System.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/consumer" className="hover:underline">
              Statutory Consumer Rights
            </Link>
            <span>•</span>
            <Link href="/standards" className="hover:underline">
              Standardization Matrix
            </Link>
            <span>•</span>
            <span className="font-medium text-[var(--blue-600)]">SIH PS 26107</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
