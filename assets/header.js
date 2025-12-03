/* SEARCH BAR */
function toggleSearchBar() {
  const s = document.getElementById("headerSearchBar");
  s.style.display = s.style.display === "block" ? "none" : "block";
}

/* LOGIN */
function toggleLoginModal() {
  const m = document.getElementById("loginModal");
  m.style.display = (m.style.display === "flex") ? "none" : "flex";
}

function loginUser() {
  const name = document.getElementById("loginName").value.trim();
  if (!name) return;

  localStorage.setItem("user", name);
  toggleLoginModal();
  updateHeaderUserIcon();
}

function updateHeaderUserIcon() {
  const user = localStorage.getItem("user");
  const icons = document.querySelectorAll(".header-icon");
  if (user) {
    icons[1].querySelector("svg").style.stroke = "#2ba84a";
  }
}

/* SAVED RECIPES */
function toggleSavedRecipes() {
  const drawer = document.getElementById("savedDrawer");

  if (drawer.classList.contains("open")) {
    drawer.classList.remove("open");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("saved") || "[]");
  const list = document.getElementById("savedList");

  list.innerHTML = saved.length === 0
    ? "<p>Du har ingen gemte opskrifter endnu.</p>"
    : saved.map(r => `<p>${r}</p>`).join("");

  drawer.classList.add("open");
}

function saveRecipe(title) {
  const saved = JSON.parse(localStorage.getItem("saved") || "[]");
  if (!saved.includes(title)) {
    saved.push(title);
    localStorage.setItem("saved", JSON.stringify(saved));
  }
}
