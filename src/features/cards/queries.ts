import { supabase } from '@/shared/lib/supabase';
import type { TarotCardRow } from '@/shared/types/database.types';

// ============================================================
// Cards — Truy vấn lá bài từ Supabase
// ============================================================

/**
 * Lấy tất cả 78 lá bài, sắp xếp theo arcana (major trước) rồi number
 */
export async function getAllCards(): Promise<TarotCardRow[]> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .order('arcana', { ascending: true })
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching all cards:', error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Lấy 1 lá bài theo slug (dùng cho trang chi tiết)
 */
export async function getCardBySlug(slug: string): Promise<TarotCardRow | null> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching card by slug "${slug}":`, error.message);
    return null;
  }

  return data;
}

/**
 * Lấy tất cả 22 lá Major Arcana
 */
export async function getMajorArcana(): Promise<TarotCardRow[]> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('arcana', 'major')
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching major arcana:', error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Lấy lá bài theo suit (wands, cups, swords, pentacles)
 */
export async function getMinorBySuit(
  suit: 'wands' | 'cups' | 'swords' | 'pentacles'
): Promise<TarotCardRow[]> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .eq('suit', suit)
    .order('number', { ascending: true });

  if (error) {
    console.error(`Error fetching ${suit}:`, error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Lấy ngẫu nhiên N lá bài (dùng cho bói bài)
 */
export async function getRandomCards(
  count: number
): Promise<{ card: TarotCardRow; isReversed: boolean }[]> {
  const allCards = await getAllCards();

  // Fisher-Yates shuffle
  const shuffled = [...allCards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count).map((card) => ({
    card,
    isReversed: Math.random() < 0.3,
  }));
}

/**
 * Tìm kiếm lá bài theo tên hoặc keyword
 */
export async function searchCards(query: string): Promise<TarotCardRow[]> {
  const { data, error } = await supabase
    .from('tarot_cards')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('number', { ascending: true });

  if (error) {
    console.error(`Error searching cards for "${query}":`, error.message);
    return [];
  }

  return data ?? [];
}
