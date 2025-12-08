// Vent til include.js har indlæst headeren
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {

    console.log("saved.js loaded ✔️");

    const drawer = document.querySelector(".saved-drawer");
    const openBtn = document.getElementById("openSaved");
    const closeBtn = document.getElementById("closeSaved");

    if (!drawer || !openBtn) {
      console.warn("⚠️ Saved drawer eller openSaved blev ikke fundet.");
      return;
    }

    /* -------------------------------------------------
       HELPERS
    ------------------------------------------------- */
    function getSaved() {
      return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    }

    function saveList(arr) {
      localStorage.setItem("savedRecipes", JSON.stringify(arr));
    }

    function renderSavedList() {
      const container = document.getElementById("savedList");
      if (!container) return;

      const saved = getSaved();

      if (saved.length === 0) {
        container.innerHTML = `<p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>`;
        return;
      }

      container.innerHTML = saved.map(item => `
        <div class="saved-item">
          <a href="${item.url}">
            <img src="${item.image}" alt="${item.title}">
          </a>
          <a class="saved-item-title" href="${item.url}">${item.title}</a>
        </div>
      `).join("");
    }

    function updateSaveButtons() {
      const saved = getSaved();

      document.querySelectorAll(".save-recipe-btn").forEach(btn => {
        const title = btn.dataset.recipe;
        const isSaved = saved.some(r => r.title === title);

        btn.textContent = isSaved
          ? "💚 Opskrift gemt (klik for at fjerne)"
          : "❤️ Gem opskrift";
      });
    }

    /* -------------------------------------------------
       AUTO-DETECT OPSKRIFTSDATA på opskriftssider
    ------------------------------------------------- */
    (function autoDetectRecipe() {
      const btn = document.querySelector(".save-recipe-btn");
      if (!btn) return; // Ikke en opskriftsside

      // Titel
      const titleEl = document.querySelector(".recipe-page-title");
      const title = titleEl ? titleEl.textContent.trim() : document.title.trim();

      // Billede
      const imgEl = document.querySelector(".recipe-main-img");
      const image = imgEl ? imgEl.src : "";

      // URL
      const url = window.location.pathname;

      // Gem i knappen
      btn.dataset.recipe = title;
      btn.dataset.image = image;
      btn.dataset.url = url;

      console.log("Auto-detected recipe:", { title, image, url });
    })();

    /* -------------------------------------------------
       ÅBN / LUK PANEL
    ------------------------------------------------- */
    openBtn.addEventListener("click", () => {
      drawer.classList.add("open");
      renderSavedList();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // Klik udenfor = luk
    document.addEventListener("click", (e) => {
      if (!drawer.classList.contains("open")) return;

      const insideDrawer = drawer.contains(e.target);
      const clickedHeart = openBtn.contains(e.target);

      if (!insideDrawer && !clickedHeart) {
        drawer.classList.remove("open");
      }
    });

    /* -------------------------------------------------
       GEM / FJERN OPSKRIFT
    ------------------------------------------------- */
    document.querySelectorAll(".save-recipe-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const title = btn.dataset.recipe;
        const url = btn.dataset.url;
        const image = btn.dataset.image;

        if (!title || !url) {
          console.error("❌ Ingen recipe-data fundet på knappen");
          return;
        }

        let saved = getSaved();
        const index = saved.findIndex(r => r.title === title);

        if (index !== -1) {
          saved.splice(index, 1);
        } else {
          saved.push({ title, url, image });
        }

        saveList(saved);
        updateSaveButtons();

        if (drawer.classList.contains("open")) {
          renderSavedList();
        }
      });
    });

    // Initial button states
    updateSaveButtons();

  }, 200); // vent på at include.js er færdig
});
