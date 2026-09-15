"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  FileText,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  PhoneCall,
  Scale,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BIS_BRANCH_MAP: Record<string, { office: string; address: string; email: string; region: string }> = {
  Delhi: { office: "Delhi Branch Office-I", address: "Manak Bhavan, 9 B.S. Zafar Marg, New Delhi 110002", email: "delhibo1@bis.gov.in", region: "Northern Regional Office (NRO)" },
  Maharashtra: { office: "Mumbai Branch Office-I", address: "Manakalaya, E9, MIDC, Andheri East, Mumbai 400093", email: "mumbo1@bis.gov.in", region: "Western Regional Office (WRO)" },
  "Tamil Nadu": { office: "Chennai Branch Office-I", address: "CIT Campus, 4th Cross Road, Taramani, Chennai 600113", email: "cnbo1@bis.gov.in", region: "Southern Regional Office (SRO)" },
  Karnataka: { office: "Bengaluru Branch Office", address: "Peenya Industrial Area, 1st Stage, Bangalore 560058", email: "bnbo@bis.gov.in", region: "Southern Regional Office (SRO)" },
  "West Bengal": { office: "Kolkata Branch Office", address: "1/14 C.I.T. Scheme VII M, VIP Road, Kolkata 700054", email: "kobo@bis.gov.in", region: "Eastern Regional Office (ERO)" },
  Telangana: { office: "Hyderabad Branch Office", address: "F-9, Industrial Estate, Sanathnagar, Hyderabad 500018", email: "hybo@bis.gov.in", region: "Southern Regional Office (SRO)" },
  Gujarat: { office: "Ahmedabad Branch Office", address: "Pushpak, 3rd Floor, Khanpur, Ahmedabad 380001", email: "ahbo@bis.gov.in", region: "Western Regional Office (WRO)" },
  UttarPradesh: { office: "Lucknow Branch Office", address: "Bhavan, Vibhuti Khand, Gomti Nagar, Lucknow 226010", email: "lkbo@bis.gov.in", region: "Central Regional Office (CRO)" },
};

