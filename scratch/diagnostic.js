import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://hleoxeopzsdrnfrmbxdb.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_md9HrqW3IzAut0oz1igVsQ_ewZlX34V';

console.log('--- SUPABASE DIAGNOSTIC START ---');
console.log('Target URL:', url);
console.log('Anon Key Prefix:', key ? key.substring(0, 15) + '...' : 'empty');

const supabase = createClient(url, key);

async function runDiagnostics() {
  // Test 1: Fetch Categories
  console.log('\n[Test 1] Fetching categories...');
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('❌ Failed to fetch categories:', error.message);
    } else {
      console.log('✅ Categories fetched successfully. Count:', data.length);
      console.log('   Data:', data.map(c => c.name));
    }
  } catch (err) {
    console.error('❌ Network/Client error during Test 1:', err);
  }

  // Test 2: Fetch Products
  console.log('\n[Test 2] Fetching products...');
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('❌ Failed to fetch products:', error.message);
    } else {
      console.log('✅ Products fetched successfully. Count:', data.length);
      if (data.length > 0) {
        const sample = data[0];
        console.log('   Sample Product schema check:');
        console.log('     id:', sample.id, `(type: ${typeof sample.id})`);
        console.log('     name:', sample.name, `(type: ${typeof sample.name})`);
        console.log('     price:', sample.price, `(type: ${typeof sample.price})`);
        console.log('     colors:', sample.colors, `(type: ${typeof sample.colors})`);
        console.log('     beads_used:', sample.beads_used, `(type: ${typeof sample.beads_used})`);
        console.log('     stock:', sample.stock, `(type: ${typeof sample.stock})`);
      }
    }
  } catch (err) {
    console.error('❌ Network/Client error during Test 2:', err);
  }

  // Test 3: Write Test (Insert a dummy product)
  console.log('\n[Test 3] Attempting to insert a test product...');
  const testId = 'diagnostic_test_' + Date.now();
  const testProduct = {
    id: testId,
    name: 'Diagnostic Test Bracelet',
    code: 'TEST-01',
    description: 'This is a temporary product inserted during automated diagnostics.',
    price: 10000,
    image: '',
    category: 'Gelang',
    colors: ['#ffffff'],
    beads_used: ['Test Bead'],
    is_best_seller: false,
    is_new: true,
    is_sold_out: false,
    stock: 5
  };

  let writeSuccess = false;
  try {
    const { data, error } = await supabase.from('products').insert([testProduct]).select();
    if (error) {
      console.error('❌ Failed to insert test product:', error.message);
      if (error.message.includes('permission') || error.message.includes('row-level security')) {
        console.log('   👉 Note: This indicates Row Level Security (RLS) is enabled and blocking writes for Anon role.');
      }
    } else {
      console.log('✅ Test product inserted successfully!');
      writeSuccess = true;
    }
  } catch (err) {
    console.error('❌ Network/Client error during Test 3:', err);
  }

  // Test 4: Delete Test Product (Clean up if Test 3 succeeded)
  if (writeSuccess) {
    console.log('\n[Test 4] Cleaning up: deleting test product...');
    try {
      const { data, error } = await supabase.from('products').delete().eq('id', testId);
      if (error) {
        console.error('❌ Failed to delete test product:', error.message);
      } else {
        console.log('✅ Test product deleted successfully. Cleanup complete.');
      }
    } catch (err) {
      console.error('❌ Network/Client error during Test 4:', err);
    }
  } else {
    console.log('\n[Test 4] Skipped (Write test failed).');
  }

  console.log('\n--- SUPABASE DIAGNOSTIC COMPLETE ---');
}

runDiagnostics();
