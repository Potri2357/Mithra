"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  BookOpen,
  Building2,
  CalendarDays,
  ExternalLink,
  X,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

// Official Seeded Indian Standards Catalogue
export interface StandardItem {
  is_number: string;
  title: string;
  committee: string;
  year: string;
  scope: string;
  scheme: "ISI Mark" | "CRS (Scheme II)" | "Hallmarking";
  mandatory: boolean;
  sector: string;
  qco_order: string;
}

export const STANDARDS_CATALOGUE: StandardItem[] = [
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

const SCHEMES = [
  "All Schemes",
  "ISI Mark",
  "CRS (Scheme II)",
  "Hallmarking",
];

const ITEMS_PER_PAGE = 6;

// ── 1. BREADCRUMB COMPONENT ──
export function StandardsBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-slate-400">
      <Link href="/" className="hover:text-[#005EB8] dark:hover:text-blue-400 transition-colors">
        Standards
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-400" />
      <span className="font-semibold text-[#0F172A] dark:text-slate-200">
        Indian Standards Directory
      </span>
    </nav>
  );
}

// ── 2. PAGE HEADER COMPONENT ──
export function StandardsPageHeader() {
  const { t } = useLanguage();
  return (
    <div className="space-y-2 border-b border-slate-200/80 dark:border-slate-800 pb-5">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-[#0052CC] dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300">
        <span>{t("standards.badge")}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
        {t("standards.heading")}
      </h1>
      <p className="text-sm sm:text-[15px] text-[#64748B] dark:text-slate-400 max-w-3xl leading-relaxed font-normal">
        {t("standards.subheading")}
      </p>
    </div>
  );
}

// ── 3. SEARCH & FILTER TOOLBAR ──
interface StandardsSearchToolbarProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  selectedSector: string;
  onSectorChange: (v: string) => void;
  selectedScheme: string;
  onSchemeChange: (v: string) => void;
  qcoOnly: boolean;
  onQcoOnlyToggle: () => void;
}

