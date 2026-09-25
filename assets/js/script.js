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
  const originalBtnText = btn ? btn.textContent : 'Kirim Pesan';

  // Ubah status tombol saat mengirim
  if (btn) {
    btn.textContent = '⏳ Mengirim...';
    btn.disabled = true;
  }

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

  // 1. Tampilkan notifikasi sukses setelah 1,5 detik
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.style.animation = 'fadeInUp 0.5s ease';

    // 2. Sembunyikan notifikasi dan kembalikan form setelah 3 detik
    setTimeout(() => {
      form.reset(); // Kosongkan form
      if (btn) {
        btn.textContent = originalBtnText; // Kembalikan teks tombol
        btn.disabled = false; // Aktifkan tombol lagi
      }

      success.style.display = 'none';
      form.style.display = 'block';
      form.style.animation = 'fadeInUp 0.5s ease';
    }, 3000); // Tampil selama 3 detik

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
    
    card.innerHTML = `
      <div class="kegiatan-visual" style="background:${m.bg}">
        ${hasCustomImg 
          ? `<img src="${k.gambar}" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; const fb = this.nextElementSibling; if(fb) fb.style.display='flex';">
             <div class="svg-fallback" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${m.icon}</div>` 
          : m.icon}
      </div>
      <div class="kegiatan-card-body">
        <span class="kegiatan-cat">${m.label}</span>
        <h3>${escapeHtml(k.judul)}</h3>
        <p>${escapeHtml(k.deskripsi || '')}</p>
        <div class="kegiatan-meta">
          <span class="kegiatan-date">${escapeHtml(k.waktu || '-')}</span>
          <span class="kegiatan-date">${escapeHtml(k.lokasi || '-')}</span>
        </div>
      </div>
    `;
    
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
  renderPublicProfil();
  setTimeout(renderDynamicKegiatan, 300);
  setTimeout(renderDynamicArmada, 300);
});

if (typeof BroadcastChannel !== 'undefined') {
  const syncChannel = new BroadcastChannel('polair_sync');
  syncChannel.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'armada_updated') {
      renderDynamicArmada();
    }
    if (e.data && e.data.type === 'profil_updated') {
      renderPublicProfil();
    }
  });

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

// ── Render Semua Data Profil Publik ──────────────────────────
function renderPublicProfil() {
  if (typeof ProfilStore === 'undefined') return;
  const profil = ProfilStore.get();
  if (!profil) return;

  // -- Sejarah --
  if (profil.sejarah) {
    const sejarahEl = document.getElementById('publicSejarahText');
    if (sejarahEl) {
      // Pisah paragraf per baris kosong (\n\n) atau render satu blok
      const paras = profil.sejarah.split(/\n\n+/).filter(Boolean);
      if (paras.length > 1) {
        sejarahEl.innerHTML = paras.map(p => '<p>' + escapeHtml(p.trim()) + '</p>').join('');
      } else {
        // Satu paragraf — bagi per \n jadi <br>
        sejarahEl.innerHTML = '<p>' + escapeHtml(profil.sejarah.trim()).replace(/\n/g, '<br>') + '</p>';
      }
    }
    // Sembunyikan paragraf bawah statis saat ada data dinamis
    const bottom = document.getElementById('publicSejarahBottom');
    if (bottom) bottom.style.display = 'none';
  }

  // -- Quote --
  if (profil.quote) {
    const quoteEl = document.getElementById('publicQuote');
    if (quoteEl) quoteEl.textContent = '"' + profil.quote + '"';
  }

  // -- Visi --
  if (profil.visi) {
    const visiEl = document.getElementById('publicVisiText');
    if (visiEl) visiEl.textContent = '"' + profil.visi + '"';
  }

  // -- Misi --
  const misi = profil.misi;
  if (misi && misi.length > 0) {
    const misiEl = document.getElementById('publicMisiList');
    if (misiEl) {
      misiEl.innerHTML = misi.map(m => '<li>' + escapeHtml(m) + '</li>').join('');
    }
  }

  // -- Nilai --
  const nilai = profil.nilai;
  if (nilai && nilai.length > 0) {
    const nilaiEl = document.getElementById('publicNilaiList');
    if (nilaiEl) {
      nilaiEl.innerHTML = nilai.map(n => {
        const title = escapeHtml(n.title || '');
        const desc  = escapeHtml(n.desc  || '');
        return '<li><strong>' + title + '</strong>' + (desc ? ' — ' + desc : '') + '</li>';
      }).join('');
    }
  }

  // -- Tugas & Fungsi --
  const tugfung = profil.tugfung;
  if (tugfung && tugfung.length > 0) {
    const tugfungEl = document.getElementById('publicTugfungGrid');
    if (tugfungEl) {
      tugfungEl.innerHTML = tugfung.map(t => {
        return '<div class="tugfung-item">' +
          '<div><h4>' + escapeHtml(t.title || '') + '</h4>' +
          '<p>' + escapeHtml(t.desc || '') + '</p></div>' +
        '</div>';
      }).join('');
    }
  }

  // -- Kontak --
  const kontak = profil.kontak || {};

  if (kontak.telepon) {
    const tel = kontak.telepon;
    const telEl = document.getElementById('publicKontakTeleponText');
    if (telEl) telEl.textContent = tel + ' — Siaga 24 Jam';
    const telLink = document.getElementById('publicKontakTelepon');
    if (telLink) telLink.href = 'tel:' + tel.replace(/[^+\d]/g, '');
  }

  if (kontak.whatsapp) {
    const wa = kontak.whatsapp;
    const waEl = document.getElementById('publicKontakWaText');
    if (waEl) waEl.textContent = wa;
    const waLink = document.getElementById('publicKontakWa');
    if (waLink) {
      const waNum = wa.replace(/[^\d]/g, '');
      waLink.href = 'https://wa.me/62' + waNum.replace(/^0/, '');
    }
  }

  if (kontak.email) {
    const emailEl = document.getElementById('publicKontakEmailText');
    if (emailEl) emailEl.textContent = kontak.email;
    const emailLink = document.getElementById('publicKontakEmail');
    if (emailLink) emailLink.href = 'mailto:' + kontak.email;
  }

  if (kontak.alamat) {
    const alamatEl = document.getElementById('publicKontakAlamat');
    if (alamatEl) alamatEl.textContent = kontak.alamat;
  }
}

