document.addEventListener("DOMContentLoaded", async () => {
  // Kun opskrifter: vi bruger window.recipeSlug som du allerede har på opskrifter
  if (!window.recipeSlug) return;

  // Find et sted at indsætte boksen (efter ingrediens-sektionen)
  const ingredients = document.querySelector(".recipe-page-ingredients");
  if (!ingredients) return;

  // Undgå dobbelt indsættelse
  if (document.querySelector(".affiliate-box")) return;

  try {
    // Hent partial HTML
    const res = await fetch("/assets/partials/recipe-affiliate-mealkits.html", { cache: "force-cache" });
    if (!res.ok) return;

    const html = await res.text();

    // Indsæt lige efter ingredienser
    ingredients.insertAdjacentHTML("afterend", html);
  } catch (e) {
    // fail silent
  }
});
