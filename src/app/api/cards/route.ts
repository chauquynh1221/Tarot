import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, card_id, name, number, arcana, suit, slug, image FROM "Card" ORDER BY id'
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
