import { createClient } from '@supabase/supabase-js';
import { Product } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hleoxeopzsdrnfrmbxdb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_md9HrqW3IzAut0oz1igVsQ_ewZlX34V';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SQL_INIT_SCRIPT = `-- SQL SCRIPT UNTUK SUPABASE SQL EDITOR

-- JIKA INGIN ME-RESET KEDUA TABEL AGAR BERSIH (OPSIONAL), KELARKAN KOMENTAR BERIKUT:
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;

-- 1. Buat Tabel Categories
CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat Tabel Products (Tanpa foreign key REFERENCES yang ketat agar sync aman)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb,
  beads_used JSONB DEFAULT '[]'::jsonb,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_sold_out BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Masukkan data kategori default (opsional)
INSERT INTO categories (name) VALUES ('Gelang'), ('Cincin') ON CONFLICT DO NOTHING;

-- 4. Matikan RLS (Row Level Security) agar Client API bisa lancar melakukan Read/Write
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
`;

// Helper to safely parse array from DB (JSONB, raw JSON string, or comma-separated string)
function safeParseArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fall through to plain comma-split
      }
    }
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

// Helper: Map DB product to Frontend standard
export function mapDbToProduct(dbRow: any): Product {
  return {
    id: dbRow.id,
    name: dbRow.name,
    code: dbRow.code || '',
    description: dbRow.description || '',
    price: dbRow.price,
    originalPrice: dbRow.original_price || undefined,
    image: dbRow.image || '',
    category: dbRow.category,
    colors: safeParseArray(dbRow.colors),
    beadsUsed: safeParseArray(dbRow.beads_used),
    isBestSeller: !!dbRow.is_best_seller,
    isNew: !!dbRow.is_new,
    isSoldOut: !!dbRow.is_sold_out,
    stock: dbRow.stock !== undefined ? Number(dbRow.stock) : 10
  };
}

// Helper: Map FE product to DB standard
export function mapProductToDb(prod: Product) {
  return {
    id: prod.id,
    name: prod.name,
    code: prod.code,
    description: prod.description || '',
    price: prod.price,
    original_price: prod.originalPrice || null,
    image: prod.image || '',
    category: prod.category,
    colors: Array.isArray(prod.colors) ? prod.colors : [],
    beads_used: Array.isArray(prod.beadsUsed) ? prod.beadsUsed : [],
    is_best_seller: !!prod.isBestSeller,
    is_new: !!prod.isNew,
    is_sold_out: !!prod.isSoldOut,
    stock: prod.stock !== undefined ? Number(prod.stock) : 10
  };
}
