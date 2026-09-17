/* ============================================================
   POLAIR INDRAMAYU — db.js
   Lapisan data terpusat berbasis localStorage.
   Dipakai bersama oleh halaman PUBLIK dan halaman ADMIN,
   sehingga perubahan yang dibuat admin langsung tampil di sisi publik.

   Catatan penting:
   Website ini adalah situs statis (tanpa server/database sungguhan),
   sehingga "database" di sini disimulasikan memakai localStorage
   milik browser. Cocok untuk demo/skripsi/tugas kuliah & prototipe.
   Data tersimpan per-browser/per-device (bukan server terpusat).
   ============================================================ */

'use strict';

const DB_KEY = 'polair_db_v1';

/* ── Seed data awal (dipakai HANYA saat localStorage masih kosong) ── */
function getSeedData() {
  return {
    laporan: [
      {
        id: 'LPR-0001',
        ticketId: 'PLR-IND/2026/07/4821',
        nama: 'Budi Santoso',
        telepon: '0812-3456-7890',
        pekerjaan: 'Nelayan Karangsong / Saksi Mata',
        kategori: 'Orang Tenggelam (SAR)',
        waktuKejadian: '2026-09-15T13:45',
        lokasi: 'Perairan Karangsong, Indramayu',
        koordinat: '-6.333319, 108.339962',
        kronologi: 'Kapal nelayan terbalik dihantam ombak besar di perairan Karangsong. Membutuhkan evakuasi segera.',
        foto: [],
        status: 'menunggu',
        createdAt: '2026-09-15T13:45:00'
      },
      {
        id: 'LPR-0002',
        ticketId: 'PLR-IND/2026/09/3390',
        nama: 'Nelayan Lokal',
        telepon: '0813-1122-3344',
        pekerjaan: 'Nelayan',
        kategori: 'Dugaan Ilegal Fishing',
        waktuKejadian: '2026-09-14T09:10',
        lokasi: 'Perairan Eretan',
        koordinat: '-6.309000, 108.230000',
        kronologi: 'Terlihat kapal dengan alat tangkap terlarang beroperasi di perairan Eretan pada pagi hari.',
        foto: [],
        status: 'proses',
        createdAt: '2026-09-14T09:10:00'
      },
      {
        id: 'LPR-0003',
        ticketId: 'PLR-IND/2026/06/1187',
        nama: 'Anonim',
        telepon: '-',
        pekerjaan: '-',
        kategori: 'Cuaca Ekstrem / Gelombang Tinggi',
        waktuKejadian: '2026-09-12T16:30',
        lokasi: 'Perairan Balongan',
        koordinat: '-6.373000, 108.395000',
        kronologi: 'Gelombang tinggi mengakibatkan beberapa kapal nelayan kecil kesulitan kembali ke dermaga.',
        foto: [],
        status: 'selesai',
        createdAt: '2026-09-12T16:30:00'
      }
    ],
    armada: [
      { id: 'ARM-0001', kode: 'KP. VIII-1001', jenis: 'Kapal Patroli C3', kapasitas: '6 Personel', status: 'siap', deskripsi: '' },
      { id: 'ARM-0002', kode: 'Rigid Inflatable Boat (RIB)', jenis: 'Speedboat Taktis', kapasitas: '8 Personel', status: 'siap', deskripsi: '' },
      { id: 'ARM-0003', kode: 'KP. VIII-2005', jenis: 'Kapal Patroli C2', kapasitas: '4 Personel', status: 'perbaikan', deskripsi: '' }
    ],
    kegiatan: [],
    galeri: [],
    berita: [],
    pesan: [],
    profil: {
      visi: '',
      misi: ''
    }
  };
}

/* ── Baca seluruh database ── */
function dbRead() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seed = getSeedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('polair db: data korup, reset ke seed.', e);
    const seed = getSeedData();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
}

/* ── Simpan seluruh database ── */
function dbWrite(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

/* ── Helper generate ID unik per koleksi ── */
function dbNextId(prefix, list) {
  let max = 0;
  list.forEach(item => {
    const n = parseInt(String(item.id).split('-').pop(), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  const next = String(max + 1).padStart(4, '0');
  return `${prefix}-${next}`;
}

/* ================= LAPORAN DARURAT ================= */
const LaporanStore = {
  all() {
    return dbRead().laporan.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getById(id) {
    return dbRead().laporan.find(l => l.id === id) || null;
  },
  add(payload) {
    const data = dbRead();
    const id = dbNextId('LPR', data.laporan);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(0, 7).replace('-', '/');
    const ticketId = `PLR-IND/${dateCode}/${randomDigits}`;
    const item = Object.assign({
      id,
      ticketId,
      status: 'menunggu',
      createdAt: new Date().toISOString()
    }, payload);
    data.laporan.push(item);
    dbWrite(data);
    return item;
  },
  updateStatus(id, status) {
    const data = dbRead();
    const item = data.laporan.find(l => l.id === id);
    if (!item) return null;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    dbWrite(data);
    return item;
  },
  remove(id) {
    const data = dbRead();
    data.laporan = data.laporan.filter(l => l.id !== id);
    dbWrite(data);
  },
  /* label & kelas badge dipusatkan di sini supaya konsisten di semua halaman */
  statusMeta(status) {
    switch (status) {
      case 'proses':
        return { label: 'Dalam Proses', badgeClass: 'badge-warning', icon: 'fa-spinner' };
      case 'selesai':
        return { label: 'Selesai / Aman', badgeClass: 'badge-success', icon: 'fa-check-circle' };
      case 'menunggu':
      default:
        return { label: 'Menunggu Tim', badgeClass: 'badge-danger', icon: 'fa-triangle-exclamation' };
    }
  }
};

/* ================= ARMADA ================= */
const ArmadaStore = {
  all() { return dbRead().armada; },
  getById(id) { return dbRead().armada.find(a => a.id === id) || null; },
  add(payload) {
    const data = dbRead();
    const id = dbNextId('ARM', data.armada);
    const item = Object.assign({ id, status: 'siap' }, payload);
    data.armada.push(item);
    dbWrite(data);
    return item;
  },
  update(id, payload) {
    const data = dbRead();
    const item = data.armada.find(a => a.id === id);
    if (!item) return null;
    Object.assign(item, payload);
    dbWrite(data);
    return item;
  },
  remove(id) {
    const data = dbRead();
    data.armada = data.armada.filter(a => a.id !== id);
    dbWrite(data);
  },
  statusMeta(status) {
    return status === 'perbaikan'
      ? { label: 'Dalam Perbaikan', badgeClass: 'badge-warning' }
      : { label: 'Siap Operasi', badgeClass: 'badge-success' };
  }
};

/* ================= PESAN MASUK (kontak) ================= */
const PesanStore = {
  all() {
    return dbRead().pesan.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  add(payload) {
    const data = dbRead();
    const id = dbNextId('MSG', data.pesan);
    const item = Object.assign({ id, dibaca: false, createdAt: new Date().toISOString() }, payload);
    data.pesan.push(item);
    dbWrite(data);
    return item;
  },
  markRead(id) {
    const data = dbRead();
    const item = data.pesan.find(p => p.id === id);
    if (!item) return;
    item.dibaca = true;
    dbWrite(data);
  },
  remove(id) {
    const data = dbRead();
    data.pesan = data.pesan.filter(p => p.id !== id);
    dbWrite(data);
  }
};

/* Utilitas format tanggal Indonesia dipakai bersama */
function formatTanggalID(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB';
}
