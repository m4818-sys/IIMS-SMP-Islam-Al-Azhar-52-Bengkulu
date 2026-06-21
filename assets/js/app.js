/**
 * =========================================================
 * IIMS - FRONTEND LOGIC (VANILLA JS)
 * Developer: Renaldi
 * Architecture: SPA / Enterprise Dashboard (Edisi Spesial Akses OSIS)
 * =========================================================
 */

// ==========================================
// CONFIGURATION API
// ==========================================
const GAS_URL = "PASTE_GAS_WEBAPP_URL_HERE"; 

// ==========================================
// STATE MANAGEMENT
// ==========================================
const AppState = {
    user: null, 
    currentView: 'login'
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const DOM = {
    viewLogin: document.getElementById('view-login'),
    viewApp: document.getElementById('view-app'),
    routerView: document.getElementById('router-view'),
    formLogin: document.getElementById('form-login'),
    btnLogout: document.getElementById('btn-logout'),
    sidebar: document.getElementById('sidebar'),
    navMenus: document.getElementById('nav-menus'),
    toggleSidebar: document.getElementById('toggle-sidebar'),
    userGreeting: document.getElementById('user-greeting'),
    userRoleBadge: document.getElementById('user-role-badge'),
    loader: document.getElementById('loading-overlay')
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    setupEventListeners();
});

function setupEventListeners() {
    if (DOM.formLogin) DOM.formLogin.addEventListener('submit', handleLogin);
    if (DOM.btnLogout) DOM.btnLogout.addEventListener('click', handleLogout);
    if (DOM.toggleSidebar) {
        DOM.toggleSidebar.addEventListener('click', () => {
            DOM.sidebar.classList.toggle('show');
        });
    }
}

// ==========================================
// API HELPER
// ==========================================
async function callAPI(action, payload = {}) {
    showLoader();
    try {
        const bodyData = {
            action: action,
            payload: payload,
            token: AppState.user ? AppState.user.TOKEN : null
        };

        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(bodyData)
        });
        
        const data = await response.json();
        hideLoader();
        return data;
    } catch (error) {
        hideLoader();
        console.error("API Error:", error);
        return mockAPIResponse(action, payload);
    }
}

function showLoader() { if(DOM.loader) { DOM.loader.classList.remove('d-none'); DOM.loader.classList.add('d-flex'); } }
function hideLoader() { if(DOM.loader) { DOM.loader.classList.add('d-none'); DOM.loader.classList.remove('d-flex'); } }

