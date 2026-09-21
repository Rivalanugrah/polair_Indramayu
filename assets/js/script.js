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

  // Simulate submit
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

// ── Render Dynamic Kegiatan Cards ───────────────────────────────
function renderDynamicKegiatan() {
  const grid = document.getElementById('kegiatanGrid');
  if (!grid) return;
  
  const staticCards = grid.querySelectorAll('.kegiatan-card[data-static]');
  if (staticCards.length > 0) {
    staticCards.forEach(card => card.remove());
  }
  
  const existingDynCards = grid.querySelectorAll('.kegiatan-card:not([data-static])');
  if (existingDynCards.length > 0) return;
  
  if (typeof KegiatanStore === 'undefined') {
    console.warn('KegiatanStore belum tersedia');
    return;
  }
  
  const kegiatans = KegiatanStore.all();
  
  const svgBg = {
    patroli: 'linear-gradient(135deg,#001a5e,#003087)',
    sar: 'linear-gradient(135deg,#1a0a00,#4a1a00)',
    sosial: 'linear-gradient(135deg,#0a1a00,#1a3a00)',
    gakkum: 'linear-gradient(135deg,#1a0010,#3a0030)'
  };
  
  const svgIcons = {
    patroli: '<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect x="10" y="85" width="280" height="50" rx="4" fill="#002060"/><rect x="40" y="50" width="220" height="37" rx="3" fill="#001540"/><rect x="80" y="22" width="140" height="30" rx="3" fill="#003087"/><rect x="90" y="28" width="22" height="16" rx="2" fill="rgba(0,200,255,0.7)"/><rect x="120" y="28" width="22" height="16" rx="2" fill="rgba(0,200,255,0.6)"/><rect x="150" y="28" width="22" height="16" rx="2" fill="rgba(0,200,255,0.7)"/><line x1="150" y1="5" x2="150" y2="22" stroke="rgba(200,220,255,0.8)" stroke-width="2"/><path d="M0,95 Q75,88 150,93 Q225,98 300,95" stroke="rgba(0,180,216,0.4)" stroke-width="1.5" fill="none"/><text x="150" y="122" font-family="Arial" font-size="9" font-weight="bold" fill="rgba(255,255,255,0.6)" text-anchor="middle" letter-spacing="3">POLISI</text></svg>',
    sar: '<div style="font-size:5rem;display:flex;align-items:center;justify-content:center;height:100%;filter:drop-shadow(0 0 20px rgba(255,100,0,0.5))">&#x1F198;</div>',
    sosial: '<div style="font-size:5rem;display:flex;align-items:center;justify-content:center;height:100%;filter:drop-shadow(0 0 20px rgba(50,200,50,0.4))">&#x1F91D;</div>',
    gakkum: '<div style="font-size:5rem;display:flex;align-items:center;justify-content:center;height:100%;filter:drop-shadow(0 0 20px rgba(200,0,200,0.4))">&#x2696;</div>'
  };
  
  const meta = {
    patroli: { label: 'Patroli', bg: svgBg.patroli, icon: svgIcons.patroli },
    sar: { label: 'SAR', bg: svgBg.sar, icon: svgIcons.sar },
    sosial: { label: 'Sosial', bg: svgBg.sosial, icon: svgIcons.sosial },
    gakkum: { label: 'Gakkum', bg: svgBg.gakkum, icon: svgIcons.gakkum }
  };
  
  kegiatans.forEach(k => {
    const m = meta[k.kategori] || meta.patroli;
    const hasCustomImg = k.gambar && k.gambar.trim() !== '';
    
    const card = document.createElement('div');
    card.className = 'kegiatan-card reveal';
    card.dataset.cat = k.kategori;
    card.innerHTML = '<div class="kegiatan-visual" style="background:' + m.bg + '">' + (hasCustomImg ? '<img src="' + k.gambar + '" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML=\'' + m.icon + '\'">' : m.icon) + '</div><div class="kegiatan-card-body"><span class="kegiatan-cat">' + m.label + '</span><h3>' + k.judul + '</h3><p>' + (k.deskripsi || '') + '</p><div class="kegiatan-meta"><span class="kegiatan-date">' + (k.waktu || '-') + '</span><span class="kegiatan-date">' + (k.lokasi || '-') + '</span></div></div>';
    grid.appendChild(card);
    
    setTimeout(() => {
      revealObserver.observe(card);
    }, 50);
  });
}

