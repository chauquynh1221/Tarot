import { NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import pool from '@/shared/lib/db';
import { getSession } from '@/shared/lib/session-store';

// POST /api/reading/session/pick — Pick cards from a session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, indices } = body;

    if (!sessionId || !indices || !Array.isArray(indices)) {
      return NextResponse.json(
        { error: 'sessionId (string) and indices (number[]) are required' },
        { status: 400 }
      );
    }

    // Get session
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or expired. Please start a new reading.' },
        { status: 404 }
      );
    }

    // Validate indices
    if (indices.length !== session.cardCount) {
      return NextResponse.json(
        { error: `Expected ${session.cardCount} card(s), got ${indices.length}` },
        { status: 400 }
      );
    }

    for (const idx of indices) {
      if (idx < 0 || idx >= session.deck.length) {
        return NextResponse.json(
          { error: `Invalid index: ${idx}. Must be 0-${session.deck.length - 1}` },
          { status: 400 }
        );
      }
    }

    // Map indices to card IDs from shuffled deck
    const pickedCardIds = indices.map((idx: number) => session.deck[idx]);

    // Query card info + meanings for the selected category
    const cards = [];
    for (const cardId of pickedCardIds) {
      const cardResult = await pool.query(
        'SELECT card_id, name, name_vi, number, arcana, suit, image, slug, description FROM "Card" WHERE card_id = $1',
        [cardId]
      );

      const meaningResult = await pool.query(
        'SELECT category, content FROM "CardMeaning" WHERE card_id = $1 AND category = $2',
        [cardId, session.category]
      );

      // Also get GENERAL meaning as fallback
      let meaning = meaningResult.rows[0]?.content || '';
      if (!meaning) {
        const generalResult = await pool.query(
          'SELECT content FROM "CardMeaning" WHERE card_id = $1 AND category = \'GENERAL\'',
          [cardId]
        );
        meaning = generalResult.rows[0]?.content || '';
      }

      if (cardResult.rows[0]) {
        cards.push({
          ...cardResult.rows[0],
          meaning,
          category: session.category,
          isReversed: randomInt(0, 2) === 1, // 50/50 crypto-secure
        });
      }
    }

    return NextResponse.json({
      cards,
      category: session.category,
      cardCount: session.cardCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