// ==========================================
// AUTHENTICATION
// ==========================================
function checkSession() {
    const savedSession = localStorage.getItem('IIMS_SESSION');
    if (savedSession) {
        AppState.user = JSON.parse(savedSession);
        initializeApp();
    } else {
        showLoginView();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const res = await mockAPIResponse("login", { username, password });
    
    if (res.success) {
        AppState.user = res.data;
        if(!AppState.user.TOKEN) AppState.user.TOKEN = "mock-token-123"; 
        localStorage.setItem('IIMS_SESSION', JSON.stringify(AppState.user));
        document.getElementById('password').value = '';
        initializeApp();
    } else {
        alert("Login Gagal: " + res.message);
    }
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('IIMS_SESSION');
    AppState.user = null;
    showLoginView();
}

// ==========================================
// UI ROUTING & RENDERING
// ==========================================
function showLoginView() {
    DOM.viewLogin.classList.remove('d-none');
    DOM.viewApp.classList.add('d-none');
}

function initializeApp() {
    DOM.viewLogin.classList.add('d-none');
    DOM.viewApp.classList.remove('d-none');
    
    renderHeader();
    renderSidebar();
    loadView('dashboard');
}

function renderHeader() {
    const user = AppState.user || {};
    const role = user.ROLE || "GURU";
    const nama = user.NAMA || user.USERNAME || "Pengguna";
    const jk = user.JENIS_KELAMIN || "Laki-laki";

    let title = "Bapak/Ibu";
    if (role === "AYAH_BUNDA") {
        DOM.userGreeting.innerHTML = `Selamat Datang, <span class="text-primary-azhar">Ayah/Bunda dari Ananda M. Fatih</span>`;
        DOM.userRoleBadge.innerText = 'WALI MURID';
        return;
    } else if (role === "OSIS") {
        title = "Kakak / Pengurus";
    } else if (role.includes("GURU") || role === "ADMIN") {
        title = jk === "Perempuan" ? "Ustadzah" : "Ustadz";
    } else if (role === "KEPSEK") {
        title = "Bapak";
    }

    DOM.userGreeting.innerHTML = `Selamat Datang, <span class="text-primary-azhar">${title} ${nama.split(' ')[0]}</span>`;
    DOM.userRoleBadge.innerText = role ? role.replace('_', ' ') : '-';
}

// ==========================================
// DYNAMIC SIDEBAR MENUS
// ==========================================
const MENU_STRUCTURE = {
    ADMIN: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'data-guru', icon: 'fa-chalkboard-teacher', text: 'Data Guru' },
        { id: 'data-murid', icon: 'fa-user-graduate', text: 'Data Murid' },
        { id: 'penempatan', icon: 'fa-door-open', text: 'Penempatan Kelas' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Cetak Raport & Sertifikat' }
    ],
    KEPSEK: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Global' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Validasi & Cetak Berkas' }
    ],
    GURU: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Kelas' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Murid' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Catatan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-invoice', text: 'Lihat Dokumen Kelas' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Tahfidz' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Input Setoran' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Cetak Raport & Sertifikat' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Ananda' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Perkembangan Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Perkembangan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban Ananda' },
        { id: 'dokumen', icon: 'fa-file-invoice', text: 'Raport & Sertifikat Ananda' }
    ],
    OSIS: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Petugas OSIS' },
        { id: 'pembinaan', icon: 'fa-pen-to-square', text: 'Input Catatan Pelanggaran' }
    ]
};

function renderSidebar() {
    const role = AppState.user.ROLE || "GURU";
    let menus = [...(MENU_STRUCTURE[role] || MENU_STRUCTURE.GURU)];

    if ((role === "GURU" || role === "OSIS") && AppState.user.JENIS_KELAMIN === "Perempuan") {
        menus.push({ id: 'keputrian', icon: 'fa-person-dress', text: 'Input Absensi Keputrian' });
    }

    let html = '';
    menus.forEach(m => {
        html += `
            <a href="#" class="nav-link nav-menu-item" data-target="${m.id}">
                <i class="fas ${m.icon} me-2"></i> ${m.text}
            </a>
        `;
    });

    DOM.navMenus.innerHTML = html;

    document.querySelectorAll('.nav-menu-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('data-target');
            document.querySelectorAll('.nav-menu-item').forEach(n => n.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            if(window.innerWidth < 992) DOM.sidebar.classList.remove('show');
            loadView(target);
        });
    });

    const firstMenu = document.querySelector('.nav-menu-item');
    if (firstMenu) firstMenu.classList.add('active');
}

// ==========================================
// VIEW HANDLER (DYNAMIC INNER ROUTER)
// ==========================================
async function loadView(viewId) {
    AppState.currentView = viewId;
    DOM.routerView.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-gold"></div></div>';

    if (viewId === 'dashboard') {
        const role = AppState.user.ROLE;
        if (role === 'ADMIN') await renderAdminDashboard();
        else if (role === 'KEPSEK') await renderKepsekDashboard();
        else if (role === 'AYAH_BUNDA') await renderAyahBundaDashboard();
        else if (role === 'OSIS') await renderOsisDashboard();
        else await renderGuruDashboard();
    } else if (viewId === 'dokumen') {
        await renderDokumenView();
    } else {
        DOM.routerView.innerHTML = `
            ${createMutiaraStatisHTML()}
            <div class="card-enterprise p-5 text-center mt-4">
                <i class="fas fa-edit fa-4x text-muted mb-3 opacity-50"></i>
                <h3 class="font-poppins text-primary-azhar">Formulir Entri ${viewId.toUpperCase().replace('-', ' ')}</h3>
                <p class="text-muted mb-4">Form pelaporan berbasis Google Form / GAS ini siap diintegrasikan penuh oleh tim pengembang besok.</p>
                <button class="btn btn-primary-azhar btn-sm" onclick="loadView('dashboard')"><i class="fas fa-arrow-left me-2"></i>Kembali ke Dashboard</button>
            </div>
            ${createFooterHTML()}
        `;
    }
}

