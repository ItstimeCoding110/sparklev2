import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Trash2, Edit2, LogIn, LogOut, CheckCircle, AlertTriangle, ShieldCheck, FileText, Upload, Sparkles, X, Database, RefreshCw, Copy, Check, Heart, Star, Zap, Clock, Folder } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AdminTabProps {
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  categories: string[];
  onUpdateCategories: (newCategories: string[]) => void;
  supabaseStatus?: {
    configured: boolean;
    connected: boolean;
    errorMsg: string;
    url: string;
    sqlScript: string;
  } | null;
  onRefreshStatus?: () => void;
}

interface LoginLog {
  timestamp: string;
  username: string;
  status: 'SUKSES' | 'GAGAL';
  device: string;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  products,
  onUpdateProducts,
  categories,
  onUpdateCategories,
  supabaseStatus = null,
  onRefreshStatus,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('manikkita_admin_logged') === 'true';
  });
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    if (isTesting) return;
    setIsTesting(true);
    if (onRefreshStatus) {
      await onRefreshStatus();
    }
    // ensure clear visual duration
    setTimeout(() => {
      setIsTesting(false);
    }, 1000);
  };

  const handleCopySql = () => {
    if (supabaseStatus?.sqlScript) {
      navigator.clipboard.writeText(supabaseStatus.sqlScript);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginLog[]>(() => {
    try {
      const saved = localStorage.getItem('manikkita_login_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Product Form states
  const [isEditing, setIsEditing] = useState<string | null>(null); // holds product.id when editing
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Gelang');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState(15000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>('');
  const [formBeads, setFormBeads] = useState('manik premium, bintang perak');
  const [formColors, setFormColors] = useState('#000000, #ff85a2, #40e0d0');
  const [formImageBase64, setFormImageBase64] = useState<string | null>(null);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsLimited, setFormIsLimited] = useState(true);
  const [formIsSoldOut, setFormIsSoldOut] = useState(false);
  const [formStock, setFormStock] = useState(10);

  // Category management helper states
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryInputValue, setEditingCategoryInputValue] = useState('');

  // Form notifications
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteCategoryName, setConfirmDeleteCategoryName] = useState<string | null>(null);

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsLoggedIn(true);
          localStorage.setItem('manikkita_admin_logged', 'true');
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('manikkita_admin_logged');
        }
      } catch (err) {
        console.error('Error fetching Supabase session:', err);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = username.trim();
    const cleanPass = password;

    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError('');

    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
    });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (error) {
        const newLog: LoginLog = {
          timestamp,
          username: cleanEmail || 'unknown',
          status: 'GAGAL',
          device: navigator.userAgent.split(') ')[0].replace('Mozilla/5.0 (', '') + ')',
        };
        setLoginHistory(prev => [newLog, ...prev]);
        setLoginError(error.message || 'Email atau password Admin salah.');
      } else {
        const newLog: LoginLog = {
          timestamp,
          username: cleanEmail,
          status: 'SUKSES',
          device: navigator.userAgent.split(') ')[0].replace('Mozilla/5.0 (', '') + ')',
        };
        setLoginHistory(prev => [newLog, ...prev]);
        setIsLoggedIn(true);
        localStorage.setItem('manikkita_admin_logged', 'true');
        setLoginError('');
        setFormStatus(`Selamat datang kembali, Admin ${data.user?.email || cleanEmail}!`);
      }
    } catch (err: any) {
      console.error('Error logging in:', err);
      const newLog: LoginLog = {
        timestamp,
        username: cleanEmail || 'unknown',
        status: 'GAGAL',
        device: navigator.userAgent.split(') ')[0].replace('Mozilla/5.0 (', '') + ')',
      };
      setLoginHistory(prev => [newLog, ...prev]);
      setLoginError('Gagal menghubungi Supabase Auth untuk otorisasi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error logging out from Supabase:', err);
    }
    setIsLoggedIn(false);
    localStorage.removeItem('manikkita_admin_logged');
    setFormStatus('Anda berhasil logout dari Panel Admin.');
  };

  // Convert uploaded image file to string representation (Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File gambar terlalu besar! Harap gunakan file di bawah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Populate form for editing
  const handleStartEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormName(product.name);
    setFormCode(product.code);
    setFormCategory(product.category);
    setFormDescription(product.description || '');
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice || '');
    setFormBeads((product.beadsUsed || []).join(', '));
    setFormColors((product.colors || []).join(', '));
    setFormImageBase64(product.image || null);
    setFormIsNew(!!product.isNew);
    setFormIsBestSeller(!!product.isBestSeller);
    setFormIsLimited(true); // default true for handmade items
    setFormIsSoldOut(!!product.isSoldOut);
    setFormStock(product.stock !== undefined ? product.stock : 10);
    
    // scroll to form
    const el = document.getElementById('admin-form-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormName('');
    setFormCode('');
    setFormCategory(categories[0] || 'Gelang');
    setFormDescription('');
    setFormPrice(15000);
    setFormOriginalPrice('');
    setFormBeads('manik premium, bintang perak');
    setFormColors('#000000, #ff85a2, #40e0d0');
    setFormImageBase64(null);
    setFormIsNew(false);
    setFormIsBestSeller(false);
    setFormIsSoldOut(false);
    setFormStock(10);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryInput.trim();
    if (!cleanName) {
      alert('Nama jenis katalog / kategori tidak boleh kosong!');
      return;
    }

    const isDuplicate = categories.some(cat => cat.toLowerCase() === cleanName.toLowerCase());
    if (isDuplicate) {
      alert(`Jenis katalog "${cleanName}" sudah ada!`);
      return;
    }

    onUpdateCategories([...categories, cleanName]);
    setNewCategoryInput('');
    setFormStatus(`Sukses menambah jenis katalog baru: "${cleanName}"`);
  };

  const handleStartEditCategory = (catName: string) => {
    setEditingCategory(catName);
    setEditingCategoryInputValue(catName);
  };

  const handleSaveEditedCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewName = editingCategoryInputValue.trim();
    const oldName = editingCategory;

    if (!oldName) return;
    if (!cleanNewName) {
      alert('Nama kategori tidak boleh kosong!');
      return;
    }

    if (cleanNewName.toLowerCase() === oldName.toLowerCase()) {
      setEditingCategory(null);
      return;
    }

    const isDuplicate = categories.some(
      cat => cat.toLowerCase() === cleanNewName.toLowerCase() && cat !== oldName
    );
    if (isDuplicate) {
      alert(`Jenis katalog dengan nama "${cleanNewName}" sudah ada.`);
      return;
    }

    // 1. Update the category array
    const updatedCategories = categories.map(cat => cat === oldName ? cleanNewName : cat);
    onUpdateCategories(updatedCategories);

    // 2. Cascade changes to products belonging to this category
    const updatedProducts = products.map(prod => {
      if (prod.category === oldName) {
        return { ...prod, category: cleanNewName };
      }
      return prod;
    });
    onUpdateProducts(updatedProducts);

    // 3. Update active formCategory if it was editing
    if (formCategory === oldName) {
      setFormCategory(cleanNewName);
    }

    setEditingCategory(null);
    setFormStatus(`Nama jenis katalog "${oldName}" sukses diubah menjadi "${cleanNewName}"!`);
  };

  const handleDeleteCategory = (catName: string) => {
    if (categories.length <= 1) {
      setFormStatus('Minimal harus ada 1 jenis katalog di toko!');
      return;
    }

    const linkedActiveProductsCount = products.filter(p => p.category === catName && !p.isSoldOut).length;
    if (linkedActiveProductsCount > 0) {
      setFormStatus(`Gagal menghapus! Masih ada ${linkedActiveProductsCount} produk aktif (Ready Stock) di kategori "${catName}".`);
      return;
    }

    // Since there are 0 active products, show inline confirmation
    setConfirmDeleteCategoryName(catName);
  };

  const handleConfirmDeleteCategory = (catName: string) => {
    const remainingCats = categories.filter(c => c !== catName);
    onUpdateCategories(remainingCats);

    const fallbackCat = remainingCats[0] || 'Gelang';

    // Move any sold out products in that category to fallback
    const updatedProducts = products.map(prod => {
      if (prod.category === catName) {
        return { ...prod, category: fallbackCat };
      }
      return prod;
    });
    onUpdateProducts(updatedProducts);

    if (formCategory === catName) {
      setFormCategory(fallbackCat);
    }

    setConfirmDeleteCategoryName(null);
    setFormStatus(`Jenis katalog "${catName}" sukses dihapus.`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formCode || !formDescription) {
      alert('Nama, Kode, dan Deskripsi produk wajib diisi!');
      return;
    }

    const beadArr = formBeads.split(',').map(s => s.trim()).filter(Boolean);
    const colorArr = formColors.split(',').map(s => s.trim()).filter(Boolean);

    const priceNum = Number(formPrice) || 0;
    const origPriceNum = formOriginalPrice ? Number(formOriginalPrice) : undefined;

    if (isEditing) {
      // Edit existing product
      const updated = products.map(prod => {
        if (prod.id === isEditing) {
          const finalStock = Number(formStock) || 0;
          return {
            ...prod,
            name: formName,
            code: formCode.toUpperCase(),
            category: formCategory,
            description: formDescription,
            price: priceNum,
            originalPrice: origPriceNum,
            beadsUsed: beadArr,
            colors: colorArr,
            image: formImageBase64 || undefined,
            isNew: formIsNew,
            isBestSeller: formIsBestSeller,
            isSoldOut: finalStock <= 0 ? true : formIsSoldOut,
            stock: finalStock,
          };
        }
        return prod;
      });
      onUpdateProducts(updated);
      setFormStatus(`Produk ${formName} (${formCode.toUpperCase()}) berhasil diperbarui!`);
    } else {
      // Add new product
      const finalStock = Number(formStock) || 0;
      const newProduct: Product = {
        id: 'user_p_' + Date.now(),
        name: formName,
        code: formCode.toUpperCase(),
        category: formCategory,
        description: formDescription,
        price: priceNum,
        originalPrice: origPriceNum,
        beadsUsed: beadArr,
        colors: colorArr,
        image: formImageBase64 || undefined,
        isNew: formIsNew,
        isBestSeller: formIsBestSeller,
        isSoldOut: finalStock <= 0 ? true : formIsSoldOut,
        stock: finalStock,
      };
      onUpdateProducts([newProduct, ...products]);
      setFormStatus(`Sukses mengupload produk baru: ${formName} (${formCode.toUpperCase()})`);
    }

    resetForm();
  };

  const handleToggleProductSold = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const nextState = !p.isSoldOut;
        return { ...p, isSoldOut: nextState };
      }
      return p;
    });
    onUpdateProducts(updated);
    const affected = products.find(p => p.id === id);
    if (affected) {
      setFormStatus(`Status produk "${affected.name}" cepat diubah menjadi: ${!affected.isSoldOut ? 'Sold Out' : 'Ready'}`);
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}" dari katalog?`)) {
      const filtered = products.filter(p => p.id !== id);
      onUpdateProducts(filtered);
      setFormStatus(`Produk "${name}" sukses dihapus.`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 select-none">
        <div className="bg-white border-4 border-brand-dark rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000000] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-brand-yellow border-3 border-brand-dark rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3.5px_0px_#000000]">
              <ShieldCheck className="w-8 h-8 text-brand-dark" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-brand-dark tracking-tight uppercase">
              ADMIN LOGIN PANEL
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-600 uppercase block">
                User
              </label>
              <input
                type="email"
                required
                placeholder="Masukkan email terdaftar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoggingIn}
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-4 py-2.5 text-xs text-brand-dark font-mono focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-stone-600 uppercase block">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-4 py-2.5 text-xs text-brand-dark font-mono focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50"
              />
            </div>

            {loginError && (
              <div className="bg-brand-peach/25 border-2 border-brand-orange p-3 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-[10px] font-mono text-brand-orange">
                  {loginError}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-display font-black text-xs sm:text-sm transition-all cursor-pointer ${
                isLoggingIn
                  ? "bg-stone-200 text-stone-500 border-2 border-stone-400 cursor-not-allowed"
                  : "brutalist-button-blue shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              }`}
            >
              <LogIn className={`w-4 h-4 text-brand-dark ${isLoggingIn ? "animate-spin" : ""}`} />
              <span>{isLoggingIn ? "MENGOTORISASI..." : "MASUK PANEL ADMIN"}</span>
            </button>
          </form>

          {/* Simple public login log audit */}
          {loginHistory.length > 0 && (
            <div className="pt-4 border-t-2 border-dashed border-stone-100">
              <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase tracking-wider mb-2">
                Audit Log Terakhir (Gagal/Sukses):
              </span>
              <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-2">
                {loginHistory.slice(0, 3).map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-[9px] font-mono flex items-center justify-between ${
                      log.status === 'SUKSES'
                        ? 'bg-brand-mint/10 border-brand-mint text-emerald-800'
                        : 'bg-brand-peach/10 border-brand-orange text-brand-orange'
                    }`}
                  >
                    <span>{log.timestamp} - {log.username}</span>
                    <span className="font-black">[{log.status}]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* Header Admin Bar */}
      <div className="bg-white border-3 border-brand-dark p-4 sm:p-6 rounded-3xl shadow-[5px_5.5px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
              ONLINE - Sesi Admin Terverifikasi
            </span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-brand-dark font-black tracking-tight uppercase">
            DASHBOARD KELOLA SISTEM SPARKLE
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-sans">
            Gunakan panel ini untuk mengunggah produk kerajinan manik-manik Y2K buatan tangan Anda secara aman.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-brand-peach border-2 border-brand-dark px-4 py-2 font-display font-black text-xs rounded-xl flex items-center gap-1.5 shadow-[2px_2.5px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-brand-dark" />
          <span>Keluar Sesi</span>
        </button>
      </div>

      {/* Supabase Integration Widget */}
      <div className="bg-white border-3 border-brand-dark p-4 sm:p-5 rounded-3xl shadow-[5px_5.5px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-brand-pink/20 rounded-xl border-2 border-brand-dark shadow-[1.5px_1.5px_0px_#000000] shrink-0 text-xl font-bold">
            <Database className="w-5 h-5 text-brand-dark" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-display font-black text-xs sm:text-sm text-brand-dark uppercase">
                Supabase Postgres Integration
              </h4>
              {supabaseStatus?.configured ? (
                supabaseStatus?.connected ? (
                  <span className="bg-emerald-100 text-emerald-800 border-2 border-emerald-600 font-mono text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-800 shrink-0" />
                    <span>Aktif & Terhubung</span>
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 border-2 border-amber-600 font-mono text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-800 shrink-0" />
                    <span>Error Koneksi</span>
                  </span>
                )
              ) : (
                <span className="bg-stone-100 text-stone-600 border-2 border-stone-400 font-mono text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                  <Database className="w-3 h-3 text-stone-600 shrink-0" />
                  <span>Lokal Fallback</span>
                </span>
              )}
            </div>
            {supabaseStatus?.errorMsg ? (
              <p className="text-[10px] font-mono text-stone-500 font-semibold max-w-xl leading-tight">
                {supabaseStatus.errorMsg}
              </p>
            ) : supabaseStatus?.configured && supabaseStatus?.connected ? (
              <p className="text-[11px] text-stone-600 leading-tight">
                Sinkronisasi Postgres otomatis aktif! Semua katalog & kategori tersimpan di Supabase Free secara real-time.
              </p>
            ) : (
              <p className="text-[11px] text-stone-600 leading-tight">
                Mode fallback aktif. Silakan isi <code className="bg-stone-100 px-1 font-bold">SUPABASE_URL</code> & <code className="bg-stone-100 px-1 font-bold">SUPABASE_ANON_KEY</code> pada Panel Secrets Anda untuk sinkronisasi cloud.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setShowSqlViewer(!showSqlViewer)}
            className="flex-1 sm:flex-none uppercase bg-white border-2 border-brand-dark font-display font-black text-[10px] sm:text-xs px-3.5 py-2 rounded-xl shadow-[2px_2px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{showSqlViewer ? "Sembunyikan SQL" : "Inisialisasi SQL"}</span>
          </button>
          
          {onRefreshStatus && (
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`border-2 border-brand-dark font-display font-black text-[10px] sm:text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isTesting 
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none" 
                  : "bg-brand-mint shadow-[2px_2px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              }`}
              title="Refresh status koneksi"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
              <span>{isTesting ? "Menguji..." : "Tes Koneksi"}</span>
            </button>
          )}
        </div>
      </div>

      {/* SQL Script popup viewer section */}
      {showSqlViewer && supabaseStatus?.sqlScript && (
        <div className="bg-neutral-900 border-3 border-brand-dark p-4 rounded-3xl shadow-[5px_5.5px_0px_#000000] text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-neutral-800 border border-white/20 rounded-md text-xs flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-neutral-300" />
              </span>
              <span className="font-mono text-[10px] font-bold text-neutral-300 uppercase">SUPABASE TABLE INITIALIZATION SQL SCRIPT</span>
            </div>
            <button
              onClick={handleCopySql}
              className={`font-display font-black text-[9px] sm:text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                copiedSql
                  ? "bg-emerald-600 border-emerald-400 text-white"
                  : "bg-white text-stone-900 border-brand-dark hover:bg-neutral-100"
              }`}
            >
              {copiedSql ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span>BERHASIL DISALIN!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-stone-700" />
                  <span>SALIN SQL</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-[11px] text-stone-300 font-sans leading-snug">
            Cukup salin perintah di bawah ini, masuk ke dashboard <strong className="text-white">Supabase Console &gt; SQL Editor &gt; New Query</strong>, lalu paste berkas ini dan jalankan klik tombol <strong className="text-white">RUN</strong>.
          </p>

          <pre className="p-3 bg-neutral-950 rounded-xl font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-[160px] border border-white/5 select-all">
            {supabaseStatus.sqlScript}
          </pre>
        </div>
      )}

      {formStatus && (
        <div className="bg-brand-yellow/20 border-3 border-brand-dark p-4 rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_#000000]">
          <span className="text-xs sm:text-sm font-sans font-bold text-brand-dark">
            {formStatus}
          </span>
          <button
            onClick={() => setFormStatus(null)}
            className="text-stone-500 hover:text-brand-dark p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="admin-form-anchor">
        {/* Left Column: Form Upload / Update Produk & Category Manager */}
        <div className="lg:col-span-5 space-y-6">
          {/* Form Upload Card */}
          <div className="bg-white border-3 border-brand-dark rounded-3xl p-4 sm:p-6 shadow-[5px_5.5px_0px_#000000] space-y-6">
          <div className="space-y-1">
            <span className="bg-brand-purple/20 text-brand-dark border border-brand-purple text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase inline-block">
              {isEditing ? 'MODE PERBARUI PRODUK' : 'UNGGAH PRODUK KREATIF'}
            </span>
            <h2 className="font-display font-black text-lg sm:text-xl text-brand-dark tracking-tight uppercase flex items-center gap-1.5">
              {isEditing ? (
                <>
                  <Edit2 className="w-4 h-4 text-brand-dark shrink-0" />
                  <span>EDIT AKSESORIS</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-brand-dark shrink-0" />
                  <span>UPLOAD PRODUK BARU</span>
                </>
              )}
            </h2>
            <p className="text-[10px] text-stone-500 font-mono">
              Silakan isi formula rincian kerajinan manik di bawah.
            </p>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Gelang Candy"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-sans focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Kode Produk (Misal S-0001)
                </label>
                <input
                  type="text"
                  required
                  placeholder="S-0009"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-sans focus:outline-none uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Pilih Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-2 py-2 text-xs text-brand-dark font-sans"
                >
                  {categories.map((catName) => (
                    <option key={catName} value={catName}>
                      {catName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Unggah Gambar (JPG/PNG)
                </label>
                <div className="relative flex items-center justify-center border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 p-2 cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono">
                      {formImageBase64 ? 'Gambar Terpilih' : 'Pilih Foto (Maks 2MB)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                Deskripsi & Cerita Produk
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tulis detail keunggulan aksesoris estetika ini..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-sans focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Harga Jual (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Harga Coret (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Opsional"
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                  Jumlah Stock
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="Misal: 10"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value) || 0)}
                  className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block flex items-center justify-between">
                <span>Resep Manik (Pisahkan dengan koma)</span>
                <span className="text-[8px] text-stone-400 capitalize">Contoh: mutiara biru, charm bintang</span>
              </label>
              <input
                type="text"
                placeholder="manik kristal ungu, manik peach bulat"
                value={formBeads}
                onChange={(e) => setFormBeads(e.target.value)}
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-sans focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block flex items-center justify-between">
                <span>Warna Visualizer (Kode Hex warna, Pisahkan koma)</span>
                <span className="text-[8px] text-stone-400">Contoh: #ff85a2, #40e0d0, #ffffff</span>
              </label>
              <input
                type="text"
                placeholder="#ff85a2, #40e0d0, #000000"
                value={formColors}
                onChange={(e) => setFormColors(e.target.value)}
                className="w-full bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-mono focus:outline-none"
              />
            </div>

            {/* Status Ketersediaan (Ready vs Sold Out) Segmented Toggles */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-semibold text-stone-500 uppercase block">
                Status Ketersediaan Produk (Ready / Sold Out)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormIsSoldOut(false)}
                  className={`py-2 px-3 rounded-xl border-2 font-display font-black text-xs text-center transition-all cursor-pointer ${
                    !formIsSoldOut
                      ? 'bg-brand-mint text-brand-dark border-brand-dark shadow-[1.5px_1.5px_0px_#000000]'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-brand-dark'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ready Stock (Tersedia)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormIsSoldOut(true)}
                  className={`py-2 px-3 rounded-xl border-2 font-display font-black text-xs text-center transition-all cursor-pointer ${
                    formIsSoldOut
                      ? 'bg-red-50 text-white border-brand-dark shadow-[1.5px_1.5px_0px_#000000]'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-brand-dark'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <X className="w-3.5 h-3.5" /> Sold Out (Habis)
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-stone-50 border border-stone-200 p-2.5 rounded-xl text-[10px] select-none font-mono text-stone-600 gap-2">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsNew}
                  onChange={(e) => setFormIsNew(e.target.checked)}
                  className="accent-brand-pink"
                />
                <span className="flex items-center gap-1">
                  Baru <Zap className="w-3 h-3 text-brand-yellow fill-brand-yellow shrink-0" />
                </span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsBestSeller}
                  onChange={(e) => setFormIsBestSeller(e.target.checked)}
                  className="accent-brand-yellow"
                />
                <span className="flex items-center gap-1">
                  Best Seller <Heart className="w-3 h-3 text-brand-orange fill-brand-orange shrink-0" />
                </span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer opacity-75">
                <input
                  type="checkbox"
                  disabled
                  checked={formIsLimited}
                  className="accent-brand-orange"
                />
                <span className="flex items-center gap-1">
                  Stok Terbatas <Clock className="w-3 h-3 shrink-0" />
                </span>
              </label>
            </div>

            {formImageBase64 && (
              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3 relative">
                <div className="h-14 w-14 bg-white border border-stone-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  <img src={formImageBase64} className="h-full w-full object-contain" alt="Selected Preview" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold block text-stone-700">Preview Foto Uploader</span>
                  <p className="text-[9px] text-stone-400 font-mono">Format JPG/PNG berhasil dikonversi ke Base64 lokal.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormImageBase64(null)}
                  className="absolute top-1 right-1 hover:text-red-500 cursor-pointer"
                  title="Hapus media foto"
                >
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-stone-100 border-2 border-brand-dark px-3 rounded-2xl font-display font-black text-xs hover:bg-stone-200 transition-all cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="brutalist-button-blue flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-display font-black text-xs sm:text-sm shadow-[3px_3.5px_0px_#000000] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
                <span>{isEditing ? 'SIMPAN PERUBAHAN' : 'PUBLIKASIKAN KE KATALOG'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Kelola Jenis Katalog/Kategori Card */}
        <div className="bg-white border-3 border-brand-dark rounded-3xl p-4 sm:p-6 shadow-[5px_5.5px_0px_#000000] space-y-4">
          <div className="space-y-1">
            <span className="bg-brand-mint/20 text-brand-dark border border-brand-mint text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase inline-block">
              SISTEM KATALOG KATEGORI
            </span>
            <h2 className="font-display font-black text-lg sm:text-xl text-brand-dark tracking-tight uppercase flex items-center gap-2">
              <Folder className="w-5 h-5 text-brand-dark shrink-0" />
              <span>KELOLA JENIS KATALOG</span>
            </h2>
            <p className="text-[10px] text-stone-500 font-mono">
              Tambah, ubah, atau hapus jenis kategori produk yang tampil di katalog depan.
            </p>
          </div>

          {/* Form Add Category */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              placeholder="Tambah jenis baru (misal: Choker, Strap HP)"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              className="flex-1 bg-stone-50 border-2 border-brand-dark rounded-xl px-3 py-2 text-xs text-brand-dark font-sans focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
            <button
              type="submit"
              className="bg-brand-mint text-brand-dark border-2 border-brand-dark px-4 py-2 font-display font-black text-xs rounded-xl shadow-[2px_2px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 animate-pulse" />
              <span>Tambah</span>
            </button>
          </form>

          {/* List of active categories with edit inline / delete */}
          <div className="space-y-2 pt-2 border-t border-dashed border-stone-200">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-600 block">
              Jenis Katalog Aktif ({categories.length}):
            </span>
            <div className="space-y-2">
              {categories.map((catTier) => (
                <div
                  key={catTier}
                  className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-brand-dark"
                >
                  {editingCategory === catTier ? (
                    <form onSubmit={handleSaveEditedCategory} className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                      <input
                        type="text"
                        value={editingCategoryInputValue}
                        onChange={(e) => setEditingCategoryInputValue(e.target.value)}
                        className="flex-1 bg-white border-2 border-brand-dark rounded-lg px-2 py-1 text-xs text-brand-dark font-sans focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-brand-yellow text-[10px] uppercase font-display font-black px-2.5 py-1.5 rounded-lg border border-brand-dark shadow-[1px_1px_0px_#000000] hover:translate-y-px cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="text-stone-400 hover:text-stone-600 text-[10px]"
                      >
                        Batal
                      </button>
                    </form>
                  ) : confirmDeleteCategoryName === catTier ? (
                    <div className="flex items-center justify-between w-full p-0.5">
                      <span className="text-[10px] text-red-600 font-mono font-black truncate mr-1 animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Yakin hapus "{catTier}"?</span>
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmDeleteCategory(catTier)}
                          className="bg-red-500 text-white font-display font-black text-[10px] px-2.5 py-1.5 rounded-lg border border-brand-dark cursor-pointer hover:bg-red-600 shadow-[1px_1px_0px_#000000]"
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteCategoryName(null)}
                          className="bg-white text-stone-700 font-display font-black text-[10px] px-2 py-1.5 rounded-lg border border-brand-dark cursor-pointer hover:bg-stone-100 shadow-[1px_1px_0px_#000000]"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="flex items-center justify-center shrink-0">
                          {catTier === 'Gelang' ? (
                            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                          ) : catTier === 'Cincin' ? (
                            <Heart className="w-3.5 h-3.5 text-brand-pink" />
                          ) : (
                            <Star className="w-3.5 h-3.5 text-brand-yellow" />
                          )}
                        </span>
                        <span className="truncate">{catTier}</span>
                        <span className="text-[9px] font-normal text-stone-400">
                          ({products.filter(p => p.category === catTier).length} produk)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(catTier)}
                          className="p-1 hover:bg-stone-200 rounded text-stone-600 hover:text-brand-dark transition-colors cursor-pointer"
                          title="Edit nama kategori"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(catTier)}
                          className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-stone-400 transition-colors cursor-pointer"
                          title="Hapus kategori"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Inventory List & Audit logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Inventory Manager Card */}
          <div className="bg-white border-3 border-brand-dark rounded-3xl p-4 sm:p-6 shadow-[5px_5.5px_0px_#000000] space-y-4">
            <h2 className="font-display font-black text-lg sm:text-xl text-brand-dark tracking-tight uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-dark shrink-0" />
              <span>LIST KATALOG INVENTORY ({products.length} ITEM)</span>
            </h2>
            <p className="text-[10px] text-stone-500 font-mono mt-0.5">
              Klik perbaharui untuk menyunting detail harga/deskripsi, atau tombol tempat sampah untuk menghapus item.
            </p>

            <div className="border-2 border-brand-dark rounded-2xl overflow-hidden divide-y-2 divide-stone-200 max-h-[500px] overflow-y-auto">
              {products.length === 0 ? (
                <div className="p-8 text-center text-stone-400 font-mono text-xs">
                  Inventory kosong. Silakan upload produk baru!
                </div>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="p-3 sm:p-4 bg-white flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-3">
                      {/* Left color swatch/preview */}
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-brand-dark bg-stone-50 flex items-center justify-center overflow-hidden shrink-0">
                        {p.image ? (
                          <img src={p.image} className="h-full w-full object-contain" alt="" />
                        ) : (
                          <div className="flex gap-0.5 justify-center items-center">
                            {(p.colors || []).slice(0, 3).map((col, idx) => (
                              <span key={idx} className="h-2.5 w-2.5 rounded-full border border-stone-300" style={{ backgroundColor: col }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[9px] font-bold text-brand-pink uppercase tracking-wider">
                            ({p.code.toUpperCase()})
                          </span>
                          <span className="font-mono bg-stone-100 text-[8px] font-bold text-stone-600 px-1.5 border py-0.5 rounded">
                            {p.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleProductSold(p.id)}
                            className={`px-1.5 py-0.5 border rounded text-[8px] font-mono font-black tracking-wider uppercase transition-all hover:scale-105 cursor-pointer flex items-center gap-0.5 ${
                              p.isSoldOut
                                ? 'bg-red-50 text-red-600 border-red-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            }`}
                            title="Klik untuk ubah cepat status Ready / Sold Out"
                          >
                            <span>{p.isSoldOut ? 'SOLD' : 'READY'}</span>
                          </button>
                        </div>
                        <h4 className="font-display text-xs sm:text-sm font-black text-brand-dark leading-tight mt-0.5">
                          {p.name}
                        </h4>
                        <p className="text-[10px] font-mono text-stone-600">
                          Rp {p.price.toLocaleString('id-ID')} | Stok: {p.stock !== undefined ? p.stock : 10}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-1.5 bg-red-50 border-2 border-brand-dark p-1 sm:p-1.5 rounded-xl animate-bounce">
                          <span className="text-[10px] font-mono font-bold text-red-600 px-1">Yakin hapus?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateProducts(products.filter(item => item.id !== p.id));
                              setFormStatus(`Produk "${p.name}" sukses dihapus.`);
                              setConfirmDeleteId(null);
                            }}
                            className="bg-red-500 text-white font-display font-black text-[10px] px-2.5 py-1 rounded-lg border border-brand-dark cursor-pointer hover:bg-red-600 shadow-[1px_1px_0px_#000000] active:translate-y-px"
                          >
                            Ya
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-white text-stone-700 font-display font-black text-[10px] px-2 py-1 rounded-lg border border-brand-dark cursor-pointer hover:bg-stone-100 shadow-[1px_1px_0px_#000000] active:translate-y-px"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="bg-brand-yellow hover:bg-brand-yellow/80 border-2 border-brand-dark p-2 rounded-xl text-brand-dark cursor-pointer shadow-[1.5px_1.5px_0px_#000000] transition-transform active:translate-y-0.5"
                            title="Sunting Detail"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="bg-brand-peach hover:bg-brand-peach/80 border-2 border-brand-dark p-2 rounded-xl text-brand-dark cursor-pointer shadow-[1.5px_1.5px_0px_#000000] transition-transform active:translate-y-0.5"
                            title="Hapus Dari Katalog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Login Logs Terminal Log */}
          <div className="bg-brand-dark border-3 border-brand-dark rounded-3xl p-4 sm:p-6 shadow-[5px_5.5px_0px_#000000] text-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-[#a8ffb2] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                SYSTEM LOGIN ACTIVITY AUDIT TRAILS
              </h3>
              <span className="font-mono text-[9px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                Secure Session Logs
              </span>
            </div>
            
            <p className="text-[10px] text-stone-400 font-mono">
              Berikut adalah riwayat login administrator website untuk melacak keamanan dan akses tidak sah.
            </p>

            <div className="bg-[#1e1e1e] border border-stone-800 rounded-xl p-3 font-mono text-[10px] divide-y divide-stone-800 max-h-[160px] overflow-y-auto space-y-1.5">
              {loginHistory.length === 0 ? (
                <div className="text-center text-stone-600 py-6">
                  Belum ada log terekam dalam sirkuit memori.
                </div>
              ) : (
                loginHistory.map((log, idx) => (
                  <div key={idx} className="pt-1.5 flex flex-col justify-between text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">{log.timestamp}</span>
                      <span className={`font-black ${log.status === 'SUKSES' ? 'text-emerald-400' : 'text-red-400'}`}>
                        [{log.status}]
                      </span>
                    </div>
                    <div className="text-[9px] text-stone-500 mt-0.5 flex flex-col">
                      <span>• Admin User: <span className="text-stone-300 font-bold">{log.username}</span></span>
                      <span className="truncate">• Device Agent: {log.device}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
