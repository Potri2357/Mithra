"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Search,
  Star,
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Trash2,
  Sliders,
  Sparkles,
  CheckCircle2,
  Layers,
  Building2,
  ShieldCheck,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProjects, Project } from "@/context/ProjectContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  getWorkspaceName,
  getWorkspaceDesc,
  getWorkspaceScheme,
  getWorkspaceCategory,
} from "@/lib/workspaceHelpers";

export default function ProjectsPage() {
  const { projects, activeProjectId, setActiveProject, createProject, deleteProject, toggleStarProject } = useProjects();
  const { t, language } = useLanguage();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Electrical & Electronics");
  const [newScheme, setNewScheme] = useState("Scheme I (ISI Mark)");
  const [newInstructions, setNewInstructions] = useState("");
  const [newStandards, setNewStandards] = useState("");

  const categories = ["All", "Electrical & Electronics", "Precious Metals & Jewellery", "Consumer Goods & Toys", "Automotive & Mechanical", "Chemicals"];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pinnedStandards.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStar = !showStarredOnly || p.isStarred;
    return matchesSearch && matchesCategory && matchesStar;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const standardsList = newStandards
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const created = createProject({
      name: newName.trim(),
      description: newDesc.trim() || "BIS regulatory compliance workspace.",
      category: newCategory,
      scheme: newScheme,
      instructions: newInstructions.trim() || "Adhere to BIS statutory guidelines and mandatory standards clauses.",
      pinnedStandards: standardsList.length > 0 ? standardsList : ["IS 1293: 2019"],
      isStarred: false,
    });

    setIsCreateModalOpen(false);
    setNewName("");
    setNewDesc("");
    setNewInstructions("");
    setNewStandards("");

    // Navigate to workspace
    router.push(`/projects/${created.id}`);
  };

  const handleOpenInChat = (project: Project) => {
    setActiveProject(project.id);
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-[#34332E]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 border border-blue-200 dark:border-[#3D3B35] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PROJECT WORKSPACES · CONTEXT ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F5F4ED]">
              {t("projects.title")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-[#9C9A91] max-w-3xl leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#024DA1] dark:bg-blue-600 hover:bg-[#023a79] dark:hover:bg-blue-500 text-white shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("projects.newProject")}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9C9A91]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, standard (e.g. IS 16444)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#21201C] text-slate-900 dark:text-[#F5F4ED] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#024DA1] dark:focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                showStarredOnly
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "border-slate-200 dark:border-[#34332E] text-slate-600 dark:text-[#9C9A91] hover:bg-slate-100 dark:hover:bg-[#2B2A26]"
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showStarredOnly ? "fill-amber-500 text-amber-500" : ""}`} />
              <span>Starred</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#024DA1] text-white font-semibold"
                    : "bg-white dark:bg-[#21201C] border border-slate-200 dark:border-[#34332E] text-slate-600 dark:text-[#9C9A91] hover:bg-slate-50 dark:hover:bg-[#2B2A26]"
                }`}
              >
                {cat === "All" ? (t("common.all") || "All") : getWorkspaceCategory(cat, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const isActive = activeProjectId === project.id;
            return (
              <div
                key={project.id}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 bg-white dark:bg-[#21201C] ${
                  isActive
                    ? "border-[#024DA1] dark:border-blue-500 ring-2 ring-[#024DA1]/20 dark:ring-blue-500/20 shadow-md"
                    : "border-slate-200 dark:border-[#34332E] hover:border-slate-300 dark:hover:border-[#42403A] hover:shadow-sm"
                }`}
              >
                <div>
                  {/* Top Badges & Star */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 border border-blue-100 dark:border-[#3D3B35]">
                        {getWorkspaceScheme(project.scheme, language)}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {t("projects.active") || "Active Context"}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleStarProject(project.id)}
                      className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1"
                      title="Star project"
                    >
                      <Star className={`w-4 h-4 ${project.isStarred ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                  </div>

                  {/* Project Title & Description */}
                  <Link href={`/projects/${project.id}`} className="block group-hover:text-[#024DA1] dark:group-hover:text-blue-400 transition-colors">
                    <h3 className="font-bold text-base text-slate-900 dark:text-[#F5F4ED] line-clamp-1">
                      {getWorkspaceName(project, language)}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-[#9C9A91] line-clamp-2 leading-relaxed">
                    {getWorkspaceDesc(project, language)}
                  </p>

                  {/* Pinned Standards */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#2B2A26]">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-[#9C9A91] mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#024DA1] dark:text-blue-400" />
                      <span>Pinned Standards ({project.pinnedStandards.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.pinnedStandards.slice(0, 3).map((std) => (
                        <span
                          key={std}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#2B2A26] text-slate-700 dark:text-[#D4D2C9] border border-slate-200/60 dark:border-[#3D3B35]"
                        >
                          {std}
                        </span>
                      ))}
                      {project.pinnedStandards.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#2B2A26] text-slate-500">
                          +{project.pinnedStandards.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#2B2A26] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9C9A91]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{project.artifacts.length} artifacts</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenInChat(project)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-[#2B2A26] hover:bg-blue-100 dark:hover:bg-[#34332E] text-[#024DA1] dark:text-blue-400 border border-blue-200/60 dark:border-[#3D3B35] transition-colors cursor-pointer"
                      title="Launch chat with this project context"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-[#F5F4ED] hover:bg-slate-800 dark:hover:bg-white text-white dark:text-[#181816] transition-colors"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-[#34332E] bg-white/50 dark:bg-[#21201C]/50">
            <FolderKanban className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-[#F5F4ED]">No projects found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#9C9A91]">
              Try adjusting your search query or create a new compliance project.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#024DA1] text-white hover:bg-[#023a79]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Project</span>
            </button>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#21201C] rounded-2xl shadow-xl border border-slate-200 dark:border-[#34332E] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#34332E]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-[#F5F4ED]">Create Compliance Project</h3>
                  <p className="text-xs text-slate-500 dark:text-[#9C9A91]">Define context, standards, and custom instructions for AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#D4D2C9] mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. EV Battery Swapping Compliance (IS 17855)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] focus:ring-2 focus:ring-[#024DA1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#D4D2C9] mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#D4D2C9] mb-1.5">
                    Target Scheme
                  </label>
                  <select
                    value={newScheme}
                    onChange={(e) => setNewScheme(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]"
                  >
                    <option value="Scheme I (ISI Mark)">Scheme I (ISI Mark)</option>
                    <option value="Scheme II (CRS)">Scheme II (Compulsory Registration)</option>
                    <option value="Scheme IV (Hallmarking)">Scheme IV (Hallmarking)</option>
                    <option value="Scheme X (FMCS)">Scheme X (Foreign Manufacturers)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#D4D2C9] mb-1.5">
                  Pinned Indian Standards (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newStandards}
                  onChange={(e) => setNewStandards(e.target.value)}
                  placeholder="e.g. IS 17855: 2022, IS 16046 (Part 2)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#D4D2C9] mb-1.5">
                  Custom System Instructions (ChatGPT/Claude Style)
                </label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="e.g. We are a Micro-enterprise manufacturing in Pune. Emphasize MSME fee concessions, testing schedules at ARAI/ARCI, and Scheme I audit requirements."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#34332E]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#34332E] text-slate-700 dark:text-[#D4D2C9] hover:bg-slate-100 dark:hover:bg-[#2B2A26]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#024DA1] text-white hover:bg-[#023a79]"
                >
                  Create & Open Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
