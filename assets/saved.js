// saved.js – ENESTE FIL DER STYRER AL GEM-FUNKTION
document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {

    const drawer = document.querySelector(".saved-drawer");
    const openBtn = document.getElementById("openSaved");
    const closeBtn = document.getElementById("closeSaved");

    console.log("saved.js klar");

    if (!drawer || !openBtn) {
      console.warn("⚠️ Header ikke klar – saved drawer findes ikke endnu.");
      return;
    }

    // ---- STORAGE HELPERS ----
    function getSaved() {
      return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    }

    function saveList(arr) {
      localStorage.setItem("savedRecipes", JSON.stringify(arr));
    }

    // ---- RENDER PANEL ----
    function renderSavedList() {
      const container = document.getElementById("savedList");
      const saved = getSaved();

      if (!container) return;

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

    // ---- ÅBN PANEL ----
    openBtn.addEventListener("click", () => {
      drawer.classList.add("open");
      renderSavedList();
    });

    // ---- LUK PANEL ----
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // ---- GEM-KNAPPER PÅ OPSKRIFTSIDER ----
    document.querySelectorAll(".save-recipe-btn").forEach(btn => {

      const title = btn.dataset.recipe;
      const url = btn.dataset.url;
      const image = btn.dataset.image;

      // initial state
      updateButton(btn);

      btn.addEventListener("click", () => {
        let saved = getSaved();
        const index = saved.findIndex(r => r.title === title);

        if (index !== -1) {
          saved.splice(index, 1);   // fjern
        } else {
          saved.push({ title, url, image }); // tilføj
        }

        saveList(saved);
        updateButton(btn);
        renderSavedList();
      });
    });

    // ---- GRØN KNAP / RØD KNAP ----
    function updateButton(btn) {
      const title = btn.dataset.recipe;
      const saved = getSaved();
      const isSaved = saved.some(r => r.title === title);

      if (isSaved) {
        btn.textContent = "💚 Opskrift gemt (klik for at fjerne)";
        btn.classList.add("saved");
      } else {
        btn.textContent = "❤️ Gem opskrift";
        btn.classList.remove("saved");
      }
    }

  }, 300); // vent på include.js
});
