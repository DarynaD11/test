export function init() {
  const openMenuBtn = document.querySelector(".js-open-menu");
  const closeMenuBtn = document.querySelector(".js-close-menu");
  const mobileMenu = document.querySelector(".mobile_menu");

  if (openMenuBtn && closeMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("is-open");
      openMenuBtn.setAttribute("aria-expanded", "true");
    });

    closeMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      openMenuBtn.setAttribute("aria-expanded", "false");
    });
  } else {
    console.warn("Елементи меню не знайдено");
  }
}
