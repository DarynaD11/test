const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
require("dotenv").config();

const newsController = require("./routes/news");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

let hashedPassword;
bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
  if (err) throw err;
  hashedPassword = hash;
});

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.status(401).send("Unauthorized");
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// 🔓 ПУБЛІЧНИЙ МАРШРУТ — бачать усі
app.get("/api/news", newsController.getAllNews);

// 🔐 АДМІНСЬКІ МАРШРУТИ — тільки авторизовані
app.post("/api/news/add-news", isAuthenticated, newsController.addNews);
app.delete("/api/news/delete-news/:id", isAuthenticated, newsController.deleteNews);

// Статичні файли
app.use(express.static(path.join(__dirname, "public")));

// Логін
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) return res.status(500).send("Server error");
    if (result) {
      req.session.authenticated = true;
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  });
});

// Логаут
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout failed");
    res.sendStatus(200);
  });
});

// Видача адмін-панелі
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
