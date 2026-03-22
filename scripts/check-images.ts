import 'dotenv/config';
import { Client } from 'pg';
import * as fs from 'fs';

const c = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await c.connect();
  const r = await c.query('SELECT slug FROM "Card" ORDER BY card_id');
  const dbSlugs: string[] = r.rows.map((row: any) => row.slug);
  const files = fs.readdirSync('public/images/cards').map(f => f.replace('.jpg', ''));
  
  const missing = dbSlugs.filter(s => !files.includes(s));
  const extra = files.filter(f => !dbSlugs.includes(f));
  
  console.log('DB cards:', dbSlugs.length);
  console.log('Files:', files.length);
  console.log('Missing files:', missing.length > 0 ? missing : 'NONE');
  console.log('Extra files:', extra.length > 0 ? extra : 'NONE');
  await c.end();
}
run();
