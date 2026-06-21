// ==========================================
// MOCK DEVELOPMENT API (SUDAH DIPERBAIKI)
// ==========================================
function mockAPIResponse(action, payload) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(action === "login") {
                let role = "GURU"; // Default jika tidak cocok
                let namaReal = "Ustadz H. Ahmad, S.Pd";
                let jk = "Laki-laki";
                const userIn = payload.username.toLowerCase();
                
                // Pemetaan login simulasi secara presisi
                if (userIn === "admin") { 
                    role = "ADMIN"; 
                    namaReal = "Renaldi (Super Admin)"; 
                } else if (userIn === "kepsek") { 
                    role = "KEPSEK"; 
                    namaReal = "Bapak H. Kepala Sekolah, M.Pd"; 
                } else if (userIn === "ortu" || userIn === "ayah" || userIn === "bunda") { 
                    role = "AYAH_BUNDA"; 
                    namaReal = "Wali Murid M. Fatih"; 
                } else if (userIn === "osis") { 
                    role = "OSIS"; 
                    namaReal = "Kakak Ketua OSIS"; 
                } else if (userIn === "ustadzah") {
                    role = "GURU";
                    namaReal = "Ustadzah Fatimah, S.Pd";
                    jk = "Perempuan"; // Tes menu keputrian otomatis muncul
                }
                
                resolve({
                    success: true,
                    data: { 
                        NAMA: namaReal, 
                        USERNAME: payload.username, 
                        ROLE: role, 
                        JENIS_KELAMIN: jk 
                    }
                });
            } else { 
                resolve({ success: true, data: {} }); 
            }
        }, 100);
    });
}
