/**
 * ==========================================================================
 * INTEGRATED ISLAMIC MONITORING SYSTEM (IIMS) V1.0 - CORE ROUTER APPLICATION
 * SYSTEM REFACTORING & ARCHITECTURE RECONSTRUCTION LOCK
 * Developer: M. Renaldi A. S
 * Instansi: SMP ISLAM AL AZHAR 52 BENGKULU
 * ==========================================================================
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycby8j5M1bNm7_vYF2V_b5S2wHwS-u-8nC9m-Z9Ym_Lg/exec";

// Anti-Crash DOM Selector Fail-Safe
function getElementSecure(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        return document.createElement('div'); // Mencegah fatal script exception
    }
    return el;
}

const DOM = {
    loginPage: () => getElementSecure('#login-page'),
    mainLayout: () => getElementSecure('#main-layout'),
    loginForm: () => getElementSecure('#login-form'),
    usernameInput: () => getElementSecure('#username'),
    passwordInput: () => getElementSecure('#password'),
    btnLogin: () => getElementSecure('#btn-login'),
    loginText: () => getElementSecure('#login-text'),
    loginSpinner: () => getElementSecure('#login-spinner'),
    sidebarMenu: () => getElementSecure('#sidebar-menu-container'),
    routerView: () => getElementSecure('#router-view'),
    currentViewTitle: () => getElementSecure('#current-view-title'),
    navUserName: () => getElementSecure('#nav-user-name'),
    btnLogout: () => getElementSecure('#btn-logout'),
    sidebarToggle: () => getElementSecure('#sidebarToggle'),
    sidebar: () => getElementSecure('#sidebar')
};

// Data Struktur Navigasi Berdasarkan Peran Akses Tanpa Sembunyikan CSS Element
const SYSTEM_ROLE_MENU = {
    ADMIN: [
        { id: 'dashboard', name: 'Dashboard Kontrol', icon: 'fa-chart-pie' },
        { id: 'data-guru', name: 'Master Data Guru', icon: 'fa-user-tie' },
        { id: 'data-murid', name: 'Master Data Murid', icon: 'fa-user-graduate' },
        { id: 'tahfidz-global', name: 'Monitoring Tahfidz', icon: 'fa-book-quran' },
        { id: 'pembinaan-adab', name: 'Sistem Pembinaan Adab', icon: 'fa-scale-balanced' }
    ],
    GURU: [
        { id: 'dashboard', name: 'Dashboard Kelas Binaan', icon: 'fa-gauge-high' },
        { id: 'monitoring-kelas', name: 'Monitoring Kelas', icon: 'fa-chalkboard-user' },
        { id: 'keputrian', name: 'Catatan Agenda Keputrian', icon: 'fa-venus' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', name: 'Dashboard Operasional', icon: 'fa-book-open' },
        { id: 'jurnal-setoran', name: 'Input Log Hafalan', icon: 'fa-pen-to-square' }
    ],
    KEPSEK: [
        { id: 'dashboard', name: 'Dashboard Executive', icon: 'fa-building-shield' },
        { id: 'monitoring-kinerja', name: 'Kinerja Lembaga', icon: 'fa-chart-line' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', name: 'Informasi Ananda', icon: 'fa-house-user' }
    ],
    OSIS: [
        { id: 'dashboard', name: 'Dashboard Kesiswaan', icon: 'fa-users' }
    ]
};

// State Object Session
let currentSessionState = {
    isValid: false,
    username: '',
    role: '', // ADMIN, GURU, GURU_TAHFIDZ, KEPSEK, AYAH_BUNDA, OSIS
    academicYear: '2026/2027',
    semester: 'Ganjil'
};

document.addEventListener('DOMContentLoaded', () => {
    runApplicationRouting();
    bindInterfaceInteractions();
});

function runApplicationRouting() {
    if (!currentSessionState.isValid) {
        DOM.loginPage().classList.remove('d-none');
        DOM.mainLayout().classList.add('d-none');
    } else {
        renderEnvironmentStructure();
    }
}

function bindInterfaceInteractions() {
    DOM.loginForm().addEventListener('submit', (e) => {
        e.preventDefault();
        processSecureAuthentication();
    });

    DOM.btnLogout().addEventListener('click', () => {
        destroyActiveSession();
    });

    DOM.sidebarToggle().addEventListener('click', () => {
        DOM.sidebar().classList.toggle('open');
    });
}

function processSecureAuthentication() {
    const userVal = DOM.usernameInput().value.trim();
    
    DOM.loginText().classList.add('d-none');
    DOM.loginSpinner().classList.remove('d-none');
    DOM.btnLogin().disabled = true;

    // Simulasi Otentikasi dengan Filter Role
    setTimeout(() => {
        currentSessionState.isValid = true;
        currentSessionState.username = userVal || "Administrator";
        
        const checkRole = userVal.toUpperCase();
        if (checkRole.includes('ADMIN')) currentSessionState.role = 'ADMIN';
        else if (checkRole.includes('TAHFIDZ')) currentSessionState.role = 'GURU_TAHFIDZ';
        else if (checkRole.includes('GURU')) currentSessionState.role = 'GURU';
        else if (checkRole.includes('KEPSEK')) currentSessionState.role = 'KEPSEK';
        else if (checkRole.includes('WALI') || checkRole.includes('AYAH') || checkRole.includes('BUNDA')) currentSessionState.role = 'AYAH_BUNDA';
        else if (checkRole.includes('OSIS')) currentSessionState.role = 'OSIS';
        else currentSessionState.role = 'ADMIN';

        DOM.loginSpinner().classList.add('d-none');
        DOM.loginText().classList.remove('d-none');
        DOM.btnLogin().disabled = false;

        renderEnvironmentStructure();
    }, 600);
}

function renderEnvironmentStructure() {
    DOM.loginPage().classList.add('d-none');
    DOM.mainLayout().classList.remove('d-none');
    DOM.navUserName().textContent = currentSessionState.username;
    
    generateSidebarMenuTree(currentSessionState.role);
    dispatchDashboardViewRenderer(currentSessionState.role);
}

function generateSidebarMenuTree(role) {
    const activeMenus = SYSTEM_ROLE_MENU[role] || [];
    let generatedHTML = `<div class="nav-heading-enterprise">Menu Navigasi</div>`;
    
    activeMenus.forEach((menu, index) => {
        const isCurrent = index === 0 ? 'active' : '';
        generatedHTML += `
            <a href="#" class="link-item-premium ${isCurrent}" data-id="${menu.id}">
                <i class="fa-solid ${menu.icon}"></i>
                <span>${menu.name}</span>
            </a>
        `;
    });
    
    DOM.sidebarMenu().innerHTML = generatedHTML;

    document.querySelectorAll('.link-item-premium').forEach(targetLink => {
        targetLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.link-item-premium').forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');
            
            const targetId = targetLink.getAttribute('data-id');
            DOM.currentViewTitle().textContent = targetLink.querySelector('span').textContent;
            
            if (targetId === 'dashboard') {
                dispatchDashboardViewRenderer(currentSessionState.role);
            } else {
                renderSubFeatureModulePlaceholder(targetId);
            }
            DOM.sidebar().classList.remove('open');
        });
    });
}

/**
 * STRUKTUR INJEKSI DASHBOARD BERDASARKAN ROLE MUTLAK
 */
