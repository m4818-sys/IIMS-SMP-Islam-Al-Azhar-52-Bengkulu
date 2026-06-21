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

// --- MUTIARA ISLAMI STATIS (UKURAN FONT DIPERBESAR) ---
function createMutiaraStatisHTML() {
    return `
        <div class="p-3 px-4 mb-4 font-inter text-muted rounded shadow-sm d-flex align-items-center" style="background-color: #ffffff; font-size: 14px; border-left: 4px solid #0A3663; line-height: 1.6;">
            <i class="fas fa-quote-left text-primary-azhar me-3 fa-lg opacity-70"></i>
            <span class="fw-medium">"Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya." (HR. Bukhari). Jagalah adab dan kejujuranmu dalam menuntut ilmu.</span>
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
            ${createCard('TOTAL GURU AKTIF', '28', 'fa-chalkboard-teacher', 'bg-success text-white')}
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

// --- TEMPLATE: AYAH BUNDA DASHBOARD ---
async function renderAyahBundaDashboard() {
    DOM.routerView.innerHTML = `
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
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card-enterprise p-4 h-100 border-top border-4 border-info">
                    <h6 class="font-poppins fw-bold mb-3 text-info"><i class="fas fa-heart-circle-check me-2"></i>Catatan Adab</h6>
                    <div class="p-4 text-center bg-light rounded h-100 d-flex flex-column align-items-center justify-content-center">
                        <i class="fas fa-smile-beam fa-3x text-success mb-3"></i>
                        <h6 class="font-poppins fw-bold text-success mb-1">Alhamdulillah, Ananda Bersih!</h6>
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
