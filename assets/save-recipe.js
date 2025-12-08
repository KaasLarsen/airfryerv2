document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".save-recipe-btn");
  if (!btn) return;

  const title = btn.dataset.recipe;
  const image = document.querySelector(".recipe-main-img")?.src || "";
  const url   = window.location.pathname;

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

  function update() {
    const saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    const isSaved = saved.some(r => r.title === title);

    btn.textContent =
      isSaved ? "💚 Opskrift gemt (klik for at fjerne)" : "❤️ Gem opskrift";
  }

  update();

  btn.addEventListener("click", () => {
    let saved = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    const exists = saved.some(r => r.title === title);

    if (exists) {
      saved = saved.filter(r => r.title !== title);
    } else {
      saved.push({ title, image, url });
      animateHeart();
    }

    localStorage.setItem("savedRecipes", JSON.stringify(saved));
    update();
  });
});
