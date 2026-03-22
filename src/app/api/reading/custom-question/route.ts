import { NextResponse } from 'next/server';
import pool from '@/shared/lib/db';
import { randomUUID } from 'crypto';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const FPT_EMBED_URL = 'https://mkp-api.fptcloud.com/v1/embeddings';
const CHAT_MODEL = 'gpt-oss-120b';
const EMBED_MODEL = 'multilingual-e5-large';

const SYSTEM_PROMPT = `Tarot Reader bậc thầy. Trả lời TIẾNG VIỆT. Kết nối 3 lá bài với câu hỏi của người dùng. positivity_score là số nguyên 0-100.
Chỉ trả về JSON hợp lệ (không markdown, không text thêm). Mỗi field ngắn gọn: focus_point tối đa 2 câu, storytelling_analysis tối đa 3 câu, các câu còn lại tối đa 1 câu:
{"user_question":"...","cards_readings":[{"name":"...","orientation":"Xuôi|Ngược","focus_point":"..."},{"name":"...","orientation":"...","focus_point":"..."},{"name":"...","orientation":"...","focus_point":"..."}],"synthesis":{"short_answer":"...","storytelling_analysis":"...","actionable_advice":"...","positivity_score":75},"affirmation":"..."}`;

interface CardInput {
  card_id: number | string;
  name: string;
  isReversed: boolean;
}

