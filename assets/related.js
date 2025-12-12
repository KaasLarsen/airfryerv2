// assets/related.js

(async function () {
  const container = document.getElementById("related-container");
  if (!container) return;

  container.outerHTML = `
    <div class="slider-wrapper related-slider-wrapper">
      <button class="slider-btn related-prev">‹</button>
      <div class="recipe-slider" id="related-slider"></div>
      <button class="slider-btn related-next">›</button>
    </div>
  `;

  const slider = document.getElementById("related-slider");

  let recipes = [];
  try {
    const res = await fetch("../assets/recipes.json");
    const data = await res.json();
    recipes = data.recipes || [];
  } catch (e) {
    console.error("Kunne ikke hente recipes.json", e);
    return;
  }

  const currentSlug = window.recipeSlug || "";
  const current = recipes.find(r => r.slug === currentSlug);
  if (!current) return;

  let related = recipes.filter(r =>
    r.slug !== currentSlug &&
    r.categories &&
    current.categories.some(cat => r.categories.includes(cat))
  );

  if (related.length < 4) {
    related = recipes
      .filter(r => r.slug !== currentSlug)
      .slice()
      .reverse()
      .slice(0, 6);
  }

  related.slice(0, 6).forEach(r => {
    const card = document.createElement("a");
    card.className = "recipe-slide-card";
    card.href = `./${r.slug}.html`;

    const imgSrc = r.image
      ? "../assets/images/recipes/" + r.image
      : "../assets/images/recipes/placeholder.jpg";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${r.title}">
      <h3>${r.title}</h3>
    `;

    slider.appendChild(card);
  });

  const prev = document.querySelector(".related-prev");
  const next = document.querySelector(".related-next");

  prev?.addEventListener("click", () =>
    slider.scrollBy({ left: -320, behavior: "smooth" })
  );

  next?.addEventListener("click", () =>
    slider.scrollBy({ left: 320, behavior: "smooth" })
  );
})();
