// ===== Year =====
document.getElementById("year").textContent = String(new Date().getFullYear());

// ===== Catalog =====
const grid = document.getElementById("catalogGrid");
const detail = document.getElementById("catalogDetail");
const gridSection = grid?.closest(".section");
const heroSection = document.querySelector(".catalog-hero");
const backBtn = document.getElementById("catalogBack");
const categoryTitle = document.getElementById("categoryTitle");
const categoryItems = document.getElementById("categoryItems");
const categoryEmpty = document.getElementById("categoryEmpty");

let catalogData = null;

fetch("./catalog.json")
  .then((res) => res.json())
  .then((data) => {
    catalogData = data;
    renderCategories(data.categories);
  });

// ===== Render category cards =====
function renderCategories(categories) {
  grid.innerHTML = categories
    .map(
      (cat) => `
      <a class="catalog-card" href="#" data-id="${cat.id}">
        <span class="catalog-card__icon">${cat.icon}</span>
        <span class="catalog-card__title">${cat.title}</span>
        <span class="catalog-card__count">${cat.items.length} ${pluralize(cat.items.length)}</span>
        <span class="catalog-card__arrow">&rarr;</span>
      </a>
    `
    )
    .join("");

  grid.querySelectorAll(".catalog-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const catId = card.dataset.id;
      const category = catalogData.categories.find((c) => c.id === catId);
      if (category) openCategory(category);
    });
  });
}

// ===== Open category detail =====
function openCategory(category) {
  gridSection.style.display = "none";
  heroSection.style.display = "none";
  detail.style.display = "block";

  categoryTitle.textContent = category.title;

  if (category.items.length === 0) {
    categoryItems.style.display = "none";
    categoryEmpty.style.display = "flex";
  } else {
    categoryEmpty.style.display = "none";
    categoryItems.style.display = "grid";

    categoryItems.innerHTML = category.items
      .map((item) => {
        const imgSrc = category.imagesPath + item.image;
        const waText = encodeURIComponent("Здравствуйте! Интересует: " + item.name);

        return `
          <div class="catalog-item">
            <div class="catalog-item__img">
              <img src="${imgSrc}" alt="${item.name}" loading="lazy"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
              <div class="catalog-item__placeholder" style="display:none;">Фото</div>
            </div>
            <div class="catalog-item__info">
              <h3 class="catalog-item__name">${item.name}</h3>
              <a class="btn btn--primary btn--sm"
                 href="https://wa.me/77779206964?text=${waText}"
                 target="_blank" rel="noopener">
                Запросить цену
              </a>
            </div>
          </div>
        `;
      })
      .join("");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ===== Close category =====
function closeCategory() {
  detail.style.display = "none";
  gridSection.style.display = "block";
  heroSection.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (backBtn) {
  backBtn.addEventListener("click", closeCategory);
}

// ===== Pluralize "товар" =====
function pluralize(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return "товаров";
  if (mod10 === 1) return "товар";
  if (mod10 >= 2 && mod10 <= 4) return "товара";
  return "товаров";
}

// ===== Burger menu (mobile) =====
const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    if (isOpen) {
      nav.style.display = "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "100%";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.background = "#fff";
      nav.style.padding = "16px 20px";
      nav.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
      nav.style.borderRadius = "0 0 12px 12px";
      nav.style.gap = "12px";
      nav.style.zIndex = "99";
    } else {
      nav.style.display = "none";
    }
  });
}
