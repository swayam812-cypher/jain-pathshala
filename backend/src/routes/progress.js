import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, (req, res) => {
  const userId = req.user.id;
  const { chapter_id, watch_percentage } = req.body || {};
  if (!chapter_id || watch_percentage == null) {
    return res.status(400).json({ error: "chapter_id and watch_percentage are required" });
  }

  const chapter = db.prepare("SELECT * FROM chapters WHERE id = ?").get(chapter_id);
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });

  const existing = db
    .prepare("SELECT * FROM user_progress WHERE user_id = ? AND chapter_id = ?")
    .get(userId, chapter_id);

  const clamped = Math.max(0, Math.min(100, watch_percentage));
  const newPercentage = existing ? Math.max(existing.watch_percentage, clamped) : clamped;
  const isCompleted = newPercentage >= 90 ? 1 : 0;

  if (existing) {
    db.prepare(
      "UPDATE user_progress SET watch_percentage = ?, is_completed = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(newPercentage, isCompleted, existing.id);
  } else {
    db.prepare(
      "INSERT INTO user_progress (user_id, chapter_id, watch_percentage, is_completed) VALUES (?, ?, ?, ?)"
    ).run(userId, chapter_id, newPercentage, isCompleted);
  }

  res.json({ watch_percentage: newPercentage, is_completed: !!isCompleted });
});

export default router;
