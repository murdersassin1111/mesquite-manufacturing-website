/* ============================================================
   MESQUITE MANUFACTURING — CLEAN PRECISION JS
   ============================================================ */
(function () {
  'use strict';

  /* --- HEADER SCROLL --- */
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    lastScroll = window.scrollY;
  });

  /* --- MOBILE NAV --- */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
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
      const offset = header ? header.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* --- ACTIVE NAV --- */
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => { if (s.id) observerNav.observe(s); });

  /* --- FADE IN ANIMATIONS --- */
  const fadeEls = document.querySelectorAll('.fade-in, .service-card, .cap-card, .process-step, .value-item, .cert-badge');
  fadeEls.forEach(el => el.classList.add('fade-in'));
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* --- STAT COUNTER --- */
  function animateCount(el) {
    const text = el.textContent.trim();
    const match = text.match(/([\d,.]+)([%+MKk]*)/);
    if (!match) return;
    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    const hasDecimal = match[1].includes('.');
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (hasDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(s => statObserver.observe(s));

  /* --- TESTIMONIAL CAROUSEL --- */
  const track = document.getElementById('testi-track');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const dotsWrap = document.getElementById('testi-dots');
  if (track && prevBtn && nextBtn && dotsWrap) {
    const cards = track.querySelectorAll('.testi-card');
    const dots = dotsWrap.querySelectorAll('.dot');
    let current = 0;
    function goTo(i) {
      current = ((i % cards.length) + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === current));
    }
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    setInterval(() => goTo(current + 1), 6000);
  }

  /* --- BACK TO TOP --- */
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- FILE UPLOAD --- */
  const dropZone = document.getElementById('file-drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileList = document.getElementById('file-list');
  let files = [];
  if (dropZone && fileInput && fileList) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault(); dropZone.classList.remove('dragover');
      addFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => addFiles(fileInput.files));
    function addFiles(newFiles) {
      [...newFiles].forEach(f => files.push(f));
      renderFiles();
    }
    function renderFiles() {
      fileList.innerHTML = files.map((f, i) =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:.85rem;">
          <span>${f.name} (${(f.size/1024).toFixed(0)} KB)</span>
          <button onclick="removeFile(${i})" style="background:none;border:none;color:#e53e3e;cursor:pointer;font-weight:700;">×</button>
        </div>`
      ).join('');
    }
    window.removeFile = function(i) { files.splice(i, 1); renderFiles(); };
  }

  /* --- FORM --- */
  const form = document.getElementById('quote-form');
  const formSuccess = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    });
  }

  /* --- FOOTER YEAR --- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- NEWSLETTER --- */
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      nlForm.innerHTML = '<p style="color:rgba(255,255,255,.8);">✓ Subscribed!</p>';
    });
  }
})();
