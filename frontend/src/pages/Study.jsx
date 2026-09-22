import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

let ytApiPromise = null;
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return ytApiPromise;
}

export default function Study() {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [percent, setPercent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    api.get(`/books/${bookId}`).then((res) => {
      setBook(res.data.book);
      const ch = res.data.chapters.find((c) => String(c.id) === String(chapterId));
      setChapter(ch);
      setPercent(ch?.watch_percentage || 0);
      setCompleted(!!ch?.is_completed);
    });
  }, [bookId, chapterId]);

  useEffect(() => {
    if (!chapter?.youtube_video_id) return;
    let destroyed = false;

    loadYouTubeApi().then((YT) => {
      if (destroyed) return;
      playerRef.current = new YT.Player(`yt-player-${chapter.id}`, {
        videoId: chapter.youtube_video_id,
        playerVars: { rel: 0, modestbranding: 1 },
      });
    });

    intervalRef.current = setInterval(async () => {
      const p = playerRef.current;
      if (!p || typeof p.getDuration !== "function") return;
      const duration = p.getDuration();
      const current = p.getCurrentTime();
      if (!duration) return;
      const pct = Math.min(100, Math.round((current / duration) * 100));
      if (pct > percent) {
        setPercent(pct);
        try {
          const res = await api.post("/progress", { chapter_id: chapter.id, watch_percentage: pct });
          setCompleted(res.data.is_completed);
        } catch {
          // ignore transient network errors; will retry on next tick
        }
      }
    }, 10000);

    return () => {
      destroyed = true;
      clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id]);

  if (!book || !chapter) {
    return <div className="min-h-screen bg-cream"><Navbar /><p className="p-10 text-slate/40">{t("loading")}</p></div>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(`/books/${bookId}`)} className="flex items-center gap-2 text-slate/60 hover:text-slate">
            <BackIcon />
            <span>
              <span className="block text-[11px] font-medium tracking-[0.14em] text-slate/40">{t("nowStudying")}</span>
              <span className="block font-display text-lg text-slate">{chapter.title}</span>
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] tracking-[0.1em] text-slate/40">{t("progressLabel")}</p>
              <p className="text-sm font-medium text-slate">{percent}%</p>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-xs font-medium ${completed ? "bg-maroon/10 text-maroon" : "bg-slate/10 text-slate/50"}`}>
              {completed ? `✓ ${t("completed")}` : t("inProgress")}
            </span>
          </div>
        </div>

        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-black/5">
          <div className="h-full rounded-full bg-maroon transition-all" style={{ width: `${percent}%` }} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
            <div id={`yt-player-${chapter.id}`} className="aspect-video w-full" />
          </div>
          <div className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
            {chapter.pdf_url ? (
              <iframe src={chapter.pdf_url} title="Chapter reading" className="aspect-video w-full lg:h-full lg:aspect-auto" style={{ minHeight: 420 }} />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center text-sm text-slate/35">
                {t("noPdfYet")}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
