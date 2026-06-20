import React from 'react';
import { SHOP_INFO } from '../data';
import { HelpCircle, Sparkles, Star, Heart, CheckCircle2, ShoppingBag, Brush, Shield, Flame, Lightbulb } from 'lucide-react';
import { Logo } from './Logo';

export const AboutTab: React.FC = () => {
  const faqs = [
    {
      q: "Gimana sih cara pesan gelang/cincin di goodtobe.sparkle?",
      a: "Gampang banget! Kamu tinggal cari gelang atau cincin estetik favoritmu di Katalog, klik tombol 'Beli' untuk menambahkannya ke keranjang belanja. Klik ikon Keranjang di pojok kanan atas, isi data pengiriman kamu, lalu kirim deh rekap orderannya ke WhatsApp Mimin! Mimin akan segera memproses total harga resmi beserta ongkirnya."
    },
    {
      q: "Ukuran gelang & cincin saya harus pilih yang mana?",
      a: "Semua produk kami didesain all size! Untuk gelang, ukurannya all size karena ada yang menggunakan tali elastis premium yang mantap dan lentur, serta ada juga yang menggunakan tali adjust (bisa disesuaikan ukurannya). Sedangkan untuk cincin, tidak ada ukuran khusus—semua cincin berukuran all size karena menggunakan tali elastis premium yang sangat kuat & nyaman digunakan!"
    },
    {
      q: "Pembayarannya lewat apa saja?",
      a: "Kami menerima transfer bank lokal (BCA, Mandiri, BNI, BRI) serta e-wallet paling eksis (Gopay, OVO, Dana, ShopeePay, QRIS). Detail rekening penampung akan diberikan langsung oleh Mimin pas kamu chat ke WhatsApp."
    },
    {
      q: "Manik-maniknya luntur gak kalo kena air?",
      a: "Manik-manik mutiara dan charm akrilik kami berkualitas tinggi, tahan goresan fisik ringan. Biar makin awet mutiaranya, usahakan kurangi paparan sabun cuci keras atau alkohol parfum langsung ya!"
    }
  ];

  const features = [
    {
      title: "Handcrafted With Care",
      desc: "Setiap gelang dan cincin dibuat manual oleh tim lokal yang jago memadukan warna estetik.",
      icon: Brush,
      bgColor: "bg-brand-pink"
    },
    {
      title: "100% Unisex Design",
      desc: "Desain netral gender yang kece parah dipakai siapa saja, tanpa batasan gaya.",
      icon: Sparkles,
      bgColor: "bg-brand-yellow"
    },
    {
      title: "Bahan Premium",
      desc: "Tali karet super awet elastis maut and butir manik sintetis kokoh berkilau kelas premium.",
      icon: Shield,
      bgColor: "bg-brand-blue"
    },
    {
      title: "Gen-Z Approved",
      desc: "Dirancang eksklusif mengikuti tren Pinterest terbaru biar OOTD nongkrong makin hype!",
      icon: Flame,
      bgColor: "bg-brand-purple"
    }
  ];

  return (
    <div className="space-y-12 select-none" id="about-tentang-kami-page">
      {/* 1. Brand Banner Intro */}
      <div className="bg-brand-peach/40 border-3 border-brand-dark p-8 rounded-3xl shadow-[5px_5px_0px_#000000] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4.5xl text-brand-dark leading-snug">
            KENALAN SAMA <br />
            <span className="text-brand-pink underline decoration-brand-dark decoration-wavy inline-block mt-1 tracking-tight select-all">
              {SHOP_INFO.name.toUpperCase()}
            </span>
          </h2>
          <div className="text-sm md:text-base text-stone-700 leading-relaxed font-sans space-y-4">
            <p>
              goodtobe.sparkle adalah brand aksesori handmade yang menghadirkan gelang dan cincin manik-manik dengan desain estetik, unisex, dan penuh karakter. Setiap produk dirancang untuk melengkapi gaya sehari-hari sekaligus menjadi bentuk ekspresi diri yang unik.
            </p>
            <p>
              Koleksi kami memadukan warna-warna menarik, detail manik pilihan, serta sentuhan Y2K yang timeless dengan gaya modern yang mudah dipadukan ke berbagai outfit. Dibuat secara handmade dengan perhatian pada setiap detail, menghasilkan aksesori yang nyaman dipakai, memiliki ciri khas tersendiri, dan cocok menemani berbagai momen.
            </p>
          </div>
        </div>
        
        {/* Fun visual bento side-block */}
        <div className="md:col-span-4 flex justify-center">
          <div className="bg-white border-3 border-brand-dark p-4 rounded-2xl shadow-[4px_4px_0px_#000000] rotate-3 hover:rotate-0 transition-transform duration-300 relative">
            <span className="absolute -top-3.5 -right-3 bg-brand-pink border-2 border-brand-dark font-mono text-[9px] font-bold rounded px-1.5 py-0.5 shadow-[1.5px_1.5px_0px_#000000]">
              EST. 2026
            </span>
            <div className="w-48 h-48 bg-white flex items-center justify-center p-2 text-center overflow-hidden">
              <Logo size="full" className="!justify-center" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand Core Pillars */}
      <div className="space-y-6">
        <div className="text-center flex flex-col items-center">
          <h3 className="font-display text-2xl md:text-3xl text-brand-dark uppercase flex items-center">
            <span>KENAPA HARUS DI {SHOP_INFO.name}?</span>
          </h3>
          <p className="text-xs font-mono text-stone-500 uppercase mt-0.5 tracking-wider">
            Empat standar keanggunan pergelangan tangan kamu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`${feat.bgColor} border-3 border-brand-dark p-5 rounded-2xl shadow-[3.5px_3.5px_0px_#000000] hover:-translate-y-1 transition-transform`}
            >
              <h4 className="font-display font-black text-lg text-brand-dark leading-tight mb-2">
                {feat.title}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. FAQ Section */}
      <div className="bg-white border-3 border-brand-dark p-6 md:p-8 rounded-3xl shadow-[5px_5.5px_0px_#000000] space-y-6">
        <div className="flex items-center gap-2.5">
          <div>
            <h3 className="font-display text-2xl text-brand-dark">
              PERTANYAAN PALING SERING DIAJUKAN (FAQ)
            </h3>
            <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Menjawab semua keraguan hatimu, bestie!
            </p>
          </div>
        </div>

        <div className="divide-y divide-stone-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <h4 className="font-display font-black text-sm md:text-base text-brand-dark flex items-start gap-2 leading-tight">
                <span className="text-brand-purple font-mono">Q:</span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs md:text-sm text-stone-600 pl-6 leading-relaxed font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
