import { useState, useEffect, useMemo } from 'react';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { AboutTab } from './components/AboutTab';
import { AdminTab } from './components/AdminTab';
import { PRODUCTS, SHOP_INFO } from './data';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { Footer } from './components/Footer';
import { Gift, Zap, Sparkles, Flame, Heart, Box, MapPin, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, mapDbToProduct, mapProductToDb, SQL_INIT_SCRIPT } from './supabaseClient';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('shop');
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('manikkita_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [isLoadingData, setIsLoadingData] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('manikkita_products');
    } catch {
      return true;
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('manikkita_categories');
      return saved ? JSON.parse(saved) : ['Gelang', 'Cincin'];
    } catch {
      return ['Gelang', 'Cincin'];
    }
  });

  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);

  const fetchSupabaseStatus = async () => {
    const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
    const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasUrl || !hasKey) {
      setSupabaseStatus({
        configured: false,
        connected: false,
        errorMsg: 'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum terkonfigurasi di file .env',
        sqlScript: SQL_INIT_SCRIPT
      });
      return;
    }

    try {
      // Test simple select connection check
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        setSupabaseStatus({
          configured: true,
          connected: false,
          errorMsg: `Gagal terhubung ke database: ${error.message}`,
          sqlScript: SQL_INIT_SCRIPT
        });
      } else {
        setSupabaseStatus({
          configured: true,
          connected: true,
          errorMsg: '',
          sqlScript: SQL_INIT_SCRIPT
        });
      }
    } catch (err: any) {
      setSupabaseStatus({
        configured: true,
        connected: false,
        errorMsg: `Kesalahan jaringan: ${err.message || err}`,
        sqlScript: SQL_INIT_SCRIPT
      });
    }
  };

  // Sync products and categories on mount & listen to real-time changes
  useEffect(() => {
    let productsChannel: any = null;
    let categoriesChannel: any = null;

    const loadInitialData = async () => {
      // Try to load products from Supabase
      try {
        const { data: dbProds, error: prodErr } = await supabase.from('products').select('*');
        if (!prodErr && dbProds) {
          const mapped = dbProds.map(mapDbToProduct);
          setProducts(mapped);
          try {
            localStorage.setItem('manikkita_products', JSON.stringify(mapped));
          } catch (e) {
            console.warn('Failed to save products to localStorage:', e);
          }
        } else if (prodErr) {
          console.error('Error fetching products from Supabase:', prodErr.message);
        }
      } catch (err) {
        console.error('Error connecting to Supabase for products:', err);
      }

      // Try to load categories from Supabase
      try {
        const { data: dbCats, error: catErr } = await supabase.from('categories').select('name');
        if (!catErr && dbCats) {
          const catsList = dbCats.map((c: any) => c.name);
          setCategories(catsList);
          try {
            localStorage.setItem('manikkita_categories', JSON.stringify(catsList));
          } catch (e) {
            console.warn('Failed to save categories to localStorage:', e);
          }
        } else if (catErr) {
          console.error('Error fetching categories from Supabase:', catErr.message);
        }
      } catch (err) {
        console.error('Error connecting to Supabase for categories:', err);
      }

      fetchSupabaseStatus();
      setIsLoadingData(false);

      // Subscribe to real-time changes in products table (only after initial select finishes)
      productsChannel = supabase
        .channel('realtime-products')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('Realtime product change detected:', payload);
            
            // Defensive check: if payload.new is empty or lacks critical fields, ignore it
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const row = payload.new;
              if (!row || !row.id || !row.name) {
                console.warn('Realtime payload new is missing or incomplete, skipping state update.', payload);
                return;
              }
            } else if (payload.eventType === 'DELETE') {
              const row = payload.old;
              if (!row || !row.id) {
                console.warn('Realtime payload old is missing or incomplete, skipping state delete.', payload);
                return;
              }
            }

            setProducts((prevProducts) => {
              let updatedProducts = [...prevProducts];
              if (payload.eventType === 'INSERT') {
                const newProd = mapDbToProduct(payload.new);
                if (!updatedProducts.some(p => p.id === newProd.id)) {
                  updatedProducts = [newProd, ...updatedProducts];
                }
              } else if (payload.eventType === 'UPDATE') {
                const updatedProd = mapDbToProduct(payload.new);
                updatedProducts = updatedProducts.map(p => p.id === updatedProd.id ? updatedProd : p);
              } else if (payload.eventType === 'DELETE') {
                const deletedId = payload.old.id;
                updatedProducts = updatedProducts.filter(p => p.id !== deletedId);
              }
              try {
                localStorage.setItem('manikkita_products', JSON.stringify(updatedProducts));
              } catch (e) {
                console.warn('Failed to save products to localStorage:', e);
              }
              return updatedProducts;
            });
          }
        )
        .subscribe();

      // Subscribe to real-time changes in categories table
      categoriesChannel = supabase
        .channel('realtime-categories')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          (payload) => {
            console.log('Realtime category change detected:', payload);
            
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const row = payload.new;
              if (!row || !row.name) {
                console.warn('Realtime category payload new is missing or incomplete, skipping.', payload);
                return;
              }
            } else if (payload.eventType === 'DELETE') {
              const row = payload.old;
              if (!row || !row.name) {
                console.warn('Realtime category payload old is missing or incomplete, skipping.', payload);
                return;
              }
            }

            setCategories((prevCategories) => {
              let updatedCategories = [...prevCategories];
              if (payload.eventType === 'INSERT') {
                const newCat = payload.new.name;
                if (!updatedCategories.includes(newCat)) {
                  updatedCategories.push(newCat);
                }
              } else if (payload.eventType === 'UPDATE') {
                const oldCat = payload.old.name;
                const newCat = payload.new.name;
                updatedCategories = updatedCategories.map(c => c === oldCat ? newCat : c);
              } else if (payload.eventType === 'DELETE') {
                const deletedCat = payload.old.name;
                updatedCategories = updatedCategories.filter(c => c !== deletedCat);
              }
              try {
                localStorage.setItem('manikkita_categories', JSON.stringify(updatedCategories));
              } catch (e) {
                console.warn('Failed to save categories to localStorage:', e);
              }
              return updatedCategories;
            });
          }
        )
        .subscribe();
    };

    loadInitialData();

    return () => {
      if (productsChannel) supabase.removeChannel(productsChannel);
      if (categoriesChannel) supabase.removeChannel(categoriesChannel);
    };
  }, []);

  const handleUpdateProducts = async (newProducts: Product[]) => {
    // Keep reference to previous state to compare
    const previousProducts = products;

    setProducts(newProducts);
    try {
      localStorage.setItem('manikkita_products', JSON.stringify(newProducts));
    } catch (e) {
      console.warn('Failed to save products to localStorage:', e);
    }
    
    try {
      // 1. Dapatkan produk yang dihapus (ada di previous, tapi tidak ada di newProducts)
      const deleted = previousProducts.filter(old => !newProducts.some(p => p.id === old.id));
      if (deleted.length > 0) {
        const { error: delErr } = await supabase
          .from('products')
          .delete()
          .in('id', deleted.map(p => p.id));
        if (delErr) throw delErr;
      }

      // 2. Dapatkan produk yang ditambahkan (ada di newProducts, tapi tidak ada di previous)
      const added = newProducts.filter(p => !previousProducts.some(old => old.id === p.id));
      if (added.length > 0) {
        const rowsToInsert = added.map(mapProductToDb);
        const { error: insErr } = await supabase
          .from('products')
          .insert(rowsToInsert);
        if (insErr) throw insErr;
      }

      // 3. Dapatkan produk yang dimodifikasi (ada di kedua daftar, tapi nilainya berubah)
      const updated = newProducts.filter(p => {
        const old = previousProducts.find(o => o.id === p.id);
        if (!old) return false;
        return (
          old.name !== p.name ||
          old.code !== p.code ||
          old.category !== p.category ||
          old.description !== p.description ||
          old.price !== p.price ||
          old.originalPrice !== p.originalPrice ||
          old.image !== p.image ||
          old.isNew !== p.isNew ||
          old.isBestSeller !== p.isBestSeller ||
          old.isSoldOut !== p.isSoldOut ||
          old.stock !== p.stock ||
          JSON.stringify(old.colors) !== JSON.stringify(p.colors) ||
          JSON.stringify(old.beadsUsed) !== JSON.stringify(p.beadsUsed)
        );
      });
      if (updated.length > 0) {
        const rowsToUpsert = updated.map(mapProductToDb);
        const { error: upsertErr } = await supabase
          .from('products')
          .upsert(rowsToUpsert, { onConflict: 'id' });
        if (upsertErr) throw upsertErr;
      }

      setToastMessage('Produk berhasil disinkronisasi ke database Supabase!');
    } catch (err: any) {
      console.error('Sync products failed:', err);
      setToastMessage(`Gagal sinkronisasi ke Supabase: ${err.message || err}`);
      throw err;
    }
    fetchSupabaseStatus();
  };

  const handleUpdateCategories = async (newCategories: string[]) => {
    const previousCategories = categories;

    setCategories(newCategories);
    try {
      localStorage.setItem('manikkita_categories', JSON.stringify(newCategories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage:', e);
    }
    
    try {
      // 1. Dapatkan kategori yang dihapus
      const deleted = previousCategories.filter(old => !newCategories.includes(old));
      if (deleted.length > 0) {
        const { error: delErr } = await supabase
          .from('categories')
          .delete()
          .in('name', deleted);
        if (delErr) throw delErr;
      }

      // 2. Dapatkan kategori yang ditambahkan
      const added = newCategories.filter(cat => !previousCategories.includes(cat));
      if (added.length > 0) {
        const rowsToInsert = added.map(name => ({ name }));
        const { error: insErr } = await supabase
          .from('categories')
          .insert(rowsToInsert);
        if (insErr) throw insErr;
      }

      setToastMessage('Kategori berhasil disinkronisasi ke database Supabase!');
    } catch (err: any) {
      console.error('Sync categories failed:', err);
      setToastMessage(`Gagal sinkronisasi kategori ke Supabase: ${err.message || err}`);
      throw err;
    }
    fetchSupabaseStatus();
  };


  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('manikkita_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTermsPrivacyOpen, setIsTermsPrivacyOpen] = useState(false);
  const [termsPrivacyInitialTab, setTermsPrivacyInitialTab] = useState<'terms' | 'privacy'>('terms');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast nicely
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync cart items to localStorage so state persists beautifully
  useEffect(() => {
    try {
      localStorage.setItem('manikkita_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const cartItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    const limit = product.stock !== undefined ? product.stock : 10;
    const existing = cartItems.find((item) => item.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty >= limit) {
      setToastMessage(`Gagal: Stok terbatas! Maksimal pembelian untuk "${product.name}" adalah ${limit} pcs.`);
      return;
    }

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [...prev, { id: product.id, product, quantity: 1 }];
    });
    // Visual cute non-blocking feedback Toast
    setToastMessage(`Sukses memasukkan "${product.name}" ke keranjang belanja!`);
  };

  const handleUpdateQuantity = (id: string, nextQty: number) => {
    if (nextQty <= 0) {
      handleRemoveItem(id);
      return;
    }

    const existing = cartItems.find((item) => item.id === id);
    if (existing) {
      const limit = existing.product.stock !== undefined ? existing.product.stock : 10;
      if (nextQty > limit) {
        setToastMessage(`Gagal: Stok terbatas! Maksimal pembelian untuk "${existing.product.name}" adalah ${limit} pcs.`);
        return;
      }
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: nextQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Tab navigation & scrolling helpers
  const handleNavigateToCatalog = () => {
    setActiveTab('shop');
    setTimeout(() => {
      const el = document.getElementById('katalog-produk-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateToAbout = () => {
    setActiveTab('about');
    setTimeout(() => {
      const el = document.getElementById('about-tentang-kami-page');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateToPaymentMethods = () => {
    setActiveTab('shop');
    setTimeout(() => {
      const el = document.getElementById('payment-methods-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] font-sans text-brand-dark overflow-x-hidden p-0 m-0">
      {/* 1. Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        
        {/* Render Tab Contents inside modular blocks */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            {/* Playful Soft Brutalist Hero Banner */}
            <Hero
              onExploreCatalog={handleNavigateToCatalog}
              onNavigateToAbout={handleNavigateToAbout}
            />

            {/* Live Interactive Bento Ribbons / Small Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-display select-none">
              <div className="bg-brand-pink border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#000000] flex flex-col justify-center min-h-[90px]">
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">LIMITED Stock Terbatas</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1.5">Eksklusif & dibuat terbatas agar style kamu tak pasaran!</p>
                </div>
              </div>
              <div className="bg-brand-blue border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#000000] flex flex-col justify-center min-h-[90px]">
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">HANDMADE With Care</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1.5">100% rajutan tangan artisan lokal presisi & rapi!</p>
                </div>
              </div>
              <div className="bg-brand-mint border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#000000] flex flex-col justify-center min-h-[90px]">
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">FREE Shipping Jaksel</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1.5">Belanja minimal 3 item gratis ongkir khusus area Jakarta Selatan!</p>
                </div>
              </div>
            </div>

            {/* Catalog list section */}
            <ProductList
              products={products}
              categoriesList={categories}
              onAddToCart={handleAddToCart}
              isLoading={isLoadingData}
            />

            {/* Alamat/Kurir Section */}
            <div className="pt-8 border-t-4 border-brand-dark/10 flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-5xl mx-auto w-full">
              {/* Payment Methods Card */}
              <div id="payment-methods-card" className="flex-1 w-full bg-white text-brand-dark border-3 border-brand-dark p-6 rounded-2xl shadow-[4px_4px_0px_#b58dfb] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-block bg-brand-purple text-brand-dark px-3 py-1 font-display font-bold text-xs border-2 border-brand-dark rounded-md tracking-wider flex items-center gap-1.5 w-fit">
                    <span>METODE PEMBAYARAN</span>
                    <CreditCard className="w-3.5 h-3.5 text-brand-dark shrink-0" />
                  </div>
                  
                  <div className="text-xs sm:text-sm font-mono leading-relaxed text-stone-800">
                    Kami mendukung berbagai pilihan pembayaran untuk kemudahan transaksi Anda:
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="bg-brand-pink/20 border-1.5 border-brand-dark text-brand-dark px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold shadow-[1px_1.5px_0px_#000000]">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-brand-yellow/20 border-1.5 border-brand-dark text-brand-dark px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold shadow-[1px_1.5px_0px_#000000]">
                      Transfer Bank (Seabank, BCA, Mandiri)
                    </span>
                    <span className="bg-brand-mint/20 border-1.5 border-brand-dark text-brand-dark px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold shadow-[1px_1.5px_0px_#000000]">
                      QRIS All Payment
                    </span>
                    <span className="bg-brand-blue/20 border-1.5 border-brand-dark text-brand-dark px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold shadow-[1px_1.5px_0px_#000000]">
                      E-Wallet (GoPay, ShopeePay, Dana, OVO)
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping & Location Card */}
              <div className="flex-1 w-full bg-white text-brand-dark border-3 border-brand-dark p-6 rounded-2xl shadow-[4px_4px_0px_#ffdf6d] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-block bg-brand-yellow text-brand-dark px-3 py-1 font-display font-bold text-xs border-2 border-brand-dark rounded-md tracking-wider flex items-center gap-1.5 w-fit">
                    <span>ALAMAT TOKO & KURIR</span>
                    <MapPin className="w-3.5 h-3.5 text-brand-dark shrink-0" />
                  </div>
                  
                  <div className="text-xs sm:text-sm font-mono leading-relaxed text-stone-800">
                    {SHOP_INFO.address}
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 block mb-1.5">
                      Ekspedisi Tersedia:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SHOP_INFO.shippingOptions.map((opt, i) => {
                        const cleanName = opt.includes(' - ') ? opt.split(' - ')[0] : opt.split(' (')[0];
                        return (
                          <span
                            key={i}
                            className="bg-brand-mint/20 border-1.5 border-brand-dark text-brand-dark px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-[1px_1.5px_0px_#000000]"
                          >
                            {cleanName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-stone-500 mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5">
                  <span>Buka Setiap Hari | Jam 08.30 - 23.00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <AboutTab />
        )}

        {activeTab === 'admin' && (
          <AdminTab
            products={products}
            onUpdateProducts={handleUpdateProducts}
            categories={categories}
            onUpdateCategories={handleUpdateCategories}
            supabaseStatus={supabaseStatus}
            onRefreshStatus={fetchSupabaseStatus}
          />
        )}

      </main>

      {/* 2. Brand Footer block */}
      <Footer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTerms={() => {
          setTermsPrivacyInitialTab('terms');
          setIsTermsPrivacyOpen(true);
        }}
        onOpenPrivacy={() => {
          setTermsPrivacyInitialTab('privacy');
          setIsTermsPrivacyOpen(true);
        }}
        onNavigateToCatalog={handleNavigateToCatalog}
        onNavigateToAbout={handleNavigateToAbout}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToPaymentMethods={handleNavigateToPaymentMethods}
      />

      {/* 3. Sliding Cart Drawer overlay inside React context */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        totalPrice={totalCartPrice}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 4. WhatsApp checkout modal collecting delivery details */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalPrice={totalCartPrice}
        onClearCart={handleClearCart}
      />

      {/* 4.5. Terms & Privacy Policy Modal with switchable tabs */}
      <AnimatePresence>
        {isTermsPrivacyOpen && (
          <TermsPrivacyModal
            isOpen={isTermsPrivacyOpen}
            onClose={() => setIsTermsPrivacyOpen(false)}
            initialTab={termsPrivacyInitialTab}
          />
        )}
      </AnimatePresence>

      {/* 5. Custom Animated Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-brand-yellow text-brand-dark border-3 border-brand-dark px-5 py-3.5 rounded-2xl font-display font-black text-xs md:text-sm shadow-[4px_4.5px_0px_#000000] flex items-center gap-3 max-w-sm sm:max-w-md"
            id="toast-notification"
          >
            <Sparkles className="w-5 h-5 text-brand-dark shrink-0" />
            <div className="flex flex-col gap-1.5 w-full">
              <span>{toastMessage}</span>
              {toastMessage.includes("Sukses memasukkan") && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setToastMessage(null);
                  }}
                  className="bg-brand-blue hover:bg-brand-mint text-brand-dark text-[10px] font-mono font-black uppercase px-2.5 py-1.5 border border-brand-dark rounded-xl transition-colors cursor-pointer shadow-[1.5px_1.5px_0px_#000000] active:translate-y-px active:shadow-none w-fit"
                >
                  Buka Keranjang
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
