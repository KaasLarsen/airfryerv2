document.addEventListener("DOMContentLoaded", () => {

  // 🧹 Auto-clean: fjerner gamle string-baserede entries
  function cleanOldSavedData() {
    let saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    saved = saved.filter(item => typeof item === "object" && item.title);
    localStorage.setItem("savedRecipes", JSON.stringify(saved));
  }
  cleanOldSavedData();

  // Hent ALLE knapper på siden
  const btn = document.querySelector(".save-recipe-btn");
  if (!btn) return;

  // Automatiske data
  const title = btn.dataset.recipe;
  const image = document.querySelector(".recipe-main-img")?.src || "";
  const url = window.location.pathname;

  // Hjælper
  function getSaved() {
    return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
  }

  function saveList(list) {
    localStorage.setItem("savedRecipes", JSON.stringify(list));
  }

  function updateButton() {
    const saved = getSaved();
    const isSaved = saved.some(r => r.title === title);
    btn.textContent = isSaved ? "💚 Opskrift gemt (klik for at fjerne)" : "❤️ Gem opskrift";
  }

  function animateHeart() {
    const heart = document.createElement("div");
    heart.className = "flying-heart";
    heart.innerHTML = "❤️";
    document.body.appendChild(heart);

    const rect = btn.getBoundingClientRect();
    heart.style.left = rect.left + "px";
    heart.style.top = rect.top + "px";

    setTimeout(() => heart.remove(), 900);
  }

  updateButton();

  // Klik – gem / fjern
  btn.addEventListener("click", () => {
    let saved = getSaved();
    const exists = saved.some(r => r.title === title);

    if (exists) {
      saved = saved.filter(r => r.title !== title);
    } else {
      saved.push({ title, image, url });
      animateHeart();
    }

    saveList(saved);
    updateButton();
  });

});
