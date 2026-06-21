import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

function safeParseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function mapDbToProduct(dbRow) {
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

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    try {
      console.log(`Successfully fetched ${data.length} products. Testing mapping...`);
      const mapped = data.map(mapDbToProduct);
      console.log('Mapping succeeded! No errors.');
      console.log('Sample mapped product:', mapped[0]);
    } catch (err) {
      console.error('Mapping failed with error:', err);
    }
  }
}

test();
