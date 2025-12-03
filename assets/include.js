// assets/include.js

async function loadPartials() {
  const elements = document.querySelectorAll("[data-include]");
  const promises = [];

  elements.forEach((el) => {
    const name = el.getAttribute("data-include");
    if (!name) return;

    const path = `partials/${name}.html`;

    const p = fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`kunne ikke loade ${path}`);
        return res.text();
      })
      .then((html) => {
        el.outerHTML = html;
      })
      .catch((err) => {
        console.error(err);
      });

    promises.push(p);
  });

  await Promise.all(promises);
}

function initNavigation() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();

  // partials er nu indsat i DOM'en
  initNavigation();
});
