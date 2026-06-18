import React, { useState } from 'react';
import { CartItem, ShopInfo } from '../types';
import { SHOP_INFO } from '../data';
import { X, Send, ShoppingCart, MessageSquare, ArrowRight, HelpCircle, Truck, Info, User, Phone, MapPin, Map, AlertCircle, CreditCard } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22l5.135-1.348a9.97 9.97 0 0 0 4.877 1.28h.005c5.505 0 9.99-4.478 9.99-9.985C22.007 6.478 17.519 2 12.012 2zm6.069 14.195c-.272.768-1.578 1.475-2.182 1.564-.541.08-1.248.137-3.674-.866-3.099-1.282-5.067-4.425-5.222-4.63-.155-.205-1.258-1.672-1.258-3.197 0-1.525.799-2.273 1.087-2.572.288-.299.631-.374.842-.374.21 0 .42.001.603.009.192.008.45-.072.705.545.266.64.91 2.22.988 2.38.077.16.13.346.024.557-.105.211-.158.344-.316.527-.158.183-.332.408-.474.547-.156.152-.319.319-.138.63.18.31.802 1.324 1.722 2.144.92.82 1.696 1.074 2.01 1.234.314.16.494.133.68-.083.185-.216.799-.93.101-1.04-.15-.024-.954-.403-1.054-.49-.1-.087-.166-.217-.1-.322.067-.105.3-.408.453-.563.153-.155.309-.327.462-.17.153.155.97.457 1.137.54.166.083.277.125.333.222.055.097.055.56-.217 1.328z"/>
  </svg>
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  onClearCart,
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedCourier, setSelectedCourier] = useState(SHOP_INFO.shippingOptions[0]);
  const [generalNote, setGeneralNote] = useState('');
  const [isJaksel, setIsJaksel] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeShipping = totalItemsCount >= 3 && isJaksel;

  if (!isOpen) return null;

  // Compute WA Dynamic Link using URL parameters
  const whatsappUrl = () => {
    // 1. Build string list representing items in the cart
    const itemsText = cartItems
      .map((item, idx) => {
        const p = item.product;
        const codeStr = p.code ? ` (${p.code})` : '';
        let detailsText = '';
        
        // If DIY custom bracelet, print specific customized parameters
        if (item.customization) {
          const cust = item.customization;
          const wordText = cust.wording ? `"${cust.wording}"` : 'Polos';
          const sizeText = cust.sizeStr === 'S' ? 'S (14cm)' : cust.sizeStr === 'M' ? 'M (16cm)' : 'L (18cm)';
          detailsText = `\n     └─ Huruf: ${wordText}\n     └─ Ukuran: ${sizeText}\n     └─ Kail: ${cust.claspType}`;
        } else {
          detailsText = `\n     └─ Kategori: ${p.category}\n     └─ Detail Manik: ${p.beadsUsed.join(', ')}`;
        }

        return `${idx + 1}. *[${item.quantity}x] ${p.name}${codeStr}*\n     Harga: Rp ${(p.price * item.quantity).toLocaleString('id-ID')}${detailsText}`;
      })
      .join('\n\n');

    // Courier price split
    const courierParts = selectedCourier.split(' (Rp ');
    const courierName = courierParts[0];
    const originalCourierPrice = courierParts[1] ? parseInt(courierParts[1].replace(/\D/g, ''), 10) : 0;
    const courierPrice = isFreeShipping ? 0 : originalCourierPrice;
    const finalTotal = totalPrice + courierPrice;

    // 2. Format a clean, professional WhatsApp message text with minimal emojis
    const message = `Halo goodtobe.sparkle! Saya ingin memesan produk berikut:\n\n` +
      `*DAFTAR BELANJAAN:*\n` +
      `------------------------------------------\n` +
      `${itemsText}\n` +
      `------------------------------------------\n\n` +
      `*DATA PENERIMA DAN DETAIL PENGIRIMAN:*\n` +
      `- Nama: ${buyerName || 'Belum diisi'}\n` +
      `- No. WhatsApp: ${buyerPhone || 'Belum diisi'}\n` +
      `- Alamat Lengkap: ${deliveryAddress || 'Belum diisi'}\n` +
      `- Metode Pembayaran: ${paymentMethod}\n` +
      `- Ekspedisi: ${courierName} ${isFreeShipping ? '(Gratis Ongkir)' : `(Rp ${courierPrice.toLocaleString('id-ID')})`}\n` +
      `- Catatan khusus: ${generalNote || '-'}\n\n` +
      `*RINCIAN HARGA:*\n` +
      `- Harga Barang: Rp ${totalPrice.toLocaleString('id-ID')}\n` +
      `- Ongkir: Rp ${courierPrice.toLocaleString('id-ID')}${isFreeShipping ? ' (Gratis!)' : ''}\n` +
      `- Total: Rp ${finalTotal.toLocaleString('id-ID')}\n\n` +
      `Mohon segera diproses pesanannya. Terima kasih banyak!`;

    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodedText}`;
  };

  const isFormValid = buyerName.trim() !== '' && buyerPhone.trim() !== '' && deliveryAddress.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border-4 border-brand-dark rounded-3xl shadow-[8px_8px_0px_#121212] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal - Thick Banner */}
        <div className="bg-brand-yellow text-brand-dark p-4 border-b-4 border-brand-dark flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white border-2 border-brand-dark rounded-lg flex items-center justify-center shadow-[1.5px_1.5px_0px_#121212]">
              <Truck className="w-5 h-5 text-brand-dark" />
            </span>
            <div>
              <h3 className="font-display font-black text-xl leading-none">
                FORM CHECKOUT WA
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mt-1 leading-none">
                Sisa 1 langkah buat dapetin orderanmu!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-white hover:bg-rose-100 border-2 border-brand-dark rounded-xl transition-all cursor-pointer font-bold text-xs shadow-[2px_2px_0px_#121212] active:translate-y-0.5"
          >
            <X className="w-5.5 h-5.5 text-brand-dark" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 select-none">
          
          {/* Quick Notice */}
          <div className="bg-brand-mint/40 border-2 border-brand-dark p-3.5 rounded-2xl flex items-start gap-2.5 shadow-[3px_3px_0px_#121212]">
            <Info className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              Isi formulir pengiriman di bawah ya, bestie! Setelah diisi, klik tombol <strong>KIRIM KE WHATSAPP</strong> di bawah. Kamu akan langsung dialihkan ke chat WA Mimin untuk pembayaran & konfirmasi resi.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            
            {/* Name */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-dark shrink-0" />
                <span>NAMA LENGKAP PENERIMA</span>
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="nama lengkap kamu..."
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2.5 font-mono text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            {/* WA No */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-dark shrink-0" />
                <span>NO. WHATSAPP AKTIF</span>
              </label>
              <input
                type="tel"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="misal: 08123456789"
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2.5 font-mono text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-dark shrink-0" />
                <span>ALAMAT LENGKAP PENGIRIMAN</span>
              </label>
              <textarea
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Tulis alamat jalan, RT/RW, Kec., Kota, Prov. dan Kode Pos..."
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl p-3 font-mono text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>

            {/* Payment Method Dropdown */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-brand-dark shrink-0" />
                <span>METODE PEMBAYARAN</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full max-w-xs bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 font-mono text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-purple cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23121212' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px'
                }}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="GoPay">GoPay</option>
                <option value="ShopeePay">ShopeePay</option>
                <option value="Dana">Dana</option>
                <option value="QRIS All Payment">QRIS All Payment</option>
                <option value="Lainnya (Hubungi Admin Sparkle)">Lainnya (Hubungi Admin Sparkle)</option>
              </select>
            </div>

            {/* Area Selection for Free Shipping */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <Map className="w-4 h-4 text-brand-dark shrink-0" />
                <span>AREA UTAMA PENGIRIMAN</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsJaksel(true)}
                  className={`px-3 py-2 border-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isJaksel
                      ? 'border-brand-dark bg-brand-mint text-brand-dark shadow-[2.5px_2.5px_0px_#121212]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 border-b-4'
                  }`}
                >
                  Jakarta Selatan
                </button>
                <button
                  type="button"
                  onClick={() => setIsJaksel(false)}
                  className={`px-3 py-2 border-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    !isJaksel
                      ? 'border-brand-dark bg-stone-100 text-brand-dark shadow-[2.5px_2.5px_0px_#121212]'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 border-b-4'
                  }`}
                >
                  Luar Jakarta Selatan
                </button>
              </div>
              <p className="text-[9px] font-mono text-stone-500 leading-tight pt-1">
                *Gratis ongkos kirim minimal beli 3 item khusus pengiriman area Jakarta Selatan!
              </p>
            </div>

            {/* Courier Selection */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brand-dark shrink-0" />
                <span>EXPEDISI / LAYANAN PENGIRIMAN</span>
              </label>
              <div className="flex flex-col gap-1.5">
                {SHOP_INFO.shippingOptions.map((courier, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 px-3 py-2 border-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedCourier === courier
                        ? 'border-brand-dark bg-brand-blue/60 shadow-[2.5px_2.5px_0px_#121212]'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="courierOption"
                      checked={selectedCourier === courier}
                      onChange={() => setSelectedCourier(courier)}
                      className="accent-brand-dark"
                    />
                    <span>{courier}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Note */}
            <div className="space-y-1">
              <label className="font-display text-xs text-brand-dark flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-dark shrink-0" />
                <span>CATATAN KHUSUS (Opsional)</span>
              </label>
              <input
                type="text"
                value={generalNote}
                onChange={(e) => setGeneralNote(e.target.value)}
                placeholder="misal: request tulisan kartu ucapan ulang tahun..."
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2.5 font-mono text-xs text-brand-dark focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Order Summary inside form */}
          <div className="bg-stone-100 border-2 border-brand-dark rounded-2xl p-4 space-y-2">
            <span className="font-display font-black text-xs text-brand-dark tracking-wide block uppercase">
              Rincian Biaya Akhir:
            </span>
            <div className="flex justify-between items-center text-xs font-mono font-bold">
              <span className="text-stone-500">Jumlah Pesanan:</span>
              <span className="text-brand-dark">{totalItemsCount} Pcs</span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-stone-500">Harga Semua Produk:</span>
              <span className="font-bold text-brand-dark">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-stone-500">Ongkos Kirim Kurir:</span>
              <span className={`font-bold ${isFreeShipping ? 'text-emerald-700' : 'text-brand-dark'}`}>
                {isFreeShipping ? (
                  <span><s>Rp {parseInt(selectedCourier.split(' (Rp ')[1]?.replace(/\D/g, '') || '0', 10).toLocaleString('id-ID')}</s> <strong className="text-xs bg-brand-mint text-brand-dark px-1.5 py-0.5 rounded ml-1">FREE!</strong></span>
                ) : (
                  `Rp ${parseInt(selectedCourier.split(' (Rp ')[1]?.replace(/\D/g, '') || '0', 10).toLocaleString('id-ID')}`
                )}
              </span>
            </div>

            {isFreeShipping && (
              <div className="bg-emerald-100 border border-emerald-400 p-2 rounded-lg text-center text-[10px] font-mono text-emerald-800 font-bold uppercase mt-1 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <span>PROMO GRATIS ONGKIR JAKARTA SELATAN (MIN. BELI 3) DIAKTIFKAN!</span>
              </div>
            )}

            <div className="h-[1.5px] bg-brand-dark/20 my-1.5" />
            <div className="flex justify-between items-center">
              <span className="font-display font-extrabold text-sm text-brand-dark">TOTAL ESTIMASI AKHIR:</span>
              <span className="font-mono font-black text-base text-brand-dark bg-brand-pink/70 px-2 py-0.5 border border-brand-dark rounded">
                Rp {(totalPrice + (isFreeShipping ? 0 : parseInt(selectedCourier.split(' (Rp ')[1]?.replace(/\D/g, '') || '0', 10))).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Form Action Banner */}
        <div className="p-4 bg-stone-50 border-t-3 border-brand-dark flex flex-col gap-2">
          {!isFormValid ? (
            <div className="text-center text-[10px] font-mono text-rose-500 font-bold uppercase py-1 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Kakak harus mengisi Nama, No WA & Alamat dapet membeli!</span>
            </div>
          ) : null}

          {/* Checkout Button Redirection Link */}
          <a
            href={isFormValid ? whatsappUrl() : '#'}
            onClick={(e) => {
              if (!isFormValid) {
                e.preventDefault();
                alert("Harap lengkapi Nama Penerima, No. WA, dan Alamat Lengkap terlebih dahulu ya!");
              } else {
                // Instantly clear the cart and close modal upon submission to help keep state clean and complete!
                setTimeout(() => {
                  onClearCart();
                  onClose();
                }, 1000);
              }
            }}
            target="_self"
            className={`w-full py-3 px-6 rounded-2xl flex items-center justify-center gap-3 border-3 transition-all font-display font-black text-base tracking-widest ${
              isFormValid
                ? 'bg-[#25D366] border-brand-dark text-brand-dark hover:-translate-y-0.5 shadow-[3.5px_4px_0px_#121212] hover:shadow-[5.5px_6px_0px_#121212] cursor-pointer'
                : 'bg-stone-200 text-stone-400 border-stone-300 shadow-none cursor-not-allowed pointer-events-none'
            }`}
          >
            <WhatsAppIcon className="w-5 h-5 shrink-0" />
            <span>KIRIM KE WHATSAPP KITA</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
