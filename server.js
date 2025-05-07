const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const newsRoutes = require("./routes/news"); // Для роботи з новинами

// Твій секретний пароль
const ADMIN_PASSWORD = "yourPasswordHere"; // Заміни на свій пароль

// Хешуємо пароль один раз при старті сервера
let hashedPassword;
bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
  if (err) throw err;
  hashedPassword = hash;
});

// Міддлвар для перевірки пароля
function checkAdminPassword(req, res, next) {
  const { password } = req.body;

  // Якщо користувач уже авторизований через сесію
  if (req.session.authenticated) {
    return next(); // Пропускаємо перевірку пароля
  }

  // Перевіряємо введений пароль з хешованим
  bcrypt.compare(password, hashedPassword, (err, result) => {
    if (err) throw err;
    if (result) {
      req.session.authenticated = true; // Зберігаємо авторизацію в сесії
      return next(); // Пропускаємо перевірку пароля
    } else {
      res.status(401).send("Unauthorized: Incorrect password");
    }
  });
}

// Використовуємо body-parser для зчитування POST даних
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Налаштування сесій
app.use(
  session({
    secret: "secret-key", // Ваш секретний ключ
    resave: false,
    saveUninitialized: true,
  })
);

// Статичні файли (CSS, JS, зображення)
app.use(express.static(path.join(__dirname, "public")));

// Маршрут для адмін-панелі
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Маршрут для додавання новини через адмін-панель
app.post("/admin/add-news", checkAdminPassword, (req, res) => {
  const { title, content } = req.body;
  // Викликаємо функцію додавання новини з `news.js`
  newsRoutes.addNews(title, content)
    .then(() => res.send("News added successfully"))
    .catch((err) => res.status(500).send(err));
});

// Маршрут для виходу з адмінки (сесія буде знищена)
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Failed to log out.");
    res.send("Logged out successfully.");
  });
});

// Маршрут для новин
app.use("/api/news", newsRoutes);

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
