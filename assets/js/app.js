/**
 * ==========================================================================
 * INTEGRATED ISLAMIC MONITORING SYSTEM (IIMS) V1.0 - CORE ROUTER APPLICATION
 * DATABASE & MODULE ALIGNMENT SYSTEM MATRIX
 * PENGATURAN DATABASE & SINKRONISASI GS MATRIX ACTIVE
 * Developer: M. Renaldi A. S
 * ==========================================================================
 */

const GAS_URL = "https://script.google.com/macros/s/AKfycby8j5M1bNm7_vYF2V_b5S2wHwS-u-8nC9m-Z9Ym_Lg/exec";

// Pemetaan Representasi Koleksi Tabel Database Google Sheets
const DB_SHEETS = {
    PENGATURAN: "PENGATURAN", SYSTEM_SETTING: "SYSTEM_SETTING", ROLE: "ROLE", USER: "USER",
    GURU: "GURU", MURID: "MURID", KELAS: "KELAS", MASTER_TAHUN_AJARAN: "MASTER_TAHUN_AJARAN",
    TARGET_HAFALAN: "TARGET_HAFALAN", MASTER_SURAH: "MASTER_SURAH", MASTER_ADAB: "MASTER_ADAB",
    MASTER_PEMBINAAN: "MASTER_PEMBINAAN", MASTER_INSPIRASI: "MASTER_INSPIRASI", PENGATURAN_SERTIFIKAT: "PENGATURAN_SERTIFIKAT",
    PENEMPATAN_KELAS: "PENEMPATAN_KELAS", SETORAN_TAHFIDZ: "SETORAN_TAHFIDZ", PROGRES_HAFALAN: "PROGRES_HAFALAN",
    SURAH_SELESAI: "SURAH_SELESAI", RAPORT_TAHFIDZ: "RAPORT_TAHFIDZ", SERTIFIKAT_TAHFIDZ: "SERTIFIKAT_TAHFIDZ",
    KEPUTRIAN: "KEPUTRIAN", PEMBINAAN: "PEMBINAAN", TABUNGAN_KURBAN: "TABUNGAN_KURBAN",
    KURBAN_SETORAN: "KURBAN_SETORAN", PENGUMUMAN: "PENGUMUMAN", APPROVAL: "APPROVAL",
    DOKUMEN: "DOKUMEN", AUDIT_LOG: "AUDIT_LOG", LOGIN_LOG: "LOGIN_LOG", BACKUP_LOG: "BACKUP_LOG", VERSI: "VERSI"
};

// Pemetaan Modul Google Apps Script Terdaftar (.gs Backend Architecture)
const BACKEND_MODULES = [
    "01_Config.gs", "02_Utils.gs", "03_Database.gs", "04_Audit.gs", "05_Auth.gs",
    "06_User.gs", "07_Guru.gs", "08_Murid.gs", "09_Kelas.gs", "10_Tahfidz.gs",
    "11_RaportTahfidz.gs", "12_SertifikatTahfidz.gs", "13_Keputrian.gs", "14_Pembinaan.gs",
    "15_Kurban.gs", "16_Pengumuman.gs", "17_Approval.gs", "18_Dashboard.gs",
    "19_Dokumen.gs", "20_Backup.gs", "21_Router.gs"
];

function getElementSecure(selector) {
    return document.querySelector(selector) || document.createElement('div');
}

const DOM = {
    loginPage: () => getElementSecure('#login-page'), mainLayout: () => getElementSecure('#main-layout'),
    loginForm: () => getElementSecure('#login-form'), usernameInput: () => getElementSecure('#username'),
    passwordInput: () => getElementSecure('#password'), btnLogin: () => getElementSecure('#btn-login'),
    loginText: () => getElementSecure('#login-text'), loginSpinner: () => getElementSecure('#login-spinner'),
    sidebarMenu: () => getElementSecure('#sidebar-menu-container'), routerView: () => getElementSecure('#router-view'),
    currentViewTitle: () => getElementSecure('#current-view-title'), navUserName: () => getElementSecure('#nav-user-name'),
    btnLogout: () => getElementSecure('#btn-logout'), sidebarToggle: () => getElementSecure('#sidebarToggle'),
    sidebar: () => getElementSecure('#sidebar')
};

