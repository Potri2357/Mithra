"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Loader2,
  Building2,
  Copy,
  Check,
  LayoutGrid,
  List,
  Filter,
  FlaskConical,
} from "lucide-react";

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

export default function LabsPage() {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-50/70 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#024DA1] border border-blue-200 text-xs font-semibold">
            <FlaskConical size={13} />
            <span>Laboratory Recognition Scheme (LRS)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Testing &amp; Calibration <span className="text-[#024DA1]">Laboratory Radar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Locate authorized testing laboratories recognized under the Laboratory Recognition Scheme (LRS) for
            mandatory QCO compliance, factory sample testing, and ISI conformity assessments.
          </p>
        </div>

        {/* Popular Quick Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                category === cat
                  ? "bg-[#024DA1] border-[#024DA1] text-white shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Station */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label
                htmlFor="search-kw"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5"
              >
                Instant Text Search
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="search-kw"
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-white transition-all"
                  placeholder="Filter by city, lab name, or keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="state-select"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5"
              >
                State / Region
              </label>
              <select
                id="state-select"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
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
                className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex-1 flex items-center justify-center gap-1.5 transition-colors"
                onClick={() => fetchLabs(category, state)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Filter size={15} />
                    <span>Apply Filter</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === "grid" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                  }`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Card grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === "table" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                  }`}
                  onClick={() => setViewMode("table")}
                  aria-label="Table list view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredLabs.length}</strong> of {labs.length} accredited facilities
          </span>
          <span>
            Category: <strong className="text-slate-900">{category}</strong>{" "}
            {state !== "All States" && `• State: ${state}`}
          </span>
        </div>

        {/* Results Grid / Table */}
        {filteredLabs.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#024DA1] flex items-center justify-center mx-auto mb-2">
              <Building2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No Accredited Testing Facilities Found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No registered laboratories matched the chosen filters. Try setting State to &quot;All
              States&quot; or consulting the Assistant.
            </p>
            <div className="pt-2">
              <Link href={`/chat?q=${encodeURIComponent(`Where can I get ${category} tested in India?`)}`}>
                <button className="bg-[#024DA1] hover:bg-[#0360C9] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors">
                  <span>Ask AI Assistant For Testing Guidance</span>
                </button>
              </Link>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{lab.name}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#024DA1] border border-blue-200 flex-shrink-0">
                      {lab.accreditation}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5">
                    <MapPin size={13} className="text-[#EC171F] flex-shrink-0" />
                    <span>
                      {lab.city}, {lab.state}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">{lab.address}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {lab.categories.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                    {lab.categories.length > 4 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        +{lab.categories.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    {lab.phone && (
                      <a
                        href={`tel:${lab.phone}`}
                        className="flex items-center gap-1 text-slate-600 hover:text-[#024DA1] font-medium transition-colors"
                      >
                        <Phone size={12} className="text-[#024DA1]" />
                        <span>{lab.phone}</span>
                      </a>
                    )}
                    {lab.email && (
                      <a
                        href={`mailto:${lab.email}`}
                        className="flex items-center gap-1 text-slate-600 hover:text-[#024DA1] font-medium transition-colors"
                      >
                        <Mail size={12} className="text-[#024DA1]" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => copyLabId(lab.bis_lab_id)}
                    className="flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 ml-auto"
                    title="Copy BIS Lab ID"
                  >
                    <span>{lab.bis_lab_id}</span>
                    {copiedId === lab.bis_lab_id ? (
                      <Check size={12} className="text-[#0E8A5F]" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                  <th className="p-3.5">Lab Name</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Accreditation</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">BIS Lab ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredLabs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 max-w-xs">{lab.name}</td>
                    <td className="p-3.5">
                      {lab.city}, {lab.state}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#024DA1] text-[11px] font-bold">
                        {lab.accreditation}
                      </span>
                    </td>
                    <td className="p-3.5 space-x-2">
                      {lab.phone && (
                        <a href={`tel:${lab.phone}`} className="text-[#024DA1] font-semibold hover:underline">
                          {lab.phone}
                        </a>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">{lab.bis_lab_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
