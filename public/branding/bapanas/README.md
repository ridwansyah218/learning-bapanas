# PADI — Badan Pangan Nasional

Identitas visual untuk tema Moon pada portal PADI. Mengacu pada lampiran Peraturan
Badan Pangan Nasional Nomor 01 Tahun 2022 (warna logo), bukan pedoman identitas
portal yang disahkan tersendiri.

- Hijau logogram: `#1E7816`.
- Hijau logotype: `#194D14`.
- Kuning keemasan: `#ECBC33`.
- Logo asli: https://badanpangan.go.id/themes/badan-pangan-nasional/assets/public/img/logo-trans.png
- Acuan: https://badanpangan.go.id/wiki/logo

`padi.css` dimuat melalui pengaturan Moodle `additionalhtmlhead`. Layout beranda
dan standar disimpan dalam file area native Moon `main_layouts`, sehingga tetap
bisa diedit lewat pengaturan Moon. Berkas inti Moodle dan source plugin Moon tidak
diubah oleh desain ini. Setelah pembaruan tema, periksa kembali selector CSS dan
layout standar.

Kontrol visual native Moon:

- **Colors / Theme colors**: Primary mengatur aksen, Secondary mengatur latar
  pembuka/footer, Yellow mengatur aksen emas. CSS PADI membaca variabel Bootstrap
  yang dihasilkan Moon, bukan mengunci nilai HEX tersebut.
- **Typography**: pilih Custom pada Body atau H1–H6 untuk mengganti font/ukuran.
  Gaya judul khusus PADI memakai specificity rendah sehingga pengaturan ini
  mendapat prioritas.
- **Header / Logo**: logo PADI ada pada Default Logo. Logo Type dapat diganti ke
  Text; Logo Text dan Tag Line akan tampil sesuai pengaturan native. Ukuran logo
  mengikuti pengaturan Moon dan dibatasi ruang layar agar responsif.
- **Layout editor**: teks, tautan, urutan section, serta jarak elemen bisa diedit
  dari layout frontpage/standard/admin. CSS tersisa memberi grid dan detail
  komponen khusus PADI; bukan memaksakan logo/header atau font global.

Logo image awal berupa `logo-padi.svg`, komposisi logo asli Bapanas dengan label
portal PADI. Nama portal pada gambar diganti melalui penggantian gambar;
Logo Text/Tag Line adalah kontrol untuk mode Text, sesuai perilaku native Moon.

Layout Beranda PADI (frontpage) khusus untuk landing page. Halaman Standar PADI
(standard/default) digunakan untuk halaman kursus, aktivitas, dashboard, profil,
dan halaman lain tanpa layout khusus. Jarak konten diatur dari editor Moon:
Layouts → Halaman Standar PADI → Main Content → Design → Padding. Nilai saat ini
32 px atas / 48 px bawah pada desktop, 24 px atas / 32 px bawah pada ponsel.
Administrasi PADI memakai pengaturan Padding Main Content yang sama; Login tetap
memakai layout tersendiri. Cadangan tersedia di before-page-layout-normalization.

Sumber layout, pengaturan, skrip penerapan, screenshot, dan cadangan sebelum
perubahan tersedia di `.local/branding` pada root proyek. Folder tersebut berada
di luar direktori web `public`. Cadangan database adalah `before-branding.sql`;
pengaturan sebelumnya berada di `settings-before.json` dan layout sebelumnya
berada di `before-frontpage.json`.

Untuk menyesuaikan desain, ubah CSS di sini atau layout di editor Moon. Untuk
kontrol kategori dan pencarian beranda, renderer tema di
`public/theme/moon/classes/output/core/course_renderer.php` memakai `url_select`
dan formulir pencarian Moodle. Kontrol muncul saat Course search box diaktifkan
di Site home settings; daftar kategori mengikuti hak akses pengguna. Warna
panel mengikuti warna native Moon melalui variabel CSS PADI.
Untuk
menerapkan ulang sumber layout, jalankan `node .local/branding/build.mjs` lalu
`C:\xampp\php\php.exe .local/branding/apply.php` dari root proyek dengan akses
tulis ke direktori data Moodle.

## Struktur halaman (Moon layout builder)

Semua bagian halaman adalah elemen bawaan Moon, jadi urutan, teks, padding, dan
visibilitasnya diatur dari **Moon → Layouts**:

| Layout | Dipakai untuk | Section tambahan |
| --- | --- | --- |
| Beranda PADI (`frontpage`) | Beranda | – |
| Katalog Kursus PADI (`coursecategory`) | `course/index.php` & halaman kategori | Judul halaman (Full Header) |
| Halaman Standar PADI (`standard`) | Kursus, aktivitas, dasbor, Kursusku, profil, kalender, nilai, forum, pencarian, dll. | Judul halaman (Full Header), Navigasi halaman (Menu → secondary), Header/Navigasi aktivitas, Header/Footer konten kursus |
| Administrasi PADI (`admin`) | Halaman admin, preferensi, edit profil, setelan kursus | Judul halaman (Full Header) |

- **Full Header** menampilkan judul, breadcrumb, dan tombol aksi Moodle. Opsi
  "Only admin" harus **off** agar tampil untuk semua pengguna (perilaku opsi ini
  diperbaiki di `theme/moon/elements/full_header/render.php`).
- **Activity header** punya opsi "Enable heading title"; biarkan off karena judul
  aktivitas sudah tampil di Full Header.
- Judul katalog utama ("Semua kursus") dan pencarian ("Cari kursus") diatur di
  `theme/moon/classes/output/core_renderer.php`; katalog utama menampilkan semua
  kursus lewat `course_renderer::course_category()`.
- Jumlah kursus di beranda: Administrasi situs → Beranda → *Jumlah maksimum kursus*
  (`frontpagecourselimit`). Per halaman di katalog: *Kursus per halaman*
  (`coursesperpage`). Isi beranda: *Halaman depan* (`frontpage`/`frontpageloggedin`).
- Footer: gunakan `<div>`, bukan `<span>` polos, di elemen Text Moon — span tanpa
  atribut dibuang oleh filter teks Moodle.

Section di atas dibuat oleh `.local/branding/page-headers.php` (aman dijalankan
ulang; cadangan di `.local/branding/before-page-headers`). Bila layout di-generate
ulang dengan `build.mjs` + `apply.php`, jalankan `page-headers.php` sesudahnya.
- Teks antarmuka yang huruf kecil di paket bahasa Indonesia (mis. tab "Kursus",
  "Kursus yang saya ikuti") diperbaiki lewat **Administrasi situs → Bahasa →
  Kustomisasi bahasa** (`id`). Salinan string ada di `.local/branding/customlang/id`
  dan bisa diimpor ulang dengan `admin/tool/customlang/cli/import.php --lang=id
  --source=<folder> --checkin`.
- Warna *Secondary* Moon dipakai untuk latar hero/footer, sehingga `.btn-secondary`
  ditampilkan sebagai tombol outline di `padi.css`.
- Pendaftaran mandiri/akses tamu diatur per kursus: Kursus → Peserta → Metode
  pendaftaran. Halaman `enrol/index.php` sudah ditata untuk kedua keadaan.
