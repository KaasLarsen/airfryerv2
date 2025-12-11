/**
 * UNIVERSAL INCLUDE.JS – virker i alle mapper
 * Loader partials fra /partials/
 */

document.addEventListener("DOMContentLoaded", () => {
  loadPartials();
});

function loadPartials() {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach((el) => {
    const file = el.getAttribute("data-include");

    // Altid hent partials fra rodmappen
    const path = `/partials/${file}.html`;

    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Partial ikke fundet: ${path}`);
        }
        return response.text();
      })
      .then(html => {
        el.innerHTML = html;

        // Kør <script>-tags i partials
        runInlineScripts(el);

        // ⭐ Når headeren er indlæst, loader vi OGSÅ save-recipe.js globalt
        if (file === "header") {
          const script = document.createElement("script");
          script.src = "/assets/save-recipe.js";
          script.defer = true;
          document.body.appendChild(script);
        }
      })
      .catch(err => {
        console.error(err);
        el.innerHTML = `<!-- FEJL: kunne ikke indlæse ${file}.html -->`;
      });
  });
}

function runInlineScripts(el) {
  const scripts = el.querySelectorAll("script");

  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");
    if (oldScript.src) newScript.src = oldScript.src;
    else newScript.textContent = oldScript.textContent;

    document.body.appendChild(newScript);
    oldScript.remove();
  });
}
document.addEventListener("DOMContentLoaded", async () => {
  // Find ud af om vi er på en opskriftsside
  const path = window.location.pathname;

  if (!path.includes("/opskrifter/") || !path.endsWith(".html")) {
    return; // ikke en opskriftsside
  }

  // Udtræk slug fra URL
  const slug = path.split("/").pop().replace(".html", "");

  // Hent opskrifter
  let recipes;
  try {
    const res = await fetch("/assets/recipes.json");
    const data = await res.json();
    recipes = data.recipes;
  } catch (e) {
    console.error("Kunne ikke hente recipes.json", e);
    return;
  }

  const index = recipes.findIndex(r => r.slug === slug);
  if (index === -1) return;

  const current = recipes[index];
  const prev = recipes[index - 1] || null;
  const next = recipes[index + 1] || null;

  // Hvor skal navigationen indsættes?
  const content = document.querySelector(".recipe-content") || document.body;

  // Breadcrumbs
  const breadcrumbHTML = `
    <nav class="breadcrumbs">
      <a href="/">Forside</a> ›
      <a href="/sider/opskrifter.html">Opskrifter</a> ›
      <span>${current.title}</span>
    </nav>
  `;

  // Navigation
  const navHTML = `
    <section class="recipe-nav">
      <div class="recipe-nav-grid">
        ${prev ? `
        <a class="recipe-nav-item recipe-nav-prev" href="${prev.slug}.html">
          <span class="recipe-nav-label">← forrige opskrift</span>
          <span class="recipe-nav-title">${prev.title}</span>
        </a>` : ""}

        ${next ? `
        <a class="recipe-nav-item recipe-nav-next" href="${next.slug}.html">
          <span class="recipe-nav-label">næste opskrift →</span>
          <span class="recipe-nav-title">${next.title}</span>
        </a>` : ""}
      </div>
    </section>
  `;

  // Indsæt i DOM
  content.insertAdjacentHTML("afterend", breadcrumbHTML + navHTML);
});
