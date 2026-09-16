"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FolderKanban,
  ArrowLeft,
  Star,
  BookOpen,
  FileText,
  Sliders,
  Plus,
  Trash2,
  Save,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProjects, Project, ProjectArtifact } from "@/context/ProjectContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  getWorkspaceName,
  getWorkspaceDesc,
  getWorkspaceScheme,
  getWorkspaceCategory,
} from "@/lib/workspaceHelpers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { EliteCitationPill, prepareContentWithCitations, CitationItem } from "@/components/EliteCitationPill";

interface ProjectMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: CitationItem[];
  follow_ups?: string[];
  timestamp: string;
}

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    activeProjectId,
    setActiveProject,
    updateProject,
    deleteProject,
    toggleStarProject,
    pinStandard,
    unpinStandard,
    addArtifact,
    deleteArtifact,
  } = useProjects();
  const { t, language } = useLanguage();

  const project = projects.find((p) => p.id === projectId);

  // Local Editable State
  const [instructions, setInstructions] = useState("");
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);
  const [newStandardInput, setNewStandardInput] = useState("");
  const [activeTab, setActiveTab] = useState<"instructions" | "standards" | "artifacts">("instructions");

  // Artifact Modal
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState(false);
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtType, setNewArtType] = useState<ProjectArtifact["type"]>("checklist");
  const [newArtContent, setNewArtContent] = useState("");
  const [selectedArtifact, setSelectedArtifact] = useState<ProjectArtifact | null>(null);

  // Chat State inside Project
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      setInstructions(project.instructions);
    }
  }, [project]);

  // Initial welcome message for project chat
  useEffect(() => {
    if (project && messages.length === 0) {
      const wsName = getWorkspaceName(project, language);
      const wsScheme = getWorkspaceScheme(project.scheme, language);
      const stdCount = project.pinnedStandards.length;
      const stdList = project.pinnedStandards.join(", ");

      let content = `Hello! I am Mithra, your dedicated compliance assistant for **${wsName}** (${wsScheme}).\n\nI have loaded your custom system instructions and **${stdCount} pinned standards** (${stdList}). How can I assist your certification workflow today?`;
      let follow_ups = [
        "Draft a Scheme I factory audit readiness checklist",
        "Calculate statutory fees with MSME concessions",
        "Which NABL accredited labs test this product?",
      ];

      if (language === "hi") {
        content = `नमस्ते! मैं मित्रा हूँ, **${wsName}** (${wsScheme}) के लिए आपका समर्पित अनुपालन सहायक।\n\nमैंने आपके कस्टम निर्देश और **${stdCount} पिन किए गए मानक** (${stdList}) लोड कर लिए हैं। आज मैं आपके प्रमाणन कार्यप्रणाली में कैसे सहायता कर सकता हूँ?`;
        follow_ups = [
          "फैक्टरी ऑडिट तत्परता चेकलिस्ट तैयार करें",
          "MSME छूट के साथ वैधानिक शुल्क की गणना करें",
          "कौन सी NABL मान्यता प्राप्त प्रयोगशालाएं इस उत्पाद का परीक्षण करती हैं?",
        ];
      } else if (language === "ta") {
        content = `வணக்கம்! நான் மித்ரா, **${wsName}** (${wsScheme}) க்கான உங்கள் பிரத்யேக இணக்க உதவியாளர்.\n\nஉங்கள் தனிப்பயன் வழிமுறைகள் மற்றும் **${stdCount} இணைக்கப்பட்ட தரநிலைகளை** (${stdList}) ஏற்றியுள்ளேன். இன்று உங்கள் சான்றிதழ் பணிக்கு நான் எவ்வாறு உதவ முடியும்?`;
        follow_ups = [
          "தொழிற்சாலை தணிக்கை தயார்நிலை சரிபார்ப்பு பட்டியலை உருவாக்கவும்",
          "MSME சலுகைகளுடன் சட்டப்பூர்வ கட்டணங்களை கணக்கிடுங்கள்",
          "எந்த NABL அங்கீகரிக்கப்பட்ட ஆய்வகங்கள் இந்த தயாரிப்பை சோதிக்கின்றன?",
        ];
      }

      setMessages([
        {
          id: "msg-welcome",
          role: "assistant",
          content,
          follow_ups,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [project, messages.length, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-[#F5F4ED]">Project Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-[#9C9A91]">This project may have been deleted or the link is invalid.</p>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#024DA1] text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Projects</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveInstructions = () => {
    setIsSavingInstructions(true);
    updateProject(project.id, { instructions });
    setTimeout(() => setIsSavingInstructions(false), 600);
  };

  const handleAddStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandardInput.trim()) return;
    pinStandard(project.id, newStandardInput.trim().toUpperCase());
    setNewStandardInput("");
  };

  const handleCreateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;
    addArtifact(project.id, {
      title: newArtTitle.trim(),
      type: newArtType,
      content: newArtContent.trim(),
    });
    setIsArtifactModalOpen(false);
    setNewArtTitle("");
    setNewArtContent("");
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ProjectMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: language || "en",
          context: messages.map((m) => ({ role: m.role, content: m.content })),
          project_context: {
            name: project.name,
            scheme: project.scheme,
            instructions: project.instructions,
            pinnedStandards: project.pinnedStandards,
          },
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();

      const assistantMsg: ProjectMessage = {
        id: "msg-asst-" + Date.now(),
        role: "assistant",
        content: data.answer,
        citations: data.citations,
        follow_ups: data.follow_ups,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg-err-" + Date.now(),
          role: "assistant",
          content: "An error occurred while connecting to the assistant. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]">
      <Navbar />

      {/* Project Top Bar */}
      <div className="border-b border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#21201C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-[#9C9A91] dark:hover:text-[#F5F4ED] hover:bg-slate-100 dark:hover:bg-[#2B2A26] transition-colors"
                title="Back to Projects"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 border border-blue-100 dark:border-[#3D3B35]">
                    {getWorkspaceScheme(project.scheme, language)}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#9C9A91]">•</span>
                  <span className="text-xs text-slate-500 dark:text-[#9C9A91]">{getWorkspaceCategory(project.category, language)}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F4ED] mt-0.5">
                  {getWorkspaceName(project, language)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => toggleStarProject(project.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  project.isStarred
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    : "border-slate-200 dark:border-[#34332E] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
                title="Star project"
              >
                <Star className={`w-4 h-4 ${project.isStarred ? "fill-amber-500" : ""}`} />
              </button>

              <button
                onClick={() => {
                  setActiveProject(project.id);
                  router.push("/chat");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#024DA1] dark:bg-blue-600 hover:bg-[#023a79] dark:hover:bg-blue-500 text-white shadow-sm transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Main Chat</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this project?")) {
                    deleteProject(project.id);
                    router.push("/projects");
                  }
                }}
                className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Responsive Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Knowledge & Instructions (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-[#21201C] rounded-xl border border-slate-200 dark:border-[#34332E]">
            <button
              onClick={() => setActiveTab("instructions")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "instructions"
                  ? "bg-white dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Instructions</span>
            </button>
            <button
              onClick={() => setActiveTab("standards")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "standards"
                  ? "bg-white dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Standards ({project.pinnedStandards.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("artifacts")}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "artifacts"
                  ? "bg-white dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-[#9C9A91] hover:text-slate-900 dark:hover:text-[#F5F4ED]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Artifacts ({project.artifacts.length})</span>
            </button>
          </div>

          {/* Tab 1: System Instructions */}
          {activeTab === "instructions" && (
            <div className="bg-white dark:bg-[#21201C] rounded-2xl border border-slate-200 dark:border-[#34332E] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F4ED]">Custom System Instructions</h3>
                  <p className="text-xs text-slate-500 dark:text-[#9C9A91]">Instructions injected into every AI conversation turn</p>
                </div>
                <button
                  onClick={handleSaveInstructions}
                  disabled={isSavingInstructions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#024DA1] dark:bg-blue-600 text-white hover:bg-[#023a79] disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingInstructions ? "Saved!" : "Save"}</span>
                </button>
              </div>
              <textarea
                rows={8}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Define your enterprise profile, scale, branch jurisdiction, or specific testing priorities..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] font-mono leading-relaxed resize-none focus:ring-2 focus:ring-[#024DA1] dark:focus:ring-blue-500 focus:outline-none"
              />
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-[#9C9A91]">
                <Sparkles className="w-4 h-4 text-[#024DA1] dark:text-blue-400 shrink-0 mt-0.5" />
                <span>Mithra automatically anchors compliance logic, fee concessions, and testing schedules to these instructions.</span>
              </div>
            </div>
          )}

          {/* Tab 2: Pinned Standards */}
          {activeTab === "standards" && (
            <div className="bg-white dark:bg-[#21201C] rounded-2xl border border-slate-200 dark:border-[#34332E] p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F4ED]">Pinned Standards Knowledge Base</h3>
                <p className="text-xs text-slate-500 dark:text-[#9C9A91]">Indian Standards tied to this project</p>
              </div>

              {/* Add Standard Bar */}
              <form onSubmit={handleAddStandard} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newStandardInput}
                  onChange={(e) => setNewStandardInput(e.target.value)}
                  placeholder="e.g. IS 16102 (Part 1)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-[#34332E] bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] focus:outline-none focus:ring-2 focus:ring-[#024DA1]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#024DA1] text-white hover:bg-[#023a79]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Pinned Standards List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {project.pinnedStandards.map((std) => (
                  <div
                    key={std}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-[#34332E] bg-slate-50 dark:bg-[#181816] hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F5F4ED]">{std}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => unpinStandard(project.id, std)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Unpin standard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Artifacts & Notes */}
          {activeTab === "artifacts" && (
            <div className="bg-white dark:bg-[#21201C] rounded-2xl border border-slate-200 dark:border-[#34332E] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F4ED]">Project Artifacts</h3>
                  <p className="text-xs text-slate-500 dark:text-[#9C9A91]">Checklists, fee schedules, and notes</p>
                </div>
                <button
                  onClick={() => setIsArtifactModalOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#024DA1] dark:bg-blue-600 text-white hover:bg-[#023a79]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {project.artifacts.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtifact(art)}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-[#34332E] bg-slate-50 dark:bg-[#181816] hover:border-[#024DA1] dark:hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400">
                        {art.type.replace("_", " ")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteArtifact(project.id, art.id);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F4ED] line-clamp-1">{art.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-[#9C9A91] line-clamp-2">{art.content}</p>
                  </div>
                ))}

                {project.artifacts.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No artifacts saved in this project yet. Click &quot;New Note&quot; to add one.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dedicated Project Chat Assistant (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-[#21201C] rounded-2xl border border-slate-200 dark:border-[#34332E] shadow-sm overflow-hidden h-[640px]">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-[#34332E] bg-slate-50/70 dark:bg-[#181816] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-[#F5F4ED]">
                Project Assistant · {getWorkspaceName(project, language)}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-[#9C9A91]">
              {project.pinnedStandards.length} Standards Injected
            </span>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#2B2A26] border border-blue-200 dark:border-[#3D3B35] flex items-center justify-center text-[#024DA1] dark:text-blue-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#024DA1] text-white rounded-tr-sm"
                      : "bg-slate-50 dark:bg-[#181816] border border-slate-100 dark:border-[#34332E] text-slate-800 dark:text-[#F5F4ED] rounded-tl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (() => {
                    const { processedContent, renderedIds } = prepareContentWithCitations(
                      msg.content,
                      msg.citations
                    );
                    const unrenderedCitations = (msg.citations || []).filter((c, idx) => {
                      const rawId = c.id || `S${idx + 1}`;
                      const cleanId = rawId.replace(/^S/i, "");
                      return (
                        !renderedIds.has(rawId) &&
                        !renderedIds.has(cleanId) &&
                        !renderedIds.has(`S${cleanId}`)
                      );
                    });

                    return (
                      <div className="prose-bis text-[var(--color-text-body)]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ href, children, ...props }) => {
                              if (href && href.startsWith("citation:")) {
                                const rawIds = href
                                  .replace("citation:", "")
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                return <EliteCitationPill ids={rawIds} citations={msg.citations} />;
                              }
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[var(--blue-600)] dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                                  {...props}
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {processedContent}
                        </ReactMarkdown>

                        {/* Unplaced citations shown cleanly as inline pills */}
                        {unrenderedCitations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-1.5">
                            {unrenderedCitations.map((c, i) => (
                              <EliteCitationPill
                                key={i}
                                ids={[c.id || `S${i + 1}`]}
                                citations={msg.citations}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Follow-up suggestions */}
                  {msg.follow_ups && msg.follow_ups.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-[#34332E]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#024DA1] dark:text-blue-400 block mb-1.5">
                        Suggested Project Prompts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.follow_ups.map((fu, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(fu)}
                            className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-[#2B2A26] hover:bg-blue-100 dark:hover:bg-[#34332E] text-[#024DA1] dark:text-blue-400 border border-blue-200/60 dark:border-[#3D3B35] transition-colors"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-1 text-[10px] text-right opacity-60">{msg.timestamp}</div>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#2B2A26] flex items-center justify-center text-slate-700 dark:text-[#F5F4ED] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-slate-400 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#2B2A26] flex items-center justify-center text-[#024DA1] animate-spin">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Mithra is consulting project standards & instructions...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <div className="p-3 border-t border-slate-100 dark:border-[#34332E] bg-white dark:bg-[#21201C]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={language === "hi" ? `${getWorkspaceName(project, language)} में पूछें...` : language === "ta" ? `${getWorkspaceName(project, language)} இல் கேளுங்கள்...` : `Ask within ${project.name}...`}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-[#34332E] bg-slate-50 dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] focus:outline-none focus:ring-2 focus:ring-[#024DA1]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#024DA1] dark:bg-blue-600 hover:bg-[#023a79] disabled:opacity-50 text-white transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Artifact View/Edit Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#21201C] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#34332E] p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#34332E]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-[#2B2A26] text-[#024DA1] dark:text-blue-400">
                  {selectedArtifact.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F4ED] mt-1">{selectedArtifact.title}</h3>
              </div>
              <button
                onClick={() => setSelectedArtifact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 whitespace-pre-wrap text-xs sm:text-sm text-slate-700 dark:text-[#D4D2C9] leading-relaxed font-mono bg-slate-50 dark:bg-[#181816] p-4 rounded-xl border border-slate-100 dark:border-[#34332E]">
              {selectedArtifact.content}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-[#34332E] flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedArtifact.content);
                  alert("Artifact copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#024DA1] text-white hover:bg-[#023a79]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Artifact Modal */}
      {isArtifactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#21201C] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#34332E] p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F4ED] mb-3">Add Project Artifact</h3>
            <form onSubmit={handleCreateArtifact} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newArtTitle}
                  onChange={(e) => setNewArtTitle(e.target.value)}
                  placeholder="e.g. Audit Readiness Checklist"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] mb-1">Type</label>
                <select
                  value={newArtType}
                  onChange={(e) => setNewArtType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED]"
                >
                  <option value="checklist">Checklist</option>
                  <option value="fee_schedule">Fee Schedule</option>
                  <option value="lab_plan">Testing Plan</option>
                  <option value="notes">Notes / Memo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D4D2C9] mb-1">Content *</label>
                <textarea
                  rows={6}
                  required
                  value={newArtContent}
                  onChange={(e) => setNewArtContent(e.target.value)}
                  placeholder="Enter artifact markdown content..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-[#34332E] bg-white dark:bg-[#181816] text-slate-900 dark:text-[#F5F4ED] font-mono resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsArtifactModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#34332E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#024DA1] text-white"
                >
                  Save Artifact
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
