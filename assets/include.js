// assets/include.js

const AUTH_KEY = "oa_auth_user";

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (_) {}
}

function clearUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (_) {}
}

async function loadPartials() {
  const elements = document.querySelectorAll("[data-include]");
  const jobs = [];

  elements.forEach((el) => {
    const name = el.getAttribute("data-include");
    if (!name) return;

    const path = `partials/${name}.html`;
    const p = fetch(path)
      .then((res) => res.text())
      .then((html) => {
        el.outerHTML = html;
      })
      .catch((err) => console.error("Fejl ved partial:", name, err));

    jobs.push(p);
  });

  await Promise.all(jobs);
}

function initNavToggle() {
  const navList = document.querySelector(".site-nav-list");
  const toggle = document.querySelector(".nav-toggle");
  if (!navList || !toggle) return;

  toggle.addEventListener("click", () => {
    navList.classList.toggle("is-open");
  });
}

/* ---- auth modal ---- */

function createAuthModal() {
  const existing = document.querySelector(".auth-backdrop");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "auth-backdrop";

  backdrop.innerHTML = `
    <div class="auth-modal">
      <div class="auth-modal-header">
        <h2 class="auth-modal-title">log ind</h2>
        <button type="button" class="auth-modal-close" aria-label="Luk">×</button>
      </div>
      <div class="auth-error js-auth-error" style="display:none;"></div>
      <div class="auth-field">
        <label for="auth-name">Navn (valgfrit)</label>
        <input type="text" id="auth-name" placeholder="Skriv dit navn">
      </div>
      <div class="auth-field">
        <label for="auth-email">E-mail</label>
        <input type="email" id="auth-email" placeholder="din@mail.dk">
      </div>
      <button type="button" class="btn btn-primary js-auth-submit">log ind</button>
      <p class="auth-help">
        Login er lokalt og gemmes kun i din browser. Du kan altid logge ud igen.
      </p>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeBtn = backdrop.querySelector(".auth-modal-close");
  const submitBtn = backdrop.querySelector(".js-auth-submit");
  const errorEl = backdrop.querySelector(".js-auth-error");
  const emailInput = backdrop.querySelector("#auth-email");
  const nameInput = backdrop.querySelector("#auth-name");

  function close() {
    backdrop.remove();
  }

  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  submitBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const name = nameInput.value.trim();

    if (!email) {
      errorEl.textContent = "Skriv din e-mail for at logge ind.";
      errorEl.style.display = "block";
      return;
    }

    const user = { email, name };
    saveUser(user);
    updateAuthUI();
    close();
  });
}

function updateAuthUI() {
  const label = document.querySelector(".js-auth-user-label");
  const btn = document.querySelector(".js-auth-toggle");
  if (!label || !btn) return;

  const user = getCurrentUser();
  if (user) {
    const name = user.name && user.name.trim().length > 0 ? user.name.trim() : user.email;
    label.textContent = `Logget ind som ${name}`;
    btn.textContent = "log ud";
  } else {
    label.textContent = "";
    btn.textContent = "log ind";
  }
}

function initAuth() {
  const btn = document.querySelector(".js-auth-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      clearUser();
      updateAuthUI();
    } else {
      createAuthModal();
    }
  });

  updateAuthUI();
}

/* ---- init ---- */

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  initNavToggle();
  initAuth();
});
