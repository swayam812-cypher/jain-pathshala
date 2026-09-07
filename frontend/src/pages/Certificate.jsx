import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function Certificate() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/certificates/${bookId}`)
      .then((res) => setCert(res.data))
      .catch((err) => setError(err.response?.data?.error || "Unable to load certificate"));
  }, [bookId]);

  const download = async () => {
    const res = await api.get(`/certificates/${bookId}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.book_title.replace(/\s+/g, "_")}_Certificate.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="p-10 text-center text-slate/50">{error}</p>
      </div>
    );
  }
  if (!cert) return <div className="min-h-screen bg-cream"><Navbar /><p className="p-10 text-slate/40">Loading…</p></div>;

  const issueDate = new Date(cert.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-sm text-slate/50 hover:text-slate">← Back to journey</button>
          <button onClick={download} className="flex items-center gap-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-medium text-white hover:bg-maroon-dark">
            <DownloadIcon /> Download PDF
          </button>
        </div>

        <div className="relative mt-8 border-2 border-maroon p-1">
          <div className="border border-maroon p-14 text-center" style={{ background: "linear-gradient(180deg,#fff 0%,#fdf6ec 100%)" }}>
            <span className="absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-gold" />
            <span className="absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-gold" />

            <p className="font-display text-3xl text-maroon">ॐ</p>
            <p className="mt-3 text-[11px] font-medium tracking-[0.2em] text-slate/50">JAIN PATHSHALA</p>
            <h1 className="mt-4 font-display text-4xl text-slate">Certificate of Completion</h1>
            <p className="mt-5 text-sm italic text-slate/60">This is to acknowledge that</p>
            <p className="mt-3 font-display text-3xl text-maroon">{cert.full_name}</p>
            <p className="mt-4 text-sm text-slate/70">has diligently completed the study and reflection of the book</p>
            <p className="mt-2 font-display text-2xl text-slate">{cert.book_title}</p>

            <div className="mt-10 flex justify-between text-left">
              <div>
                <p className="text-[10px] font-medium tracking-[0.14em] text-slate/40">DATE OF ISSUE</p>
                <p className="mt-1 text-sm text-slate">{issueDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium tracking-[0.14em] text-slate/40">SERIAL NUMBER</p>
                <p className="mt-1 text-sm text-slate">{cert.serial_number}</p>
              </div>
            </div>

            <p className="mt-8 text-xs italic text-slate/40">
              May the study of these teachings deepen wisdom, compassion, and peace.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
