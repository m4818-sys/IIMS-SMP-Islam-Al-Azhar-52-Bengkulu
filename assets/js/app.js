/**
 * ========================================================================
 * IIMS - Integrated Islamic Monitoring System
 * SMP Islam Al-Azhar 52 Bengkulu
 * Berkas Utama Sistem Kontrol - Versi Pemulihan Total (100% Original Style)
 * ========================================================================
 */

// ==========================================
// CONFIGURATION API (MASUKKAN LINK WEB APP DI SINI)
// ==========================================
const GAS_URL = "PASTE_GAS_WEBAPP_URL_HERE"; 

// 1. STATE MANAGEMENT GLOBAL APLIKASI
const AppState = {
    currentRole: 'GURU', // Default awal sesuai screenshot 52 & 53 adalah GURU
    tahunAjaran: 'TA 2026/2027',
    semester: 'Semester Ganjil'
};

// 2. STRUKTUR MENU NAVIGASI MULTI-ROLE (DIJAMIN KEMBAR DENGAN SCREENSHOT)
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
        { id: 'pengaturan-master', icon: 'fa-cogs', text: 'Pengaturan Sistem (10 TA)' }
    ],
    KEPSEK: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Global' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Validasi & Lacak Sertifikat' }
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
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Input Setoran (Halaqah)' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Cetak Raport & Sertifikat' }
    ],
    AYAH_BUNDA: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Ananda' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Perkembangan Tahfidz' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian Ananda' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Perkembangan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban Ananda' },
        { id: 'dokumen-ortu', icon: 'fa-eye', text: 'Pantau Raport & Sertifikat' }
    ],
    OSIS: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Petugas' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-pen-to-square', text: 'Input Catatan Pelanggaran' }
    ]
};

// 3. PENCARI ELEMEN PINTAR (Anti-Crash)
function getElementSmart(selectors) {
    for (let selector of selectors) {
        let el = document.querySelector(selector);
        if (el) return el;
    }
    return null;
}

const getDOM = () => {
    return {
        sidebarMenuContainer: getElementSmart(['#sidebar-menu-container', '#nav-menus', '.sidebar-nav']),
        routerView: getElementSmart(['#router-view', '#main-content', 'main']),
        userGreetingName: getElementSmart(['#user-greeting-name', '#user-greeting']),
        userRoleBadge: getElementSmart(['#user-role-badge', '.badge-role']),
        globalTahunAjaran: getElementSmart(['#global-tahun-ajaran']),
        globalSemester: getElementSmart(['#global-semester']),
        roleSelectorButtons: document.querySelectorAll('.role-select-btn')
    };
};

// 4. TEMPLATE RUNNING TEXT & HADITS (KEMBAR DENGAN SCREENSHOT 52)
function createRunningTextHTML() {
    return `
        <div class="bg-warning text-dark font-inter px-3 py-2 rounded mb-3 shadow-sm d-flex align-items-center" style="font-size: 13px; font-weight: 500;">
            <i class="fas fa-bullhorn me-2"></i>
            <marquee behavior="scroll" direction="left" scrollamount="5">
                Munaqasyah Tahfidz Kelas IX dilaksanakan tanggal 15 Februari 2027. Mohon persiapkan ananda tercinta.
            </marquee>
        </div>
    `;
}

function createHaditsHTML() {
    return `
        <div class="p-3 px-4 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center bg-white" style="border-left: 4px solid #0A3663; line-height: 1.6; font-size: 13.5px;">
            <i class="fas fa-quote-left text-primary-azhar me-3 fa-lg opacity-70"></i>
            <span>"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari). Jagalah adab dan kejujuranmu dalam menuntut ilmu.</span>
        </div>
    `;
}

function createFooterHTML() {
    return `
        <div class="text-center font-inter small text-muted mt-5 pt-3 pb-4 border-top">
            Developed & Maintained by <span class="fw-bold text-primary-azhar">Renaldi</span> <br>
            <span class="opacity-70">© 2026 Integrated Islamic Monitoring System (IIMS) • SMP Islam Al-Azhar 52 Bengkulu. All Rights Reserved.</span>
        </div>
    `;
}

// 5. INITIALIZER SYSTEM
document.addEventListener('DOMContentLoaded', () => {
    initRoleSwitchers();
    applyRoleSession(AppState.currentRole);
});

function initRoleSwitchers() {
    const DOM = getDOM();
    if (DOM.roleSelectorButtons) {
        DOM.roleSelectorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetRole = button.getAttribute('data-role');
                if(targetRole) applyRoleSession(targetRole);
            });
        });
    }
}

