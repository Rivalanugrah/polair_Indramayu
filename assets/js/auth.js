/* ============================================================
   POLAIR INDRAMAYU — auth.js
   Sistem login internal admin (tanpa registrasi).
   Kredensial default dibuat sekali di localStorage lalu
   bisa diganti sendiri oleh admin lewat menu Pengaturan Akun.

   Catatan: karena situs ini statis (tanpa server), penyimpanan
   kredensial memakai localStorage browser. Ini cukup untuk
   kebutuhan demo/akses internal 1 admin, tapi BUKAN pengamanan
   tingkat produksi (siapa pun yang membuka DevTools di device
   yang sama bisa melihatnya). Untuk produksi nyata, kredensial
   & sesi wajib divalidasi di server.
   ============================================================ */

'use strict';

const AUTH_KEY = 'polair_auth_v1';
const SESSION_KEY = 'polair_session_v1';

/* Kredensial default — SILAKAN diganti lewat menu
   "Pengaturan Akun" di Dashboard setelah login pertama kali. */
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'polairud2026'
};

function authGetCredentials() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    return Object.assign({}, DEFAULT_CREDENTIALS);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
    return Object.assign({}, DEFAULT_CREDENTIALS);
  }
}

/**
 * Mencoba login. Mengembalikan true/false.
 */
function authLogin(username, password) {
  const cred = authGetCredentials();
  const ok = username.trim() === cred.username && password === cred.password;
  if (ok) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username: cred.username,
      loginAt: new Date().toISOString()
    }));
  }
  return ok;
}

function authIsLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

function authCurrentUser() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function authLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'admin-login.html';
}

/**
 * Ganti username & password admin.
 * Mengembalikan { ok: boolean, message: string }
 */
function authChangeCredentials(currentPassword, newUsername, newPassword) {
  const cred = authGetCredentials();
  if (currentPassword !== cred.password) {
    return { ok: false, message: 'Password saat ini salah.' };
  }
  if (!newUsername || newUsername.trim().length < 3) {
    return { ok: false, message: 'Username baru minimal 3 karakter.' };
  }
  if (!newPassword || newPassword.length < 6) {
    return { ok: false, message: 'Password baru minimal 6 karakter.' };
  }
  const updated = { username: newUsername.trim(), password: newPassword };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
  // Perbarui sesi supaya nama user di topbar langsung ikut berubah
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    username: updated.username,
    loginAt: new Date().toISOString()
  }));
  return { ok: true, message: 'Username & password berhasil diperbarui.' };
}

/**
 * Wajib dipanggil paling atas di setiap halaman admin (kecuali admin-login.html).
 * Menendang ke halaman login jika belum ada sesi aktif.
 */
function authGuard() {
  if (!authIsLoggedIn()) {
    window.location.href = 'admin-login.html';
  }
}
