import { createClient } from '@supabase/supabase-js';

// Dùng untyped client vì reading_sessions chưa có trong Database type
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ============================================================
// Reading — Truy vấn phiên bói bài từ Supabase
// ============================================================

interface CreateReadingParams {
  userQuestion: string;
  selectedTopic: string;
  pickedCards: string;
  aiResponse: string;
}

/**
 * Lưu phiên bói bài mới
 */
export async function createReading(params: CreateReadingParams) {
  const { data, error } = await supabase
    .from('reading_sessions')
    .insert({
      user_question: params.userQuestion,
      selected_topic: params.selectedTopic,
      picked_cards: params.pickedCards,
      ai_response: params.aiResponse,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating reading session:', error.message);
    return null;
  }

  return data;
}

/**
 * Lấy lịch sử bói bài (mới nhất trước)
 */
export async function getReadingHistory(limit: number = 10) {
  const { data, error } = await supabase
    .from('reading_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching reading history:', error.message);
    return [];
  }

  return data ?? [];
}
