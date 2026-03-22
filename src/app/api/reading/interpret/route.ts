import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

// Category-specific instructions
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
  LOVE: 'Tình Yêu',
  CAREER: 'Sự Nghiệp',
  FINANCE: 'Tài Chính',
  HEALTH: 'Sức Khỏe',
  GENERAL: 'Tổng Quan',
  GROWTH: 'Phát Triển',
  CREATIVE: 'Sáng Tạo',
};

function buildSystemPrompt(category: string): string {
  const instruction = CATEGORY_INSTRUCTIONS[category] || CATEGORY_INSTRUCTIONS.GENERAL;
  return `[HỆ THỐNG - PERSONA]
${instruction}
Bạn sử dụng ngôn ngữ giàu hình ảnh, huyền bí nhưng thực tế để dẫn dắt người tìm kiếm.

[CHỈ THỊ XỬ LÝ]
1. Kết nối dữ liệu: Hãy dùng đúng văn phong và ý nghĩa trong "Nội dung ý nghĩa gốc" để trả lời.
2. Xử lý Trạng thái:
   - Nếu là XUÔI: Phát triển ý nghĩa theo hướng tích cực, trực diện, năng lượng phát tiết rõ ràng.
   - Nếu là NGƯỢC: Biến đổi nội dung gốc sang hướng năng lượng bị tắc nghẽn, trì hoãn, cường điệu hóa hoặc cần soi chiếu nội tâm (Shadow work).
3. Tuyệt đối không tự bịa ra ý nghĩa nằm ngoài phạm vi dữ liệu được cung cấp.

[QUY ĐỊNH ĐẦU RA (JSON)]
Trả về DUY NHẤT một khối JSON không kèm văn bản thừa:
{
  "card_name": "Tên lá bài",
  "orientation": "Xuôi hoặc Ngược",
  "summary": "Tóm tắt thông điệp trong 1 câu ngắn gọn",
  "analysis": "Phân tích sâu sự liên kết giữa lá bài, trạng thái xuôi/ngược và chủ đề",
  "advice": "Lời khuyên hành động thực tế dựa trên bối cảnh bài bốc được",
  "affirmation": "Câu khẳng định năng lượng tích cực"
}`;
}

function buildUserPrompt(cardName: string, category: string, orientation: string, content: string): string {
  return `[DỮ LIỆU GỐC TỪ DATABASE]
- Lá bài: ${cardName}
- Chủ đề: ${CATEGORY_NAMES[category] || category}
- Trạng thái: ${orientation}
- Nội dung ý nghĩa gốc: "${content}"

[CÂU HỎI CỦA NGƯỜI TÌM KIẾM]
"Hãy giải mã ý nghĩa lá bài ${cardName} trong chủ đề ${CATEGORY_NAMES[category] || category} cho tôi."`;
}

interface CardInput {
  card_id: number;
  name: string;
  isReversed: boolean;
}

// Call GPT for a single card
async function interpretCard(
  card: CardInput,
  category: string,
  dbContent: string,
  apiKey: string
): Promise<any> {
  const orientation = card.isReversed ? 'NGƯỢC (Reversed)' : 'XUÔI (Upright)';
  const systemPrompt = buildSystemPrompt(category);
  const userPrompt = buildUserPrompt(card.name, category, orientation, dbContent);

  const response = await fetch(FPT_CHAT_URL, {
    method: 'POST',
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
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI error for ${card.name}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Empty AI response for ${card.name}`);

  // Parse JSON
  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);
    throw new Error(`Could not parse AI response for ${card.name}`);
  }
}

// POST /api/reading/interpret — Batch interpret multiple cards in parallel
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards, category } = body;

    if (!cards || !Array.isArray(cards) || cards.length === 0 || !category) {
      return NextResponse.json(
        { error: 'cards (array of {card_id, name, isReversed}) and category are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    const cat = category.toUpperCase();

    // Fetch DB meanings for all cards in one query
    const cardIds = cards.map((c: CardInput) => c.card_id);
    const placeholders = cardIds.map((_: number, i: number) => `$${i + 1}`).join(',');

    const meaningsResult = await pool.query(
      `SELECT cm.card_id, cm.content
       FROM "CardMeaning" cm
       WHERE cm.card_id IN (${placeholders}) AND cm.category = $${cardIds.length + 1}`,
      [...cardIds, cat]
    );

    // Fallback to GENERAL if specific category not found
    const generalResult = await pool.query(
      `SELECT cm.card_id, cm.content
       FROM "CardMeaning" cm
       WHERE cm.card_id IN (${placeholders}) AND cm.category = 'GENERAL'`,
      cardIds
    );

    // Build meaning map: card_id → content
    const meaningMap = new Map<number, string>();
    for (const row of generalResult.rows) {
      meaningMap.set(row.card_id, row.content);
    }
    for (const row of meaningsResult.rows) {
      meaningMap.set(row.card_id, row.content); // Override with specific category
    }

    // Sequential GPT calls with stagger to avoid rate limiting
    const results = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as CardInput;
      const content = meaningMap.get(card.card_id) || 'Không tìm thấy dữ liệu.';
      try {
        const result = await interpretCard(card, cat, content, apiKey);
        results.push({ card_id: card.card_id, name: card.name, isReversed: card.isReversed, interpretation: result, error: null });
      } catch (err: any) {
        results.push({ card_id: card.card_id, name: card.name, isReversed: card.isReversed, interpretation: null, error: err.message });
      }
      // Small delay between calls to avoid rate limiting
      if (i < cards.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      category: cat,
      interpretations: results,
    });
  } catch (error: any) {
    console.error('Interpret error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
