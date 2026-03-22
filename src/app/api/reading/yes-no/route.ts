import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import { randomUUID } from 'crypto';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

const SYSTEM_PROMPT = `Tarot Reader quyết đoán. Trả lời TIẾNG VIỆT. Xuôi+tích cực=CÓ, Ngược+tiêu cực=KHÔNG, mâu thuẫn=CẦN CÂN NHẮC.
Chỉ trả về JSON hợp lệ (không markdown, không text thêm). Mỗi field phải ngắn gọn theo đúng yêu cầu:
{"answer":"CÓ|KHÔNG|CẦN CÂN NHẮC","confidence_score":78,"reasoning":"đúng 2 câu ngắn, mỗi câu dưới 20 từ","guidance":"đúng 2 câu ngắn, mỗi câu dưới 20 từ"}`;

// POST /api/reading/yes-no
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { card_id, name, isReversed, question } = body;

    if (!card_id || !name || !question) {
      return NextResponse.json({ error: 'card_id, name, and question are required' }, { status: 400 });
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    const orientation = isReversed ? 'Ngược' : 'Xuôi';

    // Get meaning from DB — search by card name (card_id from frontend is a string slug)
    let meaningResult = await pool.query(
      `SELECT cm.content FROM "CardMeaning" cm
       JOIN "Card" c ON c.card_id = cm.card_id
       WHERE LOWER(c.name) = LOWER($1) AND cm.category = 'GENERAL'
       LIMIT 1`,
      [name]
    );
    const dbContent = meaningResult.rows[0]?.content || '';

    const userPrompt = `Lá bài: ${name} | Trạng thái: ${orientation}
Ý nghĩa gốc: "${dbContent}"

Câu hỏi: "${question}"`;

    // Call GPT with retry
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
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.5,
            response_format: { type: 'json_object' },
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          lastError = `FPT API ${response.status}`;
          console.error(`Yes/No attempt ${attempt + 1} failed:`, lastError);
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          return NextResponse.json({ interpretation: null, error: lastError });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          lastError = 'Empty response';
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          return NextResponse.json({ interpretation: null, error: lastError });
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

        // Normalize confidence_score to number
        if (typeof parsed.confidence_score === 'string') {
          parsed.confidence_score = parseInt(parsed.confidence_score.replace('%', ''), 10);
        }

        // Log to DB: store DB query + prompt + AI response
        try {
          await pool.query(
            `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
            [randomUUID(), question, 'YES_NO', JSON.stringify({ card_id, name, isReversed }), JSON.stringify({
              db_query_data: { card_id, name, orientation, db_content: dbContent },
              prompt_sent: userPrompt,
              ai_result: parsed,
            })]
          );
        } catch (logErr) { console.error('Log save error:', logErr); }

        return NextResponse.json({ interpretation: parsed, error: null });
      } catch (err: any) {
        lastError = err.message;
        console.error(`Yes/No attempt ${attempt + 1} error:`, lastError);
        if (attempt < 1) await new Promise(r => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({ interpretation: null, error: lastError });
  } catch (error: any) {
    console.error('yes-no error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
