import { NextResponse } from 'next/server';

const FPT_CHAT_URL = 'https://mkp-api.fptcloud.com/v1/chat/completions';
const MODEL = 'gpt-oss-120b';

const SYSTEM_PROMPT = `Tarot Reader bậc thầy. Trả lời TIẾNG VIỆT. Xâu chuỗi các lá bài thành câu chuyện mạch lạc. Không lặp lại phân tích từng lá riêng lẻ.
Chỉ trả về JSON hợp lệ (không markdown, không text thêm). Tuân thủ nghiêm giới hạn:
{"overall_theme":"đúng 5-8 từ, cô đọng chủ đề","narrative":"đúng 3-4 câu xâu chuỗi, mỗi câu dưới 30 từ","combined_advice":"đúng 1-2 câu dưới 25 từ","final_thought":"đúng 1 câu dưới 15 từ"}`;


interface CardInterpretation {
  card_name: string;
  position?: string;
  orientation: string;
  summary: string;
  analysis: string;
}

function tryParseJSON(content: string): any {
  // Try direct parse
  try { return JSON.parse(content); } catch {}

  // Try code block
  const codeMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) {
    try { return JSON.parse(codeMatch[1].trim()); } catch {}
  }

  // Try brace match
  const braceMatch = content.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]); } catch {}
  }

  return null;
}

// POST /api/reading/synthesis
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards, category } = body;

    if (!cards || !Array.isArray(cards) || cards.length < 2 || !category) {
      return NextResponse.json(
        { error: 'cards (array of interpretations) and category are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.FPT_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'FPT_AI_API_KEY not configured' }, { status: 500 });
    }

    const cardsList = cards.map((c: CardInterpretation, i: number) => {
      const pos = c.position || `Lá ${i + 1}`;
      return `${i + 1}. ${c.card_name} (${pos}, ${c.orientation}): ${c.summary}`;
    }).join('\n');

    const userPrompt = `Chủ đề: ${category} | ${cards.length} lá bài:
${cardsList}

Hãy xâu chuỗi thành bức tranh tổng thể.`;

    // Retry up to 2 times
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
            temperature: 0.7,
            max_tokens: cards.length >= 8 ? 700 : 450,
            response_format: { type: 'json_object' },
          }),
        });
        clearTimeout(timeout);

        if (!response.ok) {
          lastError = `FPT API ${response.status}`;
          console.error(`Synthesis attempt ${attempt + 1} failed:`, lastError);
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          lastError = 'Empty response';
          if (attempt < 1) { await new Promise(r => setTimeout(r, 500)); continue; }
          return NextResponse.json({ error: lastError }, { status: 502 });
        }

        const parsed = tryParseJSON(content);
        if (parsed) {
          return NextResponse.json({ synthesis: parsed });
        }

        // Could not parse — retry
        lastError = 'Could not parse JSON';
        console.error(`Synthesis attempt ${attempt + 1}: parse failed. Raw:`, content.substring(0, 300));
        if (attempt < 1) { await new Promise(r => setTimeout(r, 1000)); continue; }

        // Final fallback: return raw content as narrative
        return NextResponse.json({
          synthesis: {
            overall_theme: 'Thông điệp từ vũ trụ',
            narrative: content.replace(/```[\s\S]*?```/g, '').replace(/[{}"\[\]]/g, '').trim().substring(0, 500),
            combined_advice: 'Hãy lắng nghe trực giác của bạn.',
            final_thought: 'Mọi con đường đều dẫn đến ánh sáng.',
          },
        });
      } catch (err: any) {
        lastError = err.message;
        console.error(`Synthesis attempt ${attempt + 1} error:`, lastError);
        if (attempt < 1) await new Promise(r => setTimeout(r, 1000));
      }
    }

    return NextResponse.json({ error: lastError }, { status: 502 });
  } catch (error: any) {
    console.error('Synthesis error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
