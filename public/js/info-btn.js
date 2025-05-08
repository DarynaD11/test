export function init() {
  document.querySelectorAll('.info-btn-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.info-btn');

      // Закриваємо інші
      document.querySelectorAll('.info-btn').forEach(item => {
        if (item !== parent) {
          item.classList.remove('open');
          const body = item.querySelector('.info-btn-body');
          if (body) body.style.maxHeight = null;
        }
      });

      // Відкриваємо/закриваємо поточний
      parent.classList.toggle('open');

      const body = toggle.querySelector('.info-btn-body');
      if (parent.classList.contains('open')) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = null;
      }
    });
  });
}
