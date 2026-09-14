"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import MaterialIcon from "@/components/MaterialIcon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const POPULAR_CATEGORIES = [
  "LED Lamps",
  "Wires & Cables",
  "Household Electrical",
  "Electronics & IT",
  "Steel & Construction",
  "Cement",
  "Helmets & PPE",
  "Toys",
  "General Testing",
];

const STATES = [
  "All States",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Telangana",
  "Kerala",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Jharkhand",
  "Uttarakhand",
];

interface Lab {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  categories: string[];
  accreditation: string;
  bis_lab_id: string;
}

interface LabsViewProps {
  onAskMithra?: (query: string) => void;
}

export function LabsView({ onAskMithra }: LabsViewProps) {
  const [category, setCategory] = useState("LED Lamps");
  const [state, setState] = useState("All States");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLabs = useCallback(async (cat: string, st: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ category: cat });
      if (st && st !== "All States") params.set("state", st);
      const res = await fetch(`${API_URL}/api/labs?${params}`);
      const data = await res.json();
      setLabs(data.labs || []);
    } catch {
      setLabs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/labs?category=LED+Lamps`)
      .then((res) => res.json())
      .then((data) => {
        if (active) setLabs(data.labs || []);
      })
      .catch(() => {
        if (active) setLabs([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    fetchLabs(cat, state);
  };

  const copyLabId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Client-side text filtering
  const filteredLabs = useMemo(() => {
    if (!keyword.trim()) return labs;
    const q = keyword.toLowerCase();
    return labs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.bis_lab_id.toLowerCase().includes(q)
    );
  }, [labs, keyword]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="space-y-2 text-center sm:text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-900/60 text-xs font-bold text-[#7C3AED] dark:text-purple-400">
          <MaterialIcon name="biotech" size={15} />
          <span>NABL &amp; BIS-Recognized Testing Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Testing &amp; Calibration <span className="text-[#0052CC] dark:text-blue-400">Laboratory Radar</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Locate authorized testing laboratories recognized under the Laboratory Recognition Scheme (LRS) for
          mandatory QCO compliance, factory sample testing, and ISI conformity assessments.
        </p>
      </div>

      {/* Popular Quick Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {POPULAR_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              category === cat
                ? "bg-[#0052CC] text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Station */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="search-kw"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1"
            >
              Instant Text Search
            </label>
            <div className="relative flex items-center">
              <MaterialIcon name="search" size={18} className="absolute left-3.5 text-slate-400" />
              <input
                id="search-kw"
                type="text"
                className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0052CC]"
                placeholder="Filter by city, lab name, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="state-select"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-1"
            >
              State / Region
            </label>
            <select
              id="state-select"
              className="w-full h-10 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC]"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                fetchLabs(category, e.target.value);
              }}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-between gap-2">
            <button
              className="h-10 px-5 rounded-full bg-[#0052CC] hover:bg-[#0047B3] text-white text-xs font-bold flex-1 flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              onClick={() => fetchLabs(category, state)}
              disabled={isLoading}
            >
              {isLoading ? (
                <MaterialIcon name="progress_activity" size={16} className="animate-spin" />
              ) : (
                <>
                  <MaterialIcon name="filter_alt" size={16} />
                  <span>Apply Filter</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-white dark:bg-slate-700 text-[#0052CC] shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setViewMode("grid")}
                aria-label="Card grid view"
              >
                <MaterialIcon name="grid_view" size={16} />
              </button>
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-white dark:bg-slate-700 text-[#0052CC] shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={() => setViewMode("table")}
                aria-label="Table list view"
              >
                <MaterialIcon name="view_list" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredLabs.length}</strong> of {labs.length} accredited facilities
        </span>
        <span>
          Category: <strong className="text-slate-900 dark:text-white font-bold">{category}</strong>{" "}
          {state !== "All States" && `• State: ${state}`}
        </span>
      </div>

      {/* Results Grid / Table */}
      {filteredLabs.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-2.5 shadow-xs">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-slate-850 text-[#0052CC] flex items-center justify-center mx-auto mb-2">
            <MaterialIcon name="domain" size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Accredited Testing Facilities Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No registered laboratories matched the chosen filters. Try setting State to &quot;All
            States&quot; or consulting the Assistant.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onAskMithra && onAskMithra(`Where can I get ${category} tested in India?`)}
              className="h-9 px-5 rounded-full bg-[#0052CC] text-white text-xs font-bold cursor-pointer"
            >
              <span>Ask Mithra For Testing Guidance</span>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0052CC] transition-colors">{lab.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052CC] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 flex-shrink-0">
                    {lab.accreditation}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <MaterialIcon name="location_on" size={15} className="text-[#0052CC] flex-shrink-0" />
                  <span>
                    {lab.city}, {lab.state}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 leading-relaxed">{lab.address}</p>

                <div className="flex flex-wrap gap-1 mb-2.5">
                  {lab.categories.slice(0, 4).map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {c}
                    </span>
                  ))}
                  {lab.categories.length > 4 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      +{lab.categories.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  {lab.phone && (
                    <a
                      href={`tel:${lab.phone}`}
                      className="flex items-center gap-1 text-[#0052CC] dark:text-blue-400 font-medium transition-colors hover:underline"
                    >
                      <MaterialIcon name="call" size={14} />
                      <span>{lab.phone}</span>
                    </a>
                  )}
                  {lab.email && (
                    <a
                      href={`mailto:${lab.email}`}
                      className="flex items-center gap-1 text-[#0052CC] dark:text-blue-400 font-medium transition-colors hover:underline"
                    >
                      <MaterialIcon name="mail" size={14} />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => copyLabId(lab.bis_lab_id)}
                  className="flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 ml-auto cursor-pointer"
                  title="Copy BIS Lab ID"
                >
                  <span>{lab.bis_lab_id}</span>
                  {copiedId === lab.bis_lab_id ? (
                    <MaterialIcon name="check" size={14} className="text-[#059669]" />
                  ) : (
                    <MaterialIcon name="content_copy" size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold">
                <th className="p-3">Lab Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Accreditation</th>
                <th className="p-3">Contact</th>
                <th className="p-3">BIS Lab ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {filteredLabs.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white max-w-xs">{lab.name}</td>
                  <td className="p-3">
                    {lab.city}, {lab.state}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-[#0052CC] text-[11px] font-bold">
                      {lab.accreditation}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {lab.phone && (
                      <a href={`tel:${lab.phone}`} className="text-[#0052CC] font-semibold hover:underline">
                        {lab.phone}
                      </a>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-500">{lab.bis_lab_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
