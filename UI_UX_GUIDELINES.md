# Sparkle Store - Y2K Neo-Brutalist UI/UX Design Guidelines

Dokumen ini adalah panduan desain UI/UX utama untuk **Sparkle Store** (Toko Gelang Manik-Manik Custom). Panduan ini dirancang berdasarkan standar **UI/UX Pro Max** untuk menghasilkan antarmuka bertema **Y2K Neo-Brutalist** yang berkarakter kuat, aksesibel, dan memiliki kenyamanan belanja yang tinggi.

---

## 🎨 1. Sistem Visual & Style Y2K Neo-Brutalist

Neo-Brutalisme Y2K dicirikan oleh garis tepi (*border*) hitam yang tebal, warna-warna pastel/neon yang kontras, tipografi yang tegas, serta bayangan solid (*hard shadows*) tanpa blur.

### A. Palet Warna & Token (Sesuai `src/index.css`)
*   **Warna Latar Utama:** Putih (`#ffffff`) atau Krem Lembut (`#fcfbf7`).
*   **Warna Border & Teks Utama:** Hitam Pekat (`#000000` / `--color-brand-dark`).
*   **Warna Aksen & Kategori:**
    *   Pink (`#ff6584` / `--color-brand-pink`) - Aksen utama (tombol beli, peringatan/error).
    *   Yellow (`#ffd056` / `--color-brand-yellow`) - Tombol interaktif sekunder, ikon promo.
    *   Purple (`#b58dfb` / `--color-brand-purple`) - Desain gelang, pemilih kategori.
    *   Mint (`#86d79d` / `--color-brand-mint`) - Status sukses, stok tersedia.
    *   Blue (`#7dd3fc` / `--color-brand-blue`) - Informasi sekunder, tombol filter.
    *   Peach (`#ffa890` / `--color-brand-peach`) & Orange (`#ff7043`) - Variasi dekorasi.

### B. Batasan Kontras (WCAG Compliance)
*   **Teks Utama:** Selalu gunakan warna hitam (`#000000`) di atas latar warna pastel/terang untuk memastikan kontras rasio **>= 7:1** (melebihi standar WCAG AAA 4.5:1).
*   **Teks di atas warna Pink/Orange:** Pastikan ukuran teks tebal (bold) untuk keterbacaan yang prima. Hindari menuliskan teks putih di atas latar warna pastel kuning/mint karena kontrasnya terlalu rendah.

### C. Tipografi (Font Pairing)
*   **Heading Utama & Judul Besar:** Gunakan font **`Syne`** (`font-display`). Karakter font ini tebal dan eksentrik, sangat cocok untuk gaya brutalist.
*   **Teks Bacaan & Deskripsi Produk:** Gunakan font **`Plus Jakarta Sans`** (`font-sans`). Font ini bersih, modern, dan sangat mudah dibaca pada perangkat mobile.
*   **Harga, Angka, & Informasi Teknis:** Gunakan font **`JetBrains Mono`** (`font-mono`). Angka dengan lebar tetap (*tabular figures*) mencegah pergeseran tata letak (*layout shift*) saat angka berubah (misal: jumlah keranjang belanja).

---

## 👆 2. Kenyamanan Interaksi & Target Sentuh (Touch & Interaction)

*   **Ukuran Target Sentuh (Touch Target Size):**
    *   Setiap tombol interaktif (tombol "Tambah ke Keranjang", tombol navigasi, filter kategori, dan manik-manik dalam pemilih custom) harus memiliki tinggi/lebar minimal **44px** pada mobile.
    *   Gunakan `padding` yang cukup di dalam komponen, atau gunakan properti hit-box tambahan jika ukuran visual ikon di bawah 44px.
*   **Umpan Balik Tekanan (Brutalist Button Transition):**
    *   Semua tombol brutalist harus menerapkan transisi pergerakan bayangan 3D berikut untuk memberi umpan balik visual instan:
        *   **State Normal:** `border-3 border-black shadow-[3px_3px_0px_#000000]`
        *   **State Hover:** `-translate-x-0.5 -translate-y-0.5 shadow-[5px_5px_0px_#000000]` (tombol terlihat terangkat).
        *   **State Active (Saat Ditekan):** `translate-x-0 translate-y-0 shadow-[1px_1px_0px_#000000]` (tombol terlihat tertekan ke bawah).
    *   Durasi transisi harus diatur sebesar **150ms** hingga **200ms** untuk memberi kesan taktil yang cepat namun tidak kaku.

---

## ⚡ 3. Transisi Loading & Pencegahan Layout Shift (CLS)

*   **Animasi Skeleton (Shimmer Effect):**
    *   Gunakan shimmer gradien linear yang bergerak dengan kecepatan sedang (**1.5 detik per siklus**) untuk memberi kesan bahwa aplikasi sedang bekerja secara aktif.
    *   Sertakan teks visual penunjuk di tengah skeleton card:
        ```text
        sedang memuat data
        harap ditunggu
        ```
    *   Teks ini memberikan kepastian informasi kepada pengguna baru dengan koneksi internet lambat.
*   **Pencegahan Layout Shift (Cumulative Layout Shift < 0.1):**
    *   Card produk kosong saat memuat (*loading skeleton*) harus memiliki rasio aspek dan tinggi yang **sama persis** dengan card produk asli setelah terisi data.
    *   Tinggi card skeleton minimal **400px** untuk mencegah halaman melompat secara kasar saat data produk dari Supabase berhasil dimuat di browser.

---

## 📝 4. Desain Formulir & Validasi (Forms & Feedback)

*   **Label Selalu Terlihat:**
    *   Jangan pernah menyembunyikan label form hanya di dalam `placeholder` input. Teks placeholder akan hilang saat pengguna mulai mengetik, membuat pengguna bingung.
    *   Label form harus selalu berada di luar kolom input dengan teks yang jelas (misal: *"Alamat Lengkap"*).
*   **Input Text Brutalist:**
    *   Gunakan border hitam tebal `border-3 border-black` pada kolom input dengan latar belakang putih.
    *   Gunakan focus ring yang tebal (`focus:ring-3 focus:ring-brand-pink focus:outline-none`) saat kolom input aktif.
*   **Pemberitahuan Sukses / Gagal (Feedback Boundary):**
    *   Jika transaksi atau penambahan keranjang berhasil, berikan umpan balik warna hijau/mint (`bg-brand-mint`).
    *   Jika terjadi kesalahan (koneksi database terputus), tampilkan kotak peringatan brutalist warna pink (`bg-brand-pink`) dengan teks kesalahan yang jelas dan tombol **"Coba Lagi"**.

---

## ♿ 5. Aksesibilitas & Navigasi (Accessibility / A11y)

*   **Tombol Ikon Saja (Icon-only Buttons):**
    *   Tombol seperti ikon tempat sampah (hapus item keranjang) atau tombol `+` / `-` pengatur jumlah produk wajib memiliki atribut **`aria-label`** (misal: `aria-label="Hapus produk dari keranjang"`). Ini sangat penting untuk pengguna yang menggunakan pembaca layar (*screen reader*).
*   **Navigasi Keyboard:**
    *   Semua elemen yang dapat diklik harus dapat diakses menggunakan tombol `Tab` pada keyboard dengan indikator fokus yang sangat jelas.
*   **Pencegahan Zoom Otomatis di iOS:**
    *   Ukuran font pada elemen input di perangkat mobile minimal harus **16px** (di bawah 16px akan memicu iOS untuk secara otomatis melakukan zoom layar secara paksa, yang merusak pengalaman visual pengguna).
