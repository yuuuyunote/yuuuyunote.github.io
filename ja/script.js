(function () {
  // ---- Mobile hamburger menu ----
  // Kept fully independent from the theme logic below: even if theme
  // storage throws, this still runs.
  try {
    var mainNav = document.getElementById('mainNav');
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    if (mainNav && hamburgerBtn) {
      hamburgerBtn.addEventListener('click', function () {
        var isOpen = mainNav.classList.toggle('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      // Close the menu after choosing a page, so it doesn't stay open
      // when the user comes back.
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('open');
        });
      });
    }
  } catch (e) {
    // no-op: never let this block theme toggling below
  }

  // ---- Theme toggle ----
  try {
    var themeToggle = document.getElementById('themeToggle');
    var body = document.body;

    var saved = null;
    try {
      saved = window.localStorage ? localStorage.getItem('bbh-theme') : null;
    } catch (e) {
      saved = null; // localStorage can throw in private-browsing contexts
    }
    if (saved === 'dark') {
      body.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var isDark = body.getAttribute('data-theme') === 'dark';
        var next = isDark ? 'light' : 'dark';
        body.setAttribute('data-theme', next);
        try {
          if (window.localStorage) { localStorage.setItem('bbh-theme', next); }
        } catch (e) {
          // ignore storage errors; theme still applies for this page view
        }
      });
    }
  } catch (e) {
    // no-op
  }
})();
