RAYYSTR ONLINE + GOOGLE SHEETS (Apps Script)

ARSITEKTUR
- Website publik: URL deployment dengan ?page=home
- Dashboard admin terpisah: URL deployment dengan ?page=admin
- Database: Google Sheets (AkunGame, PromosiWA, LaporanPenipu, PesananVIP)
- Hosting: Google Apps Script Web App, dapat diakses online selama deployment aktif

CARA SETUP
1. Buat Google Spreadsheet baru. Buka Extensions/Ekstensi > Apps Script.
2. Buat file Code.gs lalu salin isi Code.gs dari paket ini.
3. Buat file HTML bernama Index, Admin, Styles, VisitorJS, AdminJS (tanpa ekstensi), salin isi masing-masing file .html di paket ini ke file HTML yang sesuai.
4. Di Apps Script, buka Project Settings > Script Properties > Add script property:
   Property: ADMIN_PASSWORD
   Value: buat kata sandi admin yang panjang dan unik. Jangan gunakan kata sandi email.
5. Pilih fungsi setupDatabase di dropdown fungsi lalu klik Run/Jalankan. Beri izin yang diminta. Sheet database akan dibuat otomatis.
6. Klik Deploy > New deployment > pilih type Web app.
7. Execute as: Me. Who has access: Anyone (atau Anyone with Google account bila ingin dibatasi).
8. Klik Deploy, selesaikan otorisasi, lalu salin URL Web App.
9. URL publik = URL deployment. URL admin = URL deployment ditambah ?page=admin.
10. Uji kirim listing demo dari halaman publik; data harus masuk ke sheet AkunGame dengan status pending. Setujui dari halaman admin.

PENTING KEAMANAN
- Jangan membagikan URL editor Apps Script atau spreadsheet sebagai editor kepada publik.
- Dashboard admin terpisah dari halaman pengunjung dan tindakan moderasi memerlukan ADMIN_PASSWORD yang disimpan di Script Properties.
- Batasi akses deployment jika situs belum siap publik. Untuk penggunaan komersial besar, tambahkan rate limit, validasi lebih ketat, logging, dan sistem autentikasi admin yang lebih kuat.
- Link bukti hanya disimpan sebagai teks pada template ini; upload file sungguhan perlu integrasi Google Drive dan validasi izin.
- Pembayaran/QRIS belum diproses otomatis. Verifikasi pembayaran harus manual sampai integrasi pembayaran resmi tersedia.
- Apps Script memiliki kuota layanan; cocok untuk tahap awal/prototipe, bukan beban trafik besar.
