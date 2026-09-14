"use client";

import { useState, useMemo } from "react";
import {
  FlaskConical,
  MapPin,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Phone,
  Copy,
  Check,
  X,
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
    categories: ["Primary Calibration", "Legal Metrology", "Photovoltaic Reference", "Time & Frequency"],
    bis_lab_id: "BIS-NPL-005",
    phone: "011-45609212",
    email: "director@nplindia.org",
  },
  {
    id: "lab-6",
    name: "Shriram Institute for Industrial Research",
    city: "Delhi",
    state: "Delhi",
    address: "19, University Road, Delhi - 110007",
    accreditation: "NABL & BIS Recognized Independent Testing Lab",
    categories: ["Polymers & Plastics", "Toxicology", "Rubber Products", "Textiles", "Toys Testing"],
    bis_lab_id: "BIS-SIIR-006",
    phone: "011-27667267",
    email: "sridlhi@vsnl.com",
  },
  {
    id: "lab-7",
    name: "Central Institute of Petrochemicals Engineering & Technology (CIPET)",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "TVK Industrial Estate, Guindy, Chennai - 600032",
    accreditation: "Apex Plastics Testing Institute",
    categories: ["PVC & HDPE Pipes", "Plastics", "Biodegradable Polymers", "Packaging Materials"],
    bis_lab_id: "BIS-CIPET-007",
    phone: "044-22254701",
    email: "chennai@cipet.gov.in",
  },
  {
    id: "lab-8",
    name: "National Metallurgical Laboratory (CSIR-NML)",
    city: "Jamshedpur",
    state: "Jharkhand",
    address: "Burmamines, Jamshedpur - 831007",
    accreditation: "Apex Metallurgy & Steel Testing Facility",
    categories: ["Structural Steel", "TMT Rebars (IS 1786)", "Corrosion Testing", "Mechanical Hardness"],
    bis_lab_id: "BIS-NML-008",
    phone: "0657-2345100",
    email: "director@nmlindia.org",
  },
];

const STATES = [
  "All States",
  "Delhi",
  "Uttar Pradesh",
  "Karnataka",
  "Gujarat",
  "Tamil Nadu",
  "Jharkhand",
];

const POPULAR_CATEGORIES = [
  "All Categories",
  "Electrical",
  "Solar PV",
  "PVC & HDPE",
  "TMT Rebars",
  "Toys Testing",
  "Food & Water",
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
        <Badge variant="blue" className="px-3 py-1 gap-1.5 font-bold shadow-2xs">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>NABL &amp; BIS-Recognized Testing Network</span>
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Testing &amp; Calibration <span className="text-[#024DA1] dark:text-blue-400">Laboratory Radar</span>
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
            type="button"
            onClick={() => handleCategorySelect(cat)}
            className={`h-9 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              category === cat
                ? "bg-[#024DA1] text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Station with Generous Spacing */}
      <Card className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6">
            <label
              htmlFor="search-kw"
              className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mb-2"
            >
              Instant Text Search
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none z-10" />
              <Input
                id="search-kw"
                type="text"
                className="h-11 pl-10 pr-9 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm"
                placeholder="Filter by city, lab name, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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
              className="w-full h-11 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-[#024DA1] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 cursor-pointer transition-all"
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
              type="button"
              onClick={() => setViewMode("grid")}
              className={`h-11 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#024DA1] text-white border-[#024DA1] shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`h-11 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#024DA1] text-white border-[#024DA1] shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredLabs.length}</strong> of {labs.length} laboratories
          </span>
          {(keyword || selectedState !== "All States" || category !== "All Categories") && (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setSelectedState("All States");
                setCategory("All Categories");
              }}
              className="text-[#024DA1] dark:text-blue-400 hover:underline font-bold cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </Card>

      {/* Grid or Table Display with Clean Cards & Proper Padding */}
      {filteredLabs.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <FlaskConical className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No accredited laboratories match your criteria</h3>
          <p className="text-xs text-slate-500">Try broadening your keyword or selecting &quot;All States&quot;.</p>
          <Button
            type="button"
            onClick={() => handleAsk(`Which BIS recognized lab tests ${keyword || category}?`)}
            className="bg-[#024DA1] text-white text-xs font-semibold rounded-full px-5 gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Mithra For Testing Guidance</span>
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map((lab) => (
            <Card
              key={lab.id}
              className="flex flex-col justify-between group hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#024DA1] dark:group-hover:text-blue-400 transition-colors">
                    {lab.name}
                  </CardTitle>
                  <Badge variant="blue" className="text-[11px] font-semibold shrink-0">
                    {lab.accreditation}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#024DA1] shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {lab.city}, {lab.state}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <p className="leading-relaxed">{lab.address}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lab.categories.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <Button
                  type="button"
                  onClick={() => handleAsk(`What is the testing procedure and sample size required for BIS certification at ${lab.name}?`)}
                  size="sm"
                  className="bg-blue-50 hover:bg-[#024DA1] hover:text-white text-[#024DA1] dark:bg-blue-950/70 dark:text-blue-300 dark:hover:bg-[#024DA1] dark:hover:text-white text-xs font-semibold rounded-full px-4 gap-1.5 transition-all shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Testing Scope</span>
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  {lab.phone && (
                    <a
                      href={`tel:${lab.phone}`}
                      className="h-8 px-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{lab.phone}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => copyLabId(lab.bis_lab_id)}
                    className="h-8 px-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Copy BIS Lab ID"
                  >
                    <span>{lab.bis_lab_id}</span>
                    {copiedId === lab.bis_lab_id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="p-5 overflow-x-auto">
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
                    <Badge variant="blue" className="text-xs font-semibold">
                      {lab.accreditation}
                    </Badge>
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
        </Card>
      )}
    </div>
  );
}

export default LabsView;
