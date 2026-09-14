"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  FlaskConical,
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
    <div className="min-h-screen bg-[#090D16] text-slate-100">
      {/* ── Top Navigation ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-[#0F172A] border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="btn-icon w-8 h-8 rounded-lg" aria-label="Back to home">
              <ChevronLeft size={16} />
            </button>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <FlaskConical size={18} />
          </div>
          <h1 className="text-white font-bold text-sm tracking-tight">
            Accredited Testing &amp; Calibration Laboratories
          </h1>
        </div>
        <Link href="/chat">
          <button className="btn-ghost py-1.5 px-3 text-xs">Chat Assistant</button>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            BIS &amp; NABL Accredited <span className="text-orange-500">Laboratory Radar</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Locate authorized testing laboratories under the Laboratory Recognition Scheme (LRS) for mandatory QCO compliance and ISI conformity assessments.
          </p>
        </div>

        {/* ── Popular Quick Categories ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                category === cat
                  ? "bg-[#C2410C] border-orange-500 text-white shadow-sm"
                  : "bg-[#0F172A] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Filter Station ────────────────────────────────────────────── */}
        <div className="bis-panel p-6 bg-[#0F172A] border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4">
              <label htmlFor="search-kw" className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                Instant Text Search
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="search-kw"
                  type="text"
                  className="input-bis pl-10 text-sm bg-[#141E33] border-slate-700"
                  placeholder="Filter by city, lab name, or keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="state-select" className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                State / Region
              </label>
              <select
                id="state-select"
                className="input-bis text-sm bg-[#141E33] border-slate-700"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  fetchLabs(category, e.target.value);
                }}
              >
                {STATES.map((s) => (
                  <option key={s} value={s} className="bg-[#0F172A] text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4 flex items-center justify-between gap-3">
              <button
                className="btn-primary flex-1 justify-center h-[46px]"
                onClick={() => fetchLabs(category, state)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Filter size={16} />
                    <span>Apply Filter</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1 bg-[#141E33] p-1 rounded-xl border border-slate-700">
                <button
                  className={`btn-icon w-8 h-8 rounded-lg ${viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400"}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Card grid view"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={`btn-icon w-8 h-8 rounded-lg ${viewMode === "table" ? "bg-slate-700 text-white" : "text-slate-400"}`}
                  onClick={() => setViewMode("table")}
                  aria-label="Table list view"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">
            Showing {filteredLabs.length} of {labs.length} accredited facilities
          </span>
          <span>Category: <strong>{category}</strong> {state !== "All States" && `• State: ${state}`}</span>
        </div>

        {/* ── Results Grid / Table ─────────────────────────────────────── */}
        {filteredLabs.length === 0 ? (
          <div className="bis-panel p-12 text-center bg-[#0F172A] border border-slate-800">
            <Building2 size={36} className="mx-auto text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              No Accredited Testing Facilities Found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              No registered laboratories matched the chosen filters. Try setting State to &quot;All States&quot; or consulting the Assistant.
            </p>
            <Link href={`/chat?q=${encodeURIComponent(`Where can I get ${category} tested in India?`)}`}>
              <button className="btn-primary text-xs py-2 px-4">
                Ask AI Assistant For Testing Guidance
              </button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="bis-panel p-6 bg-[#0F172A] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-bold text-white leading-snug">
                      {lab.name}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700 text-cyan-300 flex-shrink-0">
                      {lab.accreditation}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin size={13} className="text-orange-400 flex-shrink-0" />
                    <span>{lab.city}, {lab.state}</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    {lab.address}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {lab.categories.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                    {lab.categories.length > 4 && (
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        +{lab.categories.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    {lab.phone && (
                      <a
                        href={`tel:${lab.phone}`}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Phone size={13} className="text-orange-400" />
                        <span>{lab.phone}</span>
                      </a>
                    )}
                    {lab.email && (
                      <a
                        href={`mailto:${lab.email}`}
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                      >
                        <Mail size={13} className="text-orange-400" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => copyLabId(lab.bis_lab_id)}
                    className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-white ml-auto"
                    title="Copy BIS Lab ID"
                  >
                    <span>{lab.bis_lab_id}</span>
                    {copiedId === lab.bis_lab_id ? (
                      <Check size={12} className="text-emerald-400" />
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
          <div className="bis-panel overflow-x-auto bg-[#0F172A] border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#141E33] text-slate-300 font-semibold">
                  <th className="p-3.5">Lab Name</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Accreditation</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">BIS Lab ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLabs.map((lab) => (
                  <tr key={lab.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-semibold text-white max-w-xs">{lab.name}</td>
                    <td className="p-3.5">{lab.city}, {lab.state}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px]">
                        {lab.accreditation}
                      </span>
                    </td>
                    <td className="p-3.5 space-x-2">
                      {lab.phone && (
                        <a href={`tel:${lab.phone}`} className="text-orange-400 hover:underline">
                          {lab.phone}
                        </a>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{lab.bis_lab_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
