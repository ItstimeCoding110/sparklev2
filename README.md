# ✦ goodtobe.sparkle ✦

Toko online aksesoris manik buatan tangan (*handmade*) estetik dengan gaya retro-Y2K Neo-Brutalisme yang dirancang khusus untuk Gen-Z. Website ini dilengkapi katalog produk dinamis, keranjang belanja interaktif, formulir checkout otomatis ke WhatsApp, serta Panel Admin dengan integrasi database ganda (Supabase & Local JSON Fallback).

---

## 🚀 Fitur Utama
1. **Catalog Showcase (ProductList)**: Pengguna dapat menjelajahi katalog produk cincin dan gelang manik ready-stock dengan filter kategori, pencarian langsung, status ketersediaan (*ready/sold out*), dan lencana status (*best seller/baru rilis*).
2. **Katalog Produk Dinamis**: Menampilkan koleksi gelang dan cincin manik dengan animasi brutalist.
3. **Checkout Terintegrasi WhatsApp**: Alur pemesanan langsung draf pesan template pesanan detail ke WhatsApp Admin (`6285123324775`) setelah mengisi Nama, Alamat, Metode Pembayaran, dan Layanan Pengiriman.
4. **Promo Otomatis**: Gratis Ongkos Kirim otomatis jika memesan minimal 3 buah item (khusus area pengiriman Jakarta Selatan).
5. **Panel Admin Inventaris**: Halaman dasbor khusus bagi pemilik toko untuk mengelola (Tambah, Edit, Hapus, ubah status *Ready/Sold Out*) katalog produk secara langsung dari aplikasi.
6. **Arsitektur Database Ganda**: Mendukung sinkronisasi instan dengan cloud **Supabase Database & Auth**, dengan fallback otomatis ke **database JSON lokal (`data-store.json`)** apabila koneksi cloud terputus/belum terkonfigurasi.

---

## 🛠️ Teknologi yang Digunakan
* **Frontend**: React 19 (TypeScript), Vite, Tailwind CSS v4, Motion (untuk animasi).
* **Ikon**: Lucide React.
* **Backend**: Node.js & Express (TypeScript / TSX).
* **Database & Otorisasi**: Supabase (PostgreSQL & Supabase Auth).
* **Konfigurasi Serverless**: Vercel Serverless Functions.

---

## 📁 Struktur Proyek
```text
├── api/                    # Vercel Serverless Endpoint wrapper
│   └── index.ts            # Handler utama Vercel untuk mengalihkan ke Express server
├── src/
│   ├── components/         # Komponen UI utama React (Hero, About, Checkout, Admin, dll.)
│   │   ├── Logo.tsx        # Logo SVG kustom Sparkle
│   │   ├── BraceletVisualizer.tsx # Visualisasi Bentuk Manik-Manik 3D
│   │   └── ...
│   ├── data.ts             # Data fallback produk & info toko global
│   ├── types.ts            # Definisi tipe TypeScript
│   ├── index.css           # Desain brutalist tokens & utility classes
│   └── main.tsx            # Entrypoint utama React
├── server.ts               # Express API backend server (routing CRUD & local store fallback)
├── data-store.json         # Database lokal cadangan jika Supabase terputus
├── vercel.json             # Konfigurasi deployment hosting Vercel
└── package.json            # Daftar dependensi & script runner
```

---

## ⚙️ Persiapan & Menjalankan Lokal

### Prasyarat:
* Node.js versi 18 atau yang lebih baru.

### 1. Kloning & Instal Dependensi
```bash
npm install
```

### 2. Konfigurasi Variabel Lingkungan (.env)
Salin file `.env.example` menjadi `.env` di folder root:
```bash
cp .env.example .env
```
Isi variabel di dalamnya:
```ini
# Port Server Express (Default: 3000)
PORT=3000

# Kredensial Supabase Cloud (Opsional, tinggalkan kosong untuk menggunakan Local Fallback)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 3. Jalankan Aplikasi (Development)
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🗄️ Konfigurasi Supabase Database (Cloud Sync)

Apabila Anda siap untuk mengaktifkan integrasi database cloud Supabase, silakan buat tabel-tabel berikut di dalam **SQL Editor** pada Dashboard Supabase Anda:

### 1. Tabel `products`
```sql
create table products (
  id text primary key,
  name text not null,
  price numeric not null,
  description text,
  colors text[] not null default '{}',
  image_url text,
  category text not null,
  beads_used text[] not null default '{}',
  tags text[] not null default '{}',
  is_sold_out boolean not null default false,
  code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2. Tabel `categories`
```sql
create table categories (
  name text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Masukkan data awal kategori
insert into categories (name) values ('Gelang'), ('Cincin');
```

### 3. Autentikasi Admin
Pastikan Anda mendaftarkan email admin (misal: `admin@sparkle.com`) di menu **Authentication > Users** di Dashboard Supabase agar Anda dapat melakukan login ke panel admin secara aman.

---

## 🌐 Panduan Deployment (Vercel)

Website ini sudah 100% siap di-deploy ke Vercel:

### Cara 1: Menggunakan Vercel CLI (Direkomendasikan untuk uji coba instan)
1. Install Vercel CLI secara global: `npm install -g vercel`
2. Jalankan perintah `vercel` di direktori proyek dan ikuti petunjuknya.
3. Tambahkan environment variables `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di dashboard proyek Vercel Anda.

### Cara 2: Hubungkan ke GitHub (Auto-Deployment)
1. Buat repositori baru di GitHub Anda.
2. Hubungkan repositori lokal Anda:
   ```bash
   git remote add origin https://github.com/username/repo-name.git
   git branch -M main
   git push -u origin main
   ```
3. Buka dashboard Vercel, pilih **Add New Project**, lalu impor repositori GitHub Anda.
4. Masukkan environment variables di Vercel Dashboard, klik **Deploy**.

---

## 🛡️ Kebijakan Keamanan (Security)
* **Status Supabase**: Ketika Supabase aktif, otentikasi login dikelola sepenuhnya secara aman oleh Supabase Auth.
* **Local Mode**: Ketika Supabase tidak diaktifkan, login panel admin mendeteksi kredensial fallback lokal. **PENTING**: Kredensial fallback lokal (`admin@sparkle.com` / `admin123`) dinonaktifkan secara otomatis saat kredensial Supabase terdeteksi di server produksi.
* **Header Keamanan**: Server Express dilengkapi dengan middleware security headers bawaan untuk mencegah serangan *MIME Sniffing*, *Clickjacking*, dan *Cross-Site Scripting (XSS)*.
