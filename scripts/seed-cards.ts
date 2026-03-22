// ============================================================
// Châu Tarot — Seed Script
// Chạy: npx tsx scripts/seed-cards.ts
// Ghi 78 lá bài từ tarot-cards.ts vào Supabase
// ============================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { tarotCards } from '../src/features/cards/data/tarot-cards';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Bắt đầu seed 78 lá bài Tarot...\n');

  // Clear existing data
  const { error: deleteError } = await supabase
    .from('tarot_cards')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

  if (deleteError) {
    console.error('⚠️  Lỗi khi xóa dữ liệu cũ:', deleteError.message);
  }

  // Insert all 78 cards
  const rows = tarotCards.map((card) => ({
    name: card.name,
    number: card.number,
    arcana: card.arcana,
    suit: card.suit || null,
    image: card.image,
    description: card.description,
    detailed_meaning: card.detailedMeaning,
    upright: card.upright,
    reversed: card.reversed,
    keywords: card.keywords,
    element: card.element || null,
    zodiac: card.zodiac || null,
    yes_no: card.yesNo,
    slug: card.slug,
  }));

  // Insert in batches of 20
  const batchSize = 20;
  let inserted = 0;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('tarot_cards').insert(batch);

    if (error) {
      console.error(`❌ Lỗi batch ${i / batchSize + 1}:`, error.message);
      console.error('   Chi tiết:', JSON.stringify(error, null, 2));
    } else {
      inserted += batch.length;
      console.log(`  ✅ Đã thêm ${inserted}/${rows.length} lá bài`);
    }
  }

  // Verify
  const { count } = await supabase
    .from('tarot_cards')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🎴 Hoàn thành! Tổng số lá bài trong database: ${count}`);
  
  // Show sample
  const { data: sample } = await supabase
    .from('tarot_cards')
    .select('name, arcana, suit, slug')
    .limit(5);
  
  console.log('\n📋 Mẫu dữ liệu:');
  sample?.forEach((card) => {
    console.log(`   ${card.name} (${card.arcana}${card.suit ? ' - ' + card.suit : ''}) → /${card.slug}`);
  });
}

seed().catch((err) => {
  console.error('💥 Seed thất bại:', err);
  process.exit(1);
});
