"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Award,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Building2,
  FileText,
  Sparkles,
} from "lucide-react";

const SCHEMES = [
  {
    id: "isi",
    code: "Scheme I",
    name: "ISI Mark Certification",
    tagline: "Product Certification Scheme for Domestic Indian Manufacturers",
    summary:
      "The prestigious ISI Mark certifies that industrial and consumer products conform to relevant Indian Standards (IS). Mandatory for over 900+ notified products under central Quality Control Orders.",
    timeline: "4 to 6 Weeks",
    inspection: "Mandatory factory audit & independent sample testing at recognized labs",
    validity: "1 to 2 Years (Renewable)",
    fees: "Application ₹1,000 + Marking fee (0.5%–1.5% of product turnover)",
    concessions: "50% fee concession for registered MSMEs / 80% for Women Entrepreneurs",
    checklist: [
      "Firm Registration / Incorporation Certificate & GST Certificate",
      "Factory Layout Map & Proof of manufacturing premises",
      "List of complete manufacturing machinery and installed test equipment",
      "In-house test records and Quality Control Personnel qualifications",
      "Raw material test certificates and source supplier details",
      "Udyam Registration Certificate (if claiming MSME concession)",
    ],
    sampleProducts: ["Cement (IS 269)", "Electrical Cables (IS 694)", "Steel Bars (IS 1786)", "Helmets (IS 4151)", "Pressure Cookers (IS 2347)"],
  },
  {
    id: "crs",
    code: "CRS Order",
    name: "Compulsory Registration Scheme (CRS)",
    tagline: "Fast-Track Safety Scheme for Electronics and IT Equipment",
    summary:
      "Administered by BIS on behalf of MeitY. Covers 65+ notified electronic and IT product categories. Unlike Scheme I, CRS does not mandate factory audits; it relies on accredited third-party test reports.",
    timeline: "2 to 4 Weeks",
    inspection: "No factory inspection required; based on independent lab safety test report",
    validity: "2 Years (Renewable)",
    fees: "Government registration fee + Lab test charges",
    concessions: "Self-declaration of conformity with formal R-Number registration mark",
    checklist: [
      "Safety Test Report from BIS-recognized / NABL accredited lab (<90 days old)",
      "Brand authorization letter from trademark owner (if applicable)",
      "Technical specifications, schematic diagrams, and critical component list",
      "Factory business license with authorized signatory affidavit",
      "Undertaking for affixing R-Number and standard mark",
    ],
    sampleProducts: ["LED Lamps & Drivers (IS 16102)", "Mobile Phones & Laptops (IS 13252)", "Power Banks & Adapters", "Smart TVs & Monitors", "CCTV Cameras"],
  },
  {
    id: "fmcs",
    code: "FMCS",
    name: "Foreign Manufacturers Certification",
    tagline: "Certification for Overseas Plants Exporting Products to India",
    summary:
      "Mandatory certification for factories located outside India that produce goods covered under Indian Quality Control Orders. Requires appointing an Authorized Indian Representative (AIR).",
    timeline: "24 to 30 Weeks (due to international inspection scheduling)",
    inspection: "BIS inspecting officers travel to foreign factory for physical plant inspection & sample collection",
    validity: "1 to 2 Years (Renewable)",
    fees: "Application fee + Inspection travel & accommodation costs borne by applicant",
    concessions: "Grants foreign factory the right to affix ISI mark directly on export batches",
    checklist: [
      "Appointment of Authorized Indian Representative (AIR) resident in India",
      "Foreign Factory Registration & National Industrial License",
      "Manufacturing process flow chart and calibration certificates",
      "Letter of Undertaking and Performance Bank Guarantee",
      "Visa facilitation and itinerary approval for BIS technical audit delegation",
    ],
    sampleProducts: ["Imported Steel & Wire Rods", "Foreign Automotive Components", "Imported Cement & Chemicals", "Consumer Electronics"],
  },
  {
    id: "hallmark",
    code: "Hallmarking",
    name: "BIS Gold & Silver Hallmarking",
    tagline: "Mandatory Precious Metals Assaying & HUID Traceability",
    summary:
      "Protects jewellery buyers by authenticating gold purity (14K, 18K, 20K, 22K, 23K, 24K). Jewellers register with BIS and send jewellery to Assaying & Hallmarking Centres (AHC) for laser HUID engraving.",
    timeline: "24 to 48 Hours at recognized AHC",
    inspection: "Assaying & Hallmarking Centre (AHC) performs X-Ray Fluorescence (XRF) & Fire Assay testing",
    validity: "Permanent on marked article",
    fees: "Jeweller registration fee (tiered by turnover, ₹7,500+) + Hallmarking fee (₹45/article)",
    concessions: "One-time jeweller registration valid for 5 years across all branches",
    checklist: [
      "Jeweller Firm Registration & Sales Tax / GST documents",
      "Proof of jewellery retail showroom or manufacturing workshop",
      "Authorized signatory PAN and Aadhaar identity verification",
      "Agreement with BIS-recognized Assaying and Hallmarking Centre (AHC)",
    ],
    sampleProducts: ["22K Gold Jewellery (916)", "18K Diamond Studded Jewellery (750)", "24K Gold Coins (999)", "Silver Artefacts (IS 2112)"],
  },
];