function initKegiatanFilter() {
  const tabs = document.querySelectorAll('.kegiatan-tab');
  const grid = document.getElementById('kegiatanGrid');
  
  if (!tabs.length || !grid) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
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
}

document.addEventListener('DOMContentLoaded', () => {
  initKegiatanFilter();
  setTimeout(renderDynamicKegiatan, 300);
});

if (typeof BroadcastChannel !== 'undefined') {
  const channel = new BroadcastChannel('polair_kegiatan_sync');
  channel.addEventListener('message', (e) => {
    if (e.data.type === 'kegiatan_updated') {
      const grid = document.getElementById('kegiatanGrid');
      if (grid) {
        grid.querySelectorAll('.kegiatan-card:not([data-static])').forEach(c => c.remove());
        renderDynamicKegiatan();
      }
    }
  });
}

// ── Render Dynamic Galeri Cards ────────────────────────────────
function renderDynamicGaleri() {
  const grid = document.getElementById('galeriBoxGrid');
  if (!grid) return;
  
  const staticCards = grid.querySelectorAll('.galeri-box-card[data-static]');
  if (staticCards.length > 0) {
    staticCards.forEach(card => card.remove());
  }
  
  const existingDynCards = grid.querySelectorAll('.galeri-box-card:not([data-static])');
  if (existingDynCards.length > 0) return;
  
  if (typeof GaleriStore === 'undefined') {
    console.warn('GaleriStore belum tersedia');
    return;
  }
  
  const galeris = GaleriStore.all();
  const filter = document.querySelector('.news-filter-btn.active')?.dataset.filter || 'all';
  const filteredGaleris = filter === 'all' ? galeris : galeris.filter(g => g.kategori === filter);
  
  const katMeta = {
    patroli: { label: 'Patroli Laut', color: '#00B4D8' },
    sar: { label: 'Misi SAR', color: '#fde047' },
    armada: { label: 'Kapal Armada', color: '#00B4D8' },
    sosial: { label: 'Bakti Sosial', color: '#86efac' },
    personel: { label: 'Personel', color: '#a5b4fc' }
  };
  
  // SVG placeholders untuk setiap kategori
  const svgPlaceholders = {
    patroli: '<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="220" fill="#061226"/><ellipse cx="180" cy="140" rx="160" ry="70" fill="rgba(0,180,216,0.15)"/><path d="M0,150 Q90,135 180,145 Q270,155 360,148 L360,220 L0,220 Z" fill="#003087"/><path d="M50,135 L280,135 L300,150 L270,165 L65,165 Z" fill="#001a5e" stroke="rgba(0,180,216,0.7)" stroke-width="1.5"/><rect x="110" y="95" width="120" height="42" rx="3" fill="#002b75"/><line x1="170" y1="55" x2="170" y2="95" stroke="white" stroke-width="2"/><circle cx="170" cy="55" r="10" fill="none" stroke="rgba(0,180,216,0.8)" stroke-width="1.5" stroke-dasharray="3,2"/><text x="180" y="152" font-family="Arial" font-size="9" font-weight="bold" fill="white" letter-spacing="2" text-anchor="middle">POLISI AIR</text></svg>',
    sar: '<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="220" fill="#0b172a"/><path d="M0,130 Q90,160 180,130 Q270,100 360,140 L360,220 L0,220 Z" fill="#002870"/><ellipse cx="180" cy="140" rx="45" ry="25" fill="#f97316" stroke="#ea580c" stroke-width="3"/><ellipse cx="180" cy="140" rx="30" ry="14" fill="#fdba74"/><circle cx="180" cy="120" r="10" fill="#0284c7"/><circle cx="280" cy="80" r="30" fill="none" stroke="#ef4444" stroke-width="7"/><path d="M280,50 L280,110 M250,80 L310,80" stroke="white" stroke-width="3"/></svg>',
    armada: '<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="220" fill="#021024"/><path d="M40,155 Q10,165 0,185" stroke="rgba(255,255,255,0.4)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M50,150 L280,150 L310,165 L270,175 L70,175 L30,160 Z" fill="#001e52" stroke="rgba(0,180,216,0.6)" stroke-width="1.5"/><path d="M45,150 L285,150" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/><rect x="110" y="110" width="90" height="42" rx="3" fill="#003594"/></svg>',
    sosial: '<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="220" fill="#071a1c"/><circle cx="180" cy="90" r="40" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" stroke-width="1.5"/><text x="180" y="102" font-size="32" text-anchor="middle">&#x1F6DF;</text><rect x="40" y="150" width="280" height="60" rx="4" fill="#0c2e28"/></svg>',
    personel: '<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="220" fill="#09142b"/><rect x="0" y="150" width="360" height="70" fill="#1e293b"/><circle cx="70" cy="100" r="10" fill="#38bdf8"/><rect x="62" y="112" width="16" height="38" rx="2" fill="#003087"/><circle cx="170" cy="100" r="10" fill="#38bdf8"/><rect x="162" y="112" width="16" height="38" rx="2" fill="#003087"/><circle cx="270" cy="100" r="10" fill="#38bdf8"/><rect x="262" y="112" width="16" height="38" rx="2" fill="#003087"/></svg>'
  };
  
  filteredGaleris.forEach(g => {
    const meta = katMeta[g.kategori] || katMeta.patroli;
    const placeholder = svgPlaceholders[g.kategori] || svgPlaceholders.patroli;
    const hasCustomImg = g.gambar && g.gambar.trim() !== '';
    const tanggalFormatted = g.tanggal ? formatTanggalIndoShort(g.tanggal) : '';
    const lokasiText = g.lokasi ? ' · ' + g.lokasi : '';
    
    const card = document.createElement('div');
    card.className = 'galeri-box-card';
    card.dataset.cat = g.kategori;
    card.dataset.static = 'true';
    card.innerHTML = '<div class="galeri-box-badge" style="color:' + meta.color + ';">' + meta.label + '</div><div class="galeri-box-img"><svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" class="galeri-thumb">' + (hasCustomImg ? '<image href="' + g.gambar + '" width="360" height="220" preserveAspectRatio="xMidYMid slice"/>' : placeholder.replace('<svg ', '<svg ')) + '</svg><div class="galeri-overlay"><div class="galeri-overlay-icon">&#x1F50D;</div></div></div><div class="galeri-box-info"><div class="galeri-box-title">' + escapeHtml(g.judul) + '</div><div class="galeri-box-date">&#x1F4C5; ' + tanggalFormatted + lokasiText + '</div></div>';
    grid.appendChild(card);
  });
}

