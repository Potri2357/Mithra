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
  Building2,
  FileText,
  Sparkles,
} from "lucide-react";

const SCHEMES = [
  {
    id: "isi",
    code: "Scheme I",
    name: "ISI Mark Certification (Product Certification)",
    target: "Domestic Manufacturers (India)",
    tag: "Standard ISI Mark",
    badgeClass: "bg-blue-50 text-[#024DA1] border border-blue-200",
    overview:
      "The flagship conformity assessment scheme enabling manufacturers to imprint the iconic ISI mark on goods complying with designated Indian Standards. Requires preliminary factory audit and third-party laboratory sample testing.",
    timeline: "30 to 90 Days",
    auditRequired: "Yes — Mandatory Factory Physical Audit",
    fees: "Application Fee ₹1,000 + Inspection Fee ₹7,000/man-day + Annual Marking Fee",
    eligibleProducts:
      "Cement (IS 269), Domestic Pressure Cookers (IS 2347), PVC Cables (IS 694), Helmets (IS 4151), Packaged Drinking Water (IS 14543), Steel Rebars (IS 1786).",
    checklist: [
      "Factory registration and MSME/Udyam certificate",
      "List of in-house testing equipment with valid calibration certificates",
      "Manufacturing machinery details and process flow chart",
      "Consent from State Pollution Control Board (if applicable)",
      "Nomination of authorized technical quality personnel",
    ],
  },
  {
    id: "crs",
    code: "Scheme II",
    name: "Compulsory Registration Scheme (CRS)",
    target: "IT, Telecom & Electronics Manufacturers (Global & Domestic)",
    tag: "MeitY / MeitY-BIS",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    overview:
      "A fast-track self-declaration conformity assessment scheme primarily for electronic and IT products covered under the Electronics & IT Goods (Requirements for Compulsory Registration) Order.",
    timeline: "15 to 25 Days (Post Lab Testing)",
    auditRequired: "No — Based solely on test reports from BIS-recognized labs",
    fees: "Application Fee ₹1,000 + Processing Fee + Annual Registration Fee",
    eligibleProducts:
      "Self-ballasted LED Lamps (IS 16102), Laptops, Tablets, Mobile Phones, Solar Inverters (IS 16221), Power Banks, Smart Watches.",
    checklist: [
      "Test report from BIS-recognized testing laboratory (not older than 90 days)",
      "Trademark registration certificate / Authorization letter from brand owner",
      "Undertaking and Affidavit from Authorized Indian Representative (AIR) for foreign brands",
      "Factory business license and manufacturing facility proof",
    ],
  },
  {
    id: "fmcs",
    code: "Scheme I (Foreign)",
    name: "Foreign Manufacturers Certification Scheme (FMCS)",
    target: "Overseas / International Manufacturing Units Exporting to India",
    tag: "Exporting to India",
    badgeClass: "bg-purple-50 text-purple-700 border border-purple-200",
    overview:
      "Empowers overseas manufacturing locations located outside India to use the Standard ISI Mark for products covered under mandatory Quality Control Orders (QCO) before export to the Indian customs border.",
    timeline: "3 to 6 Months",
    auditRequired: "Yes — Physical factory audit by BIS officers abroad",
    fees: "Application Fee $1,000 USD + Audit Travel/Per-Diem + Performance Bank Guarantee ($10,000)",
    eligibleProducts:
      "All products under mandatory QCOs: Steel, Tyres, Chemicals, Toys, Machinery, Electronics.",
    checklist: [
      "Appointment of Authorized Indian Representative (AIR) residing in India",
      "Complete manufacturing and in-house testing capability documentation",
      "Bank Guarantee from Indian scheduled bank",
      "Proof of factory operations and overseas local permits",
    ],
  },
  {
    id: "hallmark",
    code: "Scheme IV",
    name: "Hallmarking Scheme for Gold & Silver",
    target: "Jewellers & Assaying and Hallmarking Centres (AHC)",
    tag: "Mandatory IS 1417",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
    overview:
      "Mandatory authentication scheme for precious metals requiring every hallmarked gold jewellery piece to carry the triangular BIS logo, purity fineness grade, and 6-digit alphanumeric HUID code.",
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

export default function SchemesPage() {
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
        path: "/chat?q=" + encodeURIComponent("How do I apply for BIS FMCS foreign manufacturer license?"),
      };
    }
    if (productType === "electronics") {
      return {
        scheme: "Compulsory Registration Scheme (CRS — Scheme II)",
        description:
          "Electronic and IT goods are registered under Scheme II. No factory audit is needed; testing is conducted in BIS-recognized labs.",
        path: "/chat?q=" + encodeURIComponent("What is the CRS registration process for electronic items?"),
      };
    }
    if (productType === "jewellery") {
      return {
        scheme: "Hallmarking Scheme (IS 1417)",
        description:
          "Precious gold and silver ornaments must be registered with BIS and laser-etched with 6-digit HUID at an accredited Assaying & Hallmarking Centre.",
        path: "/hallmark",
      };
    }
    return {
      scheme: "ISI Mark Certification (Scheme I)",
      description:
        "Standard industrial, civil, and consumer items require an ISI Mark licence, which involves factory inspection and sample verification.",
      path: "/chat?q=" + encodeURIComponent("Step by step process to get ISI mark certification in India"),
    };
  };

  const rec = getRecommendation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#024DA1] border border-blue-200 text-xs font-semibold">
            <Award size={13} />
            <span>Official BIS Licensing &amp; Certification Framework</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            BIS Certification <span className="text-[#024DA1]">Schemes Navigator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Compare compliance routes: ISI Mark (Scheme I), Compulsory Registration (CRS), Foreign Manufacturers (FMCS),
            and Hallmarking. Includes checklists, fee structures, and MSME concessions.
          </p>
        </div>

        {/* ── Interactive Scheme Wizard ── */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={17} className="text-[#024DA1]" />
                <span>Interactive Scheme Applicability Advisor</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Answer 3 quick questions to identify the exact BIS licensing pathway for your enterprise.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-[#024DA1] border border-blue-200 self-start sm:self-auto">
              Regulatory Guidance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Question 1: Product Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. Product category
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. Manufacturing facility location
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="domestic">Domestic Unit Located in India</option>
                <option value="foreign">Overseas / International Unit Outside India</option>
              </select>
            </div>

            {/* Question 3: Enterprise Scale */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                3. Enterprise scale (concessions)
              </label>
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
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
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0E8A5F]" />
                <span className="text-xs font-bold text-[#024DA1] uppercase tracking-wide">
                  Recommended Compliance Route
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{rec.scheme}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{rec.description}</p>
              {msmeStatus !== "large" && (
                <div className="text-[11px] font-semibold text-[#0E8A5F] pt-1">
                  ✓ Eligible for 20% MSME/Start-up fee concession on marking &amp; application fees.
                </div>
              )}
            </div>

            <Link href={rec.path} className="flex-shrink-0">
              <button className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                <span>Start Application Guidance</span>
                <ArrowRight size={13} />
              </button>
            </Link>
          </div>
        </section>

        {/* ── Scheme Tabs & Deep Details ── */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => setActiveScheme(scheme)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeScheme.id === scheme.id
                    ? "bg-[#024DA1] border-[#024DA1] text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                }`}
              >
                <span>{scheme.name}</span>
              </button>
            ))}
          </div>

          {/* Detailed Scheme Breakdown Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${activeScheme.badgeClass}`}>
                    {activeScheme.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Target: {activeScheme.target}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{activeScheme.name}</h3>
              </div>

              <Link
                href={`/chat?q=${encodeURIComponent(`How to apply for ${activeScheme.name}`)}`}
                className="flex-shrink-0"
              >
                <button className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors">
                  <Sparkles size={13} />
                  <span>Consult Assistant</span>
                </button>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeScheme.overview}
            </p>

            {/* Metric Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                  <Clock size={13} className="text-[#024DA1]" />
                  <span>Processing Timeline</span>
                </div>
                <div className="text-sm font-bold text-slate-900">{activeScheme.timeline}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                  <Building2 size={13} className="text-[#024DA1]" />
                  <span>Factory Audit</span>
                </div>
                <div className="text-xs font-bold text-slate-900">{activeScheme.auditRequired}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                  <Coins size={13} className="text-[#024DA1]" />
                  <span>Fee Structure</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate" title={activeScheme.fees}>
                  {activeScheme.fees}
                </div>
              </div>
            </div>

            {/* Document Checklist & Eligible Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} className="text-[#024DA1]" />
                  <span>Mandatory Application Checklist</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {activeScheme.checklist.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#0E8A5F] flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#024DA1]" />
                  <span>Key Products Covered</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  {activeScheme.eligibleProducts}
                </p>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs space-y-1">
                  <span className="font-bold text-[#024DA1] block">Government Concessions Notice:</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Under BIS Gazette S.O. 1290, Micro &amp; Small Enterprises (MSEs) and registered Start-ups receive a
                    20% concession on annual minimum marking fees and 50% concession on application audit fees.
                  </p>
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
