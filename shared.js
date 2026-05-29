// GM Carpentry — shared behavior: reveal on scroll, mobile menu, year stamp.
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  const toggle = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const close = document.querySelector('[data-mobile-close]');

  const setMenuOpen = (open) => {
    if (!menu) return;
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) close?.focus();
    else toggle?.focus();
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenuOpen(true));
    close && close.addEventListener('click', () => setMenuOpen(false));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenuOpen(false);
    });
  }

  const header = document.querySelector('[data-header]');
  if (header) {
    const setShadow = () => {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    setShadow();
    window.addEventListener('scroll', setShadow, { passive: true });
  }
})();
