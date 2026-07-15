/* =============================================
   PORTFOLIO — main.js
   Typing effect · Scroll animations · Nav
   ============================================= */

/* ── TYPED EFFECT ─────────────────────────── */
const phrases = [
  'Full-Stack Developer',
  'AI Integration Engineer',
  'React Native Builder',
  'Backend Architect',
  'Open Source Enthusiast',
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
  } else {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
  }

  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}
type();

/* ── NAVBAR SCROLL ────────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

/* ── ACTIVE NAV LINK ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = {
  hero: document.getElementById('nav-hero'),
  about: document.getElementById('nav-about'),
  projects: document.getElementById('nav-projects'),
  contact: document.getElementById('nav-contact'),
};

function updateActiveNav() {
  let current = 'hero';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  Object.entries(navItems).forEach(([id, el]) => {
    if (!el) return;
    el.classList.toggle('active', id === current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ── HAMBURGER MENU ───────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile nav when a link is clicked
navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

/* ── SCROLL REVEAL ────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── COUNTER ANIMATION ────────────────────── */
function animateCounter(el, target, suffix = '+', duration = 1800) {
  if (!el) return;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('hero');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      setTimeout(() => {
        animateCounter(document.getElementById('stat-projects'), 10);
        animateCounter(document.getElementById('stat-tech'), 20);
        animateCounter(document.getElementById('stat-exp'), 2);
      }, 600);
    }
  },
  { threshold: 0.3 }
);
if (statsSection) statsObserver.observe(statsSection);

/* ── CONTACT FORM ─────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('form-submit-btn');

contactForm?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('form-name')?.value.trim();
  const email = document.getElementById('form-email')?.value.trim();
  const subject = document.getElementById('form-subject')?.value.trim();
  const message = document.getElementById('form-message')?.value.trim();

  if (!name || !email || !subject || !message) {
    showFormFeedback('Please fill in all fields.', 'error');
    return;
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormFeedback('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate send
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    showFormFeedback('Message sent! I\'ll get back to you shortly. 🚀', 'success');
    contactForm.reset();
    submitBtn.innerHTML = `Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    submitBtn.disabled = false;
  }, 1500);
});

function showFormFeedback(msg, type) {
  let feedback = document.getElementById('form-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.id = 'form-feedback';
    feedback.setAttribute('role', 'alert');
    feedback.setAttribute('aria-live', 'polite');
    contactForm.appendChild(feedback);
  }
  feedback.textContent = msg;
  feedback.style.cssText = `
    margin-top: 12px;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    background: ${type === 'success' ? 'rgba(0, 255, 163, 0.1)' : 'rgba(255, 80, 80, 0.1)'};
    border: 1px solid ${type === 'success' ? '#00ffa3' : '#ff5050'};
    color: ${type === 'success' ? '#00ffa3' : '#ff5050'};
  `;
  setTimeout(() => feedback.remove(), 5000);
}

/* ── SMOOTH SCROLL FOR ALL ANCHOR LINKS ────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar?.offsetHeight ?? 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── PROJECT CARD TILT (subtle 3D) ─────────── */
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 5;
    const ry = ((x - cx) / cx) * -5;
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── CURSOR GLOW TRAIL ────────────────────── */
const trail = document.createElement('div');
trail.style.cssText = `
  position: fixed;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  background: radial-gradient(circle at center, rgba(0,212,255,0.06) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.15s ease, top 0.15s ease;
  mix-blend-mode: screen;
`;
document.body.appendChild(trail);

document.addEventListener('mousemove', (e) => {
  trail.style.left = e.clientX + 'px';
  trail.style.top = e.clientY + 'px';
}, { passive: true });
