import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function Quiz() {
  const { bookId } = useParams();
  const navigate = useNavigate();
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
            {result.passed ? "Well done — you passed!" : "Not quite there yet"}
          </h1>
          <p className="mt-2 text-sm text-slate/60">
            {result.passed
              ? "Your certificate is ready and the next book has been unlocked."
              : "You need at least 50% on the multiple choice questions to pass. Review the chapters and try again."}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {result.passed && (
              <button onClick={() => navigate(`/certificate/${bookId}`)} className="rounded-full bg-maroon px-5 py-2.5 text-sm font-medium text-white hover:bg-maroon-dark">
                View Certificate
              </button>
            )}
            <button onClick={() => navigate("/")} className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-slate hover:bg-black/5">
              Back to Journey
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
        <button onClick={() => navigate(`/books/${bookId}`)} className="text-xs font-medium tracking-[0.14em] text-maroon hover:underline">← BACK</button>
        <h1 className="mt-3 font-display text-3xl text-slate">Book Test</h1>
        <p className="mt-2 text-sm text-slate/50">Answer every question below. You need 50% or more on the multiple choice questions to pass.</p>

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
                  placeholder="Write your reflection here…"
                />
              )}
            </div>
          ))}

          <button disabled={busy} type="submit" className="w-full rounded-full bg-maroon py-3 text-sm font-medium text-white hover:bg-maroon-dark disabled:opacity-60">
            {busy ? "Submitting…" : "Submit Test"}
          </button>
        </form>
      </main>
    </div>
  );
}
