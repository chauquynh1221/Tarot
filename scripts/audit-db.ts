import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  const c = new Client(process.env.DATABASE_URL);
  await c.connect();

  // Card columns
  const cols = await c.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Card' ORDER BY ordinal_position`
  );
  console.log('=== Card columns ===');
  cols.rows.forEach((r: any) => console.log(' ', r.column_name, '-', r.data_type));

  // CardMeaning columns
  const mcols = await c.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'CardMeaning' ORDER BY ordinal_position`
  );
  console.log('\n=== CardMeaning columns ===');
  mcols.rows.forEach((r: any) => console.log(' ', r.column_name, '-', r.data_type));

  // Sample card
  const sample = await c.query(`SELECT * FROM "Card" WHERE card_id = 0`);
  console.log('\n=== Sample Card (The Fool) ===');
  const s = sample.rows[0];
  Object.keys(s).forEach(k => {
    if (k === 'embedding') return;
    console.log(' ', k, ':', typeof s[k] === 'string' && s[k].length > 100 ? s[k].substring(0, 100) + '...' : s[k]);
  });

  // Meanings for card_id = 0
  const meanings = await c.query(
    `SELECT category, LEFT(content, 120) as preview FROM "CardMeaning" WHERE card_id = 0 ORDER BY category`
  );
  console.log('\n=== CardMeaning for The Fool ===');
  meanings.rows.forEach((r: any) => console.log(' ', r.category, ':', r.preview));

  // Count distinct categories
  const cats = await c.query(`SELECT DISTINCT category FROM "CardMeaning" ORDER BY category`);
  console.log('\n=== All categories ===');
  cats.rows.forEach((r: any) => console.log(' ', r.category));

  // Total counts
  const cardCount = await c.query(`SELECT COUNT(*) as cnt FROM "Card"`);
  const meaningCount = await c.query(`SELECT COUNT(*) as cnt FROM "CardMeaning"`);
  console.log('\n=== Counts ===');
  console.log('  Cards:', cardCount.rows[0].cnt);
  console.log('  Meanings:', meaningCount.rows[0].cnt);

  await c.end();
}

main().catch(console.error);
