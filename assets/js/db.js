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

/* Versi untuk cache-busting - ubah angka ini setiap ada update JS */
const JS_VERSION = '20260920';

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
      sejarah: `Satuan Polisi Air (POLAIR) Polisi Kabupaten Indramayu merupakan satuan fungsi Kepolisian Negara Republik Indonesia yang bertugas di wilayah perairan. Terbentuk seiring perkembangan kepolisian daerah untuk memenuhi kebutuhan pengamanan wilayah maritim Kabupaten Indramayu.

Kabupaten Indramayu memiliki garis pantai sepanjang ±147 km yang membentang dari timur ke barat, berbatasan langsung dengan Laut Jawa. Wilayah ini menjadi jalur vital pelayaran dan perikanan yang membutuhkan pengawasan intensif dari aparat kepolisian.

Dengan armada modern dan personel terlatih, POLAIR Indramayu terus berinovasi dalam memberikan pelayanan terbaik kepada masyarakat pesisir dan pelaut yang beroperasi di wilayah perairan Indramayu.`,
      quote: `POLAIR Indramayu berkomitmen untuk menjadi garda terdepan dalam menjaga keamanan, ketertiban, dan kesejahteraan masyarakat perairan Indramayu.`,
      visi: `Terwujudnya Satuan Polisi Air Polisi Kabupaten Indramayu yang Profesional, Modern, Terpercaya, dan Berwibawa dalam Mewujudkan Keamanan di Wilayah Perairan Indramayu guna Mendukung Pembangunan Daerah.`,
      misi: [
        "Melaksanakan patroli rutin di seluruh wilayah perairan Indramayu",
        "Menegakkan hukum di perairan secara tegas, adil, dan manusiawi",
        "Meningkatkan kapasitas SDM personel yang profesional dan berintegritas",
        "Membangun kemitraan dengan masyarakat nelayan dan pelaut",
        "Menyelenggarakan SAR dan penanggulangan bencana laut",
        "Melaksanakan sosialisasi keselamatan pelayaran kepada masyarakat",
        "Meningkatkan sarana-prasana armada dan peralatan modern"
      ],
      nilai: [
        { title: "Integritas", desc: "Jujur, berani, dan bertanggung jawab dalam setiap tindakan" },
        { title: "Profesionalisme", desc: "Kompeten, handal, dan terlatih dalam tugas kepolisian" },
        { title: "Kemanusiaan", desc: "Menjunjung hak asasi dan melayani dengan tulus" },
        { title: "Kepedulian", desc: "Peduli terhadap keselamatan masyarakat perairan" },
        { title: "Sinergi", desc: "Bekerja sama lintas instansi demi keamanan bersama" }
      ],
      tugfung: [
        { title: "Patroli Perairan", desc: "Patroli rutin di seluruh wilayah perairan untuk menjaga keamanan dan ketertiban" },
        { title: "Penegakan Hukum", desc: "Menindak pelanggaran hukum di perairan dan jalur pelayaran" },
        { title: "SAR Perairan", desc: "Operasi pencarian dan penyelamatan korban kecelakaan di laut" },
        { title: "Sosialisasi", desc: "Edukasi keselamatan pelayaran kepada nelayan dan masyarakat pesisir" },
        { title: "Penyelidikan", desc: "Penyelidikan kasus kejahatan dan kecelakaan di wilayah perairan" },
        { title: "Kemitraan", desc: "Koordinasi lintas instansi: TNI AL, KPLP, Basarnas, dan Dishub" }
      ],
      kontak: {
        telepon: "(0234) 201234",
        whatsapp: "0812-3456-7890",
        email: "polair.indramayu@polri.go.id",
        alamat: "Jl. Raya Pantai Karangsong, Indramayu, Jawa Barat 45214"
      },
      orgStructure: [
        { id: 'ORG-001', level: 1, jabatan: "Kepala Satuan (Kasat POLAIR)", nama: "-", pangkat: "AKBP / Kompol" },
        { id: 'ORG-002', level: 2, jabatan: "Wakil Kasatpolair", nama: "-", pangkat: "AKP" },
        { id: 'ORG-003', level: 2, jabatan: "Bagian Perencanaan (Bagren)", nama: "-", pangkat: "Pama / Bintara" },
        { id: 'ORG-004', level: 2, jabatan: "Bagian SDM & Anggaran (Bagsumda)", nama: "-", pangkat: "Pama / Bintara" },
        { id: 'ORG-005', level: 3, jabatan: "Satuan Patroli (Satrol)", nama: "-", pangkat: "Pama / Bintara" },
        { id: 'ORG-006', level: 3, jabatan: "Satuan Gakkum", nama: "-", pangkat: "Pama / Bintara" },
        { id: 'ORG-007', level: 3, jabatan: "Tim SAR & Rescue", nama: "-", pangkat: "Pama / Bintara" },
        { id: 'ORG-008', level: 3, jabatan: "Tim Teknisi Kapal", nama: "-", pangkat: "Bintara" }
      ]
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
const ARMADA_KEY = 'polair_armada_data';

