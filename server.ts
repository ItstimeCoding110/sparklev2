import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

// Define path resolutions safely supporting both ESM and CommonJS formats
let resolvedFilename = "";
let resolvedDirname = "";
if (typeof import.meta !== "undefined" && import.meta.url) {
  resolvedFilename = fileURLToPath(import.meta.url);
  resolvedDirname = path.dirname(resolvedFilename);
} else {
  resolvedFilename = typeof __filename !== "undefined" ? __filename : "";
  resolvedDirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();
}

// Import default PRODUCTS from data file dynamically or load as fallback
import { PRODUCTS } from "./src/data";

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const STORE_PATH = path.join(process.cwd(), "data-store.json");

// Helper to initialize local data store file if it does not exist
function initLocalStore() {
  if (!fs.existsSync(STORE_PATH)) {
    const initialData = {
      products: PRODUCTS,
      categories: ["Gelang", "Cincin"]
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Local data store created successfully at:", STORE_PATH);
  }
}

// Read local data helper
function readLocalStore() {
  initLocalStore();
  try {
    const data = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read local store:", err);
    return { products: PRODUCTS, categories: ["Gelang", "Cincin"] };
  }
}

// Write local data helper
function writeLocalStore(data: any) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to local store:", err);
  }
}

// Lazy load Supabase connection
let supabaseClient: any = null;
let connectionTested = false;
let isConnected = false;
let connectionErrorMsg = "";
let lastUrl = "";
let lastKey = "";

