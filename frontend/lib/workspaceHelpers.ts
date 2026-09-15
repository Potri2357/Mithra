import { SupportedLanguage, translations } from "@/lib/i18n";
import { Project } from "@/context/ProjectContext";
import { ShieldCheck, Calculator, FlaskConical, Award } from "lucide-react";

export function getWorkspaceName(project: { id: string; name: string }, lang: SupportedLanguage): string {
  if (!project) return "";
  const key = `project.${project.id}.name`;
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return project.name;
}

export function getWorkspaceDesc(project: { id: string; description: string }, lang: SupportedLanguage): string {
  if (!project) return "";
  const key = `project.${project.id}.desc`;
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return project.description;
}

const CATEGORY_MAP: Record<string, { hi: string; ta: string }> = {
  "Electrical & Electronics": {
    hi: "विद्युत और इलेक्ट्रॉनिक्स",
    ta: "மின்னியல் & மின்னணுவியல்",
  },
  "Precious Metals & Jewellery": {
    hi: "कीमती धातुएं और आभूषण",
    ta: "விலைமதிப்பற்ற உலோகங்கள் & நகைகள்",
  },
  "Consumer Goods & Toys": {
    hi: "उपभोक्ता वस्तुएं और खिलौने",
    ta: "நுகர்வோர் பொருட்கள் & பொம்மைகள்",
  },
  "Automotive & Mechanical": {
    hi: "ऑटोमोटिव और मैकेनिकल",
    ta: "தானியங்கி & இயந்திரவியல்",
  },
  "Chemicals": {
    hi: "रसायन",
    ta: "வேதிப்பொருட்கள்",
  },
};

export function getWorkspaceCategory(category: string, lang: SupportedLanguage): string {
  if (lang === "en" || !category) return category;
  return CATEGORY_MAP[category]?.[lang] || category;
}

const SCHEME_MAP: Record<string, { hi: string; ta: string }> = {
  "Scheme I (ISI Mark)": {
    hi: "स्कीम I (आईएसआई मार्क)",
    ta: "திட்டம் I (ISI முத்திரை)",
  },
  "Scheme I (ISI Mark - Mandatory)": {
    hi: "स्कीम I (आईएसआई मार्क - अनिवार्य)",
    ta: "திட்டம் I (ISI முத்திரை - கட்டாயம்)",
  },
  "Scheme IV (Hallmarking)": {
    hi: "स्कीम IV (हॉलमार्किंग)",
    ta: "திட்டம் IV (ஹால்மார்க்கிங்)",
  },
  "Scheme II (CRS)": {
    hi: "स्कीम II (सीआरएस)",
    ta: "திட்டம் II (CRS)",
  },
};

export function getWorkspaceScheme(scheme: string, lang: SupportedLanguage): string {
  if (lang === "en" || !scheme) return scheme;
  return SCHEME_MAP[scheme]?.[lang] || scheme;
}

