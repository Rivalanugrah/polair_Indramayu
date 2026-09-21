/* ============================================================
   POLAIR INDRAMAYU — admin-shell.js
   Menyuntikkan sidebar & topbar admin yang SAMA persis di semua
   halaman admin, supaya style/menu/link tidak pernah berbeda
   antar halaman. Setiap halaman admin cukup punya:

     <body data-page="armada">
       <div id="admin-sidebar-mount"></div>
       <main class="admin-main">
         <div id="admin-topbar-mount"></div>
         <section class="admin-content"> ...konten halaman... </section>
       </main>
     </body>

   data-page menentukan menu mana yang aktif. Nilai valid:
   dashboard | profil | armada | kegiatan | galeri | pesan | lapor
   ============================================================ */

'use strict';

const ADMIN_MENU = [
  { key: 'dashboard', href: 'admin-dashboard.html', icon: 'fa-house', label: 'Dashboard' },
  { key: 'profil', href: 'admin-profil.html', icon: 'fa-building', label: 'Kelola Profil' },
  { key: 'armada', href: 'admin-armada.html', icon: 'fa-ship', label: 'Kelola Armada' },
  { key: 'kegiatan', href: 'admin-kegiatan.html', icon: 'fa-calendar-days', label: 'Kelola Kegiatan' },
  { key: 'galeri', href: 'admin-galeri.html', icon: 'fa-images', label: 'Kelola Galeri' },
  { key: 'pesan', href: 'admin-pesan.html', icon: 'fa-envelope', label: 'Pesan Masuk' },
  { key: 'lapor', href: 'admin-lapor.html', icon: 'fa-triangle-exclamation', label: 'Lapor Darurat', danger: true }
];

function renderAdminSidebar(activeKey) {
  const user = authCurrentUser();
  const uname = user ? user.username : 'admin';

  const items = ADMIN_MENU.map(m => {
    const active = m.key === activeKey ? ' active' : '';
    const dangerIcon = m.danger ? ' style="color:#ef4444"' : '';
    return `<li><a href="${m.href}" class="${active.trim()}"><i class="fas ${m.icon}"${dangerIcon}></i> ${m.label}</a></li>`;
  }).join('');

  return `
    <div class="admin-logo"><i class="fas fa-water"></i><h2>ADMIN POLAIR</h2></div>
    <div class="admin-user-badge">
      <i class="fas fa-circle-user"></i>
      <div>
        <span class="u-name">${uname}</span>
        <span class="u-role">Administrator</span>
      </div>
    </div>
    <ul class="admin-menu">
      ${items}
      <li class="admin-menu-divider"></li>
      <li><a href="admin-pengaturan.html" class="${activeKey === 'pengaturan' ? 'active' : ''}"><i class="fas fa-gear"></i> Pengaturan Akun</a></li>
    </ul>
    <button class="admin-logout-btn" onclick="if(confirm('Keluar dari Admin Panel?')) authLogout();">
      <i class="fas fa-right-from-bracket"></i> Keluar
    </button>
  `;
}

function renderAdminTopbar(title) {
  return `
    <button class="admin-mobile-toggle" onclick="document.getElementById('admin-sidebar-mount').parentElement.classList.toggle('open')" aria-label="Buka menu">
      <i class="fas fa-bars"></i>
    </button>
    <h3>${title}</h3>
    <a href="../index.html" class="back-link" target="_blank" rel="noopener">
      <i class="fas fa-arrow-up-right-from-square"></i> Lihat Website
    </a>
  `;
}

/**
 * Dipanggil di setiap halaman admin setelah DOM siap.
 * pageTitle: judul yang tampil di header kanan atas.
 */
function initAdminShell(pageTitle) {
  authGuard(); // tendang ke login kalau belum ada sesi

  document.body.classList.add('admin-body');
  const activeKey = document.body.dataset.page || '';

  const sidebarMount = document.getElementById('admin-sidebar-mount');
  const topbarMount = document.getElementById('admin-topbar-mount');

  if (sidebarMount) {
    sidebarMount.outerHTML = `<aside class="admin-sidebar" id="admin-sidebar-mount">${renderAdminSidebar(activeKey)}</aside>`;
  }
  if (topbarMount) {
    topbarMount.outerHTML = `<header class="admin-header" id="admin-topbar-mount">${renderAdminTopbar(pageTitle)}</header>`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const title = document.body.dataset.title || 'Admin Panel';
  initAdminShell(title);
});
