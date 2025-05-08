document.addEventListener('DOMContentLoaded', () => {
  // Кнопка для відкриття меню
  const openMenuBtn = document.querySelector('.js-open-menu');
  // Кнопка для закриття меню
  const closeMenuBtn = document.querySelector('.js-close-menu');
  // Саме меню
  const mobileMenu = document.querySelector('.mobile_menu');

  // Відкриваємо меню
  openMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'true');
  });

  // Закриваємо меню
  closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    openMenuBtn.setAttribute('aria-expanded', 'false');
  });
});
