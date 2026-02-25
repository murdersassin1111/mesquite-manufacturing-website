/**
 * MESQUITE MANUFACTURING — script.js
 * Bold Manufacturing Theme · Black / Orange · High-Energy
 *
 * Features:
 *  1. Orange scroll-trace progress line
 *  2. Nav scroll state (shrink + shadow)
 *  3. Reveal animations via IntersectionObserver
 *  4. Stats counter (data-target number ticker)
 *  5. Timeline progress bar (scroll-driven)
 *  6. Mobile hamburger menu
 *  7. Smooth scrolling for all anchor links
 *  8. File drag-and-drop zone
 *  9. Quote form validation + success state
 * 10. Hover punch effects on service panels and buttons
 */

'use strict';

/* ─────────────────────────────────────────────
   1. SCROLL PROGRESS LINE
   Orange trace line across the top of the viewport
───────────────────────────────────────────── */
(function initScrollLine() {
  const line = document.getElementById('scrollLine');
  if (!line) return;

  function updateScrollLine() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    line.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateScrollLine, { passive: true });
  updateScrollLine();
})();


/* ─────────────────────────────────────────────
   2. NAV SCROLL BEHAVIOR
   Adds .nav--scrolled when user scrolls > 80px
───────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();


/* ─────────────────────────────────────────────
   3. REVEAL ANIMATIONS (IntersectionObserver)
   Classes: .reveal, .reveal--delay-1/2/3,
            .reveal--from-left, .reveal--from-right
───────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Assign CSS-var delays for .reveal--delay-* elements
  const delayMap = {
    'reveal--delay-1': '0.15s',
    'reveal--delay-2': '0.3s',
    'reveal--delay-3': '0.45s',
  };

  revealEls.forEach(el => {
    Object.keys(delayMap).forEach(cls => {
      if (el.classList.contains(cls)) {
        el.style.transitionDelay = delayMap[cls];
      }
    });
    // Respect inline --delay custom property from HTML (service panels, steps, stat blocks)
    const inlineDelay = el.style.getPropertyValue('--delay');
    if (inlineDelay) {
      el.style.transitionDelay = inlineDelay;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   4. STATS COUNTER
   Animates .stat-num[data-target] from 0 → target
   when the .numbers section enters the viewport
───────────────────────────────────────────── */
(function initStatsCounter() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  let hasRun = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();
    const startVal = 0;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startVal + easeOutQuart(progress) * (target - startVal));
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(tick);
  }

  const numbersSection = document.getElementById('numbers');
  if (!numbersSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          statNums.forEach(el => animateCounter(el));
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(numbersSection);
})();


/* ─────────────────────────────────────────────
   5. TIMELINE PROGRESS BAR
   Fills #timelineProgress based on how far the
   process section has been scrolled through
───────────────────────────────────────────── */
(function initTimelineProgress() {
  const progressBar = document.getElementById('timelineProgress');
  const processSection = document.getElementById('process');
  if (!progressBar || !processSection) return;

  function updateTimeline() {
    const rect = processSection.getBoundingClientRect();
    const sectionHeight = processSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Start filling when section top hits 80% down viewport,
    // finish when section bottom hits top of viewport
    const start = viewportHeight * 0.8;
    const traveled = start - rect.top;
    const total = sectionHeight + start;

    const pct = Math.min(Math.max((traveled / total) * 100, 0), 100);
    progressBar.style.height = pct + '%';
  }

  window.addEventListener('scroll', updateTimeline, { passive: true });
  updateTimeline();
})();


/* ─────────────────────────────────────────────
   6. MOBILE HAMBURGER MENU
   Toggles .is-open on nav and mobile menu
───────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const nav = document.getElementById('nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    nav && nav.classList.add('menu-open');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden'; // lock scroll when menu open
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    nav && nav.classList.remove('menu-open');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when any mobile link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Close if clicking outside the menu
  document.addEventListener('click', e => {
    if (
      hamburger.classList.contains('is-open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
})();


/* ─────────────────────────────────────────────
   7. SMOOTH SCROLLING
   Intercepts clicks on #anchor links, smooth-
   scrolls to target with nav offset compensation
───────────────────────────────────────────── */
(function initSmoothScroll() {
  const nav = document.getElementById('nav');

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const hash = link.getAttribute('href');
    if (!hash || hash === '#') {
      // Scroll to top
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav ? nav.offsetHeight : 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });

    // Update URL without triggering jump
    history.pushState(null, '', hash);
  });
})();


