/* NCC — interactive framework: "the matrix of competitive success".
   Capability pillars drift, then bind into a connected, reinforcing system.
   Toggle siloed vs connected; hover a pillar to learn what it holds up.
   Pure canvas, no dependencies, respects prefers-reduced-motion. */
(function () {
  "use strict";

  var PILLARS = [
    { label: "Strategy",        desc: "The wrapper — decisions tested under pressure, written to survive a Board without their author in the room." },
    { label: "Operations",      desc: "The foundation — operating models and controls that make everything above them defensible at audit." },
    { label: "AI & Automation", desc: "The active layer — judgement replaced, augmented or governed, with value tracked to a P&L line." },
    { label: "Capital · PE",    desc: "The deal context — diligence, 100-day value plans and integration that actually move EBITDA." },
    { label: "Governance",      desc: "The check — Board-defensible oversight, audit and value tracking that keep the rest honest." },
    { label: "Quantum",         desc: "The frontier — optimisation where classical solvers hit a wall, applied only where it pays." }
  ];

  var TWO_PI = Math.PI * 2;

  function init(canvas) {
    var stage = canvas.parentElement;
    var tip = stage.querySelector(".matrix-tooltip");
    var ctx = canvas.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, t = 0, hoverIdx = -1, connected = true, raf = null;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var nodes = PILLARS.map(function (p) {
      return { label: p.label, desc: p.desc, x: 0, y: 0, hx: 0, hy: 0, sx: 0, sy: 0, ph: Math.random() * TWO_PI };
    });
    var center = { x: 0, y: 0, label: "Competitive success" };
    var parts = [];

    function layout() {
      var cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.33;
      center.x = cx; center.y = cy;
      nodes.forEach(function (n, i) {
        var a = (i / nodes.length) * TWO_PI - Math.PI / 2;
        n.hx = cx + Math.cos(a) * r;
        n.hy = cy + Math.sin(a) * r;
        var sr = Math.min(W, H) * 0.62;
        n.sx = cx + Math.cos(a) * sr * (1.05 + Math.random() * 0.3);
        n.sy = cy + Math.sin(a) * sr * (0.85 + Math.random() * 0.4);
        if (n.x === 0 && n.y === 0) { n.x = n.hx; n.y = n.hy; }
      });
      var count = Math.max(26, Math.min(64, Math.round((W * H) / 16000)));
      parts = [];
      for (var k = 0; k < count; k++) {
        parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22 });
      }
    }

    function resize() {
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      layout();
    }

    function lineGrad(a, b, alpha, hot) {
      var c = hot ? "229,201,136" : "201,168,106";
      var g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, "rgba(" + c + "," + (alpha * (hot ? 1.7 : 1)) + ")");
      g.addColorStop(1, "rgba(" + c + "," + (alpha * 0.45) + ")");
      ctx.strokeStyle = g; ctx.lineWidth = hot ? 1.7 : 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    function glow(x, y, r, col) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI); ctx.fill();
    }
    function label(x, y, text, col, weight) {
      ctx.font = weight + ' 12px "Inter", system-ui, sans-serif';
      ctx.textAlign = "center"; ctx.fillStyle = col; ctx.fillText(text, x, y);
    }

    function frame() {
      t += 0.006;
      ctx.clearRect(0, 0, W, H);

      // molecular background
      for (var p = 0; p < parts.length; p++) {
        var q = parts[p];
        q.x += q.vx; q.y += q.vy;
        if (q.x < 0 || q.x > W) q.vx *= -1;
        if (q.y < 0 || q.y > H) q.vy *= -1;
      }
      for (var i = 0; i < parts.length; i++) {
        for (var j = i + 1; j < parts.length; j++) {
          var dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 92) {
            ctx.strokeStyle = "rgba(201,168,106," + ((1 - d / 92) * 0.10) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(parts[i].x, parts[i].y); ctx.lineTo(parts[j].x, parts[j].y); ctx.stroke();
          }
        }
      }
      for (var pp = 0; pp < parts.length; pp++) {
        ctx.fillStyle = "rgba(201,168,106,0.22)";
        ctx.beginPath(); ctx.arc(parts[pp].x, parts[pp].y, 1.3, 0, TWO_PI); ctx.fill();
      }

      // pillars ease toward target
      nodes.forEach(function (n) {
        var tx = connected ? n.hx : n.sx, ty = connected ? n.hy : n.sy;
        var fl = reduce ? 0 : Math.sin(t * 2 + n.ph) * 6;
        n.x += (tx - n.x) * 0.06;
        n.y += (ty + fl - n.y) * 0.06;
      });

      var ca = connected ? 1 : 0.05;
      for (var r = 0; r < nodes.length; r++) {
        lineGrad(nodes[r], nodes[(r + 1) % nodes.length], ca * 0.5, r === hoverIdx || (r + 1) % nodes.length === hoverIdx);
      }
      nodes.forEach(function (n, idx) { lineGrad(n, center, ca * 0.4, idx === hoverIdx); });

      if (connected && !reduce) {
        var seg = Math.floor(t * 0.6) % nodes.length;
        var f = (t * 0.6) % 1, a = nodes[seg];
        ctx.fillStyle = "rgba(229,201,136,0.9)";
        ctx.beginPath(); ctx.arc(a.x + (center.x - a.x) * f, a.y + (center.y - a.y) * f, 2.5, 0, TWO_PI); ctx.fill();
      }

      if (connected) {
        glow(center.x, center.y, 28, "rgba(201,168,106,0.18)");
        ctx.fillStyle = "rgba(229,201,136,0.95)";
        ctx.beginPath(); ctx.arc(center.x, center.y, 5, 0, TWO_PI); ctx.fill();
        label(center.x, center.y + 24, center.label, "rgba(250,248,243,0.85)", 600);
      }

      nodes.forEach(function (n, idx) {
        var hot = idx === hoverIdx;
        var dim = hoverIdx >= 0 && !hot ? 0.4 : 1;
        glow(n.x, n.y, hot ? 24 : 14, "rgba(201,168,106," + ((hot ? 0.32 : 0.14) * dim) + ")");
        ctx.fillStyle = "rgba(201,168,106," + ((hot ? 1 : 0.85) * dim) + ")";
        ctx.beginPath(); ctx.arc(n.x, n.y, hot ? 7 : 5, 0, TWO_PI); ctx.fill();
        label(n.x, n.y - 16, n.label, "rgba(250,248,243," + ((hot ? 1 : 0.72) * dim) + ")", hot ? 600 : 500);
      });

      raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left, my = e.clientY - rect.top, best = -1, bd = 30;
      nodes.forEach(function (n, idx) { var d = Math.hypot(n.x - mx, n.y - my); if (d < bd) { bd = d; best = idx; } });
      hoverIdx = best;
      if (best >= 0) {
        tip.innerHTML = "<strong>" + nodes[best].label + "</strong>" + nodes[best].desc;
        tip.style.left = Math.min(mx + 16, W - 248) + "px";
        tip.style.top = Math.max(my - 8, 8) + "px";
        tip.hidden = false; canvas.style.cursor = "pointer";
      } else { tip.hidden = true; canvas.style.cursor = "crosshair"; }
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", function () { hoverIdx = -1; tip.hidden = true; });

    var wrap = stage.closest("section") || stage.parentElement;
    var btns = wrap.querySelectorAll("[data-matrix-toggle]");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        connected = b.getAttribute("data-matrix-toggle") === "connected";
        Array.prototype.forEach.call(btns, function (x) { x.classList.toggle("is-active", x === b); });
      });
    });

    window.addEventListener("resize", resize);
    resize();
    frame();
  }

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll("canvas.ncc-matrix"), init);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
