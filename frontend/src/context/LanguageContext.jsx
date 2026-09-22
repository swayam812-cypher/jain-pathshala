
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