/* ─────────────────────────────────────────────
   8. FILE DRAG-AND-DROP ZONE
   Handles drag events + file input for #fileDrop
   Displays selected files in #fileList
───────────────────────────────────────────── */
(function initFileDrop() {
  const dropZone = document.getElementById('fileDrop');
  const fileInput = document.getElementById('files');
  const fileList = document.getElementById('fileList');
  if (!dropZone || !fileInput || !fileList) return;

  let selectedFiles = [];

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function renderFileList() {
    fileList.innerHTML = '';
    if (!selectedFiles.length) return;

    selectedFiles.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <span class="file-item-name">📎 ${file.name}</span>
        <span class="file-item-size">${formatBytes(file.size)}</span>
        <button class="file-item-remove" data-index="${i}" aria-label="Remove ${file.name}">✕</button>
      `;
      fileList.appendChild(item);
    });

    // Remove buttons
    fileList.querySelectorAll('.file-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        selectedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  function addFiles(newFiles) {
    const allowed = ['.step', '.stp', '.iges', '.igs', '.dxf', '.pdf', '.dwg'];
    Array.from(newFiles).forEach(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (allowed.includes(ext)) {
        selectedFiles.push(file);
      }
    });
    renderFileList();
  }

  // Drag events
  ['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'dragend', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
    });
  });

  dropZone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    if (dt && dt.files) addFiles(dt.files);
  });

  // File input change
  fileInput.addEventListener('change', () => {
    if (fileInput.files) addFiles(fileInput.files);
    // Reset input so same file can be re-added after removal
    fileInput.value = '';
  });
})();


/* ─────────────────────────────────────────────
   9. QUOTE FORM VALIDATION + SUCCESS STATE
───────────────────────────────────────────── */
(function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  const successEl = document.getElementById('formSuccess');
  if (!form || !successEl) return;

  function showError(input, msg) {
    input.classList.add('input--error');
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.classList.remove('input--error');
    const err = input.parentElement.querySelector('.field-error');
    if (err) err.remove();
  }

  function validateEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  // Live validation
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('input--error')) validateField(field);
    });
  });

  function validateField(field) {
    const val = field.value.trim();
    if (field.required && !val) {
      showError(field, 'This field is required.');
      return false;
    }
    if (field.type === 'email' && val && !validateEmail(val)) {
      showError(field, 'Please enter a valid email address.');
      return false;
    }
    clearError(field);
    return true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    // Email extra check
    const emailField = form.querySelector('#email');
    if (emailField && emailField.value.trim() && !validateEmail(emailField.value.trim())) {
      showError(emailField, 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) {
      // Shake the submit button
      const btn = form.querySelector('[type="submit"]');
      btn && btn.classList.add('btn--shake');
      setTimeout(() => btn && btn.classList.remove('btn--shake'), 500);

      // Scroll to first error
      const firstError = form.querySelector('.input--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Simulate submission — in production, POST to your endpoint here
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending…';
    }

    setTimeout(() => {
      form.style.display = 'none';
      successEl.style.display = 'flex';
    }, 900);
  });
})();

// Exposed globally for the inline onclick="resetForm()" in the HTML
function resetForm() {
  const form = document.getElementById('quoteForm');
  const successEl = document.getElementById('formSuccess');
  if (!form || !successEl) return;
  form.reset();
  form.querySelectorAll('.input--error').forEach(f => f.classList.remove('input--error'));
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.style.display = '';
  successEl.style.display = 'none';
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    const text = submitBtn.querySelector('.btn-text');
    if (text) text.textContent = 'Send Quote Request';
  }
}


/* ─────────────────────────────────────────────
   10. HOVER PUNCH EFFECTS
   Service panels: subtle tilt on mouse move
   Buttons: magnetic pull on hover
───────────────────────────────────────────── */
(function initHoverEffects() {
  // Service panel tilt
  document.querySelectorAll('.service-panel').forEach(panel => {
    panel.addEventListener('mousemove', e => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4; // max ±4deg
      const rotateY = ((x - cx) / cx) * 4;
      panel.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    panel.addEventListener('mouseleave', () => {
      panel.style.transform = '';
    });
  });

  // Stat block pulse on hover
  document.querySelectorAll('.stat-block').forEach(block => {
    block.addEventListener('mouseenter', () => {
      block.style.transform = 'scale(1.05)';
    });
    block.addEventListener('mouseleave', () => {
      block.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────────
   11. HERO PARALLAX (subtle depth on scroll)
───────────────────────────────────────────── */
(function initHeroParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // Only run on devices without reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) return;

  function updateParallax() {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight) {
      heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
})();


/* ─────────────────────────────────────────────
   12. ACTIVE NAV LINK HIGHLIGHTING
   Highlights the nav link for the section
   currently in view
───────────────────────────────────────────── */
(function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ─────────────────────────────────────────────
   INIT LOG (dev)
───────────────────────────────────────────── */
console.log('%c⚙ MESQUITE MANUFACTURING', 'color:#FF6B00;font-weight:bold;font-size:14px;');
console.log('%cBold Manufacturing · Texas · 24/7 · ±0.001″', 'color:#888;font-size:11px;');
