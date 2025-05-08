// Оголошення функції loadHTML
async function loadHTML(selector, url) {
  const el = document.querySelector(selector);
  if (el) {
    const res = await fetch(url);
    const html = await res.text();
    el.innerHTML = html;
  }
}

// Виклик після завантаження сторінки
document.addEventListener("DOMContentLoaded", async () => {
  await loadHTML("#header", "./partials/header.html");
  await loadHTML("#hero", "./partials/hero.html");
  await loadHTML("#informations", "./partials/informations.html");
  await loadHTML("#competitions", "./partials/competitions.html");
  await loadHTML("#news", "./partials/news.html");
  await loadHTML("#partners", "./partials/partners.html");
  await loadHTML("#footer", "./partials/footer.html");
  await loadHTML("#mob-menu", "./partials/mob-menu.html");
  await loadHTML("#admin", "./partials/admin.html");

  const infoBtnModule = await import("./js/info-btn.js");
  const mobMenuModule = await import("./js/mob-menu.js");

  infoBtnModule.init?.();
  mobMenuModule.init?.(); // Тільки після того, як #mob-menu вже є в DOM
});

// Структура змагань для кожного року (може бути отримано з бази даних через адмінку)
const competitionsData = {
  2020: [
    {
      date: "2020-06-15",
      city: "Київ",
      name: "Змагання 1",
      link: "https://example.com",
      photo: "img1.jpg",
    },
    {
      date: "2020-07-20",
      city: "Львів",
      name: "Змагання 2",
      link: "https://example.com",
      photo: "img2.jpg",
    },
    // ... більше змагань
  ],
  2021: [
    {
      date: "2021-05-10",
      city: "Одеса",
      name: "Змагання 3",
      link: "https://example.com",
      photo: "img3.jpg",
    },
    {
      date: "2021-08-22",
      city: "Харків",
      name: "Змагання 4",
      link: "https://example.com",
      photo: "img4.jpg",
    },
    // ... більше змагань
  ],
  // Додаткові роки
};

let currentYear = 2020; // Початковий рік
let currentPage = 1; // Початкова сторінка
const itemsPerPage = 5; // Кількість змагань на сторінці

// Функція для оновлення таблиці змагань
function updateCompetitionsTable() {
  const tableBody = document.querySelector("#competitions tbody");
  tableBody.innerHTML = ""; // Очищаємо попередні дані

  const data = competitionsData[currentYear];
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = data.slice(startIndex, endIndex);

  currentPageData.forEach((competition) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${competition.date}</td>
          <td>${competition.city}</td>
          <td>${competition.name}</td>
          <td><a href="${competition.link}" target="_blank">Посилання</a></td>
          <td><img src="${competition.photo}" alt="${competition.name}" width="100"></td>
      `;
    tableBody.appendChild(row);
  });

  // Оновлюємо номер сторінки
  document.querySelector(".page-number").textContent = currentPage;
}

// Обробник для кнопок вибору року
document.querySelectorAll(".year-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    currentYear = parseInt(e.target.getAttribute("data-year"));
    currentPage = 1; // Скидаємо сторінку на 1 при зміні року
    updateCompetitionsTable();
  });
});

// Обробники для пагінації
document.querySelector(".prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateCompetitionsTable();
  }
});

document.querySelector(".next-btn").addEventListener("click", () => {
  const data = competitionsData[currentYear];
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateCompetitionsTable();
  }
});

// Початкове завантаження даних
updateCompetitionsTable();
