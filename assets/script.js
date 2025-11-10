/* ======================================
   GORRIÓN WINE EXPERIENCE — SCRIPT PRINCIPAL
   ====================================== */

const HASHED_PASSWORD = '14758405ee1576535e5983b7b392ae2e941662dfa2e18a672c57a581a888d407';
const LS_KEY = 'gorrionwine_auth';
const LS_EXP_KEY = 'gorrionwine_auth_expires';

const formBtn = document.getElementById('enterBtn');
const input = document.getElementById('pwd');
const errorBox = document.getElementById('gateError');
const loadingMsg = document.getElementById('loadingMsg');

/* ===============================
   FUNCIÓN HASH DE CONTRASEÑA
   =============================== */
async function hashPassword(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ===============================
   COMPROBAR SESIÓN EXISTENTE
   =============================== */
const now = Date.now();
const stored = localStorage.getItem(LS_KEY);
const expires = localStorage.getItem(LS_EXP_KEY);

if (stored === 'true' && expires && now < parseInt(expires)) {
  document.body.classList.add('auth');
}

/* ===============================
   FUNCIÓN DE LOGIN
   =============================== */
async function tryLogin() {
  const val = (input.value || '').trim();
  const h = await hashPassword(val);
  if (h === HASHED_PASSWORD) {
    errorBox.style.display = 'none';
    input.disabled = true;
    formBtn.disabled = true;
    formBtn.style.display = 'none';
    loadingMsg.style.display = 'block';
    localStorage.setItem(LS_KEY, 'true');
    localStorage.setItem(LS_EXP_KEY, (Date.now() + 24 * 60 * 60 * 1000).toString()); // expira en 24 h
    setTimeout(showWelcomeScreen, 600);
  } else {
    errorBox.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

/* ===============================
   EVENTOS DE INTERACCIÓN
   =============================== */
formBtn.addEventListener('click', tryLogin);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
  if (e.key === 'Escape') { errorBox.style.display = 'none'; input.value = ''; }
});

/* ===============================
   BIENVENIDA ANIMADA
   =============================== */
function showWelcomeScreen() {
  const overlay = document.querySelector('.overlay');
  overlay.style.opacity = '0';
  setTimeout(() => { overlay.style.display = 'none'; }, 800);

  const welcome = document.createElement('div');
  welcome.className = 'welcome-screen';
  welcome.innerHTML = `
    <div class="halo" style="background: radial-gradient(circle, rgba(250,246,240,1) 0%, rgba(122,28,28,0.25) 70%, transparent 100%);"></div>
    <img src="./assets/logoredondo.png" alt="Logo Gorrión" class="logo">
    <div class="welcome-text">
      <h2>🐦 Bienvenido a tu Nido...</h2>
      <p>descorchando tu alpiste 🍷</p>
    </div>
  `;
  document.body.appendChild(welcome);
  setTimeout(() => welcome.classList.add('active'), 50);

  setTimeout(() => {
    welcome.style.transition = 'opacity 0.5s ease';
    welcome.style.opacity = '0';
    setTimeout(() => {
      welcome.remove();
      document.body.classList.add('auth');
    }, 500);
  }, 3000);
}

/* ===============================
   ANIMACIONES EN SCROLL
   =============================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });

document.querySelectorAll('.spotify-wrapper, .map-wrapper, blockquote')
  .forEach(el => observer.observe(el));
