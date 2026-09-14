"use client";

import { useState, useMemo } from "react";
import MaterialIcon from "@/components/MaterialIcon";

// Official Seeded BIS Recognized Laboratories
export const BIS_LABORATORIES = [
  {
    id: "lab-1",
    name: "Central Laboratory, Bureau of Indian Standards",
    city: "Sahibabad",
    state: "Uttar Pradesh",
    address: "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad - 201010",
    accreditation: "BIS Central Apex Lab (NABL ISO/IEC 17025)",
    categories: ["Electrical", "Chemical", "Mechanical", "Food & Water", "Microbiology"],
    bis_lab_id: "BIS-CL-001",
    phone: "0120-2771234",
    email: "cl@bis.gov.in",
  },
  {
    id: "lab-2",
    name: "National Test House (Northern Region)",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    address: "Kamla Nehru Nagar, Ghaziabad - 201002",
    accreditation: "NABL Accredited & BIS Recognized",
    categories: ["Civil Engineering", "Non-Destructive Testing", "Chemical", "Electrical"],
    bis_lab_id: "BIS-NTH-NR-02",
    phone: "0120-2789876",
    email: "nthnr@nic.in",
  },
  {
    id: "lab-3",
    name: "Central Power Research Institute (CPRI)",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Prof. Sir C.V. Raman Road, Sadashivanagar P.O., P.B. No. 8066, Bengaluru - 560080",
    accreditation: "Apex Power Testing Lab (NABL & BIS Recognized)",
    categories: ["High Voltage", "Transformers", "Switchgear", "Cables & Conductors", "Solar PV Inverters"],
    bis_lab_id: "BIS-CPRI-003",
    phone: "080-22072211",
    email: "corporate@cpri.in",
  },
  {
    id: "lab-4",
    name: "ERDA (Electrical Research and Development Association)",
    city: "Vadodara",
    state: "Gujarat",
    address: "ERDA Road, GIDC, Makarpura, Vadodara - 390010",
    accreditation: "NABL & BIS Recognized",
    categories: ["Lighting Products", "Motors", "Insulators", "Smart Meters", "Solar PV"],
    bis_lab_id: "BIS-ERDA-004",
    phone: "0265-3043128",
    email: "erda@erda.org",
  },
  {
    id: "lab-5",
    name: "National Physical Laboratory (CSIR-NPL)",
    city: "New Delhi",
    state: "Delhi",
    address: "Dr. K.S. Krishnan Marg, Pusa, New Delhi - 110012",
    accreditation: "National Metrology Institute of India",
    categories: ["Calibration", "Precision Instruments", "Time & Frequency", "Mass & Length Standards"],
    bis_lab_id: "BIS-NPL-005",
    phone: "011-45609212",
    email: "director@nplindia.org",
  },
  {
    id: "lab-6",
    name: "CSIR-Central Building Research Institute (CBRI)",
    city: "Roorkee",
    state: "Uttarakhand",
    address: "Roorkee - 247667",
    accreditation: "BIS Recognized Building Materials Lab",
    categories: ["Cement & Concrete", "Bricks & Tiles", "Fire Safety", "Structural Elements"],
    bis_lab_id: "BIS-CBRI-006",
    phone: "01332-272243",
    email: "director@cbri.res.in",
  },
  {
    id: "lab-7",
    name: "Shriram Institute for Industrial Research",
    city: "Delhi",
    state: "Delhi",
    address: "19, University Road, Delhi - 110007",
    accreditation: "NABL & BIS Recognized Commercial Lab",
    categories: ["Plastics & Polymers", "Pesticides", "Packaging Materials", "Toys Safety (IS 9873)", "Water Testing"],
    bis_lab_id: "BIS-SIIR-007",
    phone: "011-27667267",
    email: "sridlhi@shriraminstitute.org",
  },
  {
    id: "lab-8",
    name: "TUV SUD South Asia Pvt. Ltd.",
    city: "Bengaluru",
    state: "Karnataka",
    address: "No. A 151, 2nd C Main Road, Peenya Industrial Area, Bengaluru - 560058",
    accreditation: "BIS CRS Scheme II Recognized Lab",
    categories: ["Consumer Electronics", "IT Equipment", "Automotive Components", "Battery Testing"],
    bis_lab_id: "BIS-TUVSUD-008",
    phone: "080-67456789",
    email: "info.in@tuvsud.com",
  },
];

const STATES = [
  "All States",
  "Delhi",
  "Uttar Pradesh",
  "Karnataka",
  "Gujarat",
  "Uttarakhand",
];

const POPULAR_CATEGORIES = [
  "All Categories",
  "Electrical",
  "Electronics",
  "Civil Engineering",
  "Food & Water",
  "Chemical",
  "Toys Safety",
  "Solar PV",
];

interface LabsViewProps {
  onAskMithra?: (query: string) => void;
}

