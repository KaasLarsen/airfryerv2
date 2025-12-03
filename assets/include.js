/**
 * include.js
 * Loader partials dynamically into any element with [data-include="filename"]
 * Example: <div data-include="header"></div>
 */

document.addEventListener("DOMContentLoaded", () => {
  loadPartials();
});

/* Load all partials on the page */
function loadPartials() {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach((el) => {
    const file = el.getAttribute("data-include");

    fetch(`partials/${file}.html`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Partial ikke fundet: ${file}`);
        }
        return response.text();
      })
      .then((data) => {
        el.innerHTML = data;
        // After include: re-run scripts inside included HTML
        runInlineScripts(el);
      })
      .catch((error) => {
        el.innerHTML = `<!-- FEJL: ${file} kunne ikke indlæses -->`;
        console.error(error);
      });
  });
}

/* Re-run <script> tags placed inside partials */
function runInlineScripts(el) {
  const scripts = el.querySelectorAll("script");

  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    document.body.appendChild(newScript);
    oldScript.remove();
  });
}