// Hubungan Antara Role Menu dengan Master Sheet DB & Script Module
const SYSTEM_ROLE_MENU = {
    ADMIN: [
        { id: 'dashboard', name: 'Dashboard Kontrol', icon: 'fa-chart-pie', sheet: DB_SHEETS.SYSTEM_SETTING, gs: "18_Dashboard.gs" },
        { id: 'data-guru', name: 'Master Data Guru', icon: 'fa-user-tie', sheet: DB_SHEETS.GURU, gs: "07_Guru.gs" },
        { id: 'data-murid', name: 'Master Data Murid', icon: 'fa-user-graduate', sheet: DB_SHEETS.MURID, gs: "08_Murid.gs" },
        { id: 'tahfidz-global', name: 'Monitoring Tahfidz', icon: 'fa-book-quran', sheet: DB_SHEETS.SETORAN_TAHFIDZ, gs: "10_Tahfidz.gs" },
        { id: 'pembinaan-adab', name: 'Sistem Pembinaan Adab', icon: 'fa-scale-balanced', sheet: DB_SHEETS.MASTER_ADAB, gs: "14_Pembinaan.gs" }
    ],
    GURU: [
        { id: 'dashboard', name: 'Dashboard Kelas Binaan', icon: 'fa-gauge-high', sheet: DB_SHEETS.PENEMPATAN_KELAS, gs: "18_Dashboard.gs" },
        { id: 'monitoring-kelas', name: 'Monitoring Kelas', icon: 'fa-chalkboard-user', sheet: DB_SHEETS.KELAS, gs: "09_Kelas.gs" },
        { id: 'keputrian', name: 'Catatan Agenda Keputrian', icon: 'fa-venus', sheet: DB_SHEETS.KEPUTRIAN, gs: "13_Keputrian.gs" }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', name: 'Dashboard Operasional', icon: 'fa-book-open', sheet: DB_SHEETS.PROGRES_HAFALAN, gs: "18_Dashboard.gs" },
        { id: 'jurnal-setoran', name: 'Input Log Hafalan', icon: 'fa-pen-to-square', sheet: DB_SHEETS.SETORAN_TAHFIDZ, gs: "10_Tahfidz.gs" }
    ],
    KEPSEK: [
        { id: 'dashboard', name: 'Dashboard Executive', icon: 'fa-building-shield', sheet: DB_SHEETS.PENGATURAN, gs: "18_Dashboard.gs" },
        { id: 'monitoring-kinerja', name: 'Kinerja Lembaga', icon: 'fa-chart-line', sheet: DB_SHEETS.AUDIT_LOG, gs: "04_Audit.gs" }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', name: 'Informasi Ananda', icon: 'fa-house-user', sheet: DB_SHEETS.RAPORT_TAHFIDZ, gs: "11_RaportTahfidz.gs" }
    ]
};

let currentSessionState = { isValid: false, username: '', role: '', academicYear: '2026/2027', semester: 'Ganjil' };

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
    DOM.loginForm().addEventListener('submit', (e) => { e.preventDefault(); processSecureAuthentication(); });
    DOM.btnLogout().addEventListener('click', () => { destroyActiveSession(); });
    DOM.sidebarToggle().addEventListener('click', () => { DOM.sidebar().classList.toggle('open'); });
}

function processSecureAuthentication() {
    const userVal = DOM.usernameInput().value.trim();
    DOM.loginText().classList.add('d-none');
    DOM.loginSpinner().classList.remove('d-none');
    DOM.btnLogin().disabled = true;

    setTimeout(() => {
        currentSessionState.isValid = true;
        currentSessionState.username = userVal || "User IIMS";
        
        const checkRole = userVal.toUpperCase();
        if (checkRole.includes('ADMIN')) currentSessionState.role = 'ADMIN';
        else if (checkRole.includes('TAHFIDZ')) currentSessionState.role = 'GURU_TAHFIDZ';
        else if (checkRole.includes('GURU')) currentSessionState.role = 'GURU';
        else if (checkRole.includes('KEPSEK')) currentSessionState.role = 'KEPSEK';
        else if (checkRole.includes('WALI') || checkRole.includes('AYAH') || checkRole.includes('BUNDA')) currentSessionState.role = 'AYAH_BUNDA';
        else currentSessionState.role = 'ADMIN';

        DOM.loginSpinner().classList.add('d-none');
        DOM.loginText().classList.remove('d-none');
        DOM.btnLogin().disabled = false;

        renderEnvironmentStructure();
    }, 400);
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
            <a href="#" class="link-item-premium ${isCurrent}" data-id="${menu.id}" data-sheet="${menu.sheet}" data-gs="${menu.gs}">
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
                renderSubFeatureModulePlaceholder(targetLink.getAttribute('data-sheet'), targetLink.getAttribute('data-gs'));
            }
            DOM.sidebar().classList.remove('open');
        });
    });
}

