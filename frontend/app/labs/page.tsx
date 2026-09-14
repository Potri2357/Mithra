"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, FlaskConical, Search, MapPin, Phone, Mail, Award, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORIES = [
  "LED Lamps", "Wires & Cables", "Household Electrical", "Electronics & IT",
  "Steel & Construction", "Cement", "Helmets & PPE", "Toys",
  "Cookers & Utensils", "LPG Appliances", "Hallmarking", "Pipes & Plumbing",
  "EV Charging", "General Testing",
];

const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Telangana", "Kerala",
  "Punjab", "Haryana", "Madhya Pradesh", "Jharkhand", "Uttarakhand",
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
  const [state, setState] = useState("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchLabs = async () => {
    setIsLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ category });
      if (state) params.set("state", state);
      const res = await fetch(`${API_URL}/api/labs?${params}`);
      const data = await res.json();
      setLabs(data.labs || []);
    } catch {
      setLabs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid" style={{ background: "var(--surface-0)" }}>
      <div className="fixed top-0 left-0 right-0 w-96 h-96 mx-auto rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
        style={{ background: "rgba(10,12,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <Link href="/"><button className="btn-icon w-8 h-8"><ChevronLeft size={16} /></button></Link>
          <FlaskConical size={20} style={{ color: "var(--saffron)" }} />
          <span className="text-white font-bold">Testing Lab Finder</span>
        </div>
        <Link href="/chat"><button className="btn-ghost py-1.5 px-3 text-xs">Open Chat</button></Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-3">
            Find BIS-Recognized <span className="gradient-text">Testing Labs</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Discover accredited labs near you by product category and state.
          </p>
        </div>

        {/* Filters */}
        <div className="glass p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-secondary)" }}>
                Product Category *
              </label>
              <select
                className="input-bis"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: "var(--surface-2)" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "var(--surface-2)" }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: "var(--text-secondary)" }}>
                State (optional)
              </label>
              <select
                className="input-bis"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ background: "var(--surface-2)" }}
              >
                <option value="">All States</option>
                {STATES.map((s) => (
                  <option key={s} value={s} style={{ background: "var(--surface-2)" }}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="btn-primary w-full justify-center"
                onClick={searchLabs}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {isLoading ? "Searching..." : "Find Labs"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: "var(--saffron)" }} />
            <p style={{ color: "var(--text-secondary)" }}>Finding labs...</p>
          </div>
        )}

        {!isLoading && searched && labs.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl">
            <FlaskConical size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
            <p className="text-white font-semibold mb-2">No labs found</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Try a different category or remove the state filter.
              For the complete list, visit{" "}
              <a href="https://www.bis.gov.in/laboratories" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--saffron-light)" }}>bis.gov.in/laboratories</a>
            </p>
          </div>
        )}

        {!isLoading && labs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white font-semibold">{labs.length} lab{labs.length > 1 ? "s" : ""} found</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                for {category}{state ? ` in ${state}` : " across India"}
              </span>
            </div>
            <div className="space-y-4">
              {labs.map((lab, i) => (
                <div key={lab.id} className="glass-strong p-5 fade-in hover:border-orange-500/30 transition-all"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{ background: "var(--saffron-dim)", color: "var(--saffron)", border: "1px solid rgba(255,107,0,0.3)" }}>
                          {i + 1}
                        </div>
                        <h3 className="text-white font-semibold text-base">{lab.name}</h3>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <MapPin size={12} style={{ color: "var(--saffron)" }} />
                          {lab.city}, {lab.state}
                        </span>
                        {lab.phone && (
                          <a href={`tel:${lab.phone}`} className="flex items-center gap-1.5 text-xs transition-colors"
                            style={{ color: "var(--text-secondary)" }}>
                            <Phone size={12} style={{ color: "var(--saffron)" }} />
                            {lab.phone}
                          </a>
                        )}
                        {lab.email && (
                          <a href={`mailto:${lab.email}`} className="flex items-center gap-1.5 text-xs transition-colors"
                            style={{ color: "var(--text-secondary)" }}>
                            <Mail size={12} style={{ color: "var(--saffron)" }} />
                            {lab.email}
                          </a>
                        )}
                      </div>

                      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{lab.address}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {lab.categories.slice(0, 5).map((cat) => (
                          <span key={cat} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "var(--surface-3)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                            {cat}
                          </span>
                        ))}
                        {lab.categories.length > 5 && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--text-muted)" }}>
                            +{lab.categories.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium badge-valid">
                        <Award size={12} />
                        {lab.accreditation.includes("NABL") ? "NABL" : "BIS"}
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {lab.bis_lab_id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
              Data from BIS Recognized Laboratories Directory.{" "}
              <a href="https://www.bis.gov.in/laboratories" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--saffron-light)" }}>
                View complete list at bis.gov.in
              </a>
            </p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <FlaskConical size={64} className="mx-auto mb-4 float" style={{ color: "var(--text-muted)" }} />
            <p style={{ color: "var(--text-secondary)" }}>
              Select a product category and click <strong>Find Labs</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
