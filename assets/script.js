// =============================
// Gorrión Wine Experience JS
// =============================

// 🔐 Configuración
const HASHED_PASSWORD = '14758405ee1576535e5983b7b392ae2e941662dfa2e18a672c57a581a888d407';
const LS_KEY = 'gorrionwine_auth';
const EXP_DAYS = 1; // duración en días

// 🔍 Elementos
const formBtn = document.getElementById('enterBtn');
const input = document.getElementById('pwd');
const errorBox = document.getElementById('gateError');
const loadingMsg = document.getElementById('loadingMsg');
const overlay = document.querySelector('.overlay');

// =============================
// Función de hash
// =============================
async function hashPassword(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// =============================
// Control de sesión con expiración diaria
// =============================
function isSessionValid() {
  const session = localStorage.getItem(LS_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    const now = Date.now();
    return now - data.timestamp < EXP_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function saveSession() {
  localStorage.setItem(LS_KEY, JSON.stringify({ valid: true, timestamp: Date.now() }));
}

// =============================
// Login principal
// =============================
async function tryLogin() {
  const val = (input.value || '').trim();
  const h = await hashPassword(val);
  if (h === HASHED_PASSWORD) {
    errorBox.style.display = 'none';
    input.disabled = true;
    formBtn.disabled = true;
    formBtn.style.display = 'none';
    loadingMsg.innerHTML = '<span class="spinner"></span>🕊️ Bienvenido a tu Nido...<br>descorchando tu alpiste 🍷';
    loadingMsg.style.display = 'block';
    saveSession();
    setTimeout(() => {
      overlay.style.opacity = '0';
      document.body.classList.add('auth');
      setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }, 3000);
  } else {
    errorBox.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

// =============================
// Inicialización
// =============================
if (isSessionValid()) {
  document.body.classList.add('auth');
  overlay.style.display = 'none';
} else {
  localStorage.removeItem(LS_KEY);
}

// Eventos
formBtn?.addEventListener('click', tryLogin);
input?.addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
  if (e.key === 'Escape') {
    errorBox.style.display = 'none';
    input.value = '';
  }
});

// =============================
// Animaciones de scroll
// =============================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.2 });

document.querySelectorAll('.spotify-wrapper, .map-wrapper, blockquote')
  .forEach(el => observer.observe(el));