export function ComplaintWizard() {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [violationType, setViolationType] = useState("counterfeit_isi");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorCity, setVendorCity] = useState("Delhi");
  const [state, setState] = useState("Delhi");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [cmlOrHuid, setCmlOrHuid] = useState("");
  const [defectDescription, setDefectDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedOffice = BIS_BRANCH_MAP[state] || BIS_BRANCH_MAP["Delhi"];

  const generatedComplaintLetter = `To,
The Head of Office / Grievance Redressal Officer,
${selectedOffice.office},
Bureau of Indian Standards (${selectedOffice.region}),
${selectedOffice.address}
Email: ${selectedOffice.email}

Date: ${new Date().toLocaleDateString("en-IN")}

SUBJECT: FORMAL GRIEVANCE REGARDING ${violationType.toUpperCase().replace(/_/g, " ")} UNDER THE BUREAU OF INDIAN STANDARDS ACT, 2016

Respected Sir / Madam,

I am formally bringing to your notice a violation of mandatory standard conformity under the provisions of the Bureau of Indian Standards Act, 2016 (BIS Act, 2016).

1. PRODUCT & TRANSACTION DETAILS:
   - Product Name: ${productName || "[Product Name]"}
   - Brand / Make: ${brandName || "[Brand / Make]"}
   - Retailer / Seller: ${vendorName || "[Vendor Details]"}, ${vendorCity}, ${state}
   - Invoice / Receipt No.: ${invoiceNo || "Attached with complaint"}
   - Date of Purchase: ${purchaseDate || "[Date of Purchase]"}
   - License / HUID Marked on Product: ${cmlOrHuid || "Not Provided / Counterfeit"}

2. NATURE OF VIOLATION:
   - Category: ${violationType.replace(/_/g, " ").toUpperCase()}
   - Observed Defects & Non-Conformity: ${defectDescription || "Product failed to meet safety/quality claims under the relevant Indian Standard."}

3. LEGAL PROVISIONS APPLICABLE:
   - Section 14 & 15 of BIS Act, 2016 (Prohibition of unauthorized use of Standard Mark).
   - Section 29 of BIS Act, 2016 (Penalties for manufacture, sale, or trade of non-conforming goods under mandatory Quality Control Orders).

In view of public safety and statutory quality assurance, I request the Bureau to initiate an inspection and necessary enforcement action against the responsible parties.

Yours faithfully,
Complainant Name: [Your Name]
Contact: [Your Mobile Number]
Email: [Your Email]`;

  const copyLetter = () => {
    navigator.clipboard.writeText(generatedComplaintLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/70 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>{t("wizard.title")}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t("consumer.heading")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("wizard.subtitle")}
        </p>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 pt-6">
          {[
            { s: 1, label: t("wizard.step1") },
            { s: 2, label: t("wizard.step2") },
            { s: 3, label: t("wizard.step3") },
            { s: 4, label: t("wizard.step4") },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => setStep(item.s as any)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                step === item.s
                  ? "border-[#0052CC] bg-blue-50/60 dark:bg-blue-950/40 text-[#0052CC] dark:text-blue-300 font-bold"
                  : step > item.s
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-medium"
                  : "border-slate-200/80 dark:border-slate-800 text-slate-400"
              }`}
            >
              <div className="text-[11px] truncate">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Violation Type */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Select the nature of standard or hallmarking violation:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "counterfeit_isi",
                title: "Fake / Unauthorized ISI Mark",
                desc: "Product carries an ISI mark without valid 7/8-digit CM/L license, or on non-notified goods.",
              },
              {
                id: "fraud_huid",
                title: "Fraudulent Gold Hallmark / HUID",
                desc: "Gold jewellery sold without 3 mandatory marks, or with invalid/duplicated 6-digit HUID.",
              },
              {
                id: "defective_quality",
                title: "Substandard Quality of Certified Product",
                desc: "Product bears valid ISI/CRS mark but failed in safety, electrical shock, or performance.",
              },
              {
                id: "mandatory_qco_violation",
                title: "Sale of Non-Certified QCO Item",
                desc: "Seller offering products covered under mandatory QCO (e.g. helmets, toys) without BIS mark.",
              },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setViolationType(v.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  violationType === v.id
                    ? "border-[#0052CC] bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-[#0052CC]"
                    : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-xs text-slate-900 dark:text-white">{v.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{v.desc}</div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>{t("common.next")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Product & Vendor */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Enter Product and Vendor Particulars:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Product Name / Item
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Electric Ceiling Fan, 22K Gold Bangle"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Brand / Make
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. ABC Appliances, Jewel Craft"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Retailer / Shop Name
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. Star Electronics, Local Jeweller"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                State (Jurisdiction)
              </label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setVendorCity(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {Object.keys(BIS_BRANCH_MAP).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Invoice / Cash Memo No.
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="e.g. INV-2026-8942"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("common.back")}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>{t("common.next")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Evidence & Defects */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Provide Violation Evidence & Description:
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                CM/L License Number or 6-Digit HUID (if printed on product)
              </label>
              <input
                type="text"
                value={cmlOrHuid}
                onChange={(e) => setCmlOrHuid(e.target.value.toUpperCase())}
                placeholder="e.g. CM/L-8472910 or HUID: AB8942"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Description of Defect / Non-Conformity
              </label>
              <textarea
                rows={4}
                value={defectDescription}
                onChange={(e) => setDefectDescription(e.target.value)}
                placeholder="Describe what went wrong: e.g., product overheated, plastic melted, lack of test certification, refusal of retailer to honor ISI replacement..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("common.back")}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Generate Formal Draft</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Official Draft & Jurisdiction */}
      {step === 4 && (
        <div className="space-y-5">
          {/* Branch Office Routing Info */}
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-[#0052CC] dark:text-blue-300 uppercase tracking-wider">
                Jurisdictional Enforcement Office
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {selectedOffice.office} ({selectedOffice.region})
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {selectedOffice.address} · <span className="font-mono">{selectedOffice.email}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={copyLetter}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t("common.copied") : t("common.copy")}</span>
              </button>
            </div>
          </div>

          {/* Letter Draft Box */}
          <div className="relative">
            <textarea
              readOnly
              rows={12}
              value={generatedComplaintLetter}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-mono leading-relaxed"
            />
          </div>

          {/* Action portals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white group"
            >
              <span>File on BIS Care Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </a>

            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white group"
            >
              <span>National Consumer Helpline (1915)</span>
              <PhoneCall className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </a>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t("common.back")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintWizard;