// ── Render Dynamic Armada Cards ───────────────────────────────
function renderDynamicArmada() {
  const grid = document.getElementById('armadaGrid') || document.querySelector('#armada .armada-grid');
  if (!grid) return;

  if (typeof ArmadaStore === 'undefined') {
    console.warn('ArmadaStore belum tersedia');
    return;
  }

  const armadas = ArmadaStore.all();
  if (!armadas || armadas.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-ship" style="font-size:2rem;margin-bottom:12px;display:block;"></i>Belum ada data armada.</div>';
    return;
  }

  grid.innerHTML = armadas.map(a => {
    const meta = ArmadaStore.kategoriMeta(a.kategori);
    const statusMeta = ArmadaStore.statusMeta(a.status);
    const hasCustomImg = a.gambar && a.gambar.trim() !== '';

    let defaultVisual = '';
    const katUpper = (a.kategori || '').toUpperCase();
    if (katUpper.includes('SAR')) {
      defaultVisual = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%">
        <rect x="10" y="115" width="300" height="50" rx="5" fill="#002060" stroke="rgba(0,180,216,0.5)" stroke-width="1.5"/>
        <rect x="50" y="75" width="220" height="42" rx="3" fill="#001540" stroke="rgba(0,180,216,0.4)" stroke-width="1"/>
        <rect x="90" y="40" width="140" height="37" rx="4" fill="#003087" stroke="rgba(0,180,216,0.6)" stroke-width="1.5"/>
        <rect x="100" y="48" width="30" height="20" rx="2" fill="rgba(0,200,255,0.7)"/>
        <rect x="138" y="48" width="30" height="20" rx="2" fill="rgba(0,200,255,0.6)"/>
        <rect x="176" y="48" width="30" height="20" rx="2" fill="rgba(0,200,255,0.7)"/>
        <line x1="160" y1="12" x2="160" y2="40" stroke="rgba(200,220,255,0.9)" stroke-width="2.5"/>
        <circle cx="160" cy="12" r="8" fill="none" stroke="rgba(0,180,216,0.7)" stroke-width="1.5" stroke-dasharray="3,2"/>
        <circle cx="160" cy="12" r="3" fill="rgba(0,180,216,0.9)"/>
        <rect x="55" y="80" width="22" height="22" rx="2" fill="rgba(255,100,50,0.6)" stroke="rgba(255,150,100,0.5)" stroke-width="1"/>
        <text x="66" y="95" font-family="Arial" font-size="9" fill="white" text-anchor="middle" font-weight="bold">SAR</text>
        <text x="160" y="148" font-family="Arial" font-size="9" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="3">POLISI</text>
        <path d="M0,135 Q80,128 160,133 Q240,138 320,135" stroke="rgba(0,180,216,0.3)" stroke-width="1.5" fill="none"/>
      </svg>`;
    } else if (katUpper.includes('RIGIT') || katUpper.includes('RIB') || katUpper.includes('RHIB')) {
      defaultVisual = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%">
        <path d="M30,120 L290,120 L310,135 L270,148 L50,148 L15,133 Z" fill="#002060" stroke="rgba(0,180,216,0.5)" stroke-width="1.5"/>
        <rect x="80" y="80" width="160" height="42" rx="3" fill="#001540" stroke="rgba(0,180,216,0.4)" stroke-width="1"/>
        <rect x="110" y="50" width="100" height="32" rx="3" fill="#003087" stroke="rgba(0,180,216,0.7)" stroke-width="2"/>
        <rect x="118" y="57" width="22" height="16" rx="2" fill="rgba(0,200,255,0.8)"/>
        <rect x="148" y="57" width="22" height="16" rx="2" fill="rgba(0,200,255,0.7)"/>
        <rect x="178" y="57" width="16" height="16" rx="2" fill="rgba(0,200,255,0.6)"/>
        <line x1="160" y1="18" x2="160" y2="50" stroke="rgba(200,220,255,0.8)" stroke-width="2"/>
        <rect x="110" y="45" width="48" height="6" rx="2" fill="rgba(0,0,255,0.7)"/>
        <rect x="160" y="45" width="50" height="6" rx="2" fill="rgba(255,30,30,0.7)"/>
        <text x="160" y="138" font-family="Arial" font-size="9" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="3">POLISI</text>
        <path d="M0,128 Q80,122 160,126 Q240,130 320,128" stroke="rgba(0,180,216,0.3)" stroke-width="1.5" fill="none"/>
      </svg>`;
    } else {
      defaultVisual = `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%">
        <rect x="20" y="120" width="280" height="45" rx="4" fill="#001a5e" stroke="rgba(0,180,216,0.5)" stroke-width="1.5"/>
        <rect x="70" y="80" width="180" height="42" rx="3" fill="#002060" stroke="rgba(0,180,216,0.4)" stroke-width="1"/>
        <rect x="100" y="45" width="120" height="37" rx="3" fill="#003087" stroke="rgba(0,180,216,0.6)" stroke-width="1.5"/>
        <rect x="115" y="55" width="25" height="18" rx="2" fill="rgba(0,180,216,0.7)"/>
        <rect x="148" y="55" width="25" height="18" rx="2" fill="rgba(0,180,216,0.6)"/>
        <rect x="181" y="55" width="25" height="18" rx="2" fill="rgba(0,180,216,0.7)"/>
        <line x1="160" y1="15" x2="160" y2="45" stroke="rgba(200,220,255,0.8)" stroke-width="2"/>
        <rect x="163" y="22" width="18" height="6" rx="1" fill="#CE1126"/>
        <rect x="163" y="28" width="18" height="6" rx="1" fill="#FFFFFF"/>
        <text x="160" y="152" font-family="Arial" font-size="10" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="3">POLISI</text>
        <path d="M0,140 Q50,132 120,138 Q200,144 320,140" stroke="rgba(0,180,216,0.3)" stroke-width="1.5" fill="none"/>
      </svg>`;
    }

    const visualHtml = hasCustomImg
      ? `<img src="${a.gambar}" alt="${escapeHtml(a.nama || a.kode)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"><div class="default-svg-fallback" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">${defaultVisual}</div>`
      : defaultVisual;

    const badgeBorderColor = meta.color || 'var(--accent)';

    return `
      <div class="kapal-card reveal">
        <div class="kapal-visual" style="background:${meta.visualBg}">
          ${visualHtml}
          <div class="kapal-badge" style="border-color:${badgeBorderColor};color:${badgeBorderColor};">${escapeHtml(a.kategori || 'KAPAL PATROLI')}</div>
        </div>
        <div class="kapal-info">
          <div class="kapal-name">${escapeHtml(a.nama || a.kode || 'Kapal Patroli')}</div>
          <div class="kapal-type">${escapeHtml(a.jenis || '-')}</div>
          <div class="kapal-specs">
            <div class="spec-item"><div class="spec-label">Panjang</div><div class="spec-value">${escapeHtml(a.panjang || '-')}</div></div>
            <div class="spec-item"><div class="spec-label">Kecepatan</div><div class="spec-value">${escapeHtml(a.kecepatan || '-')}</div></div>
            <div class="spec-item"><div class="spec-label">Kapasitas</div><div class="spec-value">${escapeHtml(a.kapasitas || '-')}</div></div>
            <div class="spec-item"><div class="spec-label">Status</div><div class="spec-value" style="color:${a.status === 'perbaikan' ? '#fbbf24' : '#4ade80'}">${statusMeta.label}</div></div>
          </div>
          <div class="kapal-divider"></div>
          <p class="kapal-fungsi">${escapeHtml(a.deskripsi || 'Armada operasional Satuan Polisi Air Polres Indramayu.')}</p>
        </div>
      </div>
    `;
  }).join('');

  if (typeof revealObserver !== 'undefined') {
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
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

// Otomatis scroll ke seksi tujuan saat berpindah dari halaman lain
window.addEventListener('load', function() {
  if (window.location.hash) {
    var target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(function() {
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Hapus hash (#kontak) dari URL agar saat di-refresh tidak dipaksa balik ke Kontak
        history.replaceState(null, null, window.location.pathname);
      }, 500);
    }
  }
});