export default function SchemesPage() {
  const [activeScheme, setActiveScheme] = useState(SCHEMES[0]);

  // Interactive Scheme Finder State
  const [productType, setProductType] = useState("electronics");
  const [location, setLocation] = useState("india");
  const [isMsme, setIsMsme] = useState(false);

  // Computed recommendation from wizard
  const recommendedScheme = location === "foreign"
    ? SCHEMES[2] // FMCS
    : productType === "jewellery"
    ? SCHEMES[3] // Hallmarking
    : productType === "electronics"
    ? SCHEMES[1] // CRS
    : SCHEMES[0]; // ISI Mark

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold">
            <Award size={14} />
            <span>Statutory Certification Pathways</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            BIS Certification <span className="text-[#024DA1]">Schemes Navigator</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Understand the statutory certification schemes administered under the BIS Act 2016.
            Check eligibility, fee concessions, inspection rules, and document checklists.
          </p>
        </div>

        {/* ── Interactive "Which Scheme Applies To Me?" Wizard ─────────── */}
        <section className="bis-panel p-6 sm:p-8 bg-[#0B1324] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#EC171F]" />
                <span>Interactive Scheme Applicability Advisor</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Answer 3 quick questions to identify the exact BIS licensing pathway for your business.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-300 self-start sm:self-auto">
              Regulatory Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Question 1: Product Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                1. What is your product category?
              </label>
              <select
                className="input-bis text-sm bg-[#101E38] border-slate-700"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
              >
                <option value="industrial">General / Industrial / Civil (e.g. Cables, Cement, Steel)</option>
                <option value="electronics">Electronics &amp; IT Goods (e.g. LED, Mobile, Laptops)</option>
                <option value="jewellery">Precious Metals &amp; Jewellery (Gold / Silver)</option>
                <option value="consumer">Consumer Safety Products (Helmets, Toys, Cookers)</option>
              </select>
            </div>

            {/* Question 2: Factory Location */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                2. Where is manufacturing facility?
              </label>
              <select
                className="input-bis text-sm bg-[#101E38] border-slate-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="india">Domestic (Within India)</option>
                <option value="foreign">Overseas / International (Outside India)</option>
              </select>
            </div>

            {/* Question 3: Enterprise Scale */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                3. Enterprise Concession Status
              </label>
              <div className="flex items-center h-[46px] px-3 bg-[#101E38] rounded-xl border border-slate-700 gap-2">
                <input
                  type="checkbox"
                  id="msme-check"
                  checked={isMsme}
                  onChange={(e) => setIsMsme(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <label htmlFor="msme-check" className="text-xs text-slate-300 cursor-pointer">
                  Registered MSME / Women Entrepreneur
                </label>
              </div>
            </div>
          </div>

          {/* Wizard Result Card */}
          <div className="p-5 rounded-xl bg-[#101E38] border border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#024DA1] text-white">
                  Recommended: {recommendedScheme.name}
                </span>
                <span className="text-xs text-slate-400">({recommendedScheme.code})</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {recommendedScheme.tagline}
              </p>
              <p className="text-xs text-slate-400">
                Estimated Timeline: <strong className="text-slate-200">{recommendedScheme.timeline}</strong>
                {isMsme && (
                  <span className="text-emerald-400 ml-2">
                    • 50% to 80% Fee Concession Applicable!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveScheme(recommendedScheme)}
                className="btn-primary text-xs py-2 px-4 rounded-lg flex-shrink-0"
              >
                View Scheme Details
              </button>
              <Link
                href={`/chat?q=${encodeURIComponent(`How do I apply for ${recommendedScheme.name} certification for my business?`)}`}
              >
                <button className="btn-ghost text-xs py-2 px-3 rounded-lg flex-shrink-0">
                  Ask AI Saathi
                  <ChevronRight size={13} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Scheme Tab Switcher ────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3" role="tablist">
            {SCHEMES.map((scheme) => {
              const isSelected = activeScheme.id === scheme.id;
              return (
                <button
                  key={scheme.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveScheme(scheme)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                    isSelected
                      ? "bg-[#024DA1] border-blue-500 text-white shadow-md"
                      : "bg-[#0B1324] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {scheme.name}
                </button>
              );
            })}
          </div>

          {/* Detailed Active Scheme Profile */}
          <div className="bis-panel p-6 sm:p-8 bg-[#0B1324] border border-slate-800 space-y-8">
            <div className="space-y-2 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60">
                  {activeScheme.code}
                </span>
                <span className="text-xs text-slate-400">Bureau of Indian Standards Statutory Framework</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeScheme.name}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                {activeScheme.summary}
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#101E38] border border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Clock size={16} />
                  <span className="text-xs font-semibold uppercase">Processing Timeline</span>
                </div>
                <div className="text-base font-bold text-white">{activeScheme.timeline}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#101E38] border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Coins size={16} />
                  <span className="text-xs font-semibold uppercase">Fee Concession</span>
                </div>
                <div className="text-xs font-medium text-slate-200">{activeScheme.concessions}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#101E38] border border-slate-800 sm:col-span-2">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-semibold uppercase">Audit &amp; Testing Protocol</span>
                </div>
                <div className="text-xs font-medium text-slate-200">{activeScheme.inspection}</div>
              </div>
            </div>

            {/* Document Checklist & Sample Products */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Checklist */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText size={18} className="text-[#024DA1]" />
                  <span>Mandatory Document Checklist for Application</span>
                </h3>
                <ul className="space-y-2">
                  {activeScheme.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sample Products */}
              <div className="md:col-span-5 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 size={18} className="text-red-400" />
                  <span>Common Notified Product Categories</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeScheme.sampleProducts.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-[#101E38] border border-slate-700 text-xs text-slate-200 font-medium"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-400 mb-3">
                    Need help drafting application documentation or calculating exact marking fees?
                  </p>
                  <Link
                    href={`/chat?q=${encodeURIComponent(`What is the step-by-step application procedure for ${activeScheme.name}?`)}`}
                  >
                    <button className="btn-primary text-xs py-2 px-4 w-full justify-center">
                      <span>Inquire Step-by-Step Procedure with AI</span>
                      <ArrowRight size={13} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
