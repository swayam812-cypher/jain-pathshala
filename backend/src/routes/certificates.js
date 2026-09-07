import { Router } from "express";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function generateSerial(bookId) {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `JPL-${year}-${rand}`;
}

function getOrCreateCertificate(userId, bookId) {
  let cert = db
    .prepare("SELECT * FROM certificates WHERE user_id = ? AND book_id = ?")
    .get(userId, bookId);
  if (!cert) {
    const submission = db
      .prepare(
        "SELECT * FROM quiz_submissions WHERE user_id = ? AND book_id = ? AND passed = 1 ORDER BY created_at DESC LIMIT 1"
      )
      .get(userId, bookId);
    if (!submission) return null;
    const serial = generateSerial(bookId);
    const info = db
      .prepare(
        "INSERT INTO certificates (user_id, book_id, serial_number) VALUES (?, ?, ?)"
      )
      .run(userId, bookId, serial);
    cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(info.lastInsertRowid);
  }
  return cert;
}

router.get("/:bookId", requireAuth, (req, res) => {
  const bookId = Number(req.params.bookId);
  const cert = getOrCreateCertificate(req.user.id, bookId);
  if (!cert) return res.status(403).json({ error: "Quiz not yet passed for this book" });

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(bookId);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);

  res.json({
    serial_number: cert.serial_number,
    issue_date: cert.issue_date,
    book_title: book.title,
    full_name: user.full_name,
  });
});

router.get("/:bookId/pdf", requireAuth, async (req, res) => {
  const bookId = Number(req.params.bookId);
  const cert = getOrCreateCertificate(req.user.id, bookId);
  if (!cert) return res.status(403).json({ error: "Quiz not yet passed for this book" });

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(bookId);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const serif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const serifRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const serifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const maroon = rgb(0.63, 0.24, 0.16);
  const slate = rgb(0.15, 0.17, 0.2);
  const sand = rgb(0.98, 0.94, 0.87);
  const gold = rgb(0.87, 0.65, 0.25);

  page.drawRectangle({ x: 0, y: 0, width, height, color: sand });
  page.drawRectangle({
    x: 24, y: 24, width: width - 48, height: height - 48,
    borderColor: maroon, borderWidth: 2,
  });
  page.drawRectangle({
    x: 32, y: 32, width: width - 64, height: height - 64,
    borderColor: maroon, borderWidth: 0.75,
  });

  const centerText = (text, y, font, size, color = slate) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  centerText("JAIN PATHSHALA", height - 100, serif, 12, maroon);
  centerText("Certificate of Completion", height - 160, serif, 34, slate);
  centerText("This is to acknowledge that", height - 200, serifItalic, 13, slate);
  centerText(user.full_name, height - 250, serif, 26, maroon);
  centerText("has diligently completed the study and reflection of the book", height - 285, serifRegular, 13, slate);
  centerText(book.title, height - 325, serif, 22, slate);

  const issueDate = new Date(cert.issue_date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  page.drawText("DATE OF ISSUE", { x: 120, y: 130, size: 9, font: serif, color: rgb(0.5, 0.5, 0.5) });
  page.drawText(issueDate, { x: 120, y: 112, size: 12, font: serifRegular, color: slate });

  const serialLabel = "SERIAL NUMBER";
  const serialLabelW = serif.widthOfTextAtSize(serialLabel, 9);
  page.drawText(serialLabel, { x: width - 120 - serialLabelW, y: 130, size: 9, font: serif, color: rgb(0.5, 0.5, 0.5) });
  const serialW = serifRegular.widthOfTextAtSize(cert.serial_number, 12);
  page.drawText(cert.serial_number, { x: width - 120 - serialW, y: 112, size: 12, font: serifRegular, color: slate });

  centerText("May the study of these teachings deepen wisdom, compassion, and peace.", 70, serifItalic, 11, rgb(0.4, 0.4, 0.4));

  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${book.title.replace(/\s+/g, "_")}_Certificate.pdf"`
  );
  res.send(Buffer.from(pdfBytes));
});

export default router;
