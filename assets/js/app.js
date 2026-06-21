/**
 * ========================================================================
 * IIMS - Integrated Islamic Monitoring System
 * SMP Islam Al-Azhar 52 Bengkulu
 * Berkas Utama Sistem Kontrol Navigasi, Dashboard Multi-Role, & Manajemen Data
 * ========================================================================
 */

// 1. STATE MANAGEMENT GLOBAL APLIKASI
const AppState = {
    currentRole: 'ADMIN', // Default role saat memuat halaman pertama kali
    tahunAjaran: 'TA 2026/2027',
    semester: 'Semester Ganjil'
};

// 2. STRUKTUR MENU NAVIGASI MULTI-ROLE (Teks 'Master' telah dihapus sesuai instruksi)
const MENU_STRUCTURE = {
    ADMIN: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama' },
        { id: 'data-guru', icon: 'fa-chalkboard-teacher', text: 'Data Guru (NIPY)' },
        { id: 'data-murid', icon: 'fa-user-graduate', text: 'Data Murid (NIS)' },
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
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Utama Kepsek' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Global' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Adab & Pembinaan' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban' },
        { id: 'dokumen', icon: 'fa-file-signature', text: 'Validasi & Lacak Sertifikat' }
    ],
    GURU: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Kelas Binaan' },
        { id: 'tahfidz', icon: 'fa-book-quran', text: 'Tahfidz Murid' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-heart', text: 'Catatan Adab' },
        { id: 'kurban', icon: 'fa-cow', text: 'Tabungan Kurban Kelas' },
        { id: 'pengumuman', icon: 'fa-bullhorn', text: 'Pengumuman' },
        { id: 'dokumen', icon: 'fa-file-invoice', text: 'Lihat Dokumen Kelas' }
    ],
    GURU_TAHFIDZ: [
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Tahfidz' },
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
        { id: 'dashboard', icon: 'fa-chart-pie', text: 'Dashboard Petugas OSIS' },
        { id: 'keputrian', icon: 'fa-person-dress', text: 'Keputrian' },
        { id: 'pembinaan', icon: 'fa-pen-to-square', text: 'Input Catatan Pelanggaran' }
    ]
};

// 3. ELEMEN DOM UTAMA
const DOM = {
    sidebarMenuContainer: document.getElementById('sidebar-menu-container'),
    routerView: document.getElementById('router-view'),
    userGreetingName: document.getElementById('user-greeting-name'),
    userRoleBadge: document.getElementById('user-role-badge'),
    globalTahunAjaran: document.getElementById('global-tahun-ajaran'),
    globalSemester: document.getElementById('global-semester'),
    roleSelectorButtons: document.querySelectorAll('.role-select-btn')
};

// 4. STRUKTUR TEMPLATE GLOBAL
function createMutiaraStatisHTML() {
    return `
        <div class="p-3 px-4 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center" style="background-color: #ffffff; font-size: 14px; border-left: 4px solid #0A3663; line-height: 1.6;">
            <i class="fas fa-quote-left text-primary-azhar me-3 fa-lg opacity-70"></i>
            <span class="fw-medium">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari).</span>
        </div>
    `;
}

function createFooterHTML() {
    return `
        <div class="footer-container text-center font-inter small text-muted mt-5 pt-4 pb-5 border-top">
            Developed & Maintained by <span class="fw-bold text-primary-azhar">Renaldi</span> <br>
            <span class="opacity-70">© 2026 Integrated Islamic Monitoring System (IIMS) • SMP Islam Al-Azhar 52 Bengkulu. All Rights Reserved.</span>
        </div>
    `;
}

