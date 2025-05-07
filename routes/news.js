const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/news.db");

// Створити таблицю, якщо не існує
db.run(`CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT
)`);

// Отримати всі новини
router.get("/", (req, res) => {
  db.all("SELECT * FROM news ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Функція для додавання новини
router.addNews = (title, content) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO news (title, content) VALUES (?, ?)",
      [title, content],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

module.exports = router;
