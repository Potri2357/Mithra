"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  BookOpen,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";

// Official Seeded Indian Standards Catalogue
const STANDARDS_CATALOGUE = [
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
    scope: "Requirements for deformed steel bars (TMT rebars) Fe 415, Fe 500, Fe 550, and Fe 600 grades.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Civil & Construction",
    qco_order: "Steel and Steel Products Quality Control Order",
  },
  {
    is_number: "IS 9873 (Part 1)",
    title: "Safety of Toys — Mechanical and Physical Properties",
    committee: "PCD 12 (Child Care Products)",
    year: "2019",
    scope: "Safety requirements and testing methods for toys for children up to 14 years of age.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Toys Quality Control Order 2020",
  },
  {
    is_number: "IS 14543",
    title: "Packaged Drinking Water (Other than Packaged Natural Mineral Water)",
    committee: "FAD 14 (Drinks & Water)",
    year: "2016",
    scope: "Microbiological, chemical, and packaging standards for bottled and packaged drinking water.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Food & Agriculture",
    qco_order: "Packaged Drinking Water Mandatory Order",
  },
];

const SECTORS = [
  "All Sectors",
  "Electronics & Electrical",
  "Civil & Construction",
  "Consumer Safety & PPE",
  "Precious Metals & Jewellery",
  "Food & Agriculture",
];

export default function StandardsPage() {
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#024DA1] border border-blue-200 text-xs font-semibold">
            <BookOpen size={13} />
            <span>Official Bureau of Indian Standards Catalogue</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Indian Standards <span className="text-[#024DA1]">(IS) Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Search active Bureau of Indian Standards specifications, governing technical committees,
            and mandatory Quality Control Order (QCO) gazette notifications.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white transition-all"
                placeholder="Search by IS number (e.g. IS 16102), product, or committee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sector Selector */}
            <div className="sm:col-span-3">
              <select
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
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

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong>{filteredStandards.length}</strong> of {STANDARDS_CATALOGUE.length} standards catalogued
            </span>
            {(searchTerm || selectedSector !== "All Sectors" || schemeFilter !== "All Schemes") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSector("All Sectors");
                  setSchemeFilter("All Schemes");
                }}
                className="text-[#024DA1] hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStandards.map((item) => (
            <div
              key={item.is_number}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-base font-black text-[#024DA1] font-mono">
                      {item.is_number}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5 font-mono">
                      :{item.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#024DA1] border border-blue-200">
                      {item.scheme}
                    </span>
                    {item.mandatory && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-red-50 text-[#970C12] border border-red-200">
                        QCO Mandatory
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.scope}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Building size={12} className="text-slate-400" />
                    <span>{item.committee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span>Reaffirmed {item.year}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">QCO Notification: </span>
                  {item.qco_order}
                </div>
              </div>

              <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/chat?q=${encodeURIComponent(
                    `Tell me full testing requirements and licensing procedure for ${item.is_number}`
                  )}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#024DA1] hover:underline"
                >
                  <Sparkles size={13} />
                  <span>Ask AI Saathi About {item.is_number}</span>
                </Link>

                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="Official BIS Standard Reference"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
