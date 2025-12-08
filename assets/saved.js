// Helpers
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
  container.innerHTML = "";

  if (saved.length === 0) {
    container.innerHTML = `<p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>`;
    return;
  }

  saved.forEach(item => {
    container.innerHTML += `
      <div class="saved-item">
        <a href="${item.url}">
          <img src="${item.image}" alt="${item.title}">
        </a>
        <a class="saved-item-title" href="${item.url}">${item.title}</a>
      </div>
    `;
  });
}

// Køres når scriptet loades (efter include.js har hentet headeren)
(function initSavedDrawer(){

  const drawer = document.querySelector(".saved-drawer");
  const openBtn = document.getElementById("openSaved");
  const closeBtn = document.getElementById("closeSaved");

  if (!drawer || !openBtn) {
    console.warn("Saved drawer elementer mangler.");
    return;
  }

  // Åbn panel
  openBtn.addEventListener("click", () => {
    drawer.classList.add("open");
    renderSavedList();
  });

  // Luk panel
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      drawer.classList.remove("open");
    });
  }

  // Opskriftssider – gem / fjern
  document.querySelectorAll(".save-recipe-btn").forEach(btn => {
    const title = btn.dataset.recipe;
    const url   = btn.dataset.url;
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
      renderSavedList();
    });
  });

})();