export interface QuickStartCard {
  title: string;
  desc: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export function getQuickStartCards(lang: SupportedLanguage): QuickStartCard[] {
  if (lang === "hi") {
    return [
      {
        title: "अनिवार्य ISI योजनाएं जांचें",
        desc: "जांचें कि क्या आपका उत्पाद अनिवार्य BIS प्रमाणन के अंतर्गत आता है",
        query: "कौन से उत्पाद अनिवार्य बीआईएस स्कीम I प्रमाणन के अंतर्गत आते हैं?",
        icon: ShieldCheck,
        color: "text-[#005EB8] dark:text-[#E6E4DD]",
        bg: "bg-blue-50 dark:bg-[#2B2A26]",
      },
      {
        title: "MSME अंकन शुल्क की गणना करें",
        desc: "सूक्ष्म और लघु उद्यमों के लिए 50% ऑडिट और 20% अंकन छूट",
        query: "सूक्ष्म उद्यमों के लिए बीआईएस आवेदन और वार्षिक अंकन शुल्क की गणना करें",
        icon: Calculator,
        color: "text-[#059669] dark:text-[#E6E4DD]",
        bg: "bg-emerald-50 dark:bg-[#2B2A26]",
      },
      {
        title: "हॉलमार्क और HUID सत्यापित करें",
        desc: "6-वर्ण के सोने के हॉलमार्क की प्रामाणिकता जांचें",
        query: "मैं 6-अंकीय सोने के हॉलमार्क HUID कोड को कैसे सत्यापित करूँ?",
        icon: Award,
        color: "text-[#D97706] dark:text-[#E6E4DD]",
        bg: "bg-amber-50 dark:bg-[#2B2A26]",
      },
      {
        title: "मान्यता प्राप्त परीक्षण प्रयोगशालाएं",
        desc: "आस-पास NABL और BIS परीक्षण सुविधाएं खोजें",
        query: "एलईडी लैंप या बिजली के सामान के परीक्षण के लिए मान्यता प्राप्त प्रयोगशालाएं खोजें",
        icon: FlaskConical,
        color: "text-[#7C3AED] dark:text-[#E6E4DD]",
        bg: "bg-purple-50 dark:bg-[#2B2A26]",
      },
    ];
  }

  if (lang === "ta") {
    return [
      {
        title: "கட்டாய ISI திட்டங்களை சரிபார்க்கவும்",
        desc: "உங்கள் தயாரிப்பு கட்டாய BIS சான்றிதழின் கீழ் வருகிறதா என சரிபார்க்கவும்",
        query: "கட்டாய BIS திட்டம் I சான்றிதழின் கீழ் வரும் தயாரிப்புகள் யாவை?",
        icon: ShieldCheck,
        color: "text-[#005EB8] dark:text-[#E6E4DD]",
        bg: "bg-blue-50 dark:bg-[#2B2A26]",
      },
      {
        title: "MSME முத்திரை கட்டணத்தை கணக்கிடுங்கள்",
        desc: "குறு & சிறு நிறுவனங்களுக்கு 50% தணிக்கை & 20% முத்திரை சலுகைகள்",
        query: "மைக்ரோ நிறுவனங்களுக்கான BIS விண்ணப்பம் மற்றும் வருடாந்திர முத்திரை கட்டணத்தை கணக்கிடுங்கள்",
        icon: Calculator,
        color: "text-[#059669] dark:text-[#E6E4DD]",
        bg: "bg-emerald-50 dark:bg-[#2B2A26]",
      },
      {
        title: "ஹால்மார்க் & HUID சரிபார்க்கவும்",
        desc: "6 இலக்க தங்க ஹால்மார்க் உண்மைத்தன்மையை சரிபார்க்கவும்",
        query: "6 இலக்க தங்க ஹால்மார்க் HUID குறியீட்டை எவ்வாறு சரிபார்ப்பது?",
        icon: Award,
        color: "text-[#D97706] dark:text-[#E6E4DD]",
        bg: "bg-amber-50 dark:bg-[#2B2A26]",
      },
      {
        title: "அங்கீகரிக்கப்பட்ட சோதனை ஆய்வகங்கள்",
        desc: "அருகிலுள்ள NABL & BIS சோதனை வசதிகளைக் கண்டறியவும்",
        query: "LED விளக்குகள் அல்லது மின் சாதனங்களை சோதிப்பதற்கான அங்கீகரிக்கப்பட்ட ஆய்வகங்களைக் கண்டறியவும்",
        icon: FlaskConical,
        color: "text-[#7C3AED] dark:text-[#E6E4DD]",
        bg: "bg-purple-50 dark:bg-[#2B2A26]",
      },
    ];
  }

  return [
    {
      title: "Check Mandatory ISI Schemes",
      desc: "Verify if your product falls under mandatory BIS certification",
      query: "Which products fall under mandatory BIS Scheme I certification?",
      icon: ShieldCheck,
      color: "text-[#005EB8] dark:text-[#E6E4DD]",
      bg: "bg-blue-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Calculate MSME Marking Fee",
      desc: "50% audit & 20% marking concessions for micro & small enterprises",
      query: "Calculate application and annual marking fees for micro enterprise under BIS Scheme I",
      icon: Calculator,
      color: "text-[#059669] dark:text-[#E6E4DD]",
      bg: "bg-emerald-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Verify Hallmark & HUID",
      desc: "Decode 6-character gold hallmark authenticity",
      query: "How do I verify a 6-digit gold hallmark HUID code?",
      icon: Award,
      color: "text-[#D97706] dark:text-[#E6E4DD]",
      bg: "bg-amber-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Accredited Testing Labs",
      desc: "Locate NABL & BIS testing facilities nearby",
      query: "Find accredited laboratories for testing LED lamps or electrical items",
      icon: FlaskConical,
      color: "text-[#7C3AED] dark:text-[#E6E4DD]",
      bg: "bg-purple-50 dark:bg-[#2B2A26]",
    },
  ];
}

export function getWorkspaceGemStarters(
  project: { id: string; name: string; scheme: string; pinnedStandards?: string[] },
  lang: SupportedLanguage
): QuickStartCard[] {
  const wsName = getWorkspaceName(project, lang);
  const wsScheme = getWorkspaceScheme(project.scheme, lang);
  const standards = project.pinnedStandards?.join(", ") || wsName;

  if (lang === "hi") {
    return [
      {
        title: "फैक्टरी ऑडिट तत्परता",
        desc: `${wsScheme} के तहत ऑडिट आवश्यकताओं की जाँच करें`,
        query: `${wsScheme} के तहत ${wsName} के लिए एक व्यापक फैक्टरी ऑडिट तत्परता चेकलिस्ट तैयार करें।`,
        icon: ShieldCheck,
        color: "text-[#005EB8] dark:text-[#E6E4DD]",
        bg: "bg-blue-50 dark:bg-[#2B2A26]",
      },
      {
        title: "वैधानिक लागत और छूट",
        desc: "आवेदन, ऑडिट और अंकन शुल्क का अनुमान लगाएं",
        query: `${wsName} के लिए वैधानिक प्रमाणन लागत और MSME छूट की गणना करें।`,
        icon: Calculator,
        color: "text-[#059669] dark:text-[#E6E4DD]",
        bg: "bg-emerald-50 dark:bg-[#2B2A26]",
      },
      {
        title: "अनिवार्य परीक्षण पैरामीटर",
        desc: "खंड-वार प्रयोगशाला परीक्षण विवरण",
        query: `${standards} के लिए अनिवार्य प्रयोगशाला परीक्षण पैरामीटर और पास/फेल मानदंड क्या हैं?`,
        icon: FlaskConical,
        color: "text-[#7C3AED] dark:text-[#E6E4DD]",
        bg: "bg-purple-50 dark:bg-[#2B2A26]",
      },
      {
        title: "दस्तावेज़ीकरण और STI नियम",
        desc: "गुणवत्ता मैनुअल और परीक्षण व निरीक्षण योजना",
        query: `${wsName} के लिए आवश्यक दस्तावेज़ीकरण और परीक्षण व निरीक्षण योजना (STI) की व्याख्या करें।`,
        icon: Award,
        color: "text-[#D97706] dark:text-[#E6E4DD]",
        bg: "bg-amber-50 dark:bg-[#2B2A26]",
      },
    ];
  }

  if (lang === "ta") {
    return [
      {
        title: "தொழிற்சாலை தணிக்கை தயார்நிலை",
        desc: `${wsScheme} கீழ் தணிக்கை தேவைகளை சரிபார்க்கவும்`,
        query: `${wsScheme} கீழ் ${wsName} க்கான விரிவான தொழிற்சாலை தணிக்கை தயார்நிலை சரிபார்ப்பு பட்டியலை உருவாக்கவும்.`,
        icon: ShieldCheck,
        color: "text-[#005EB8] dark:text-[#E6E4DD]",
        bg: "bg-blue-50 dark:bg-[#2B2A26]",
      },
      {
        title: "சட்டப்பூர்வ கட்டணம் & சலுகைகள்",
        desc: "விண்ணப்பம், தணிக்கை மற்றும் முத்திரை கட்டணங்களை மதிப்பிடவும்",
        query: `${wsName} க்கான சட்டப்பூர்வ சான்றிதழ் செலவுகள் மற்றும் MSME சலுகைகளை கணக்கிடுங்கள்.`,
        icon: Calculator,
        color: "text-[#059669] dark:text-[#E6E4DD]",
        bg: "bg-emerald-50 dark:bg-[#2B2A26]",
      },
      {
        title: "கட்டாய சோதனை அளவுருக்கள்",
        desc: "விதிமுறை வாரியான ஆய்வக சோதனை விளக்கம்",
        query: `${standards} க்கான கட்டாய ஆய்வக சோதனை அளவுருக்கள் மற்றும் தேர்ச்சி/தோல்வி அளவுகோல்கள் என்ன?`,
        icon: FlaskConical,
        color: "text-[#7C3AED] dark:text-[#E6E4DD]",
        bg: "bg-purple-50 dark:bg-[#2B2A26]",
      },
      {
        title: "ஆவணப்படுத்தல் & STI விதிகள்",
        desc: "தர கையேடு மற்றும் சோதனை & ஆய்வுத் திட்டம்",
        query: `${wsName} க்கு தேவையான ஆவணங்கள் மற்றும் சோதனை & ஆய்வுத் திட்டத்தை (STI) விளக்குங்கள்.`,
        icon: Award,
        color: "text-[#D97706] dark:text-[#E6E4DD]",
        bg: "bg-amber-50 dark:bg-[#2B2A26]",
      },
    ];
  }

  return [
    {
      title: "Factory Audit Readiness",
      desc: `Check audit requirements under ${project.scheme}`,
      query: `Draft a comprehensive factory audit readiness checklist for ${project.name} under ${project.scheme}.`,
      icon: ShieldCheck,
      color: "text-[#005EB8] dark:text-[#E6E4DD]",
      bg: "bg-blue-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Statutory Cost & Concessions",
      desc: "Estimate application, audit & marking fees",
      query: `Calculate the statutory certification costs and MSME concessions for ${project.name}.`,
      icon: Calculator,
      color: "text-[#059669] dark:text-[#E6E4DD]",
      bg: "bg-emerald-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Mandatory Testing Parameters",
      desc: "Clause-by-clause lab testing breakdown",
      query: `What are the mandatory laboratory testing parameters and pass/fail criteria for ${project.pinnedStandards?.join(", ") || project.name}?`,
      icon: FlaskConical,
      color: "text-[#7C3AED] dark:text-[#E6E4DD]",
      bg: "bg-purple-50 dark:bg-[#2B2A26]",
    },
    {
      title: "Documentation & STI Rules",
      desc: "Quality manual and Scheme of Testing & Inspection",
      query: `Explain the documentation and Scheme of Testing & Inspection (STI) required for ${project.name}.`,
      icon: Award,
      color: "text-[#D97706] dark:text-[#E6E4DD]",
      bg: "bg-amber-50 dark:bg-[#2B2A26]",
    },
  ];
}
