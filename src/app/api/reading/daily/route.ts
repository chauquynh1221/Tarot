import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

const SYSTEM_PROMPT = `[ROLE] 
Bạn là một Tarot Reader tinh tế. Hãy giải mã lá bài ngày cho người dùng.

[YÊU CẦU]
Dựa trên ý nghĩa gốc của lá bài VÀ trạng thái xuôi/ngược, hãy viết một bản tin dự báo ngày mới ngắn gọn:
1. Tổng quan: Năng lượng chủ đạo của hôm nay (Tích cực/Cần thận trọng).
2. Chi tiết: Một lời khuyên cho Công việc và một lời nhắn cho Tình cảm.
3. Thông điệp khóa: Một câu khẳng định (Affirmation) để người dùng mang theo.

LƯU Ý QUAN TRỌNG:
- Nếu lá bài ở vị trí XUÔI (Upright): tập trung vào ý nghĩa tích cực, thuận lợi.
- Nếu lá bài ở vị trí NGƯỢC (Reversed): tập trung vào bài học, cảnh báo nhẹ nhàng, và cách vượt qua. Không dọa người dùng.

[TONE] 
Truyền cảm hứng, nhẹ nhàng, không dùng từ ngữ quá nặng nề.

[OUTPUT FORMAT]
Trả về JSON THUẦN, không markdown, không code block. Đúng format:
{
  "ten_la_bai": "Tên lá bài tiếng Việt",
  "nang_luong_ngay": "Tích cực | Cần thận trọng | Trung tính",
  "mo_dau": "1 câu tóm gọn vibe của ngày hôm nay",
  "chi_tiet": {
    "cong_viec": "Dự báo và lời khuyên về hành động trong công việc/học tập",
    "tinh_cam": "Thông điệp về cách ứng xử trong các mối quan hệ"
  },
  "loi_nhan_chot": "Một câu khẳng định ngắn gọn (Affirmation) truyền động lực"
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, isReversed } = body;

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const reversed = isReversed === true;

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    // Get card info + GENERAL meaning from DB
    const cardResult = await pool.query(
      `SELECT c.name, c.description, c.detailed_meaning,
              cm.content as general_meaning
       FROM "Card" c
       LEFT JOIN "CardMeaning" cm ON c.card_id = cm.card_id AND cm.category = 'GENERAL'
       WHERE c.slug = $1
       LIMIT 1`,
      [slug]
    );

    if (cardResult.rows.length === 0) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const card = cardResult.rows[0];
    const cardContent = card.general_meaning || card.detailed_meaning || card.description;

    // Call LLM
    const position = reversed ? 'NGƯỢC (Reversed)' : 'XUÔI (Upright)';
    const userPrompt = `[DỮ LIỆU GỐC]\nLá bài: ${card.name}\nVị trí: ${position}\nÝ nghĩa: ${cardContent}`;

    const response = await fetch(FPT_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('FPT AI error:', errText);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // Parse JSON from AI response (handle possible markdown code blocks)
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try finding JSON object in the response
        const braceMatch = content.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          parsed = JSON.parse(braceMatch[0]);
        } else {
          return NextResponse.json({ error: 'Could not parse AI response', raw: content }, { status: 502 });
        }
      }
    }

    return NextResponse.json({
      card_name: card.name,
      card_slug: slug,
      isReversed: reversed,
      reading: parsed,
    });
  } catch (error: any) {
    console.error('Daily reading error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
