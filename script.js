/* ===================================================
   script.js — ゆううゆ Portfolio
   共通処理: ダークモード切替 / ハンバーガーメニュー
   =================================================== */

(function () {
  'use strict';

  /* ── Theme ── */
  const THEME_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-checkbox');
    if (toggle) toggle.checked = theme === 'dark';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ── Hamburger ── */
  function initHamburger() {
    const btn  = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });

    // close on nav link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  }

  /* ── Active link ── */
  function initActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const page = href.split('/').pop();
      if (page === current || (current === '' && page === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHamburger();
    initActiveLink();

    const toggleCheckbox = document.getElementById('theme-checkbox');
    if (toggleCheckbox) {
      toggleCheckbox.addEventListener('change', toggleTheme);
    }
  });

})();
