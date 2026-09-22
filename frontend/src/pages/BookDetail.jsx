import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);

  const load = () => {
    api.get(`/books/${bookId}`).then((res) => setData(res.data));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  if (!data) return <div className="min-h-screen bg-cream"><Navbar /><p className="p-10 text-slate/40">{t("loading")}</p></div>;

  const { book, chapters, all_chapters_completed, last_attempt } = data;
  const completedCount = chapters.filter((c) => c.is_completed).length;
  const percent = chapters.length ? Math.round((completedCount / chapters.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <button onClick={() => navigate("/")} className="text-xs font-medium tracking-[0.14em] text-maroon hover:underline">
          ← {t("journeyBack")}
        </button>

        <div className="mt-3 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-slate/40">{t("bookLabel")} {String(book.order_index).padStart(2, "0")}</p>
            <h1 className="mt-1 font-display text-4xl text-slate">{book.title}</h1>
            <p className="mt-2 text-sm text-slate/50">{completedCount} {t("of")} {chapters.length} {t("chaptersCompletedSuffix")} ({percent}%)</p>
          </div>

          <div className="text-right">
            <button
              disabled={!all_chapters_completed}
              onClick={() => navigate(`/books/${bookId}/quiz`)}
              className="flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-medium text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:bg-slate/20"
            >
              <ClipboardIcon /> {t("takeBookTest")}
            </button>
            {last_attempt && (
              <p className="mt-1.5 text-xs text-slate/40">
                {t("lastAttempt")}: {last_attempt.score_percentage}% · {last_attempt.passed ? t("passed") : t("retryNeeded")}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {chapters.map((ch, i) => (
            <Link
              key={ch.id}
              to={`/books/${bookId}/chapters/${ch.id}`}
              className="flex items-center justify-between rounded-lg border border-black/5 bg-white px-5 py-4 shadow-sm transition hover:border-maroon/20"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-sm font-medium text-slate/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="border-b border-maroon/30 pb-0.5 text-sm font-medium text-slate">{ch.title}</span>
              </div>
              {ch.is_completed ? (
                <span className="flex items-center gap-1.5 text-xs font-medium text-maroon">
                  <CheckIcon /> {t("completed")}
                </span>
              ) : (
                <span className="text-xs text-slate/35">{Math.round(ch.watch_percentage)}% {t("watched")}</span>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 12h6M9 16h6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}
