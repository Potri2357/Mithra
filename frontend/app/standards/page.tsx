"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  BookOpen,
  ChevronRight,
  Building,
  Calendar,
  Sparkles,
} from "lucide-react";

// Official Seeded Indian Standards Catalogue
const STANDARDS_CATALOGUE = [
  {
    is_number: "IS 16102 (Part 1 & 2)",
    title: "Self-Ballasted LED Lamps for General Lighting Services — Safety Requirements",
    committee: "ETD 33 (Lighting)",
    year: "2012",
    scope: "Specifies safety requirements for LED lamps and modules with supply voltages up to 250V.",
    scheme: "CRS",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "Electronics & IT Goods Mandatory Safety Order",
  },
  {
    is_number: "IS 694",
    title: "PVC Insulated Cables for Working Voltages up to and including 1100V",
    committee: "ETD 05 (Cables & Conductors)",
    year: "2010",
    scope: "Covers single core and multicore PVC insulated cables for domestic and industrial wiring installations.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "Wires and Cables Quality Control Order",
  },
  {
    is_number: "IS 269",
    title: "Ordinary Portland Cement (33, 43 and 53 Grade) — Specification",
    committee: "CED 02 (Cement & Concrete)",
    year: "2015",
    scope: "Prescribes physical and chemical requirements, compressive strength, and fineness for OPC cement.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Civil & Construction",
    qco_order: "Cement Quality Control Order (Mandatory)",
  },
  {
    is_number: "IS 4151",
    title: "Protective Helmets for Two Wheeler Riders — Specification",
    committee: "PGD 07 (Personal Safety)",
    year: "2015",
    scope: "Specifies shock absorption, retention system, and penetration resistance for two-wheeler protective helmets.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Helmet Quality Control Order (Ministry of Road Transport)",
  },
  {
    is_number: "IS 13252 (Part 1)",
    title: "Information Technology Equipment — Safety (General Requirements)",
    committee: "LITD 06 (IT & Telecom)",
    year: "2010",
    scope: "Covers mains-powered or battery-powered information technology equipment including laptops, monitors, printers.",
    scheme: "CRS",
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
    qco_order: "Steel and Steel Products QCO Order",
  },
  {
    is_number: "IS 2347",
    title: "Domestic Pressure Cookers — Specification",
    committee: "MED 03 (Kitchenware)",
    year: "2017",
    scope: "Safety standards, burst pressure testing, and fusible plug requirements for domestic pressure cookers.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Consumer Safety & PPE",
    qco_order: "Domestic Pressure Cooker QCO Order",
  },
  {
    is_number: "IS 15111",
    title: "Electric Water Heaters (Geysers) for Household and Similar Purposes",
    committee: "ETD 32 (Electrical Appliances)",
    year: "2014",
    scope: "Safety and energy efficiency standards for storage and instantaneous electric geysers.",
    scheme: "ISI Mark",
    mandatory: true,
    sector: "Electronics & Electrical",
    qco_order: "Household Electrical Appliances QCO Order",
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
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold">
            <BookOpen size={14} />
            <span>Official BIS Standards Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Indian Standards <span className="text-[#024DA1]">(IS) Catalogue</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Search active Bureau of Indian Standards specifications, governing technical committees,
            and mandatory Quality Control Order (QCO) gazette notifications.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bis-panel p-5 bg-[#0B1324] border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input-bis pl-10 text-sm bg-[#101E38] border-slate-700"
                placeholder="Search standard by IS number (e.g. IS 16102), product, or committee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sector Selector */}
            <div className="sm:col-span-3">
              <select
                className="input-bis text-sm bg-[#101E38] border-slate-700"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s} className="bg-[#0B1324]">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Selector */}
            <div className="sm:col-span-3">
              <select
                className="input-bis text-sm bg-[#101E38] border-slate-700"
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
              >
                <option value="All Schemes" className="bg-[#0B1324]">All Certification Schemes</option>
                <option value="ISI Mark" className="bg-[#0B1324]">ISI Mark (Scheme I)</option>
                <option value="CRS" className="bg-[#0B1324]">CRS (Electronics & IT)</option>
                <option value="Hallmarking" className="bg-[#0B1324]">Hallmarking (Precious Metals)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
            <span>Showing <strong>{filteredStandards.length}</strong> catalogued Indian Standards</span>
            <span className="text-slate-400">Database updated with Gazette QCO notifications</span>
          </div>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStandards.map((std) => (
            <div
              key={std.is_number}
              className="bis-panel p-6 bg-[#0B1324] border border-slate-800 flex flex-col justify-between hover:border-blue-700/60 transition-colors group"
            >
              <div className="space-y-3">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black font-mono px-2.5 py-1 rounded bg-[#024DA1] text-white">
                    {std.is_number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                      {std.scheme}
                    </span>
                    {std.mandatory && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60">
                        Mandatory QCO
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Scope */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {std.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {std.scope}
                </p>

                {/* Meta details */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Building size={12} className="text-blue-400" />
                      <span>Committee:</span>
                    </span>
                    <span className="text-slate-200 font-medium">{std.committee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-blue-400" />
                      <span>Edition / Year:</span>
                    </span>
                    <span className="text-slate-200 font-medium">{std.year}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span className="font-semibold text-slate-300">Statutory Order: </span>
                    <span>{std.qco_order}</span>
                  </div>
                </div>
              </div>

              {/* Action: Consult AI Assistant on this Standard */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <Link
                  href={`/chat?q=${encodeURIComponent(`What does ${std.is_number} cover and what are the testing requirements?`)}`}
                >
                  <button className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-blue-950/50 hover:bg-[#024DA1] text-blue-300 hover:text-white border border-blue-900/60 transition-colors flex items-center justify-center gap-2">
                    <Sparkles size={13} />
                    <span>Inquire with AI Saathi</span>
                    <ChevronRight size={13} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