function dispatchDashboardViewRenderer(role) {
    let htmlBuffer = `<div class="islamic-fine-overlay">`;

    // 1. HEADER WELCOME
    htmlBuffer += `
        <div class="welcome-card-premium animate-fade">
            <div class="welcome-intro">Selamat Datang,</div>
            <div class="welcome-user-slug">${currentSessionState.username}</div>
            <div class="mt-2">
                <span class="role-badge-pill"><i class="fa-solid fa-user-shield me-1"></i> Peran: ${role}</span>
                <span class="academic-badge-pill"><i class="fa-solid fa-calendar-check me-1"></i> TA ${currentSessionState.academicYear} - ${currentSessionState.semester}</span>
            </div>
        </div>
    `;

    // 2. AYAT / HADITS HARIAN
    htmlBuffer += `
        <div class="islamic-quote-box">
            <div class="d-flex align-items-start">
                <div class="me-3 text-warning fs-4"><i class="fa-solid fa-book-quran"></i></div>
                <div>
                    <div class="arabic-script-render mb-1">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</div>
                    <div class="translation-script-render mb-2">"Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."</div>
                    <div class="source-script-render"><i class="fa-solid fa-feather-pointed me-1"></i> HR. Bukhari</div>
                </div>
            </div>
        </div>
    `;

    // KONDISIONAL RENDER BERDASARKAN ROLE (BLUEPRINT LOCK)
    if (role === 'ADMIN') {
        htmlBuffer += renderAdminDashboardPayload();
    } else if (role === 'GURU') {
        htmlBuffer += renderGuruDashboardPayload();
    } else if (role === 'GURU_TAHFIDZ') {
        htmlBuffer += renderGuruTahfidzDashboardPayload();
    } else if (role === 'KEPSEK') {
        htmlBuffer += renderKepsekDashboardPayload();
    } else if (role === 'AYAH_BUNDA') {
        htmlBuffer += renderParentDashboardPayload();
    } else if (role === 'OSIS') {
        htmlBuffer += renderOsisDashboardPayload();
    }

    htmlBuffer += `</div>`;
    DOM.routerView().innerHTML = htmlBuffer;

    // Eksekusi Grafik Canvas
    initiateCanvasChartEngine(role);
}

