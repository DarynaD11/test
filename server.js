const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const newsRoutes = require("./routes/news"); // Імпортуємо маршрути новин
require("dotenv").config(); // Для використання змінних середовища

// Твій секретний пароль (переміщаємо в середовище)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Перемістіть це в .env файл

// Хешуємо пароль при старті сервера
let hashedPassword;
bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
  if (err) throw err;
  hashedPassword = hash;
});

// Middleware для перевірки сесії
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.status(401).send("Unauthorized");
}



// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Сесії
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key", // Секретний ключ для сесії з середовища
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api/news", isAuthenticated, newsRoutes);

// Статичні файли (CSS, JS, зображення, HTML)
app.use(express.static(path.join(__dirname, "public")));

// -------------------- API маршрути --------------------

// Авторизація: логін
app.post("/api/login", (req, res) => {
  const { password } = req.body;

  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) return res.status(500).send("Server error");
    if (result) {
      req.session.authenticated = true;
      res.sendStatus(200); // OK
    } else {
      res.sendStatus(401); // Unauthorized
    }
  });
});

// Вихід
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout failed");
    res.sendStatus(200); // OK
  });
});

// Видача адмін-панелі
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