function createCard(title, value, icon, colorClass) {
    return `
        <div class="col-xl-3 col-md-6">
            <div class="card shadow-sm border-0 rounded-3 h-100 p-3 bg-white">
                <div class="d-flex align-items-center justify-content-between">
                    <div>
                        <span class="text-muted fw-bold font-inter small d-block mb-1 text-uppercase">${title}</span>
                        <h3 class="font-poppins fw-bold mb-0 text-dark">${value}</h3>
                    </div>
                    <div class="p-3 rounded-3 ${colorClass} bg-opacity-10">
                        <i class="fas ${icon} fa-xl ${colorClass.split(' ')[0]}"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 5. INISIALISASI SISTEM & ROUTING
document.addEventListener('DOMContentLoaded', () => {
    initRoleSwitchers();
    applyRoleSession(AppState.currentRole);
});

function initRoleSwitchers() {
    DOM.roleSelectorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetRole = button.getAttribute('data-role');
            applyRoleSession(targetRole);
        });
    });
}

function applyRoleSession(role) {
    AppState.currentRole = role;
    
    // Update Header Identitas Atas
    const profileNames = {
        'ADMIN': 'System Administrator',
        'KEPSEK': 'Ustadzah Kepala Sekolah, M.Pd.',
        'GURU': 'Ustadz Wali Kelas, S.Pd.',
        'GURU_TAHFIDZ': 'Ustadz Pengampu Muhaffiz',
        'AYAH_BUNDA': 'Wali Murid (Ayah/Bunda Muhammad Fatih)',
        'OSIS': 'Ahmad Fauzan (Ketua OSIS)'
    };
    
    DOM.userGreetingName.textContent = profileNames[role] || 'User IIMS';
    DOM.userRoleBadge.textContent = role.replace('_', ' ');
    DOM.globalTahunAjaran.textContent = AppState.tahunAjaran;
    DOM.globalSemester.textContent = AppState.semester;

    renderSidebarMenu(role);
    navigate('dashboard');
}

function renderSidebarMenu(role) {
    const menus = MENU_STRUCTURE[role] || [];
    DOM.sidebarMenuContainer.innerHTML = '';

    menus.forEach(menu => {
        const item = document.createElement('a');
        item.href = `#/${menu.id}`;
        item.className = 'nav-link-azhar d-flex align-items-center p-3 text-white text-decoration-none transition-all';
        item.innerHTML = `
            <div class="icon-box text-center me-3" style="width: 24px;">
                <i class="fas ${menu.icon} fa-fw opacity-80"></i>
            </div>
            <span class="font-inter small fw-medium">${menu.text}</span>
        `;
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link-azhar').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            navigate(menu.id);
        });
        DOM.sidebarMenuContainer.appendChild(item);
    });
}

// 6. ROUTER ENGINE & KORPUS DASHBOARD MULTI-ROLE
async function navigate(pageId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'dashboard') {
        switch (AppState.currentRole) {
            case 'ADMIN': await renderAdminDashboard(); break;
            case 'KEPSEK': await renderKepsekDashboard(); break;
            case 'GURU': await renderGuruDashboard(); break;
            case 'GURU_TAHFIDZ': await renderTahfidzDashboard(); break;
            case 'AYAH_BUNDA': await renderAyahBundaDashboard(); break;
            case 'OSIS': await renderOsisDashboard(); break;
            default: DOM.routerView.innerHTML = `<h4>Halaman Tidak Ditemukan</h4>`;
        }
    } else {
        await renderModulePage(pageId);
    }
}

// ========================================================================
// 7. RENDERING ENGINE UNTUK DASHBOARD MULTI-ROLE (DIKEMBALIKAN UTUH & MEGAH)
// ========================================================================

async function renderAdminDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Pengaturan Kontrol Master Utama</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('TOTAL GURU AKTIF', '42 Asatidz', 'fa-chalkboard-teacher', 'text-primary bg-primary')}
            ${createCard('TOTAL SISWA TERDAFTAR', '512 Santri', 'fa-user-graduate', 'text-success bg-success')}
            ${createCard('KAPASITAS KELAS', '18 Rombel', 'fa-school', 'text-warning bg-warning')}
            ${createCard('BACKUP DATABASE', 'Aman (Harian)', 'fa-server', 'text-danger bg-danger')}
        </div>

        <div class="row g-4 mb-4 font-inter">
            <div class="col-lg-7">
                <div class="card-enterprise p-4 mb-4">
                    <h6 class="fw-bold text-primary-azhar mb-3"><i class="fas fa-sliders-h me-2"></i>Konfigurasi Batasan Sistem Akademik</h6>
                    <div class="p-3 bg-light rounded-3 small text-muted mb-3">
                        <i class="fas fa-info-circle me-2 text-primary"></i>Mengubah parameter di bawah ini akan memfilter seluruh penginputan data nilai dan kehadiran ke tahun ajaran yang dipilih secara real-time tanpa menghapus basis data sebelumnya.
                    </div>
                    <form>
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-secondary">Pilih Tahun Ajaran Aktif (Skala 10 Tahun)</label>
                            <select class="form-select font-inter small"><option>${AppState.tahunAjaran}</option></select>
                        </div>
                        <div>
                            <label class="form-label small fw-bold text-secondary">Pilih Semester Aktif</label>
                            <select class="form-select font-inter small"><option>${AppState.semester}</option></select>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="card-enterprise p-4">
                    <h6 class="fw-bold text-primary-azhar mb-3"><i class="fas fa-shield-alt me-2"></i>Log Keamanan & Akses Sistem</h6>
                    <div class="small timeline-container">
                        <div class="border-start border-2 ps-3 pb-3 position-relative">
                            <span class="badge bg-primary mb-1">03:21 AM</span>
                            <p class="mb-0 text-dark fw-medium">Admin mengubah filter TA ke 2026/2027</p>
                        </div>
                        <div class="border-start border-2 ps-3 pb-2 position-relative">
                            <span class="badge bg-secondary mb-1">Kemarin</span>
                            <p class="mb-0 text-muted">Backup terjadwal otomatis sukses disinkronkan Cloud</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

