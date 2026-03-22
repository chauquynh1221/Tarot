import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT id, card_id, category, content FROM "CardMeaning" WHERE card_id = $1 ORDER BY id',
      [parseInt(id)]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cardId = parseInt(id);
  try {
    const body = await request.json();
    const meanings: { category: string; content: string }[] = body.meanings;

    if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
      return NextResponse.json({ error: 'meanings array is required' }, { status: 400 });
    }

    const inserted = [];
    for (const m of meanings) {
      if (!m.category || !m.content) continue;
      const result = await pool.query(
        'INSERT INTO "CardMeaning" (card_id, category, content) VALUES ($1, $2, $3) RETURNING id, card_id, category, content',
        [cardId, m.category.toUpperCase(), m.content]
      );
      inserted.push(result.rows[0]);
    }

    return NextResponse.json({ inserted, count: inserted.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const meaningId = body.meaningId;
    
    if (meaningId) {
      await pool.query('DELETE FROM "CardMeaning" WHERE id = $1 AND card_id = $2', [meaningId, parseInt(id)]);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
