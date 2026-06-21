/**
 * =========================================================
 * IIMS - FRONTEND LOGIC (VANILLA JS)
 * Developer: Renaldi
 * Architecture: SPA / Enterprise Dashboard
 * =========================================================
 */

// ==========================================
// CONFIGURATION API
// ==========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbx0P2qroCtNv2Ryfg31LnjfhqmNSx3acZtNpguKPn88ixzCCmpemRPi-qu73_4cENiR6w/exec"; 

// ==========================================
// STATE MANAGEMENT
// ==========================================
const AppState = {
    user: null, // Berisi { NAMA, ROLE, JENIS_KELAMIN, TOKEN, dll }
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
    DOM.formLogin.addEventListener('submit', handleLogin);
    DOM.btnLogout.addEventListener('click', handleLogout);
    DOM.toggleSidebar.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('show');
    });
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
        // Fallback simulasi untuk preview UI jika URL GAS belum diisi
        if(GAS_URL === "PASTE_GAS_WEBAPP_URL_HERE") {
            console.warn("GAS_URL belum diset. Menjalankan Mock Data.");
            return mockAPIResponse(action, payload);
        }
        alert("Terjadi kesalahan koneksi ke server.");
        return { success: false, message: error.message };
    }
}

function showLoader() { DOM.loader.classList.remove('d-none'); DOM.loader.classList.add('d-flex'); }
function hideLoader() { DOM.loader.classList.add('d-none'); DOM.loader.classList.remove('d-flex'); }

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
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await callAPI("login", { username, password });
    
    if (res.success) {
        AppState.user = res.data;
        // Simulasi token untuk mock
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
    const user = AppState.user;
    let title = "Bapak/Ibu";
    
    if (user.ROLE === "AYAH_BUNDA") title = "Ayah/Bunda";
    else if (user.ROLE.includes("GURU")) title = user.JENIS_KELAMIN === "Perempuan" ? "Ustadzah" : "Ustadz";
    else if (user.ROLE === "KEPSEK") title = "Bapak Kepala Sekolah";

    DOM.userGreeting.innerHTML = `Selamat Datang, <span class="text-primary-azhar">${title} ${user.NAMA.split(' ')[0]}</span>`;
    DOM.userRoleBadge.innerText = user.ROLE.replace('_', ' ');
}

// ==========================================
// DYNAMIC SIDEBAR MENUS
// ==========================================
const MENU_STRUCTURE = {
    ADMIN: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'data-guru', icon: 'fa-chalkboard-teacher', text: 'Data Guru' },
        { id: 'data-murid', icon: 'fa-user-graduate', text: 'Data Murid' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' }
    ],
    KEPSEK: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Dokumen' }
    ],
    GURU: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Dokumen' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Ananda' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' }
    ]
};

function renderSidebar() {
    const role = AppState.user.ROLE;
    let menus = MENU_STRUCTURE[role] || [];

    // Logika Khusus: Keputrian untuk Guru Perempuan
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

    // Attach Event Listeners
    document.querySelectorAll('.nav-menu-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('data-target');
            // Update Active State
            document.querySelectorAll('.nav-menu-item').forEach(n => n.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Close mobile sidebar if open
            if(window.innerWidth < 992) DOM.sidebar.classList.remove('show');
            
            loadView(target);
        });
    });

    // Set first active
    document.querySelector('.nav-menu-item').classList.add('active');
}

// ==========================================
// VIEW HANDLER (DASHBOARD TEMPLATES)
// ==========================================
async function loadView(viewId) {
    AppState.currentView = viewId;
    DOM.routerView.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-gold"></div></div>';

    if (viewId === 'dashboard') {
        const role = AppState.user.ROLE;
        if (role === 'ADMIN') await renderAdminDashboard();
        else if (role === 'KEPSEK') await renderKepsekDashboard();
        else if (role === 'AYAH_BUNDA') await renderAyahBundaDashboard();
        else await renderGuruDashboard(); // Guru & Guru Tahfidz share similar base structure
    } else {
        // Placeholder untuk menu lain (Tahfidz, Pembinaan, dll)
        DOM.routerView.innerHTML = `
            <div class="card-enterprise p-5 text-center mt-4">
                <i class="fas fa-tools fa-4x text-muted mb-3 opacity-50"></i>
                <h3 class="font-poppins text-primary-azhar">Modul ${viewId.toUpperCase()}</h3>
                <p class="text-muted">Fitur sedang dalam tahap integrasi dengan API Gateway.</p>
            </div>
        `;
    }
}

