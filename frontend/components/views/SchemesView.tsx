"use client";

import { useState } from "react";
import MaterialIcon from "@/components/MaterialIcon";

export const SCHEMES = [
  {
    id: "isi",
    name: "ISI Mark Scheme (Product Certification — Scheme I)",
    code: "Scheme I",
    badgeClass: "bg-blue-50 text-[#0052CC] dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60",
    target: "Domestic Manufacturers (India)",
    overview:
      "The classic ISI mark signifies conformity to an Indian Standard (IS). Operates under the BIS (Conformity Assessment) Regulations, 2018. Requires factory inspection, in-house laboratory setup, and periodic surveillance testing.",
    timeline: "30 – 60 Days (Normal) / 30 Days (Simplified)",
    auditRequired: "Mandatory On-Site Factory Audit",
    fees: "Application Fee ₹1,000 + Inspection ₹7,000/day + Minimum Marking Fee",
    eligibleProducts: "Over 22,000 Indian Standards including Cement, Steel, PVC pipes, Packaged Drinking Water, Helmets.",
    checklist: [
      "Factory registration / Manufacturing License",
      "Process flow chart showing in-house quality control (QC)",
      "Calibration certificates of in-house testing equipment",
      "Consent letter from CEO / Authorized signatory",
      "Independent third-party lab test report of samples (Simplified Procedure)",
    ],
  },
  {
    id: "crs",
    name: "Compulsory Registration Scheme (CRS — Scheme II)",
    code: "Scheme II",
    badgeClass: "bg-emerald-50 text-[#059669] dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60",
    target: "IT, Electronics, Solar & Telecom Goods",
    overview:
      "Self-declaration of conformity based on safety testing reports from BIS-recognized laboratories. No initial factory inspection is conducted before granting registration.",
    timeline: "15 – 20 Days",
    auditRequired: "No Factory Audit required before grant",
    fees: "Application Fee ₹1,000 + Processing Fee ₹50,000 per brand",
    eligibleProducts: "LED Lamps, Mobile Phones, Laptops, Solar Inverters, Power Banks, Smart Watches (Over 60 product categories under MeitY).",
    checklist: [
      "Test report issued by BIS-recognized laboratory (under 90 days old)",
      "Trademark / Brand registration certificate or authorization",
      "Affidavit cum undertaking from overseas / domestic manufacturer",
      "Authorized Indian Representative (AIR) details (if foreign)",
    ],
  },
  {
    id: "fmcs",
    name: "Foreign Manufacturers Certification Scheme (FMCS — Scheme I)",
    code: "FMCS",
    badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/60",
    target: "Overseas Production Units outside India",
    overview:
      "Enables overseas manufacturers to use the standard ISI mark on goods imported into the Indian market. Requires nomination of an Authorized Indian Representative (AIR) and on-site audit of the foreign plant by a BIS inspecting officer.",
    timeline: "90 – 180 Days",
    auditRequired: "Mandatory overseas factory audit by BIS Officers",
    fees: "Application Fee $1,000 USD + Inspection charges + Marking Fee in USD",
    eligibleProducts: "All products covered under mandatory Quality Control Orders (QCOs) exported to India.",
    checklist: [
      "Appointment of Authorized Indian Representative (AIR)",
      "Manufacturing & testing equipment inventory list",
      "Proof of overseas manufacturing license / incorporation",
      "Commitment to follow Indian Standards testing protocol",
    ],
  },
  {
    id: "hallmark",
    name: "Hallmarking Scheme (Precious Metals)",
    code: "Hallmarking",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60",
    target: "Jewellers & Retailers across India",
    overview:
      "Mandatory certification for Gold Jewellery and Silver Artefacts under IS 1417 & IS 2112. Requires laser engraving of BIS Logo, Purity mark (e.g. 22K916), and 6-digit alphanumeric HUID at accredited AHCs.",
    timeline: "Instant via Portal (Jeweller Registration)",
    auditRequired: "Audit of Assaying Centres (AHC) only",
    fees: "Zero registration fee for jewellers (one-time portal registration)",
    eligibleProducts: "Gold Jewellery (14K, 18K, 20K, 22K, 23K, 24K) and Silver Artefacts.",
    checklist: [
      "GST registration certificate",
      "Proof of jewellery sales establishment / outlet",
      "Self-declaration of conformity with IS 1417",
    ],
  },
];

