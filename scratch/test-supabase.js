import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    for (const prod of data) {
      console.log(`Product: ${prod.name} (${prod.id})`);
      console.log('  Colors:', prod.colors, typeof prod.colors);
      console.log('  Beads:', prod.beads_used, typeof prod.beads_used);
    }
  }
}

test();