async function renderKepsekDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Dashboard Laporan Utama Kepala Sekolah</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('PERSENTASE SETORAN', '91.4 %', 'fa-chart-line', 'text-success bg-success')}
            ${createCard('TOTAL JUZ DIHAFAL', '1,420 Juz', 'fa-book-open', 'text-primary bg-primary')}
            ${createCard('REKAP PELANGGARAN', '0 Kasus Kritis', 'fa-heart-circle-check', 'text-info bg-info')}
            ${createCard('BELUM DIVALIDASI', '12 Sertifikat', 'fa-file-signature', 'text-danger bg-danger')}
        </div>

        <div class="card-enterprise p-4 mb-4 font-inter">
            <h6 class="fw-bold text-primary-azhar mb-3"><i class="fas fa-eye me-2"></i>Pemantauan Grafik Perkembangan Al-Azhar 52</h6>
            <div class="p-5 bg-light rounded text-center text-muted small">
                <i class="fas fa-chart-area fa-3x mb-3 text-secondary"></i><br>
                Grafik akumulasi grafik capaian tahfidz antar kelas semester ganjil beroperasi normal.
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

async function renderGuruDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Monitoring Ruang Kelas & Binaan Wali Kelas</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('TOTAL ANAK BINAAN', '32 Murid', 'fa-users', 'text-primary bg-primary')}
            ${createCard('RATA-RATA HAFALAN', '2.5 Juz', 'fa-book-open', 'text-success bg-success')}
            ${createCard('IZIN KEPUTRIAN', '3 Siswi', 'fa-person-dress', 'text-warning bg-warning')}
            ${createCard('POIN ADAB KELAS', '0 Kasus', 'fa-shield-halved', 'text-info bg-info')}
        </div>

        <div class="row g-4 mb-4 font-inter">
            <div class="col-lg-8">
                <div class="card-enterprise p-4 border-start border-4 border-primary mb-4">
                    <h6 class="font-poppins fw-bold mb-2 text-primary-azhar"><i class="fas fa-info-circle me-2"></i>Informasi Akses Guru</h6>
                    <p class="text-muted small mb-0">Data kelas tersaring otomatis berdasarkan penugasan NIPY Anda pada tahun ajaran ${AppState.tahunAjaran}. Seluruh laporan setoran harian otomatis terakumulasi ke rapot digital kelas.</p>
                </div>
                <div class="card-enterprise p-4">
                    <h6 class="font-poppins fw-bold mb-3 text-primary-azhar"><i class="fas fa-history me-2"></i>Aktivitas Setoran Terakhir Kelas</h6>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle small text-center">
                            <thead class="table-light">
                                <tr><th class="text-start">Nama Murid</th><th>Surah & Ayat</th><th>Jenis</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="text-start fw-bold">Muhammad Fatih</td><td>Al-Mulk: 1-10</td><td>Saba'</td><td><span class="badge bg-success">Lancar</span></td></tr>
                                <tr><td class="text-start fw-bold">Ahmad Fauzan</td><td>An-Naba: 1-20</td><td>Ziyadah</td><td><span class="badge bg-warning text-dark">Mengulang</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card-enterprise p-4 border-top border-4 border-danger">
                    <h6 class="font-poppins fw-bold mb-2 text-danger"><i class="fas fa-user-clock me-2"></i>Belum Setoran Pekan Ini</h6>
                    <div class="p-2 bg-light rounded small text-muted mb-2"><i class="fas fa-user text-secondary me-2"></i>Ahmad Fauzan (8A)</div>
                    <div class="p-2 bg-light rounded small text-muted"><i class="fas fa-user text-secondary me-2"></i>Zaskia Putri (8A)</div>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