function getArmadaSeedData() {
  return [
    {
      id: 'ARM-001',
      nama: 'KP Indramayu — I',
      kode: 'KP Indramayu — I',
      kategori: 'KAPAL PATROLI',
      jenis: 'Kapal Patroli Cepat',
      kapasitas: '12 Personel',
      panjang: '28 m',
      kecepatan: '25 knot',
      status: 'siap',
      deskripsi: 'Kapal patroli cepat untuk pengawasan dan penegakan hukum di wilayah perairan pantai utara Indramayu. Dilengkapi peralatan navigasi radar dan radio maritim.',
      gambar: ''
    },
    {
      id: 'ARM-002',
      nama: 'KP Rescue — II',
      kode: 'KP Rescue — II',
      kategori: 'SAR',
      jenis: 'Kapal SAR & Penyelamatan',
      kapasitas: '15 Personel',
      panjang: '22 m',
      kecepatan: '20 knot',
      status: 'siap',
      deskripsi: 'Kapal khusus operasi pencarian dan pertolongan (SAR) dilengkapi peralatan evakuasi medis darurat, perahu karet pendukung, dan perlengkapan selam.',
      gambar: ''
    },
    {
      id: 'ARM-003',
      nama: 'RHIB Falcon — III',
      kode: 'RHIB Falcon — III',
      kategori: 'RIGIT',
      jenis: 'Rigid Hull Inflatable Boat',
      kapasitas: '6 Personel',
      panjang: '8.5 m',
      kecepatan: '45 knot',
      status: 'siap',
      deskripsi: 'Perahu cepat interseptor taktis untuk respon darurat, pengejaran pelanggar hukum laut, dan manuver patroli di perairan dangkal serta muara sungai.',
      gambar: ''
    }
  ];
}

