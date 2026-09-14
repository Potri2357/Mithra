"use client";

import { useState, useMemo } from "react";
import MaterialIcon from "@/components/MaterialIcon";

// Official Seeded Indian Standards Catalogue
export const STANDARDS_CATALOGUE = [
  {
    is_number: "IS 16102 (Part 1 & 2)",
    title: "Self-Ballasted LED Lamps for General Lighting Services — Safety Requirements",
    committee: "ETD 33 (Lighting)",
    year: "2012",
    scope: "Safety and performance requirements for self-ballasted LED lamps for general lighting services having a rated power up to 60 W.",
    scheme: "CRS (Scheme II)",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "MeitY Compulsory Registration Scheme Order",
  },
  {
    is_number: "IS 694",
    title: "Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables/Cords with Rigid and Flexible Conductor",
    committee: "ETD 9 (Power Cables)",
    year: "2010",
    scope: "Covers single and multi-core PVC insulated cables for electric power and lighting with rated voltages up to and including 1100 V.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "Wires and Cables Quality Control Order 2023",
  },
  {
    is_number: "IS 269",
    title: "Ordinary Portland Cement — Specification",
    committee: "CED 2 (Cement & Concrete)",
    year: "2015",
    scope: "Manufacturing, chemical and physical requirements for 33, 43 and 53 grade Ordinary Portland Cement.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Civil & Construction",
    qco_order: "Cement Quality Control Order (Mandatory)",
  },
  {
    is_number: "IS 2347",
    title: "Domestic Pressure Cookers — Specification",
    committee: "MED 32 (Domestic Appliances)",
    year: "2017",
    scope: "Requirements for design, construction, capacity, and test methods for domestic pressure cookers.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Domestic Pressure Cooker Quality Control Order 2020",
  },
  {
    is_number: "IS 4151",
    title: "Protective Helmets for Two Wheeler Riders — Specification",
    committee: "TED 14 (Helmets)",
    year: "2020",
    scope: "Specifies requirements regarding material, construction, finish, weight and performance tests for motorcycle helmets.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Helmet for Two-Wheeler Riders (Quality Control) Order",
  },
  {
    is_number: "IS 16221 (Part 2)",
    title: "Safety of Power Converters for use in Photovoltaic Power Systems",
    committee: "ETD 28 (Solar Photovoltaic Energy)",
    year: "2015",
    scope: "Specific requirements for grid-connected solar inverters and DC/DC converters in solar installations.",
    scheme: "CRS (Scheme II)",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "MeitY Compulsory Registration Scheme Order",
  },
  {
    is_number: "IS 1417",
    title: "Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking",
    committee: "MTD 10 (Precious Metals)",
    year: "2016",
    scope: "Prescribes purity grades (24K, 22K, 20K, 18K, 14K, 9K) and hallmarking conventions for gold jewellery.",
    scheme: "Hallmarking",
    mandatory: true,
    sector: "Precious Metals & Jewellery",
    qco_order: "Hallmarking of Gold Jewellery Order 2021",
  },
  {
    is_number: "IS 15820",
    title: "General Requirements for Competence of Assaying and Hallmarking Centres",
    committee: "MTD 10 (Precious Metals)",
    year: "2009",
    scope: "Requirements for recognized Assaying & Hallmarking Centres (AHC) testing gold and silver.",
    scheme: "Hallmarking",
    mandatory: true,
    sector: "Precious Metals & Jewellery",
    qco_order: "Central Hallmarking Assaying Regulations",
  },
  {
    is_number: "IS 1786",
    title: "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
    committee: "CED 54 (Concrete Reinforcement)",
    year: "2008",
    scope: "Specifications for Fe 415, Fe 500, Fe 550, and Fe 600 grade TMT steel rebars used in construction.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Civil & Construction",
    qco_order: "Steel and Steel Products Quality Control Order",
  },
  {
    is_number: "IS 14543",
    title: "Packaged Drinking Water (Other Than Packaged Natural Mineral Water) — Specification",
    committee: "FAD 14 (Drinks & Drinking Water)",
    year: "2016",
    scope: "Hygiene, microbiological safety, container guidelines and chemical tolerances for commercial bottled water.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Packaged Drinking Water Quality Control Order 2001",
  },
  {
    is_number: "IS 9873 (Part 1)",
    title: "Safety of Toys — Part 1: Safety Aspects Related to Mechanical and Physical Properties",
    committee: "PCD 12 (Plastics)",
    year: "2019",
    scope: "Safety requirements and test methods for toys intended for use by children in all age groups.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Toys (Quality Control) Order 2020",
  },
  {
    is_number: "IS 15298 (Part 2)",
    title: "Personal Protective Equipment — Part 2: Safety Footwear",
    committee: "CHD 8 (Leather & Footwear)",
    year: "2016",
    scope: "Impact resistance, slip resistance, and protective properties for industrial safety shoes and boots.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Footwear Made from Leather and Other Materials QCO 2023",
  },
];

