// =======================
// THEME TOGGLE
// Cycles: light → dark → auto
// Persists in localStorage
// =======================

const MODES = ['light', 'dark', 'auto'];

const MODE_CONFIG = {
  light: { icon: '☀️', label: 'Light',  theme: 'light' },
  dark:  { icon: '🌙', label: 'Dark',   theme: 'dark'  },
  auto:  { icon: '🖥️', label: 'Auto',   theme: null    },
};

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode) {
  const resolved = mode === 'auto' ? getSystemTheme() : mode;
  document.documentElement.setAttribute('data-theme', resolved);
}

function updateToggleUI(mode) {
  const cfg = MODE_CONFIG[mode];
  const iconEl  = document.getElementById('theme-icon');
  const labelEl = document.getElementById('theme-label');
  if (iconEl)  iconEl.textContent  = cfg.icon;
  if (labelEl) labelEl.textContent = cfg.label;
}

function getSavedMode() {
  return localStorage.getItem('theme-mode') || 'auto';
}

function saveMode(mode) {
  localStorage.setItem('theme-mode', mode);
}

// Apply theme immediately on page load (before DOM paints) to avoid flash
(function() {
  const mode = getSavedMode();
  applyTheme(mode);
})();

// Once DOM is ready, wire up the toggle button
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  let currentMode = getSavedMode();
  updateToggleUI(currentMode);

  btn.addEventListener('click', function () {
    const idx = MODES.indexOf(currentMode);
    currentMode = MODES[(idx + 1) % MODES.length];
    saveMode(currentMode);
    applyTheme(currentMode);
    updateToggleUI(currentMode);
  });

  // If in auto mode, respond to OS theme changes live
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (getSavedMode() === 'auto') {
      applyTheme('auto');
    }
  });
});