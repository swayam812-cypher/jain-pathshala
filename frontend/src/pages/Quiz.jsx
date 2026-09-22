import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

export default function Quiz() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/quiz/${bookId}`).then((res) => setQuestions(res.data.questions));
  }, [bookId]);

  const setAnswer = (qId, value) => setResponses((r) => ({ ...r, [qId]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.post(`/quiz/${bookId}/submit`, { responses });
      setResult(res.data);
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="mx-auto max-w-lg px-6 py-16 text-center">
          <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${result.passed ? "bg-maroon/10 text-maroon" : "bg-slate/10 text-slate/50"}`}>
            <span className="font-display text-2xl">{result.score_percentage}%</span>
          </div>
          <h1 className="font-display text-2xl text-slate">
            {result.passed ? t("passedTitle") : t("failedTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate/60">
            {result.passed ? t("passedDesc") : t("failedDesc")}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {result.passed && (
              <button onClick={() => navigate(`/certificate/${bookId}`)} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-medium text-white hover:bg-maroon-dark">
                {t("viewCertificate")}
              </button>
            )}
            <button onClick={() => navigate("/")} className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-slate hover:bg-black/5">
              {t("backToJourney")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <button onClick={() => navigate(`/books/${bookId}`)} className="text-xs font-medium tracking-[0.14em] text-maroon hover:underline">← {t("back")}</button>
        <h1 className="mt-3 font-display text-3xl text-slate">{t("bookTestTitle")}</h1>
        <p className="mt-2 text-sm text-slate/50">{t("bookTestDesc")}</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate">{i + 1}. {q.question_text}</p>
              {q.question_type === "MCQ" ? (
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-black/5 px-3 py-2 text-sm hover:border-maroon/30">
                      <input
                        type="radio" name={`q-${q.id}`} value={idx}
                        checked={responses[q.id] === idx}
                        onChange={() => setAnswer(q.id, idx)}
                        className="accent-maroon"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={responses[q.id] || ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="mt-3 w-full rounded-md border border-black/10 p-3 text-sm outline-none focus:border-maroon"
                  placeholder={t("reflectionPlaceholder")}
                />
              )}
            </div>
          ))}

          <button disabled={busy} type="submit" className="w-full rounded-full bg-maroon py-3 text-sm font-medium text-white hover:bg-maroon-dark disabled:opacity-60">
            {busy ? t("submitting") : t("submitTest")}
          </button>
        </form>
      </main>
    </div>
  );
}
