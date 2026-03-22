import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // Read all JSON files
  const dataDir = path.join(__dirname, 'cards-data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();
  
  let allCards: any[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const cards = JSON.parse(content);
    allCards = allCards.concat(cards);
  }

  console.log(`🌱 Tổng cộng ${allCards.length} lá bài cần insert...\n`);

  // Delete existing
  const { error: delErr } = await supabase
    .from('tarot_cards')
    .delete()
    .gte('number', 0);
  if (delErr) console.warn('⚠️ Xóa cũ:', delErr.message);

  // Insert in batches of 15
  const batch = 15;
  let ok = 0;
  for (let i = 0; i < allCards.length; i += batch) {
    const chunk = allCards.slice(i, i + batch).map(c => ({
      name: c.name_en,
      number: c.number,
      arcana: c.arcana,
      suit: c.suit,
      image: c.image,
      description: c.description,
      detailed_meaning: c.detailed_meaning,
      upright: c.upright,
      reversed: c.reversed,
      keywords: c.keywords,
      element: c.element,
      zodiac: c.zodiac,
      yes_no: c.yes_no,
      slug: c.slug,
    }));

    const { error } = await supabase.from('tarot_cards').insert(chunk);
    if (error) {
      console.error(`❌ Batch ${Math.floor(i/batch)+1}:`, error.message);
    } else {
      ok += chunk.length;
      console.log(`  ✅ ${ok}/${allCards.length}`);
    }
  }

  // Verify
  const { count } = await supabase
    .from('tarot_cards')
    .select('*', { count: 'exact', head: true });
  console.log(`\n🎴 Done! Total in DB: ${count}`);
}

seed().catch(e => { console.error(e); process.exit(1); });
