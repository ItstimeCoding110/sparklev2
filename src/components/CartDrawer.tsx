import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Box, Sparkles } from 'lucide-react';
import { BraceletVisualizer } from './BraceletVisualizer';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  totalPrice: number;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      {/* Click outside to close wrapper */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Cart Container - Soft Brutalist Panel */}
      <div className="relative w-full max-w-md h-full bg-white border-l-4 border-brand-dark shadow-[-8px_0px_0px_#000000] flex flex-col justify-between overflow-hidden z-10">
        
        {/* Header Drawer Banner */}
        <div className="bg-brand-pink text-brand-dark p-4 border-b-4 border-brand-dark flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5.5 h-5.5 text-brand-dark" />
            <div>
              <h3 className="font-display font-black text-xl leading-none">
                KERANJANG BELANJA
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 mt-1 leading-none">
                Estetik Kurasi: {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Pcs
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-white border-2 border-brand-dark rounded-xl transition-all font-bold text-xs shadow-[2px_2px_0px_#000000] active:translate-y-0.5 cursor-pointer leading-none flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>TUTUP</span>
          </button>
        </div>

        {/* Scrollable Cart Item Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 select-none bg-stone-50/50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <ShoppingBag className="w-14 h-14 text-stone-400 mx-auto animate-bounce mb-1" />
              <h4 className="font-display text-lg text-brand-dark leading-tight">Keranjang Kosong Melompong!</h4>
              <p className="text-xs text-stone-500 font-mono max-w-[240px]">
                Waduh bestie, buruan isi dengan gelang atau cincin manik impianmu biar tangan makin estetik!
              </p>
              <button
                onClick={onClose}
                className="brutalist-button text-xs"
              >
                <span>MULAI BELANJA SEKARANG</span>
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const p = item.product;

              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-brand-dark rounded-2xl p-4 shadow-[3.5px_3.5px_0px_#000000] flex gap-3 relative"
                >
                  {/* Decorative visual block showing thumbnail or 3D visualizer */}
                  <div className="w-14 h-14 rounded-xl border-2 border-brand-dark bg-stone-50 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden relative shadow-[2px_2px_0px_#000000]">
                    {p.image ? (
                      <div className="w-full h-full rounded-lg overflow-hidden relative isolation-isolate">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <BraceletVisualizer
                        colors={p.colors}
                        wording=""
                        size="sm"
                        isRotating={false}
                      />
                    )}
                  </div>

                  {/* Quantity and Metas */}
                  <div className="flex-1 min-w-0 pr-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-bold text-sm text-brand-dark leading-tight truncate">
                        {p.name}
                      </h4>
                      
                      <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                        Kategori: {p.category} | Sisa Stok: {p.stock !== undefined ? p.stock : 10}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono font-black text-xs text-brand-dark">
                        Rp {(p.price * item.quantity).toLocaleString('id-ID')}
                      </span>

                      <div className="flex items-center gap-1.5 border-1.5 border-brand-dark rounded-lg p-0.5 bg-stone-50 scale-95">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 rounded cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3 text-brand-dark" />
                        </button>
                        <span className="font-mono font-bold text-xs text-brand-dark px-1 bg-white border border-stone-200 rounded min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={item.quantity >= (p.stock !== undefined ? p.stock : 10)}
                          title={item.quantity >= (p.stock !== undefined ? p.stock : 10) ? "Maksimal stok tercapai" : "Tambah jumlah"}
                        >
                          <Plus className="w-3 h-3 text-brand-dark" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Absolute Delete Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2.5 right-2.5 p-1 bg-stone-50 hover:bg-rose-100 hover:text-rose-500 text-stone-400 border border-brand-dark rounded-lg transition-colors cursor-pointer"
                    title="Buang dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Action Panel and Subtotals */}
        {cartItems.length > 0 && (() => {
          const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
          const neededForFreeShipping = Math.max(0, 3 - totalItemsCount);
          const isFreeShipping = totalItemsCount >= 3;

          return (
            <div className="p-5 border-t-3 border-brand-dark bg-white space-y-4 select-none">
              
              {/* Dynamic Free Shipping Promo Banner */}
              {isFreeShipping ? (
                <div className="bg-brand-mint/55 border-2 border-brand-dark p-2.5 rounded-xl text-[11px] font-mono flex items-center gap-2 shadow-[2px_2.5px_0px_#000000]">
                  <Sparkles className="w-5 h-5 text-brand-dark shrink-0" />
                  <div>
                    <span className="font-extrabold text-brand-dark block text-xs">YAY! GRATIS ONGKIR SEGERA AKTIF!</span>
                    <p className="text-stone-700 leading-tight font-sans">Kamu beli {totalItemsCount} item, berhak dapet GRATIS ONGKIR khusus area <strong>Jakarta Selatan</strong>! Pilih wilayahmu pas checkout nanti ya!</p>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-orange/25 border-2 border-brand-dark p-2.5 rounded-xl text-[11px] font-mono flex items-center gap-2 shadow-[2px_2.5px_0px_#000000]">
                  <Box className="w-5 h-5 text-brand-dark shrink-0 animate-pulse" />
                  <div>
                    <span className="font-extrabold text-brand-dark block text-xs">DIKIT LAGI GRATIS ONGKIR JAKSEL!</span>
                    <p className="text-stone-700 leading-tight font-sans">Kurang <strong className="text-brand-orange font-black text-xs">{neededForFreeShipping} item lagi</strong> untuk nikmati GRATIS ONGKIR khusus area <strong>Jakarta Selatan</strong>!</p>
                  </div>
                </div>
              )}

              {/* Quick Pricing details */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-500">Subtotal Gelang:</span>
                  <span className="font-bold text-brand-dark">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-500">Estimasi Pajak/Admin:</span>
                  <span className="font-bold text-brand-dark">Rp 0 (GRATIS)</span>
                </div>
                <div className="h-[1.5px] bg-stone-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-display font-black text-sm text-brand-dark">TOTAL BELANJA:</span>
                  <span className="font-mono font-black text-lg text-brand-dark bg-brand-yellow/80 border-1.5 border-brand-dark rounded px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000000]">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Prompt for checkout */}
              <button
                onClick={onOpenCheckout}
                className="w-full brutalist-button font-display py-3 text-base tracking-widest flex items-center justify-center gap-2 rounded-2xl animate-pulse"
              >
                <span>ISI DATA & SELESAIKAN ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