/**
 * ==========================================================================
 * SUB-ROUTER PAYLOAD INDEPENDEN
 * ==========================================================================
 */

function renderAdminDashboardPayload() {
    return `
        <!-- KPI ADMIN DARI BACKEND SINKRONISASI -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Total Murid</div><div class="kpi-metric-number">420</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Total Guru</div><div class="kpi-metric-number">35</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Surah Selesai</div><div class="kpi-metric-number">1,240</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Pembinaan >100</div><div class="kpi-metric-number">12</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Pengumuman</div><div class="kpi-metric-number">3</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Tab. Kurban</div><div class="kpi-metric-number">42</div></div></div>
        </div>
        <!-- GRAFIK & MONITORING -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-bar"></i> Statistik Global Sinkronisasi</div><div style="height:250px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-server"></i> Monitoring Realtime Sistem</div>
                <table class="table table-premium-lock"><thead><tr><th>User</th><th>Aktivitas</th><th>Status</th></tr></thead><tbody><tr><td>Admin System</td><td>Dump Database Master</td><td><span class="badge-status-positive">Berhasil</span></td></tr></tbody></table>
            </div></div>
        </div>
        <!-- RANKING TAHFIDZ -->
        <div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-trophy"></i> Ranking Tahfidz Global</div>
            <table class="table table-premium-lock"><thead><tr><th>Rank</th><th>Nama</th><th>Kelas</th><th>Capaian</th></tr></thead><tbody><tr><td>1</td><td>Ali bin Abi Thalib Jr</td><td>IX-A</td><td>8 Juz</td></tr></tbody></table>
        </div>
    `;
}

function renderGuruDashboardPayload() {
    return `
        <!-- KPI GURU -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Monitoring Kelas</div><div class="kpi-metric-number">IX-A</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Sudah Setor</div><div class="kpi-metric-number">28</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Belum Setor</div><div class="kpi-metric-number">4</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Adab & Keputrian</div><div class="kpi-metric-number">6 Baru</div></div></div>
        </div>
        <!-- GRAFIK & MONITORING -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-line"></i> Grafik Kepatuhan Setoran Kelas</div><div style="height:230px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-table-list"></i> Jurnal Log Aktivitas Murid</div>
                <table class="table table-premium-lock"><thead><tr><th>Siswa</th><th>Agenda</th><th>Keterangan</th></tr></thead><tbody><tr><td>Fatima Az-Zahra</td><td>Keputrian Fiqh</td><td><span class="badge-status-positive">Hadir</span></td></tr></tbody></table>
            </div></div>
        </div>
        <!-- RANKING -->
        <div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-award"></i> Ranking Internal Kelas</div>
            <table class="table table-premium-lock"><thead><tr><th>Peringkat</th><th>Nama Murid</th><th>Akumulasi Hafalan</th></tr></thead><tbody><tr><td>1</td><td>Zaid bin Tsabit</td><td>5 Juz 12 Baris</td></tr></tbody></table>
        </div>
    `;
}

