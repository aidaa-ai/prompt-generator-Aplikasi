// Nilai default sesuai instruksi
const defaultValues = {
    persona: "programmer senior dan analis handal",
    namaAplikasi: "Register Surat",
    platform: "Google Sheets",
    peranInstansi: "staf administrasi di instansi pemerintah",
    tujuan: "mencatat surat masuk/keluar dengan data rapi",
    penggunaUtama: "staf administrasi dan pimpinan",
    field: "Nomor surat, tanggal, pengirim, penerima, perihal, status, disposisi",
    validasi: "nomor surat unik, status dropdown",
};

// Utility: tampilkan notifikasi toast
function showToast(message) {
    const toast = document.getElementById("toast-notification");
    toast.textContent = message;
    toast.className = "show";
    setTimeout(() => { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000); 
}

// Utility: bersihkan input (trim whitespace)
function sanitize(s) {
    return (s || "").trim();
}

// Fungsi untuk menghapus semua input
function clearInputs() {
    const form = document.getElementById('promptForm');
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.value = '');
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        Array.from(select.options).forEach(option => {
            // Mengatur ulang default select (PEP 8 & PEP 257)
            option.selected = (option.value === 'PEP 8' || option.value === 'PEP 257');
        });
    });
    showToast("❌ Semua input telah dibersihkan!");
    generatePrompt();
}

// Fungsi BARU: Mengunduh konten textarea sebagai file .txt
function downloadText(id, filename) {
    const el = document.getElementById(id);
    const text = el.value;
    
    // Membuat Blob dengan tipe teks polos
    const blob = new Blob([text], { type: 'text/plain' });
    
    // Membuat URL untuk Blob
    const url = URL.createObjectURL(blob);
    
    // Membuat elemen link sementara
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Nama file yang akan diunduh
    
    // Men-trigger klik otomatis
    document.body.appendChild(a);
    a.click();
    
    // Membersihkan URL Blob dan elemen link
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`💾 File '${filename}' berhasil diunduh!`);
}


// Generate prompt Indonesia & English
function generatePrompt() {
    const getInputValue = (id) => {
        const el = document.getElementById(id);
        const sanitizedValue = sanitize(el.value);
        return sanitizedValue || defaultValues[id] || "";
    };

    // Ambil Nilai dari Field
    const persona = getInputValue('persona');
    const namaAplikasi = getInputValue('namaAplikasi');
    const platform = getInputValue('platform');
    const peranInstansi = getInputValue('peranInstansi');
    const tujuan = getInputValue('tujuan');
    const penggunaUtama = getInputValue('penggunaUtama');
    const field = getInputValue('field');
    const validasi = getInputValue('validasi');
    
    // Multi-select standar script
    const standarSelect = document.getElementById('standarScript');
    const selectedStandards = Array.from(standarSelect.selectedOptions).map(opt => opt.value);
    const standarScript = selectedStandards.join(", ");

    // PROMPT FINAL INDONESIA (SESUAI STRUKTUR)
    const promptID = 
        `Kamu sebagai ${persona}, buatkan aplikasi ${namaAplikasi} berbasis ${platform}. 
Saya bekerja sebagai ${peranInstansi} dan membutuhkan aplikasi ini. 
Tujuannya ${tujuan}. Pengguna utama adalah ${penggunaUtama}. 
Gunakan field ${field}; validasi ${validasi}; 
Pastikan penulisan script sesuai standar ${standarScript} sehingga memudahkan dokumentasi dan pengembangan. 
Buatkan rancangan tabel, kode/script lengkap, serta lampiran QA checklist untuk memastikan kualitas akhir.`;

    // PROMPT FINAL ENGLISH (Disesuaikan)
    const promptEN = 
        `You, as ${persona}, create the ${namaAplikasi} application based on ${platform}. 
I work as a ${peranInstansi} and require this application. 
The main goal is ${tujuan}. The main users are ${penggunaUtama}. 
Use the fields: ${field}; validation rules: ${validasi}; 
Ensure the script writing adheres to the ${standarScript} standards to facilitate documentation and development. 
Provide a table design, the complete code/script, and an attached QA checklist to ensure final quality.`;

    // Tampilkan hasil
    document.getElementById('resultID').value = promptID.trim();
    document.getElementById('resultEN').value = promptEN.trim();
}

// Copy to clipboard
function copyText(id) {
    const el = document.getElementById(id);
    el.select();
    el.setSelectionRange(0, el.value.length);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(el.value)
            .then(() => showToast("📋 Teks berhasil disalin!"))
            .catch(err => {
                showToast("❌ Gagal menyalin. Silakan coba cara lama.");
            });
    } else {
        showToast("❌ Gagal menyalin. Silakan salin manual.");
    }
}
