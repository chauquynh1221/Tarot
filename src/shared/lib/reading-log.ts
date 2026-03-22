import pool from '@/shared/lib/db';
import { randomUUID } from 'crypto';

/**
 * Save a reading session log to the ReadingSession table.
 * Non-blocking — errors are logged but don't affect the response.
 */
export async function saveReadingLog(params: {
  userQuestion: string;
  selectedTopic: string;
  pickedCards: string;
  aiResponse: string;
}) {
  try {
    const id = randomUUID();
    await pool.query(
      `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [id, params.userQuestion, params.selectedTopic, params.pickedCards, params.aiResponse]
    );
  } catch (err) {
    console.error('Failed to save reading log:', err);
  }
}
