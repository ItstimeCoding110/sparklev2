import React from 'react';
import { HelpCircle, Sparkles, ShoppingBag, ArrowRight, Flame, Heart, Box, Info } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onNavigateToAbout: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onNavigateToAbout }) => {
  return (
    <div className="relative overflow-hidden bg-brand-pink/25 border-3 border-brand-dark p-6 md:p-10 rounded-4xl shadow-[6px_6.5px_0px_#000000] my-8 select-none">
      {/* Absolute decorative floating background badges */}
      <div className="absolute top-4 right-4 hidden md:flex flex-col gap-2 rotate-6">
        <span className="bg-brand-pink font-display font-black text-xs border-2 border-brand-dark px-3 py-1 rounded shadow-[2.5px_2.5px_0px_#000000] uppercase tracking-wide">
          <span>Limited Stock Terbatas</span>
        </span>
        <span className="bg-brand-blue font-display font-black text-xs border-2 border-brand-dark px-3 py-1 rounded shadow-[2.5px_2.5px_0px_#000000] uppercase tracking-wide -rotate-2">
          <span>100% Handmade</span>
        </span>
        <span className="bg-brand-mint font-display font-black text-[11px] border-2 border-brand-dark px-3 py-1 rounded shadow-[2.5px_2.5px_0px_#000000] uppercase tracking-wide rotate-3">
          <span>Gratis Ongkir Jaksel Min 3</span>
        </span>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Playful Gen-Z tag */}
        <div className="inline-flex items-center bg-brand-mint border-2 border-brand-dark px-2.5 py-0.5 sm:py-1 rounded-full shadow-[2px_2.5px_0px_#000000]">
          <span className="font-mono text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-dark">
            HANDMADE - LIMITED - FOR EVERY STYLE
          </span>
        </div>

        {/* Catchy headline */}
        <h1 className="font-display font-black text-3.5xl sm:text-5xl md:text-5.5xl text-brand-dark leading-[1.05] tracking-tight">
          WARNAI HARIMU DENGAN <span className="underline decoration-brand-orange decoration-wavy py-1">SPARKLE!</span>
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
            <span>TENTANG GOODTOBE.SPARKLE</span>
          </button>
        </div>
      </div>

      {/* Decorative bead chain line at the bottom */}
      <div className="absolute bottom-3 left-6 right-6 hidden md:flex items-center gap-1.5 opacity-30 select-none pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => {
          const colors = ['bg-brand-pink', 'bg-brand-yellow', 'bg-brand-purple', 'bg-brand-blue', 'bg-brand-mint'];
          const randColor = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border border-brand-dark ${randColor}`}
            />
          );
        })}
      </div>
    </div>
  );
};
