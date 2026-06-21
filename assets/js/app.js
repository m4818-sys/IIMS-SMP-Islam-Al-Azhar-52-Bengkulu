/**
 * =========================================================
 * IIMS - FRONTEND LOGIC (VANILLA JS)
 * Developer: Renaldi
 * Architecture: SPA / Enterprise Dashboard (Fixed & Perfected)
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
        console.error("API Error, memicu fallback simulasi keamanan:", error);
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

    // Sementara memotong jalur ke sistem simulasi agar bisa diuji coba tanpa hambatan database
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
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'data-guru', icon: 'fa-chalkboard-teacher', text: 'Data Guru' },
        { id: 'data-murid', icon: 'fa-user-graduate', text: 'Data Murid' },
        { id: 'penempatan', icon: 'fa-door-open', text: 'Penempatan Kelas' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Dokumen & Raport' }
    ],
    KEPSEK: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'E-Raport & Sertifikat' }
    ],
    GURU: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Input Nilai Raport' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Cetak Sertifikat Juz' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Ananda' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Ananda' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Catatan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Lihat Raport/Sertifikat' }
    ]
};

function renderSidebar() {
    const role = AppState.user.ROLE || "GURU";
    let menus = [...(MENU_STRUCTURE[role] || MENU_STRUCTURE.GURU)];

    if (role === "GURU" && AppState.user.JENIS_KELAMIN === "Perempuan") {
        menus.splice(2, 0, { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' });
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
// VIEW HANDLER (DASHBOARD & MODULE TEMPLATES)
// ==========================================
async function loadView(viewId) {
    AppState.currentView = viewId;
    DOM.routerView.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-gold"></div></div>';

    if (viewId === 'dashboard') {
        const role = AppState.user.ROLE;
        if (role === 'ADMIN') await renderAdminDashboard();
        else if (role === 'KEPSEK') await renderKepsekDashboard();
        else if (role === 'AYAH_BUNDA') await renderAyahBundaDashboard();
        else await renderGuruDashboard();
    } else if (viewId === 'dokumen') {
        await renderDokumenView();
    } else {
        // Halaman Fallback Sementara untuk Modul Lain Sebelum di-Koneksikan ke GAS Besok
        DOM.routerView.innerHTML = `
            <div class="card-enterprise p-5 text-center mt-4">
                <i class="fas fa-tools fa-4x text-muted mb-3 opacity-50"></i>
                <h3 class="font-poppins text-primary-azhar">Modul ${viewId.toUpperCase().replace('-', ' ')}</h3>
                <p class="text-muted mb-4">Fitur antarmuka telah siap. Menunggu integrasi fungsi <strong>Google Apps Script (GAS)</strong> besok.</p>
                <button class="btn btn-primary-azhar btn-sm" onclick="loadView('dashboard')"><i class="fas fa-arrow-left me-2"></i>Kembali ke Dashboard</button>
            </div>
            ${createFooterHTML()}
        `;
    }
}

// --- TEMPLATE: ADMIN DASHBOARD (6 UTAMA + DUA KOLOM BAWAH) ---
async function renderAdminDashboard() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Enterprise Dashboard</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('TOTAL MURID', '324', 'fa-users', 'bg-primary text-white')}
            ${createCard('TOTAL GURU', '28', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TOTAL SETORAN', '1.250', 'fa-quran', 'bg-info text-white')}
            ${createCard('SURAH SELESAI', '840', 'fa-check-double', 'bg-success text-white')}
            ${createCard('BERHALANGAN', '12', 'fa-calendar-minus', 'bg-danger text-white')}
            ${createCard('PEMBINAAN', '5', 'fa-heart-circle-exclamation', 'bg-warning text-dark')}
        </div>
        
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-chart-bar text-primary-azhar me-2"></i>Grafik Perkembangan Tahfidz</h6>
                    <div style="position: relative; height:250px; width:100%;">
                        <canvas id="chartTahfidz"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-bolt text-warning me-2"></i>Aktivitas Terbaru</h6>
                    <div class="font-inter small">
                        <div class="p-2 border-bottom mb-2">
                            <span class="d-block fw-bold text-dark">Setoran baru dari Ahmad</span>
                            <small class="text-muted">Surah Al-Mulk • Lancar</small>
                        </div>
                        <div class="p-2 border-bottom mb-2">
                            <span class="d-block fw-bold text-dark">Pembayaran Kurban Rp 500rb</span>
                            <small class="text-muted">Ananda Fatih • Via Transfer</small>
                        </div>
                        <div class="p-2 mb-1">
                            <span class="d-block fw-bold text-dark">Laporan Keputrian Kelas 9</span>
                            <small class="text-muted">Diperbarui oleh Ustadzah Aminah</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-12">
                <div class="card-enterprise p-4">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-star text-gold me-2"></i>Top 3 Murojaah Minggu Ini</h6>
                    <ul class="list-group list-group-flush font-inter small">
                        <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-medal text-gold me-2"></i>Ahmad Zaky</span> 
                            <span class="badge bg-light text-success fw-bold">Juz 30 Selesai</span>
                        </li>
                        <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-medal text-silver me-2"></i>Fatimah Az-Zahra</span> 
                            <span class="badge bg-light text-success fw-bold">Juz 29 Murojaah</span>
                        </li>
                        <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
                            <span><i class="fas fa-medal text-bronze me-2"></i>Umar Bin Khattab</span> 
                            <span class="badge bg-light text-success fw-bold">Juz 29 Murojaah</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        ${createFooterHTML()}
    `;
    setTimeout(() => {
        initBarChart('chartTahfidz', ['Kelas 7', 'Kelas 8', 'Kelas 9'], [1.2, 2.5, 4.1]);
    }, 50);
}

// --- TEMPLATE: MODULE CETAK RAPORT & SERTIFIKAT ---
async function renderDokumenView() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Pusat Dokumen & Cetak Raport</h4>
        <div class="card-enterprise p-4 mb-4">
            <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-search me-2 text-primary-azhar"></i>Pencarian Cepat Data Santri/Ananda</h6>
            <div class="row g-3">
                <div class="col-md-6">
                    <input type="text" class="form-control font-inter" placeholder="Masukkan Nama atau NIS Murid...">
                </div>
                <div class="col-md-4">
                    <select class="form-select font-inter">
                        <option value="">Semua Kelas</option>
                        <option value="7">Kelas VII</option>
                        <option value="8">Kelas VIII</option>
                        <option value="9">Kelas IX</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button class="btn btn-primary-azhar w-100 font-poppins"><i class="fas fa-filter me-2"></i>Filter</button>
                </div>
            </div>
        </div>

        <div class="card-enterprise p-4">
            <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-print me-2 text-primary-azhar"></i>Daftar Berkas Siap Cetak</h6>
            <div class="table-responsive">
                <table class="table table-hover font-inter align-middle small">
                    <thead class="table-light">
                        <tr>
                            <th>NIS</th>
                            <th>Nama Murid</th>
                            <th>Kelas</th>
                            <th>Raport Semester</th>
                            <th>Sertifikat Juz</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1023412</td>
                            <td class="fw-bold">Muhammad Fatih</td>
                            <td>VIII - Abu Bakar</td>
                            <td><button class="btn btn-sm btn-outline-primary" onclick="alert('Membuka PDF Raport...')"><i class="fas fa-file-pdf me-1"></i> Unduh Raport</button></td>
                            <td><button class="btn btn-sm btn-outline-success" onclick="alert('Membuka PDF Sertifikat Juz 30...')"><i class="fas fa-award me-1"></i> Cetak Juz 30</button></td>
                        </tr>
                        <tr>
                            <td>1023415</td>
                            <td class="fw-bold">Aisyah Humaira</td>
                            <td>IX - Fatimah</td>
                            <td><button class="btn btn-sm btn-outline-primary" onclick="alert('Membuka PDF Raport...')"><i class="fas fa-file-pdf me-1"></i> Unduh Raport</button></td>
                            <td><button class="btn btn-sm btn-outline-success" onclick="alert('Membuka PDF Sertifikat Juz 29...')"><i class="fas fa-award me-1"></i> Cetak Juz 29</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: GURU DASHBOARD ---
async function renderGuruDashboard() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Kelas Binaan</h4>
        <div class="row g-4 mb-4">
            ${createCard('Murid Binaan', '32', 'fa-user-graduate', 'bg-primary text-white')}
            ${createCard('Setoran Minggu Ini', '28', 'fa-book-open', 'bg-success text-white')}
            ${createCard('Catatan Pembinaan', '3', 'fa-heart-circle-exclamation', 'bg-warning text-dark')}
        </div>
        <div class="card-enterprise p-4">
            <h6 class="font-poppins fw-bold mb-3">Daftar Murid</h6>
            <div class="table-responsive">
                <table class="table table-hover font-inter align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Nama Murid</th>
                            <th>Surah Aktif</th>
                            <th>Ayat</th>
                            <th>Status Tahfidz</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Abdullah</td><td>An-Naba</td><td>1-15</td><td><span class="badge bg-success">Lancar</span></td></tr>
                        <tr><td>Aisyah</td><td>Abasa</td><td>1-42</td><td><span class="badge bg-primary">Selesai</span></td></tr>
                        <tr><td>Hasan</td><td>At-Takwir</td><td>1-10</td><td><span class="badge bg-warning text-dark">Murajaah</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: KEPSEK DASHBOARD ---
async function renderKepsekDashboard() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Executive Dashboard</h4>
        <div class="row g-4 mb-4">
            <div class="col-md-4">
                <div class="card-enterprise p-4 text-center border-bottom border-4 border-success">
                    <h6 class="text-muted mb-2 font-inter">Target Hafalan Global</h6>
                    <h2 class="font-poppins fw-bold mb-0">85%</h2>
                    <small class="text-success"><i class="fas fa-arrow-up"></i> 5% dari bulan lalu</small>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-enterprise p-4 text-center border-bottom border-4 border-warning">
                    <h6 class="text-muted mb-2 font-inter">Penyelesaian Kurban</h6>
                    <h2 class="font-poppins fw-bold mb-0">65%</h2>
                    <small class="text-muted">Rp 45.000.000 Terkumpul</small>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card-enterprise p-4 text-center border-bottom border-4 border-primary">
                    <h6 class="text-muted mb-2 font-inter">Dokumen Menunggu</h6>
                    <h2 class="font-poppins fw-bold mb-0 text-danger">12</h2>
                    <small class="text-muted">Sertifikat & Raport</small>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: AYAH BUNDA DASHBOARD ---
async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Dashboard Ananda</h4>
        <div class="card-enterprise p-4 mb-4 bg-primary-azhar text-white">
            <div class="d-flex align-items-center">
                <div class="bg-white text-primary-azhar rounded-circle d-flex justify-content-center align-items-center me-4" style="width: 60px; height: 60px;">
                    <i class="fas fa-user-graduate fa-2x"></i>
                </div>
                <div>
                    <h4 class="font-poppins fw-bold mb-1">Ananda M. Fatih</h4>
                    <p class="mb-0 text-gold font-inter">Kelas VIII - Abu Bakar</p>
                </div>
            </div>
        </div>
        <div class="row g-4">
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-success">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-quran text-success me-2"></i> Progress Tahfidz</h6>
                    <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                        <span class="text-muted">Surah Aktif</span>
                        <span class="fw-bold">Al-Muthaffifin</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                        <span class="text-muted">Ayat Terakhir</span>
                        <span class="fw-bold">Ayat 12</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                        <span class="text-muted">Predikat Terakhir</span>
                        <span class="badge bg-primary">Jayyid Jiddan</span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-warning">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-cow text-warning me-2"></i> Tabungan Kurban</h6>
                    <h3 class="font-poppins fw-bold text-center mb-0">Rp 1.500.000</h3>
                    <p class="text-center text-muted small mb-3">dari target Rp 3.000.000</p>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// ==========================================
// UI HELPERS & CHART CONFIG
// ==========================================
function createCard(title, value, icon, iconBgClass) {
    return `
        <div class="col-6 col-sm-4 col-xl-2">
            <div class="card-enterprise p-3 h-100 d-flex flex-column align-items-center text-center justify-content-center">
                <div class="rounded-circle d-flex justify-content-center align-items-center mb-2 ${iconBgClass}" style="width: 45px; height: 45px;">
                    <i class="fas ${icon} fa-md"></i>
                </div>
                <div>
                    <h6 class="text-muted font-inter mb-1 text-uppercase" style="font-size: 10px; letter-spacing: 0.5px;">${title}</h6>
                    <h4 class="font-poppins fw-bold mb-0 text-dark">${value}</h4>
                </div>
            </div>
        </div>
    `;
}

function createFooterHTML() {
    return `
        <div class="text-center py-4 mt-5 border-top font-inter small text-muted">
            Developed & Maintained by <span class="fw-bold text-primary-azhar">Renaldi</span> <br>
            <span class="opacity-70">© 2026 Integrated Islamic Monitoring System (IIMS). All Rights Reserved.</span>
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
            datasets: [{
                label: 'Perkembangan (Juz)',
                data: data,
                backgroundColor: '#0A3663',
                borderRadius: 4
            }]
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
                
                if(userIn === "admin") { role = "ADMIN"; namaReal = "Renaldi (Admin)"; }
                else if(userIn === "kepsek") { role = "KEPSEK"; namaReal = "Bapak H. Kepala Sekolah, M.Pd"; }
                else if(userIn === "ortu" || userIn === "ayah") { role = "AYAH_BUNDA"; namaReal = "Ayahanda M. Fatih"; }
                else if(userIn === "gurutahfidz") { role = "GURU_TAHFIDZ"; namaReal = "Ustadz Syam Al-Hafizh"; }
                
                resolve({
                    success: true,
                    data: { NAMA: namaReal, USERNAME: payload.username, ROLE: role, JENIS_KELAMIN: "Laki-laki" }
                });
            } else {
                resolve({ success: true, data: {} });
            }
        }, 600);
    });
}
