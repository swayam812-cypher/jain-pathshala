import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/index.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", (req, res) => {
  const { email, password, full_name } = req.body || {};
  if (!email || !password || !full_name) {
    return res.status(400).json({ error: "Email, password, and full name are required" });
  }
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, 'student')")
    .run(email.toLowerCase(), hash, full_name);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db.prepare("SELECT id, email, full_name, role FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

export default router;