// POST /api/reading/custom-question
export async function POST(request: Request) {
  const logId = randomUUID();
  let logSaved = false;

  const saveLog = async (aiResult: any, userPrompt: string, dbQueryData: any[], cardNames: string, question: string) => {
    if (logSaved) return;
    logSaved = true;
    try {
      await pool.query(
        `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [logId, question || '(empty)', 'CUSTOM_QUESTION', cardNames || '(unknown)', JSON.stringify({
          db_query_data: dbQueryData,
          prompt_sent: userPrompt,
          ai_result: aiResult,
        })]
      );
      console.log('[custom-question] Log saved:', logId);
    } catch (logErr: any) {
      console.error('[custom-question] Log save FAILED:', logErr.message);
    }
  };

  try {
    const body = await request.json();
    const { question, cards } = body;

    console.log('[custom-question] Request received. question:', question, 'cards count:', cards?.length);

    if (!question || !cards || !Array.isArray(cards) || cards.length !== 3) {
      console.error('[custom-question] Validation failed:', { question: !!question, cardsLen: cards?.length });
      return NextResponse.json({ error: 'question and cards (3 items) are required' }, { status: 400 });
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    // Step 1: Embed the user question
    let questionEmbedding: number[] | null = null;
    try {
      const embedRes = await fetch(FPT_EMBED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: EMBED_MODEL, input: [question] }),
      });
      if (embedRes.ok) {
        const embedData = await embedRes.json();
        questionEmbedding = embedData.data?.[0]?.embedding;
      } else {
        console.error('[custom-question] Embed API failed:', embedRes.status);
      }
    } catch (err) {
      console.error('[custom-question] Embedding error:', err);
    }

    // Step 2: Vector search — get best matching DB content per card (search by NAME via JOIN)
    const cardContexts: Record<string, string> = {};

    if (questionEmbedding && Array.isArray(questionEmbedding)) {
      const vectorStr = `[${questionEmbedding.join(',')}]`;
      for (const card of cards) {
        try {
          const result = await pool.query(
            `SELECT cm.content, cm.category, 1 - (cm.embedding <=> $1::vector) as similarity
             FROM "CardMeaning" cm
             JOIN "Card" c ON c.card_id = cm.card_id
             WHERE LOWER(c.name) = LOWER($2) AND cm.embedding IS NOT NULL
             ORDER BY cm.embedding <=> $1::vector
             LIMIT 1`,
            [vectorStr, card.name]
          );
          if (result.rows.length > 0) {
            cardContexts[card.name] = result.rows[0].content;
            console.log(`[custom-question] Vector match "${card.name}": sim=${result.rows[0].similarity?.toFixed(3)}, cat=${result.rows[0].category}`);
          }
        } catch (err: any) {
          console.error(`[custom-question] Vector search error for "${card.name}":`, err.message);
        }
      }
    }

    // Fallback: GENERAL meaning for cards without vector match (search by name)
    const missingCards = cards.filter((c: CardInput) => !cardContexts[c.name]);
    if (missingCards.length > 0) {
      try {
        for (const card of missingCards) {
          const fallback = await pool.query(
            `SELECT cm.content FROM "CardMeaning" cm
             JOIN "Card" c ON c.card_id = cm.card_id
             WHERE LOWER(c.name) = LOWER($1) AND cm.category = 'GENERAL'
             LIMIT 1`,
            [card.name]
          );
          if (fallback.rows.length > 0) {
            cardContexts[card.name] = fallback.rows[0].content;
          }
        }
        console.log(`[custom-question] After fallback, contexts found: ${Object.keys(cardContexts).join(', ')}`);
      } catch (err: any) {
        console.error('[custom-question] Fallback DB error:', err.message);
      }
    }

    // Step 3: Build prompt
    const cardsList = cards.map((c: CardInput, i: number) => {
      const orient = c.isReversed ? 'Ngược' : 'Xuôi';
      const context = cardContexts[c.name] || 'Dữ liệu không tìm thấy';
      return `Lá ${i + 1}: ${c.name} (${orient})\nÝ nghĩa từ DB: "${context}"`;
    }).join('\n\n');

    const userPrompt = `Câu hỏi của người dùng: "${question}"\n\n${cardsList}`;

    const cardNames = cards.map((c: CardInput) => `${c.name}${c.isReversed ? ' (Ngược)' : ''}`).join(', ');
    const dbQueryData = cards.map((c: CardInput) => ({
      card_id: c.card_id,
      name: c.name,
      orientation: c.isReversed ? 'Ngược' : 'Xuôi',
      db_content: cardContexts[c.name] || 'Không tìm thấy',
    }));

    console.log('[custom-question] DB contexts found for:', Object.keys(cardContexts));

    // Step 4: Call GPT — force JSON output
    let lastError = '';
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[custom-question] GPT attempt ${attempt + 1}...`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);
        const response = await fetch(FPT_CHAT_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: CHAT_MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 700,
            response_format: { type: 'json_object' },
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          lastError = `FPT API ${response.status}: ${await response.text()}`;
          console.error(`[custom-question] GPT error:`, lastError);
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          await saveLog({ error: lastError }, userPrompt, dbQueryData, cardNames, question);
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        console.log('[custom-question] GPT raw content:', content?.substring(0, 100));

        if (!content) {
          lastError = 'Empty response from GPT';
          if (attempt < 1) { await new Promise(r => setTimeout(r, 1500)); continue; }
          await saveLog({ error: lastError }, userPrompt, dbQueryData, cardNames, question);
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        // Parse JSON (should always succeed with response_format: json_object)
        let parsed: any = null;
        try {
          parsed = JSON.parse(content);
        } catch {
          // Try to extract JSON from markdown
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            try { parsed = JSON.parse(match[0]); } catch {}
          }
        }

        if (parsed) {
          console.log('[custom-question] Parsed OK, saving log...');
          await saveLog(parsed, userPrompt, dbQueryData, cardNames, question);
          return NextResponse.json({ result: parsed });
        }

        lastError = 'JSON parse failed';
        console.error('[custom-question] Parse failed. Raw:', content?.substring(0, 200));
        if (attempt < 1) { await new Promise(r => setTimeout(r, 1500)); continue; }

        const fallbackResult = {
          user_question: question,
          cards_readings: cards.map((c: CardInput) => ({
            name: c.name,
            orientation: c.isReversed ? 'Ngược' : 'Xuôi',
            focus_point: 'Thông điệp từ lá bài này đang chờ bạn khám phá trong tĩnh lặng.',
          })),
          synthesis: {
            short_answer: 'Hãy lắng nghe trực giác của bạn.',
            storytelling_analysis: 'Vũ trụ đang gửi thông điệp thông qua 3 lá bài này. Hãy ngồ lặng và cảm nhận năng lượng mà mỗi lá mang lại.',
            actionable_advice: 'Hãy tin tưởng vào hành trình của bạn và đưa ra quyết định dựa trên trực giác.',
            positivity_score: 65,
          },
          affirmation: 'Ánh sáng bên trong bạn luôn soi đường.',
        };
        await saveLog(fallbackResult, userPrompt, dbQueryData, cardNames, question);
        return NextResponse.json({ result: fallbackResult });

      } catch (err: any) {
        lastError = err.message;
        console.error(`[custom-question] Attempt ${attempt + 1} threw:`, lastError);
        if (attempt < 1) await new Promise(r => setTimeout(r, 1500));
      }
    }

    await saveLog({ error: lastError }, userPrompt, dbQueryData, cardNames, question);
    return NextResponse.json({ error: lastError }, { status: 502 });

  } catch (error: any) {
    console.error('[custom-question] Outer error:', error.message);
    // Best-effort log save even on unexpected errors
    try {
      await pool.query(
        `INSERT INTO "ReadingSession" (id, user_question, selected_topic, picked_cards, ai_response, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [logId, '(error)', 'CUSTOM_QUESTION', '(unknown)', JSON.stringify({ error: error.message })]
      );
    } catch {}
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
