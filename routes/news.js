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

// Додавання новини
router.post("/add-news", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO news (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) return res.status(500).send(err);
      res.status(201).send({ id: this.lastID });
    }
  );
});

// Видалення новини
router.delete("/delete-news/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM news WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(`Error deleting news with ID: ${id}`, err);
      return res.status(500).send("Error deleting news");
    }
    if (this.changes === 0) {
      return res.status(404).send("News not found");
    }
    res.send("News deleted successfully");
  });
});

module.exports = router;
