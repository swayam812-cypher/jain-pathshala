import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function bookProgress(userId, bookId) {
  const chapters = db
    .prepare("SELECT id FROM chapters WHERE book_id = ? ORDER BY order_index")
    .all(bookId);
  if (chapters.length === 0) return { percent: 0, completedCount: 0, total: 0, allCompleted: false };

  let completedCount = 0;
  let sum = 0;
  for (const ch of chapters) {
    const p = db
      .prepare("SELECT watch_percentage, is_completed FROM user_progress WHERE user_id = ? AND chapter_id = ?")
      .get(userId, ch.id);
    if (p) {
      sum += Math.min(100, p.watch_percentage);
      if (p.is_completed) completedCount++;
    }
  }
  return {
    percent: Math.round(sum / chapters.length),
    completedCount,
    total: chapters.length,
    allCompleted: completedCount === chapters.length,
  };
}

router.get("/", requireAuth, (req, res) => {
  const userId = req.user.id;
  const books = db.prepare("SELECT * FROM books ORDER BY order_index").all();

  let previousCompleted = true; // Book 1 always unlocked
  const result = books.map((book) => {
    const progress = bookProgress(userId, book.id);
    const submission = db
      .prepare(
        "SELECT * FROM quiz_submissions WHERE user_id = ? AND book_id = ? ORDER BY created_at DESC LIMIT 1"
      )
      .get(userId, book.id);
    const certificate = db
      .prepare("SELECT * FROM certificates WHERE user_id = ? AND book_id = ?")
      .get(userId, book.id);

    const unlocked = previousCompleted;
    const bookPassed = !!submission?.passed;
    previousCompleted = bookPassed;

    return {
      id: book.id,
      title: book.title,
      order_index: book.order_index,
      chapters_completed: progress.completedCount,
      chapters_total: progress.total,
      percent: progress.percent,
      unlocked,
      passed: bookPassed,
      has_certificate: !!certificate,
      last_attempt: submission
        ? { score_percentage: submission.score_percentage, passed: !!submission.passed }
        : null,
    };
  });

  res.json({ books: result });
});

router.get("/:bookId", requireAuth, (req, res) => {
  const userId = req.user.id;
  const bookId = Number(req.params.bookId);
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const chapters = db
    .prepare("SELECT * FROM chapters WHERE book_id = ? ORDER BY order_index")
    .all(bookId)
    .map((ch) => {
      const p = db
        .prepare("SELECT watch_percentage, is_completed FROM user_progress WHERE user_id = ? AND chapter_id = ?")
        .get(userId, ch.id);
      return {
        id: ch.id,
        title: ch.title,
        youtube_video_id: ch.youtube_video_id,
        pdf_url: ch.pdf_url,
        order_index: ch.order_index,
        watch_percentage: p ? p.watch_percentage : 0,
        is_completed: p ? !!p.is_completed : false,
      };
    });

  const submission = db
    .prepare("SELECT * FROM quiz_submissions WHERE user_id = ? AND book_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(userId, bookId);

  const allChaptersCompleted = chapters.length > 0 && chapters.every((c) => c.is_completed);

  res.json({
    book,
    chapters,
    all_chapters_completed: allChaptersCompleted,
    last_attempt: submission
      ? { score_percentage: submission.score_percentage, passed: !!submission.passed }
      : null,
  });
});

export default router;
