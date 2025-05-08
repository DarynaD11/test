// Структура змагань для кожного року (може бути отримано з бази даних через адмінку)
const competitionsData = {
    2022: [
      { date: '2021-05-10', city: 'Одеса', name: 'Змагання 3', link: 'https://example.com', photo: 'img3.jpg' },
      { date: '2021-08-22', city: 'Харків', name: 'Змагання 4', link: 'https://example.com', photo: 'img4.jpg' },
      // ... більше змагань
    ],
    // Додаткові роки
  };
  
  let currentYear = 2022; // Початковий рік
  let currentPage = 1;
  const itemsPerPage = 6;
  
  // Функція оновлення таблиці змагань
  function updateCompetitionsTable() {
    const tableBody = document.querySelector('#competitions tbody');
    tableBody.innerHTML = '';
  
    const data = competitionsData[currentYear] || [];
    const totalPages = Math.ceil(data.length / itemsPerPage);
  
    // Корекція сторінки
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = data.slice(startIndex, endIndex);
  
    currentPageData.forEach(competition => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${competition.date}</td>
        <td>${competition.city}</td>
        <td>${competition.name}</td>
        <td><a href="${competition.link}" target="_blank">Посилання</a></td>
        <td><img src="${competition.photo}" alt="${competition.name}" width="100"></td>
      `;
      tableBody.appendChild(row);
    });
  
    generatePageButtons(totalPages);
  }
  
  // Функція генерації кнопок сторінок
  function generatePageButtons(totalPages) {
    const container = document.querySelector('.page-buttons');
    container.innerHTML = ''; // Очищення
  
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.classList.add('page-btn');
      if (i === currentPage) {
        btn.classList.add('active');
      }
  
      btn.addEventListener('click', () => {
        currentPage = i;
        updateCompetitionsTable();
      });
  
      container.appendChild(btn);
    }
  
    // Оновлення кнопок "prev" і "next"
    document.querySelector('.prev-btn').disabled = currentPage === 1;
    document.querySelector('.next-btn').disabled = currentPage === totalPages;
  }
  
  // Обробник кнопок року
  document.querySelectorAll('.year-btn').forEach(button => {
    button.addEventListener('click', e => {
      currentYear = parseInt(e.target.getAttribute('data-year'));
      currentPage = 1;
      updateCompetitionsTable();
    });
  });
  
  // Обробники кнопок "назад" і "вперед"
  document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateCompetitionsTable();
    }
  });
  
  document.querySelector('.next-btn').addEventListener('click', () => {
    const data = competitionsData[currentYear] || [];
    const totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateCompetitionsTable();
    }
  });
  
  // Початкове завантаження
  updateCompetitionsTable();
  