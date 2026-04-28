/* ============================================================
   PORTFOLIO — script.js
   Features:
     • Sticky navbar + scroll class
     • Active nav link on scroll (Intersection Observer)
     • Hamburger mobile menu toggle
     • Smooth reveal animations on scroll
     • Skill bar animation on scroll
     • Typewriter role effect in hero
     • Contact form frontend validation
   ============================================================ */

/* ── Helpers ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ====================================================
   1. NAVBAR — scrolled class & active link
   ==================================================== */
const navbar = $('#navbar');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

// Add shadow/blur when scrolled
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Intersection Observer → highlight correct nav link
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(sec => sectionObserver.observe(sec));

/* ====================================================
   2. HAMBURGER MENU
   ==================================================== */
const hamburger = $('#hamburger');
const navLinksContainer = $('#navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

// Close menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

/* ====================================================
   3. REVEAL ON SCROLL (data-reveal elements)
   ==================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.12 });

$$('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ====================================================
   4. SKILL BARS — animate width on scroll
   ==================================================== */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const target = bar.dataset.width;
        bar.style.width = target + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillSection = $('.about-skills');
if (skillSection) barObserver.observe(skillSection);

/* ====================================================
   5. TYPEWRITER — cycling roles in hero
   ==================================================== */
const roles = [
  'Frontend Developer',
  'BCA Final Year',
  'UI Enthusiast',
  'Problem Solver',
  'Open Source Contributor'
];

const roleEl = $('#roleText');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
  if (!roleEl) return;

  const current = roles[roleIndex];
  const displayed = isDeleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  roleEl.textContent = displayed;

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex > current.length) {
    // Pause at end before deleting
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex < 0) {
    isDeleting = false;
    charIndex = 0;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}

// Start typewriter after short delay
setTimeout(typeRole, 1000);

/* ====================================================
   6. PROJECT CARDS — staggered reveal
   ==================================================== */
const projectCards = $$('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Slight stagger per card
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projectCards.forEach(card => {
  // Set initial state
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = 'opacity .6s ease, transform .6s ease';
  cardObserver.observe(card);
});

/* ====================================================
   7. CONTACT FORM — frontend validation
   ==================================================== */
const form = $('#contactForm');
const formSuccess = $('#formSuccess');

/**
 * Show or clear an error on a field.
 * @param {string} fieldId  - id of the input element
 * @param {string} errorId  - id of the error span
 * @param {string} message  - error text, or '' to clear
 * @returns {boolean}       - true if valid (no error)
 */
function setFieldError(fieldId, errorId, message) {
  const field = $(`#${fieldId}`);
  const error = $(`#${errorId}`);
  if (!field || !error) return !message;

  error.textContent = message;
  if (message) {
    field.classList.add('error');
    field.classList.remove('valid');
  } else {
    field.classList.remove('error');
    field.classList.add('valid');
  }
  return !message;
}

/** Validate a single field by id */
function validateField(id) {
  const value = ($(`#${id}`)?.value || '').trim();

  if (id === 'name') {
    if (!value) return setFieldError('name', 'nameError', 'Name is required.');
    if (value.length < 2) return setFieldError('name', 'nameError', 'Name must be at least 2 characters.');
    return setFieldError('name', 'nameError', '');
  }

  if (id === 'email') {
    if (!value) return setFieldError('email', 'emailError', 'Email is required.');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) return setFieldError('email', 'emailError', 'Enter a valid email address.');
    return setFieldError('email', 'emailError', '');
  }

  if (id === 'message') {
    if (!value) return setFieldError('message', 'messageError', 'Message is required.');
    if (value.length < 15) return setFieldError('message', 'messageError', 'Message must be at least 15 characters.');
    return setFieldError('message', 'messageError', '');
  }

  return true;
}

// Real-time validation on blur
['name', 'email', 'message'].forEach(id => {
  const el = $(`#${id}`);
  if (el) {
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      // Clear error as soon as user types
      if (el.classList.contains('error')) validateField(id);
    });
  }
});

// Form submit
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameOk    = validateField('name');
    const emailOk   = validateField('email');
    const messageOk = validateField('message');

    if (!nameOk || !emailOk || !messageOk) return;

    // Simulate sending (replace with real API call)
    const btnText = $('#btnText');
    btnText.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      btnText.innerHTML = 'Send Message <i class="fa fa-paper-plane"></i>';
      form.reset();
      // Remove valid classes
      ['name', 'email', 'message'].forEach(id => {
        $(`#${id}`)?.classList.remove('valid', 'error');
      });
      formSuccess.classList.add('show');
      // Hide success after 5s
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1500);
  });
}

/* ====================================================
   8. SMOOTH SCROLL for all anchor links
   ==================================================== */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});
