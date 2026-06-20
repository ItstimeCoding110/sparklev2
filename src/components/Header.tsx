import React from 'react';
import { ShoppingBag, Heart, Sparkles, HelpCircle, Info } from 'lucide-react';
import { SHOP_INFO } from '../data';
import { Logo } from './Logo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-brand-dark select-none">
      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo - Brutalist Block */}
        <div 
          onClick={() => setActiveTab('shop')}
          className="cursor-pointer group flex items-center select-none"
        >
          <Logo size="sm" className="scale-110 hover:rotate-2 hover:scale-115 transition-transform duration-200" />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`font-display text-xs sm:text-sm px-4 py-2.5 rounded-xl border-3 font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-brand-yellow text-brand-dark border-brand-dark shadow-[4px_4px_0px_#000000] -translate-x-1 -translate-y-1'
                : 'bg-white text-stone-600 border-brand-dark hover:border-brand-dark hover:text-brand-dark hover:bg-brand-yellow/10 hover:shadow-[4px_4px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-brand-dark shrink-0" />
            <span>Koleksi Katalog</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`font-display text-xs sm:text-sm px-4 py-2.5 rounded-xl border-3 font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-brand-purple text-brand-dark border-brand-dark shadow-[4px_4px_0px_#000000] -translate-x-1 -translate-y-1'
                : 'bg-white text-stone-600 border-brand-dark hover:border-brand-dark hover:text-brand-dark hover:bg-brand-purple/10 hover:shadow-[4px_4px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1'
            }`}
          >
            <Info className="w-4 h-4 text-brand-dark shrink-0" />
            <span>Tentang Kita</span>
          </button>
        </nav>

        {/* Buttons (Search/Cart) */}
        <div className="flex items-center gap-3">
          {/* Quick shop filter shortcut button for mobile view */}
          <button
            onClick={() => setActiveTab('shop')}
            className="md:hidden flex items-center justify-center p-3 rounded-xl border-3 border-brand-dark bg-brand-pink text-brand-dark shadow-[3px_3px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
            title="Lihat Katalog"
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark shrink-0" />
          </button>

          {/* Interactive Cart Button with Soft Brutalist badge */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 border-3 border-brand-dark bg-brand-blue text-brand-dark px-4 py-3 rounded-xl shadow-[4px_4px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer select-none font-display font-black uppercase text-xs tracking-wider"
            id="header-cart-button"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-brand-dark" />
            <span className="hidden sm:inline">
              Keranjang
            </span>
            <span className="bg-brand-yellow text-brand-dark font-mono text-xs font-black border-2 border-brand-dark px-2 py-0.5 rounded-md min-w-[22px] text-center shadow-[1.5px_1.5px_0px_#000000] scale-105 rotate-6">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
