"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  X,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
        <Badge variant="blue" className="px-3 py-1 gap-1.5 font-bold shadow-2xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Official BIS Catalogue</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Indian Standards <span className="text-[#024DA1] dark:text-blue-400">(IS) Directory</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Search active Bureau of Indian Standards specifications, governing technical committees,
          and mandatory Quality Control Order (QCO) gazette notifications.
        </p>
      </div>

      {/* Filter Toolbar with Generous Spacing and Proper Padding */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input with Non-Overlapping Icon */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none z-10" />
            <Input
              type="text"
              className="h-11 pl-10 pr-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              placeholder="Search by IS number (e.g. IS 16102), keyword, or committee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sector Selector */}
          <div className="md:col-span-3">
            <select
              className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-[#024DA1] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 transition-all cursor-pointer"
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
              className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-[#024DA1] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 transition-all cursor-pointer"
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

        {/* Filter Count & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredStandards.length}</strong> of {STANDARDS_CATALOGUE.length} standards catalogued
          </span>
          {(searchTerm || selectedSector !== "All Sectors" || schemeFilter !== "All Schemes") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedSector("All Sectors");
                setSchemeFilter("All Schemes");
              }}
              className="text-[#024DA1] dark:text-blue-400 hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Standards Grid with Clean shadcn Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStandards.map((item) => (
          <Card
            key={item.is_number}
            className="flex flex-col justify-between group hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          >
            <CardHeader className="space-y-3 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-[#024DA1] dark:text-blue-400 font-mono tracking-tight">
                    {item.is_number}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    :{item.year}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="blue" className="font-semibold text-[11px]">
                    {item.scheme}
                  </Badge>
                  {item.mandatory && (
                    <Badge variant="danger" className="font-bold text-[11px]">
                      QCO Mandatory
                    </Badge>
                  )}
                </div>
              </div>

              <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#024DA1] dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                {item.scope}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.committee}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reaffirmed {item.year}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="font-bold text-slate-900 dark:text-white shrink-0">QCO Order:</span>
                <span className="leading-relaxed">{item.qco_order}</span>
              </div>
            </CardContent>

            {/* Redesigned Card Footer with Clean shadcn Buttons */}
            <CardFooter className="pt-4 flex flex-wrap items-center justify-between gap-2.5">
              <Button
                type="button"
                onClick={() => handleAsk(item.is_number)}
                size="sm"
                className="bg-[#024DA1] hover:bg-[#023A79] text-white font-semibold text-xs rounded-full px-4 gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Ask Mithra Compliance AI</span>
              </Button>

              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#024DA1] px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-auto"
                title="Official BIS Standard Reference"
              >
                <span>BIS Ref</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StandardsView;
