import React from 'react';
import { SHOP_INFO } from '../data';
import { Instagram, Send, MapPin, ShieldCheck, Lock, UserPlus } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.135-1.348a9.97 9.97 0 0 0 4.877 1.28h.005c5.505 0 9.99-4.478 9.99-9.985C22.007 6.478 17.519 2 12.012 2zm6.069 14.195c-.272.768-1.578 1.475-2.182 1.564-.541.08-1.248.137-3.674-.866-3.099-1.282-5.067-4.425-5.222-4.63-.155-.205-1.258-1.672-1.258-3.197 0-1.525.799-2.273 1.087-2.572.288-.299.631-.374.842-.374.21 0 .42.001.603.009.192.008.45-.072.705.545.266.64.91 2.22.988 2.38.077.16.13.346.024.557-.105.211-.158.344-.316.527-.158.183-.332.408-.474.547-.156.152-.319.319-.138.63.18.31.802 1.324 1.722 2.144.92.82 1.696 1.074 2.01 1.234.314.16.494.133.68-.083.185-.216.799-.93.101-1.04-.15-.024-.954-.403-1.054-.49-.1-.087-.166-.217-.1-.322.067-.105.3-.408.453-.563.153-.155.309-.327.462-.17.153.155.97.457 1.137.54.166.083.277.125.333.222.055.097.055.56-.217 1.328z"/>
  </svg>
);

interface FooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTab,
  setActiveTab,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-brand-dark text-white border-t-8 border-brand-dark mt-16 pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Dynamic Bento Style Grid for footer links and info */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Main Manifesto */}
          <div className="md:col-span-5 bg-white text-brand-dark border-3 border-brand-dark p-6 rounded-2xl shadow-[5px_5px_0px_#ffb3c1] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block bg-brand-yellow px-3 py-1 font-display font-bold text-xs uppercase border-2 border-brand-dark rounded-md tracking-wider">
                MANIFESTO KITA ✦
              </div>
              <h2 className="font-display font-black text-lg min-[360px]:text-xl sm:text-3xl leading-tight text-brand-dark tracking-tighter sm:tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {SHOP_INFO.name}
              </h2>
              <p className="text-sm font-sans text-stone-700 leading-relaxed">
                {SHOP_INFO.about}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-100 text-xs font-mono text-stone-500">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>Aman & Terpercaya ✦ Checkout WhatsApp Instan</span>
            </div>
          </div>

          {/* Social Feeds & Contacts */}
          <div className="md:col-span-4 bg-brand-purple text-brand-dark border-3 border-brand-dark p-6 rounded-2xl shadow-[5px_5px_0px_#b3e5fc] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block bg-white px-3 py-1 font-display font-bold text-xs uppercase border-2 border-brand-dark rounded-md tracking-wider flex items-center gap-1 w-fit">
                <span>IKUTI KITA BESTIE</span>
                <UserPlus className="w-3.5 h-3.5 text-brand-dark shrink-0" />
              </div>
              <h3 className="font-display font-black text-2xl tracking-tight leading-tight">
                SOSIAL MEDIA & CHAT
              </h3>
              <p className="text-xs text-stone-800 font-mono leading-relaxed">
                Jangan lupa follow media sosial kita buat dapet asupan katalog gelang terlucu dan giveaway manik maut tiap minggunya!
              </p>

              <div className="flex flex-col gap-2.5 pt-3">
                <a
                  href={`https://instagram.com/${SHOP_INFO.igUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 bg-white border-2 border-brand-dark rounded-xl font-mono text-xs font-bold hover:bg-brand-pink hover:-translate-y-0.5 transition-all text-brand-dark cursor-pointer"
                >
                  <span className="p-1 bg-brand-pink/50 rounded-lg">
                    <Instagram className="w-4 h-4 text-brand-dark" />
                  </span>
                  <span>@{SHOP_INFO.igUsername}</span>
                </a>

                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=Halo%20goodtobe.sparkle%20Admin!%20Saya%20ingin%20tanya-tanya%20mengenai%20produk%20aksesorisnya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 bg-white border-2 border-brand-dark rounded-xl font-mono text-xs font-bold hover:bg-emerald-100 hover:-translate-y-0.5 transition-all text-brand-dark cursor-pointer"
                >
                  <span className="p-1 bg-emerald-100/50 rounded-lg flex items-center justify-center">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                  </span>
                  <span>WhatsApp Admin</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shipping & Location */}
          <div className="md:col-span-3 bg-brand-yellow text-brand-dark border-3 border-brand-dark p-6 rounded-2xl shadow-[5px_5px_0px_#c8e6c9] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-block bg-white px-3 py-1 font-display font-bold text-xs border-2 border-brand-dark rounded-md tracking-wider flex items-center gap-1.5 w-fit">
                <span>ALAMAT TOKO & KURIR</span>
                <MapPin className="w-3.5 h-3.5 text-brand-dark shrink-0" />
              </div>
              
              <div className="text-xs font-mono text-[11px] leading-relaxed text-stone-800">
                {SHOP_INFO.address}
              </div>

              <div className="pt-2 border-t border-brand-dark/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                  Ekspedisi Tersedia:
                </span>
                <div className="flex flex-wrap gap-1">
                  {SHOP_INFO.shippingOptions.map((opt, i) => {
                    const cleanName = opt.includes(' - ') ? opt.split(' - ')[0] : opt.split(' (')[0];
                    return (
                      <span
                        key={i}
                        className="bg-white border-1.5 border-brand-dark text-brand-dark px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-[1px_1.5px_0px_#121212]"
                      >
                        {cleanName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono text-stone-600 mt-6">
              Buka Setiap Hari ✦ Jam 08.30 - 23.00 WIB
            </div>
          </div>
        </div>

        {/* Footer Credit Line */}
        <div className="border-t-3 border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-stone-400 gap-4">
          <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-full border border-white/10">
            <span>made by goodtobe.sparkle Team. Since 2025. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span
              onClick={onOpenTerms}
              className="hover:text-white cursor-pointer hover:underline transition-colors"
            >
              Syarat & Ketentuan
            </span>
            <span>✦</span>
            <span
              onClick={onOpenPrivacy}
              className="hover:text-white cursor-pointer hover:underline transition-colors"
            >
              Kebijakan Privasi
            </span>
            <span>✦</span>
            <button
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-brand-mint hover:text-white font-bold cursor-pointer transition-colors"
              title="Kelola Toko (Admin)"
              id="footer-admin-link"
            >
              <Lock className="w-3 h-3" />
              <span>Kelola Toko (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
