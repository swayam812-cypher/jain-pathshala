import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:bookId", requireAuth, (req, res) => {
  const bookId = Number(req.params.bookId);
  const questions = db
    .prepare("SELECT * FROM quizzes WHERE book_id = ? ORDER BY order_index")
    .all(bookId)
    .map((q) => ({
      id: q.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options ? JSON.parse(q.options) : null,
    }));
  res.json({ questions });
});

router.post("/:bookId/submit", requireAuth, (req, res) => {
  const userId = req.user.id;
  const bookId = Number(req.params.bookId);
  const { responses } = req.body || {}; // { [question_id]: answer }

  const questions = db.prepare("SELECT * FROM quizzes WHERE book_id = ?").all(bookId);
  const mcqs = questions.filter((q) => q.question_type === "MCQ");

  let correct = 0;
  for (const q of mcqs) {
    const answer = responses?.[q.id];
    if (answer !== undefined && Number(answer) === q.correct_option_index) {
      correct++;
    }
  }
  const scorePercentage = mcqs.length > 0 ? Math.round((correct / mcqs.length) * 100) : 0;
  const passed = scorePercentage >= 50 ? 1 : 0;

  db.prepare(
    "INSERT INTO quiz_submissions (user_id, book_id, score_percentage, responses, passed) VALUES (?, ?, ?, ?, ?)"
  ).run(userId, bookId, scorePercentage, JSON.stringify(responses || {}), passed);

  res.json({ score_percentage: scorePercentage, passed: !!passed });
});

export default router;
