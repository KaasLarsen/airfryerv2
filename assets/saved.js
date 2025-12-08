// Wait until header is inserted by include.js
document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {

    console.log("saved.js loaded ✔️");

    const drawer = document.querySelector(".saved-drawer");
    const openBtn = document.getElementById("openSaved");
    const closeBtn = document.getElementById("closeSaved");

    if (!drawer || !openBtn) {
      console.warn("❌ Header ikke klar endnu – saved drawer blev ikke fundet.");
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

      if (!container) return;

      container.innerHTML =
        saved.length === 0
          ? `<p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>`
          : saved
              .map(
                (item) => `
          <div class="saved-item">
            <a href="${item.url}">
              <img src="${item.image}" alt="${item.title}">
            </a>
            <a class="saved-item-title" href="${item.url}">
              ${item.title}
            </a>
          </div>`
              )
              .join("");
    }

    // Open drawer
    openBtn.addEventListener("click", () => {
      drawer.classList.add("open");
      renderSavedList();
    });

    // Close drawer
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // Save buttons on recipe pages
    document.querySelectorAll(".save-recipe-btn").forEach((btn) => {
      const title = btn.dataset.recipe;
      const url = btn.dataset.url;
      const image = btn.dataset.image;

      btn.addEventListener("click", () => {
        let saved = getSaved();
        const index = saved.findIndex((r) => r.title === title);

        if (index !== -1) {
          saved.splice(index, 1); // remove
        } else {
          saved.push({ title, url, image }); // add
        }

        saveList(saved);
        renderSavedList();
      });
    });

  }, 200); // wait for include.js

});