function applyRoleSession(role) {
    if (!role) return;
    AppState.currentRole = role;
    const DOM = getDOM();
    
    const profileNames = {
        'ADMIN': 'Ustadz Admin (Super Admin)',
        'KEPSEK': 'Ustadzah Kepala Sekolah, M.Pd.',
        'GURU': 'Ustadz Ustadz',
        'GURU_TAHFIDZ': 'Ustadz Pengampu Muhaffiz',
        'AYAH_BUNDA': 'Ayah/Bunda dari Ananda M. Fatih',
        'OSIS': 'Ahmad Fauzan (Ketua OSIS)'
    };
    
    if (DOM.userGreetingName) {
        const nameText = profileNames[role] || 'User IIMS';
        DOM.userGreetingName.innerHTML = `Selamat Datang, <span class="fw-bold text-primary-azhar">${nameText}</span>`;
    }
    
    if (DOM.userRoleBadge) {
        DOM.userRoleBadge.textContent = role === 'GURU' ? 'GURU' : role.replace('_', ' ');
    }
    if (DOM.globalTahunAjaran) DOM.globalTahunAjaran.textContent = AppState.tahunAjaran;
    if (DOM.globalSemester) DOM.globalSemester.textContent = AppState.semester;

    renderSidebarMenu(role);
    navigate('dashboard');
}

function renderSidebarMenu(role) {
    const DOM = getDOM();
    if (!DOM.sidebarMenuContainer) return;
    
    const menus = MENU_STRUCTURE[role] || [];
    DOM.sidebarMenuContainer.innerHTML = '';

    menus.forEach(menu => {
        const item = document.createElement('a');
        item.href = `#/${menu.id}`;
        item.className = 'nav-link nav-link-azhar nav-menu-item d-flex align-items-center p-3 text-decoration-none text-white';
        item.innerHTML = `
            <div class="icon-box text-center me-2" style="width: 20px;">
                <i class="fas ${menu.icon} fa-fw opacity-80"></i>
            </div>
            <span class="font-inter small">${menu.text}</span>
        `;
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-menu-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            navigate(menu.id);
        });
        DOM.sidebarMenuContainer.appendChild(item);
    });

    const firstMenu = DOM.sidebarMenuContainer.querySelector('.nav-menu-item');
    if (firstMenu) firstMenu.classList.add('active');
}

// 6. ROUTER ROUTING ENGINE
async function navigate(pageId) {
    const DOM = getDOM();
    if (!DOM.routerView) return;

    if (pageId === 'dashboard') {
        switch (AppState.currentRole) {
            case 'ADMIN': await renderAdminDashboard(); break;
            case 'GURU': await renderGuruDashboard(); break;
            default: await renderModulePage(pageId);
        }
    } else {
        await renderModulePage(pageId);
    }
}

// ========================================================================
// 7. DASHBOARD RENDERER (100% PERSIS LAYOUT ASLI SCREENSHOT 52 & 55)
// ========================================================================

