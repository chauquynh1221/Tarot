import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import { createSession } from '@/shared/lib/session-store';

// POST /api/reading/session — Create a new reading session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, cardCount } = body;

    if (!category || ![1, 3, 10].includes(cardCount)) {
      return NextResponse.json(
        { error: 'category (string) and cardCount (1, 3, or 10) are required' },
        { status: 400 }
      );
    }

    // Get all card IDs from DB
    const result = await pool.query(
      'SELECT card_id FROM "Card" ORDER BY card_id'
    );
    const cardIds: number[] = result.rows.map((r: any) => r.card_id);

    if (cardIds.length === 0) {
      return NextResponse.json({ error: 'No cards found in database' }, { status: 500 });
    }

    // Create session with Fisher-Yates shuffled deck
    const sessionId = createSession(cardIds, category.toUpperCase(), cardCount);

    return NextResponse.json({
      sessionId,
      totalCards: cardIds.length,
      cardCount,
      category: category.toUpperCase(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
