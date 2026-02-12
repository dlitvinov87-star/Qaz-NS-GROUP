// ===== Year =====
document.getElementById("year").textContent = String(new Date().getFullYear());

// ===== Lead form =====
const form = document.getElementById("leadForm");
const hint = document.getElementById("formHint");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  hint.textContent = "Спасибо! Заявка отправлена (пока это демо).";
  hint.style.color = "#4ade80";
  form.reset();

  setTimeout(() => {
    hint.textContent = "";
  }, 5000);
});

// ===== Animated counters =====
function animateCounters() {
  const counters = document.querySelectorAll(".stat__num[data-target]");
  counters.forEach((el) => {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
        if (target >= 1000) {
          el.textContent = target.toLocaleString("ru-RU");
        }
      }
    }
    requestAnimationFrame(tick);
  });
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(
  ".card, .adv, .about__item, .stat, .contact__group"
);
revealEls.forEach((el) => el.classList.add("reveal"));

let countersAnimated = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // trigger counter animation once stats are visible
        if (entry.target.classList.contains("stat") && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => observer.observe(el));

// ===== Burger menu toggle (mobile) =====
const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");

if (burger && nav) {
  const header = document.querySelector(".header");
  burger.addEventListener("click", () => {
    const isOpen = nav.style.display === "flex";
    nav.style.display = isOpen ? "none" : "flex";
    nav.style.flexDirection = "column";
    nav.style.position = "absolute";
    nav.style.top = "100%";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.background = "#fff";
    nav.style.padding = "16px 20px";
    nav.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
    nav.style.borderRadius = "0 0 12px 12px";
    nav.style.gap = "4px";
    header.classList.toggle("nav-open", !isOpen);
  });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });

      // close mobile nav if open
      if (nav && window.innerWidth <= 960) {
        nav.style.display = "none";
      }
    }
  });
});
