import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function Admin() {
  const [tab, setTab] = useState("content");
  const [books, setBooks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const loadBooks = () => api.get("/admin/books").then((res) => setBooks(res.data.books));
  const loadSubmissions = () => api.get("/admin/submissions").then((res) => setSubmissions(res.data.submissions));

  useEffect(() => {
    loadBooks();
    loadSubmissions();
  }, []);

  const saveChapter = async (chapter) => {
    await api.put(`/admin/chapters/${chapter.id}`, {
      youtube_video_id: chapter.youtube_video_id,
      pdf_url: chapter.pdf_url,
    });
    loadBooks();
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl text-slate">Admin Panel</h1>
        <div className="mt-5 flex gap-2 border-b border-black/5">
          {["content", "scores"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize ${tab === t ? "border-b-2 border-maroon text-maroon" : "text-slate/50"}`}
            >
              {t === "content" ? "Video & PDF Content" : "Student Scores"}
            </button>
          ))}
        </div>

        {tab === "content" && (
          <div className="mt-6 space-y-6">
            {books.map((book) => (
              <div key={book.id} className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
                <h2 className="font-display text-xl text-slate">{book.title}</h2>
                <div className="mt-4 space-y-3">
                  {book.chapters.map((ch) => (
                    <ChapterRow key={ch.id} chapter={ch} onSave={saveChapter} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "scores" && (
          <div className="mt-6 space-y-4">
            {submissions.length === 0 && <p className="text-sm text-slate/40">No submissions yet.</p>}
            {submissions.map((s) => (
              <div key={s.id} className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate">{s.student} <span className="text-slate/40">· {s.email}</span></p>
                    <p className="text-xs text-slate/50">{s.book_title}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.passed ? "bg-maroon/10 text-maroon" : "bg-slate/10 text-slate/50"}`}>
                    {s.score_percentage}% · {s.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                {s.theory_answers.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
                    {s.theory_answers.map((t, i) => (
                      <div key={i} className="text-sm">
                        <p className="text-xs font-medium text-slate/50">{t.question}</p>
                        <p className="mt-0.5 text-slate/80">{t.answer || <span className="italic text-slate/30">No response</span>}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ChapterRow({ chapter, onSave }) {
  const [videoId, setVideoId] = useState(chapter.youtube_video_id || "");
  const [pdfUrl, setPdfUrl] = useState(chapter.pdf_url || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await onSave({ id: chapter.id, youtube_video_id: videoId, pdf_url: pdfUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-2 rounded-md border border-black/5 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
      <p className="text-sm text-slate/70">{chapter.title}</p>
      <input
        value={videoId} onChange={(e) => setVideoId(e.target.value)}
        placeholder="YouTube video ID"
        className="rounded-md border border-black/10 px-2.5 py-1.5 text-sm outline-none focus:border-maroon"
      />
      <input
        value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)}
        placeholder="PDF URL"
        className="rounded-md border border-black/10 px-2.5 py-1.5 text-sm outline-none focus:border-maroon"
      />
      <button onClick={handleSave} className="rounded-full bg-maroon px-3 py-1.5 text-xs font-medium text-white hover:bg-maroon-dark">
        {saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
