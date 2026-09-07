import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db/index.js";
import "./db/seed.js";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import progressRoutes from "./routes/progress.js";
import quizRoutes from "./routes/quiz.js";
import certificateRoutes from "./routes/certificates.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Jain Pathshala API running on port ${PORT}`));
