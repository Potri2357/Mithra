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
    const q = `Tell me full testing requirements and licensing procedure for ${isNumber}`;
    if (onAskMithra) {
      onAskMithra(q);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Page Hero Header */}
      <div className="space-y-2 text-center sm:text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-900/60 text-xs font-bold text-[#0052CC] dark:text-blue-400">
          <MaterialIcon name="library_books" size={15} />
          <span>Official BIS Catalogue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Indian Standards <span className="text-[#0052CC] dark:text-blue-400">(IS) Directory</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Search active Bureau of Indian Standards specifications, governing technical committees,
          and mandatory Quality Control Order (QCO) gazette notifications.
        </p>
      </div>

      {/* Filter Toolbar with Pill Input */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative flex items-center">
            <MaterialIcon name="search" size={18} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0052CC] transition-all"
              placeholder="Search by IS number (e.g. IS 16102), product, or committee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sector Selector */}
          <div className="sm:col-span-3">
            <select
              className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC]"
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
          <div className="sm:col-span-3">
            <select
              className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC]"
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

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
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

      {/* Standards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredStandards.map((item) => (
          <div
            key={item.is_number}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-base font-black text-[#0052CC] dark:text-blue-400 font-mono tracking-tight">
                    {item.is_number}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 ml-1.5 font-mono">
                    :{item.year}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052CC] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
                    {item.scheme}
                  </span>
                  {item.mandatory && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                      QCO Mandatory
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0052CC] transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
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

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">QCO Order: </span>
                {item.qco_order}
              </div>
            </div>

            <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleAsk(item.is_number)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052CC] dark:text-blue-400 hover:underline cursor-pointer"
              >
                <MaterialIcon name="auto_awesome" size={15} />
                <span>Ask Mithra About {item.is_number}</span>
              </button>

              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 transition-colors"
                title="Official BIS Standard Reference"
              >
                <MaterialIcon name="open_in_new" size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
