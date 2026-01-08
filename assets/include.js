/**
 * UNIVERSAL INCLUDE.JS – virker i alle mapper
 * Loader partials fra /partials/
 */

document.addEventListener("DOMContentLoaded", () => {
  loadPartials();
  injectAdSense();
  injectReviewSchemaPatch();
  initRecipePrevNextAndBreadcrumbs();
});

function loadPartials() {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach((el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;

    // Altid hent partials fra rodmappen
    const path = `/partials/${file}.html`;

    fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error(`Partial ikke fundet: ${path}`);
        return response.text();
      })
      .then((html) => {
        el.innerHTML = html;

        // Kør <script>-tags i partials (fx widgets)
        runInlineScripts(el);

        // Når headeren er indlæst, loader vi save-recipe.js globalt
        if (file === "header") {
          loadScriptOnce("/assets/save-recipe.js", { defer: true, appendTo: "body" });
        }
      })
      .catch((err) => {
        console.error(err);
        el.innerHTML = `<!-- FEJL: kunne ikke indlæse ${file}.html -->`;
      });
  });
}

function runInlineScripts(el) {
  const scripts = el.querySelectorAll("script");

  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");

    // Copy attributes
    for (const attr of oldScript.attributes) {
      newScript.setAttribute(attr.name, attr.value);
    }

    if (oldScript.src) {
      // external script
      newScript.src = oldScript.src;
    } else {
      // inline script
      newScript.textContent = oldScript.textContent;
    }

    // Append to body so it executes
    document.body.appendChild(newScript);

    // Remove old script so it doesn't stay in DOM
    oldScript.remove();
  });
}

/**
 * Helper: load a script only once
 */
function loadScriptOnce(src, opts = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const s = document.createElement("script");
  s.src = src;

  if (opts.async) s.async = true;
  if (opts.defer) s.defer = true;
  if (opts.crossOrigin) s.crossOrigin = opts.crossOrigin;

  const target = opts.appendTo === "head" ? document.head : document.body;
  target.appendChild(s);
}

// -------------------------------------------------------
// OPSKRIFTER: breadcrumbs + forrige/næste (kun på opskrifter)
// -------------------------------------------------------
async function initRecipePrevNextAndBreadcrumbs() {
  const path = window.location.pathname;

  // Kun på opskriftssider i /opskrifter/ og .html
  if (!path.includes("/opskrifter/") || !path.endsWith(".html")) return;

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

  const index = recipes.findIndex((r) => r.slug === slug);
  if (index === -1) return;

  const current = recipes[index];
  const prev = recipes[index - 1] || null;
  const next = recipes[index + 1] || null;

  // Hvor skal navigationen indsættes?
  const content = document.querySelector(".recipe-content") || document.body;

  const breadcrumbHTML = `
    <nav class="breadcrumbs">
      <a href="/">Forside</a> ›
      <a href="/sider/opskrifter.html">Opskrifter</a> ›
      <span>${escapeHtml(current.title || "")}</span>
    </nav>
  `;

  const navHTML = `
    <section class="recipe-nav">
      <div class="recipe-nav-grid">
        ${
          prev
            ? `
        <a class="recipe-nav-item recipe-nav-prev" href="${escapeAttr(prev.slug)}.html">
          <span class="recipe-nav-label">← forrige opskrift</span>
          <span class="recipe-nav-title">${escapeHtml(prev.title || "")}</span>
        </a>`
            : ""
        }

        ${
          next
            ? `
        <a class="recipe-nav-item recipe-nav-next" href="${escapeAttr(next.slug)}.html">
          <span class="recipe-nav-label">næste opskrift →</span>
          <span class="recipe-nav-title">${escapeHtml(next.title || "")}</span>
        </a>`
            : ""
        }
      </div>
    </section>
  `;

  content.insertAdjacentHTML("afterend", breadcrumbHTML + navHTML);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  // til href/attributes
  return String(str).replaceAll('"', "").replaceAll("'", "");
}

// -------------------------------------------------------
// GOOGLE ADSENSE – INDSÆT GLOBALT (kun 1 gang)
// -------------------------------------------------------
function injectAdSense() {
  const CLIENT = "ca-pub-7373148222153531";
  const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;

  loadScriptOnce(SRC, { async: true, crossOrigin: "anonymous", appendTo: "head" });
}

// -------------------------------------------------------
// REVIEW SCHEMA PATCH – kun på /anmeldelser/
// (løser Search Console-fejlen om offers/review/aggregateRating)
// -------------------------------------------------------
function injectReviewSchemaPatch() {
  if (!location.pathname.includes("/anmeldelser/")) return;
  loadScriptOnce("/assets/review-schema-patch.js", { defer: true, appendTo: "head" });
}
