(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: fondo al hacer scroll + menú móvil ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Parallax ---------- */
  // Cada elemento con data-speed se desplaza en función de lo lejos que esté
  // su sección del centro de la pantalla. Positivo = más lento que el scroll.
  const layers = [...document.querySelectorAll('[data-speed]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0,
    host: el.closest('section, header, footer') || el.parentElement,
  }));

  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    nav.classList.toggle('is-scrolled', window.scrollY > 40);

    if (!reduceMotion) {
      for (const { el, speed, host } of layers) {
        const r = host.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue; // fuera de pantalla
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ---------- Reveal al entrar en pantalla ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Pequeño escalonado entre elementos hermanos
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