export function LabsView({ onAskMithra }: LabsViewProps) {
  const [labs] = useState(BIS_LABORATORIES);
  const [selectedState, setSelectedState] = useState("All States");
  const [category, setCategory] = useState("All Categories");
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAsk = (query: string) => {
    if (onAskMithra) {
      onAskMithra(query);
    } else if (typeof window !== "undefined") {
      window.open(`/chat?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
  };

  const copyLabId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Client-side text filtering
  const filteredLabs = useMemo(() => {
    return labs.filter((l) => {
      const q = keyword.trim().toLowerCase();
      const matchesText =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.bis_lab_id.toLowerCase().includes(q);

      const matchesState = selectedState === "All States" || l.state === selectedState;

      const matchesCategory =
        category === "All Categories" ||
        l.categories.some((c) => c.toLowerCase().includes(category.toLowerCase()));

      return matchesText && matchesState && matchesCategory;
    });
  }, [labs, keyword, selectedState, category]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-900/60 text-xs font-bold text-[#7C3AED] dark:text-purple-400 shadow-2xs">
          <MaterialIcon name="biotech" size={15} />
          <span>NABL &amp; BIS-Recognized Testing Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Testing &amp; Calibration <span className="text-[#0052CC] dark:text-blue-400">Laboratory Radar</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          Locate authorized testing laboratories recognized under the Laboratory Recognition Scheme (LRS) for
          mandatory QCO compliance, factory sample testing, and ISI conformity assessments.
        </p>
      </div>

      {/* Popular Quick Category Pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {POPULAR_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              category === cat
                ? "bg-[#0052CC] text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Station with Generous Spacing */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label
              htmlFor="search-kw"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2"
            >
              Instant Text Search
            </label>
            <div className="relative flex items-center">
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
                id="search-kw"
                type="text"
                className="w-full h-11 pl-12 pr-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#0052CC] transition-all"
                placeholder="Filter by city, lab name, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="state-select"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2"
            >
              Filter by State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0052CC] cursor-pointer"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#0052CC] text-white border-[#0052CC] shadow-xs"
                  : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Grid View"
            >
              <MaterialIcon name="grid_view" size={17} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`h-11 px-4 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#0052CC] text-white border-[#0052CC] shadow-xs"
                  : "bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Table View"
            >
              <MaterialIcon name="table_chart" size={17} />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredLabs.length}</strong> of {labs.length} laboratories
          </span>
          {(keyword || selectedState !== "All States" || category !== "All Categories") && (
            <button
              onClick={() => {
                setKeyword("");
                setSelectedState("All States");
                setCategory("All Categories");
              }}
              className="text-[#0052CC] dark:text-blue-400 hover:underline font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid or Table Display with Proper Padding and Better Buttons */}
      {filteredLabs.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <MaterialIcon name="search_off" size={36} className="text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No accredited laboratories match your criteria</h3>
          <p className="text-xs text-slate-500">Try broadening your keyword or selecting &quot;All States&quot;.</p>
          <button
            type="button"
            onClick={() => handleAsk(`Which BIS recognized lab tests ${keyword || category}?`)}
            className="h-10 px-5 rounded-full bg-[#0052CC] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <MaterialIcon name="auto_awesome" size={16} />
            <span>Ask Mithra For Testing Guidance</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between group space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0052CC] transition-colors">{lab.name}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0052CC] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 flex-shrink-0">
                    {lab.accreditation}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MaterialIcon name="location_on" size={16} className="text-[#0052CC] flex-shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {lab.city}, {lab.state}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{lab.address}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lab.categories.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => handleAsk(`What is the testing procedure and sample size required for BIS certification at ${lab.name}?`)}
                  className="h-9 px-4 rounded-full bg-blue-50 hover:bg-[#0052CC] hover:text-white text-[#0052CC] dark:bg-blue-950/70 dark:text-blue-300 dark:hover:bg-[#0052CC] dark:hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <MaterialIcon name="auto_awesome" size={14} />
                  <span>Ask Testing Scope</span>
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  {lab.phone && (
                    <a
                      href={`tel:${lab.phone}`}
                      className="h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <MaterialIcon name="call" size={13} />
                      <span>{lab.phone}</span>
                    </a>
                  )}

                  <button
                    onClick={() => copyLabId(lab.bis_lab_id)}
                    className="h-8 px-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy BIS Lab ID"
                  >
                    <span>{lab.bis_lab_id}</span>
                    {copiedId === lab.bis_lab_id ? (
                      <MaterialIcon name="check" size={14} className="text-[#059669]" />
                    ) : (
                      <MaterialIcon name="content_copy" size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View with Generous Spacing */
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold">
                <th className="p-3.5">Lab Name</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Accreditation</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">BIS Lab ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {filteredLabs.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-xs">{lab.name}</td>
                  <td className="p-3.5">
                    {lab.city}, {lab.state}
                  </td>
                  <td className="p-3.5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 text-[#0052CC] text-xs font-bold">
                      {lab.accreditation}
                    </span>
                  </td>
                  <td className="p-3.5 space-x-2">
                    {lab.phone && (
                      <a href={`tel:${lab.phone}`} className="text-[#0052CC] font-semibold hover:underline">
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
    </div>
  );
}

export default LabsView;
