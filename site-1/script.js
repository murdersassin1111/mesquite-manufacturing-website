/**
 * Mesquite Manufacturing — script.js
 * Theme: Industrial Dark · Electric Blue Accents
 *
 * Features:
 *  • Mobile menu toggle
 *  • Smooth scroll (anchor links)
 *  • Navbar scroll state (shrink + shadow on scroll)
 *  • IntersectionObserver fade-in for .reveal elements
 *  • Stats counter animation (data-target / data-suffix)
 *  • Hero parallax effect
 *  • Pulsing CTA pulse sync
 *  • Floating Action Button show/hide
 *  • Active nav link highlight on scroll
 *  • Contact form validation + success state
 *  • Hero elements animate in on load
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────────────────────── */

/**
 * Lerp – smooth value interpolation
 */
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Clamp a value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Ease-out cubic easing
 */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Format a number with locale-aware commas (e.g. 10000 → "10,000")
 */
const formatNumber = (n) => Math.round(n).toLocaleString('en-US');

/* ─────────────────────────────────────────────────────────────
   DOM refs (queried once at start)
───────────────────────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const fab         = document.getElementById('fab');
const quoteForm   = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const heroSection = document.querySelector('.hero');
const heroBgImg   = document.querySelector('.hero__bg-img');

/* ─────────────────────────────────────────────────────────────
   1. MOBILE MENU TOGGLE
───────────────────────────────────────────────────────────── */
(function initMobileMenu() {
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    hamburger.classList.toggle('nav__hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav__links--open');
      hamburger.classList.remove('nav__hamburger--open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('nav__links--open') &&
      !navbar.contains(e.target)
    ) {
      navLinks.classList.remove('nav__links--open');
      hamburger.classList.remove('nav__hamburger--open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('nav__links--open')) {
      navLinks.classList.remove('nav__links--open');
      hamburger.classList.remove('nav__hamburger--open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
})();

/* ─────────────────────────────────────────────────────────────
   2. SMOOTH SCROLL (anchor links)
───────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  // Only override if the browser doesn't natively handle scroll-behavior: smooth
  // (we also apply via CSS, but JS gives us nav-height offset compensation)
  const NAVBAR_HEIGHT = () => navbar ? navbar.offsetHeight : 70;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetY =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        NAVBAR_HEIGHT();

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   3. NAVBAR SCROLL STATE
───────────────────────────────────────────────────────────── */
(function initNavbarScroll() {
  if (!navbar) return;

  const THRESHOLD = 60;
  let lastScrollY = window.pageYOffset;

  const update = () => {
    const scrollY = window.pageYOffset;

    // Scrolled class — triggers compact/shadow styling in CSS
    navbar.classList.toggle('nav--scrolled', scrollY > THRESHOLD);

    // Hide navbar when scrolling down fast, show on scroll up
    if (scrollY > lastScrollY && scrollY > 300) {
      navbar.classList.add('nav--hidden');
    } else {
      navbar.classList.remove('nav--hidden');
    }

    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // initial state
})();

/* ─────────────────────────────────────────────────────────────
   4. ACTIVE NAV LINK (highlight based on scroll position)
───────────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

  if (!sections.length || !navLinkEls.length) return;

  const OFFSET = 120; // px from top to trigger "active"

  const update = () => {
    const scrollY = window.pageYOffset + OFFSET;
    let currentId = '';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('nav__link--active', href === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────────────────────────────
   5. INTERSECTIONOBSERVER – REVEAL (fade-in) ANIMATIONS
───────────────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   6. STATS COUNTER ANIMATION
   Elements with data-target="10000" data-suffix="+" count up
───────────────────────────────────────────────────────────── */
(function initStatsCounter() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const DURATION = 1800; // ms

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = clamp(elapsed / DURATION, 0, 1);
      const eased   = easeOutCubic(progress);
      const current = eased * target;

      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  // Only start when the stats section is visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

/* ─────────────────────────────────────────────────────────────
   7. HERO PARALLAX
───────────────────────────────────────────────────────────── */
(function initHeroParallax() {
  if (!heroBgImg || !heroSection) return;

  // Disable on reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Disable on mobile (perf + layout)
  const isMobile = () => window.innerWidth < 768;

  const update = () => {
    if (isMobile()) {
      heroBgImg.style.transform = '';
      return;
    }

    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.pageYOffset > heroBottom) return;

    const scrollRatio = window.pageYOffset / heroSection.offsetHeight;
    const translateY  = scrollRatio * 40; // max 40px downward shift

    heroBgImg.style.transform = `scale(1.08) translateY(${translateY}px)`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────────────────────────────
   8. FLOATING ACTION BUTTON (FAB) show / hide
───────────────────────────────────────────────────────────── */
(function initFAB() {
  if (!fab) return;

  const SHOW_AFTER = 500; // px scrolled before FAB appears

  const update = () => {
    fab.classList.toggle('fab--visible', window.pageYOffset > SHOW_AFTER);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ─────────────────────────────────────────────────────────────
   9. PULSING CTA — stagger pulse so elements don't all fire at once
───────────────────────────────────────────────────────────── */
(function initPulseCTA() {
  const pulseEls = document.querySelectorAll('.btn--pulse');
  pulseEls.forEach((el, i) => {
    // Stagger animation-delay so they pulse in sequence
    el.style.animationDelay = `${i * 0.4}s`;
  });
})();

/* ─────────────────────────────────────────────────────────────
   10. HERO CONTENT — trigger reveal on load (not scroll)
───────────────────────────────────────────────────────────── */
(function initHeroReveal() {
  // Hero reveal elements animate in immediately on page load
  const heroReveals = document.querySelectorAll('.hero .reveal');

  const triggerReveal = () => {
    heroReveals.forEach((el) => {
      el.classList.add('reveal--visible');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', triggerReveal);
  } else {
    // Small delay so CSS transitions play smoothly after paint
    requestAnimationFrame(() => setTimeout(triggerReveal, 100));
  }
})();

/* ─────────────────────────────────────────────────────────────
   11. CONTACT FORM — validation + success state
───────────────────────────────────────────────────────────── */
(function initContactForm() {
  if (!quoteForm || !formSuccess) return;

  const submitBtn = document.getElementById('submitBtn');

  // Field-level validation helpers
  const validators = {
    firstName : (v) => v.trim().length >= 2,
    lastName  : (v) => v.trim().length >= 2,
    email     : (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    service   : (v) => v !== '',
    message   : (v) => v.trim().length >= 10,
  };

  const showError = (input, msg) => {
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = msg;
    input.classList.add('form-input--error');
    input.setAttribute('aria-invalid', 'true');
  };

  const clearError = (input) => {
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.remove();
    input.classList.remove('form-input--error');
    input.removeAttribute('aria-invalid');
  };

  // Live validation on blur
  quoteForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const validator = validators[field.name];
      if (!validator) return;
      if (!validator(field.value)) {
        const messages = {
          firstName : 'Please enter your first name.',
          lastName  : 'Please enter your last name.',
          email     : 'Please enter a valid email address.',
          service   : 'Please select a service.',
          message   : 'Please describe your project (at least 10 characters).',
        };
        showError(field, messages[field.name]);
      } else {
        clearError(field);
      }
    });

    field.addEventListener('input', () => clearError(field));
  });

  // Submit handler
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate all required fields
    Object.entries(validators).forEach(([name, validate]) => {
      const field = quoteForm.querySelector(`[name="${name}"]`);
      if (!field) return;
      if (!validate(field.value)) {
        const messages = {
          firstName : 'Please enter your first name.',
          lastName  : 'Please enter your last name.',
          email     : 'Please enter a valid email address.',
          service   : 'Please select a service.',
          message   : 'Please describe your project (at least 10 characters).',
        };
        showError(field, messages[name]);
        isValid = false;
      } else {
        clearError(field);
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = quoteForm.querySelector('.form-input--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Simulate async submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending…';
    }

    setTimeout(() => {
      quoteForm.hidden   = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });
})();

/* ─────────────────────────────────────────────────────────────
   12. SERVICE CARDS — subtle tilt on mouse move (desktop only)
───────────────────────────────────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.service-card, .why-card');
  const MAX_TILT = 4; // degrees

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const tiltX  = clamp((-dy / (rect.height / 2)) * MAX_TILT, -MAX_TILT, MAX_TILT);
      const tiltY  = clamp(( dx / (rect.width  / 2)) * MAX_TILT, -MAX_TILT, MAX_TILT);

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   13. INDUSTRY PILLS — staggered entrance via IntersectionObserver
───────────────────────────────────────────────────────────── */
(function initIndustryPills() {
  const pills = document.querySelectorAll('.industry-pill');
  if (!pills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  pills.forEach((pill) => observer.observe(pill));
})();

/* ─────────────────────────────────────────────────────────────
   14. PROCESS STEPS — count-up line animation
───────────────────────────────────────────────────────────── */
(function initProcessSteps() {
  const steps = document.querySelectorAll('.process__step');
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('process__step--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  steps.forEach((step) => observer.observe(step));
})();

/* ─────────────────────────────────────────────────────────────
   15. TICKER — pause on hover for accessibility
───────────────────────────────────────────────────────────── */
(function initTicker() {
  const tickerTrack = document.querySelector('.ticker__track');
  if (!tickerTrack) return;

  tickerTrack.parentElement.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });

  tickerTrack.parentElement.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
})();

/* ─────────────────────────────────────────────────────────────
   16. HERO SCROLL INDICATOR — fade out as user scrolls
───────────────────────────────────────────────────────────── */
(function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.hero__scroll');
  if (!scrollIndicator) return;

  const update = () => {
    const opacity = clamp(1 - window.pageYOffset / 200, 0, 1);
    scrollIndicator.style.opacity = opacity;
  };

  window.addEventListener('scroll', update, { passive: true });
})();

/* ─────────────────────────────────────────────────────────────
   17. GRID OVERLAY ANIMATION — electric pulse effect on hero grid
───────────────────────────────────────────────────────────── */
(function initHeroGridPulse() {
  const heroGrid = document.querySelector('.hero__grid');
  if (!heroGrid) return;

  // Randomize grid flash timing slightly for an organic feel
  let pulseInterval;
  const randomPulse = () => {
    heroGrid.style.opacity = (0.3 + Math.random() * 0.4).toFixed(2);
    pulseInterval = setTimeout(randomPulse, 2000 + Math.random() * 3000);
  };

  randomPulse();

  // Clean up when the section leaves the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          clearTimeout(pulseInterval);
        } else {
          randomPulse();
        }
      });
    },
    { threshold: 0.1 }
  );

  if (heroSection) observer.observe(heroSection);
})();

/* ─────────────────────────────────────────────────────────────
   18. ABOUT SECTION — floating badge parallax
───────────────────────────────────────────────────────────── */
(function initAboutBadgeParallax() {
  const badge = document.querySelector('.about__badge-float');
  const aboutSection = document.querySelector('.about');
  if (!badge || !aboutSection) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const update = () => {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const progress  = 1 - (rect.bottom / (window.innerHeight + rect.height));
    const translateY = lerp(-12, 12, progress);

    badge.style.transform = `translateY(${translateY}px)`;
  };

  window.addEventListener('scroll', update, { passive: true });
})();

/* ─────────────────────────────────────────────────────────────
   Init complete — log minimal marker (development aid)
───────────────────────────────────────────────────────────── */
console.log('%c⬡ Mesquite Manufacturing · script.js loaded', 'color:#0ea5e9;font-weight:bold;font-size:12px;');
