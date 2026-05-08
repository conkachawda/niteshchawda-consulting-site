/* NCC reference site — main.js
   v2.0 May 2026
   Mobile nav · safe external links · scroll-reveal · hero canvas lattice
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

  if (location.hash) {
    var t = document.querySelector(location.hash);
    if (t) t.setAttribute('tabindex', '-1');
  }

  /* --- Scroll-reveal --------------------------------------- */
  var prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prm && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { el.classList.add('in'); });
  }

  /* --- Header on scroll ------------------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      header.style.boxShadow = y > 4 ? '0 1px 0 rgba(5, 28, 44, 0.06)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Year tokens ----------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ============================================================
     HERO CANVAS — Brass lattice with traveling wave + cursor halo
     ----------------------------------------------------------
     Renders a grid of small brass dots whose brightness pulses
     according to a slow diagonal travelling wave. The cursor
     position adds a soft halo that brightens nearby dots.
     Lightweight (~ < 1ms/frame on modern devices), respects
     prefers-reduced-motion (canvas hidden via CSS).
     ============================================================ */
  if (prm) return;

  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var SPACING = 38;            // px between lattice points (CSS px)
  var DOT_R   = 1.5;           // base radius
  var DOT_R_HOT = 2.6;         // halo-bright radius
  var WAVE_SPEED = 0.00018;    // wave phase rate
  var WAVE_K     = 0.024;      // wave spatial frequency
  var HALO_R     = 220;        // cursor halo radius (CSS px)

  var W = 0, H = 0;
  var dots = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var rafId = null;
  var visible = true;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width  = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    dots = [];
    var cols = Math.ceil(W / SPACING) + 2;
    var rows = Math.ceil(H / SPACING) + 2;
    var offX = (W - (cols - 1) * SPACING) / 2;
    var offY = (H - (rows - 1) * SPACING) / 2;
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        dots.push({
          x: offX + i * SPACING,
          y: offY + j * SPACING,
          // small per-dot phase jitter for organic feel
          jitter: Math.sin(i * 12.9898 + j * 78.233) * 0.5
        });
      }
    }
  }

  function frame(t) {
    if (!visible) { rafId = requestAnimationFrame(frame); return; }

    ctx.clearRect(0, 0, W, H);

    var phase = t * WAVE_SPEED;

    for (var k = 0; k < dots.length; k++) {
      var d = dots[k];

      // Diagonal travelling wave: x+y direction
      var wave = Math.sin((d.x + d.y) * WAVE_K - phase * 6 + d.jitter);
      // base brightness: floor + wave amplitude
      var base = 0.10 + (wave * 0.5 + 0.5) * 0.28;

      // Cursor halo
      var halo = 0;
      if (mouse.active) {
        var dx = d.x - mouse.x;
        var dy = d.y - mouse.y;
        var dist2 = dx * dx + dy * dy;
        if (dist2 < HALO_R * HALO_R) {
          var dist = Math.sqrt(dist2);
          halo = Math.pow(1 - dist / HALO_R, 2) * 0.85;
        }
      }

      var b = Math.min(1, base + halo);
      var r = DOT_R + halo * (DOT_R_HOT - DOT_R);

      ctx.fillStyle = 'rgba(201, 168, 106, ' + b.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, 6.2832);
      ctx.fill();
    }

    rafId = requestAnimationFrame(frame);
  }

  // Resize
  var rzTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rzTimer);
    rzTimer = setTimeout(resize, 120);
  });

  // Cursor
  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
    mouse.active = true;
  });
  canvas.addEventListener('mouseleave', function () { mouse.active = false; });

  // Pause when hero is offscreen (perf)
  if ('IntersectionObserver' in window) {
    var visObs = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    });
    visObs.observe(canvas);
  }

  resize();
  rafId = requestAnimationFrame(frame);
})();
