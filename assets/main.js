/* NCC reference site — main.js
   v1.1 May 2026
   Mobile nav · safe external links · scroll-reveal · marquee duplication
   No external dependencies. Defer-loaded.
*/

(function () {
  'use strict';

  /* --- Mobile nav toggle ----------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Safe external links --------------------------------- */
  document.querySelectorAll('a[href^="http"]').forEach(function (a) {
    if (!a.hostname.endsWith('niteshchawda.consulting') && !a.target) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });

  /* --- Hash navigation focus (a11y) ------------------------ */
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target) target.setAttribute('tabindex', '-1');
  }

  /* --- Scroll-reveal (IntersectionObserver) ---------------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      el.classList.add('in');
    });
  }

  /* --- Header shadow on scroll ----------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = 0;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      header.style.boxShadow = y > 4 ? '0 1px 0 rgba(5, 28, 44, 0.06)' : 'none';
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Current year in footer (if a [data-year] target) ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