function getArmadaData() {
  const raw = localStorage.getItem(ARMADA_KEY);
  if (!raw) {
    const seed = getArmadaSeedData();
    localStorage.setItem(ARMADA_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = getArmadaSeedData();
      localStorage.setItem(ARMADA_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch (e) {
    const seed = getArmadaSeedData();
    localStorage.setItem(ARMADA_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveArmadaData(data) {
  localStorage.setItem(ARMADA_KEY, JSON.stringify(data));
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const ch = new BroadcastChannel('polair_sync');
      ch.postMessage({ type: 'armada_updated' });
    } catch (e) {}
  }
}

const ArmadaStore = {
  all() { return getArmadaData(); },
  getById(id) { return getArmadaData().find(a => a.id === id) || null; },
  add(payload) {
    const data = getArmadaData();
    const maxId = data.reduce((max, item) => {
      const num = parseInt(String(item.id).replace(/\D/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const id = 'ARM-' + String(maxId + 1).padStart(3, '0');
    const name = payload.kode || payload.nama || 'Kapal POLAIR';
    const item = Object.assign({
      id,
      nama: name,
      kode: name,
      kategori: payload.kategori || 'KAPAL PATROLI',
      jenis: payload.jenis || '-',
      kapasitas: payload.kapasitas || '-',
      panjang: payload.panjang || '-',
      kecepatan: payload.kecepatan || '-',
      status: payload.status || 'siap',
      deskripsi: payload.deskripsi || '',
      gambar: payload.gambar || payload.foto || ''
    }, payload, { id, nama: name, kode: name });
    data.push(item);
    saveArmadaData(data);
    return item;
  },
  update(id, payload) {
    const data = getArmadaData();
    const item = data.find(a => a.id === id);
    if (!item) return null;
    const name = payload.kode || payload.nama || item.nama || item.kode;
    Object.assign(item, payload, { nama: name, kode: name });
    item.updatedAt = new Date().toISOString();
    saveArmadaData(data);
    return item;
  },
  remove(id) {
    const data = getArmadaData().filter(a => a.id !== id);
    saveArmadaData(data);
  },
  statusMeta(status) {
    return status === 'perbaikan'
      ? { label: 'Dalam Perbaikan', badgeClass: 'badge-warning', icon: 'fa-wrench' }
      : { label: 'Siap Operasi', badgeClass: 'badge-success', icon: 'fa-check-circle' };
  },
  kategoriMeta(kategori) {
    const kat = (kategori || '').toUpperCase();
    if (kat.includes('SAR')) {
      return { label: 'SAR', badgeClass: 'badge-warning', color: '#f59e0b', visualBg: 'linear-gradient(135deg,#001540,#002070)' };
    } else if (kat.includes('RIGIT') || kat.includes('RIB') || kat.includes('RHIB')) {
      return { label: 'Rigit', badgeClass: 'badge-info', color: '#00b4d8', visualBg: 'linear-gradient(135deg,#0a1830,#001a5e)' };
    } else {
      return { label: 'Kapal Patroli', badgeClass: 'badge-primary', color: '#38bdf8', visualBg: 'linear-gradient(135deg,#001a5e,#003087)' };
    }
  }
};

const ArmadaDataStore = ArmadaStore;

/* ================= PESAN MASUK (kontak) ================= */
const PesanStore = {
  all() {
    return dbRead().pesan.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getById(id) {
    return dbRead().pesan.find(p => p.id === id) || null;
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

/* ================= ADMIN STORE (Akun Admin Tambahan) ================= */
const ADMIN_STORE_KEY = 'polair_admins_v1';

function getAdminSeedData() {
  return [];
}

function getAdminData() {
  const raw = localStorage.getItem(ADMIN_STORE_KEY);
  if (!raw) {
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(getAdminSeedData()));
    return getAdminSeedData();
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('polair admins: data korup, reset.', e);
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(getAdminSeedData()));
    return getAdminSeedData();
  }
}

function saveAdminData(data) {
  localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(data));
}

const AdminStore = {
  all() {
    return getAdminData();
  },
  add(payload) {
    const data = getAdminData();
    const id = 'ADM-' + Date.now();
    const item = Object.assign({
      id,
      createdAt: new Date().toISOString()
    }, payload);
    data.push(item);
    saveAdminData(data);
    return { ok: true, message: 'Akun admin baru berhasil ditambahkan.' };
  },
  remove(id) {
    const data = getAdminData().filter(a => a.id !== id);
    saveAdminData(data);
  }
};

/* ================= PROFIL STORE ================= */
const ProfilStore = {
  get() {
    const db = dbRead();
    // Pastikan struktur profil ada
    if (!db.profil || typeof db.profil !== 'object') {
      db.profil = getSeedData().profil;
      dbWrite(db);
    }
    return db.profil;
  },
  update(data) {
    const db = dbRead();
    db.profil = { ...db.profil, ...data };
    dbWrite(db);
    return db.profil;
  },
  getKontak() {
    const profil = this.get();
    return profil.kontak || { telepon: '', whatsapp: '', email: '', alamat: '' };
  },
  updateKontak(kontak) {
    const profil = this.get();
    profil.kontak = { ...profil.kontak, ...kontak };
    return this.update(profil);
  }
};

/* ================= KEGIATAN STORE ================= */
const KEGIATAN_KEY = 'polair_kegiatan_v1';

function getKegiatanSeedData() {
  return [
    {
      id: 'KEG-0001',
      judul: 'Patroli Rutin Perairan Pantai Utara',
      kategori: 'patroli',
      waktu: 'Rutin Harian',
      lokasi: 'Pantai Utara',
      deskripsi: 'Patroli harian di sepanjang pesisir pantai utara Indramayu untuk memantau aktivitas kapal nelayan dan keamanan umum.',
      gambar: '',
      createdAt: '2026-09-01T08:00:00'
    },
    {
      id: 'KEG-0002',
      judul: 'Operasi SAR Kapal Nelayan Tenggelam',
      kategori: 'sar',
      waktu: 'Sep 2026',
      lokasi: 'Perairan 12 mil',
      deskripsi: 'Tim SAR POLAIR berhasil menyelamatkan 7 nelayan yang mengalami kecelakaan kapal di perairan 12 mil dari pesisir Indramayu.',
      gambar: '',
      createdAt: '2026-09-15T14:30:00'
    },
    {
      id: 'KEG-0003',
      judul: 'Sosialisasi Keselamatan Nelayan',
      kategori: 'sosial',
      waktu: 'Agt 2026',
      lokasi: 'Karangsong',
      deskripsi: 'Program edukasi keselamatan pelayaran bagi 200 nelayan di Desa Karangsong — penggunaan jaket keselamatan dan prosedur darurat.',
      gambar: '',
      createdAt: '2026-08-20T10:00:00'
    },
    {
      id: 'KEG-0004',
      judul: 'Operasi Penertiban Kapal Ilegal',
      kategori: 'gakkum',
      waktu: 'Jul 2026',
      lokasi: 'ZEE Indramayu',
      deskripsi: 'Berhasil menertibkan 15 kapal tanpa dokumen lengkap dan menangkap 3 kapal asing yang melakukan illegal fishing di ZEE.',
      gambar: '',
      createdAt: '2026-07-10T06:00:00'
    },
    {
      id: 'KEG-0005',
      judul: 'Bakti Sosial Pesisir Pantai',
      kategori: 'sosial',
      waktu: 'Jun 2026',
      lokasi: 'Pesisir Indramayu',
      deskripsi: 'Kegiatan bakti sosial bersih pantai dan pembagian sembako kepada keluarga nelayan kurang mampu di Pesisir Indramayu.',
      gambar: '',
      createdAt: '2026-06-25T09:00:00'
    },
    {
      id: 'KEG-0006',
      judul: 'Patroli Malam Pengamanan Alur Pelayaran',
      kategori: 'patroli',
      waktu: 'Rutin Malam',
      lokasi: 'Alur Pelayaran',
      deskripsi: 'Patroli malam intensif di alur pelayaran utama untuk mencegah penyelundupan dan kejahatan laut pada malam hari.',
      gambar: '',
      createdAt: '2026-05-15T22:00:00'
    }
  ];
}

function getKegiatanData() {
  const raw = localStorage.getItem(KEGIATAN_KEY);
  if (!raw) {
    const seed = getKegiatanSeedData();
    localStorage.setItem(KEGIATAN_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('polair kegiatan: data korup, reset ke seed.', e);
    const seed = getKegiatanSeedData();
    localStorage.setItem(KEGIATAN_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveKegiatanData(data) {
  localStorage.setItem(KEGIATAN_KEY, JSON.stringify(data));
}

const KegiatanStore = {
  all() {
    return getKegiatanData().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getById(id) {
    return getKegiatanData().find(k => k.id === id) || null;
  },
  add(payload) {
    const data = getKegiatanData();
    const maxId = data.reduce((max, item) => {
      const num = parseInt(String(item.id).replace('KEG-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const id = 'KEG-' + String(maxId + 1).padStart(4, '0');
    const item = Object.assign({
      id,
      createdAt: new Date().toISOString()
    }, payload);
    data.push(item);
    saveKegiatanData(data);
    return item;
  },
  update(id, payload) {
    const data = getKegiatanData();
    const idx = data.findIndex(k => k.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
    saveKegiatanData(data);
    return data[idx];
  },
  remove(id) {
    const data = getKegiatanData().filter(k => k.id !== id);
    saveKegiatanData(data);
  },
  getByKategori(kategori) {
    if (!kategori || kategori === 'semua') return this.all();
    return this.all().filter(k => k.kategori === kategori);
  },
  kategoriMeta(kategori) {
    const metas = {
      patroli: { label: '🚢 Patroli', badgeClass: 'kat-patroli', color: '#3b82f6' },
      sar: { label: '🆘 SAR', badgeClass: 'kat-sar', color: '#f97316' },
      sosial: { label: '🤝 Sosial', badgeClass: 'kat-sosial', color: '#22c55e' },
      gakkum: { label: '⚖️ Gakkum', badgeClass: 'kat-gakkum', color: '#a855f7' }
    };
    return metas[kategori] || { label: kategori, badgeClass: '', color: '#94a3b8' };
  }
};

// Alias untuk kompatibilitas dengan halaman admin
const KegiatankStore = KegiatanStore;

/* ================= GALERI STORE ================= */
const GALERI_KEY = 'polair_galeri_v1';

function getGaleriSeedData() {
  return [
    {
      id: 'GAL-0001',
      judul: 'Patroli Fajar Pengamanan Alur Pelayaran Karangsong',
      kategori: 'patroli',
      tanggal: '2026-09-13',
      lokasi: 'Muara Karangsong',
      gambar: '',
      createdAt: '2026-09-13T06:00:00'
    },
    {
      id: 'GAL-0002',
      judul: 'Evakuasi Cepat Korban Terombang-imbing di Laut Jawa',
      kategori: 'sar',
      tanggal: '2026-09-11',
      lokasi: 'Perairan Utara Eretan',
      gambar: '',
      createdAt: '2026-09-11T14:30:00'
    },
    {
      id: 'GAL-0003',
      judul: 'Apel Gelar Kesiapsiagaan Operasi Pengamanan Perairan',
      kategori: 'personel',
      tanggal: '2026-09-08',
      lokasi: 'Dermaga Karangsong',
      gambar: '',
      createdAt: '2026-09-08T08:00:00'
    },
    {
      id: 'GAL-0004',
      judul: 'Uji Kecepatan & Manuver RHIB Falcon - III di Laut Lepas',
      kategori: 'armada',
      tanggal: '2026-09-05',
      lokasi: 'Perairan Karangsong',
      gambar: '',
      createdAt: '2026-09-05T10:00:00'
    },
    {
      id: 'GAL-0005',
      judul: 'Edukasi Keselamatan Berlayar dan Pembagian Jaket Pelampung',
      kategori: 'sosial',
      tanggal: '2026-09-02',
      lokasi: 'TPI Karangsong',
      gambar: '',
      createdAt: '2026-09-02T09:00:00'
    },
    {
      id: 'GAL-0006',
      judul: 'Simulasi Penanggulangan Kebakaran Kapal dan Tanggap Bencana',
      kategori: 'personel',
      tanggal: '2026-08-29',
      lokasi: 'Kolam Pelabuhan',
      gambar: '',
      createdAt: '2026-08-29T14:00:00'
    }
  ];
}

function getGaleriData() {
  const raw = localStorage.getItem(GALERI_KEY);
  if (!raw) {
    const seed = getGaleriSeedData();
    localStorage.setItem(GALERI_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('polair galeri: data korup, reset ke seed.', e);
    const seed = getGaleriSeedData();
    localStorage.setItem(GALERI_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveGaleriData(data) {
  localStorage.setItem(GALERI_KEY, JSON.stringify(data));
}

const GaleriStore = {
  all() {
    return getGaleriData().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getById(id) {
    return getGaleriData().find(g => g.id === id) || null;
  },
  add(payload) {
    const data = getGaleriData();
    const maxId = data.reduce((max, item) => {
      const num = parseInt(String(item.id).replace('GAL-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const id = 'GAL-' + String(maxId + 1).padStart(4, '0');
    const item = Object.assign({
      id,
      createdAt: new Date().toISOString()
    }, payload);
    data.push(item);
    saveGaleriData(data);
    return item;
  },
  update(id, payload) {
    const data = getGaleriData();
    const idx = data.findIndex(g => g.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...payload, updatedAt: new Date().toISOString() };
    saveGaleriData(data);
    return data[idx];
  },
  remove(id) {
    const data = getGaleriData().filter(g => g.id !== id);
    saveGaleriData(data);
  },
  getByKategori(kategori) {
    if (!kategori || kategori === 'semua') return this.all();
    return this.all().filter(g => g.kategori === kategori);
  },
  kategoriMeta(kategori) {
    const metas = {
      patroli: { label: 'Patroli Laut', badgeClass: 'kat-patroli', badgeColor: '#3b82f6' },
      sar: { label: 'Misi SAR', badgeClass: 'kat-sar', badgeColor: '#f97316' },
      armada: { label: 'Kapal Armada', badgeClass: 'kat-armada', badgeColor: '#00b4d8' },
      sosial: { label: 'Bakti Sosial', badgeClass: 'kat-sosial', badgeColor: '#22c55e' },
      personel: { label: 'Personel & Latihan', badgeClass: 'kat-personel', badgeColor: '#a855f7' }
    };
    return metas[kategori] || { label: kategori, badgeClass: '', badgeColor: '#94a3b8' };
  }
};

/* ================= ORGANIZATION STRUCTURE STORE ================= */
const OrgStore = {
  getAll() {
    const profil = ProfilStore.get();
    if (!profil.orgStructure || !Array.isArray(profil.orgStructure)) {
      profil.orgStructure = getSeedData().profil.orgStructure;
      ProfilStore.update(profil);
    }
    return profil.orgStructure;
  },
  getById(id) {
    return this.getAll().find(o => o.id === id) || null;
  },
  add(payload) {
    const profil = ProfilStore.get();
    const existing = profil.orgStructure || [];
    const maxId = existing.reduce((max, o) => {
      const n = parseInt(o.id.replace('ORG-', ''), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const id = 'ORG-' + String(maxId + 1).padStart(3, '0');
    const newItem = { id, ...payload };
    profil.orgStructure = [...existing, newItem];
    ProfilStore.update(profil);
    return newItem;
  },
  update(id, payload) {
    const profil = ProfilStore.get();
    const idx = profil.orgStructure.findIndex(o => o.id === id);
    if (idx === -1) return null;
    profil.orgStructure[idx] = { ...profil.orgStructure[idx], ...payload };
    ProfilStore.update(profil);
    return profil.orgStructure[idx];
  },
  remove(id) {
    const profil = ProfilStore.get();
    profil.orgStructure = (profil.orgStructure || []).filter(o => o.id !== id);
    ProfilStore.update(profil);
  }
};
