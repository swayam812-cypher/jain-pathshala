import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/books", (req, res) => {
  const books = db.prepare("SELECT * FROM books ORDER BY order_index").all();
  const withChapters = books.map((b) => ({
    ...b,
    chapters: db.prepare("SELECT * FROM chapters WHERE book_id = ? ORDER BY order_index").all(b.id),
    quizzes: db.prepare("SELECT * FROM quizzes WHERE book_id = ? ORDER BY order_index").all(b.id)
      .map((q) => ({ ...q, options: q.options ? JSON.parse(q.options) : null })),
  }));
  res.json({ books: withChapters });
});

router.put("/chapters/:id", (req, res) => {
  const { title, youtube_video_id, pdf_url } = req.body || {};
  const chapter = db.prepare("SELECT * FROM chapters WHERE id = ?").get(req.params.id);
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  db.prepare(
    "UPDATE chapters SET title = COALESCE(?, title), youtube_video_id = COALESCE(?, youtube_video_id), pdf_url = COALESCE(?, pdf_url) WHERE id = ?"
  ).run(title ?? null, youtube_video_id ?? null, pdf_url ?? null, req.params.id);
  res.json({ ok: true });
});

router.post("/quizzes", (req, res) => {
  const { book_id, question_text, question_type, options, correct_option_index, order_index } = req.body || {};
  if (!book_id || !question_text || !question_type) {
    return res.status(400).json({ error: "book_id, question_text, and question_type are required" });
  }
  const info = db.prepare(
    "INSERT INTO quizzes (book_id, question_text, question_type, options, correct_option_index, order_index) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    book_id,
    question_text,
    question_type,
    options ? JSON.stringify(options) : null,
    correct_option_index ?? null,
    order_index ?? 0
  );
  res.json({ id: info.lastInsertRowid });
});

router.put("/quizzes/:id", (req, res) => {
  const { question_text, question_type, options, correct_option_index, order_index } = req.body || {};
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Question not found" });
  db.prepare(
    `UPDATE quizzes SET
      question_text = COALESCE(?, question_text),
      question_type = COALESCE(?, question_type),
      options = COALESCE(?, options),
      correct_option_index = COALESCE(?, correct_option_index),
      order_index = COALESCE(?, order_index)
    WHERE id = ?`
  ).run(
    question_text ?? null,
    question_type ?? null,
    options ? JSON.stringify(options) : null,
    correct_option_index ?? null,
    order_index ?? null,
    req.params.id
  );
  res.json({ ok: true });
});

router.delete("/quizzes/:id", (req, res) => {
  db.prepare("DELETE FROM quizzes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get("/submissions", (req, res) => {
  const rows = db.prepare(`
    SELECT qs.*, u.full_name, u.email, b.title as book_title
    FROM quiz_submissions qs
    JOIN users u ON u.id = qs.user_id
    JOIN books b ON b.id = qs.book_id
    ORDER BY qs.created_at DESC
  `).all();

  const result = rows.map((r) => {
    const responses = JSON.parse(r.responses);
    const theoryQuestions = db
      .prepare("SELECT id, question_text FROM quizzes WHERE book_id = ? AND question_type = 'Theory'")
      .all(r.book_id);
    const theoryAnswers = theoryQuestions.map((q) => ({
      question: q.question_text,
      answer: responses[q.id] || "",
    }));
    return {
      id: r.id,
      student: r.full_name,
      email: r.email,
      book_title: r.book_title,
      score_percentage: r.score_percentage,
      passed: !!r.passed,
      created_at: r.created_at,
      theory_answers: theoryAnswers,
    };
  });

  res.json({ submissions: result });
});

router.get("/students", (req, res) => {
  const students = db.prepare("SELECT id, email, full_name, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC").all();
  res.json({ students });
});

export default router;
