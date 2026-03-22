import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function fix() {
  await client.connect();
  
  // Set card_id = number for minor arcana cards that share the same number
  // We need unique card_id, so let's use the auto-generated id instead
  // First check what card_id values we have
  const check = await client.query('SELECT id, card_id, number, name FROM "Card" ORDER BY id LIMIT 5');
  console.log('Current state:');
  console.table(check.rows);

  // Update card_id to match the Card's id 
  const res = await client.query('UPDATE "Card" SET card_id = id');
  console.log('\nUpdated ' + res.rowCount + ' cards: card_id = id');

  // Verify
  const verify = await client.query('SELECT id, card_id, number, name FROM "Card" ORDER BY id LIMIT 5');
  console.log('\nAfter update:');
  console.table(verify.rows);

  await client.end();
}

fix().catch(e => { console.error(e); process.exit(1); });
