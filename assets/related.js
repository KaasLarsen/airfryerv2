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
  const res = await fetch("../assets/recipes.json");
  const data = await res.json();
  const recipes = data.recipes || [];

  const currentSlug = window.recipeSlug || "";
  const currentTags = window.recipeTags || [];

  // Fallback baseret på kategori
  const fallbackCategories = {
    jul: ["jul", "nem-aftensmad"],
    kylling: ["kyllingefavoritter"],
    kartofler: ["sproede-kartofler"],
    morgenmad: ["morgenmad", "snacks-tilbehor"],
  };

  function findFallbackCategories(tags) {
    for (const key in fallbackCategories) {
      if (tags.includes(key)) return fallbackCategories[key];
    }
    return ["nem-aftensmad"]; // generisk fallback
  }

  // Find relaterede opskrifter
  let related = recipes
    .filter(r => r.slug !== currentSlug)
    .filter(r => (r.tags || []).some(tag => currentTags.includes(tag)));

  // Hvis for få → brug fallback kategori logik
  if (related.length < 4) {
    const fallbackCats = findFallbackCategories(currentTags);
    related = recipes.filter(r =>
      r.categories && r.categories.some(cat => fallbackCats.includes(cat))
    );
  }

  // Stadig for få → bare vis de nyeste
  if (related.length < 4) {
    related = recipes.slice().reverse().slice(0, 6);
  }

  // Begræns antal
  related = related.slice(0, 6);

  // Auto-match billeder
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "oe")
      .replace(/å/g, "aa")
      .replace(/-/g, " ")
      .replace(/[^\w\s]/g, "");
  }

  const IMAGE_FILES = [
    "bacon-airfryer-768x768.jpg",
    "chicken-nuggets-airfryer-768x768.jpg",
    "fiskefilet-768x768.jpg",
    "flaeskesteg-i-airfryer-768x768.jpg",
    "flaeskestegssandwich-768x768.jpg",
    "frikadeller-768x768.jpg",
    "grillede-groentsager-airfryer-768x768.jpg",
    "hvidloegsbroed-airfryer-768x768.jpg",
    "kyllinge-laar-airfryer-768x768.jpg",
    "kyllingebryst-airfryer-768x768.jpg",
    "kyllingevinger-i-airfryer-768x768.jpg",
    "laks-i-airfryer-768x768.jpg",
    "pommes-frites-768x768.jpg",
    "vegetar-tarteletter-768x768.jpg",
    "hel-and-i-airfryer-768x768.jpg"
  ];

  function findBestImage(slug) {
    const normSlug = normalize(slug);
    let best = IMAGE_FILES[0];
    let bestScore = -1;

    IMAGE_FILES.forEach(file => {
      const normFile = normalize(file);
      let score = 0;

      normSlug.split(" ").forEach(word => {
        if (normFile.includes(word)) score++;
      });

      if (score > bestScore) {
        bestScore = score;
        best = file;
      }
    });

    return `../assets/images/recipes/${best}`;
  }

  // Render cards i slider
  related.forEach(r => {
    const card = document.createElement("a");
    card.className = "recipe-slide-card";
    card.href = `./${r.slug}.html`;

    const img = findBestImage(r.slug);

    card.innerHTML = `
      <img src="${img}" alt="${r.title}">
      <h3>${r.title}</h3>
    `;

    slider.appendChild(card);
  });

  // Slider funktionalitet
  const prev = document.querySelector(".related-prev");
  const next = document.querySelector(".related-next");

  prev.addEventListener("click", () => {
    slider.scrollBy({ left: -320, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    slider.scrollBy({ left: 320, behavior: "smooth" });
  });
})();
