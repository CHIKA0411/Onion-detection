export interface UIStrings {
  selectLanguageTitle: string;
  selectLanguageSubtitle: string;
  searchLanguage: string;
  continueBtn: string;
  allLanguages: string;
  constitutionalLanguages: string;
  systemLanguage: string;
  
  // Onboarding
  onboardingTitle1: string;
  onboardingDesc1: string;
  onboardingTitle2: string;
  onboardingDesc2: string;
  onboardingTitle3: string;
  onboardingDesc3: string;
  skip: string;
  next: string;
  getStarted: string;

  // Auth
  welcomeMinistry: string;
  portalTitle: string;
  signIn: string;
  inspectorId: string;
  enterInspectorId: string;
  centerId: string;
  enterCenterId: string;
  loginOtp: string;
  verifyLogin: string;
  authFooterNote: string;

  // Header & Nav
  govHeader: string;
  deptHeader: string;
  navDashboard: string;
  navNewScan: string;
  navAuditTrail: string;
  navRules: string;
  navReports: string;
  navSyncQueue: string;
  navSopHelp: string;
  navProfile: string;

  // Dashboard
  greeting: string;
  quickScanBtn: string;
  recentScans: string;
  gradeAGauge: string;
  ursGauge: string;
  offlineQueueStatus: string;
  modelVersion: string;

  // Scan & Detection
  selectScanMode: string;
  autoDetectMode: string;
  singleOnionMode: string;
  batchTrayMode: string;
  fullCrateMode: string;
  capturePhoto: string;
  uploadImage: string;
  liveSegmentationTitle: string;
  yoloDetecting: string;
  onionCountDetected: string;

  // Per Onion Classification & Override
  classificationTitle: string;
  gradeA: string;
  damaged: string;
  rotten: string;
  sprouted: string;
  undersized: string;
  manualOverrideBtn: string;
  overrideReasonPrompt: string;
  saveOverrideBtn: string;

  // Grading Summary & Rules
  lotSummaryTitle: string;
  defectBreakdown: string;
  lotAcceptStatus: string;
  rulesConfigTitle: string;
  minGradeAThreshold: string;
  maxUrsThreshold: string;
  maxUndersizedMm: string;
  saveRulesBtn: string;

  // Audit Log & Reports
  auditTrailTitle: string;
  actionType: string;
  timestamp: string;
  officialCertificateTitle: string;
  englishReportNotice: string;
  downloadPdf: string;
  printCertificate: string;

  // Profile & Sync
  syncQueueTitle: string;
  syncAllNow: string;
  onDeviceTfliteStatus: string;
  sopTitle: string;
  helplineSupport: string;
  logout: string;
}

