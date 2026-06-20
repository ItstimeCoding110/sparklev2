import React, { useState } from 'react';
import { Product } from '../types';
import { BraceletVisualizer } from './BraceletVisualizer';
import { X, ShoppingCart, Sparkles, AlertCircle, Heart, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-[#faf8f6] border-4 border-brand-dark rounded-3xl w-full max-w-lg md:max-w-2xl overflow-y-auto max-h-[85vh] sm:max-h-[90vh] md:max-h-none shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] z-10 flex flex-col md:flex-row"
        id="product-detail-modal"
      >
        {/* Close Button top-right (absolute style) */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 bg-brand-pink p-1.5 sm:p-2 border-2 border-brand-dark rounded-xl text-brand-dark hover:bg-brand-pink/80 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] active:translate-y-0.5 active:shadow-none"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left column: Visual Representation of Selected Product */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-center items-center border-b-4 md:border-b-0 md:border-r-4 border-brand-dark bg-stone-50 relative min-h-[140px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-[300px]">
          {/* Badge overlays inside visual box */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1 items-start">
            {product.isBestSeller && (
              <span className="bg-brand-yellow text-brand-dark font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 sm:border-2 border-brand-dark px-1.5 sm:px-2 py-0.5 rounded shadow-[1px_1px_0px_#000000]">
                BEST SELLER
              </span>
            )}
            {product.isNew && (
              <span className="bg-brand-pink text-brand-dark font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 sm:border-2 border-brand-dark px-1.5 sm:px-2 py-0.5 rounded shadow-[1px_1px_0px_#000000]">
                BARU rilis
              </span>
            )}
          </div>

          <div className="w-full max-w-[160px] xs:max-w-[200px] sm:max-w-[280px] p-1 mt-6 md:mt-4 flex items-center justify-center aspect-square overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[240px] sm:max-h-[260px] rounded-xl cursor-zoom-in hover:scale-105 transition-transform duration-150"
                onClick={() => setIsImageZoomed(true)}
                title="Klik untuk perbesar foto"
              />
            ) : (
              <BraceletVisualizer
                colors={product.colors}
                wording=""
                size="lg"
                isRotating={false}
              />
            )}
          </div>

          <span className="text-[8px] sm:text-[10px] font-mono text-stone-500 font-semibold mt-3 sm:mt-4 tracking-wider">
            PREVIEWS 3D STATIC SHAPE
          </span>
          {product.image && (
            <span className="text-[8px] sm:text-[9px] font-mono text-brand-pink font-bold mt-1 uppercase tracking-wide animate-pulse">
              (Klik foto untuk perbesar)
            </span>
          )}
        </div>

        {/* Right column: Content Info & Interactive Actions */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Header Product Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {product.isSoldOut ? (
                  <span className="inline-block bg-red-600 text-white px-2.5 py-0.5 border border-brand-dark rounded-full font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    <span>SOLD OUT (HABIS)</span>
                  </span>
                ) : (
                  <>
                    <span className="inline-block bg-brand-purple text-brand-dark px-2 py-0.5 border border-brand-dark rounded-full font-mono text-[9px] sm:text-[10px] font-bold uppercase">
                      {product.category} COLLECTION
                    </span>
                    <span className="inline-block bg-brand-yellow text-brand-dark px-2 py-0.5 border border-brand-dark rounded-full font-mono text-[9px] sm:text-[10px] font-bold uppercase">
                      STOK: {product.stock !== undefined ? product.stock : 10}
                    </span>
                  </>
                )}
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl md:text-2xl text-brand-dark leading-tight tracking-tight pt-0.5">
                {product.name}{' '}
                <span className="inline-block font-mono text-xs sm:text-sm font-black text-brand-pink italic">
                  ({product.code.toLowerCase()})
                </span>
              </h2>
            </div>

            {/* Price section with old price cross-out */}
            <div className="bg-brand-yellow/30 border-2 border-brand-dark p-2.5 sm:p-3.5 rounded-2xl flex items-center justify-between select-none shadow-[2px_2px_0px_#000000]">
              <span className="font-display font-black text-[10px] sm:text-[11px] text-stone-600 uppercase">Harga:</span>
              <div className="text-right">
                {product.originalPrice && (
                  <span className="text-[9px] sm:text-xs font-mono line-through text-stone-400 mr-2">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
                <span className="font-mono font-black text-sm sm:text-base md:text-lg text-brand-dark">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Long Rich Narrative Description */}
            <div className="space-y-1">
              <span className="text-[8px] sm:text-[10px] font-mono font-bold text-stone-400 block uppercase tracking-wider">
                DESKRIPSI PRODUK:
              </span>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* List / Ingredients Beads tags */}
            <div className="space-y-1">
              <span className="text-[8px] sm:text-[10px] font-mono font-bold text-stone-400 block uppercase tracking-wider">
                BAHAN DAN RESEP MANIK (100% HANDMADE):
              </span>
              <div className="flex flex-wrap gap-1">
                {product.beadsUsed.map((bead, index) => (
                  <span
                    key={index}
                    className="bg-brand-mint text-brand-dark border border-brand-dark font-sans font-bold px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] shadow-[1px_1px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <span>{bead}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Delivery Alert tag */}
            <div className="bg-brand-peach/25 border border-dashed border-brand-orange p-2 sm:p-2.5 rounded-xl text-[8px] sm:text-[9px] font-mono text-stone-700">
              <span>
                Setiap aksesoris dirakit handmade presisi tinggi. Pengiriman aman seluruh Indonesia!
              </span>
            </div>
          </div>

          {/* Action Footer Button rows */}
          <div className="pt-3 sm:pt-4 border-t border-dashed border-stone-200 flex gap-2 w-full">
            {product.isSoldOut ? (
              <button
                disabled
                className="w-full rounded-2xl py-2 px-3 sm:py-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-display font-black text-xs sm:text-sm bg-stone-100 text-stone-400 border-2 border-stone-300 cursor-not-allowed select-none"
              >
                <XCircle className="w-4 h-4 text-stone-400 shrink-0" />
                <span>MAAF, STOK HABIS (SOLD OUT)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="brutalist-button-blue w-full rounded-2xl py-2 px-3 sm:py-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-display font-black text-xs sm:text-sm shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-dark shrink-0" />
                <span>BELI SEKARANG</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox Overlay for Image Zoom Detail */}
      {isImageZoomed && product.image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 bg-brand-pink text-brand-dark p-2 px-3 border-2 border-brand-dark rounded-xl font-display font-black text-xs shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            TUTUP [X]
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl border-4 border-brand-dark bg-white shadow-[8px_8px_0px_#000000]"
          />
        </div>
      )}
    </div>
  );
};