// --- MUTIARA ISLAMI STATIS ---
function createMutiaraStatisHTML() {
    return `
        <div class="p-3 px-4 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center" style="background-color: #ffffff; font-size: 14px; border-left: 4px solid #0A3663; line-height: 1.6;">
            <i class="fas fa-quote-left text-primary-azhar me-3 fa-lg opacity-70"></i>
            <span class="fw-medium">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari). Jagalah adab dan kejujuranmu dalam menuntut ilmu.</span>
        </div>
    `;
}

// --- WIDGET MONITORING ADAB & KEPUTRIAN (UNTUK GURU/ADMIN) ---
function createAdabDanKeputrianWidgetHTML() {
    return `
        <div class="card-enterprise p-4 h-100">
            <h6 class="font-poppins fw-bold mb-3 text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Laporan Adab & Pembinaan</h6>
            <div class="font-inter small mb-4">
                <div class="p-2 border-bottom mb-2 bg-light rounded" style="border-left: 3px solid #dc3545 !important;">
                    <span class="d-block fw-bold text-dark">Zaky (9A) - Terlambat Shalat Berjamaah</span>
                    <small class="text-muted">Hari ini • Petugas OSIS</small>
                </div>
                <div class="p-2 bg-light rounded" style="border-left: 3px solid #dc3545 !important;">
                    <span class="d-block fw-bold text-dark">Raihan (7C) - Gadget Tidak Dikumpulkan</span>
                    <small class="text-muted">Kemarin • Wali Kelas</small>
                </div>
            </div>

            <h6 class="font-poppins fw-bold mb-3 text-primary-azhar"><i class="fas fa-person-dress me-2"></i>Alasan & Izin Keputrian Terbaru</h6>
            <div class="font-inter small">
                <div class="p-2 border-bottom mb-2 bg-light rounded" style="border-left: 3px solid #0A3663 !important;">
                    <span class="d-block fw-bold text-dark">Siti Aminah (8B) - Izin Sakit di UKS</span>
                    <small class="text-muted">Pekan ini • Berhalangan</small>
                </div>
                <div class="p-2 bg-light rounded" style="border-left: 3px solid #0A3663 !important;">
                    <span class="d-block fw-bold text-dark">Fatmawati (9C) - Alasan Nyeri Haid</span>
                    <small class="text-muted">Pekan ini • Validasi Ustadzah</small>
                </div>
            </div>
        </div>
    `;
}

// --- TEMPLATE: FOOTER STATIC ---
function createFooterHTML() {
    return `
        <div class="text-center py-4 mt-5 border-top font-inter small text-muted" style="clear: both; position: relative;">
            Developed & Maintained by <span class="fw-bold text-primary-azhar">Renaldi</span> <br>
            <span class="opacity-70">© 2026 Integrated Islamic Monitoring System (IIMS) • SMP Islam Al-Azhar 52 Bengkulu. All Rights Reserved.</span>
        </div>
    `;
}

