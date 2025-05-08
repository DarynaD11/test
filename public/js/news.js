const newsData = [
  {
    title: 'Новина 1',
    date: '2025-05-01',
    content: 'Детальний опис новини 1...',
  },
  {
    title: 'Новина 2',
    date: '2025-04-28',
    content: 'Детальний опис новини 2...',
  },
  {
    title: 'Новина 3',
    date: '2025-04-20',
    content: 'Детальний опис новини 3...',
  },
];

const newsContainer = document.getElementById('news-container');

function generateNewsCards() {
  newsContainer.innerHTML = '';
  newsData.forEach(news => {
    const card = document.createElement('div');
    card.classList.add('news-card');
    card.innerHTML = `
        <div class="news-header">
          <h3>${news.title}</h3>
          <small>${news.date}</small>
        </div>
        <div class="news-content">${news.content}</div>
      `;
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
    newsContainer.appendChild(card);
  });
}

function generateNewsCards() {
  newsContainer.innerHTML = '';

  newsData.forEach(news => {
    const card = document.createElement('div');
    card.classList.add('news-card');
    card.innerHTML = `
        <div class="news-header">
          <h3>${news.title}</h3>
          <small>${news.date}</small>
        </div>
        <div class="news-content">${news.content}</div>
      `;

    card.addEventListener('click', () => {
      // Закриваємо всі інші новини
      document.querySelectorAll('.news-card').forEach(c => {
        if (c !== card) c.classList.remove('expanded');
      });

      // Перемикаємо поточну картку
      card.classList.toggle('expanded');
    });

    newsContainer.appendChild(card);
  });
}