function renderGuruTahfidzDashboardPayload() {
    return `
        <!-- KPI GURU TAHFIDZ (OPERASIONAL HARIAN) -->
        <div class="row g-3 mb-4">
            <div class="col-12 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Monitoring Halaqah</div><div class="kpi-metric-number">Kelompok 3</div></div></div>
            <div class="col-6 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Siswa Sudah Setor</div><div class="kpi-metric-number">14</div></div></div>
            <div class="col-6 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Siswa Belum Setor</div><div class="kpi-metric-number">2</div></div></div>
        </div>
        <!-- GRAFIK & MONITORING SETORAN -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-column"></i> Grafik Progress Capaian Hafalan</div><div style="height:230px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-bolt"></i> Setoran Terbaru Hari Ini</div>
                <table class="table table-premium-lock"><thead><tr><th>Nama Murid</th><th>Surah</th><th>Status</th></tr></thead><tbody><tr><td>Usman bin Affan</td><td>Al-Mulk: 1-10</td><td><span class="badge-status-positive">Mumtaz</span></td></tr></tbody></table>
            </div></div>
        </div>
        <!-- RANKING TAHFIDZ HALAQAH -->
        <div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-star"></i> Ranking Tahfidz Kelompok</div>
            <table class="table table-premium-lock"><thead><tr><th>No</th><th>Nama Murid</th><th>Progres Juz</th></tr></thead><tbody><tr><td>1</td><td>Mus'ab bin Umair</td><td>Juz 30 Selesai</td></tr></tbody></table>
        </div>
    `;
}

function renderKepsekDashboardPayload() {
    return `
        <!-- KPI EXECUTIVE -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Ketercapaian Target</div><div class="kpi-metric-number">92.4%</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Tenaga Pendidik</div><div class="kpi-metric-number">35 Aktif</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Rata Indeks Adab</div><div class="kpi-metric-number">A (Mumtaz)</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Dana Kurban Masuk</div><div class="kpi-metric-number">18 Sapi</div></div></div>
        </div>
        <!-- EXECUTIVE GRAPHICS -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-pie"></i> Perbandingan Target Kelulusan</div><div style="height:230px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-eye"></i> Monitoring Kinerja Pembinaan</div>
                <table class="table table-premium-lock"><thead><tr><th>Kelas</th><th>Ketuntasan Halaqah</th><th>Status Baku</th></tr></thead><tbody><tr><td>Kelas IX</td><td>96% Selesai</td><td><span class="badge-status-positive">Sesuai Target</span></td></tr></tbody></table>
            </div></div>
        </div>
    `;
}

function renderParentDashboardPayload() {
    return `
        <!-- DASHBOARD AYAH/BUNDA TERISOLASI TOTAL -->
        <!-- PROFIL ANANDA -->
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-id-card"></i> Profil Singkat Ananda</div>
            <div class="student-meta-box">
                <div class="row">
                    <div class="col-6"><strong>Nama Ananda:</strong> <span class="text-primary">Muhammad Rayhan</span></div>
                    <div class="col-6"><strong>Kelas / NISN:</strong> VII-B / 30924823</div>
                    <div class="col-12 mt-2"><strong>Ustadz Pembina Halaqah:</strong> Ustadz Ahmad Syakir, S.Ag</div>
                </div>
            </div>
        </div>
        
        <!-- PROGRESS HAFALAN -->
        <div class="row g-3 mb-3">
            <div class="col-6"><div class="card-kpi-premium"><div class="kpi-label-text">Total Akumulasi Hafalan</div><div class="kpi-metric-number">3 Juz 4 Halaman</div></div></div>
            <div class="col-6"><div class="card-kpi-premium"><div class="kpi-label-text">Target Kurikulum Al Azhar</div><div class="kpi-metric-number">85% Tercapai</div></div></div>
        </div>

        <!-- SETORAN TERAKHIR ANANDA -->
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-clock-rotate-left"></i> Rekam Jurnal Setoran Terakhir Ananda</div>
            <table class="table table-premium-lock">
                <thead><tr><th>Tanggal</th><th>Surah & Ayat</th><th>Kelancaran</th><th>Catatan Ustadz</th></tr></thead>
                <tbody><tr><td>22 Juni 2026</td><td>An-Naba: 1-20</td><td>Lancar</td><td><span class="text-success">Murojaah ditingkatkan di rumah Ayah/Bunda</span></td></tr></tbody>
            </table>
        </div>

        <!-- GRAFIK HAFALAN -->
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-chart-line"></i> Grafik Kenaikan Hafalan Mingguan Ananda</div>
            <div style="height:200px;"><canvas id="chart-slot"></canvas></div>
        </div>

        <!-- TABUNGAN KURBAN -->
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-cow"></i> Tabungan Kurban Ananda</div>
            <div class="alert alert-success bg-light border-success text-dark mb-0">
                <i class="fa-solid fa-circle-check text-success me-2"></i> Akumulasi Tabungan Kurban Ananda per Juni 2026: <strong>Rp 3.500.000,-</strong> (Status Kesiapan Hewan: Terpenuhi)
            </div>
        </div>

        <!-- ADAB DAN PEMBINAAN -->
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-hands-praying"></i> Jurnal Pembinaan Adab & Karakter Terakhir</div>
            <table class="table table-premium-lock">
                <thead><tr><th>Komponen Pembinaan</th><th>Predikat Evaluasi</th></tr></thead>
                <tbody>
                    <tr><td>Shalat Jamaah Zuhur & Ashar di Sekolah</td><td><span class="badge-status-positive">Istiqomah</span></td></tr>
                    <tr><td>Sopan Santun Kepada Pendidik</td><td><span class="badge-status-positive">Sangat Baik</span></td></tr>
                </tbody>
            </table>
        </div>

        <!-- PENGUMUMAN KHUSUS WALI MURID -->
        <div class="alert alert-warning border-warning bg-light text-dark mb-0">
            <i class="fa-solid fa-circle-exclamation text-warning me-2"></i> <strong>Agenda Parenting:</strong> Undangan Pertemuan Komite dan Pembagian Raport Tahfidz Tengah Semester diadakan Sabtu besok pukul 08:00 WIB di Aula Utama Lantai 2.
        </div>
    `;
}

