// assets/saved.js

// Helpers til localStorage
function getSaved() {
  return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
}

function saveList(arr) {
  localStorage.setItem("savedRecipes", JSON.stringify(arr));
}

// Render liste i panelet
function renderSavedList() {
  const container = document.getElementById("savedList");
  if (!container) return;

  const saved = getSaved();
  container.innerHTML = "";

  if (!saved.length) {
    container.innerHTML = `
      <p class="empty-text">Du har ingen gemte opskrifter endnu ❤️</p>
    `;
    return;
  }

  saved.forEach(item => {
    container.innerHTML += `
      <div class="saved-item">
        <a href="${item.url}">
          <img src="${item.image}" alt="${item.title}">
        </a>
        <div>
          <a class="saved-item-title" href="${item.url}">${item.title}</a>
        </div>
      </div>
    `;
  });
}

// Kør med det samme, når saved.js er indlæst
(function initSavedDrawer() {
  const drawer   = document.querySelector(".saved-drawer");
  const openBtn  = document.getElementById("openSaved");
  const closeBtn = document.getElementById("closeSaved");

  if (!drawer || !openBtn || !closeBtn) {
    console.warn("Saved drawer: elementer ikke fundet.");
    return;
  }

  openBtn.addEventListener("click", () => {
    drawer.classList.add("open");
    renderSavedList();
  });

  closeBtn.addEventListener("click", () => {
    drawer.classList.remove("open");
  });
})();
