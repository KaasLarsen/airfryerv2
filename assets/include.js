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

    const path = `/partials/${file}.html`;

    fetch(path)
      .then((response) => {
        if (!response.ok) throw new Error(`Partial ikke fundet: ${path}`);
        return response.text();
      })
      .then((html) => {
        el.innerHTML = html;
        runInlineScripts(el);

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

    for (const attr of oldScript.attributes) {
      newScript.setAttribute(attr.name, attr.value);
    }

    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }

    document.body.appendChild(newScript);
    oldScript.remove();
  });
}

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

  if (!path.includes("/opskrifter/") || !path.endsWith(".html")) return;

  const slug = path.split("/").pop().replace(".html", "");

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
            ? `<a class="recipe-nav-item recipe-nav-prev" href="${escapeAttr(prev.slug)}.html">
                 <span class="recipe-nav-label">← forrige opskrift</span>
                 <span class="recipe-nav-title">${escapeHtml(prev.title || "")}</span>
               </a>`
            : ""
        }
        ${
          next
            ? `<a class="recipe-nav-item recipe-nav-next" href="${escapeAttr(next.slug)}.html">
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
  return String(str).replaceAll('"', "").replaceAll("'", "");
}

// -------------------------------------------------------
// GOOGLE ADSENSE – global (kun 1 gang)
// -------------------------------------------------------
function injectAdSense() {
  const CLIENT = "ca-pub-7373148222153531";
  const SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
  loadScriptOnce(SRC, { async: true, crossOrigin: "anonymous", appendTo: "head" });
}

// -------------------------------------------------------
// REVIEW SCHEMA PATCH – kun på /anmeldelser/
// -------------------------------------------------------
function injectReviewSchemaPatch() {
  if (!location.pathname.includes("/anmeldelser/")) return;
  loadScriptOnce("/assets/review-schema-patch.js", { defer: true, appendTo: "head" });
}

// -------------------------------------------------------
// ANMELDELSER: køb-boks – auto-inject (KUN ÉN GANG)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const isReview =
    !window.recipeSlug &&
    (location.pathname.includes("/anmeldelser/") || /anmeldelse/i.test(document.title));

  if (!isReview) return;

  if (window.__reviewBuyboxInjected) return;
  window.__reviewBuyboxInjected = true;

  const wrap = document.querySelector(".review-wrap");
  if (!wrap) return;

  try {
    const res = await fetch("/partials/review-buybox.html", { cache: "no-store" });
    if (!res.ok) return;

    const html = await res.text();

    if (document.querySelector(".affiliate-box")) return;

    wrap.insertAdjacentHTML("afterbegin", html);
  } catch (e) {}
});

// -------------------------------------------------------
// GUIDES: vælg overskrift/tekst automatisk ud fra URL
// -------------------------------------------------------
function getGuideBuyboxCopy() {
  const path = location.pathname.toLowerCase();

  const rules = [
    {
      match: ["bedste", "køb", "vaelg", "vælg", "valg", "anbefal"],
      title: "Overvejer du en ny airfryer?",
      text: "Her er populære airfryers, som passer godt til det, guiden handler om."
    },
    {
      match: ["sund", "vægttab", "vaegttab", "kalorie", "protein"],
      title: "Airfryers til sund mad",
      text: "Disse modeller er oplagte, hvis du vil lave fedtfattig og nem hverdagsmad."
    },
    {
      match: ["tapas", "jul", "jule", "snacks", "gæster", "gaester", "fest"],
      title: "Airfryers der er gode til inspiration og gæstemad",
      text: "Hvis du ofte laver småretter eller mange portioner, kan en rummelig airfryer gøre livet lettere."
    },
    {
      match: ["tips", "sprød", "sproed", "fejl", "temperatur", "guide-til"],
      title: "Vil du have bedre resultater i airfryer?",
      text: "En mere kraftig eller rummelig airfryer kan give mere jævn sprødhed og færre batches."
    }
  ];

  for (const rule of rules) {
    if (rule.match.some((word) => path.includes(word))) {
      return rule;
    }
  }

  return {
    title: "Find den rette airfryer",
    text: "Se populære modeller og sammenlign priser, før du beslutter dig."
  };
}

// -------------------------------------------------------
// GUIDES: køb-boks – auto-inject på alle guides
// (uden at du skal redigere fremtidige guides)
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const isGuide = location.pathname.includes("/sider/guides/");
  if (!isGuide) return;

  // Undgå dublet
  if (window.__guideBuyboxInjected) return;
  window.__guideBuyboxInjected = true;

  // Hvis der allerede ligger en guide-buybox i HTML (manuelt), så gør intet
  if (document.querySelector(".guide-buybox")) return;

  // Placering: øverst i main, men efter hero hvis den findes
  const main = document.querySelector("main");
  if (!main) return;

  try {
    const res = await fetch("/partials/guide-buybox-airfryer.html", { cache: "no-store" });
    if (!res.ok) return;

    const html = await res.text();

    main.insertAdjacentHTML("afterbegin", html);

    // Udfyld tekst dynamisk
    const copy = getGuideBuyboxCopy();
    const titleEl = document.querySelector(".guide-buybox [data-guide-title]");
    const textEl = document.querySelector(".guide-buybox [data-guide-text]");

    if (titleEl) titleEl.textContent = copy.title;
    if (textEl) textEl.textContent = copy.text;
  } catch (e) {}
});
