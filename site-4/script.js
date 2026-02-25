/* ============================================================
   MESQUITE MANUFACTURING — PREMIUM CRAFT JS
   ============================================================ */
(function () {
  'use strict';

  /* --- NAV SCROLL --- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 80);
    });
  }

  /* --- MOBILE NAV --- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('nav__links--open');
      toggle.classList.toggle('nav__toggle--open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      toggle.classList.remove('nav__toggle--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* --- SMOOTH SCROLL --- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* --- HERO PARALLAX --- */
  const heroParallax = document.getElementById('heroParallax');
  if (heroParallax && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroParallax.style.transform = `translateY(${y * 0.3}px)`;
      }
    });
  }

  /* --- HERO SCROLL INDICATOR --- */
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll) {
    window.addEventListener('scroll', () => {
      heroScroll.style.opacity = Math.max(0, 1 - window.scrollY / 300);
    });
  }

  /* --- FADE IN ON SCROLL --- */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* --- ACTIVE NAV LINK --- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link');
  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => activeObs.observe(s));

  /* --- PORTFOLIO GALLERY (lightbox-style hover) --- */
  const galleryItems = document.querySelectorAll('.gallery__item');
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('gallery__item--hover'));
    item.addEventListener('mouseleave', () => item.classList.remove('gallery__item--hover'));
  });

  /* --- TIMELINE ANIMATION --- */
  const timelineSteps = document.querySelectorAll('.timeline__step');
  const timelineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline__step--visible');
        timelineObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  timelineSteps.forEach(s => timelineObs.observe(s));

  /* --- TESTIMONIAL CARD HOVER --- */
  document.querySelectorAll('.testimonial').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-4px)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  /* --- CONTACT FORM --- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Validate required fields
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#c53030';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) return;
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    });

    // Live validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.style.borderColor = '#c53030';
        } else {
          input.style.borderColor = '';
        }
      });
      input.addEventListener('input', () => { input.style.borderColor = ''; });
    });
  }

  /* --- FILE UPLOAD --- */
  const fileUpload = document.getElementById('fileUpload');
  const fileLabel = document.querySelector('.form__file-label');
  if (fileUpload && fileLabel) {
    fileUpload.addEventListener('change', () => {
      const names = [...fileUpload.files].map(f => f.name).join(', ');
      fileLabel.textContent = names || 'Choose files...';
    });
  }

  /* --- FOOTER YEAR --- */
  const yearEl = document.querySelector('[data-year]') || document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- GOLD RULE ANIMATION --- */
  document.querySelectorAll('.gold-rule').forEach(rule => {
    const ruleObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rule.classList.add('gold-rule--visible');
          ruleObs.unobserve(rule);
        }
      });
    }, { threshold: 0.5 });
    ruleObs.observe(rule);
  });

})();