function dispatchDashboardViewRenderer(role) {
    let htmlBuffer = `<div class="islamic-fine-overlay">
        <div class="welcome-card-premium">
            <div class="welcome-intro">Selamat Datang,</div>
            <div class="welcome-user-slug">${currentSessionState.username}</div>
            <div class="mt-2">
                <span class="role-badge-pill"><i class="fa-solid fa-user-shield me-1"></i> Peran: ${role}</span>
                <span class="academic-badge-pill"><i class="fa-solid fa-calendar-check me-1"></i> TA ${currentSessionState.academicYear} - ${currentSessionState.semester}</span>
            </div>
        </div>
        <div class="islamic-quote-box">
            <div class="d-flex align-items-start">
                <div class="me-3 text-warning fs-4"><i class="fa-solid fa-book-quran"></i></div>
                <div>
                    <div class="arabic-script-render mb-1">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</div>
                    <div class="translation-script-render mb-2">"Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya."</div>
                    <div class="source-script-render"><i class="fa-solid fa-feather-pointed me-1"></i> HR. Bukhari (Ref Matrix: ${DB_SHEETS.MASTER_INSPIRASI})</div>
                </div>
            </div>
        </div>
    `;

    if (role === 'ADMIN') htmlBuffer += renderAdminDashboardPayload();
    else if (role === 'GURU') htmlBuffer += renderGuruDashboardPayload();
    else if (role === 'GURU_TAHFIDZ') htmlBuffer += renderGuruTahfidzDashboardPayload();
    else if (role === 'KEPSEK') htmlBuffer += renderKepsekDashboardPayload();
    else if (role === 'AYAH_BUNDA') htmlBuffer += renderParentDashboardPayload();

    htmlBuffer += `</div>`;
    DOM.routerView().innerHTML = htmlBuffer;
    initiateCanvasChartEngine(role);
}

function renderAdminDashboardPayload() {
    return `
        <div class="row g-3 mb-4">
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Tabel: ${DB_SHEETS.MURID}</div><div class="kpi-metric-number">420</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Tabel: ${DB_SHEETS.GURU}</div><div class="kpi-metric-number">35</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">${DB_SHEETS.SURAH_SELESAI}</div><div class="kpi-metric-number">1,240</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Pembinaan</div><div class="kpi-metric-number">12</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">${DB_SHEETS.PENGUMUMAN}</div><div class="kpi-metric-number">3</div></div></div>
            <div class="col-6 col-xl-2"><div class="card-kpi-premium"><div class="kpi-label-text">Kurban</div><div class="kpi-metric-number">42</div></div></div>
        </div>
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-bar"></i> Sinkronisasi ${BACKEND_MODULES[17]}</div><div style="height:250px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-server"></i> Log Masuk Database (${DB_SHEETS.LOGIN_LOG})</div>
                <table class="table table-premium-lock"><thead><tr><th>User</th><th>Aktivitas</th><th>Status</th></tr></thead><tbody><tr><td>Admin System</td><td>Ref: ${BACKEND_MODULES[2]}</td><td><span class="badge-status-positive">Berhasil</span></td></tr></tbody></table>
            </div></div>
        </div>
    `;
}

function renderGuruDashboardPayload() {
    return `
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Ref: ${DB_SHEETS.KELAS}</div><div class="kpi-metric-number">IX-A</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Sudah Setor</div><div class="kpi-metric-number">28</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Belum Setor</div><div class="kpi-metric-number">4</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">${DB_SHEETS.KEPUTRIAN}</div><div class="kpi-metric-number">6 Baru</div></div></div>
        </div>
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-line"></i> Kepatuhan (${DB_SHEETS.SETORAN_TAHFIDZ})</div><div style="height:230px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-table-list"></i> Jurnal Jurnal Binaan (${BACKEND_MODULES[12]})</div>
                <table class="table table-premium-lock"><thead><tr><th>Siswa</th><th>Agenda</th><th>Keterangan</th></tr></thead><tbody><tr><td>Fatima Az-Zahra</td><td>Fiqh Wanita</td><td><span class="badge-status-positive">Hadir</span></td></tr></tbody></table>
            </div></div>
        </div>
    `;
}

