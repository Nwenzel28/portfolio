// =======================
// THEME TOGGLE
// Cycles: auto → light → dark
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

// Apply immediately before first paint
(function () {
  applyTheme(getSavedMode());
})();

document.addEventListener('DOMContentLoaded', function () {

  // ---- Theme toggle ----
  const btn = document.getElementById('theme-toggle');
  if (btn) {
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

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (getSavedMode() === 'auto') applyTheme('auto');
    });
  }

  // ---- Page transitions ----
  // Mark page as faded-in on arrival
  document.body.classList.add('page-fade-in');

  // Intercept all same-origin nav link clicks
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    // Skip: external, hash-only, mailto, blank target
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    if (link.target === '_blank') return;

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
    } catch (err) {
      return;
    }

    e.preventDefault();
    document.body.classList.add('page-fade-out');

    setTimeout(() => {
      window.location.href = href;
    }, 190);
  });

});