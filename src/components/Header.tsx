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
    <header className="sticky top-0 z-40 bg-white border-b-4 border-brand-dark">
      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
        {/* Brand Logo - Brutalist Block */}
        <div 
          onClick={() => setActiveTab('shop')}
          className="cursor-pointer group flex items-center select-none"
        >
          <Logo size="sm" className="scale-110 hover:rotate-1 hover:scale-115 transition-transform duration-200" />
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActiveTab('shop')}
            className={`font-display text-sm px-4 py-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-brand-yellow text-brand-dark border-brand-dark shadow-[3px_3px_0px_#121212] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white text-stone-600 border-stone-200 hover:border-brand-dark hover:text-brand-dark'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-brand-dark shrink-0" />
            <span>Koleksi Katalog</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`font-display text-sm px-4 py-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-brand-purple text-brand-dark border-brand-dark shadow-[3px_3px_0px_#121212] -translate-x-0.5 -translate-y-0.5'
                : 'bg-white text-stone-600 border-stone-200 hover:border-brand-dark hover:text-brand-dark'
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
            className="md:hidden flex items-center justify-center p-2.5 rounded-xl border-2.5 border-brand-dark bg-brand-pink text-brand-dark shadow-[2.5px_2.5px_0px_#121212] active:translate-x-0 active:translate-y-0 active:shadow-[0px_0px_0px] transition-all cursor-pointer"
            title="Lihat Katalog"
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark shrink-0" />
          </button>

          {/* Interactive Cart Button with Soft Brutalist badge */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 border-2.5 border-brand-dark bg-brand-blue text-brand-dark px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#121212] active:translate-y-0 active:shadow-[1px_1px_0px_#121212] transition-all cursor-pointer select-none"
            id="header-cart-button"
          >
            <ShoppingBag className="w-5 h-5 text-brand-dark" />
            <span className="font-display font-bold text-sm hidden sm:inline text-brand-dark">
              Keranjang
            </span>
            <span className="bg-brand-yellow text-brand-dark font-mono text-xs font-black border-2 border-brand-dark px-2 py-0.5 rounded-md min-w-[20px] text-center shadow-[1px_1.5px_0px_#121212] scale-105">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