async function renderGuruDashboard() {
    const DOM = getDOM();
    DOM.routerView.innerHTML = `
        ${createRunningTextHTML()}
        ${createHaditsHTML()}
        
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Ruang Kelas & Binaan Wali Kelas</h4>
        
        <div class="row g-3 mb-4 font-inter text-center">
            <div class="col-md-4">
                <div class="card shadow-sm border-0 rounded p-3 bg-white h-100">
                    <div class="p-2 mx-auto rounded-circle bg-primary bg-opacity-10 mb-2" style="width: 50px; height: 50px; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-user-graduate text-primary fa-lg"></i>
                    </div>
                    <span class="text-muted fw-bold d-block mb-1" style="font-size: 10px; letter-spacing: 0.5px;">MURID BINAAN</span>
                    <h2 class="fw-bold text-dark mb-0 font-poppins" style="font-size: 28px;">32</h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 rounded p-3 bg-white h-100">
                    <div class="p-2 mx-auto rounded-circle bg-success bg-opacity-10 mb-2" style="width: 50px; height: 50px; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-book-open text-success fa-lg"></i>
                    </div>
                    <span class="text-muted fw-bold d-block mb-1" style="font-size: 10px; letter-spacing: 0.5px;">SETORAN MINGGU INI</span>
                    <h2 class="fw-bold text-dark mb-0 font-poppins" style="font-size: 28px;">28</h2>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm border-0 rounded p-3 bg-white h-100">
                    <div class="p-2 mx-auto rounded-circle bg-warning bg-opacity-10 mb-2" style="width: 50px; height: 50px; display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-exclamation-triangle text-warning fa-lg"></i>
                    </div>
                    <span class="text-muted fw-bold d-block mb-1" style="font-size: 10px; letter-spacing: 0.5px;">CATATAN ADAB KELAS</span>
                    <h2 class="fw-bold text-dark mb-0 font-poppins" style="font-size: 28px;">2</h2>
                </div>
            </div>
        </div>

        <div class="row g-4 mb-4 font-inter">
            <div class="col-lg-8">
                <div class="card shadow-sm border-0 rounded p-4 bg-white h-100">
                    <h6 class="fw-bold text-primary-azhar mb-4"><i class="fas fa-th-list me-2"></i>Daftar Setoran Aktif Murid Kelas</h6>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle small text-start">
                            <thead class="table-light">
                                <tr>
                                    <th>Nama Murid</th>
                                    <th>Surah Aktif</th>
                                    <th>Ayat</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="fw-medium">Abdullah</td>
                                    <td>An-Naba</td>
                                    <td>1-15</td>
                                    <td><span class="badge bg-success font-inter">Lancar</span></td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">Aisyah Humaira</td>
                                    <td>Abasa</td>
                                    <td>1-42</td>
                                    <td><span class="badge bg-primary font-inter">Selesai</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card shadow-sm border-0 rounded p-4 bg-white mb-4">
                    <h6 class="fw-bold text-danger mb-3"><i class="fas fa-exclamation-triangle me-2"></i>Laporan Adab & Pembinaan</h6>
                    <div class="p-3 bg-light rounded mb-2" style="border-left:3px solid red;">
                        <div class="fw-bold small text-dark">Zaky (9A) - Terlambat Shalat Berjamaah</div>
                        <div class="text-muted" style="font-size: 11px;">Hari ini • Petugas OSIS</div>
                    </div>
                    <div class="p-3 bg-light rounded" style="border-left:3px solid red;">
                        <div class="fw-bold small text-dark">Raihan (7C) - Gadget Tidak Dikumpulkan</div>
                        <div class="text-muted" style="font-size: 11px;">Kemarin • Wali Kelas</div>
                    </div>
                </div>

                <div class="card shadow-sm border-0 rounded p-4 bg-white">
                    <h6 class="fw-bold text-primary-azhar mb-3"><i class="fas fa-person-dress me-2"></i>Alasan & Izin Keputrian Terbaru</h6>
                    <div class="p-3 bg-light rounded mb-2" style="border-left:3px solid #0A3663;">
                        <div class="fw-bold small text-dark">Siti Aminah (8B) - Izin Sakit di UKS</div>
                        <div class="text-muted" style="font-size: 11px;">Pekan ini • Berhalangan</div>
                    </div>
                    <div class="p-3 bg-light rounded" style="border-left:3px solid #0A3663;">
                        <div class="fw-bold small text-dark">Fatmawati (9C) - Alasan Nyeri Haid</div>
                        <div class="text-muted" style="font-size: 11px;">Pekan ini • Validasi Ustadzah</div>
                    </div>
                </div>
            </div>
        </div>

        ${createFooterHTML()}
    `;
}

async function renderAdminDashboard() {
    const DOM = getDOM();
    DOM.routerView.innerHTML = `
        ${createRunningTextHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-1">Pengaturan Kontrol Master Utama</h4>
        <p class="text-muted small font-inter mb-4">Konfigurasi jangka panjang hingga 10 tahun ke depan untuk menentukan basis filter aktif.</p>
        
        <div class="card shadow-sm border-0 rounded p-4 bg-white font-inter" style="max-width: 600px;">
            <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Pilih Tahun Ajaran Aktif (Skala 10 Tahun)</label>
                <select class="form-select font-inter text-muted small">
                    <option>Tahun Ajaran 2026/2027</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="form-label small fw-bold text-dark">Pilih Semester Aktif</label>
                <select class="form-select font-inter text-muted small">
                    <option>Ganjil</option>
                </select>
            </div>
            <div class="p-3 bg-light rounded text-muted small d-flex align-items-start" style="border-left: 3px solid green; line-height:1.5;">
                <i class="fas fa-shield-halved text-success me-2 mt-1"></i>
                <span>Mengubah parameter di atas akan memfilter seluruh penginputan ke tahun ajaran yang dipilih tanpa menghapus database tahun-tahun sebelumnya.</span>
            </div>
        </div>

        ${createFooterHTML()}
    `;
}

async function renderModulePage(pageId) {
    const DOM = getDOM();
    let title = pageId.replace('-', ' ').toUpperCase();
    DOM.routerView.innerHTML = `
        ${createRunningTextHTML()}
        <div class="card shadow-sm border-0 rounded p-4 bg-white font-inter">
            <h4 class="font-poppins fw-bold text-primary-azhar mb-2">${title}</h4>
            <div class="p-5 bg-light rounded text-center text-muted">
                <i class="fas fa-folder-open fa-3x mb-3 text-secondary opacity-60"></i>
                <p class="small mb-0">Konten database untuk modul <strong>${title}</strong> siap dihubungkan melalui GAS API.</p>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}
