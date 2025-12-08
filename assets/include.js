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
    const fileName = el.getAttribute("data-include"); // ← fix: fileName bruges nu
    const path = `/partials/${fileName}.html`;

    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Partial ikke fundet: ${path}`);
        }
        return response.text();
      })
      .then(html => {
        el.innerHTML = html;

        // ⭐ Load saved.js når headeren er indlæst
        if (fileName === "header") {
          const script = document.createElement("script");
          script.src = "/assets/saved.js";
          script.defer = true;
          document.body.appendChild(script);
        }

        runInlineScripts(el);
      })
      .catch(err => {
        console.error(err);
        el.innerHTML = `<!-- FEJL: kunne ikke indlæse ${fileName}.html -->`;
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
