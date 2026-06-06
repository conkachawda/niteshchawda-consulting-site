/* NCC — interactive 3D model cube. Six faces (capability pillars),
   drag to rotate, click a face / nav to focus it, auto-spins when idle.
   Two engines (Human + Agentic) sit beneath it in the markup. */
(function () {
  "use strict";

  var FACES = [
    { key: "strategy",   cls: "cf-front",  label: "Strategy",        rx: -14, ry: 0,   desc: "The wrapper — decisions tested under pressure, written to survive a Board without their author in the room." },
    { key: "operations", cls: "cf-right",  label: "Operations",      rx: -14, ry: -90, desc: "The foundation — operating models and controls that keep everything above them defensible at audit." },
    { key: "ai",         cls: "cf-top",    label: "AI & Automation", rx: -76, ry: 0,   desc: "The active layer — judgement replaced, augmented or governed, with value tracked to a P&L line." },
    { key: "capital",    cls: "cf-left",   label: "Capital · PE", rx: -14, ry: 90, desc: "The deal context — diligence, 100-day value plans and integration that actually move EBITDA." },
    { key: "governance", cls: "cf-bottom", label: "Governance",      rx: 76,  ry: 0,   desc: "The check — Board-defensible oversight, audit and value tracking that keep the rest honest." },
    { key: "quantum",    cls: "cf-back",   label: "Quantum",         rx: -14, ry: 180, desc: "The frontier — optimisation where classical solvers hit a wall, applied only where it pays." }
  ];

  function init(scene) {
    var cube = scene.querySelector(".cube");
    var wrap = scene.closest("section") || scene.parentElement;
    var detail = wrap.querySelector("[data-cube-detail]");
    var nav = wrap.querySelector("[data-cube-nav]");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var rotX = -18, rotY = 24, tX = null, tY = null, hovering = false, dragging = false, px = 0, py = 0, faces = {};

    FACES.forEach(function (f, i) {
      var el = document.createElement("div");
      el.className = "cube-face " + f.cls;
      el.innerHTML = '<span class="cf-num">0' + (i + 1) + '</span><span class="cf-label">' + f.label + "</span>";
      el.addEventListener("click", function (e) { e.stopPropagation(); select(f); });
      cube.appendChild(el);
      faces[f.key] = el;

      if (nav) {
        var b = document.createElement("button");
        b.type = "button"; b.textContent = f.label;
        b.addEventListener("click", function () { select(f); });
        nav.appendChild(b);
        f._btn = b;
      }
    });

    function setDetail(f) {
      if (detail) detail.innerHTML = '<span class="eyebrow">Pillar 0' + (FACES.indexOf(f) + 1) + "</span><h3>" + f.label + "</h3><p>" + f.desc + "</p>";
    }
    function select(f) {
      tX = f.rx; tY = f.ry;
      FACES.forEach(function (x) {
        faces[x.key].classList.toggle("is-active", x === f);
        if (x._btn) x._btn.classList.toggle("is-active", x === f);
      });
      setDetail(f);
    }
    setDetail(FACES[0]);

    function loop() {
      if (tX !== null) {
        rotX += (tX - rotX) * 0.12; rotY += (tY - rotY) * 0.12;
        if (Math.abs(tX - rotX) < 0.2 && Math.abs(tY - rotY) < 0.2) { rotX = tX; rotY = tY; tX = tY = null; }
      } else if (!hovering && !dragging && !reduce) {
        rotY += 0.16;
      }
      cube.style.transform = "rotateX(" + rotX + "deg) rotateY(" + rotY + "deg)";
      requestAnimationFrame(loop);
    }

    scene.addEventListener("pointerenter", function () { hovering = true; });
    scene.addEventListener("pointerleave", function () { hovering = false; });
    scene.addEventListener("pointerdown", function (e) { dragging = true; tX = tY = null; px = e.clientX; py = e.clientY; try { scene.setPointerCapture(e.pointerId); } catch (err) {} });
    scene.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      rotY += (e.clientX - px) * 0.4; rotX -= (e.clientY - py) * 0.4;
      rotX = Math.max(-85, Math.min(85, rotX));
      px = e.clientX; py = e.clientY;
    });
    window.addEventListener("pointerup", function () { dragging = false; });

    var initFace = scene.getAttribute("data-face");
    if (initFace) { var ff = FACES.filter(function (x) { return x.key === initFace; })[0]; if (ff) select(ff); }

    loop();
  }

  function boot() { Array.prototype.forEach.call(document.querySelectorAll("[data-cube]"), init); }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