const SECTORS = [
  "All Sectors",
  "Electronics & Electrical",
  "Civil & Construction",
  "Consumer Safety & PPE",
  "Precious Metals & Jewellery",
];

interface StandardsViewProps {
  onAskMithra?: (query: string) => void;
}

export function StandardsView({ onAskMithra }: StandardsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [schemeFilter, setSchemeFilter] = useState("All Schemes");

  const filteredStandards = useMemo(() => {
    return STANDARDS_CATALOGUE.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.is_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.committee.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector =
        selectedSector === "All Sectors" || item.sector === selectedSector;

      const matchesScheme =
        schemeFilter === "All Schemes" || item.scheme === schemeFilter;

      return matchesSearch && matchesSector && matchesScheme;
    });
  }, [searchTerm, selectedSector, schemeFilter]);

  const handleAsk = (isNumber: string) => {
    const q = `Tell me full testing requirements, applicable standards clauses, and licensing procedure for ${isNumber}`;
    if (onAskMithra) {
      onAskMithra(q);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(q)}`, "_blank");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Page Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-xs font-bold text-[#0052CC] dark:text-blue-400 shadow-2xs">
          <MaterialIcon name="library_books" size={15} />
          <span>Official BIS Catalogue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Indian Standards <span className="text-[#0052CC] dark:text-blue-400">(IS) Directory</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Search active Bureau of Indian Standards specifications, governing technical committees,
          and mandatory Quality Control Order (QCO) gazette notifications.
        </p>
      </div>

      {/* Filter Toolbar with Generous Spacing and Proper Padding */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input with Non-Overlapping Icon */}
          <div className="md:col-span-6 relative flex items-center">
            <svg
              className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 transition-all"
              placeholder="Search by IS number (e.g. IS 16102), keyword, or committee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sector Selector */}
          <div className="md:col-span-3">
            <select
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] transition-all cursor-pointer"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Scheme Selector */}
          <div className="md:col-span-3">
            <select
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] transition-all cursor-pointer"
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
            >
              <option value="All Schemes">All Certification Schemes</option>
              <option value="ISI Mark">ISI Mark (Scheme I)</option>
              <option value="CRS (Scheme II)">CRS (Scheme II)</option>
              <option value="Hallmarking">Hallmarking</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStandards.length}</strong> of {STANDARDS_CATALOGUE.length} standards catalogued
          </span>
          {(searchTerm || selectedSector !== "All Sectors" || schemeFilter !== "All Schemes") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSector("All Sectors");
                setSchemeFilter("All Schemes");
              }}
              className="text-[#0052CC] dark:text-blue-400 hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Standards Grid with Proper Spacing and Redesigned Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {filteredStandards.map((item) => (
          <div
            key={item.is_number}
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group space-y-5"
          >
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#0052CC] dark:text-blue-400 font-mono tracking-tight">
                    {item.is_number}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    :{item.year}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052CC] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                    {item.scheme}
                  </span>
                  {item.mandatory && (
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                      QCO Mandatory
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0052CC] transition-colors">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {item.scope}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="corporate_fare" size={15} className="text-slate-400" />
                  <span>{item.committee}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="event" size={15} className="text-slate-400" />
                  <span>Reaffirmed {item.year}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="font-bold text-slate-900 dark:text-white flex-shrink-0">QCO Order:</span>
                <span className="leading-relaxed">{item.qco_order}</span>
              </div>
            </div>

            {/* Redesigned Button with Better Padding and Aesthetics */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleAsk(item.is_number)}
                className="h-10 px-5 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs hover:shadow cursor-pointer"
              >
                <MaterialIcon name="auto_awesome" size={15} />
                <span>Ask Mithra Compliance AI</span>
              </button>

              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Official BIS Standard Reference"
              >
                <span>BIS Ref</span>
                <MaterialIcon name="open_in_new" size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StandardsView;
