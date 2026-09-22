import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LanguageContext = createContext(null);

const translations = {
  en: {
    appName: "Jain Pathshala",
    journey: "Journey",
    profile: "Profile",
    admin: "Admin",
    logout: "Logout",
    learningJourney: "Your Learning Journey",
    learningDescription:
      "Explore Jain teachings through books, chapters, notes and learning activities.",
    sevenBooks: "The Seven Books of Study",
    chapters: "Chapters",
    notes: "Notes",
    startLearning: "Start Learning",
    viewChapters: "View Chapters",
    backToJourney: "Back to Journey",
    aboutUs: "About Us",
    contact: "Contact",
    email: "Email",
    comingSoon: "Coming Soon",
    openPdf: "Open PDF",
    chapterNotFound: "Chapter not found",
    bookNotFound: "Book not found",

    balpothi: "Balpothi",
    balpothiDescription:
      "An introduction to basic Jain teachings and learning.",

    balbodh: "Balbodh",
    balbodhDescription:
      "Learn foundational concepts of Jain philosophy.",

    chapter1: "Chapter 1",
    chapter2: "Chapter 2",
    chapter3: "Chapter 3",
    chapter4: "Chapter 4",
    chapter5: "Chapter 5",
    chapter6: "Chapter 6",
    chapter7: "Chapter 7",
    chapter8: "Chapter 8",

    introduction: "Introduction",
    basicTeachings: "Basic Teachings",
    basicConcepts: "Basic Concepts",
    learningAndPractice: "Learning and Practice",
    revision: "Revision",
    storiesAndTeachings: "Stories and Teachings",
    valuesAndConduct: "Values and Conduct",
    practice: "Practice",
    revisionAndReflection: "Revision and Reflection",

    // Generic / shared
    back: "Back",
    loading: "Loading…",
    genericError: "Something went wrong. Please try again.",
    of: "of",
    watched: "watched",
    completed: "Completed",
    inProgress: "In progress",

    // Login
    signInSubtitle: "Sign in to continue your learning journey",
    passwordLabel: "Password",
    signingIn: "Signing in…",
    signIn: "Sign in",
    newHere: "New here?",
    createAccount: "Create an account",

    // Signup
    beginJourney: "Begin your journey",
    createAccountSubtitle: "Create an account to start studying",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Your full name",
    passwordMinPlaceholder: "At least 6 characters",
    creatingAccount: "Creating account…",
    createAccountBtn: "Create account",
    alreadyHaveAccount: "Already have an account?",

    // Journey
    journeyEyebrow: "YOUR LEARNING JOURNEY",
    journeyIntro:
      "Complete each book at your own pace. Watch every chapter to at least 90%, then pass the reflection with 50% or more to unlock the next volume.",
    loadingJourney: "Loading your journey…",
    bookLabel: "BOOK",
    chaptersLower: "chapters",
    completePreviousToUnlock: "Complete previous book to unlock",
    continueBtn: "Continue",
    revisitBtn: "Revisit",
    certificateBtn: "Certificate",

    // BookDetail
    journeyBack: "JOURNEY",
    chaptersCompletedSuffix: "chapters completed",
    takeBookTest: "Take Book Test",
    lastAttempt: "Last attempt",
    passed: "Passed",
    retryNeeded: "Retry needed",

    // Study
    nowStudying: "NOW STUDYING",
    progressLabel: "PROGRESS",
    noPdfYet: "No reading material has been added for this chapter yet.",

    // Quiz
    passedTitle: "Well done — you passed!",
    failedTitle: "Not quite there yet",
    passedDesc:
      "Your certificate is ready and the next book has been unlocked.",
    failedDesc:
      "You need at least 50% on the multiple choice questions to pass. Review the chapters and try again.",
    viewCertificate: "View Certificate",
    bookTestTitle: "Book Test",
    bookTestDesc:
      "Answer every question below. You need 50% or more on the multiple choice questions to pass.",
    reflectionPlaceholder: "Write your reflection here…",
    submitting: "Submitting…",
    submitTest: "Submit Test",

    // Certificate
    backToJourneyArrow: "← Back to journey",
    downloadPdf: "Download PDF",
    certificateOfCompletion: "Certificate of Completion",
    acknowledgeThat: "This is to acknowledge that",
    hasCompletedBook:
      "has diligently completed the study and reflection of the book",
    dateOfIssue: "DATE OF ISSUE",
    serialNumber: "SERIAL NUMBER",
    certClosingLine:
      "May the study of these teachings deepen wisdom, compassion, and peace.",
    unableToLoadCertificate: "Unable to load certificate",

    // Profile
    myProfile: "My Profile",
    manageDetails: "Manage your personal details.",
    fullNameFieldLabel: "Full Name",
    ageLabel: "Age",
    agePlaceholder: "Enter your age",
    genderLabel: "Gender",
    selectGender: "Select gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    genderPreferNotToSay: "Prefer not to say",
    saveProfile: "Save Profile",
    profileSaved: "Profile saved successfully.",
  },

  hi: {
    appName: "जैन पाठशाला",
    journey: "मेरी यात्रा",
    profile: "प्रोफ़ाइल",
    admin: "एडमिन",
    logout: "लॉग आउट",
    learningJourney: "आपकी शिक्षा यात्रा",
    learningDescription:
      "पुस्तकों, अध्यायों, नोट्स और सीखने की गतिविधियों के माध्यम से जैन शिक्षाओं को जानें।",
    sevenBooks: "अध्ययन की सात पुस्तकें",
    chapters: "अध्याय",
    notes: "नोट्स",
    startLearning: "सीखना शुरू करें",
    viewChapters: "अध्याय देखें",
    backToJourney: "यात्रा पर वापस जाएँ",
    aboutUs: "हमारे बारे में",
    contact: "संपर्क करें",
    email: "ईमेल",
    comingSoon: "जल्द आ रहा है",
    openPdf: "PDF खोलें",
    chapterNotFound: "अध्याय नहीं मिला",
    bookNotFound: "पुस्तक नहीं मिली",

    balpothi: "बालपोथी",
    balpothiDescription:
      "जैन शिक्षाओं और प्रारंभिक ज्ञान का परिचय।",

    balbodh: "बालबोध",
    balbodhDescription:
      "जैन दर्शन की मूल अवधारणाओं को जानें।",

    chapter1: "अध्याय 1",
    chapter2: "अध्याय 2",
    chapter3: "अध्याय 3",
    chapter4: "अध्याय 4",
    chapter5: "अध्याय 5",
    chapter6: "अध्याय 6",
    chapter7: "अध्याय 7",
    chapter8: "अध्याय 8",

    introduction: "परिचय",
    basicTeachings: "मूल शिक्षाएँ",
    basicConcepts: "मूल अवधारणाएँ",
    learningAndPractice: "अध्ययन और अभ्यास",
    revision: "पुनरावृत्ति",
    storiesAndTeachings: "कथाएँ और शिक्षाएँ",
    valuesAndConduct: "मूल्य और आचरण",
    practice: "अभ्यास",
    revisionAndReflection: "पुनरावृत्ति और चिंतन",

    // Generic / shared
    back: "वापस",
    loading: "लोड हो रहा है…",
    genericError: "कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।",
    of: "में से",
    watched: "देखा गया",
    completed: "पूर्ण",
    inProgress: "जारी है",

    // Login
    signInSubtitle: "अपनी शिक्षा यात्रा जारी रखने के लिए साइन इन करें",
    passwordLabel: "पासवर्ड",
    signingIn: "साइन इन हो रहा है…",
    signIn: "साइन इन करें",
    newHere: "नए यहाँ हैं?",
    createAccount: "खाता बनाएँ",

    // Signup
    beginJourney: "अपनी यात्रा शुरू करें",
    createAccountSubtitle: "अध्ययन शुरू करने के लिए खाता बनाएँ",
    fullNameLabel: "पूरा नाम",
    fullNamePlaceholder: "आपका पूरा नाम",
    passwordMinPlaceholder: "कम से कम 6 अक्षर",
    creatingAccount: "खाता बनाया जा रहा है…",
    createAccountBtn: "खाता बनाएँ",
    alreadyHaveAccount: "पहले से खाता है?",

    // Journey
    journeyEyebrow: "आपकी शिक्षा यात्रा",
    journeyIntro:
      "हर पुस्तक को अपनी गति से पूरा करें। अगली पुस्तक अनलॉक करने के लिए हर अध्याय को कम से कम 90% देखें, फिर चिंतन में 50% या अधिक अंक प्राप्त करें।",
    loadingJourney: "आपकी यात्रा लोड हो रही है…",
    bookLabel: "पुस्तक",
    chaptersLower: "अध्याय",
    completePreviousToUnlock: "अनलॉक करने के लिए पिछली पुस्तक पूरी करें",
    continueBtn: "जारी रखें",
    revisitBtn: "पुनः देखें",
    certificateBtn: "प्रमाणपत्र",

    // BookDetail
    journeyBack: "यात्रा",
    chaptersCompletedSuffix: "अध्याय पूर्ण",
    takeBookTest: "पुस्तक परीक्षा दें",
    lastAttempt: "पिछला प्रयास",
    passed: "उत्तीर्ण",
    retryNeeded: "पुनः प्रयास आवश्यक",

    // Study
    nowStudying: "अभी अध्ययन कर रहे हैं",
    progressLabel: "प्रगति",
    noPdfYet: "इस अध्याय के लिए अभी तक पठन सामग्री नहीं जोड़ी गई है।",

    // Quiz
    passedTitle: "शाबाश — आप उत्तीर्ण हुए!",
    failedTitle: "अभी सफलता नहीं मिली",
    passedDesc:
      "आपका प्रमाणपत्र तैयार है और अगली पुस्तक अनलॉक हो गई है।",
    failedDesc:
      "उत्तीर्ण होने के लिए बहुविकल्पीय प्रश्नों में कम से कम 50% अंक आवश्यक हैं। अध्याय दोहराएँ और फिर प्रयास करें।",
    viewCertificate: "प्रमाणपत्र देखें",
    bookTestTitle: "पुस्तक परीक्षा",
    bookTestDesc:
      "नीचे दिए गए हर प्रश्न का उत्तर दें। उत्तीर्ण होने के लिए बहुविकल्पीय प्रश्नों में कम से कम 50% अंक चाहिए।",
    reflectionPlaceholder: "अपना विचार यहाँ लिखें…",
    submitting: "जमा हो रहा है…",
    submitTest: "परीक्षा जमा करें",

    // Certificate
    backToJourneyArrow: "← यात्रा पर वापस जाएँ",
    downloadPdf: "PDF डाउनलोड करें",
    certificateOfCompletion: "पूर्णता प्रमाणपत्र",
    acknowledgeThat: "यह प्रमाणित किया जाता है कि",
    hasCompletedBook:
      "ने इस पुस्तक का अध्ययन एवं चिंतन निष्ठापूर्वक पूर्ण किया है",
    dateOfIssue: "जारी करने की तिथि",
    serialNumber: "क्रमांक",
    certClosingLine:
      "इन शिक्षाओं का अध्ययन ज्ञान, करुणा और शांति को गहरा करे।",
    unableToLoadCertificate: "प्रमाणपत्र लोड नहीं हो सका",

    // Profile
    myProfile: "मेरी प्रोफ़ाइल",
    manageDetails: "अपनी व्यक्तिगत जानकारी प्रबंधित करें।",
    fullNameFieldLabel: "पूरा नाम",
    ageLabel: "आयु",
    agePlaceholder: "अपनी आयु दर्ज करें",
    genderLabel: "लिंग",
    selectGender: "लिंग चुनें",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    genderPreferNotToSay: "बताना नहीं चाहते",
    saveProfile: "प्रोफ़ाइल सहेजें",
    profileSaved: "प्रोफ़ाइल सफलतापूर्वक सहेजी गई।",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("jp_language") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("jp_language", language);
    } catch {}

    document.documentElement.lang = language;
  }, [language]);

  const t = (key) =>
    translations[language]?.[key] ??
    translations.en[key] ??
    key;

  const toggleLanguage = () => {
    setLanguage((current) => current === "en" ? "hi" : "en");
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
