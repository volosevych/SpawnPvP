document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    if (!menu.classList.contains("active")) {
      menu.classList.add("active");
    } else {
      closeMenu();
    }
  });

  document.addEventListener("click", function (event) {
    if (
      menu.classList.contains("active") &&
      !menu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  function closeMenu() {
    menu.classList.add("closing");
    setTimeout(() => {
      menu.classList.remove("active", "closing");
    }, 300);
  }

  const sections = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
});
