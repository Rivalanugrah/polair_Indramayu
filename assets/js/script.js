/* ============================================================
   POLAIR INDRAMAYU — script.js
   Navigation, Animations, Interactivity
   ============================================================ */

'use strict';

// ── DOM References ──────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const backToTop   = document.getElementById('back-to-top');
const navLinks    = document.querySelectorAll('.nav-links a');
const sections    = document.querySelectorAll('section[id]');

// ── Navbar scroll behavior (Throttled with requestAnimationFrame) ──
let scrollTicking = false;

function handleScroll() {
  const y = window.scrollY;

  // Scrolled state
  if (navbar) navbar.classList.toggle('scrolled', y > 50);

  // Back to top button
  if (backToTop) backToTop.classList.toggle('show', y > 400);

  // Active nav link
  let currentSection = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (y >= top) currentSection = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(handleScroll);
    scrollTicking = true;
  }
}, { passive: true });

// ── Hamburger / Mobile Menu ─────────────────────────────────
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Smooth scroll for anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── Counter Animation ────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('id-ID');
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Floating Particles ───────────────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['rgba(0,180,216,0.6)', 'rgba(0,71,184,0.5)', 'rgba(255,215,0,0.4)', 'rgba(255,255,255,0.3)'];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(p);
  }
}

createParticles();

// ── Profil Tabs ──────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    const parent = btn.closest('.profil-grid, .reveal-right') || btn.parentElement.parentElement;

    // Deactivate all
    btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // Find tab contents in same section
    document.querySelectorAll(`#tab-${btn.parentElement.dataset.group || ''}, .tab-content`).forEach(tc => {
      // Only toggle within the same parent section
      if (btn.parentElement.parentElement.contains(tc)) {
        tc.classList.remove('active');
      }
    });

    btn.classList.add('active');
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.add('active');
  });
});