// --- TEMPLATE: ADMIN DASHBOARD ---
async function renderAdminDashboard() {
    const res = await callAPI("getAdminDashboard");
    const data = res.success ? res.data : { TotalMurid: 420, TotalGuru: 35, TotalSetoran: 1250, TotalSurahSelesai: 320 }; // mock fallback

    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Enterprise Dashboard</h4>
        <div class="row g-4 mb-4">
            ${createCard('Total Murid', data.TotalMurid, 'fa-users', 'bg-primary text-white')}
            ${createCard('Total Guru', data.TotalGuru, 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('Total Setoran', data.TotalSetoran, 'fa-quran', 'bg-gold text-dark')}
            ${createCard('Surah Selesai', data.TotalSurahSelesai, 'fa-check-double', 'bg-info text-white')}
        </div>
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3">Grafik Perkembangan Tahfidz Mingguan</h6>
                    <canvas id="chartTahfidz" height="100"></canvas>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="font-poppins fw-bold mb-3">Top 5 Murojaah</h6>
                    <ul class="list-group list-group-flush font-inter small">
                        <li class="list-group-item px-0 d-flex justify-content-between"><span>Ahmad Zaky</span> <span class="fw-bold text-success">Juz 30</span></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span>Fatimah Az-Zahra</span> <span class="fw-bold text-success">Juz 29</span></li>
                        <li class="list-group-item px-0 d-flex justify-content-between"><span>Umar Bin Khattab</span> <span class="fw-bold text-success">Juz 29</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    initBarChart('chartTahfidz', ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'], [45, 59, 80, 81, 56]);
}

// --- TEMPLATE: GURU DASHBOARD ---
async function renderGuruDashboard() {
    DOM.routerView.innerHTML = `
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Kelas Binaan</h4>
        <div class="row g-4 mb-4">
            ${createCard('Murid Binaan', 32, 'fa-user-graduate', 'bg-primary text-white')}
            ${createCard('Setoran Minggu Ini', 28, 'fa-book-open', 'bg-success text-white')}
            ${createCard('Catatan Pembinaan', 3, 'fa-heart-circle-exclamation', 'bg-warning text-dark')}
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
                    <div class="mt-4 text-center">
                        <span class="small text-muted mb-1 d-block">Pencapaian Target Semester</span>
                        <div class="progress" style="height: 10px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: 75%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-warning">
                    <h6 class="font-poppins fw-bold mb-3"><i class="fas fa-cow text-warning me-2"></i> Tabungan Kurban</h6>
                    <h3 class="font-poppins fw-bold text-center mb-0">Rp 1.500.000</h3>
                    <p class="text-center text-muted small mb-3">dari target Rp 3.000.000</p>
                    <div class="progress mb-3" style="height: 10px;">
                        <div class="progress-bar bg-warning" role="progressbar" style="width: 50%"></div>
                    </div>
                    <p class="text-center font-inter small text-success fw-medium"><i class="fas fa-check-circle"></i> Sisa: Rp 1.500.000</p>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// UI HELPERS & CHART CONFIG
// ==========================================
function createCard(title, value, icon, iconBgClass) {
    return `
        <div class="col-sm-6 col-xl-3">
            <div class="card-enterprise p-3 h-100 d-flex align-items-center">
                <div class="rounded-circle d-flex justify-content-center align-items-center me-3 ${iconBgClass}" style="width: 50px; height: 50px;">
                    <i class="fas ${icon} fa-lg"></i>
                </div>
                <div>
                    <h6 class="text-muted font-inter mb-1 small">${title}</h6>
                    <h3 class="font-poppins fw-bold mb-0 text-dark">${value}</h3>
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
            datasets: [{
                label: 'Setoran',
                data: data,
                backgroundColor: '#0A3663',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ==========================================
// MOCK DEVELOPMENT API 
// (Menjalankan UI meski GAS_URL kosong)
// ==========================================
function mockAPIResponse(action, payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(action === "login") {
                let role = "GURU";
                if(payload.username.toLowerCase() === "admin") role = "ADMIN";
                if(payload.username.toLowerCase() === "kepsek") role = "KEPSEK";
                if(payload.username.toLowerCase() === "ayah") role = "AYAH_BUNDA";
                
                resolve({
                    success: true,
                    data: { NAMA: "Ahmad Fauzi", USERNAME: payload.username, ROLE: role, JENIS_KELAMIN: "Laki-laki" }
                });
            } else {
                resolve({ success: true, data: {} });
            }
        }, 800);
    });
}
