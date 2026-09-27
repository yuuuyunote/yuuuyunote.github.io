(function () {
  'use strict';

  /* ===== theme toggle (light / dark, localStorage) ===== */
  var root = document.documentElement;
  var themeCheckbox = document.getElementById('theme-checkbox');
  var STORAGE_KEY = 'yuuuyu-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeCheckbox) themeCheckbox.checked = theme === 'dark';
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function () {
      var next = themeCheckbox.checked ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  /* ===== hamburger / mobile menu ===== */
  var hamburger = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== fade-up reveal (one-time, on entering viewport) ===== */
  var fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      fadeEls.forEach(function (el) { observer.observe(el); });
    } else {
      fadeEls.forEach(function (el) { el.classList.add('in-view'); });
    }
  }
})();