// ── Kegiatan Filter ──────────────────────────────────────────
document.querySelectorAll('.kegiatan-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.kegiatan-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    document.querySelectorAll('.kegiatan-card').forEach(card => {
      const cat = card.dataset.cat;
      if (filter === 'all' || cat === filter) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.4s ease';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Galeri Filter ─────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.galeri-item').forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(el) {
  const lb = document.getElementById('lightbox');
  const inner = document.getElementById('lightboxInner');
  const svg = el.querySelector('svg');

  if (svg) {
    inner.innerHTML = `
      <button class="lightbox-close" onclick="closeLightbox()">✕</button>
      <div style="padding:2rem;background:var(--dark-2);border-radius:var(--radius-lg);max-width:700px">
        ${svg.outerHTML.replace('class="galeri-thumb"', 'style="width:100%;height:auto;max-height:70vh"')}
      </div>
    `;
  }

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// ESC to close lightbox
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Leaflet Map ───────────────────────────────────────────────
function initMap() {
  if (!window.L || !document.getElementById('map')) return;

  const map = L.map('map', {
    center: [-6.3257, 108.3225],
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Custom marker icon
  const polairIcon = L.divIcon({
    html: `<div style="
      background:linear-gradient(135deg,#003087,#00B4D8);
      width:42px; height:42px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 4px 15px rgba(0,180,216,0.5);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:1.1rem">⚓</span></div>`,
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42]
  });

  // Markas POLAIR
  L.marker([-6.3257, 108.3225], { icon: polairIcon })
    .addTo(map)
    .bindPopup(`
      <div style="font-family:Inter,sans-serif;padding:0.5rem">
        <strong style="color:#003087">⚓ Markas POLAIR Indramayu</strong><br/>
        <small>Jl. Raya Pantai Karangsong<br/>
        Indramayu, Jawa Barat 45214<br/>
        📞 (0234) 201234</small>
      </div>
    `, { maxWidth: 260 })
    .openPopup();

  // Pos-pos POLAIR
  const positions = [
    { coord: [-6.22, 108.20], label: '🚢 Pos Patrol Barat', desc: 'Pos patroli wilayah barat Indramayu' },
    { coord: [-6.38, 108.42], label: '🚢 Pos Patrol Timur', desc: 'Pos patroli wilayah timur Indramayu' },
    { coord: [-6.15, 108.32], label: '🔭 Pos Pengawasan Laut', desc: 'Pos pengawasan perairan lepas pantai' },
    { coord: [-6.30, 107.95], label: '⚓ Pos Sukra', desc: 'Pos pengamanan barat, batas Subang' },
  ];

  const posIcon = L.divIcon({
    html: `<div style="
      background:rgba(0,180,216,0.8);
      width:12px;height:12px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 8px rgba(0,180,216,0.8);
    "></div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  positions.forEach(pos => {
    L.marker(pos.coord, { icon: posIcon })
      .addTo(map)
      .bindPopup(`<div style="font-family:Inter,sans-serif"><strong>${pos.label}</strong><br/><small>${pos.desc}</small></div>`);
  });

  // Wilayah operasi (polygon laut)
  const wilayahCoords = [
    [-6.05, 107.90], [-6.00, 108.00], [-5.95, 108.15],
    [-5.90, 108.30], [-5.92, 108.45], [-6.00, 108.55],
    [-6.10, 108.65], [-6.25, 108.50], [-6.40, 108.50],
    [-6.45, 108.35], [-6.42, 108.20], [-6.38, 108.05],
    [-6.30, 107.95], [-6.20, 107.88]
  ];

  L.polygon(wilayahCoords, {
    color: '#00B4D8',
    weight: 2,
    fillColor: '#003087',
    fillOpacity: 0.15,
    dashArray: '8,6'
  }).addTo(map).bindPopup('<strong>Wilayah Operasi POLAIR Indramayu</strong><br/><small>±4.800 km² perairan Laut Jawa</small>');

  // Garis pantai approximation
  const coastline = [
    [-6.30, 107.95], [-6.32, 108.05], [-6.33, 108.15],
    [-6.32, 108.25], [-6.31, 108.32], [-6.33, 108.42]
  ];

  L.polyline(coastline, {
    color: '#FFD700',
    weight: 3,
    opacity: 0.6,
    dashArray: '5,3'
  }).addTo(map);
}

// Initialize map when Leaflet is ready
if (window.L) {
  initMap();
} else {
  window.addEventListener('load', () => {
    setTimeout(initMap, 500);
  });
}

// ── Contact Form ──────────────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('kontakForm');
  const success = document.getElementById('formSuccess');

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = '⏳ Mengirim...';
  btn.disabled = true;

  // Simpan pesan ke penyimpanan bersama agar muncul di Admin > Pesan Masuk
  if (typeof PesanStore !== 'undefined') {
    PesanStore.add({
      nama: document.getElementById('nama').value,
      telepon: document.getElementById('telepon').value,
      email: document.getElementById('email').value,
      kategori: document.getElementById('kategori').value || 'lainnya',
      pesan: document.getElementById('pesan').value
    });
  }

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.style.animation = 'fadeInUp 0.5s ease';
  }, 1500);
}

// ── Radar sweep, Police light blink, & Wave animations ────────
// All handled 100% via hardware-accelerated CSS keyframes in style.css
// No DOM mutation, no layout recalculations, zero jitter or scroll jumping.

// ── Active section highlight in navbar ───────────────────────
// Already handled in scroll listener above.

// ── Console branding ─────────────────────────────────────────
console.log('%c⚓ POLAIR INDRAMAYU', 'color:#00B4D8;font-size:20px;font-weight:bold;font-family:monospace');
console.log('%cSatuan Polisi Air Polres Indramayu', 'color:#94a3c8;font-size:12px');
console.log('%cMelayani · Melindungi · Mengayomi', 'color:#FFD700;font-size:11px');
