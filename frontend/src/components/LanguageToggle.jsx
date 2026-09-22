import "./LanguageToggle.css";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="language-toggle"
      aria-label="Switch website language"
      title="Switch language"
    >
      {language === "en" ? "हिन्दी" : "English"}
    </button>
  );
}