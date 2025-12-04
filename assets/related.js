(async function () {
  const container = document.getElementById("related-container");
  if (!container) return;

  // Load recipes.json
  const response = await fetch("../assets/recipes.json");
  const allRecipes = await response.json();

  const currentTags = window.recipeTags || [];
  const currentSlug = window.recipeSlug;

  // Find opskrifter der deler tags
  const related = allRecipes
    .filter(r => r.slug !== currentSlug)
    .filter(r => r.tags.some(tag => currentTags.includes(tag)))
    .slice(0, 3);

  related.forEach(r => {
    const imgPath = `../assets/images/recipes/${r.image}`;
    const card = document.createElement("a");
    card.href = `${r.slug}.html`;
    card.className = "recipe-card";

    card.innerHTML = `
      <div class="recipe-img ph" data-img="${imgPath}"></div>
      <h3 class="recipe-title">${r.title}</h3>
      <p class="recipe-meta">${r.time}</p>
    `;

    container.appendChild(card);
  });

  // Load billeder
  document.querySelectorAll("[data-img]").forEach(div => {
    const img = div.getAttribute("data-img");

    fetch(img, { method: "HEAD" })
      .then(res => {
        if (res.ok) {
          div.style.backgroundImage = `url('${img}')`;
          div.style.backgroundSize = "cover";
          div.style.backgroundPosition = "center";
          div.classList.remove("ph");
        }
      });
  });
})();
