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
        title = "Ayah/Bunda";
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
// DYNAMIC SIDEBAR MENUS (UPDATE ROLE OSIS)
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
    // AKSES TERBATAS OSIS: HANYA INPUT KETERTIBAN & ADAB HARI INI
    OSIS: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Petugas OSIS' },
        { id: 'pembinaan', icon: 'fa-pen-to-square', text: 'Input Catatan Pelanggaran' }
    ]
};

function renderSidebar() {
    const role = AppState.user.ROLE || "GURU";
    let menus = [...(MENU_STRUCTURE[role] || MENU_STRUCTURE.GURU)];

    // Khusus OSIS Putri atau Guru Perempuan, otomatis ditambahkan menu Keputrian
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
            ${createPengumumanBerjalanHTML()}
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

// --- PENGUMUMAN BERJALAN KUNING EMAS ---
function createPengumumanBerjalanHTML() {
    return `
        <div class="alert alert-warning border-0 shadow-sm d-flex align-items-center mb-1" style="background-color: #FFF3CD; border-left: 4px solid #FFC107 !important; padding: 8px 14px;">
            <i class="fas fa-bullhorn text-warning me-3 fa-md"></i>
            <marquee class="font-inter small text-dark fw-bold" scrollamount="4">
                [PENGUMUMAN UTAMA]: Munaqasyah Tahfidz Akbar Al-Azhar 52 Bengkulu TA 2026/2027 Gelombang I akan dilaksanakan serentak pertengahan semester ini. Mohon persiapkan berkas administrasi santri binaan.
            </marquee>
        </div>
    `;
}

// --- MUTIARA ISLAMI STATIS (DI BAWAH PENGUMUMAN BERJALAN) ---
function createMutiaraStatisHTML() {
    return `
        <div class="p-2 px-3 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center" style="background-color: #ffffff; font-size: 11.5px; border-left: 3px solid #0A3663;">
            <i class="fas fa-quote-left text-primary-azhar me-2 opacity-50"></i>
            <span>"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari). Jagalah adab dan kejujuranmu dalam menuntut ilmu.</span>
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

// --- WIDGET MONITORING ADAB & KEPUTRIAN TERBARU ---
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

// --- TEMPLATE: OSIS DASHBOARD (KHUSUS HANYA UNTUK INPUT DATA) ---
async function renderOsisDashboard() {
    DOM.routerView.innerHTML = `
        ${createPengumumanBerjalanHTML()}
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Panel Kerja Pengurus OSIS</h4>
        <p class="text-muted small font-inter mb-4">Hak akses akun Anda dikonfigurasi sebagai <span class="badge bg-secondary">Petugas Lapangan (Input Only)</span>. Semua data yang Anda masukkan akan langsung diverifikasi oleh Bagian Kesantrian.</p>
        
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card-enterprise p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center border-top border-4 border-danger">
                    <i class="fas fa-clock fa-3x text-danger mb-3"></i>
                    <h5 class="font-poppins fw-bold">Pencatatan Pelanggaran Harian</h5>
                    <p class="text-muted font-inter small px-3">Gunakan menu ini untuk mendata santri yang terlambat, tidak membawa kelengkapan ibadah (mukena/peci), atau atribut sekolah.</p>
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
        ${createPengumumanBerjalanHTML()}
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Sistem Pemantauan Utama Admin</h4>
        <div class="row g-3 mb-4">
            ${createCard('TOTAL MURID', '324', 'fa-users', 'bg-primary text-white')}
            ${createCard('TOTAL GURU', '28', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TOTAL SETORAN', '1.250', 'fa-quran', 'bg-info text-white')}
            ${createCard('SURAH SELESAI', '840', 'fa-check-double', 'bg-success text-white')}
            ${createCard('BERHALANGAN', '12', 'fa-calendar-minus', 'bg-danger text-white')}
            ${createCard('PEMBINAAN ADAB', '5', 'fa-heart-circle-exclamation', 'bg-warning text-dark')}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-chart-bar text-primary-azhar me-2"></i>Grafik Perkembangan Hafalan Keseluruhan</h6>
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
        ${createPengumumanBerjalanHTML()}
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
        ${createPengumumanBerjalanHTML()}
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Dashboard Monitoring Manajemen Kepala Sekolah</h4>
        <div class="row g-3 mb-4">
            ${createCard('TOTAL GURU AKTIF', '28', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TARGET GLOBAL TAHFIDZ', '85%', 'fa-star', 'bg-primary text-white')}
            ${createCard('BERKAS VALIDASI', '12', 'fa-file-signature', 'bg-danger text-white')}
        </div>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-user-shield text-primary-azhar me-2"></i>Data Guru & Kelas Pengampu Binaan</h6>
                    <div class="table-responsive">
                        <table class="table table-hover font-inter align-middle small">
                            <thead class="table-light">
                                <tr><th>Nama Guru/Ustadz</th><th>Tugas Kelompok</th><th>Kelas Binaan</th><th>Status Input</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Ustadz Syam Al-Hafizh</td><td>Koordinator Keagamaan</td><td>Hafalan Juz 30-28</td><td><span class="badge bg-success">Lengkap</span></td></tr>
                                <tr><td>Ustadzah Aminah, S.Pd</td><td>Wali Kelas VIII</td><td>VIII - Abu Bakar</td><td><span class="badge bg-warning text-dark">Proses</span></td></tr>
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

// --- TEMPLATE: AYAH BUNDA DASHBOARD ---
async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
        ${createPengumumanBerjalanHTML()}
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Pusat Informasi Perkembangan Ananda</h4>
        <div class="card-enterprise p-4 mb-4 bg-primary-azhar text-white shadow-sm">
            <div class="d-flex align-items-center">
                <div class="bg-white text-primary-azhar rounded-circle d-flex justify-content-center align-items-center me-4" style="width: 60px; height: 60px;">
                    <i class="fas fa-user-graduate fa-2x"></i>
                </div>
                <div>
                    <h4 class="font-poppins fw-bold mb-1">Ananda Muhammad Fatih</h4>
                    <p class="mb-0 text-gold font-inter fw-medium">Kelas VIII - Abu Bakar • NIS: 1023412</p>
                </div>
            </div>
        </div>
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-success">
                    <h6 class="font-poppins fw-bold mb-3 text-success"><i class="fas fa-book-quran me-2"></i>Capaian & Progres Hafalan</h6>
                    <div class="p-3 bg-light rounded mb-3">
                        <small class="text-muted d-block">Setoran Terakhir:</small>
                        <span class="fw-bold text-dark">Surah Al-Muthaffifin (Ayat 1-12)</span>
                        <span class="badge bg-success float-end">Jayyid Jiddan</span>
                    </div>
                    <h6 class="font-poppins fw-bold small text-muted mb-2">Riwayat Surah/Juz yang Sudah Diselesaikan:</h6>
                    <div class="list-group list-group-flush font-inter small mb-1">
                        <div class="list-group-item px-0 d-flex justify-content-between"><span>• Surah An-Naba</span><span class="text-success fw-bold"><i class="fas fa-check-circle"></i> Selesai</span></div>
                        <div class="list-group-item px-0 d-flex justify-content-between"><span>• Surah An-Nazi'at</span><span class="text-success fw-bold"><i class="fas fa-check-circle"></i> Selesai</span></div>
                        <div class="list-group-item px-0 d-flex justify-content-between"><span>• Juz 30 Lengkap</span><span class="text-primary fw-bold"><i class="fas fa-award"></i> Lulus Tasmi'</span></div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-info">
                    <h6 class="font-poppins fw-bold mb-3 text-info"><i class="fas fa-heart-circle-check me-2"></i>Catatan Adab & Pembinaan Kepribadian</h6>
                    <div class="p-4 text-center bg-light rounded h-100 d-flex flex-column align-items-center justify-content-center">
                        <i class="fas fa-smile-beam fa-3x text-success mb-3"></i>
                        <h6 class="font-poppins fw-bold text-success mb-1">Alhamdulillah, Ananda Bersih!</h6>
                        <p class="text-muted small font-inter mb-0 px-2">Ananda tidak memiliki catatan pelanggaran adab maupun tindakan kedisplinan pada pekan ini. Pertahankan prestasimu, nak!</p>
                    </div>
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
        <button class="btn btn-sm btn-outline-primary mb-1 me-1" onclick="alert('Membuka Preview E-Raport...')"><i class="fas fa-eye"></i> Tinjau</button>
        <button class="btn btn-sm btn-success mb-1" onclick="alert('Menginisiasi Perintah Cetak Hardcopy Raport ke Printer...')"><i class="fas fa-print"></i> Cetak</button>
    ` : `
        <button class="btn btn-sm btn-outline-primary w-100" onclick="alert('Membuka Lembar Digital PDF (Hanya Lihat)...')"><i class="fas fa-file-pdf"></i> Tinjau Raport</button>
    `;

    let actionSertifikatHTML = canPrint ? `
        <button class="btn btn-sm btn-outline-success mb-1 me-1" onclick="alert('Membuka Preview Sertifikat...')"><i class="fas fa-eye"></i> Tinjau</button>
        <button class="btn btn-sm btn-gold mb-1" onclick="alert('Menginisiasi Perintah Cetak Sertifikat Kompetensi...')"><i class="fas fa-print"></i> Cetak</button>
    ` : `
        <button class="btn btn-sm btn-outline-success w-100" onclick="alert('Membuka Piagam Penghargaan Digital (Hanya Lihat)...')"><i class="fas fa-award"></i> Tinjau Sertifikat</button>
    `;

    DOM.routerView.innerHTML = `
        ${createPengumumanBerjalanHTML()}
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Arsip Raport & Sertifikat Santri</h4>
        <div class="card-enterprise p-4">
            <div class="table-responsive">
                <table class="table table-hover font-inter align-middle small text-center">
                    <thead class="table-light">
                        <tr>
                            <th>NIS</th><th class="text-start">Nama Lengkap Santri</th><th>Kelas</th><th>E-Raport</th><th>Sertifikat Juz</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1023412</td><td class="fw-bold text-start">Muhammad Fatih</td><td>VIII - Abu Bakar</td><td>${actionButtonsHTML}</td><td>${actionSertifikatHTML}</td>
                        </tr>
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
                    <h4 class="font-poppins fw-bold mb-0 text-dark">${value}</h4>
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
                else if(userIn === "ortu" || userIn === "ayah") { role = "AYAH_BUNDA"; namaReal = "Ayahanda M. Fatih"; }
                else if(userIn === "gurutahfidz") { role = "GURU_TAHFIDZ"; namaReal = "Ustadz Syam Al-Hafizh"; }
                // SIMULASI LOGIN AKUN OSIS
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
