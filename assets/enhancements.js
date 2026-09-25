(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const film = document.querySelector('[data-welcome-film]');
  const pause = document.querySelector('[data-pause-film]');
  if (film && pause) {
    let userPaused = false;
    const update = () => {
      const stopped = motion.matches || userPaused;
      pause.textContent = stopped ? 'Play motion' : 'Pause motion';
      pause.setAttribute('aria-pressed', String(stopped));
      if (stopped) film.pause();
      else {
        const source = film.querySelector('source');
        if (!source.hasAttribute('src')) { source.src = source.dataset.src; film.load(); }
        film.play().catch(() => { userPaused = true; pause.textContent = 'Play motion'; pause.setAttribute('aria-pressed','true'); });
      }
    };
    pause.addEventListener('click', () => {
      if (motion.matches && film.paused) {
        const source = film.querySelector('source');
        if (!source.hasAttribute('src')) { source.src = source.dataset.src; film.load(); }
        film.play().then(() => { pause.textContent = 'Pause motion'; pause.setAttribute('aria-pressed','false'); }).catch(() => {});
      } else { userPaused = !userPaused; update(); }
    });
    motion.addEventListener('change', update);
    update();
  }
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = el => {
    const total = Number(el.dataset.count), start = performance.now();
    const paint = now => {
      const progress = Math.min(1,(now-start)/1300);
      el.textContent = (el.dataset.prefix || '') + Math.round(total * (1-Math.pow(1-progress,3))) + (el.dataset.suffix || '');
      if (progress < 1 && !motion.matches) requestAnimationFrame(paint);
      else el.textContent = (el.dataset.prefix || '') + total + (el.dataset.suffix || '');
    };
    if (!motion.matches) requestAnimationFrame(paint);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
    }), {threshold:.65});
    counters.forEach(el=>observer.observe(el));
  }
  document.querySelectorAll('[data-paper-reader]').forEach(reader => {
    let scale = 100;
    const pages = reader.querySelector('.paper-pages'), output = reader.querySelector('[data-paper-scale]');
    const buttons = reader.querySelectorAll('[data-paper-zoom]');
    buttons.forEach(button => button.addEventListener('click', () => {
      scale = Math.max(100,Math.min(250,scale + (button.dataset.paperZoom==='in'?25:-25)));
      pages.style.width = scale+'%'; output.textContent = scale+'%';
      buttons.forEach(b=>b.disabled = b.dataset.paperZoom==='out'?scale===100:scale===250);
    }));
    reader.querySelector('[data-paper-zoom="out"]').disabled = true;
  });
})();
