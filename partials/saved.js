document.addEventListener("DOMContentLoaded", () => {

  // Vent til headeren er loaded af include.js
  setTimeout(() => {
    const drawer = document.querySelector(".saved-drawer");
    const openBtn = document.getElementById("openSaved");
    const closeBtn = document.getElementById("closeSaved");
    const searchBtn = document.getElementById("openSearch");
    const searchBar = document.getElementById("searchBar");
    const listEl = document.getElementById("savedList");

    if (!drawer || !openBtn) {
      console.warn("Header ikke klar endnu.");
      return;
    }

    /* ---------- SEARCH BAR ---------- */
    if (searchBtn && searchBar) {
      searchBtn.addEventListener("click", () => {
        const isVisible = searchBar.style.display === "block";
        searchBar.style.display = isVisible ? "none" : "block";
      });
    }

    /* ---------- HENT GEMTE OPSKRIFTER ---------- */
    function getSaved() {
      try {
        return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
      } catch (e) {
        return [];
      }
    }

    function saveList(arr) {
      localStorage.setItem("savedRecipes", JSON.stringify(arr));
    }

    /* ---------- RENDER PANEL ---------- */
    function renderSavedList() {
      const saved = getSaved();

      if (!listEl) return;

      if (saved.length === 0) {
        listEl.innerHTML = `<p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>`;
        return;
      }

      listEl.innerHTML = saved
        .map(item => `
          <div class="saved-item">
            <a href="${item.url}">
              <img src="${item.image}" alt="${item.title}">
            </a>
            <a class="saved-item-title" href="${item.url}">
              ${item.title}
            </a>
          </div>
        `)
        .join("");
    }

    /* ---------- ÅBN / LUK PANEL ---------- */
    openBtn.addEventListener("click", () => {
      drawer.classList.add("open");
      renderSavedList();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    // Luk ved klik udenfor
    document.addEventListener("click", (e) => {
      const clickInside = drawer.contains(e.target);
      const clickHeart = openBtn.contains(e.target);

      if (drawer.classList.contains("open") && !clickInside && !clickHeart) {
        drawer.classList.remove("open");
      }
    });

    /* ---------- GEM OPSKRIFT ---------- */
    document.querySelectorAll(".save-recipe-btn").forEach(btn => {
      const title = btn.dataset.recipe;
      const url = btn.dataset.url;
      const image = btn.dataset.image;

      btn.addEventListener("click", () => {
        let saved = getSaved();
        const exists = saved.find(r => r.title === title);

        if (exists) {
          saved = saved.filter(r => r.title !== title);
          btn.textContent = "❤️ Gem opskrift";
        } else {
          saved.push({ title, url, image });
          btn.textContent = "💚 Opskrift gemt (klik for at fjerne)";
        }

        saveList(saved);
        renderSavedList();
      });

      // initial state
      const saved = getSaved();
      if (saved.find(r => r.title === title)) {
        btn.textContent = "💚 Opskrift gemt (klik for at fjerne)";
      }
    });

  }, 200);
});
