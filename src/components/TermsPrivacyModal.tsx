import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Scale, Pin, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { SHOP_INFO } from '../data';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

export const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white border-4 border-brand-dark rounded-3xl shadow-[8px_8px_0px_#121212] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header - Brutalist Theme Banner */}
        <div className="bg-brand-pink text-brand-dark p-4 sm:p-5 border-b-4 border-brand-dark flex justify-between items-center select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 sm:p-2 bg-white border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_#121212] flex items-center justify-center">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-brand-dark" />
            </span>
            <div>
              <h3 className="font-display font-black text-base sm:text-xl leading-none uppercase">
                Legal & Kebijakan Toko
              </h3>
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-stone-700 mt-1 leading-none">
                {SHOP_INFO.name} ✦ Transparansi & Kepercayaan No. 1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-rose-100 border-2 border-brand-dark rounded-xl transition-all cursor-pointer font-bold shadow-[2px_2px_0px_#121212] active:translate-y-0.5"
            title="Tutup"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-stone-50 border-b-2 border-brand-dark p-2 sm:p-3 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-black text-xs sm:text-sm text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-brand-yellow text-brand-dark border-brand-dark shadow-[2px_2px_0px_#121212]'
                : 'bg-white text-stone-500 border-stone-200 hover:border-brand-dark'
            }`}
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark" />
            <span>Syarat & Ketentuan</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 px-3 rounded-xl border-2 font-display font-black text-xs sm:text-sm text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-brand-mint text-brand-dark border-brand-dark shadow-[2px_2px_0px_#121212]'
                : 'bg-white text-stone-500 border-stone-200 hover:border-brand-dark'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark" />
            <span>Kebijakan Privasi</span>
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-stone-700 text-sm leading-relaxed font-sans">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <div className="bg-brand-yellow/10 border-2 border-brand-dark/10 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono text-brand-orange-dark bg-stone-50">
                <Pin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <p>
                  Dengan mengunjungi situs kami dan memesan produk aksesoris manik hand-crafted kami, Anda menyatakan menyetujui seluruh ketentuan di bawah ini.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-xs font-bold border border-brand-dark">1</span>
                    Pemesanan & Pengerjaan (Crafting Time)
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Produk aksesoris manik kami dibuat sepenuhnya dengan tangan (handmade), rajutan tangan artisan lokal yang presisi. Sebagian besar produk kami berstatus ready stock, namun untuk request khusus atau ukuran khusus, diperlukan waktu pengerjaan 1-2 hari kerja sebelum dikirimkan.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-xs font-bold border border-brand-dark">2</span>
                    Ukuran (Sizing Guide) & Kustomisasi
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Pembeli wajib mengukur lingkar pergelangan tangan (untuk gelang) atau lingkar jari (untuk cincin) menggunakan panduan ukuran kertas/pita meteran. Kami tidak melayani penukaran atau pengembalian produk akibat kesalahan pengukuran ukuran pembeli setelah pesanan selesai diproses.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-xs font-bold border border-brand-dark">3</span>
                    Metode Transaksi & Checkout WhatsApp
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Demi keamanan dan kemudahan interaksi, seluruh proses checkout di situs ini diselesaikan melalui chat WhatsApp langsung dengan tim admin resmi kami. Pembayaran resmi hanya dilakukan ke nomor rekening bank/e-wallet yang diinformasikan oleh Admin resmi kami di WhatsApp.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-xs font-bold border border-brand-dark">4</span>
                    Aturan Retur / Pengembalian Barang
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Kami selalu memastikan kontrol kualitas ketat sebelum paket dikirimkan. Retur atau refund hanya berlaku apabila produk yang Anda terima dalam keadaan rusak berat akibat cacat produksi (tali putus, manik pecah) atau salah jenis produk. Pembeli wajib menyertakan bukti <strong>video unboxing yang utuh tanpa cut/edit</strong> sejak paket dibuka untuk mengajukan komplain dalam waktu maksimal 24 jam sejak paket diterima.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-xs font-bold border border-brand-dark">5</span>
                    Warna & Kemiripan Aktual
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Ada kemungkinan terjadi sedikit perbedaan warna antara foto katalog yang ditampilkan di layar perangkat Anda dengan produk fisik asli. Perbedaan ini disebabkan oleh efek pencahayaan pemotretan, kualitas layar perangkat Anda, serta variasi batch produksi manik akrilik/kaca kami. Kami selalu berusaha menyajikan foto yang mendekati keaslian 95%.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-brand-mint/10 border-2 border-brand-dark/10 p-3 rounded-xl flex items-start gap-2.5 text-xs font-mono text-stone-700 bg-stone-50">
                <Lock className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                <p>
                  Kami sangat menghormati privasi Anda. Halaman ini menjelaskan bagaimana data dan informasi pribadi Anda kami kelola demi transaksi yang aman dan nyaman.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-mint text-xs font-bold border border-brand-dark">1</span>
                    Informasi yang Kami Kumpulkan
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Saat menggunakan checkout WhatsApp, Anda melampirkan data nama penerima, nomor handphone WhatsApp, alamat lengkap pengantaran, ekspedisi kurir, serta catatan khusus. Informasi ini dikumpulkan demi kelancaran logistik kurir pengantar paket ke tujuan Anda.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-mint text-xs font-bold border border-brand-dark">2</span>
                    Keamanan & Kerahasiaan Data Pribadi
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Kami menyatakan dengan tegas tidak akan pernah membagikan, menyebarluaskan, menyewakan, atau menjual informasi pribadi Anda kepada pihak eksternal, pengiklan, atau aplikasi pihak ketiga mana pun tanpa seizin Anda. Seluruh obrolan WhatsApp dilindungi oleh enkripsi bawaan aplikasi WhatsApp resmi.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-mint text-xs font-bold border border-brand-dark">3</span>
                    Penyimpanan Lokal (Cookies & LocalStorage)
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Situs ini memanfaatkan media penyimpanan lokal <code>LocalStorage</code> pada browser Anda demi menyajikan fitur keranjang belanja interaktif yang persisten, login admin sederhana, rincian kustomisasi item, serta kenyamanan penjelajahan. Data ini disimpan sepenuhnya di seluler / PC Anda sendiri, bukan di server cloud eksternal. Kami tidak menautkan tracker iklan beracun.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-brand-dark text-sm sm:text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-mint text-xs font-bold border border-brand-dark">4</span>
                    Hapus Data Riwayat Belanja
                  </h4>
                  <p className="pl-7 text-xs text-stone-600">
                    Anda kapan saja memiliki kendali penuh untuk menghapus seluruh data keranjang belanjaan, produk kustom, atau logs pada situs kami dengan menekan tombol hapus atau menghapus cache/data browser Anda secara langsung.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Close Confirmation Button */}
        <div className="p-4 bg-stone-50 border-t-3 border-brand-dark flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-dark hover:bg-neutral-800 text-white rounded-2xl font-display font-black text-xs sm:text-sm shadow-[3.5px_3.5px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-mint" />
            <span>SAYA MENGERTI & OK</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
