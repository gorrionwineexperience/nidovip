/* ===================================================
   GORRIÓN WINE EXPERIENCE — SCRIPT PRINCIPAL
   =================================================== */

/**
 * CONFIGURACIÓN DE CONTRASEÑA
 * Hash SHA-256 de la contraseña actual
 */
const HASHED_PASSWORD = "14758405ee1576535e5983b7b392ae2e941662dfa2e18a672c57a581a888d407";
const LS_KEY = "gorrionwine_auth";
const EXPIRATION_HOURS = 24;

/**
 * Referencias del DOM
 */
const overlay = document.querySelector(".overlay");
const input = document.getElementById("pwd");
const btn = document.getElementById("enterBtn");
const errorBox = document.getElementById("gateError");
const loadingMsg = document.getElementById("loadingMsg");

/**
 * Pantalla de bienvenida
 */
function showWelcomeScreen() {
  const welcome = document.createElement("div");
  welcome.className = "welcome-screen";
  welcome.innerHTML = `
    <img src="./assets/logoredondo.png" alt="Logo Gorrión" class="logo" />
    <div class="halo" style="background:url('./assets/halo-corcho.png') center/cover no-repeat;"></div>
    <div class="welcome-text">
      <h2>🪶 Bienvenido a tu Nido...</h2>
      <p>descorchando tu alpiste 🍷</p>
    </div>
  `;
  document.body.appendChild(welcome);

  setTimeout(() => {
    welcome.classList.add("active");
  }, 100);

  // Transición al contenido principal
  setTimeout(() => {
    welcome.style.transition = "opacity 1s ease";
    welcome.style.opacity = 0;
    setTimeout(() => {
      welcome.remove();
      document.body.classList.add("auth");
    }, 1000);
  }, 3000);
}

/**
 * Función para generar hash SHA-256
 */
async function hashPassword(text) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifica si hay sesión válida guardada
 */
function isSessionValid() {
  const saved = localStorage.getItem(LS_KEY);
  if (!saved) return false;

  try {
    const data = JSON.parse(saved);
    const elapsed = (Date.now() - data.time) / (1000 * 60 * 60); // en horas
    return elapsed < EXPIRATION_HOURS;
  } catch {
    return false;
  }
}

/**
 * Inicia sesión y guarda timestamp
 */
function saveSession() {
  localStorage.setItem(LS_KEY, JSON.stringify({ time: Date.now() }));
}

/**
 * Manejo de intento de login
 */
async function tryLogin() {
  const val = (input.value || "").trim();
  if (!val) return;

  const hash = await hashPassword(val);
  if (hash === HASHED_PASSWORD) {
    errorBox.style.display = "none";
    input.disabled = true;
    btn.disabled = true;
    btn.style.display = "none";
    loadingMsg.style.display = "block";

    setTimeout(() => {
      saveSession();
      overlay.style.opacity = 0;
      overlay.style.pointerEvents = "none";
      showWelcomeScreen();
    }, 1000);
  } else {
    errorBox.style.display = "block";
    input.value = "";
    input.focus();
  }
}

/**
 * Listeners
 */
btn?.addEventListener("click", tryLogin);
input?.addEventListener("keydown", e => {
  if (e.key === "Enter") tryLogin();
  if (e.key === "Escape") {
    errorBox.style.display = "none";
    input.value = "";
  }
});

/**
 * Si ya hay sesión activa → ir directo a bienvenida
 */
if (isSessionValid()) {
  overlay.style.opacity = 0;
  overlay.style.pointerEvents = "none";
  showWelcomeScreen();
}

/* ===================================================
   EFECTOS DE SCROLL SUAVE (Spotify, mapas, etc.)
   =================================================== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll(".spotify-wrapper, .map-wrapper, blockquote")
  .forEach(el => observer.observe(el));
