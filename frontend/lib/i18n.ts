export type SupportedLanguage = "en" | "hi" | "ta";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
  };
}

export const translations: TranslationDictionary = {
  // ─── Brand & Common ───
  "brand.title": {
    en: "Mithra",
    hi: "मित्रा",
    ta: "மித்ரா",
  },
  "brand.subtitle": {
    en: "Bureau of Indian Standards",
    hi: "भारतीय मानक ब्यूरो",
    ta: "இந்திய தரநிலைகள் பணியகம்",
  },
  "brand.tagline": {
    en: "Official conversational standards intelligence platform for 22,000+ Indian Standards, Quality Control Orders (QCOs), certification schemes, and accredited laboratories.",
    hi: "22,000+ भारतीय मानकों, गुणवत्ता नियंत्रण आदेशों (QCO), प्रमाणन योजनाओं और मान्यता प्राप्त प्रयोगशालाओं के लिए आधिकारिक वार्तालाप मानक खुफिया मंच।",
    ta: "22,000+ இந்திய தரநிலைகள், தரக்கட்டுப்பாட்டு ஆணைகள் (QCO), சான்றிதழ் திட்டங்கள் மற்றும் அங்கீகரிக்கப்பட்ட ஆய்வகங்களுக்கான அதிகாரப்பூர்வ தகவல் தளம்.",
  },

  "common.disclaimer": {
    en: "Informational guidance only. Verify with your nearest BIS branch office for formal certification decisions.",
    hi: "केवल सूचनात्मक मार्गदर्शन। औपचारिक प्रमाणन निर्णयों के लिए अपने निकटतम बीआईएस शाखा कार्यालय से सत्यापन करें।",
    ta: "தகவல் வழிகாட்டுதலுக்கு மட்டுமே. முறையான சான்றிதழ் முடிவுகளுக்கு உங்கள் அருகிலுள்ள BIS அலுவலகத்தை அணுகவும்.",
  },
  "common.search": {
    en: "Search",
    hi: "खोजें",
    ta: "தேடுக",
  },
  "common.filter": {
    en: "Filter",
    hi: "फ़िल्टर",
    ta: "வடிகட்டு",
  },
  "common.all": {
    en: "All",
    hi: "सभी",
    ta: "அனைத்தும்",
  },
  "common.loading": {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    ta: "ஏற்றப்படுகிறது...",
  },
  "common.copy": {
    en: "Copy",
    hi: "कॉपी करें",
    ta: "நகலெடு",
  },
  "common.copied": {
    en: "Copied!",
    hi: "कॉपी हो गया!",
    ta: "நகலெடுக்கப்பட்டது!",
  },
  "common.back": {
    en: "Back",
    hi: "वापस",
    ta: "பின்செல்",
  },
  "common.next": {
    en: "Next",
    hi: "आगे",
    ta: "அடுத்து",
  },
  "common.reset": {
    en: "Reset",
    hi: "रीसेट करें",
    ta: "மீட்டமை",
  },
  "common.submit": {
    en: "Submit",
    hi: "जमा करें",
    ta: "சமர்ப்பி",
  },
  "common.viewDetails": {
    en: "View Details",
    hi: "विवरण देखें",
    ta: "விவரங்களை காண்க",
  },
  "common.askMithra": {
    en: "Ask Mithra",
    hi: "मित्रा से पूछें",
    ta: "மித்ராவிடம் கேளுங்கள்",
  },

  // ─── Navbar ───
  "nav.standards": {
    en: "Standards",
    hi: "मानक",
    ta: "தரநிலைகள்",
  },
  "nav.schemes": {
    en: "Schemes",
    hi: "योजनाएं",
    ta: "திட்டங்கள்",
  },
  "nav.labs": {
    en: "Labs Directory",
    hi: "प्रयोगशालाएं",
    ta: "ஆய்வகங்கள்",
  },
  "nav.hallmark": {
    en: "Hallmark & HUID",
    hi: "हॉलमार्क और HUID",
    ta: "ஹால்மார்க் & HUID",
  },
  "nav.consumer": {
    en: "Consumer Grievance",
    hi: "उपभोक्ता शिकायत",
    ta: "நுகர்வோர் குறைதீர்ப்பு",
  },
  "nav.portals": {
    en: "Portals",
    hi: "पोर्टल",
    ta: "போர்ட்டல்கள்",
  },
  "nav.tools": {
    en: "Tools",
    hi: "उपकरण",
    ta: "கருவிகள்",
  },
  "nav.estimator": {
    en: "Fee Estimator",
    hi: "शुल्क अनुमानक",
    ta: "கட்டண கணிப்பான்",
  },
  "nav.complaintDrafter": {
    en: "Complaint Drafter",
    hi: "शिकायत ड्राफ्टर",
    ta: "புகார் வரைவாளர்",
  },
  "nav.whatsapp": {
    en: "WhatsApp Bot",
    hi: "व्हाट्सएप बॉट",
    ta: "வாட்ஸ்அப் பாட்",
  },
  "nav.projects": {
    en: "Workspaces",
    hi: "वर्कस्पेस",
    ta: "பணியிடங்கள்",
  },
  "nav.chatAssistant": {
    en: "AI Assistant",
    hi: "एआई सहायक",
    ta: "AI உதவியாளர்",
  },
  // ─── Projects Workspace ───
  "projects.title": {
    en: "Compliance Workspaces",
    hi: "अनुपालन वर्कस्पेस",
    ta: "இணக்க பணியிடங்கள்",
  },
  "projects.subtitle": {
    en: "Dedicated workspace containers inspired by Claude & ChatGPT. Group standards, custom instructions, artifacts, and compliance conversations for your products.",
    hi: "क्लॉड और चैटजीपीटी से प्रेरित समर्पित वर्कस्पेस। अपने उत्पादों के लिए मानक, कस्टम निर्देश, आर्टिफैक्ट्स और अनुपालन बातचीत को समूहीकृत करें।",
    ta: "க்ளூட் மற்றும் சாட்ஜிபிடியால் ஈர்க்கப்பட்ட பிரத்யேக பணியிடம். உங்கள் தயாரிப்புகளுக்கான தரநிலைகள், தனிப்பயன் அறிவுறுத்தல்கள் மற்றும் இணக்க உரையாடல்களை ஒழுங்கமைக்கவும்.",
  },
  "projects.newProject": {
    en: "New Workspace",
    hi: "नया वर्कस्पेस",
    ta: "புதிய பணியிடம்",
  },
  "projects.openWorkspace": {
    en: "Open Workspace",
    hi: "वर्कस्पेस खोलें",
    ta: "பணியிடத்தை திற",
  },
  "projects.customInstructions": {
    en: "Custom System Instructions",
    hi: "कस्टम सिस्टम निर्देश",
    ta: "தனிப்பயன் அமைப்பு வழிமுறைகள்",
  },
  "projects.pinnedStandards": {
    en: "Pinned Standards",
    hi: "पिन किए गए मानक",
    ta: "இணைக்கப்பட்ட தரநிலைகள்",
  },
  "projects.artifacts": {
    en: "Project Artifacts & Notes",
    hi: "प्रोजेक्ट आर्टिफैक्ट्स और नोट्स",
    ta: "திட்ட ஆவணங்கள் & குறிப்புகள்",
  },
  "projects.workspaces": {
    en: "Workspaces",
    hi: "वर्कस्पेस",
    ta: "பணியிடங்கள்",
  },
  "projects.new": {
    en: "New",
    hi: "नया",
    ta: "புதிய",
  },
  "projects.active": {
    en: "Active",
    hi: "सक्रिय",
    ta: "செயலில்",
  },
  "projects.newChatInWorkspace": {
    en: "New chat in workspace",
    hi: "वर्कस्पेस में नई चैट",
    ta: "பணியிடத்தில் புதிய அரட்டை",
  },
  "projects.noChatsInWorkspace": {
    en: "No chats yet in this workspace. Click above to start.",
    hi: "इस वर्कस्पेस में अभी तक कोई चैट नहीं है। शुरू करने के लिए ऊपर क्लिक करें।",
    ta: "இந்தப் பணியிடத்தில் இன்னும் உரையாடல்கள் இல்லை. தொடங்க மேலே கிளிக் செய்யவும்.",
  },
  "projects.activeWorkspace": {
    en: "Active Workspace",
    hi: "सक्रिय वर्कस्पेस",
    ta: "செயலில் உள்ள பணியிடம்",
  },
  "projects.exitWorkspace": {
    en: "Exit workspace context",
    hi: "वर्कस्पेस से बाहर निकलें",
    ta: "பணியிடத்திலிருந்து வெளியேறு",
  },
  "projects.workspaceGem": {
    en: "WORKSPACE GEM",
    hi: "वर्कस्पेस जेम",
    ta: "பணியிட ஜெம்",
  },
  "projects.workspaceQuickStarts": {
    en: "Workspace Quick-Starts",
    hi: "वर्कस्पेस त्वरित शुरुआत",
    ta: "பணியிட விரைவு தொடக்கங்கள்",
  },
  "projects.createWorkspaceTitle": {
    en: "Create New Compliance Workspace",
    hi: "नया अनुपालन वर्कस्पेस बनाएं",
    ta: "புதிய இணக்க பணியிடத்தை உருவாக்கவும்",
  },
  "projects.createWorkspaceSubtitle": {
    en: "Pin dedicated standards & custom instructions to this chatbot workspace",
    hi: "इस चैटबॉट वर्कस्पेस में समर्पित मानक और कस्टम निर्देश पिन करें",
    ta: "இந்த சாட்பாட் பணியிடத்தில் பிரத்யேக தரநிலைகள் மற்றும் தனிப்பயன் வழிமுறைகளை இணைக்கவும்",
  },
  "projects.workspaceName": {
    en: "Workspace Name",
    hi: "वर्कस्पेस का नाम",
    ta: "பணியிடத்தின் பெயர்",
  },
  "projects.workspaceCategory": {
    en: "Industry / Sector",
    hi: "उद्योग / क्षेत्र",
    ta: "தொழில் / துறை",
  },
  "projects.workspaceScheme": {
    en: "Certification Scheme",
    hi: "प्रमाणन योजना",
    ta: "சான்றிதழ் திட்டம்",
  },
  "projects.createWorkspaceBtn": {
    en: "Create Workspace",
    hi: "वर्कस्पेस बनाएं",
    ta: "பணியிடத்தை உருவாக்கவும்",
  },

  // ── Pre-defined Workspace Names & Descriptions ──
  "project.smart-meter-is16444.name": {
    en: "Smart Meter & Power Equipment (IS 16444)",
    hi: "स्मार्ट मीटर और विद्युत उपकरण (IS 16444)",
    ta: "ஸ்மார்ட் மீட்டர் & மின்கருவிகள் (IS 16444)",
  },
  "project.smart-meter-is16444.desc": {
    en: "End-to-end BIS Scheme I certification workflow for domestic AC static smart electricity meters with cellular/RF modules.",
    hi: "सेल्युलर/आरएफ मॉड्यूल वाले घरेलू एसी स्थिर स्मार्ट बिजली मीटरों के लिए संपूर्ण बीआईएस स्कीम I प्रमाणन कार्यप्रणाली।",
    ta: "செல்லுலார்/RF தொகுதிகள் கொண்ட வீட்டு AC நிலையான ஸ்மார்ட் மின்சார மீட்டர்களுக்கான முழுமையான BIS திட்டம் I சான்றிதழ் பணிப்பாய்வு.",
  },
  "project.gold-hallmarking-compliance.name": {
    en: "Retail Gold Jewellery Hallmarking & HUID",
    hi: "खुदरा स्वर्ण आभूषण हॉलमार्किंग और HUID",
    ta: "சில்லறை தங்க நகை ஹால்மார்க்கிங் & HUID",
  },
  "project.gold-hallmarking-compliance.desc": {
    en: "6-digit HUID tracking, karatage assaying compliance, and jeweller registration portal requirements under Scheme IV.",
    hi: "स्कीम IV के तहत 6-अंकीय HUID ट्रैकिंग, कैरेट परख अनुपालन, और जौहरी पंजीकरण पोर्टल आवश्यकताएं।",
    ta: "திட்டம் IV இன் கீழ் 6-இலக்க HUID கண்காணிப்பு, காரட் சோதனை இணக்கம் மற்றும் நகைக்கடை பதிவு போர்டல் தேவைகள்.",
  },
  "project.toys-safety-qco-2026.name": {
    en: "Toy Safety QCO 2026 Mandate",
    hi: "खिलौना सुरक्षा QCO 2026 शासनादेश",
    ta: "பொம்மை பாதுகாப்பு QCO 2026 ஆணை",
  },
  "project.toys-safety-qco-2026.desc": {
    en: "Mandatory safety testing for domestic and imported toys under the Toys (Quality Control) Order.",
    hi: "खिलौने (गुणवत्ता नियंत्रण) आदेश के तहत घरेलू और आयातित खिलौनों के लिए अनिवार्य सुरक्षा परीक्षण।",
    ta: "பொம்மைகள் (தரக் கட்டுப்பாடு) ஆணையின் கீழ் உள்நாட்டு மற்றும் இறக்குமதி செய்யப்பட்ட பொம்மைகளுக்கான கட்டாய பாதுகாப்பு சோதனை.",
  },
  "nav.searchPlaceholder": {
    en: "Search standard (e.g. IS 14543), product, or scheme...",
    hi: "मानक (जैसे IS 14543), उत्पाद या योजना खोजें...",
    ta: "தரநிலை (எ.கா. IS 14543), தயாரிப்பு அல்லது திட்டம் தேடுக...",
  },
  "nav.switchLang": {
    en: "Switch Language",
    hi: "भाषा बदलें",
    ta: "மொழியை மாற்றுக",
  },
  "nav.lightMode": {
    en: "Switch to Light Mode",
    hi: "लाइट मोड पर स्विच करें",
    ta: "லைட் மோடுக்கு மாற்றுக",
  },
  "nav.darkMode": {
    en: "Switch to Dark Mode",
    hi: "डार्क मोड पर स्विच करें",
    ta: "டார்க் மோடுக்கு மாற்றுக",
  },

  // ─── Footer ───
  "footer.compliancePortals": {
    en: "Compliance Portals",
    hi: "अनुपालन पोर्टल",
    ta: "இணக்க போர்ட்டல்கள்",
  },
  "footer.certificationPathways": {
    en: "Certification Pathways",
    hi: "प्रमाणन मार्ग",
    ta: "சான்றிதழ் வழிகள்",
  },
  "footer.consumerSupport": {
    en: "Consumer Support",
    hi: "उपभोक्ता सहायता",
    ta: "நுகர்வோர் ஆதரவு",
  },
  "footer.tollFree": {
    en: "Toll-Free:",
    hi: "टोल-फ्री:",
    ta: "கட்டணமில்லா எண்:",
  },
  "footer.address": {
    en: "Manak Bhavan, 9 B.S. Zafar Marg, New Delhi",
    hi: "मानक भवन, 9 बी.एस. जफर मार्ग, नई दिल्ली",
    ta: "மானக் பவன், 9 பி.எஸ். ஜாபர் மார்க், புது தில்லி",
  },
  "footer.officialPortal": {
    en: "Official BIS National Portal",
    hi: "आधिकारिक बीआईएस राष्ट्रीय पोर्टल",
    ta: "அதிகாரப்பூர்வ BIS தேசிய தளம்",
  },
  "footer.rights": {
    en: "Bureau of Indian Standards (BIS). Mithra Platform.",
    hi: "भारतीय मानक ब्यूरो (BIS)। मित्रा प्लेटफॉर्म।",
    ta: "இந்திய தரநிலைகள் பணியகம் (BIS). மித்ரா தளம்.",
  },
  "footer.grievance": {
    en: "Grievance",
    hi: "शिकायत",
    ta: "குறைதீர்ப்பு",
  },
  "footer.standardsMatrix": {
    en: "Standards",
    hi: "मानक",
    ta: "தரநிலைகள்",
  },

  // ─── Chat Page ───
  "chat.newChat": {
    en: "New Consultation",
    hi: "नया परामर्श",
    ta: "புதிய ஆலோசனை",
  },
  "chat.portalsTools": {
    en: "Portals & Tools",
    hi: "पोर्टल और उपकरण",
    ta: "போர்ட்டல்கள் & கருவிகள்",
  },
  "chat.recent": {
    en: "Recent",
    hi: "हाल ही के",
    ta: "சமீபத்தியவை",
  },
  "chat.noPreviousChats": {
    en: "No previous chats yet",
    hi: "अभी तक कोई पिछली बातचीत नहीं",
    ta: "முந்தைய உரையாடல்கள் இல்லை",
  },
  "chat.emptyHeroTitle": {
    en: "How can I assist your compliance today?",
    hi: "आज मैं आपके बीआईएस अनुपालन में कैसे सहायता कर सकता हूँ?",
    ta: "இன்று உங்கள் BIS இணக்கத்திற்கு நான் எவ்வாறு உதவ முடியும்?",
  },
  "chat.emptyHeroSubtitle": {
    en: "Ask any question regarding 22,000+ Indian Standards (IS), mandatory QCOs, certification schemes, or gold hallmark verification.",
    hi: "22,000+ भारतीय मानकों (IS), अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO), प्रमाणन योजनाओं या स्वर्ण हॉलमार्क सत्यापन से संबंधित कोई भी प्रश्न पूछें।",
    ta: "22,000+ இந்திய தரநிலைகள் (IS), கட்டாய QCO-க்கள், சான்றிதழ் திட்டங்கள் அல்லது தங்க ஹால்மார்க் சரிபார்ப்பு பற்றிய எந்தவொரு கேள்வியையும் கேளுங்கள்.",
  },
  "chat.emptyHeroBadge": {
    en: "Mithra AI · Official BIS Compliance Assistant",
    hi: "मित्रा एआई · आधिकारिक बीआईएस अनुपालन सहायक",
    ta: "மித்ரா AI · அதிகாரப்பூர்வ BIS இணக்க உதவியாளர்",
  },
  "chat.composerPlaceholder": {
    en: "Ask about Indian Standards, mandatory QCOs, schemes, or hallmarking...",
    hi: "भारतीय मानकों, अनिवार्य QCO, योजनाओं या हॉलमार्किंग के बारे में पूछें...",
    ta: "இந்திய தரநிலைகள், கட்டாய QCO, திட்டங்கள் அல்லது ஹால்மார்க் பற்றி கேட்கவும்...",
  },
  "chat.composerWorkspacePlaceholder": {
    en: "Ask anything about {workspace}...",
    hi: "{workspace} के बारे में कुछ भी पूछें...",
    ta: "{workspace} பற்றி எதையும் கேட்கவும்...",
  },
  "chat.suggestedFollowups": {
    en: "Suggested Follow-ups",
    hi: "सुझाए गए अनुवर्ती प्रश्न",
    ta: "பரிந்துரைக்கப்பட்ட அடுத்த கேள்விகள்",
  },
  "chat.confidenceHigh": {
    en: "High Confidence · Cited",
    hi: "उच्च विश्वास · उद्धृत",
    ta: "உயர் நம்பிக்கை · ஆதாரத்துடன்",
  },
  "chat.confidenceMedium": {
    en: "General Guidance",
    hi: "सामान्य मार्गदर्शन",
    ta: "பொது வழிகாட்டுதல்",
  },
  "chat.confidenceUnverified": {
    en: "Unverified · Abstained",
    hi: "असत्यापित · अनुमान से परहेज",
    ta: "சரிபார்க்கப்படவில்லை",
  },
  "chat.listen": {
    en: "Listen",
    hi: "सुनें",
    ta: "கேளுங்கள்",
  },
  "chat.speaking": {
    en: "Speaking...",
    hi: "बोल रहा है...",
    ta: "பேசுகிறது...",
  },
  "chat.citations": {
    en: "Sources & Grounded Citations",
    hi: "स्रोत और उद्धरण",
    ta: "மூலங்கள் & ஆதாரங்கள்",
  },

  // ─── Standards View ───
  "standards.badge": {
    en: "Official BIS Standards Catalogue",
    hi: "आधिकारिक बीआईएस मानक सूची",
    ta: "அதிகாரப்பூர்வ BIS தரநிலைகள் அட்டவணை",
  },
  "standards.heading": {
    en: "Indian Standards (IS) Matrix",
    hi: "भारतीय मानक (IS) मैट्रिक्स",
    ta: "இந்திய தரநிலைகள் (IS) அட்டவணை",
  },
  "standards.subheading": {
    en: "Explore technical standards, mandatory Quality Control Orders (QCOs), and conformity requirements across 15 Division Councils.",
    hi: "15 प्रभाग परिषदों में तकनीकी मानकों, अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO) और अनुरूपता आवश्यकताओं का अन्वेषण करें।",
    ta: "15 பிரிவு கவுன்சில்களின் கீழ் உள்ள தொழில்நுட்ப தரநிலைகள், கட்டாய QCO-க்கள் மற்றும் இணக்கத் தேவைகளை ஆராயுங்கள்.",
  },
  "standards.searchPlaceholder": {
    en: "Search by IS Number, Product, Keyword, or Committee...",
    hi: "आईएस संख्या, उत्पाद, कीवर्ड या समिति द्वारा खोजें...",
    ta: "IS எண், தயாரிப்பு, முக்கிய சொல் அல்லது குழு மூலம் தேடுக...",
  },
  "standards.colNumber": {
    en: "Standard No.",
    hi: "मानक सं.",
    ta: "தரநிலை எண்",
  },
  "standards.colTitle": {
    en: "Title & Technical Scope",
    hi: "शीर्षक और तकनीकी दायरा",
    ta: "தலைப்பு & நோக்கம்",
  },
  "standards.colCommittee": {
    en: "Committee",
    hi: "समिति",
    ta: "குழு",
  },
  "standards.colStatus": {
    en: "Regulatory Status",
    hi: "नियामक स्थिति",
    ta: "ஒழுங்குமுறை நிலை",
  },
  "standards.colAction": {
    en: "Action",
    hi: "कार्रवाई",
    ta: "செயல்",
  },
  "standards.mandatoryQCO": {
    en: "Mandatory QCO",
    hi: "अनिवार्य QCO",
    ta: "கட்டாய QCO",
  },
  "standards.voluntary": {
    en: "Voluntary",
    hi: "स्वैच्छिक",
    ta: "விருப்பப்படி",
  },

  // ─── Schemes View & Estimator ───
  "schemes.badge": {
    en: "Conformity Assessment Framework",
    hi: "अनुरूपता मूल्यांकन ढांचा",
    ta: "இணக்க மதிப்பீட்டு கட்டமைப்பு",
  },
  "schemes.heading": {
    en: "BIS Certification Pathways & Cost Estimator",
    hi: "बीआईएस प्रमाणन योजनाएं और लागत अनुमानक",
    ta: "BIS சான்றிதழ் திட்டங்கள் & செலவு மதிப்பீட்டாளர்",
  },
  "schemes.subheading": {
    en: "Determine whether ISI Mark, CRS, or FMCS applies to your manufacturing operations, calculate realistic statutory fees, and view MSME concessions.",
    hi: "निर्धारित करें कि आपके निर्माण पर आईएसआई मार्क, सीआरएस, या एफएमसीएस लागू होता है, वैधानिक शुल्क की गणना करें और एमएसएमई छूट देखें।",
    ta: "உங்கள் தயாரிப்புக்கு ISI மார்க், CRS அல்லது FMCS பொருந்துமா என்பதைத் தீர்மானித்து, சட்டப்பூர்வ கட்டணங்கள் மற்றும் MSME சலுகைகளைக் கணக்கிடுங்கள்.",
  },
  "schemes.calculatorTab": {
    en: "Fee & Timeline Calculator",
    hi: "शुल्क और समयरेखा कैलकुलेटर",
    ta: "கட்டணம் & காலக்கெடு கணிப்பான்",
  },
  "schemes.overviewTab": {
    en: "Scheme Portfolios",
    hi: "योजना विवरण",
    ta: "திட்டங்களின் தொகுப்பு",
  },

  // ─── Cost Estimator Specific ───
  "calc.title": {
    en: "Statutory Fee & Timeline Estimator",
    hi: "वैधानिक शुल्क और समयरेखा अनुमानक",
    ta: "சட்டப்பூர்வ கட்டணம் & காலக்கெடு கணிப்பான்",
  },
  "calc.subtitle": {
    en: "Estimate certification fees, testing charges, and licensing timelines based on official BIS guidelines and enterprise scale.",
    hi: "आधिकारिक बीआईएस दिशानिर्देशों और उद्यम के आकार के आधार पर प्रमाणन शुल्क, परीक्षण शुल्क और लाइसेंसिंग समय का अनुमान लगाएं।",
    ta: "அதிகாரப்பூர்வ BIS வழிகாட்டுதல்கள் மற்றும் நிறுவன அளவின் அடிப்படையில் சான்றிதழ் கட்டணங்கள் மற்றும் காலக்கெடுவை மதிப்பிடுங்கள்.",
  },
  "calc.schemeSelect": {
    en: "Select Certification Scheme",
    hi: "प्रमाणन योजना चुनें",
    ta: "சான்றிதழ் திட்டத்தை தேர்ந்தெடுக்கவும்",
  },
  "calc.scaleSelect": {
    en: "Enterprise Scale / Classification",
    hi: "उद्यम का स्तर / वर्गीकरण",
    ta: "நிறுவனத்தின் அளவு / வகைப்பாடு",
  },
  "calc.testingComplexity": {
    en: "Product Testing Complexity",
    hi: "उत्पाद परीक्षण जटिलता",
    ta: "தயாரிப்பு சோதனை சிக்கலான தன்மை",
  },
  "calc.msmeConcessionApplied": {
    en: "20% MSME Concession Applied on Marking Fee!",
    hi: "मार्किंग शुल्क पर 20% एमएसएमई छूट लागू!",
    ta: "குறியீட்டுக் கட்டணத்தில் 20% MSME சலுகை சேர்க்கப்பட்டுள்ளது!",
  },
  "calc.breakdownTitle": {
    en: "Estimated Cost Breakdown",
    hi: "अनुमानित लागत का विवरण",
    ta: "மதிப்பிடப்பட்ட செலவு விவரம்",
  },
  "calc.appFee": {
    en: "Statutory Application Fee",
    hi: "वैधानिक आवेदन शुल्क",
    ta: "விண்ணப்பக் கட்டணம்",
  },
  "calc.auditFee": {
    en: "Factory Inspection / Audit Charges",
    hi: "फैक्टरी निरीक्षण शुल्क",
    ta: "தொழிற்சாலை ஆய்வு கட்டணம்",
  },
  "calc.markingFee": {
    en: "Annual Minimum Marking Fee",
    hi: "वार्षिक न्यूनतम मार्किंग शुल्क",
    ta: "ஆண்டு குறைந்தபட்ச குறியீட்டுக் கட்டணம்",
  },
  "calc.testingFee": {
    en: "Estimated Lab Testing Charges",
    hi: "अनुमानित लैब परीक्षण शुल्क",
    ta: "ஆய்வக சோதனை கட்டணம்",
  },
  "calc.totalOutlay": {
    en: "Total Estimated Initial Outlay",
    hi: "कुल अनुमानित प्रारंभिक लागत",
    ta: "மொத்த மதிப்பிடப்பட்ட ஆரம்பச் செலவு",
  },
  "calc.timeline": {
    en: "Estimated Time to Grant of Licence",
    hi: "लाइसेंस प्राप्ति का अनुमानित समय",
    ta: "உரிமம் பெற மதிப்பிடப்பட்ட காலம்",
  },

  // ─── Consumer & Complaint Wizard ───
  "consumer.badge": {
    en: "Consumer Protection & Grievances",
    hi: "उपभोक्ता संरक्षण एवं शिकायतें",
    ta: "நுகர்வோர் பாதுகாப்பு & குறைதீர்ப்பு",
  },
  "consumer.heading": {
    en: "Consumer Rights & Complaint Drafter",
    hi: "उपभोक्ता अधिकार और शिकायत ड्राफ्टर",
    ta: "நுகர்வோர் உரிமைகள் & புகார் வரைவாளர்",
  },
  "consumer.subheading": {
    en: "Verify ISI and hallmark authenticity, report counterfeit goods, and generate legal complaint drafts under the BIS Act, 2016.",
    hi: "आईएसआई और हॉलमार्क की प्रामाणिकता सत्यापित करें, नकली सामान की रिपोर्ट करें और बीआईएस अधिनियम 2016 के तहत कानूनी शिकायत ड्राफ्ट तैयार करें।",
    ta: "ISI மற்றும் ஹால்மார்க் நம்பகத்தன்மையை சரிபார்த்து, போலிகளைப் புகாரளித்து, BIS சட்டம் 2016-ன் கீழ் முறையான புகார் வரைவை உருவாக்கவும்.",
  },
  "wizard.title": {
    en: "Guided BIS Complaint Filing Wizard",
    hi: "निर्देशित बीआईएस शिकायत पंजीकरण विज़ार्ड",
    ta: "வழிகாட்டப்பட்ட BIS புகார் பதிவு வழிகாட்டி",
  },
  "wizard.subtitle": {
    en: "Draft an official legal complaint letter auto-routed to your jurisdictional BIS Branch Office.",
    hi: "अपने अधिकार क्षेत्र के बीआईएस शाखा कार्यालय को स्वतः अग्रेषित आधिकारिक कानूनी शिकायत पत्र तैयार करें।",
    ta: "உங்கள் பிராந்திய BIS கிளை அலுவலகத்திற்கான முறையான சட்டப்பூர்வ புகார் கடிதத்தை உருவாக்குங்கள்.",
  },
  "wizard.step1": {
    en: "1. Violation Type",
    hi: "1. उल्लंघन का प्रकार",
    ta: "1. விதிமீறல் வகை",
  },
  "wizard.step2": {
    en: "2. Product Details",
    hi: "2. उत्पाद का विवरण",
    ta: "2. தயாரிப்பு விவரங்கள்",
  },
  "wizard.step3": {
    en: "3. Evidence & Defects",
    hi: "3. साक्ष्य एवं दोष",
    ta: "3. ஆதாரங்கள் & குறைபாடுகள்",
  },
  "wizard.step4": {
    en: "4. Official Draft",
    hi: "4. आधिकारिक ड्राफ्ट",
    ta: "4. அதிகாரப்பூர்வ வரைவு",
  },

  // ─── Hallmark View ───
  "hallmark.badge": {
    en: "Hallmark Unique Identification (HUID)",
    hi: "हॉलमार्क विशिष्ट पहचान (HUID)",
    ta: "ஹால்மார்க் தனித்துவ அடையாள எண் (HUID)",
  },
  "hallmark.heading": {
    en: "Gold & Silver Hallmark Verification",
    hi: "स्वर्ण एवं रजत हॉलमार्क सत्यापन",
    ta: "தங்க & வெள்ளி ஹால்மார்க் சரிபார்ப்பு",
  },
  "hallmark.subheading": {
    en: "Verify the 6-character alphanumeric HUID code, check assaying centre accreditation, and learn the mandatory 3-mark hallmarking standard.",
    hi: "6-अक्षरों के अल्फ़ान्यूमेरिक HUID कोड को सत्यापित करें, हॉलमार्किंग केंद्र की मान्यता की जांच करें और 3-चिह्न मानक सीखें।",
    ta: "6-எழுத்து HUID குறியீட்டைச் சரிபார்த்து, அங்கீகரிக்கப்பட்ட ஹால்மார்க் மையங்களை அறிந்து, கட்டாய 3-அடையாள தரநிலையை உறுதிசெய்க.",
  },

  // ─── Labs View ───
  "labs.badge": {
    en: "Conformity Testing Infrastructure",
    hi: "अनुरूपता परीक्षण अवसंरचना",
    ta: "இணக்க சோதனை உள்கட்டமைப்பு",
  },
  "labs.heading": {
    en: "BIS Recognized Testing Laboratories",
    hi: "बीआईएस मान्यता प्राप्त परीक्षण प्रयोगशालाएं",
    ta: "BIS அங்கீகரிக்கப்பட்ட சோதனை ஆய்வகங்கள்",
  },
  "labs.subheading": {
    en: "Locate accredited Central, Regional, and NABL-partnered laboratories for mandatory sample testing and quality certification.",
    hi: "अनिवार्य नमूना परीक्षण और गुणवत्ता प्रमाणन के लिए मान्यता प्राप्त केंद्रीय, क्षेत्रीय और एनएबीएल-भागीदार प्रयोगशालाओं का पता लगाएं।",
    ta: "கட்டாய மாதிரி சோதனை மற்றும் தரச் சான்றிதழுக்காக அங்கீகரிக்கப்பட்ட மத்திய, பிராந்திய மற்றும் NABL ஆய்வகங்களைக் கண்டறியவும்.",
  },

  // ─── Subtitles for Standalone Bar & Tool Headers ───
  "nav.standardsSubtitle": {
    en: "Indian Standards Directory · BIS",
    hi: "भारतीय मानक निर्देशिका · बीआईएस",
    ta: "இந்திய தரநிலைகள் கோப்பகம் · BIS",
  },
  "nav.schemesSubtitle": {
    en: "Certification Pathways · BIS",
    hi: "प्रमाणन योजनाएं एवं मार्ग · बीआईएस",
    ta: "சான்றிதழ் வழிகள் & திட்டங்கள் · BIS",
  },
  "nav.hallmarkSubtitle": {
    en: "Gold Hallmark & HUID Verification · BIS",
    hi: "स्वर्ण हॉलमार्क और HUID सत्यापन · बीआईएस",
    ta: "தங்க ஹால்மார்க் & HUID சரிபார்ப்பு · BIS",
  },
  "nav.labsSubtitle": {
    en: "NABL & BIS Accredited Testing Labs · BIS",
    hi: "एनएबीएल और बीआईएस मान्यता प्राप्त परीक्षण प्रयोगशालाएं",
    ta: "NABL & BIS அங்கீகரிக்கப்பட்ட சோதனை ஆய்வகங்கள்",
  },
  "nav.consumerSubtitle": {
    en: "Consumer Redressal & Rights · BIS",
    hi: "उपभोक्ता अधिकार एवं शिकायत निवारण · बीआईएस",
    ta: "நுகர்வோர் குறைதீர்ப்பு & உரிமைகள் · BIS",
  },
  "nav.whatsappTitle": {
    en: "Mithra on WhatsApp",
    hi: "व्हाट्सएप पर मित्रा",
    ta: "வாட்ஸ்அப்பில் மித்ரா",
  },
  "nav.whatsappSubtitle": {
    en: "Tier-2 Multi-Channel Distribution · Tools",
    hi: "टियर-2 मल्टी-चैनल वितरण · टूल्स",
    ta: "அடுக்கு-2 பல சேனல் விநியோகம் · கருவிகள்",
  },
  "nav.estimatorSubtitle": {
    en: "BIS Certification Fee Calculator · Tools",
    hi: "बीआईएस प्रमाणन शुल्क कैलकुलेटर · टूल्स",
    ta: "BIS சான்றிதழ் கட்டண கணிப்பான் · கருவிகள்",
  },
  "nav.complaintDrafterSubtitle": {
    en: "Statutory Legal Redressal Tool · BIS Act 2016",
    hi: "वैधानिक कानूनी निवारण टूल · बीआईएस अधिनियम 2016",
    ta: "சட்டப்பூர்வ குறைதீர்ப்பு கருவி · BIS சட்டம் 2016",
  },

  // ─── Standards Portal Internationalization ───
  "standards.clearFilters": {
    en: "Clear all filters",
    hi: "सभी फ़िल्टर साफ़ करें",
    ta: "அனைத்து வடிப்பான்களையும் அழிக்கவும்",
  },
  "standards.qcoOrderLabel": {
    en: "Quality Control Order",
    hi: "गुणवत्ता नियंत्रण आदेश",
    ta: "தரக் கட்டுப்பாட்டு ஆணை",
  },
  "standards.askMithraButton": {
    en: "Ask Mithra",
    hi: "मित्रा से पूछें",
    ta: "மித்ராவிடம் கேளுங்கள்",
  },
  "standards.reaffirmedLabel": {
    en: "Reaffirmed",
    hi: "पुनःपुष्ट",
    ta: "மீண்டும் உறுதிப்படுத்தப்பட்டது",
  },

  // ─── WhatsApp Simulator Internationalization ───
  "whatsapp.welcome": {
    en: "Namaste! 🙏 Welcome to *Mithra* — the official AI Assistant for the Bureau of Indian Standards (BIS), Government of India.\n\nI can help you with:\n• Checking mandatory Quality Control Orders (*QCOs*)\n• Indian Standards (*IS specifications*)\n• ISI Mark, CRS & FMCS certification pathways\n• 6-digit Gold Hallmark *HUID* verification\n• Statutory fee estimates & complaint drafting\n\nHow can I help you today?",
    hi: "नमस्ते! 🙏 *मित्रा* में आपका स्वागत है — भारतीय मानक ब्यूरो (BIS), भारत सरकार का आधिकारिक AI सहायक।\n\nमैं आपकी सहायता कर सकता हूँ:\n• अनिवार्य गुणवत्ता नियंत्रण आदेशों (*QCO*) की जांच\n• भारतीय मानक (*IS विनिर्देश*)\n• ISI मार्क, CRS और FMCS प्रमाणन योजनाएं\n• 6-अंकीय स्वर्ण हॉलमार्क *HUID* सत्यापन\n• वैधानिक शुल्क अनुमान और शिकायत ड्राफ्टिंग\n\nआज मैं आपकी क्या सहायता कर सकता हूँ?",
    ta: "வணக்கம்! 🙏 *மித்ரா*விற்கு நல்வரவு — இந்திய தரநிலைகள் பணியகத்தின் (BIS) அதிகாரப்பூர்வ AI உதவியாளர்.\n\nநான் உங்களுக்கு உதவக்கூடியவை:\n• கட்டாய தரக் கட்டுப்பாட்டு ஆணைகள் (*QCO*) சரிபார்ப்பு\n• இந்திய தரநிலைகள் (*IS விவரக்குறிப்புகள்*)\n• ISI மார்க், CRS & FMCS சான்றிதழ் வழிகள்\n• 6-இலக்க தங்க ஹால்மார்க் *HUID* சரிபார்ப்பு\n• சட்டப்பூர்வ கட்டண மதிப்பீடு & புகார் வரைவு\n\nஇன்று நான் உங்களுக்கு எவ்வாறு உதவட்டும்?",
  },
  "whatsapp.qr1": {
    en: "Check IS 14543 (Water)",
    hi: "IS 14543 (पानी) की जांच करें",
    ta: "IS 14543 (தண்ணீர்) சரிபார்க்கவும்",
  },
  "whatsapp.qr2": {
    en: "Verify Gold HUID: AA123456",
    hi: "स्वर्ण HUID सत्यापित करें: AA123456",
    ta: "தங்க HUID சரிபார்க்கவும்: AA123456",
  },
  "whatsapp.qr3": {
    en: "Is ISI mark mandatory for toys?",
    hi: "क्या खिलौनों पर ISI मार्क अनिवार्य है?",
    ta: "பொம்மைகளுக்கு ISI முத்திரை கட்டாயமா?",
  },
  "whatsapp.qr4": {
    en: "Calculate MSME certification fee",
    hi: "MSME प्रमाणन शुल्क की गणना करें",
    ta: "MSME சான்றிதழ் கட்டணத்தை கணக்கிடுங்கள்",
  },
  "whatsapp.placeholder": {
    en: "Type a message (e.g. Check IS 14543 or verify Gold HUID)...",
    hi: "संदेश टाइप करें (उदा. IS 14543 जांचें या HUID सत्यापित करें)...",
    ta: "செய்தியை தட்டச்சு செய்க (எ.கா. IS 14543 அல்லது தங்க HUID)...",
  },
  "whatsapp.officialAccount": {
    en: "Official Business Account · Online",
    hi: "आधिकारिक व्यावसायिक खाता · ऑनलाइन",
    ta: "அதிகாரப்பூர்வ வணிக கணக்கு · ஆன்லைன்",
  },
  "whatsapp.encryptionNotice": {
    en: "🔒 Messages are grounded in authoritative BIS regulations and Quality Control Orders.",
    hi: "🔒 संदेश आधिकारिक बीआईएस विनियमों और गुणवत्ता नियंत्रण आदेशों पर आधारित हैं।",
    ta: "🔒 செய்திகள் அதிகாரப்பூர்வ BIS விதிமுறைகள் மற்றும் தரக் கட்டுப்பாட்டு உத்தரவுகளின் அடிப்படையில் அமைந்தவை.",
  },
  "whatsapp.sources": {
    en: "Authoritative BIS Sources:",
    hi: "आधिकारिक बीआईएस स्रोत:",
    ta: "அதிகாரப்பூர்வ BIS ஆதாரங்கள்:",
  },
  "whatsapp.copyTranscript": {
    en: "Copy transcript",
    hi: "प्रतिलिपि कॉपी करें",
    ta: "உரையாடலை நகலெடுக்கவும்",
  },
  "whatsapp.clearConversation": {
    en: "Clear conversation",
    hi: "वार्तालाप साफ़ करें",
    ta: "உரையாடலை அழிக்கவும்",
  },
  "whatsapp.officialPortal": {
    en: "BIS Official Portal",
    hi: "बीआईएस आधिकारिक पोर्टल",
    ta: "BIS அதிகாரப்பூர்வ போர்டல்",
  },
  "whatsapp.callHelpline": {
    en: "Call Helpline (1800-11-4000)",
    hi: "हेल्पलाइन पर कॉल करें (1800-11-4000)",
    ta: "உதவி மையத்தை அழைக்கவும் (1800-11-4000)",
  },
  "whatsapp.typing": {
    en: "Mithra is typing...",
    hi: "मित्रा टाइप कर रहा है...",
    ta: "மித்ரா தட்டச்சு செய்கிறது...",
  },
  "whatsapp.simulateAttachment": {
    en: "Simulate Document / Photo Attachment",
    hi: "दस्तावेज़ / फ़ोटो अटैचमेंट का अनुकरण करें",
    ta: "ஆவணம் / புகைப்பட இணைப்பை உருவகப்படுத்துங்கள்",
  },
  "whatsapp.close": {
    en: "Close",
    hi: "बंद करें",
    ta: "மூடு",
  },
  "whatsapp.copy": {
    en: "Copy message",
    hi: "संदेश कॉपी करें",
    ta: "செய்தியை நகலெடு",
  },
  "whatsapp.transcriptCopied": {
    en: "Chat transcript copied to clipboard!",
    hi: "चैट प्रतिलिपि क्लिपबोर्ड पर कॉपी की गई!",
    ta: "உரையாடல் கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!",
  },
};

export function getTranslation(key: string, lang: SupportedLanguage): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item["en"] || key;
}
