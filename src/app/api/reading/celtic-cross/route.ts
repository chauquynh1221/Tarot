import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import { randomUUID } from 'crypto';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

const CATEGORY_INSTRUCTIONS: Record<string, string> = {
  LOVE: 'Bạn là một Tarot Reader chuyên về hàn gắn và kết nối tâm hồn. Tập trung vào cảm xúc, mối quan hệ, rung động sâu kín.',
  CAREER: 'Bạn là một Tarot Reader chuyên về định hướng sự nghiệp. Tập trung vào cơ hội thăng tiến, phát triển, đồng nghiệp.',
  FINANCE: 'Bạn là một Tarot Reader am hiểu dòng chảy tiền bạc. Tập trung vào quản lý tài sản, đầu tư, thu nhập.',
  HEALTH: 'Bạn là một Tarot Reader chuyên năng lượng và chữa lành. Tập trung cân bằng thể chất-tinh thần. Không thay chẩn đoán y khoa.',
  GENERAL: 'Bạn là một Tarot Reader tri kỷ, đưa cái nhìn toàn cảnh năng lượng hiện tại bao quát mọi khía cạnh.',
  GROWTH: 'Bạn là một Tarot Reader dẫn dắt linh hồn. Tập trung bài học cuộc đời, trưởng thành nhận thức.',
  CREATIVE: 'Bạn là một Tarot Reader khơi nguồn cảm hứng. Tập trung sáng tạo, nghệ thuật, ý tưởng.',
};

const CATEGORY_NAMES: Record<string, string> = {
  LOVE: 'Tình Yêu', CAREER: 'Sự Nghiệp', FINANCE: 'Tài Chính',
  HEALTH: 'Sức Khỏe', GENERAL: 'Tổng Quan', GROWTH: 'Phát Triển', CREATIVE: 'Sáng Tạo',
};

const CELTIC_POSITIONS = [
  'Hiện Tại', 'Thách Thức', 'Nền Tảng', 'Quá Khứ', 'Khả Năng',
  'Tương Lai Gần', 'Bản Thân', 'Môi Trường', 'Hy Vọng & Sợ Hãi', 'Kết Quả',
];

interface CardInput {
  card_id: number;
  name: string;
  isReversed: boolean;
}

function buildSystemPrompt(category: string): string {
  const instruction = CATEGORY_INSTRUCTIONS[category] || CATEGORY_INSTRUCTIONS.GENERAL;
  const catName = CATEGORY_NAMES[category] || category;
  return `${instruction} Giải mã Celtic Cross 10 lá bài cho chủ đề ${catName}. Trả lời TIẾNG VIỆT.
Mỗi interpretation: 2-3 câu. overview/core_conflict/future_path: 2-3 câu. divine_advice: 1-2 câu. key_message: tối đa 12 từ.
Chỉ trả về JSON hợp lệ (không markdown). Mảng card_readings phải có ĐÚNG 10 phần tử:
{"card_readings":[{"position":1,"card_name":"...","interpretation":"..."}, ...10 items...],"synthesis":{"overview":"...","core_conflict":"...","future_path":"...","divine_advice":"...","key_message":"..."}}`;
}

// POST /api/reading/celtic-cross — Interpret all 10 cards at once
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards, category } = body;

    if (!cards || !Array.isArray(cards) || cards.length !== 10 || !category) {
      return NextResponse.json({ error: 'cards (10 items) and category are required' }, { status: 400 });
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    const cat = category.toUpperCase();

    // Fetch DB meanings for all 10 cards
    const cardIds = cards.map((c: CardInput) => c.card_id);
    const placeholders = cardIds.map((_: number, i: number) => `$${i + 1}`).join(',');

    const catResult = await pool.query(
      `SELECT card_id, content FROM "CardMeaning" WHERE card_id IN (${placeholders}) AND category = $${cardIds.length + 1}`,
      [...cardIds, cat]
    );
    const genResult = await pool.query(
      `SELECT card_id, content FROM "CardMeaning" WHERE card_id IN (${placeholders}) AND category = 'GENERAL'`,
      cardIds
    );

    const meaningMap = new Map<number, string>();
    for (const row of genResult.rows) meaningMap.set(row.card_id, row.content);
    for (const row of catResult.rows) meaningMap.set(row.card_id, row.content);

    // Build card list for prompt
    const cardsList = cards.map((c: CardInput, i: number) => {
      const orient = c.isReversed ? 'Ngược' : 'Xuôi';
      const meaning = meaningMap.get(c.card_id) || 'Không có dữ liệu';
      return `${i + 1}. ${c.name} (${CELTIC_POSITIONS[i]}, ${orient}): "${meaning}"`;
    }).join('\n');

    const systemPrompt = buildSystemPrompt(cat);
    const userPrompt = `Chủ đề: ${CATEGORY_NAMES[cat] || cat}\n\n${cardsList}`;

    // Call GPT with retry
    let lastError = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 90000); // 90s for 10-card analysis
        const response = await fetch(FPT_CHAT_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 1800,
            response_format: { type: 'json_object' },
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          lastError = `FPT API ${response.status}`;
          console.error(`Celtic Cross attempt ${attempt + 1} failed:`, lastError);
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          lastError = 'Empty response';
          if (attempt < 1) { await new Promise(r => setTimeout(r, 1500)); continue; }
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        // Parse JSON
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[1].trim());
          else {
            const braceMatch = content.match(/\{[\s\S]*\}/);
            if (braceMatch) parsed = JSON.parse(braceMatch[0]);
            else throw new Error('Could not parse JSON');
          }
        }

        // Log to DB: store DB query + prompt + AI response
        const cardNames = cards.map((c: CardInput) => `${c.name}${c.isReversed ? ' (Ngược)' : ''}`).join(', ');
        try {
          await pool.query(
            `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
            [randomUUID(), '[celtic-cross]', cat, cardNames, JSON.stringify({
              db_query_data: cards.map((c: CardInput, i: number) => ({
                card_id: c.card_id, name: c.name, position: CELTIC_POSITIONS[i],
                orientation: c.isReversed ? 'Ngược' : 'Xuôi',
                db_content: meaningMap.get(c.card_id) || 'Không có dữ liệu',
              })),
              prompt_sent: userPrompt,
              ai_result: parsed,
            })]
          );
        } catch (logErr) { console.error('Log save error:', logErr); }

        return NextResponse.json({ result: parsed });
      } catch (err: any) {
        lastError = err.message;
        console.error(`Celtic Cross attempt ${attempt + 1} error:`, lastError);
        if (attempt < 1) await new Promise(r => setTimeout(r, 1500));
      }
    }

    return NextResponse.json({ error: lastError }, { status: 502 });
  } catch (error: any) {
    console.error('celtic-cross error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
