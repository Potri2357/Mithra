"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProjectArtifact {
  id: string;
  title: string;
  type: "checklist" | "fee_schedule" | "legal_notice" | "lab_plan" | "notes";
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  scheme: string;
  instructions: string;
  pinnedStandards: string[];
  artifacts: ProjectArtifact[];
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string | null;
  setActiveProject: (id: string | null) => void;
  createProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "artifacts"> & { artifacts?: ProjectArtifact[] }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleStarProject: (id: string) => void;
  pinStandard: (projectId: string, standardCode: string) => void;
  unpinStandard: (projectId: string, standardCode: string) => void;
  addArtifact: (projectId: string, artifact: Omit<ProjectArtifact, "id" | "createdAt">) => void;
  deleteArtifact: (projectId: string, artifactId: string) => void;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "smart-meter-is16444",
    name: "Smart Meter & Power Equipment (IS 16444)",
    description: "End-to-end BIS Scheme I certification workflow for domestic AC static smart electricity meters with cellular/RF modules.",
    category: "Electrical & Electronics",
    scheme: "Scheme I (ISI Mark)",
    instructions: "You are the dedicated compliance advisor for this smart meter manufacturing project. The enterprise is a Micro-scale MSME located in Tamil Nadu. Always reference IS 16444 (Part 1) clauses, tamper-proof testing requirements, statutory 20% marking fee concessions, and testing schedules with CPRI and ERDA.",
    pinnedStandards: ["IS 16444 (Part 1): 2015", "IS 13779: 1999", "IS 15885 (Part 2/Sec 13)"],
    isStarred: true,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-14T15:30:00Z",
    artifacts: [
      {
        id: "art-sm-1",
        title: "Scheme I Factory Audit Readiness Checklist",
        type: "checklist",
        content: `### Factory Inspection Readiness — IS 16444 (Part 1)
1. In-house testing laboratory with calibrated reference standard power meters (Class 0.2 accuracy).
2. High-voltage surge generator (up to 6kV impulse withstand test).
3. Climate chamber for thermal endurance cycling (-10°C to +55°C).
4. Raw material test certificates for meter enclosure (polycarbonate, glow-wire test to IS 11000).
5. Quality manual documenting ISO 9001:2015 alignment and BIS STI (Scheme of Testing and Inspection).`,
        createdAt: "2026-09-02T11:00:00Z",
      },
      {
        id: "art-sm-2",
        title: "Statutory Cost & Concession Sheet",
        type: "fee_schedule",
        content: `### Statutory Cost Estimation (Micro Enterprise)
- Application Fee: ₹1,000
- Processing Fee: ₹7,000
- Factory Audit Fee: ₹3,500 (50% MSME concession applied)
- Complete Lab Type Testing: ₹85,000 – ₹1,20,000 (at CPRI Bangalore)
- Annual Marking Fee: ₹80,000 gross → ₹64,000 net (20% MSME statutory concession)`,
        createdAt: "2026-09-05T14:20:00Z",
      },
    ],
  },
  {
    id: "gold-hallmarking-compliance",
    name: "Retail Gold Jewellery Hallmarking & HUID",
    description: "6-digit HUID tracking, karatage assaying compliance, and jeweller registration portal requirements under Scheme IV.",
    category: "Precious Metals & Jewellery",
    scheme: "Scheme IV (Hallmarking)",
    instructions: "You are the Hallmarking compliance specialist for a retail jeweller network. Enforce IS 1417:2016 purity standards (22K916, 18K750, 14K585). Remind that selling un-hallmarked gold in notified mandatory districts attracts penalties under Section 29 of the BIS Act 2016 (fine up to 5x value of article or 1 year imprisonment).",
    pinnedStandards: ["IS 1417: 2016", "IS 2112: 2014", "IS 15820: 2009"],
    isStarred: true,
    createdAt: "2026-09-03T09:00:00Z",
    updatedAt: "2026-09-12T18:00:00Z",
    artifacts: [
      {
        id: "art-gh-1",
        title: "AHC Center Assaying & HUID Submission Guide",
        type: "checklist",
        content: `### Standard Operating Procedure for AHC Hallmarking
1. Segregate jewellery by gold fineness (916, 750, 585).
2. Generate online delivery challan via BIS e-Hallmarking portal.
3. Submit samples to NABL-accredited Assaying & Hallmarking Centre.
4. XRF screening followed by Fire Assay confirmatory testing.
5. Laser engraving of 3 marks: BIS Triangle Logo, Purity (22K916), and 6-digit unique alphanumeric HUID.`,
        createdAt: "2026-09-04T12:00:00Z",
      },
    ],
  },
  {
    id: "toys-safety-qco-2026",
    name: "Toy Safety QCO 2026 Mandate",
    description: "Mandatory safety testing for domestic and imported toys under the Toys (Quality Control) Order.",
    category: "Consumer Goods & Toys",
    scheme: "Scheme I (ISI Mark - Mandatory)",
    instructions: "You are the safety & regulatory auditor for toy manufacturing. Under the Toys QCO, no toy can be sold in India without the ISI mark. Emphasize IS 9873 parts (mechanical, flammability, heavy metal migration) and IS 15644 for electric toys. Highlight the 20% MSME fee concession.",
    pinnedStandards: ["IS 9873 (Part 1): 2019", "IS 9873 (Part 2): 2017", "IS 9873 (Part 3): 2020", "IS 15644: 2006"],
    isStarred: false,
    createdAt: "2026-09-05T14:00:00Z",
    updatedAt: "2026-09-10T16:45:00Z",
    artifacts: [
      {
        id: "art-ty-1",
        title: "Chemical Migration & Physical Safety Test Matrix",
        type: "lab_plan",
        content: `### Mandatory Testing Parameters under IS 9873
- Part 1: Physical & Mechanical Hazards (small parts test for children <36 months, sharp edge torque/tension).
- Part 2: Flammability (flame spread velocity limit: <30 mm/s).
- Part 3: Toxic Elements Migration (Antimony, Arsenic, Barium, Cadmium, Chromium, Lead, Mercury, Selenium).
- Electric Toys: IS 15644 (insulation resistance, electric strength, moisture resistance).`,
        createdAt: "2026-09-06T09:30:00Z",
      },
    ],
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("mithra-projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
      const savedActiveId = localStorage.getItem("mithra-active-project-id");
      if (savedActiveId) {
        setActiveProjectId(savedActiveId);
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, []);

  // Save projects to localStorage
  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem("mithra-projects", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSetActiveProject = (id: string | null) => {
    setActiveProjectId(id);
    try {
      if (id) {
        localStorage.setItem("mithra-active-project-id", id);
      } else {
        localStorage.removeItem("mithra-active-project-id");
      }
    } catch {
      // Ignore
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  const createProject = (data: Omit<Project, "id" | "createdAt" | "updatedAt" | "artifacts"> & { artifacts?: ProjectArtifact[] }): Project => {
    const newProject: Project = {
      ...data,
      id: "proj-" + Date.now(),
      artifacts: data.artifacts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProject, ...projects];
    saveProjects(updated);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    saveProjects(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    if (activeProjectId === id) {
      handleSetActiveProject(null);
    }
    saveProjects(updated);
  };

  const toggleStarProject = (id: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, isStarred: !p.isStarred } : p));
    saveProjects(updated);
  };

  const pinStandard = (projectId: string, standardCode: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.pinnedStandards.includes(standardCode)) return;
    const updated = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            pinnedStandards: [...p.pinnedStandards, standardCode],
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    saveProjects(updated);
  };

  const unpinStandard = (projectId: string, standardCode: string) => {
    const updated = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            pinnedStandards: p.pinnedStandards.filter((s) => s !== standardCode),
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    saveProjects(updated);
  };

  const addArtifact = (projectId: string, artifact: Omit<ProjectArtifact, "id" | "createdAt">) => {
    const newArtifact: ProjectArtifact = {
      ...artifact,
      id: "art-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            artifacts: [newArtifact, ...p.artifacts],
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    saveProjects(updated);
  };

  const deleteArtifact = (projectId: string, artifactId: string) => {
    const updated = projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            artifacts: p.artifacts.filter((a) => a.id !== artifactId),
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    saveProjects(updated);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectId,
        setActiveProject: handleSetActiveProject,
        createProject,
        updateProject,
        deleteProject,
        toggleStarProject,
        pinStandard,
        unpinStandard,
        addArtifact,
        deleteArtifact,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
