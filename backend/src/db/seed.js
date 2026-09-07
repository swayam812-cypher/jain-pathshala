import bcrypt from "bcryptjs";
import { db } from "./index.js";

const BOOKS = [
  "Balpothi",
  "Balbodh 1",
  "Balbodh 2",
  "Balbodh 3",
  "Vitrag Vigyan 1",
  "Vitrag Vigyan 2",
  "Vitrag Vigyan 3",
];

const bookCount = db.prepare("SELECT COUNT(*) as c FROM books").get().c;

if (bookCount === 0) {
  const insertBook = db.prepare(
    "INSERT INTO books (title, order_index) VALUES (?, ?)"
  );
  const insertChapter = db.prepare(
    "INSERT INTO chapters (book_id, title, youtube_video_id, pdf_url, order_index) VALUES (?, ?, ?, ?, ?)"
  );
  const insertQuiz = db.prepare(
    "INSERT INTO quizzes (book_id, question_text, question_type, options, correct_option_index, order_index) VALUES (?, ?, ?, ?, ?, ?)"
  );

  BOOKS.forEach((title, i) => {
    const bookId = insertBook.run(title, i + 1).lastInsertRowid;

    for (let c = 1; c <= 3; c++) {
      insertChapter.run(
        bookId,
        `${title} — Chapter ${c}`,
        "dQw4w9WgXcQ",
        "",
        c
      );
    }

    insertQuiz.run(
      bookId,
      `What is the central teaching introduced in ${title}?`,
      "MCQ",
      JSON.stringify([
        "Non-violence and compassion",
        "Wealth accumulation",
        "Political strategy",
        "None of the above",
      ]),
      0,
      1
    );
    insertQuiz.run(
      bookId,
      `Write your reflections on what you learned from ${title}.`,
      "Theory",
      null,
      null,
      2
    );
  });

  console.log("Seeded 7 books, chapters, and quizzes.");
}

const adminEmail = "admin@jainpathshala.org";
const existingAdmin = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(adminEmail);

if (!existingAdmin) {
  const hash = bcrypt.hashSync("admin123", 10);
  db.prepare(
    "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, 'admin')"
  ).run(adminEmail, hash, "Admin");
  console.log("Seeded admin user: admin@jainpathshala.org / admin123");
}
