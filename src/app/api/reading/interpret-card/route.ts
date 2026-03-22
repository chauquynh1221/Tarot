import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import { randomUUID } from 'crypto';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

const CATEGORY_INSTRUCTIONS: Record<string, string> = {
  LOVE: 'Bạn là một Tarot Reader chuyên về hàn gắn và kết nối tâm hồn. Hãy tập trung vào cảm xúc, sự tương tác giữa hai người và những rung động sâu kín nhất được phản ánh qua lá bài. Phân tích rõ thái độ của đối phương hoặc xu hướng của mối quan hệ.',
  CAREER: 'Bạn là một Tarot Reader chuyên về định hướng sự nghiệp. Hãy tập trung vào các cơ hội thăng tiến, lộ trình phát triển bản thân trong công việc, mối quan hệ đồng nghiệp và tiến độ của các dự án thực tế.',
  FINANCE: 'Bạn là một Tarot Reader am hiểu về dòng chảy tiền bạc. Hãy phân tích lá bài dựa trên tư duy quản lý tài sản, các cơ hội đầu tư, khả năng thu nhập và sự ổn định về mặt vật chất.',
  HEALTH: 'Bạn là một Tarot Reader chuyên về năng lượng và chữa lành. Hãy giải mã lá bài dựa trên trạng thái cân bằng giữa thể chất và tinh thần. Lưu ý: Chỉ đưa ra lời khuyên về mặt năng lượng, không thay thế chẩn đoán y khoa chuyên nghiệp.',
  GENERAL: 'Bạn là một Tarot Reader tri kỷ, đưa ra một cái nhìn toàn cảnh về năng lượng hiện tại của người tìm kiếm. Hãy chắt lọc những thông điệp quan trọng nhất bao quát mọi khía cạnh đời sống để định hướng cho họ.',
  GROWTH: 'Bạn là một Tarot Reader đóng vai trò người dẫn dắt linh hồn. Hãy phân tích lá bài dưới góc độ bài học cuộc đời, sự trưởng thành về nhận thức và những tiếng nói từ tiềm thức đang thúc đẩy bạn tiến lên.',
  CREATIVE: 'Bạn là một Tarot Reader khơi nguồn cảm hứng. Hãy tập trung vào khả năng sáng tạo, các ý tưởng nghệ thuật tiềm ẩn và cách để khai phá dòng chảy cảm hứng đang còn sơ khai hoặc bị tắc nghẽn.',
};

const CATEGORY_NAMES: Record<string, string> = {
  LOVE: 'Tình Yêu', CAREER: 'Sự Nghiệp', FINANCE: 'Tài Chính',
  HEALTH: 'Sức Khỏe', GENERAL: 'Tổng Quan', GROWTH: 'Phát Triển', CREATIVE: 'Sáng Tạo',
};

function buildSystemPrompt(category: string): string {
  const instruction = CATEGORY_INSTRUCTIONS[category] || CATEGORY_INSTRUCTIONS.GENERAL;
  return `${instruction}
Trả lời TIẾNG VIỆT. Chỉ trả về JSON hợp lệ (không markdown, không text thêm). Tuân thủ nghiêm giới hạn độ dài từng field:
{"card_name":"tên lá bài","orientation":"Xuôi|Ngược","summary":"tối đa 8 từ mô tả cốt lõi","analysis":"đúng 2 câu, mỗi câu dưới 25 từ","advice":"đúng 1 câu dưới 20 từ","affirmation":"đúng 1 câu dưới 12 từ"}`;
}

// POST /api/reading/interpret-card — Interpret a SINGLE card
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { card_id, name, isReversed, category, position } = body;

    if (!card_id || !name || !category) {
      return NextResponse.json({ error: 'card_id, name, and category are required' }, { status: 400 });
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    const cat = category.toUpperCase();
    const orientation = isReversed ? 'Ngược' : 'Xuôi';

    // Get meaning from DB — search by card name (card_id from frontend is a string slug like "major-0")
    let meaningResult = await pool.query(
      `SELECT cm.content FROM "CardMeaning" cm
       JOIN "Card" c ON c.card_id = cm.card_id
       WHERE LOWER(c.name) = LOWER($1) AND cm.category = $2
       LIMIT 1`,
      [name, cat]
    );
    if (meaningResult.rows.length === 0) {
      meaningResult = await pool.query(
        `SELECT cm.content FROM "CardMeaning" cm
         JOIN "Card" c ON c.card_id = cm.card_id
         WHERE LOWER(c.name) = LOWER($1) AND cm.category = 'GENERAL'
         LIMIT 1`,
        [name]
      );
    }
    const dbContent = meaningResult.rows[0]?.content || 'Không tìm thấy dữ liệu.';

    const systemPrompt = buildSystemPrompt(cat);
    const positionNote = position ? ` | Vị trí: ${position}` : '';
    const userPrompt = `Lá bài: ${name} | Trạng thái: ${orientation} | Chủ đề: ${CATEGORY_NAMES[cat] || cat}${positionNote}
Ý nghĩa gốc: "${dbContent}"`;

    // Call GPT with retry (max 2 attempts)
    let lastError = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 55000);
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
            response_format: { type: 'json_object' },
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          lastError = `FPT API ${response.status}: ${errText}`;
          console.error(`Attempt ${attempt + 1} failed for ${name}:`, lastError);
          if (attempt < 1) {
            await new Promise(r => setTimeout(r, 500)); // wait 0.5s before retry
            continue;
          }
          return NextResponse.json({
            card_id, name, isReversed, interpretation: null, error: lastError,
          });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          lastError = 'Empty response from model';
          if (attempt < 1) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          return NextResponse.json({
            card_id, name, isReversed, interpretation: null, error: lastError,
          });
        }

        // Parse JSON
        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch {
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[1].trim());
          } else {
            const braceMatch = content.match(/\{[\s\S]*\}/);
            if (braceMatch) {
              parsed = JSON.parse(braceMatch[0]);
            } else {
              throw new Error('Could not parse JSON');
            }
          }
        }

        // Log to DB: store DB query + prompt + AI response
        try {
          await pool.query(
            `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
            [randomUUID(), `[interpret-card] ${name}`, category, JSON.stringify({ card_id, name, isReversed }), JSON.stringify({
              db_query_data: { card_id, name, orientation, db_content: dbContent },
              prompt_sent: userPrompt,
              ai_result: parsed,
            })]
          );
        } catch (logErr) { console.error('Log save error:', logErr); }

        return NextResponse.json({
          card_id, name, isReversed, interpretation: parsed, error: null,
        });
      } catch (err: any) {
        lastError = err.message;
        console.error(`Attempt ${attempt + 1} error for ${name}:`, lastError);
        if (attempt < 1) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    return NextResponse.json({
      card_id, name, isReversed, interpretation: null, error: lastError,
    });
  } catch (error: any) {
    console.error('interpret-card error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
