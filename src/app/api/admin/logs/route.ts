import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

// GET /api/admin/logs — List reading session logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const topic = searchParams.get('topic') || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (topic) {
      params.push(topic);
      whereClause = `WHERE selected_topic = $${params.length}`;
    }

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM "ReadingSession" ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch logs
    const logsResult = await pool.query(
      `SELECT id, user_question, selected_topic, picked_cards, ai_response, created_at
       FROM "ReadingSession" ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      logs: logsResult.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/logs — Clear all logs
export async function DELETE() {
  try {
    const result = await pool.query('DELETE FROM "ReadingSession"');
    return NextResponse.json({ deleted: result.rowCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
