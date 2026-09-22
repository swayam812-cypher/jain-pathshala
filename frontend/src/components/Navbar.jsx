
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-black/5 bg-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maroon text-cream font-display text-lg">
            ज
          </span>

          <span>
            <span className="block font-display text-lg leading-tight text-slate">
              {t("appName")}
            </span>

            <span className="block text-[10px] tracking-[0.18em] text-slate/50">
              {language === "hi" ? "शिक्षा यात्रा" : "LEARNING JOURNEY"}
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <LanguageToggle />

          {user && (
            <nav className="flex flex-wrap items-center gap-6 text-sm text-slate/80">
              <Link
                to="/"
                className="flex items-center gap-1.5 hover:text-slate"
              >
                <BookIcon />
                {t("journey")}
              </Link>

              <Link to="/profile" className="hover:text-slate">
                {t("profile")}
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-slate">
                  {language === "hi" ? "एडमिन" : "Admin"}
                </Link>
              )}

              <span className="text-slate">
                {user.full_name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-maroon hover:text-maroon-dark"
              >
                <LogoutIcon />
                {language === "hi" ? "लॉग आउट" : "Logout"}
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function BookIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z" />
      <path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}