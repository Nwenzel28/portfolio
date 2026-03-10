// =======================
// THEME TOGGLE
// Cycles: auto → light → dark
// Icon shown via data-mode + CSS (SVG, no emoji)
// Persists in localStorage
// =======================

const MODES = ['auto', 'light', 'dark'];

const TITLES = {
  auto:  'Theme: Auto (follows OS)',
  light: 'Theme: Light',
  dark:  'Theme: Dark',
};

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode) {
  const resolved = mode === 'auto' ? getSystemTheme() : mode;
  document.documentElement.setAttribute('data-theme', resolved);
}

function updateToggleUI(btn, mode) {
  btn.setAttribute('data-mode', mode);
  btn.setAttribute('title', TITLES[mode]);
  btn.setAttribute('aria-label', TITLES[mode]);
}

function getSavedMode() {
  return localStorage.getItem('theme-mode') || 'auto';
}

function saveMode(mode) {
  localStorage.setItem('theme-mode', mode);
}

// Apply theme immediately before first paint to avoid flash
(function () {
  const mode = getSavedMode();
  applyTheme(mode);
})();

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  let currentMode = getSavedMode();
  applyTheme(currentMode);
  updateToggleUI(btn, currentMode);

  btn.addEventListener('click', function () {
    const idx = MODES.indexOf(currentMode);
    currentMode = MODES[(idx + 1) % MODES.length];
    saveMode(currentMode);
    applyTheme(currentMode);
    updateToggleUI(btn, currentMode);
  });

  // Live-update when OS preference changes (only matters in auto mode)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (getSavedMode() === 'auto') {
      applyTheme('auto');
    }
  });
});