/* ============================================================
   MESQUITE MANUFACTURING — TECHNICAL AUTHORITY JS
   ============================================================ */
(function () {
  'use strict';

  /* --- HEADER SCROLL --- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* --- MOBILE NAV --- */
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
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
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a');
  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => activeObs.observe(s));

  /* --- FADE IN --- */
  const fadeEls = document.querySelectorAll('.fade-in, .cap-card, .industry-card, .case-card, .faq-item, .spec-card, .process-step');
  fadeEls.forEach(el => { if (!el.classList.contains('fade-in')) el.classList.add('fade-in'); });
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  /* --- TRUST NUMBER COUNTER --- */
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
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (hasDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const trustNums = document.querySelectorAll('.trust-number');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  trustNums.forEach(n => countObs.observe(n));

  /* --- MATERIAL TABLE SEARCH --- */
  const searchInput = document.getElementById('materialSearch');
  const table = document.getElementById('materialsTable');
  if (searchInput && table) {
    const rows = table.querySelectorAll('tbody tr');
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* --- MATERIAL FILTER BUTTONS --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.textContent.trim().toLowerCase();
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          if (filter === 'all') { row.style.display = ''; return; }
          const badge = row.querySelector('.type-badge');
          row.style.display = badge && badge.textContent.toLowerCase().includes(filter) ? '' : 'none';
        });
      }
    });
  });

  /* --- FAQ ACCORDION --- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all in same category
      item.closest('.faq-category')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* --- FILE UPLOAD --- */
  const dropZone = document.getElementById('fileUploadZone');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  let files = [];
  if (dropZone && fileInput) {
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
      if (!fileList) return;
      fileList.innerHTML = files.map((f, i) =>
        `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:.85rem;">
          <span>${f.name} (${(f.size / 1024).toFixed(0)} KB)</span>
          <button onclick="window.__removeFile(${i})" style="background:none;border:none;color:#e53e3e;cursor:pointer;font-weight:700;">×</button>
        </div>`
      ).join('');
    }
    window.__removeFile = function (i) { files.splice(i, 1); renderFiles(); };
  }

  /* --- FORM --- */
  const form = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) { input.style.borderColor = '#e53e3e'; valid = false; }
        else input.style.borderColor = '';
      });
      if (!valid) return;
      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    });
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }

  /* --- TOLERANCE BAR ANIMATION --- */
  const tolBars = document.querySelectorAll('.tol-bar');
  const tolObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.style.width; // trigger repaint
        tolObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  tolBars.forEach(b => { const w = b.style.width || getComputedStyle(b).width; b.style.width = '0'; tolObs.observe(b); });

  /* --- SCROLL CUE FADE --- */
  const scrollCue = document.querySelector('.hero-scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      scrollCue.style.opacity = Math.max(0, 1 - window.scrollY / 300);
    });
  }

  /* --- TABLE SORT (basic) --- */
  document.querySelectorAll('.data-table th.sortable').forEach((th, colIdx) => {
    let asc = true;
    th.addEventListener('click', () => {
      const tbody = th.closest('table').querySelector('tbody');
      if (!tbody) return;
      const rows = [...tbody.querySelectorAll('tr')];
      rows.sort((a, b) => {
        const aText = a.children[colIdx]?.textContent.trim() || '';
        const bText = b.children[colIdx]?.textContent.trim() || '';
        return asc ? aText.localeCompare(bText, undefined, { numeric: true }) : bText.localeCompare(aText, undefined, { numeric: true });
      });
      asc = !asc;
      rows.forEach(r => tbody.appendChild(r));
    });
  });

})();
