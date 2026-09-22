import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function Journey() {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/books").then((res) => {
      setBooks(res.data.books);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-xs font-medium tracking-[0.16em] text-maroon">{t("journeyEyebrow")}</p>
        <h1 className="mt-2 font-display text-4xl text-slate">{t("sevenBooks")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate/60">
          {t("journeyIntro")}
        </p>

        {loading ? (
          <p className="mt-10 text-slate/40">{t("loadingJourney")}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} t={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookCard({ book, index, t }) {
  const locked = !book.unlocked;
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className={`rounded-xl border border-black/5 bg-white p-6 shadow-sm ${locked ? "opacity-80" : ""}`}>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium tracking-[0.14em] text-slate/40">{t("bookLabel")} {num}</p>
        {book.has_certificate ? (
          <MedalIcon />
        ) : locked ? (
          <LockIcon />
        ) : null}
      </div>
      <h3 className="mt-1 font-display text-2xl text-slate/90">{book.title}</h3>

      <div className="mt-5 flex items-center justify-between text-xs text-slate/50">
        <span>{book.chapters_completed}/{book.chapters_total} {t("chaptersLower")}</span>
        <span>{book.percent}%</span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-maroon" style={{ width: `${book.percent}%` }} />
      </div>

      {locked ? (
        <p className="mt-5 text-xs text-slate/35">{t("completePreviousToUnlock")}</p>
      ) : (
        <div className="mt-5 flex gap-2">
          <Link
            to={`/books/${book.id}`}
            className="flex items-center gap-1.5 rounded-full bg-maroon px-4 py-2 text-xs font-medium text-white hover:bg-maroon-dark"
          >
            <PlayIcon /> {book.percent >= 100 ? t("revisitBtn") : t("continueBtn")}
          </Link>
          {book.has_certificate && (
            <Link
              to={`/certificate/${book.id}`}
              className="rounded-full border border-maroon/30 px-4 py-2 text-xs font-medium text-maroon hover:bg-maroon/5"
            >
              {t("certificateBtn")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate/30">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-maroon">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14l-2 7 5-3 5 3-2-7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
