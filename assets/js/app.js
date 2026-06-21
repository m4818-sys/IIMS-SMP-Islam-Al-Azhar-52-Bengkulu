/**
 * =========================================================
 * IIMS - INTEGRATED ISLAMIC MONITORING SYSTEM (VANILLA JS)
 * Developer: Renaldi
 * Architecture: SPA / Enterprise Dashboard (Scale-Ready 10 Years)
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
    currentView: 'dashboard',
    // Default master active settings
    tahunAjaran: "2026/2027",
    semester: "Ganjil"
};

// Generate 10 Tahun Ajaran (2026/2027 s.d 2035/2036)
const LIST_TAHUN_AJARAN = [];
(() => {
    let startYear = 2026;
    for (let i = 0; i < 10; i++) {
        LIST_TAHUN_AJARAN.push(`${startYear}/${startYear + 1}`);
        startYear++;
    }
})();

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
        const response = await fetch(GAS_URL, { method: 'POST', body: JSON.stringify(bodyData) });
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
        title = "Kakak";
    } else if (role.includes("GURU") || role === "ADMIN") {
        title = jk === "Perempuan" ? "Ustadzah" : "Ustadz";
    } else if (role === "KEPSEK") {
        title = "Bapak";
    }

    DOM.userGreeting.innerHTML = `Selamat Datang, <span class="text-primary-azhar">${title} ${nama.split(' ')[0]}</span>`;
    DOM.userRoleBadge.innerText = role ? role.replace('_', ' ') : '-';
}

// ==========================================
// DYNAMIC SIDEBAR MENUS (ALL PREPARED)
// ==========================================
const MENU_STRUCTURE = {
    ADMIN: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'data-guru', icon: 'fa-chalkboard-teacher', text: 'Data Master Guru (NIPY)' },
        { id: 'data-murid', icon: 'fa-user-graduate', text: 'Data Master Murid (NIS)' },
        { id: 'penempatan', icon: 'fa-door-open', text: 'Plotting Rombel Acak' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Global' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Pelacakan & Cetak Sertifikat' },
        { id: 'pengaturan-master', icon: 'fa-cogs', text: 'Pengaturan Sistem (10 TA)' } // Paling bawah
    ],
    KEPSEK: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama Kepsek' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Global' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Validasi & Lacak Sertifikat' }
    ],
    GURU: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Kelas Binaan' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Murid' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Catatan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban Kelas' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-invoice', text: 'Lihat Dokumen Kelas' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Tahfidz' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Input Setoran (Halaqah)' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Cetak Raport & Sertifikat' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Ananda' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Perkembangan Tahfidz' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Perkembangan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban Ananda' },
        { id: 'dokumen', icon: 'fa-file-invoice', text: 'Unduh Raport & Sertifikat' }
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
        menus.splice(menus.length - 1, 0, { id: 'keputrian', icon: 'fa-person-dress', text: 'Input Absensi Keputrian' });
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
    } else if (viewId === 'data-guru') {
        await renderDataGuruView();
    } else if (viewId === 'data-murid') {
        await renderDataMuridView();
    } else if (viewId === 'penempatan') {
        await renderPenempatanView();
    } else if (viewId === 'pengaturan-master') {
        await renderPengaturanMasterView();
    } else if (viewId === 'dokumen') {
        await renderDokumenView();
    } else {
        DOM.routerView.innerHTML = `
            ${createMutiaraStatisHTML()}
            <div class="card-enterprise p-5 text-center mt-4">
                <i class="fas fa-cubes fa-4x text-muted mb-3 opacity-50"></i>
                <h3 class="font-poppins text-primary-azhar">Modul ${viewId.toUpperCase().replace('-', ' ')}</h3>
                <p class="text-muted mb-4">Modul fungsional terintegrasi dengan basis database NIS/NIPY siap digunakan.</p>
                <button class="btn btn-primary-azhar btn-sm" onclick="loadView('dashboard')"><i class="fas fa-arrow-left me-2"></i>Kembali ke Dashboard</button>
            </div>
            ${createFooterHTML()}
        `;
    }
}

function createMutiaraStatisHTML() {
    return `
        <div class="p-3 px-4 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center" style="background-color: #ffffff; font-size: 14px; border-left: 4px solid #0A3663; line-height: 1.6;">
            <i class="fas fa-quote-left text-primary-azhar me-3 fa-lg opacity-70"></i>
            <span class="fw-medium">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari). Data terkunci aman dengan validasi NIS & NIPY.</span>
        </div>
    `;
}

function createFooterHTML() {
    return `
        <div class="text-center py-4 mt-5 border-top font-inter small text-muted" style="clear: both; position: relative;">
            Developed & Maintained by <span class="fw-bold text-primary-azhar">Renaldi</span> <br>
            <span class="opacity-70">© 2026 Integrated Islamic Monitoring System (IIMS) • SMP Islam Al-Azhar 52 Bengkulu. All Rights Reserved.</span>
        </div>
    `;
}

// ==========================================
// PANELS & DASHBOARD IMPLEMENTATIONS
// ==========================================

// --- VIEW: MASTER GURU (JABATAN FLEXIBLE) ---
async function renderDataGuruView() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Master Data Guru (Kunci Utama: NIPY)</h4>
        <div class="card-enterprise p-4">
            <div class="table-responsive">
                <table class="table table-hover font-inter small align-middle">
                    <thead class="table-light text-center">
                        <tr><th>NIPY</th><th>Nama Lengkap</th><th>Jenis Kelamin</th><th>Penugasan Jabatan Utama</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center fw-bold">NIPY.2026001</td>
                            <td>Ustadz Renaldi, S.Pd</td>
                            <td class="text-center">Laki-laki</td>
                            <td>
                                <select class="form-select form-select-sm" onchange="alert('Jabatan NIPY.2026001 diubah!')">
                                    <option value="Wali Kelas 8A" selected>Wali Kelas 8A</option>
                                    <option value="Pendamping Tahfidz 7B">Pendamping Tahfidz 7B</option>
                                    <option value="Koordinator Keagamaan">Koordinator Keagamaan</option>
                                </select>
                            </td>
                            <td class="text-center"><button class="btn btn-sm btn-primary-azhar"><i class="fas fa-save"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- VIEW: MASTER MURID & TRACKING GLOBAL ---
async function renderDataMuridView() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Pusat Data Master Murid (Kunci Utama: NIS)</h4>
        <p class="text-muted small font-inter mb-4">Sekolah dapat mendeteksi, melacak histori lama, dan menarik berkas sertifikat kapan pun berdasarkan nomor induk permanen.</p>
        
        <div class="card-enterprise p-4 mb-4">
            <div class="row g-2">
                <div class="col-md-9">
                    <input type="text" id="search-nis-nama" class="form-control form-control-sm" placeholder="Masukkan NIS atau Nama Murid Aktif / Alumni...">
                </div>
                <div class="col-md-3">
                    <button class="btn btn-primary-azhar btn-sm w-100" onclick="alert('Melacak database riwayat 10 tahun...')"><i class="fas fa-search me-1"></i>Lacak Rekam Jejak</button>
                </div>
            </div>
        </div>

        <div class="card-enterprise p-4">
            <div class="table-responsive">
                <table class="table table-hover font-inter small align-middle">
                    <thead class="table-light text-center">
                        <tr><th>NIS</th><th>Nama Murid</th><th>Tingkat Sekarang</th><th>Rombel Saat Ini</th><th>Histori Hafalan</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center fw-bold">1023412</td>
                            <td>Muhammad Fatih</td>
                            <td class="text-center">Kelas VIII</td>
                            <td class="text-center"><span class="badge bg-secondary">Abu Bakar (8A)</span></td>
                            <td class="text-center"><button class="btn btn-sm btn-outline-success" onclick="loadView('dokumen')"><i class="fas fa-history me-1"></i>Lihat (Kunci NIS)</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- VIEW: PLOTTING ROTASI ROMBEL ACAK ---
async function renderPenempatanView() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Plotting & Rotasi Rombel Acak Tahunan</h4>
        <p class="text-muted small font-inter mb-4">Atur pembagian kelas baru. Mengubah rombel tidak akan merusak data hafalan karena diikat menggunakan NIS unik.</p>
        
        <div class="card-enterprise p-4">
            <div class="row g-3 align-items-center">
                <div class="col-md-4">
                    <label class="small fw-bold text-muted">Nama Murid (NIS: 1023412)</label>
                    <input type="text" class="form-control form-control-sm" value="Muhammad Fatih" readonly>
                </div>
                <div class="col-md-4">
                    <label class="small fw-bold text-muted">Pindahkan Ke Rombel Baru</label>
                    <select class="form-select form-select-sm">
                        <option value="7A">7A (Reguler)</option>
                        <option value="8A" selected>8A (Abu Bakar)</option>
                        <option value="8C">8C (Acak / Baru)</option>
                        <option value="9A">9A (Umar Bin Khattab)</option>
                    </select>
                </div>
                <div class="col-md-4 mt-4">
                    <button class="btn btn-warning btn-sm w-100 text-dark fw-bold" onclick="alert('Rombel berhasil dirotasi! Histori tersimpan permanen.')"><i class="fas fa-random me-1"></i>Eksekusi Perpindahan</button>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- VIEW: PENGATURAN MASTER 10 TAHUN (PALING BAWAH) ---
async function renderPengaturanMasterView() {
    let optionsTA = '';
    LIST_TAHUN_AJARAN.forEach(ta => {
        optionsTA += `<option value="${ta}" ${AppState.tahunAjaran === ta ? "selected" : ""}>Tahun Ajaran ${ta}</option>`;
    });

    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Pengaturan Kontrol Master Utama</h4>
        <p class="text-muted small font-inter mb-4">Konfigurasi jangka panjang hingga 10 tahun ke depan untuk menentukan basis filter aktif.</p>
        
        <div class="card-enterprise p-4 border-top border-4 border-gold" style="max-width: 600px;">
            <div class="mb-3">
                <label class="form-label fw-bold font-poppins text-dark">Pilih Tahun Ajaran Aktif (Skala 10 Tahun)</label>
                <select class="form-select" id="setting-ta" onchange="AppState.tahunAjaran = this.value; alert('Sistem diset ke Tahun Ajaran: ' + this.value)">
                    ${optionsTA}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold font-poppins text-dark">Pilih Semester Aktif</label>
                <select class="form-select" id="setting-sem" onchange="AppState.semester = this.value; alert('Sistem diset ke Semester: ' + this.value)">
                    <option value="Ganjil" ${AppState.semester === "Ganjil" ? "selected" : ""}>Ganjil</option>
                    <option value="Genap" ${AppState.semester === "Genap" ? "selected" : ""}>Genap</option>
                </select>
            </div>
            <div class="p-3 rounded bg-light border small text-muted font-inter">
                <i class="fas fa-shield-alt text-success me-1"></i> Mengubah parameter di atas akan memfilter seluruh penginputan nilai tahfidz dan pembinaan ke tahun ajaran yang dipilih tanpa menghapus database tahun-tahun sebelumnya.
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- VIEW: REVISI SUPER DASHBOARD KEPALA SEKOLAH (INFO STRATEGIS SUPER LENGKAP) ---
async function renderKepsekDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-2">Dashboard Monitoring Utama Kepala Sekolah</h4>
        <p class="text-muted small font-inter mb-4">Informasi makro real-time dari data guru (NIPY) dan perkembangan murid (NIS) tahun ajaran ${AppState.tahunAjaran}.</p>
        
        <div class="row g-3 mb-4">
            ${createCard('TOTAL GURU JABATAN', '35 Ustadz/ah', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('CAPAIAN TAHFIDZ', '85.4%', 'fa-star', 'bg-primary text-white')}
            ${createCard('TABUNGAN GLOBAL', 'Rp48.200.000', 'fa-wallet', 'bg-info text-white')}
            ${createCard('BERKAS VALIDASI', '12 Berkas', 'fa-file-signature', 'bg-danger text-white')}
        </div>

        <div class="row g-4 mb-4">
            <!-- Capaian Target Kelulusan per Rombel -->
            <div class="col-lg-8">
                <div class="card-enterprise p-4 mb-4">
                    <h6 class="font-poppins fw-bold mb-3 text-primary-azhar"><i class="fas fa-chart-line me-2"></i>Persentase Capaian Target Kelulusan Per Kelas</h6>
                    <div class="table-responsive">
                        <table class="table table-hover font-inter align-middle small text-center">
                            <thead class="table-light">
                                <tr><th class="text-start">Rombel Aktif</th><th>Total Murid</th><th>Rata-rata Juz</th><th>Status Capaian</th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="text-start fw-bold">Kelas VII - A (Reguler)</td><td>32 Murid</td><td>1.5 Juz</td><td><span class="badge bg-success">On Target (90%)</span></td></tr>
                                <tr><td class="text-start fw-bold">Kelas VIII - A (Abu Bakar)</td><td>30 Murid</td><td>2.8 Juz</td><td><span class="badge bg-primary">Excellent (95%)</span></td></tr>
                                <tr><td class="text-start fw-bold">Kelas IX - C (Acak)</td><td>28 Murid</td><td>4.2 Juz</td><td><span class="badge bg-warning text-dark">Warning (72%)</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- INFO PENTING BARU: Tren Grafik Pelanggaran Moral/Adab Murid Global -->
                <div class="card-enterprise p-4">
                    <h6 class="font-poppins fw-bold mb-3 text-danger"><i class="fas fa-chart-area me-2"></i>Tren Angka Pelanggaran Adab Murid Bulanan</h6>
                    <div style="position: relative; height:200px; width:100%;">
                        <canvas id="chartKepsekAdab"></canvas>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <!-- Finansial Makro Kurban -->
                <div class="card-enterprise p-4 border-top border-4 border-success mb-4">
                    <h6 class="font-poppins fw-bold mb-3 text-success"><i class="fas fa-hand-holding-usd me-2"></i>Akumulasi Kurban Sekolah</h6>
                    <div class="font-inter small mb-3">
                        <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                            <span class="text-muted">Total Pembeli Kurban:</span>
                            <span class="fw-bold text-dark">24 Murid</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted">Dana Kas Terkumpul:</span>
                            <span class="fw-bold text-success">Rp48.200.000</span>
                        </div>
                    </div>
                    <button class="btn btn-primary-azhar btn-sm w-100" onclick="alert('Unduh PDF Ringkasan Keuangan...')"><i class="fas fa-file-download me-2"></i>Unduh Laporan Keuangan</button>
                </div>

                <!-- INFO PENTING BARU: Real-time Aktivitas Dokumen/Sertifikat Keluar -->
                <div class="card-enterprise p-4 border-top border-4 border-warning">
                    <h6 class="font-poppins fw-bold mb-3 text-dark"><i class="fas fa-history me-2 text-warning"></i>Log Validasi Sertifikat & Dokumen</h6>
                    <div class="font-inter small" style="max-height: 200px; overflow-y: auto;">
                        <div class="p-2 border-bottom mb-1 bg-light rounded">
                            <span class="d-block fw-bold text-dark">Sertifikat Juz 30 - Muhammad Fatih</span>
                            <small class="text-muted">Hari ini • Sukses Dicetak Admin</small>
                        </div>
                        <div class="p-2 bg-light rounded">
                            <span class="d-block fw-bold text-dark">Raport Semester Ganjil - Kelas 7A</span>
                            <small class="text-muted">Kemarin • Disetujui Wali Kelas</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;

    setTimeout(() => {
        // Render Line/Bar Chart untuk monitoring Kepsek
        const ctx = document.getElementById('chartKepsekAdab');
        if(ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                    datasets: [{ label: 'Kasus Adab', data: [12, 8, 5, 2, 6, 1], borderColor: '#dc3545', tension: 0.3, fill: false }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }, 50);
}

// --- TEMPLATE: ADMIN DASHBOARD ---
async function renderAdminDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Sistem Pemantauan Utama Admin</h4>
        <div class="row g-3 mb-4">
            ${createCard('TOTAL MURID', '420 Anak', 'fa-users', 'bg-primary text-white')}
            ${createCard('TOTAL GURU', '35 User', 'fa-chalkboard-teacher', 'bg-success text-white')}
            ${createCard('TOTAL SETORAN', '1.250 Kali', 'fa-quran', 'bg-info text-white')}
            ${createCard('BERHALANGAN', '12 Izin', 'fa-calendar-minus', 'bg-danger text-white')}
        </div>
        <div class="card-enterprise p-5 text-center">
            <i class="fas fa-user-shield fa-3x text-primary-azhar mb-3"></i>
            <h5>Selamat Datang di Panel Utama Admin</h5>
            <p class="text-muted small">Gunakan menu navigasi samping untuk mengakses data master guru, murid (NIS), penempatan rombel acak, atau menu pengaturan di bagian paling bawah.</p>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: GURU DASHBOARD ---
async function renderGuruDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Ruang Kelas & Binaan Wali Kelas</h4>
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 border-start border-4 border-primary">
                    <h6 class="font-poppins fw-bold mb-2">Informasi Akses Guru</h6>
                    <p class="text-muted small mb-0">Data kelas tersaring otomatis berdasarkan penugasan NIPY Anda pada tahun ajaran ${AppState.tahunAjaran}.</p>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card-enterprise p-4 border-top border-4 border-danger">
                    <h6 class="font-poppins fw-bold mb-2 text-danger"><i class="fas fa-user-clock me-2"></i>Belum Setoran Pekan Ini</h6>
                    <span class="small font-inter text-muted">Ahmad Fauzan (8A)</span>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: AYAH BUNDA DASHBOARD ---
async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <div class="card-enterprise p-4 mb-4 bg-primary-azhar text-white shadow-sm">
            <h4 class="font-poppins fw-bold mb-1" style="font-size: 18px;">Profil Akun Murid: Muhammad Fatih</h4>
            <p class="mb-0 text-gold font-inter small fw-medium">Kelas VIII - Abu Bakar • NIS: 1023412</p>
        </div>
        ${createFooterHTML()}
    `;
}

// --- TEMPLATE: PUSAT DOKUMEN ---
async function renderDokumenView() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Arsip Dokumen & Pelacakan Nilai (Kunci NIS)</h4>
        <div class="card-enterprise p-4">
            <div class="table-responsive">
                <table class="table table-hover font-inter align-middle text-center small">
                    <thead class="table-light">
                        <tr><th>NIS</th><th>Nama Murid</th><th>Rombel</th><th>Raport Digital</th><th>Cetak Sertifikat</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1023412</td><td class="text-start fw-bold">Muhammad Fatih</td><td>VIII - Abu Bakar</td><td><button class="btn btn-sm btn-outline-primary" onclick="alert('Unduh Raport...')"><i class="fas fa-file-pdf"></i> Unduh</button></td><td><button class="btn btn-sm btn-gold text-dark fw-bold" onclick="alert('Mencetak Sertifikat Resmi Berbasis NIS...')"><i class="fas fa-print"></i> Cetak</button></td></tr>
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
        <div class="col-6 col-sm-4 col-xl-3">
            <div class="card-enterprise p-3 h-100 d-flex flex-column align-items-center text-center justify-content-center">
                <div class="rounded-circle d-flex justify-content-center align-items-center mb-2 ${iconBgClass}" style="width: 45px; height: 45px;">
                    <i class="fas ${icon} fa-md"></i>
                </div>
                <div>
                    <h6 class="text-muted font-inter mb-1 text-uppercase" style="font-size: 9px; letter-spacing: 0.5px;">${title}</h6>
                    <h4 class="font-poppins fw-bold mb-0 text-dark" style="font-size: 13px;">${value}</h4>
                </div>
            </div>
        </div>
    `;
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
                else if(userIn === "ortu") { role = "AYAH_BUNDA"; namaReal = "Ayahanda M. Fatih"; }
                
                resolve({
                    success: true,
                    data: { NAMA: namaReal, USERNAME: payload.username, ROLE: role, JENIS_KELAMIN: "Laki-laki" }
                });
            } else { resolve({ success: true, data: {} }); }
        }, 100);
    });
}
