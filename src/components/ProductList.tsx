import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { BraceletVisualizer } from './BraceletVisualizer';
import { ShoppingCart, Search, Compass, Heart, Sparkles, Flame, Zap, Hourglass, XCircle, AlertCircle } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { AnimatePresence } from 'motion/react';

interface ProductListProps {
  products: Product[];
  categoriesList: string[];
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
  supabaseStatus?: any;
}

export const ProductList: React.FC<ProductListProps> = ({ products, categoriesList, onAddToCart, isLoading, supabaseStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Filter categories dynamically passed from App.tsx
  const categories = useMemo(() => ['Semua', ...(categoriesList || ['Gelang', 'Cincin'])], [categoriesList]);

  // Compute filtered products list and place sold out at the bottom
  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.beadsUsed || []).some((bead) => bead.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;

      return matchSearch && matchCategory;
    });

    // Sort: Ready items (isSoldOut === false or undefined) go first, Sold out goes last
    return [...list].sort((a, b) => {
      const aSold = a.isSoldOut ? 1 : 0;
      const bSold = b.isSoldOut ? 1 : 0;
      return aSold - bSold;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 select-none" id="katalog-produk-section">
      {/* Search & Category Filter Widget */}
      <div className="bg-white border-3 border-brand-dark p-4 sm:p-6 rounded-3xl shadow-[5px_5.5px_0px_#000000] space-y-4">
        {/* Row A: Title & tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-brand-dark font-black tracking-tight uppercase flex items-center">
              <span>PILIH PILIHAN KATALOG</span>
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-500 font-sans mt-0.5">
              Cincin dan gelang manik-manik estetik netral gender yang didesain agar OOTD kamu makin menyala.
            </p>
          </div>
          
          {/* Live search input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aksesoris, warna, manik..."
              className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-dark font-mono focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
        </div>

        {/* Row B: Filter tags bento row */}
        <div className="flex flex-wrap gap-2 pt-1 border-t-2 border-dashed border-stone-100 pr-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 font-display text-xs font-black rounded-xl border-2 transition-all cursor-pointer flex items-center ${
                selectedCategory === cat
                  ? 'bg-brand-purple text-brand-dark border-brand-dark shadow-[2.5px_2.5px_0px_#000000] -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-brand-dark hover:text-brand-dark hover:bg-stone-50'
              }`}
            >
              <span>
                {cat === 'Semua' ? 'Semua Aksesoris' : cat === 'Gelang' ? 'Gelang Manik' : cat === 'Cincin' ? 'Cincin Manik' : cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      {supabaseStatus && !supabaseStatus.connected && (
        <div className="bg-brand-pink border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3px_0px_#000000] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-brand-dark shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display text-sm font-black text-brand-dark uppercase">Koneksi Database Supabase Bermasalah</h4>
            <p className="text-xs font-mono text-stone-800 mt-1">
              Pesan Kesalahan: {supabaseStatus.errorMsg || 'Gagal terhubung ke database. Katalog beralih ke mode offline menggunakan data cadangan.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid List Products */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white border-3 border-brand-dark rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-5 flex flex-col justify-between shadow-[3px_3px_0px_#000000] space-y-3 sm:space-y-4 min-h-[300px]"
            >
              {/* Card visual skeleton */}
              <div className="w-full aspect-square shimmer-bg border-2 border-brand-dark rounded-xl sm:rounded-2xl flex items-center justify-center p-3 text-center">
                <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-550 uppercase tracking-widest leading-relaxed">
                  sedang memuat data<br/>harap ditunggu
                </span>
              </div>
              
              {/* Product Info skeleton */}
              <div className="space-y-2 mt-2">
                {/* Category tag */}
                <div className="h-3 shimmer-bg rounded w-1/4"></div>
                {/* Name */}
                <div className="h-5 shimmer-bg border-2 border-brand-dark rounded-md w-3/4"></div>
                {/* Description */}
                <div className="h-3 shimmer-bg rounded w-5/6"></div>
              </div>
              
              {/* Price & Buy Button skeleton */}
              <div className="space-y-2 mt-4">
                <div className="h-4 shimmer-bg rounded w-1/3"></div>
                <div className="h-9 sm:h-11 shimmer-bg border-2 border-brand-dark rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white border-3 border-dashed border-brand-dark rounded-3xl p-6">
          <h3 className="font-display text-lg sm:text-xl text-brand-dark font-black">Waduh, Gak Ketemu Bestie!</h3>
          <p className="text-xs text-stone-500 font-mono mt-1 max-w-[280px] mx-auto">
            Keyword &ldquo;{searchQuery}&rdquo; belum ada di katalog kami. Coba cari kata kunci lain ya!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                onClick={() => setSelectedDetailProduct(product)}
                className="group relative bg-white border-3 border-brand-dark rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-5 flex flex-col justify-between shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000000] transition-all duration-300 cursor-pointer"
              >
                {/* Visual badges in top corner */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 items-start">
                  {product.isSoldOut ? (
                    <span className="bg-red-600 text-white font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 border-brand-dark px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000000] tracking-wider font-bold">
                      <span>SOLD OUT</span>
                    </span>
                  ) : (
                    <>
                      {product.isBestSeller && (
                        <span className="bg-brand-yellow text-brand-dark font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 border-brand-dark px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000000] tracking-wider animate-pulse font-bold">
                          <span>BEST SELLER</span>
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-brand-pink text-brand-dark font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 border-brand-dark px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000000] tracking-wider font-bold">
                          <span>NEW ITEM</span>
                        </span>
                      )}
                      <span className="bg-brand-orange text-brand-dark font-mono text-[8px] sm:text-[9px] font-black uppercase border-1.5 border-brand-dark px-1.5 py-0.5 rounded shadow-[1px_1px_0px_#000000] tracking-wider font-bold">
                        <span>STOK TERBATAS</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Bracelet Animated Visual Container */}
                <div className={`w-full aspect-square flex items-center justify-center p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-4 border-2 border-brand-dark bg-stone-50 transition-all duration-300 overflow-hidden relative ${product.isSoldOut ? 'bg-stone-200/60' : 'group-hover:bg-brand-peach/10'}`}>
                  <div className={`w-full h-full flex items-center justify-center ${product.isSoldOut ? 'grayscale contrast-75 opacity-50' : ''}`}>
                    {product.image ? (
                      <div className="w-full h-full max-h-[140px] rounded-lg overflow-hidden relative isolation-isolate">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <BraceletVisualizer
                        colors={product.colors}
                        wording=""
                        size="md"
                        isRotating={false}
                      />
                    )}
                  </div>
                  {product.isSoldOut && (
                    <div className="absolute inset-0 bg-brand-dark/20 flex items-center justify-center">
                      <span className="bg-red-600 text-white font-display font-black text-[10px] sm:text-xs tracking-wider uppercase px-2.5 py-1.5 border-2 border-brand-dark rounded-xl shadow-[2px_2px_0px_#000000] -rotate-12">
                        <span>OUT OF STOCK</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Meta */}
                <div className="space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between select-none">
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* Category Label */}
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] sm:text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
                        Kategori: {product.category}
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-brand-dark font-mono font-bold bg-brand-yellow/30 px-1.5 py-0.5 border border-brand-dark/20 rounded">
                        Stok: {product.stock !== undefined ? product.stock : 10}
                      </span>
                    </div>

                    <h3 className="font-display text-xs sm:text-base md:text-lg text-brand-dark font-black tracking-tight leading-tight group-hover:text-brand-pink transition-colors line-clamp-1 sm:line-clamp-2">
                      {product.name}{' '}
                      <span className="font-mono text-[9px] sm:text-xs font-bold text-stone-500">
                        ({(product.code || '').toLowerCase()})
                      </span>
                    </h3>
                    
                    <p className="text-[10px] sm:text-xs text-stone-600 line-clamp-2 sm:line-clamp-3 font-sans leading-tight sm:leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Beads Ingredients tags (Hidden on mobile to save vertical space) */}
                  <div className="hidden sm:block pt-1">
                    <span className="text-[9px] font-mono font-bold text-stone-400 block mb-0.5 uppercase tracking-wider">
                      Resep Manik Utama:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(product.beadsUsed || []).map((bead, i) => (
                        <span
                          key={i}
                          className="bg-stone-50 border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded-md text-[9px] font-mono"
                        >
                          {bead}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="pt-1.5 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-2 sm:items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      {product.originalPrice && (
                        <span className="text-[9px] sm:text-xs font-mono line-through text-stone-400 leading-none">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                      <span className="font-mono font-black text-xs sm:text-sm md:text-base text-brand-dark">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Action trigger button */}
                    {product.isSoldOut ? (
                      <button
                        type="button"
                        disabled
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="bg-stone-100 text-stone-400 border-2 border-stone-200 text-[10px] sm:text-xs rounded-xl py-1 sm:py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 font-display font-medium w-full sm:w-auto cursor-not-allowed select-none"
                      >
                        <XCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Habis</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="brutalist-button-blue text-[10px] sm:text-xs rounded-xl py-1 sm:py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1.5 font-display font-black w-full sm:w-auto shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2.5px_2.5px_0px_#000000] transition-all cursor-pointer active:translate-y-0 active:shadow-none"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-brand-dark shrink-0" />
                        <span>Beli</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal Showcase */}
      <AnimatePresence>
        {selectedDetailProduct && (
          <ProductDetailModal
            product={selectedDetailProduct}
            isOpen={selectedDetailProduct !== null}
            onClose={() => setSelectedDetailProduct(null)}
            onAddToCart={onAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
