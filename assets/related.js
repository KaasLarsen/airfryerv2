(async function () {
  const container = document.getElementById("related-container");
  if (!container) return;

  // Load recipes.json
  const response = await fetch("../assets/recipes.json");
  const data = await response.json();
  const allRecipes = data.recipes || [];

  const currentCategories = window.recipeTags || []; 
  const currentSlug = window.recipeSlug;

  // Auto image finder (samme som dit grid-system)
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/æ/g, "ae")
      .replace(/ø/g, "oe")
      .replace(/å/g, "aa")
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
    const slugWords = normSlug.split(" ").filter(Boolean);

    let bestScore = -1;
    let bestMatch = null;

    IMAGE_FILES.forEach(file => {
      const normFile = normalize(file);
      let score = 0;

      slugWords.forEach(word => {
        if (normFile.includes(word)) score++;
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = file;
      }
    });

    return bestMatch
      ? `../assets/images/recipes/${bestMatch}`
      : "../assets/images/recipes/placeholder.jpg";
  }

  // Find relaterede via categories
  const related = allRecipes
    .filter(r => r.slug !== currentSlug)
    .filter(r => r.categories.some(cat => currentCategories.includes(cat)))
    .slice(0, 3);

  // Fall-back: hvis der er 0 matches → tag 3 tilfældige
  const finalRecipes = related.length ? related : allRecipes.filter(r => r.slug !== currentSlug).slice(0, 3);

  finalRecipes.forEach(r => {
    const imgPath = findBestImage(r.slug);

    const card = document.createElement("a");
    card.href = `../opskrifter/${r.slug}.html`;
    card.className = "recipe-card";

    card.innerHTML = `
      <div class="recipe-img" style="
        background-image: url('${imgPath}');
        background-size: cover;
        background-position: center;
        border-radius: 12px;
        width: 100%;
        aspect-ratio: 1/1;
      "></div>

      <h3 class="recipe-title">${r.title}</h3>
    `;

    container.appendChild(card);
  });
})();
