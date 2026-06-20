import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onNavigateToCatalog: () => void;
  onNavigateToAbout: () => void;
  onOpenCart: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  setActiveTab,
  onOpenTerms,
  onOpenPrivacy,
  onNavigateToCatalog,
  onNavigateToAbout,
  onOpenCart,
}) => {
  const handleContactWhatsApp = () => {
    window.open(
      "https://wa.me/6285123324775?text=Halo%20goodtobe.sparkle%20Admin!%20Saya%20ingin%20tanya-tanya%20mengenai%20produk%20aksesorisnya.",
      "_self"
    );
  };

  return (
    <footer className="bg-brand-dark text-white border-t-8 border-brand-dark mt-16 pb-12 pt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="sm:col-span-2 md:col-span-4 space-y-4">
            <h2 className="font-display font-black text-2xl tracking-tighter text-white">
              goodtobe.sparkle
            </h2>
            <p className="text-xs text-stone-400 font-sans leading-relaxed">
              Handmade accessories untuk menemani momen sehari-hari.
            </p>
          </div>

          {/* Col 2: Jelajahi */}
          <div className="sm:col-span-1 md:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-300">
              Jelajahi
            </h3>
            <ul className="space-y-2 text-xs font-mono text-stone-400">
              <li>
                <button
                  onClick={onNavigateToCatalog}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Semua Produk
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateToCatalog}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Pilihan Katalog
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateToAbout}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Tentang Kami
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCart}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Keranjang
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Bantuan */}
          <div className="sm:col-span-1 md:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-300">
              Bantuan
            </h3>
            <ul className="space-y-2 text-xs font-mono text-stone-400">
              <li>
                <button
                  onClick={onNavigateToAbout}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Info Pengiriman
                </button>
              </li>
              <li>
                <button
                  onClick={handleContactWhatsApp}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Kontak Kami
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="sm:col-span-1 md:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-300">
              Legal
            </h3>
            <ul className="space-y-2 text-xs font-mono text-stone-400">
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Syarat & Ketentuan
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white cursor-pointer transition-colors text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Ikuti Kami */}
          <div className="sm:col-span-1 md:col-span-2 space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-300">
              Ikuti Kami
            </h3>
            <ul className="space-y-2 text-xs font-mono text-stone-400">
              <li>
                <a
                  href="https://instagram.com/goodtobe.sparkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white cursor-pointer transition-colors block text-left"
                >
                  Instagram
                </a>
              </li>
              <li>
                <button
                  onClick={handleContactWhatsApp}
                  className="hover:text-white cursor-pointer transition-colors block text-left"
                >
                  WhatsApp
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and Quote */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col items-start gap-4">
          <p className="font-mono italic text-stone-300 text-sm md:text-base leading-none">
            “Warnai harimu dengan Sparkle.”
          </p>

          <div className="w-full pt-4 border-t border-white/5 flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
              Metode Pembayaran:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-mono font-bold">
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">COD</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">Seabank</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">BCA</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">Mandiri</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">QRIS</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">GoPay</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">ShopeePay</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">Dana</span>
              <span className="bg-neutral-900 text-stone-300 border border-white/10 px-2.5 py-0.5 rounded-md">OVO</span>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-center justify-between text-xs font-mono text-stone-500 gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p>© 2026 goodtobe.sparkle. All rights reserved.</p>
              <p>Dibuat oleh goodtobe.sparkle Team.</p>
            </div>
            
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-brand-pink hover:text-white font-bold cursor-pointer transition-colors w-fit border border-brand-pink/30 hover:border-white px-3 py-1.5 rounded-xl bg-neutral-900 shadow-[1.5px_1.5px_0px_#ff85a2] active:translate-y-0.5 active:shadow-none"
              title="Kelola Toko (Admin)"
              id="footer-admin-link"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