// --- TEMPLATE: OSIS DASHBOARD ---
async function renderOsisDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Panel Kerja Pengurus OSIS</h4>
        <p class="text-muted small font-inter mb-4">Hak akses akun Anda dikonfigurasi sebagai <span class="badge bg-secondary">Petugas Lapangan (Input Only)</span>.</p>
        
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card-enterprise p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center border-top border-4 border-danger">
                    <i class="fas fa-clock fa-3x text-danger mb-3"></i>
                    <h5 class="font-poppins fw-bold">Pencatatan Pelanggaran Harian</h5>
                    <button class="btn btn-danger btn-sm px-4 mt-2" onclick="loadView('pembinaan')"><i class="fas fa-plus me-2"></i>Mulai Input Data</button>
                </div>
            </div>
            <div class="col-md-6">
                ${createAdabDanKeputrianWidgetHTML()}
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: ADMIN DASHBOARD ---
async function renderAdminDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Sistem Pemantauan Utama Admin</h4>
        <div class="row g-3 mb-4">
            ${createCard('TOTAL MURID', '420', 'fa-users', 'bg-primary text-white')}
            ${createCard('TOTAL GURU', '35', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TOTAL SETORAN', '1.250', 'fa-quran', 'bg-info text-white')}
            ${createCard('SURAH SELESAI', '320', 'fa-check-double', 'bg-success text-white')}
            ${createCard('BERHALANGAN', '12', 'fa-calendar-minus', 'bg-danger text-white')}
            ${createCard('PEMBINAAN ADAB', '5', 'fa-heart-circle-exclamation', 'bg-warning text-dark')}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-chart-bar text-primary-azhar me-2"></i>Grafik Perkembangan Hafalan</h6>
                    <div style="position: relative; height:250px; width:100%;">
                        <canvas id="chartTahfidz"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                ${createAdabDanKeputrianWidgetHTML()}
            </div>
        </div>
        ${createFooterHTML()}
    `;
    setTimeout(() => {
        initBarChart('chartTahfidz', ['Kelas VII', 'Kelas VIII', 'Kelas IX'], [1.2, 2.5, 4.1]);
    }, 50);
}

// --- TEMPLATE: GURU DASHBOARD ---
async function renderGuruDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Ruang Kelas & Binaan Wali Kelas</h4>
        <div class="row g-3 mb-4">
            ${createCard('MURID BINAAN', '32', 'fa-user-graduate', 'bg-primary text-white')}
            ${createCard('SETORAN MINGGU INI', '28', 'fa-book-open', 'bg-success text-white')}
            ${createCard('CATATAN ADAB KELAS', '2', 'fa-exclamation-triangle', 'bg-warning text-dark')}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-table me-2 text-primary-azhar"></i>Daftar Setoran Aktif Murid Kelas</h6>
                    <div class="table-responsive">
                        <table class="table table-hover font-inter align-middle small">
                            <thead class="table-light">
                                <tr><th>Nama Murid</th><th>Surah Aktif</th><th>Ayat</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Abdullah</td><td>An-Naba</td><td>1-15</td><td><span class="badge bg-success">Lancar</span></td></tr>
                                <tr><td>Aisyah Humaira</td><td>Abasa</td><td>1-42</td><td><span class="badge bg-primary">Selesai</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                ${createAdabDanKeputrianWidgetHTML()}
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: KEPSEK DASHBOARD ---
async function renderKepsekDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Dashboard Monitoring Kepala Sekolah</h4>
        <div class="row g-3 mb-4">
            ${createCard('TOTAL GURU AKTIF', '35', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TARGET GLOBAL TAHFIDZ', '85%', 'fa-star', 'bg-primary text-white')}
            ${createCard('BERKAS VALIDASI', '12', 'fa-file-signature', 'bg-danger text-white')}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-user-shield text-primary-azhar me-2"></i>Data Guru & Kelas Pengampu</h6>
                    <div class="table-responsive">
                        <table class="table table-hover font-inter align-middle small">
                            <thead class="table-light">
                                <tr><th>Nama Guru/Ustadz</th><th>Tugas Kelompok</th><th>Status Input</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Ustadz Syam Al-Hafizh</td><td>Koordinator Keagamaan</td><td><span class="badge bg-success">Lengkap</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                ${createAdabDanKeputrianWidgetHTML()}
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: REVISI JUARA AYAH BUNDA DASHBOARD ---
async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        
        <!-- Banner Identitas Ananda Terbaca Jelas -->
        <div class="card-enterprise p-4 mb-4 bg-primary-azhar text-white shadow-sm">
            <div class="d-flex align-items-center">
                <div class="bg-white text-primary-azhar rounded-circle d-flex justify-content-center align-items-center me-4" style="width: 55px; height: 55px;">
                    <i class="fas fa-user-graduate fa-lg"></i>
                </div>
                <div>
                    <h4 class="font-poppins fw-bold mb-1" style="font-size: 18px;">Profil Akun Santri: Muhammad Fatih</h4>
                    <p class="mb-0 text-gold font-inter small fw-medium">Kelas VIII - Abu Bakar • NIS: 1023412 • Wali Kelas: Ustadz Renaldi</p>
                </div>
            </div>
        </div>

        <!-- 4 Kartu Monitor Atas (Mengisi Kekosongan Layar) -->
        <div class="row g-3 mb-4">
            ${createCard('TOTAL HAFALAN', '4.2 Juz', 'fa-book-quran', 'bg-primary text-white')}
            ${createCard('KURBAN REKREASI', 'Rp2.100.000', 'fa-cow', 'bg-success text-white')}
            ${createCard('ABSENSI / SAKIT', '0 Hari', 'fa-calendar-check', 'bg-info text-white')}
            ${createCard('CATATAN PELANGGARAN', 'Bersih ✨', 'fa-heart', 'bg-warning text-dark')}
        </div>

        <div class="row g-4 mb-4">
            <!-- Sisi Kiri: Detail Progres Riwayat Hafalan -->
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3 text-primary-azhar"><i class="fas fa-history me-2"></i>Riwayat Setoran Hafalan Terakhir</h6>
                    <div class="table-responsive">
                        <table class="table table-hover font-inter align-middle small">
                            <thead class="table-light text-center">
                                <tr><th>Tanggal</th><th class="text-start">Surah & Ayat</th><th>Nilai Adab Hafalan</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="text-center">22/06/2026</td><td class="fw-bold">Al-Muthaffifin: 1 - 12</td><td class="text-center">A (Mumtaz)</td><td class="text-center"><span class="badge bg-success">Lancar</span></td></tr>
                                <tr><td class="text-center">15/06/2026</td><td class="fw-bold">Al-Infitar: 1 - 19</td><td class="text-center">B+ (Jayyid Jiddan)</td><td class="text-center"><span class="badge bg-primary">Selesai</span></td></tr>
                                <tr><td class="text-center">08/06/2026</td><td class="fw-bold">At-Takwir: 1 - 29</td><td class="text-center">A (Mumtaz)</td><td class="text-center"><span class="badge bg-primary">Selesai</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Sisi Kanan (Area Kursor Kosong): Mengisi Slot Kosong dengan Progres Tabungan Kurban -->
            <div class="col-lg-4">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-success">
                    <h6 class="font-poppins fw-bold mb-3 text-success"><i class="fas fa-wallet me-2"></i>Rincian Tabungan Kurban Ananda</h6>
                    <div class="p-3 bg-light rounded mb-3 font-inter">
                        <div class="d-flex justify-content-between mb-1 small text-muted">
                            <span>Dana Terkumpul:</span>
                            <span class="fw-bold text-success">Rp2.100.000</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 small text-muted">
                            <span>Target Minimum kurban:</span>
                            <span>Rp3.500.000</span>
                        </div>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 60%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="text-end mt-1" style="font-size: 11px;"><span class="text-success fw-bold">60%</span> Terpenuhi</div>
                    </div>
                    
                    <h6 class="font-poppins fw-bold mb-2 text-dark small"><i class="fas fa-info-circle me-1 text-muted"></i>Catatan Pembinaan Karakter</h6>
                    <p class="font-inter text-muted mb-0" style="font-size: 12px; line-height: 1.5;">Alhamdulillah, pekan ini Ananda tertib mengikuti shalat berjamaah tepat waktu dan aktif menjaga kebersihan asrama.</p>
                </div>
            </div>
        </div>

        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: PUSAT DOKUMEN ---
async function renderDokumenView() {
    const role = AppState.user.ROLE || "GURU";
    const canPrint = (role === 'ADMIN' || role === 'KEPSEK' || role === 'GURU_TAHFIDZ');

    let actionButtonsHTML = canPrint ? `
        <button class="btn btn-sm btn-outline-primary mb-1 me-1" onclick="alert('Membuka Preview...')"><i class="fas fa-eye"></i> Tinjau</button>
        <button class="btn btn-sm btn-success mb-1" onclick="alert('Mencetak...')"><i class="fas fa-print"></i> Cetak</button>
    ` : `
        <button class="btn btn-sm btn-outline-primary w-100" onclick="alert('Membuka PDF...')"><i class="fas fa-file-pdf"></i> Tinjau Raport</button>
    `;

    let actionSertifikatHTML = canPrint ? `
        <button class="btn btn-sm btn-outline-success mb-1 me-1" onclick="alert('Membuka Preview...')"><i class="fas fa-eye"></i> Tinjau</button>
        <button class="btn btn-sm btn-gold mb-1" onclick="alert('Mencetak...')"><i class="fas fa-print"></i> Cetak</button>
    ` : `
        <button class="btn btn-sm btn-outline-success w-100" onclick="alert('Membuka Sertifikat...')"><i class="fas fa-award"></i> Tinjau Sertifikat</button>
    `;

    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Arsip Raport & Sertifikat Santri</h4>
        <div class="card-enterprise p-4">
            <div class="table-responsive">
                <table class="table table-hover font-inter align-middle small text-center">
                    <thead class="table-light">
                        <tr><th>NIS</th><th class="text-start">Nama Lengkap Santri</th><th>Kelas</th><th>E-Raport</th><th>Sertifikat Juz</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1023412</td><td class="fw-bold text-start">Muhammad Fatih</td><td>VIII - Abu Bakar</td><td>${actionButtonsHTML}</td><td>${actionSertifikatHTML}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// ==========================================
// CORE HELPERS & UTILITIES
// ==========================================
function createCard(title, value, icon, iconBgClass) {
    return `
        <div class="col-6 col-sm-4 col-xl-2">
            <div class="card-enterprise p-3 h-100 d-flex flex-column align-items-center text-center justify-content-center">
                <div class="rounded-circle d-flex justify-content-center align-items-center mb-2 ${iconBgClass}" style="width: 45px; height: 45px;">
                    <i class="fas ${icon} fa-md"></i>
                </div>
                <div>
                    <h6 class="text-muted font-inter mb-1 text-uppercase" style="font-size: 9px; letter-spacing: 0.5px;">${title}</h6>
                    <h4 class="font-poppins fw-bold mb-0 text-dark" style="font-size: 14px;">${value}</h4>
                </div>
            </div>
        </div>
    `;
}

function initBarChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Capaian (Juz)', data: data, backgroundColor: '#0A3663', borderRadius: 4 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ==========================================
// MOCK DEVELOPMENT API 
// ==========================================
function mockAPIResponse(action, payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(action === "login") {
                let role = "GURU";
                let namaReal = "Ustadz Renaldi, S.Pd";
                const userIn = payload.username.toLowerCase();
                
                if(userIn === "admin") { role = "ADMIN"; namaReal = "Renaldi (Super Admin)"; }
                else if(userIn === "kepsek") { role = "KEPSEK"; namaReal = "Bapak H. Kepala Sekolah, M.Pd"; }
                else if(userIn === "ortu" || userIn === "ayah" || userIn === "bunda") { role = "AYAH_BUNDA"; namaReal = "Ayahanda M. Fatih"; }
                else if(userIn === "gurutahfidz") { role = "GURU_TAHFIDZ"; namaReal = "Ustadz Syam Al-Hafizh"; }
                else if(userIn === "osis") { role = "OSIS"; namaReal = "Kak Zaidan (Ketua OSIS)"; }
                
                resolve({
                    success: true,
                    data: { NAMA: namaReal, USERNAME: payload.username, ROLE: role, JENIS_KELAMIN: "Laki-laki" }
                });
            } else {
                resolve({ success: true, data: {} });
            }
        }, 200);
    });
}