interface SchemesViewProps {
  onAskMithra?: (query: string) => void;
}

export function SchemesView({ onAskMithra }: SchemesViewProps) {
  const [activeScheme, setActiveScheme] = useState(SCHEMES[0]);
  const [productType, setProductType] = useState("industrial");
  const [origin, setOrigin] = useState("domestic");
  const [msmeStatus, setMsmeStatus] = useState("msme");

  // Interactive Recommendation Logic
  const getRecommendation = () => {
    if (origin === "foreign") {
      return {
        scheme: "Foreign Manufacturers Certification Scheme (FMCS)",
        description:
          "Because manufacturing is overseas, you must secure an FMCS license before shipping goods to Indian customs. An Authorized Indian Representative (AIR) is mandatory.",
        query: "How do I apply for BIS FMCS foreign manufacturer license?",
      };
    }
    if (productType === "electronics") {
      return {
        scheme: "Compulsory Registration Scheme (CRS — Scheme II)",
        description:
          "Electronic and IT goods are registered under Scheme II. No factory audit is needed; testing is conducted in BIS-recognized labs.",
        query: "What is the CRS registration process for electronic items?",
      };
    }
    if (productType === "jewellery") {
      return {
        scheme: "Hallmarking Scheme (IS 1417)",
        description:
          "Precious gold and silver ornaments must be registered with BIS and laser-etched with 6-digit HUID at an accredited Assaying & Hallmarking Centre.",
        query: "Explain gold hallmark scheme and HUID registration requirements",
      };
    }
    return {
      scheme: "ISI Mark Certification (Scheme I)",
      description:
        "Standard industrial, civil, and consumer items require an ISI Mark licence, which involves factory inspection and sample verification.",
      query: "Step by step process to get ISI mark certification in India",
    };
  };

  const rec = getRecommendation();

  const handleAsk = (query: string) => {
    if (onAskMithra) {
      onAskMithra(query);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Page Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-900/60 text-xs font-bold text-[#059669] dark:text-emerald-400 shadow-2xs">
          <MaterialIcon name="verified" size={15} />
          <span>Licensing &amp; Conformity Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          BIS Certification <span className="text-[#0052CC] dark:text-blue-400">Schemes Navigator</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Compare compliance routes: ISI Mark (Scheme I), Compulsory Registration (CRS), Foreign Manufacturers (FMCS),
          and Hallmarking. Includes checklists, fee structures, and MSME concessions.
        </p>
      </div>

      {/* ── Interactive Scheme Wizard ── */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MaterialIcon name="auto_awesome" size={20} className="text-[#0052CC] dark:text-blue-400" />
              <span>Interactive Scheme Applicability Advisor</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Answer 3 quick questions to identify the exact BIS licensing pathway for your enterprise.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0052CC] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 self-start sm:self-auto">
            Regulatory Guidance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Question 1: Product Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              1. Product category
            </label>
            <select
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] cursor-pointer"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="industrial">General / Industrial / Civil (Cables, Cement, Steel)</option>
              <option value="electronics">Electronics &amp; IT Goods (LED, Mobile, Inverters)</option>
              <option value="jewellery">Precious Metals &amp; Jewellery (Gold / Silver)</option>
              <option value="consumer">Consumer Safety (Helmets, Toys, Cookers)</option>
            </select>
          </div>

          {/* Question 2: Factory Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              2. Manufacturing facility location
            </label>
            <select
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] cursor-pointer"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              <option value="domestic">Domestic Unit Located in India</option>
              <option value="foreign">Overseas / International Unit Outside India</option>
            </select>
          </div>

          {/* Question 3: Enterprise Scale */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              3. Enterprise scale (concessions)
            </label>
            <select
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] cursor-pointer"
              value={msmeStatus}
              onChange={(e) => setMsmeStatus(e.target.value)}
            >
              <option value="msme">Micro / Small Enterprise (Udyam MSME Registered)</option>
              <option value="startup">Recognized DPIIT Start-up</option>
              <option value="large">Medium or Large Scale Industry</option>
            </select>
          </div>
        </div>

        {/* Recommendation Output Card */}
        <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/90 dark:border-blue-900/60 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <MaterialIcon name="check_circle" size={18} className="text-[#059669] dark:text-emerald-400" />
              <span className="text-xs font-bold text-[#0052CC] dark:text-blue-300 uppercase tracking-wide">
                Recommended Compliance Route
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{rec.scheme}</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{rec.description}</p>
            {msmeStatus !== "large" && (
              <div className="text-xs font-semibold text-[#059669] dark:text-emerald-400 pt-1">
                ✓ Eligible for 20% MSME/Start-up fee concession on marking &amp; application fees.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleAsk(rec.query)}
            className="h-11 px-6 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Start Application Guidance</span>
            <MaterialIcon name="arrow_forward" size={16} />
          </button>
        </div>
      </section>

      {/* ── Scheme Tabs & Deep Details ── */}
      <section className="space-y-5">
        {/* Pill Tabs with Better Styling and Proper Padding */}
        <div className="flex flex-wrap gap-2.5">
          {SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => setActiveScheme(scheme)}
              className={`h-10 px-5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScheme.id === scheme.id
                  ? "bg-[#0052CC] text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span>{scheme.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Scheme Breakdown Card with Generous Padding */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${activeScheme.badgeClass}`}>
                  {activeScheme.code}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target: {activeScheme.target}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{activeScheme.name}</h3>
            </div>

            <button
              type="button"
              onClick={() => handleAsk(`How to apply for ${activeScheme.name}`)}
              className="h-10 px-5 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold inline-flex items-center gap-2 shadow-2xs hover:shadow transition-all flex-shrink-0 cursor-pointer"
            >
              <MaterialIcon name="auto_awesome" size={16} />
              <span>Ask Mithra Compliance</span>
            </button>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeScheme.overview}
          </p>

          {/* Metric Boxes with Proper Padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
                <MaterialIcon name="schedule" size={16} className="text-[#0052CC] dark:text-blue-400" />
                <span>Processing Timeline</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{activeScheme.timeline}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
                <MaterialIcon name="factory" size={16} className="text-[#0052CC] dark:text-blue-400" />
                <span>Factory Audit</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{activeScheme.auditRequired}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">
                <MaterialIcon name="payments" size={16} className="text-[#0052CC] dark:text-blue-400" />
                <span>Fee Structure</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white" title={activeScheme.fees}>
                {activeScheme.fees}
              </div>
            </div>
          </div>

          {/* Document Checklist & Eligible Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MaterialIcon name="description" size={17} className="text-[#0052CC]" />
                <span>Mandatory Application Checklist</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {activeScheme.checklist.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <MaterialIcon name="check_circle" size={17} className="text-[#059669] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MaterialIcon name="verified_user" size={17} className="text-[#0052CC]" />
                <span>Key Products Covered</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                {activeScheme.eligibleProducts}
              </p>

              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-1.5">
                <span className="font-bold text-[#0052CC] dark:text-blue-300 block">Government Concessions Notice:</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Under BIS Gazette S.O. 1290, Micro &amp; Small Enterprises (MSEs) and registered Start-ups receive a
                  20% concession on annual minimum marking fees and 50% concession on application audit fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SchemesView;