function formatTanggalIndoShort(dateStr) {
  if (!dateStr) return '';
  var bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.getDate() + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear();
}

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Update filterGaleri function untuk mendukung dynamic cards
var originalFilterGaleri = typeof filterGaleri !== 'undefined' ? filterGaleri : null;

function filterGaleri(category, btn) {
  if (btn) {
    document.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  
  const filter = btn ? btn.dataset.filter : category;
  
  const cards = document.querySelectorAll('.galeri-box-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    if (filter === 'all' || cardCat === filter) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Render dynamic galeri cards
  if (typeof GaleriStore !== 'undefined' && document.getElementById('galeriBoxGrid')) {
    setTimeout(renderDynamicGaleri, 100);
  }
}

// Initialize galeri filter
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderDynamicGaleri, 300);
});

// Listen for updates from admin
if (typeof BroadcastChannel !== 'undefined') {
  const galeriChannel = new BroadcastChannel('polair_galeri_sync');
  galeriChannel.addEventListener('message', (e) => {
    if (e.data.type === 'galeri_updated') {
      const grid = document.getElementById('galeriBoxGrid');
      if (grid) {
        grid.querySelectorAll('.galeri-box-card:not([data-static])').forEach(c => c.remove());
        renderDynamicGaleri();
      }
    }
  });
}
