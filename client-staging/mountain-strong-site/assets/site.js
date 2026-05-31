/* ════════════════════════════════════════════════════════════════
   Mountain Strong Financial · site.js
   - Mobile nav toggle (hamburger)
   - Active-page highlighting in nav
   - Active-section highlighting in sub-nav (scrollspy)
   - Close mobile nav on link click + outside click + Esc
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Mobile nav toggle ────────────────────────────────────────
  function setupNavToggle() {
    var nav = document.querySelector('.nav');
    var toggle = document.getElementById('navToggle');
    if (!nav || !toggle) return;

    function close() {
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    function open() {
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('is-open')) close();
      else open();
    });

    // Close on link click (inside the drawer)
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    // Click outside
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target)) return;
      close();
    });

    // Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });

    // Re-show on viewport widen
    var mq = window.matchMedia('(min-width: 901px)');
    var onChange = function () { if (mq.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  // ── Active-page highlight on the global nav ──────────────────
  function setupActiveLink() {
    // Get a normalized "page key" from a URL path or href.
    // Examples:
    //   "/"                      → "index"
    //   "/about"                 → "about"
    //   "/about.html"            → "about"
    //   "/site/about.html"       → "about"
    //   "about.html"             → "about"
    //   "about.html#notes"       → "about"
    //   "/about#notes"           → "about"
    function pageKey(s) {
      if (!s) return 'index';
      // Strip query + hash
      s = s.split('?')[0].split('#')[0];
      // Strip trailing slash
      s = s.replace(/\/$/, '');
      // Take last segment
      var last = s.split('/').pop();
      // Strip .html
      last = last.replace(/\.html$/i, '');
      // Empty or "index" → home
      if (!last || last === 'index') return 'index';
      return last;
    }

    var currentKey = pageKey(location.pathname);
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    links.forEach(function (a) {
      if (pageKey(a.getAttribute('href')) === currentKey) {
        a.classList.add('is-active');
      }
    });
  }

  // ── Sub-nav scrollspy ────────────────────────────────────────
  function setupScrollspy() {
    var subnav = document.querySelector('.subnav');
    if (!subnav) return;
    var links = subnav.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ link: a, el: el });
    });
    if (!sections.length) return;

    var offset = 120; // approximate global nav + sub-nav height
    function update() {
      var y = window.scrollY + offset + 20;
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.offsetTop <= y) current = sections[i];
        else break;
      }
      sections.forEach(function (s) {
        s.link.classList.toggle('is-active', s === current);
      });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    setupNavToggle();
    setupActiveLink();
    setupScrollspy();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
