// assets/related.js

// 1) Samme billed–mapping som på opskrifter.html
const IMAGE_MAP = {
  "pommes-frites": "pommes-frites-768x768.jpg",
  "kartoffelbaade-i-airfryer": "kartoffelbaade-i-airfryer-768x768.jpg",
  "broccoli-i-airfryer": "broccoli-i-airfryer-768x768.jpg",
  "grillede-groentsager-airfryer": "grillede-groentsager-airfryer-768x768.jpg",
  "toast-i-airfryer": "toast-i-airfryer-768x768.jpg",
  "bagte-kartofler-i-airfryer": "bagte-kartofler-i-airfryer-768x768.jpg",

  "kyllinge-laar-airfryer": "kyllinge-laar-airfryer-768x768.jpg",
  "kyllingebryst-i-airfryer": "kyllingebryst-airfryer-768x768.jpg",
  "kyllingevinger-i-airfryer": "kyllingevinger-i-airfryer-768x768.jpg",

  "chicken-nuggets-airfryer": "chicken-nuggets-airfryer-768x768.jpg",
  "fiskefilet": "fiskefilet-768x768.jpg",
  "laks-i-airfryer": "laks-i-airfryer-768x768.jpg",

  "frikadeller-juleudgave": "frikadeller-768x768.jpg",
  "flaeskesteg-i-airfryer": "flaeskesteg-i-airfryer-768x768.jpg",
  "flaeskestegssandwich": "flaeskestegssandwich-768x768.jpg",
  "hel-and-i-airfryer": "hel-and-i-airfryer-768x768.jpg",

  "bacon-i-airfryer": "bacon-airfryer-768x768.jpg",
  "hvidloegsbroed-airfryer": "hvidloegsbroed-airfryer-768x768.jpg",

  "brunede-kartofler-i-airfryer": "brunede-kartofler-i-airfryer-768x768.jpg",
  "roedkaal-i-airfryer": "roedkaal-airfryer-768x768.jpg",

  "vegetar-tarteletter": "vegetar-tarteletter-768x768.jpg",

  // nye grøntsager osv.
   "grillede-blomkaal-i-airfryer": "grillede-blomkaal-airfryer-768x768.jpg",
  "gulerods-chunks-i-airfryer": "gulerods-chunks-i-airfryer-768x768.jpg",
  "soltorrede-tomater-i-airfryer": "soltorrede-tomater-airfryer-768x768.jpg"
};

// Henter korrekt billedsti til en opskrift
function getRecipeImage(recipe) {
  // hvis du senere tilføjer "image" direkte i recipes.json,
  // bruger vi det først:
  if (recipe.image) {
    return "../assets/images/recipes/" + recipe.image;
  }

  const file = IMAGE_MAP[recipe.slug];
  return file
    ? "../assets/images/recipes/" + file
    : "../assets/images/recipes/placeholder.jpg";
}

(async function () {
  const container = document.getElementById("related-container");
  if (!container) return;

  // Lav wrapper til slider
  container.outerHTML = `
    <div class="slider-wrapper related-slider-wrapper">
      <button class="slider-btn related-prev">‹</button>
      <div class="recipe-slider" id="related-slider"></div>
      <button class="slider-btn related-next">›</button>
    </div>
  `;

  const slider = document.getElementById("related-slider");

  // Hent alle opskrifter
  let recipes = [];
  try {
    const res = await fetch("../assets/recipes.json");
    const data = await res.json();
    recipes = data.recipes || [];
  } catch (e) {
    console.error("Kunne ikke hente recipes.json til relaterede opskrifter", e);
    return;
  }

  const currentSlug = window.recipeSlug || "";
  const currentTags = window.recipeTags || [];

  // 🔎 1) Prøv først at matche på tags
  let related = recipes
    .filter(r => r.slug !== currentSlug)
    .filter(r => (r.tags || []).some(tag => currentTags.includes(tag)));

  // 2) Hvis der er for få, brug kategori fallback
  if (related.length < 4) {
    const current = recipes.find(r => r.slug === currentSlug);
    const cats = current && current.categories ? current.categories : [];

    related = recipes.filter(r =>
      r.slug !== currentSlug &&
      r.categories &&
      r.categories.some(cat => cats.includes(cat))
    );
  }

  // 3) Stadig for få → brug bare de nyeste
  if (related.length < 4) {
    related = recipes
      .filter(r => r.slug !== currentSlug)
      .slice()
      .reverse()
      .slice(0, 6);
  }

  // Begræns antal
  related = related.slice(0, 6);

  // Render cards i slider
  related.forEach(r => {
    const card = document.createElement("a");
    card.className = "recipe-slide-card";
    card.href = `./${r.slug}.html`;

    const imgSrc = getRecipeImage(r);

    card.innerHTML = `
      <img src="${imgSrc}" alt="${r.title}">
      <h3>${r.title}</h3>
    `;

    slider.appendChild(card);
  });

  // Slider funktionalitet
  const prev = document.querySelector(".related-prev");
  const next = document.querySelector(".related-next");

  if (prev && next) {
    prev.addEventListener("click", () => {
      slider.scrollBy({ left: -320, behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      slider.scrollBy({ left: 320, behavior: "smooth" });
    });
  }
})();