function renderGuruTahfidzDashboardPayload() {
    return `
        <div class="row g-3 mb-4">
            <div class="col-12 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Halaqah Kerja</div><div class="kpi-metric-number">Kelompok 3</div></div></div>
            <div class="col-6 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Sudah Setor (${DB_SHEETS.SETORAN_TAHFIDZ})</div><div class="kpi-metric-number">14</div></div></div>
            <div class="col-6 col-md-4"><div class="card-kpi-premium"><div class="kpi-label-text">Belum Setor</div><div class="kpi-metric-number">2</div></div></div>
        </div>
        <div class="row g-4 mb-4">
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-chart-column"></i> Kurva Progres (${DB_SHEETS.PROGRES_HAFALAN})</div><div style="height:230px;"><canvas id="chart-slot"></canvas></div></div></div>
            <div class="col-12 col-lg-6"><div class="section-block-premium"><div class="section-block-title"><i class="fa-solid fa-bolt"></i> Realtime Feed (${BACKEND_MODULES[9]})</div>
                <table class="table table-premium-lock"><thead><tr><th>Nama Murid</th><th>Surah</th><th>Status</th></tr></thead><tbody><tr><td>Usman bin Affan</td><td>Al-Mulk: 1-10</td><td><span class="badge-status-positive">Mumtaz</span></td></tr></tbody></table>
            </div></div>
        </div>
    `;
}

function renderKepsekDashboardPayload() {
    return `
        <div class="row g-3 mb-4">
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Target Ketuntasan</div><div class="kpi-metric-number">92.4%</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">SDM Pendidik</div><div class="kpi-metric-number">35 Aktif</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Index Adab</div><div class="kpi-metric-number">A (Mumtaz)</div></div></div>
            <div class="col-6 col-md-3"><div class="card-kpi-premium"><div class="kpi-label-text">Kurban Terdata</div><div class="kpi-metric-number">18 Sapi</div></div></div>
        </div>
    `;
}

function renderParentDashboardPayload() {
    return `
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-id-card"></i> Identitas Ananda (${DB_SHEETS.PENEMPATAN_KELAS})</div>
            <div class="student-meta-box">
                <div class="row">
                    <div class="col-6"><strong>Nama Ananda:</strong> <span class="text-primary">Muhammad Rayhan</span></div>
                    <div class="col-6"><strong>Target Kelas:</strong> VII-B</div>
                </div>
            </div>
        </div>
        <div class="row g-3 mb-3">
            <div class="col-6"><div class="card-kpi-premium"><div class="kpi-label-text">Capaian (${DB_SHEETS.PROGRES_HAFALAN})</div><div class="kpi-metric-number">3 Juz</div></div></div>
            <div class="col-6"><div class="card-kpi-premium"><div class="kpi-label-text">Kurban (${DB_SHEETS.TABUNGAN_KURBAN})</div><div class="kpi-metric-number">Rp 3,5jt</div></div></div>
        </div>
        <div class="section-block-premium mb-3">
            <div class="section-block-title"><i class="fa-solid fa-chart-line"></i> Grafik Mingguan Ananda</div>
            <div style="height:200px;"><canvas id="chart-slot"></canvas></div>
        </div>
    `;
}

function initiateCanvasChartEngine(role) {
    setTimeout(() => {
        const ctx = document.getElementById('chart-slot');
        if (!ctx) return;
        let chartType = 'bar';
        let dataSets = [12, 19, 3, 5, 2];
        let bgCol = '#0A3663';

        if (role === 'AYAH_BUNDA') { chartType = 'line'; dataSets = [4, 8, 12, 15, 20]; bgCol = '#D4AF37'; }

        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: chartType,
            data: {
                labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
                datasets: [{ label: 'Progress', data: dataSets, backgroundColor: bgCol, borderColor: bgCol, borderWidth: 1 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
    }, 60);
}

function renderSubFeatureModulePlaceholder(sheetName, scriptFile) {
    DOM.routerView().innerHTML = `
        <div class="section-block-premium animate-fade">
            <div class="section-block-title"><i class="fa-solid fa-network-wired"></i> Modul Konektor: ${scriptFile}</div>
            <p class="text-muted">Jalur Request diarahkan ke tabel <strong>${sheetName}</strong> memanfaatkan router sistem <strong>21_Router.gs</strong>.</p>
            <div class="alert alert-secondary bg-light text-dark"><i class="fa-solid fa-database me-2"></i> Melakukan Fetch Sinkronisasi Aman ke Endpoint Google App Script...</div>
            <div class="text-center p-3"><div class="spinner-border text-primary" role="status"></div></div>
        </div>
    `;
}

function destroyActiveSession() {
    currentSessionState.isValid = false; currentSessionState.username = ''; currentSessionState.role = '';
    DOM.usernameInput().value = ''; DOM.passwordInput().value = '';
    runApplicationRouting();
}
