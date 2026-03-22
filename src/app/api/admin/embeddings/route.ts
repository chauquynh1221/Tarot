import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

const FPT_API_URL = 'https://mkp-api.fptcloud.com/v1/embeddings';
const MODEL = 'multilingual-e5-large';
const BATCH_SIZE = 20;

// GET — stats
export async function GET() {
  try {
    const total = await pool.query('SELECT COUNT(*) as count FROM "CardMeaning"');
    const withEmb = await pool.query('SELECT COUNT(*) as count FROM "CardMeaning" WHERE embedding IS NOT NULL');
    const without = await pool.query('SELECT COUNT(*) as count FROM "CardMeaning" WHERE embedding IS NULL');
    return NextResponse.json({
      total: parseInt(total.rows[0].count),
      withEmbedding: parseInt(withEmb.rows[0].count),
      withoutEmbedding: parseInt(without.rows[0].count),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — generate embeddings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const regenerateAll = body?.regenerateAll === true;

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    // If regenerate all, clear existing embeddings first
    if (regenerateAll) {
      await pool.query('UPDATE "CardMeaning" SET embedding = NULL');
    }

    // Get all meanings without embeddings, JOIN Card for name
    const result = await pool.query(
      `SELECT cm.id, cm.card_id, cm.category, cm.content, c.name as card_name
       FROM "CardMeaning" cm
       JOIN "Card" c ON c.card_id = cm.card_id
       WHERE cm.embedding IS NULL
       ORDER BY cm.id`
    );
    const meanings = result.rows;

    if (meanings.length === 0) {
      return NextResponse.json({ message: 'All meanings already have embeddings', updated: 0 });
    }

    let updated = 0;
    const errors: string[] = [];

    // Process in batches
    for (let i = 0; i < meanings.length; i += BATCH_SIZE) {
      const batch = meanings.slice(i, i + BATCH_SIZE);
      // Build rich text: "Card Name - Category: Content"
      const texts = batch.map((m: any) => `${m.card_name} - ${m.category}: ${m.content}`);

      try {
        const response = await fetch(FPT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            input: texts,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          errors.push(`Batch ${i / BATCH_SIZE + 1}: HTTP ${response.status} — ${errText}`);
          continue;
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
          errors.push(`Batch ${i / BATCH_SIZE + 1}: Invalid response format`);
          continue;
        }

        // Update each meaning with its embedding
        for (let j = 0; j < data.data.length; j++) {
          const embedding = data.data[j].embedding;
          const meaningId = batch[j].id;

          if (embedding && Array.isArray(embedding)) {
            const vectorStr = `[${embedding.join(',')}]`;
            await pool.query(
              'UPDATE "CardMeaning" SET embedding = $1::vector WHERE id = $2',
              [vectorStr, meaningId]
            );
            updated++;
          }
        }
      } catch (fetchErr: any) {
        errors.push(`Batch ${i / BATCH_SIZE + 1}: ${fetchErr.message}`);
      }

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < meanings.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      updated,
      total: meanings.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
