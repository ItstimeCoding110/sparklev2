import React from 'react';
import { ShoppingBag, ArrowRight, Info } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onNavigateToAbout: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onNavigateToAbout }) => {
  return (
    <div className="relative overflow-hidden bg-brand-pink/15 border-4 border-brand-dark pt-16 p-6 md:p-10 rounded-3xl shadow-[8px_8px_0px_#000000] my-8 select-none">
      {/* OS window top control bar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-brand-dark border-b-3 border-brand-dark flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-brand-pink border border-brand-dark" />
          <span className="w-3.5 h-3.5 rounded-full bg-brand-yellow border border-brand-dark" />
          <span className="w-3.5 h-3.5 rounded-full bg-brand-mint border border-brand-dark" />
        </div>
        <span className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest font-black hidden sm:inline-block">
          goodtobe.sparkle_explorer.exe
        </span>
        <div className="w-12 h-1 bg-white/20 rounded" />
      </div>

      {/* Absolute decorative floating background badges */}
      <div className="absolute top-16 right-6 hidden lg:flex flex-col gap-3 select-none">
        <div className="bg-brand-pink font-display font-black text-[10px] sm:text-xs border-3 border-brand-dark px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000000] uppercase tracking-wider rotate-6 hover:-rotate-1 transition-transform duration-200 cursor-default">
          🔥 Limited Stock
        </div>
        <div className="bg-brand-blue font-display font-black text-[10px] sm:text-xs border-3 border-brand-dark px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000000] uppercase tracking-wider -rotate-6 hover:-rotate-2 transition-transform duration-200 cursor-default">
          ✨ 100% Handmade
        </div>
        <div className="bg-brand-mint font-display font-black text-[10px] sm:text-[11px] border-3 border-brand-dark px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000000] uppercase tracking-wider rotate-3 hover:rotate-0 transition-transform duration-200 cursor-default">
          📦 Free Ongkir Jaksel Min 3
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Playful Gen-Z tag */}
        <div className="inline-flex items-center bg-brand-mint border-3 border-brand-dark px-3.5 py-1 rounded-xl shadow-[3px_3px_0px_#000000]">
          <span className="font-mono text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-dark">
            ✦ Handmade - Limited - For Every Style ✦
          </span>
        </div>

        {/* Catchy headline */}
        <h1 className="font-display font-black text-3.5xl sm:text-5xl md:text-6xl text-brand-dark leading-[1.02] tracking-tighter uppercase">
          WARNAI HARIMU<br />DENGAN <span className="bg-brand-yellow px-3 py-1 border-3 border-brand-dark inline-block shadow-[4px_4px_0px_#000000] -rotate-1 select-none">SPARKLE!</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed font-sans max-w-xl">
          Temukan koleksi cincin dan gelang manik-manik estetik buatan lokal bertema streetwear, cyberpunk, dan minimalis retro yang 100% ramah gender (unisex). Bebas pilih sesuka hati, isi formulir keranjang belanja, lalu kirim pesanan instan langsung ke WhatsApp!
        </p>

        {/* Call to Actions Bento Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={onExploreCatalog}
            className="brutalist-button py-3 text-xs sm:text-sm px-4 sm:px-6 bg-brand-yellow flex items-center justify-center gap-2 rounded-2xl font-display font-black tracking-wider shadow-[4.5px_4.5px_0px_#000000] hover:shadow-[6px_6px_0px_#000000]"
          >
            <ShoppingBag className="w-4 h-4 text-brand-dark shrink-0" />
            <span>LIHAT DAFTAR PRODUK</span>
            <ArrowRight className="w-4 h-4 text-brand-dark shrink-0" />
          </button>
          
          <button
            onClick={onNavigateToAbout}
            className="brutalist-button-pink py-3 text-xs sm:text-sm px-4 sm:px-6 flex items-center justify-center gap-2 rounded-2xl font-display font-black tracking-wider shadow-[4.5px_4.5px_0px_#000000] hover:shadow-[6px_6px_0px_#000000]"
          >
            <Info className="w-4 h-4 text-brand-dark shrink-0" />
            <span>TENTANG SPARKLE</span>
          </button>
        </div>
      </div>

      {/* Decorative bead chain line at the bottom */}
      <div className="absolute bottom-3 left-6 right-6 hidden md:flex items-center gap-1.5 opacity-80 select-none pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => {
          const colors = ['bg-brand-pink', 'bg-brand-yellow', 'bg-brand-purple', 'bg-brand-blue', 'bg-brand-mint'];
          const randColor = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 border-brand-dark ${randColor}`}
            />
          );
        })}
      </div>
    </div>
  );
};