export const TRANSLATIONS: Record<string, UIStrings> = {
  en: {
    selectLanguageTitle: "Select Procurement Staff Language",
    selectLanguageSubtitle: "अपनी भाषा चुनें / Select your native language",
    searchLanguage: "Search language by name or script...",
    continueBtn: "Proceed to Inspection Tool",
    allLanguages: "Available Languages",
    constitutionalLanguages: "Eighth Schedule Languages (22)",
    systemLanguage: "System / Default Language",

    onboardingTitle1: "ML Instance Segmentation (YOLOv8-seg)",
    onboardingDesc1: "Automated real-time detection and contour segmentation of individual onions in procurement lots.",
    onboardingTitle2: "Multi-Class Defect Categorization",
    onboardingDesc2: "Precision AI classification into Grade A, Damaged, Neck/Basal Rot, Sprouted, and Undersized categories.",
    onboardingTitle3: "Human-in-the-Loop & Audit Ledger",
    onboardingDesc3: "Empowers quality inspectors to override AI tags with full timestamped audit trail compliance for SIH26031.",
    skip: "Skip Intro",
    next: "Next",
    getStarted: "Start Inspection",

    welcomeMinistry: "Ministry of Consumer Affairs, Food & Public Distribution",
    portalTitle: "Onion Quality Grading & Inspection Tool • SIH26031",
    signIn: "Inspector Login",
    inspectorId: "Inspector ID",
    enterInspectorId: "Enter Inspector ID (e.g. INS-9021)",
    centerId: "Procurement Center ID",
    enterCenterId: "Enter Center Code (e.g. NAFED-NSK-04)",
    loginOtp: "Enter 4-Digit Security PIN",
    verifyLogin: "Authenticate & Open Scanner",
    authFooterNote: "Authorized by Department of Consumer Affairs • Govt of India",

    govHeader: "GOVERNMENT OF INDIA",
    deptHeader: "MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION",
    navDashboard: "Dashboard",
    navNewScan: "New Scan",
    navAuditTrail: "Audit Trail",
    navRules: "Grading Rules",
    navReports: "Reports",
    navSyncQueue: "Sync Queue",
    navSopHelp: "Inspection SOP",
    navProfile: "Inspector Profile",

    greeting: "Welcome, Inspector",
    quickScanBtn: "Start New Lot Scan",
    recentScans: "Recent Procurement Lot Scans",
    gradeAGauge: "Grade A Proportion",
    ursGauge: "URS (Undersized/Rotten/Sprouted)",
    offlineQueueStatus: "Offline Queue Status",
    modelVersion: "Active Engine: YOLOv8-seg + TFLite v2.4",

    selectScanMode: "Select Lot Inspection Mode",
    autoDetectMode: "Dynamic Auto-Detect (1 to 100+ Onions)",
    singleOnionMode: "Single Onion Close-up",
    batchTrayMode: "Batch Sampling Tray (15-30 units)",
    fullCrateMode: "Full Crate / Lot Frame (50+ units)",
    capturePhoto: "Capture Viewfinder Photo",
    uploadImage: "Upload Test Sample Image",
    liveSegmentationTitle: "Real-time Instance Segmentation Preview",
    yoloDetecting: "YOLOv8-seg Processing Contours...",
    onionCountDetected: "Detected Onions in Frame",

    classificationTitle: "Per-Onion Classification & Bounding Crops",
    gradeA: "Grade A (Healthy)",
    damaged: "Mechanically Damaged",
    rotten: "Neck / Basal Rot",
    sprouted: "Sprouted",
    undersized: "Undersized (<35mm)",
    manualOverrideBtn: "Override AI Category",
    overrideReasonPrompt: "Select Reason for Inspector Correction",
    saveOverrideBtn: "Commit Human Override",

    lotSummaryTitle: "Lot Batch Grading Summary & Certificate Calculation",
    defectBreakdown: "Defect Category Breakdown",
    lotAcceptStatus: "Procurement Decision Status",
    rulesConfigTitle: "Procurement Center Grading Rules Config",
    minGradeAThreshold: "Minimum Grade A Requirement (%)",
    maxUrsThreshold: "Maximum Allowed URS Limit (%)",
    maxUndersizedMm: "Undersized Diameter Cutoff (mm)",
    saveRulesBtn: "Save Center Policy Settings",

    auditTrailTitle: "Immutable Audit Ledger & Override Log",
    actionType: "Action / Event Type",
    timestamp: "Timestamp",
    officialCertificateTitle: "Official Inspection Certificate (Department of Consumer Affairs)",
    englishReportNotice: "Official procurement certificates are rendered strictly in English for administrative compliance.",
    downloadPdf: "Download PDF Certificate",
    printCertificate: "Print Certificate",

    syncQueueTitle: "Offline Queue & Model Synchronization Manager",
    syncAllNow: "Sync Queued Scans Now",
    onDeviceTfliteStatus: "On-Device TFLite Engine Status: Operational",
    sopTitle: "Standard Operating Procedures (SOP) & Defect Guide",
    helplineSupport: "Procurement Officer Support (1800-11-4000)",
    logout: "Sign Out",
  },
  hi: {
    selectLanguageTitle: "खरीद अधिकारी भाषा चयन",
    selectLanguageSubtitle: "Choose your preferred language",
    searchLanguage: "भाषा का नाम या लिपि खोजें...",
    continueBtn: "निरीक्षण टूल पर आगे बढ़ें",
    allLanguages: "उपलब्ध भाषाएं",
    constitutionalLanguages: "संविधान की 22 भाषाएं",
    systemLanguage: "सिस्टम / डिफ़ॉल्ट भाषा",

    onboardingTitle1: "एमएल इंस्टेंस सेगमेंटेशन (YOLOv8-seg)",
    onboardingDesc1: "प्याज की प्रत्येक इकाई की सटीक ऑटोमेटेड पहचान एवं कंटूर बाउंडिंग।",
    onboardingTitle2: "बहु-श्रेणी दोष वर्गीकरण",
    onboardingDesc2: "ग्रेड A, क्षतिग्रस्त, सड़न (Rot), अंकुरित (Sprouted) और छोटे आकार की एआई पहचान।",
    onboardingTitle3: "ह्यूमन-इन-द-लूप एवं ऑडिट लेजर",
    onboardingDesc3: "गुणवत्ता निरीक्षकों द्वारा एआई सुधार और पूर्ण ऑडिट ट्रेल रिकॉर्ड की सुविधा।",
    skip: "छोड़ें",
    next: "आगे बढ़ें",
    getStarted: "निरीक्षण शुरू करें",

    welcomeMinistry: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    portalTitle: "प्याज गुणवत्ता ग्रेडिंग एवं निरीक्षण टूल • SIH26031",
    signIn: "निरीक्षक लॉगिन",
    inspectorId: "निरीक्षक आईडी",
    enterInspectorId: "निरीक्षक आईडी दर्ज करें (उदा. INS-9021)",
    centerId: "खरीद केंद्र कोड",
    enterCenterId: "केंद्र कोड दर्ज करें (उदा. NAFED-NSK-04)",
    loginOtp: "4-अंकों का सुरक्षा पिन दर्ज करें",
    verifyLogin: "सत्यापित करें और स्कैनर खोलें",
    authFooterNote: "उपभोक्ता मामले विभाग द्वारा अधिकृत • भारत सरकार",

    govHeader: "भारत सरकार",
    deptHeader: "उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय",
    navDashboard: "डैशबोर्ड",
    navNewScan: "नया स्कैन",
    navAuditTrail: "ऑडिट ट्रेल",
    navRules: "ग्रेडिंग नियम",
    navReports: "रिपोर्ट्स",
    navSyncQueue: "सिंक कतार",
    navSopHelp: "एसओपी नियमावली",
    navProfile: "प्रोफ़ाइल",

    greeting: "नमस्ते, निरीक्षक",
    quickScanBtn: "नया लॉट स्कैन शुरू करें",
    recentScans: "हाल के लॉट निरीक्षण स्कैन",
    gradeAGauge: "ग्रेड A प्रतिशत",
    ursGauge: "URS (छोटे / सड़े / अंकुरित)",
    offlineQueueStatus: "ऑफलाइन सिंक स्थिति",
    modelVersion: "एक्टिव इंजन: YOLOv8-seg + TFLite v2.4",

    selectScanMode: "लॉट निरीक्षण मोड चुनें",
    autoDetectMode: "गतिशील ऑटो-डिटेक्ट (1 से 100+ प्याज)",
    singleOnionMode: "सिंगल प्याज क्लोज़-अप",
    batchTrayMode: "बैच ट्रे (15-30 प्याज)",
    fullCrateMode: "पूरा क्रेट / लॉट (50+ प्याज)",
    capturePhoto: "कैमरा फोटो खींचें",
    uploadImage: "सैंपल इमेज अपलोड करें",
    liveSegmentationTitle: "रीयल-टाइम इंस्टेंस सेगमेंटेशन पूर्वावलोकन",
    yoloDetecting: "YOLOv8-seg प्रसंस्करण जारी...",
    onionCountDetected: "पहचाने गए प्याज की संख्या",

    classificationTitle: "प्रति-प्याज वर्गीकरण एवं परिणाम",
    gradeA: "ग्रेड A (स्वस्थ)",
    damaged: "क्षतिग्रस्त (Damaged)",
    rotten: "सड़ा हुआ (Rotten)",
    sprouted: "अंकुरित (Sprouted)",
    undersized: "छोटा आकार (<35mm)",
    manualOverrideBtn: "एआई वर्ग बदलें (Override)",
    overrideReasonPrompt: "मानव सुधार का कारण चुनें",
    saveOverrideBtn: "ओवरराइड दर्ज करें",

    lotSummaryTitle: "लॉट ग्रेडिंग सारांश एवं प्रमाण पत्र",
    defectBreakdown: "दोष श्रेणी विवरण",
    lotAcceptStatus: "स्वीकृति / अस्वीकृति स्थिति",
    rulesConfigTitle: "खरीद केंद्र ग्रेडिंग नियम कॉन्फ़िगरेशन",
    minGradeAThreshold: "न्यूनतम ग्रेड A सीमा (%)",
    maxUrsThreshold: "अधिकतम URS सीमा (%)",
    maxUndersizedMm: "छोटे आकार की सीमा (mm)",
    saveRulesBtn: "नियम सहेजें",

    auditTrailTitle: "अपरिवर्तनीय ऑडिट ट्रेल एवं ओवरराइड लॉग",
    actionType: "कार्रवाई प्रकार",
    timestamp: "समय मोहर",
    officialCertificateTitle: "आधिकारिक निरीक्षण प्रमाण पत्र (उपभोक्ता मामले विभाग)",
    englishReportNotice: "प्रशासनिक अनुपालन के लिए सभी आधिकारिक प्रमाण पत्र अनिवार्य रूप से अंग्रेजी में तैयार किए जाते हैं।",
    downloadPdf: "पीडीएफ प्रमाण पत्र डाउनलोड करें",
    printCertificate: "प्रिंट करें",

    syncQueueTitle: "ऑफलाइन कतार एवं मॉडल सिंक प्रबंधक",
    syncAllNow: "अभी सिंक करें",
    onDeviceTfliteStatus: "ऑन-डिवाइस TFLite इंजन: सक्रिय एवं क्रियाशील",
    sopTitle: "मानक संचालन प्रक्रिया (SOP) एवं दोष गाइड",
    helplineSupport: "खरीद अधिकारी हेल्पलाइन (1800-11-4000)",
    logout: "लॉगआउट",
  }
};

export function getTranslation(langId: string): UIStrings {
  return TRANSLATIONS[langId] || TRANSLATIONS['hi'] || TRANSLATIONS['en'];
}
