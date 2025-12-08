document.addEventListener("DOMContentLoaded", () => {

  // Vent til include.js har indlæst header
  setTimeout(() => {

    const drawer = document.querySelector(".saved-drawer");
    const openBtn = document.getElementById("openSaved");
    const closeBtn = document.getElementById("closeSaved");

    if (!drawer || !openBtn) {
      console.warn("Saved drawer eller openSaved blev ikke fundet.");
      return;
    }

    // Helpers
    function getSaved() {
      return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    }
    function saveList(arr) {
      localStorage.setItem("savedRecipes", JSON.stringify(arr));
    }

    function renderSavedList() {
      const container = document.getElementById("savedList");
      const saved = getSaved();

      container.innerHTML = saved.length === 0
        ? `<p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>`
        : saved.map(item => `
          <div class="saved-item">
            <a href="${item.url}">
              <img src="${item.image}" alt="${item.title}">
            </a>
            <a class="saved-item-title" href="${item.url}">${item.title}</a>
          </div>
        `).join("");
    }

    // Åbn/Luk panel
    openBtn.addEventListener("click", () => {
      drawer.classList.add("open");
      renderSavedList();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // Knapper på opskriftssider
    document.querySelectorAll(".save-recipe-btn").forEach(btn => {
      const title = btn.dataset.recipe;
      const url = btn.dataset.url;
      const image = btn.dataset.image;

      btn.addEventListener("click", () => {
        let saved = getSaved();
        const index = saved.findIndex(r => r.title === title);

        if (index !== -1) {
          saved.splice(index, 1);
        } else {
          saved.push({ title, url, image });
        }

        saveList(saved);
      });
    });

  }, 200); // vigtigt – vent på include.js

});