function sanitizeSupabaseUrl(rawUrl: string): string {
  let cleaned = rawUrl.trim();
  // Strip outer quotes if copied improperly
  cleaned = cleaned.replace(/^["']|["']$/g, "");
  // Strip trailing slashes
  while (cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  // Strip /rest/v1 suffix if present (case insensitive)
  if (cleaned.toLowerCase().endsWith("/rest/v1")) {
    cleaned = cleaned.slice(0, -8);
  }
  // Strip trailing slashes again
  while (cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

function sanitizeSupabaseKey(rawKey: string): string {
  if (!rawKey) return "";
  let cleaned = rawKey.trim();
  // Strip outer quotes if copied improperly
  return cleaned.replace(/^["']|["']$/g, "");
}

function getSupabase() {
  const rawUrl = process.env.SUPABASE_URL || "";
  const rawKey = process.env.SUPABASE_ANON_KEY || "";

  const url = sanitizeSupabaseUrl(rawUrl);
  const key = sanitizeSupabaseKey(rawKey);

  if (!url || !key) {
    supabaseClient = null;
    lastUrl = "";
    lastKey = "";
    return null;
  }

  if (supabaseClient && url === lastUrl && key === lastKey) {
    return supabaseClient;
  }

  try {
    // Mask the url to log without leaking full credential
    let maskedUrl = url;
    try {
      const parsed = new URL(url);
      const hostParts = parsed.host.split(".");
      if (hostParts[0] && hostParts[0].length > 4) {
        hostParts[0] = hostParts[0].slice(0, 4) + "***";
      }
      maskedUrl = `${parsed.protocol}//${hostParts.join(".")}`;
    } catch {
      maskedUrl = url.slice(0, 15) + "...";
    }

    console.log(`Initializing custom Supabase client with URL: ${maskedUrl}`);
    supabaseClient = createClient(url, key);
    lastUrl = url;
    lastKey = key;
    return supabaseClient;
  } catch (err) {
    console.error("Supabase client init error:", err);
    return null;
  }
}

// Test connection
async function checkSupabaseConnection() {
  const client = getSupabase();
  if (!client) {
    isConnected = false;
    connectionErrorMsg = "SUPABASE_URL or SUPABASE_ANON_KEY is missing in environment secrets.";
    console.log("Supabase connection check: Fail - credentials missing.");
    return false;
  }

  try {
    console.log("Attempting query on categories to test Supabase connection...");
    const { error, data } = await client.from("categories").select("name").limit(1);
    if (error) {
      console.log("Supabase query returned error details:", JSON.stringify(error));
      // Maybe table does not exist yet inside Supabase
      if (error.code === "PGRST116" || error.code === "42P01") {
        isConnected = true; // Connection worked but Table needs initialization!
        connectionErrorMsg = "Connected, but tables are missing. Please run the SQL initialization script in your Supabase SQL editor.";
        return true;
      }
      isConnected = false;
      connectionErrorMsg = `Supabase request failed: ${error.message} (Code: ${error.code})`;
      return false;
    }
    console.log("Supabase connection check: Success! Fetch data result length:", data?.length);
    isConnected = true;
    connectionErrorMsg = "";
    return true;
  } catch (err: any) {
    console.log("Supabase connection caught exception:", err);
    isConnected = false;
    connectionErrorMsg = `Network or initialization error: ${err.message || err}`;
    return false;
  }
}

// SQL helper for UI
const SQL_INIT_SCRIPT = `-- SQL SCRIPT UNTUK SUPABASE SQL EDITOR

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Masukkan data kategori default (opsional)
INSERT INTO categories (name) VALUES ('Gelang'), ('Cincin') ON CONFLICT DO NOTHING;

-- 4. Matikan RLS (Row Level Security) agar Client API bisa lancar melakukan Read/Write
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
`;

// Helper: Map DB product to Frontend standard
function mapDbToProduct(dbRow: any) {
  return {
    id: dbRow.id,
    name: dbRow.name,
    code: dbRow.code,
    description: dbRow.description || "",
    price: dbRow.price,
    originalPrice: dbRow.original_price || undefined,
    image: dbRow.image,
    category: dbRow.category,
    colors: Array.isArray(dbRow.colors) ? dbRow.colors : (typeof dbRow.colors === "string" ? JSON.parse(dbRow.colors) : dbRow.colors || []),
    beadsUsed: Array.isArray(dbRow.beads_used) ? dbRow.beads_used : (typeof dbRow.beads_used === "string" ? JSON.parse(dbRow.beads_used) : dbRow.beads_used || []),
    isBestSeller: !!dbRow.is_best_seller,
    isNew: !!dbRow.is_new,
    isSoldOut: !!dbRow.is_sold_out
  };
}

// Helper: Map FE product to DB standard
function mapProductToDb(prod: any) {
  return {
    id: prod.id,
    name: prod.name,
    code: prod.code,
    description: prod.description || "",
    price: prod.price,
    original_price: prod.originalPrice || null,
    image: prod.image,
    category: prod.category,
    colors: Array.isArray(prod.colors) ? prod.colors : [],
    beads_used: Array.isArray(prod.beadsUsed) ? prod.beadsUsed : [],
    is_best_seller: !!prod.isBestSeller,
    is_new: !!prod.isNew,
    is_sold_out: !!prod.isSoldOut
  };
}

async function startServer() {
  // Initialize local data-store JSON
  initLocalStore();

  // API Ends
  app.get("/api/supabase-status", async (req, res) => {
    await checkSupabaseConnection();
    res.json({
      configured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      connected: isConnected,
      errorMsg: connectionErrorMsg,
      url: process.env.SUPABASE_URL || "",
      sqlScript: SQL_INIT_SCRIPT
    });
  });

  // Admin authenticate using Supabase Auth (Server-side proxy to secure keys)
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email dan password wajib diisi." });
    }

    const sb = getSupabase();
    if (!sb) {
      // Local developer login fallback
      if (email.trim() === "admin@sparkle.com" && password === "admin123") {
        console.log("Local developer login success (Supabase fallback mode)");
        return res.json({
          success: true,
          user: {
            id: "local-dev-admin",
            email: "admin@sparkle.com"
          }
        });
      }
      return res.status(503).json({ 
        success: false, 
        error: "Otorisasi gagal: Supabase tidak terkonfigurasi. Untuk pengujian lokal, silakan masuk menggunakan email: admin@sparkle.com dan password: admin123" 
      });
    }

    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        return res.status(401).json({ 
          success: false, 
          error: error.message 
        });
      }

      return res.json({ 
        success: true, 
        user: {
          id: data.user?.id,
          email: data.user?.email,
        }
      });
    } catch (err: any) {
      return res.status(500).json({ 
        success: false, 
        error: "Terjadi gangguan sistem otorisasi Supabase: " + (err.message || err)
      });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from("categories").select("name").order("name");
        if (!error && data) {
          const list = data.map((d: any) => d.name);
          return res.json(list);
        }
        console.log("Supabase categories not initialized or query failed, serving from local store fallback.");
      } catch (err) {
        console.log("Supabase categories query exception, serving from local store fallback.");
      }
    }
    const local = readLocalStore();
    res.json(local.categories);
  });

  // Get products
  app.get("/api/products", async (req, res) => {
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from("products").select("*");
        if (!error && data) {
          const mapped = data.map(mapDbToProduct);
          return res.json(mapped);
        }
        console.log("Supabase products not initialized or query failed, serving from local store fallback.");
      } catch (err) {
        console.log("Supabase products query exception, serving from local store fallback.");
      }
    }
    const local = readLocalStore();
    res.json(local.products);
  });

  // Sync / Save categories
  app.post("/api/categories", async (req, res) => {
    const newCategories: string[] = req.body;
    if (!Array.isArray(newCategories)) {
      return res.status(400).json({ error: "Invalid categories array format." });
    }

    // Save locally
    const local = readLocalStore();
    local.categories = newCategories;
    writeLocalStore(local);

    // Save to Supabase
    const sb = getSupabase();
    if (sb) {
      try {
        // 1. Get current names in Supabase
        const { data: existing } = await sb.from("categories").select("name");
        const existingNames = (existing || []).map((c: any) => c.name);

        // 2. Identify deleted categories and delete them
        const toDelete = existingNames.filter(name => !newCategories.includes(name));
        if (toDelete.length > 0) {
          await sb.from("categories").delete().in("name", toDelete);
        }

        // 3. Upsert new categories
        const rowsToUpsert = newCategories.map(name => ({ name }));
        const { error } = await sb.from("categories").upsert(rowsToUpsert, { onConflict: "name" });
        if (error) {
          console.error("Supabase category update error:", error);
          return res.json({ success: true, warning: "Saved locally, but failed to write to Supabase table: " + error.message });
        }
      } catch (err: any) {
        console.error("Supabase sync category error:", err);
        return res.json({ success: true, warning: "Saved locally, but cannot connect to Supabase database backend: " + (err.message || err) });
      }
    }

    res.json({ success: true });
  });

  // Sync / Save products
  app.post("/api/products", async (req, res) => {
    const newProducts: any[] = req.body;
    if (!Array.isArray(newProducts)) {
      return res.status(400).json({ error: "Invalid products array format." });
    }

    // Save locally
    const local = readLocalStore();
    local.products = newProducts;
    writeLocalStore(local);

    // Save to Supabase
    const sb = getSupabase();
    if (sb) {
      try {
        // 1. Get current product IDs in Supabase
        const { data: existing } = await sb.from("products").select("id");
        const existingIds = (existing || []).map((p: any) => p.id);

        // 2. Identify deleted product IDs and delete them
        const incomingIds = newProducts.map(p => p.id);
        const toDelete = existingIds.filter(id => !incomingIds.includes(id));
        if (toDelete.length > 0) {
          await sb.from("products").delete().in("id", toDelete);
        }

        // 3. Upsert incoming products
        if (newProducts.length > 0) {
          const rowsToUpsert = newProducts.map(mapProductToDb);
          const { error } = await sb.from("products").upsert(rowsToUpsert, { onConflict: "id" });
          if (error) {
            console.error("Supabase product update error:", error);
            return res.json({ success: true, warning: "Saved locally, but failed to write to Supabase table: " + error.message });
          }
        }
      } catch (err: any) {
        console.error("Supabase sync products error:", err);
        return res.json({ success: true, warning: "Saved locally, but cannot connect to Supabase database backend: " + (err.message || err) });
      }
    }

    res.json({ success: true });
  });

  // Vite Integration for Hot Development / Static Production
  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Starting development mode with Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      console.log("Starting production compiled mode...");
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Fullstack server running on http://localhost:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export { app, startServer };
export default app;
