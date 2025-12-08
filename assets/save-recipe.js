document.addEventListener("DOMContentLoaded", () => {
  // Find opskrifts-intro og evt. eksisterende knap
  const intro    = document.querySelector(".recipe-page-intro");
  const titleEl  = document.querySelector(".recipe-page-title");
  const imgEl    = document.querySelector(".recipe-main-img");

  if (!intro || !titleEl) return; // ikke en opskriftsside

  let btn = document.querySelector(".save-recipe-btn");

  // Hvis der IKKE er en knap, laver vi en automatisk
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "save-recipe-btn";
    btn.dataset.recipe = titleEl.textContent.trim();
    btn.textContent = "❤️ Gem opskrift";

    const meta = intro.querySelector(".recipe-page-meta");
    if (meta && meta.parentNode) {
      meta.parentNode.insertBefore(btn, meta.nextSibling);
    } else {
      intro.appendChild(btn);
    }
  }

  const title = btn.dataset.recipe || titleEl.textContent.trim();
  const image = imgEl ? imgEl.src : "";
  const url   = window.location.pathname;

  // helpers til localStorage
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

  function animateHeart() {
    const heart = document.createElement("div");
    heart.className = "flying-heart";
    heart.innerHTML = "❤️";
    document.body.appendChild(heart);

    const rect = btn.getBoundingClientRect();
    heart.style.left = rect.left + "px";
    heart.style.top  = rect.top + "px";

    setTimeout(() => heart.remove(), 900);
  }

  function updateButton() {
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

  // initial state
  updateButton();

  // klik på knappen
  btn.addEventListener("click", () => {
    let saved = getSaved();
    const index = saved.findIndex(r => r.title === title);

    if (index !== -1) {
      // fjern opskrift
      saved.splice(index, 1);
    } else {
      // tilføj opskrift
      saved.push({ title, image, url });
      animateHeart();
    }

    saveList(saved);
    updateButton();
  });
});
