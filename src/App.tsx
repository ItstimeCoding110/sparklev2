import { useState, useEffect, useMemo } from 'react';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { AboutTab } from './components/AboutTab';
import { AdminTab } from './components/AdminTab';
import { PRODUCTS } from './data';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { Footer } from './components/Footer';
import { Gift, Zap, Sparkles, Flame, Heart, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    try {
      const res = await fetch('/api/supabase-status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err) {
      console.error('Error loading Supabase status:', err);
    }
  };

  // Sync products and categories on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prods = await prodRes.json();
          setProducts(prods);
          localStorage.setItem('manikkita_products', JSON.stringify(prods));
        }
      } catch (err) {
        console.error('Error fetching products from backend:', err);
      }

      try {
        const catRes = await fetch('/api/categories');
        if (catRes.ok) {
          const cats = await catRes.json();
          setCategories(cats);
          localStorage.setItem('manikkita_categories', JSON.stringify(cats));
        }
      } catch (err) {
        console.error('Error fetching categories from backend:', err);
      }

      fetchSupabaseStatus();
    };

    loadInitialData();
  }, []);

  const handleUpdateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('manikkita_products', JSON.stringify(newProducts));
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducts),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.warning) {
          setToastMessage(`Peringatan: ${data.warning}`);
        } else {
          setToastMessage('Produk berhasil disinkronisasi ke server!');
        }
      }
    } catch (err) {
      console.error('Sync products failed:', err);
      setToastMessage('Gagal sinkronisasi data ke backend server.');
    }
    fetchSupabaseStatus();
  };

  const handleUpdateCategories = async (newCategories: string[]) => {
    setCategories(newCategories);
    localStorage.setItem('manikkita_categories', JSON.stringify(newCategories));
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategories),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.warning) {
          setToastMessage(`Peringatan: ${data.warning}`);
        } else {
          setToastMessage('Kategori berhasil disinkronisasi ke server!');
        }
      }
    } catch (err) {
      console.error('Sync categories failed:', err);
      setToastMessage('Gagal sinkronisasi kategori ke server.');
    }
    fetchSupabaseStatus();
  };

  // Sync products to localStorage (secondary hook)
  useEffect(() => {
    localStorage.setItem('manikkita_products', JSON.stringify(products));
  }, [products]);

  // Sync categories to localStorage (secondary hook)
  useEffect(() => {
    localStorage.setItem('manikkita_categories', JSON.stringify(categories));
  }, [categories]);

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
    localStorage.setItem('manikkita_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
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
              <div className="bg-brand-pink border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#121212] flex items-center gap-3.5">
                <Flame className="w-8 h-8 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">LIMITED Stock Terbatas</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1">Eksklusif & dibuat terbatas agar style kamu tak pasaran!</p>
                </div>
              </div>
              <div className="bg-brand-blue border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#121212] flex items-center gap-3.5">
                <Heart className="w-8 h-8 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">HANDMADE With Care</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1">100% rajutan tangan artisan lokal presisi & rapi!</p>
                </div>
              </div>
              <div className="bg-brand-mint border-3 border-brand-dark p-4 rounded-2xl shadow-[3px_3.5px_0px_#121212] flex items-center gap-3.5">
                <Box className="w-8 h-8 text-brand-dark shrink-0" />
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-brand-dark leading-none">FREE Shipping Jaksel</h4>
                  <p className="text-[10px] font-mono text-stone-700 leading-tight mt-1">Belanja minimal 3 item gratis ongkir khusus area Jakarta Selatan!</p>
                </div>
              </div>
            </div>

            {/* Catalog list section */}
            <ProductList
              products={products}
              categoriesList={categories}
              onAddToCart={handleAddToCart}
            />
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
            className="fixed bottom-6 right-6 z-50 bg-brand-yellow text-brand-dark border-3 border-brand-dark px-5 py-3.5 rounded-2xl font-display font-black text-xs md:text-sm shadow-[4px_4.5px_0px_#121212] flex items-center gap-3"
            id="toast-notification"
          >
            <Sparkles className="w-5 h-5 text-brand-dark shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
