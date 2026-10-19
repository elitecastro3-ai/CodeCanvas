/* ============================================================
   CodeCanvas — Main JavaScript
   Scroll reveal · Nav scroll shadow · Mobile menu · Portfolio filter
   NOTE: Supabase logic lives inline in index.html (preserved as-is)
============================================================ */

/* ── Scroll-reveal via IntersectionObserver ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(
          () => entry.target.classList.add('visible'),
          i * 70
        );
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ── Navbar: shadow + shrink on scroll ── */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    navEl.classList.add('nav--scrolled');
  } else {
    navEl.classList.remove('nav--scrolled');
  }
}, { passive: true });

/* ── Mobile hamburger menu ── */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  });
}

if (menuClose && mobileMenu) {
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
}

/* Close mobile menu when any link inside it is clicked */
document.querySelectorAll('#mobileMenu a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  });
});

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, #mobileMenu a');

function setActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('is-active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('is-active');
    }
  });
}
window.addEventListener('scroll', setActiveLink, { passive: true });

/* ── Contact form (UI only — Supabase submit lives in index.html) ── */
function handleSubmit(btn) {
  /* Intentionally left as a pass-through;
     the real async submit function is defined
     inline in index.html after the Supabase client is set up. */
}
