import 'dotenv/config';
import { Client } from 'pg';
const c = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await c.connect();
  const r = await c.query('SELECT card_id, name, slug, image, arcana, suit FROM "Card" ORDER BY card_id');
  for (const row of r.rows) {
    console.log(`${row.card_id}|${row.slug}|${row.arcana}|${row.suit || 'none'}|${row.image || 'null'}`);
  }
  await c.end();
}
run();