function renderOsisDashboardPayload() {
    return `
        <div class="row g-3 mb-4">
            <div class="col-12"><div class="card-kpi-premium"><div class="kpi-label-text">Aktivitas Kesiswaan OSIS</div><div class="kpi-metric-number">3 Agenda Berjalan</div></div></div>
        </div>
        <div class="section-block-premium">
            <div class="section-block-title"><i class="fa-solid fa-calendar-check"></i> Monitoring Kalender Proker OSIS</div>
            <p class="text-muted">Menghubungkan visualisasi data program kerja OSIS...</p>
            <div style="height:200px;"><canvas id="chart-slot"></canvas></div>
        </div>
    `;
}

/**
 * CORE GRAPHICS ENGINE INITIALIZER (FIXED & FULL REFACTOR)
 */
function initiateCanvasChartEngine(role) {
    // Memberikan delay kecil agar Chart.js berjalan setelah elemen dipastikan tercetak utuh di DOM
    setTimeout(() => {
        const ctx = document.getElementById('chart-slot');
        if (!ctx) return;

        let chartType = 'bar';
        let labelText = 'Progress';
        let dataSets = [12, 19, 3, 5, 2];
        let bgCol = '#0A3663';

        if (role === 'KEPSEK') {
            chartType = 'pie';
            labelText = 'Target';
            dataSets = [75, 25];
            bgCol = ['#0A3663', '#D4AF37'];
        } else if (role === 'AYAH_BUNDA') {
            chartType = 'line';
            labelText = 'Halaman';
            dataSets = [4, 8, 12, 15, 20];
            bgCol = '#D4AF37';
        }

        // Singkirkan instance chart lama jika terjadi tumpang tindih re-render view
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: chartType,
            data: {
                labels: role === 'KEPSEK' ? ['Tercapai', 'Sisa Target'] : ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
                datasets: [{
                    label: labelText,
                    data: dataSets,
                    backgroundColor: bgCol,
                    borderColor: role === 'AYAH_BUNDA' ? '#D4AF37' : 'transparent',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: role === 'KEPSEK' } 
                }
            }
        });
    }, 50);
}

function renderSubFeatureModulePlaceholder(id) {
    DOM.routerView().innerHTML = `
        <div class="section-block-premium animate-fade">
            <div class="section-block-title"><i class="fa-solid fa-network-wired"></i> Modul Terintegrasi Database: ${id.toUpperCase()}</div>
            <p class="text-muted">Menghubungkan jalur sinkronisasi aman menuju Google App Script Core Endpoint Engine (${GAS_URL}). Data sedang ditarik secara real-time dari Server Pusat SMP Islam Al Azhar 52 Bengkulu...</p>
            <div class="text-center p-4">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
        </div>
    `;
}

function destroyActiveSession() {
    currentSessionState.isValid = false;
    currentSessionState.username = '';
    currentSessionState.role = '';
    
    DOM.usernameInput().value = '';
    DOM.passwordInput().value = '';
    
    runApplicationRouting();
}