export function StandardsSearchToolbar({
  searchTerm,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedScheme,
  onSchemeChange,
  qcoOnly,
  onQcoOnlyToggle,
}: StandardsSearchToolbarProps) {
  const { t } = useLanguage();
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
        {/* Search Input with generous 40px left padding */}
        <div className="sm:col-span-2 md:col-span-5 relative flex items-center">
          <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 pointer-events-none z-10" />
          <Input
            type="text"
            className="h-10 !pl-10 pr-8 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-xs sm:text-sm placeholder:text-[#64748B] rounded-md"
            placeholder={t("standards.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sector Filter with custom ChevronDown */}
        <div className="md:col-span-3 relative">
          <select
            className="w-full h-10 pl-3 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs sm:text-sm font-medium text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#005EB8] focus:ring-1 focus:ring-[#005EB8] dark:focus:border-[#52525B] dark:focus:ring-[#52525B] transition-colors cursor-pointer appearance-none"
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
          >
            {SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Scheme Filter with custom ChevronDown */}
        <div className="md:col-span-2 relative">
          <select
            className="w-full h-10 pl-3 pr-8 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-xs sm:text-sm font-medium text-[#0F172A] dark:text-slate-200 outline-none focus:border-[#005EB8] focus:ring-1 focus:ring-[#005EB8] dark:focus:border-[#52525B] dark:focus:ring-[#52525B] transition-colors cursor-pointer appearance-none"
            value={selectedScheme}
            onChange={(e) => onSchemeChange(e.target.value)}
          >
            {SCHEMES.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* QCO Mandatory Filter Button */}
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={onQcoOnlyToggle}
            className={cn(
              "w-full h-10 px-3 rounded-md text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
              qcoOnly
                ? "bg-red-50 border-red-300 text-[#DC2626] dark:bg-red-950/50 dark:border-red-800 dark:text-red-300 shadow-2xs"
                : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-[#64748B] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
            title="Filter by mandatory Quality Control Orders"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">QCO Mandatory</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 4. RESULTS SUMMARY & ACTIVE FILTERS ──
interface ActiveFiltersProps {
  totalResults: number;
  totalCatalogueCount: number;
  searchTerm: string;
  selectedSector: string;
  selectedScheme: string;
  qcoOnly: boolean;
  onClearSearch: () => void;
  onClearSector: () => void;
  onClearScheme: () => void;
  onClearQco: () => void;
  onResetAll: () => void;
}

export function ResultsSummaryAndFilters({
  totalResults,
  totalCatalogueCount,
  searchTerm,
  selectedSector,
  selectedScheme,
  qcoOnly,
  onClearSearch,
  onClearSector,
  onClearScheme,
  onClearQco,
  onResetAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedSector !== "All Sectors" ||
    selectedScheme !== "All Schemes" ||
    qcoOnly;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:text-slate-400 py-1">
      <div className="flex flex-wrap items-center gap-2">
        <span>
          Showing <strong className="text-[#0F172A] dark:text-white font-bold">{totalResults}</strong> of {totalCatalogueCount} standards
        </span>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 ml-1">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                Keyword: &quot;{searchTerm}&quot;
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="hover:text-[#DC2626] cursor-pointer"
                  title="Remove keyword filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSector !== "All Sectors" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                Sector: {selectedSector}
                <button
                  type="button"
                  onClick={onClearSector}
                  className="hover:text-[#DC2626] cursor-pointer"
                  title="Remove sector filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedScheme !== "All Schemes" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200">
                Scheme: {selectedScheme}
                <button
                  type="button"
                  onClick={onClearScheme}
                  className="hover:text-[#DC2626] cursor-pointer"
                  title="Remove scheme filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {qcoOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-[11px] font-semibold text-[#DC2626] dark:text-red-300">
                QCO Mandatory
                <button
                  type="button"
                  onClick={onClearQco}
                  className="hover:text-red-800 cursor-pointer"
                  title="Remove QCO filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs font-semibold text-[#005EB8] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear all filters</span>
        </button>
      )}
    </div>
  );
}

// ── 5. STANDARD CARD COMPONENT ──
interface StandardCardProps {
  item: StandardItem;
  onAskMithra?: (query: string) => void;
}

export function StandardCard({ item, onAskMithra }: StandardCardProps) {
  const handleAsk = () => {
    const q = `Explain applicability, required testing parameters, and BIS certification pathway for ${item.is_number} (${item.title})`;
    if (onAskMithra) {
      onAskMithra(q);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(q)}`, "_blank");
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-colors duration-150 group">
      {/* Upper Information Section */}
      <div className="space-y-3">
        {/* Row 1: IS Number & Year */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-base sm:text-[17px] font-extrabold text-[#005EB8] dark:text-blue-400 tracking-tight">
            {item.is_number}
          </span>
          <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
            {item.year}
          </span>
        </div>

        {/* Row 2: Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="blue" className="text-[11px] font-medium rounded-md px-2 py-0.5">
            {item.scheme}
          </Badge>
          {item.mandatory && (
            <Badge variant="danger" className="text-[11px] font-semibold rounded-md px-2 py-0.5">
              QCO Mandatory
            </Badge>
          )}
        </div>

        {/* Row 3: Standard Title (Strongest visual anchor) */}
        <h3 className="text-base sm:text-[17px] font-bold text-[#0F172A] dark:text-white leading-snug group-hover:text-[#005EB8] dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        {/* Row 4: Scope / Description */}
        <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 leading-relaxed line-clamp-3 font-normal">
          {item.scope}
        </p>

        {/* Row 5: Committee & Reaffirmed Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{item.committee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Reaffirmed {item.year}</span>
          </div>
        </div>

        {/* Row 6: Authoritative QCO Order Callout */}
        {item.qco_order && (
          <div className="px-3 py-2 rounded-r-md bg-slate-50 dark:bg-slate-800/60 border-l-[3px] border-[#005EB8] text-xs space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 block">
              Quality Control Order
            </span>
            <span className="font-medium text-[#0F172A] dark:text-slate-200 leading-relaxed block">
              {item.qco_order}
            </span>
          </div>
        )}
      </div>

      {/* Row 7: Actions aligned to bottom */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <Button
          onClick={handleAsk}
          className="h-9 bg-[#005EB8] hover:bg-[#004b94] text-white text-xs font-semibold rounded-md px-4 gap-1.5 shadow-xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
          <span>Ask Mithra Compliance AI</span>
        </Button>

        <a
          href="https://www.bis.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#005EB8] dark:hover:text-blue-400 px-3 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
          title="Open official BIS specification reference"
        >
          <span>BIS Ref</span>
          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
        </a>
      </div>
    </div>
  );
}

// ── 6. EMPTY STATE COMPONENT ──
export function StandardsEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="p-10 sm:p-12 text-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5">
      <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
          No standards found
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-sm mx-auto">
          Try changing your search keywords or broadening your filter criteria.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="rounded-md text-xs font-semibold"
      >
        Clear filters
      </Button>
    </div>
  );
}

// ── 7. LOADING STATE (SKELETON CARDS) ──
export function StandardsLoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-4/5" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-28" />
          </div>
          <Skeleton className="h-8 w-full" />
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 8. ERROR STATE COMPONENT ──
export function StandardsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-8 text-center rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 space-y-3">
      <AlertTriangle className="w-8 h-8 text-[#DC2626] mx-auto" />
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Unable to load standards
        </h3>
        <p className="text-xs text-[#64748B] dark:text-slate-400">
          Something went wrong while retrieving the BIS standards catalogue.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="rounded-md text-xs font-semibold"
      >
        Retry
      </Button>
    </div>
  );
}

// ── 9. PAGINATION COMPONENT ──
interface StandardsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StandardsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: StandardsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Standards catalogue pagination"
      className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-[#64748B]"
    >
      <div>
        Page <span className="font-semibold text-[#0F172A] dark:text-white">{currentPage}</span> of {totalPages}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-2.5 rounded-md text-xs font-medium gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 rounded-md text-xs font-semibold transition-colors cursor-pointer",
              currentPage === p
                ? "bg-[#005EB8] text-white shadow-2xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            )}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-2.5 rounded-md text-xs font-medium gap-1"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </nav>
  );
}

// ── MAIN STANDARDS VIEW COMPONENT ──
interface StandardsViewProps {
  onAskMithra?: (query: string) => void;
}

export function StandardsView({ onAskMithra }: StandardsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedScheme, setSelectedScheme] = useState("All Schemes");
  const [qcoOnly, setQcoOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filtered standards
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
        selectedScheme === "All Schemes" || item.scheme === selectedScheme;

      const matchesQco = !qcoOnly || item.mandatory;

      return matchesSearch && matchesSector && matchesScheme && matchesQco;
    });
  }, [searchTerm, selectedSector, selectedScheme, qcoOnly]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStandards.length / ITEMS_PER_PAGE);
  const paginatedStandards = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStandards.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStandards, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedSector("All Sectors");
    setSelectedScheme("All Schemes");
    setQcoOnly(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* 1. Breadcrumb */}
      <StandardsBreadcrumb />

      {/* 2. Compact Page Header */}
      <StandardsPageHeader />

      {/* 3. Search + Filter Toolbar */}
      <StandardsSearchToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        selectedSector={selectedSector}
        onSectorChange={(v) => {
          setSelectedSector(v);
          setCurrentPage(1);
        }}
        selectedScheme={selectedScheme}
        onSchemeChange={(v) => {
          setSelectedScheme(v);
          setCurrentPage(1);
        }}
        qcoOnly={qcoOnly}
        onQcoOnlyToggle={() => {
          setQcoOnly(!qcoOnly);
          setCurrentPage(1);
        }}
      />

      {/* 4. Results Summary & Active Filters */}
      <ResultsSummaryAndFilters
        totalResults={filteredStandards.length}
        totalCatalogueCount={STANDARDS_CATALOGUE.length}
        searchTerm={searchTerm}
        selectedSector={selectedSector}
        selectedScheme={selectedScheme}
        qcoOnly={qcoOnly}
        onClearSearch={() => {
          setSearchTerm("");
          setCurrentPage(1);
        }}
        onClearSector={() => {
          setSelectedSector("All Sectors");
          setCurrentPage(1);
        }}
        onClearScheme={() => {
          setSelectedScheme("All Schemes");
          setCurrentPage(1);
        }}
        onClearQco={() => {
          setQcoOnly(false);
          setCurrentPage(1);
        }}
        onResetAll={handleResetFilters}
      />

      {/* 5. Standards Grid or Empty State */}
      {isLoading ? (
        <StandardsLoadingState />
      ) : filteredStandards.length === 0 ? (
        <StandardsEmptyState onClear={handleResetFilters} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {paginatedStandards.map((item) => (
              <StandardCard
                key={item.is_number}
                item={item}
                onAskMithra={onAskMithra}
              />
            ))}
          </div>

          {/* 6. Pagination */}
          <StandardsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default StandardsView;
