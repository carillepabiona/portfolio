/* ═══════════════════════════════════════════════════════════
   Portfolio Script — Carille B. Pabiona
   Handles: dark mode, lucide icons, mobile menu, scroll reveal,
            active nav, progress bars, back-to-top, contact form,
            smooth scroll with fixed-nav offset
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. LUCIDE ICONS ─────────────────────────────────── */
  function initIcons() {
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  /* ─── 2. DARK MODE ────────────────────────────────────── */
  function initDarkMode() {
    const html = document.documentElement;
    const btn  = document.getElementById('themeToggle');

    // Apply saved preference immediately (avoids FOUC)
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.classList.add('dark');
    }

    if (!btn) return;
    btn.addEventListener('click', () => {
      html.classList.toggle('dark');
      localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* ─── 3. MOBILE MENU ──────────────────────────────────── */
  function initMobileMenu() {
    const toggle    = document.getElementById('menuToggle');
    const menu      = document.getElementById('mobileMenu');
    const menuIcon  = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove('open');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.add('open');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      }
    });

    // Close on link click
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ─── 4. SMOOTH SCROLL (offset for fixed navbar) ─────── */
  function initSmoothScroll() {
    const NAVBAR_HEIGHT = 72; // px — matches h-16 (64px) + small buffer

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─── 5. ACTIVE NAV LINK (IntersectionObserver) ──────── */
  function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-64px 0px -40% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ─── 6. SCROLL REVEAL ────────────────────────────────── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── 7. SKILL PROGRESS BARS ──────────────────────────── */
  function initProgressBars() {
    const items = document.querySelectorAll('.skill-progress-item');
    if (!items.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.progress-bar');
          const width = entry.target.getAttribute('data-width') || '0';
          if (bar) {
            // Delay slightly so CSS transition plays visibly
            requestAnimationFrame(() => {
              setTimeout(() => { bar.style.width = width + '%'; }, 100);
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    items.forEach(item => observer.observe(item));
  }

  /* ─── 8. BACK TO TOP ──────────────────────────────────── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  // Exposed globally for the inline onclick
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── 9. NAVBAR SHADOW ON SCROLL ─────────────────────── */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('shadow-sm');
      } else {
        navbar.classList.remove('shadow-sm');
      }
    }, { passive: true });
  }

  /* ─── 10. CONTACT FORM ────────────────────────────────── */
  window.handleContactSubmit = function () {
    const name    = document.getElementById('contactName');
    const email   = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    const btn     = document.getElementById('sendBtn');
    const success = document.getElementById('formSuccess');

    if (!name || !email || !message) return;

    const nameVal    = name.value.trim();
    const emailVal   = email.value.trim();
    const messageVal = message.value.trim();

    // Simple validation
    if (!nameVal || !emailVal || !messageVal) {
      shakeButton(btn);
      showFormError(btn, 'Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      shakeButton(btn);
      showFormError(btn, 'Please enter a valid email address.');
      return;
    }

    // Open mailto as the action (no backend required)
    const subject = encodeURIComponent(`Portfolio Contact from ${nameVal}`);
    const body    = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\n${messageVal}`);
    window.location.href = `mailto:carillepabiona49@gmail.com?subject=${subject}&body=${body}`;

    // Show success state
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 12 4 9"></polyline><polyline points="4 9 4 20 20 20 20 6"></polyline></svg> Message Sent!';
      btn.classList.replace('bg-accent', 'bg-emerald-600');
      btn.classList.replace('hover:bg-accent-hover', 'hover:bg-emerald-700');
      btn.classList.replace('shadow-blue-500/20', 'shadow-emerald-500/20');
    }

    if (success) {
      success.classList.remove('hidden');
    }

    // Reset after 5s
    setTimeout(() => {
      if (name)    name.value    = '';
      if (email)   email.value   = '';
      if (message) message.value = '';
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message';
        btn.classList.replace('bg-emerald-600', 'bg-accent');
        btn.classList.replace('hover:bg-emerald-700', 'hover:bg-accent-hover');
      }
      if (success) success.classList.add('hidden');
    }, 5000);
  };

  function shakeButton(btn) {
    if (!btn) return;
    btn.classList.add('animate-shake');
    setTimeout(() => btn.classList.remove('animate-shake'), 500);
  }

  function showFormError(btn, msg) {
    if (!btn) return;
    const existing = btn.parentElement.querySelector('.form-error');
    if (existing) existing.remove();
    const err = document.createElement('p');
    err.className = 'form-error text-center text-xs text-red-500 dark:text-red-400 mt-2';
    err.textContent = msg;
    btn.insertAdjacentElement('afterend', err);
    setTimeout(() => err.remove(), 3000);
  }

  /* ─── 11. TYPING CURSOR (already CSS-driven, no JS needed) */

  /* ─── INIT ────────────────────────────────────────────── */
  function init() {
    initDarkMode();   // Must run first to prevent FOUC
    initIcons();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollReveal();
    initProgressBars();
    initBackToTop();
    initNavbarScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