async function renderTahfidzDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Panel Utama Koordinator Muhaffiz</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('HALAQAH DIAWASI', '4 Kelompok', 'fa-layer-group', 'text-primary bg-primary')}
            ${createCard('SETORAN HARI INI', '48 Murid', 'fa-check-double', 'text-success bg-success')}
            ${createCard('TARGET RATA-RATA', '88%', 'fa-bullseye', 'text-warning bg-warning')}
            ${createCard('REKAP BELUM INPUT', '0 Halaqah', 'fa-clock', 'text-danger bg-danger')}
        </div>
        ${createFooterHTML()}
    `;
}

async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <div class="card-enterprise p-4 mb-4 bg-primary-azhar text-white shadow-sm font-inter">
            <h4 class="font-poppins fw-bold mb-1" style="font-size: 18px;">Profil Akun Murid: Muhammad Fatih</h4>
            <p class="mb-0 text-gold small fw-medium">Kelas VIII - Abu Bakar • NIS: 1023412</p>
        </div>
        
        <div class="row g-3 mb-4">
            ${createCard('TOTAL HAFALAN', '2.8 Juz', 'fa-book-quran', 'text-primary bg-primary')}
            ${createCard('POIN PELANGGARAN', '0 Poin', 'fa-heart', 'text-success bg-success')}
            ${createCard('KEHADIRAN KEPUTRIAN', '100%', 'fa-person-dress', 'text-info bg-info')}
            ${createCard('TABUNGAN KURBAN', 'Rp2.500.000', 'fa-cow', 'text-warning bg-warning')}
        </div>

        <div class="row g-3 font-inter">
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="fw-bold text-primary-azhar"><i class="fas fa-book-bookmark me-2"></i>Detail Capaian Hafalan</h6>
                    <hr>
                    <ul class="small text-muted ps-3">
                        <li class="mb-2">Juz Lulus Uji: <span class="fw-bold text-dark">Juz 30 & Juz 29</span></li>
                        <li class="mb-2">Target Semester Ini: <span class="fw-bold text-dark">Juz 28 (Target 85% Tercapai)</span></li>
                        <li>Saba' Terakhir: <span class="fw-bold text-dark">Al-Mulk Ayat 1-10 (Ustadz Ahmad)</span></li>
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100">
                    <h6 class="fw-bold text-success"><i class="fas fa-hands-praying me-2"></i>Catatan Perkembangan Karakter</h6>
                    <hr>
                    <ul class="small text-muted ps-3">
                        <li class="mb-2">Sikap Unggul: <span class="fw-bold text-success">Sangat Sopan & Rajin Shalat Jamaah</span></li>
                        <li class="mb-2">Evaluasi Guru: <span class="fw-bold text-dark">Pertahankan Muraja'ah di Rumah</span></li>
                        <li>Catatan Wali Kelas: <span class="fw-bold text-dark">Ananda menunjukkan kepemimpinan yang baik</span></li>
                    </ul>
                </div>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}

async function renderOsisDashboard() {
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <h4 class="font-poppins fw-bold text-primary-azhar mb-4">Akses Input Petugas Keamanan OSIS</h4>
        
        <div class="row g-3 mb-4">
            ${createCard('PELANGGARAN DICATAT', '2 Temuan', 'fa-pen-to-square', 'text-warning bg-warning')}
            ${createCard('TINDAK LANJUT OSIS', 'Selesai', 'fa-square-check', 'text-success bg-success')}
        </div>
        ${createFooterHTML()}
    `;
}

// ========================================================================
// 8. ROUTING MODUL SUB-HALAMAN UTAMA (ADMIN / USER)
// ========================================================================
async function renderModulePage(pageId) {
    let title = pageId.replace('-', ' ').toUpperCase();
    
    DOM.routerView.innerHTML = `
        ${createMutiaraStatisHTML()}
        <div class="card-enterprise p-4 font-inter animate__animated animate__fadeIn">
            <h4 class="font-poppins fw-bold text-primary-azhar mb-2">${title}</h4>
            <p class="text-muted small mb-4">Modul fungsional komprehensif sistem manajemen terpadu Al-Azhar 52 Bengkulu.</p>
            <div class="p-5 bg-light rounded text-center text-muted">
                <i class="fas fa-folder-open fa-3x mb-3 text-secondary opacity-60"></i>
                <p class="small mb-0">Konten database relasional untuk <strong>${title}</strong> siap dimuat ke dalam tabel dinamis.</p>
            </div>
        </div>
        ${createFooterHTML()}
    `;
}
