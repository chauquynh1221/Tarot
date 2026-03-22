'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getRandomCards, type TarotCard } from '@/features/cards';

type Phase = 'ask' | 'drawing' | 'interpreting' | 'result';

interface CardDraw {
  card: TarotCard;
  isReversed: boolean;
}

interface AIResult {
  user_question: string;
  cards_readings: { name: string; orientation: string; focus_point: string }[];
  synthesis: {
    short_answer: string;
    storytelling_analysis: string;
    actionable_advice: string;
    positivity_score: number;
  };
  affirmation: string;
}

const POSITION_LABELS = ['Quá Khứ / Nền Tảng', 'Hiện Tại / Tình Huống', 'Tương Lai / Hướng Đi'];
const POSITION_ICONS = ['🕰️', '⚡', '🔮'];

export default function CustomQuestionPage() {
  const [phase, setPhase] = useState<Phase>('ask');
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<CardDraw[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Draw 3 cards and start reveal animation
  const handleSubmit = () => {
    if (!question.trim()) return;
    const cards = getRandomCards(3);
    setDrawnCards(cards);
    setRevealedCount(0);
    setPhase('drawing');

    // Reveal cards one by one
    setTimeout(() => setRevealedCount(1), 800);
    setTimeout(() => setRevealedCount(2), 1600);
    setTimeout(() => {
      setRevealedCount(3);
      // Move to interpreting after last card reveal
      setTimeout(() => setPhase('interpreting'), 1200);
    }, 2400);
  };

  // Call custom-question API
  const fetchInterpretation = useCallback(async () => {
    if (drawnCards.length !== 3) return;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/reading/custom-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cards: drawnCards.map(d => ({
            card_id: d.card.id,
            name: d.card.name,
            isReversed: d.isReversed,
          })),
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.result) {
        setAiResult(data.result);
      } else {
        console.error('Custom question API error:', data.error || 'No result');
        // Fallback so user sees something meaningful
        setAiResult({
          user_question: question,
          cards_readings: drawnCards.map(d => ({
            name: d.card.name,
            orientation: d.isReversed ? 'Ngược' : 'Xuôi',
            focus_point: 'Vũ trụ đang mang thông điệp riêng cho bạn theo năng lượng lá bài này.',
          })),
          synthesis: {
            short_answer: 'Vũ trụ đang kết nối — hãy lắng nghe trực giác của bạn.',
            storytelling_analysis: `Ba lá bài ${drawnCards.map(d => d.card.name).join(', ')} cùng nhau tạo nên một thông điệp sâu sắc về câu hỏi của bạn. Hãy ngồi lặng và cảm nhận năng lượng mà mỗi lá mang lại.`,
            actionable_advice: 'Hãy tin tưởng vào hành trình của bạn và hành động dựa trên trực giác.',
            positivity_score: 65,
          },
          affirmation: 'Tôi tin tưởng vào sự dẫn dắt của vũ trụ.',
        });
      }
    } catch (err: any) {
      console.error('Custom question error:', err);
      // Fallback on any error (timeout, network, etc.)
      setAiResult({
        user_question: question,
        cards_readings: drawnCards.map(d => ({
          name: d.card.name,
          orientation: d.isReversed ? 'Ngược' : 'Xuôi',
          focus_point: 'Thông điệp từ lá bài này đang chờ bạn khám phá trong tĩnh lặng.',
        })),
        synthesis: {
          short_answer: 'Kết nối với vũ trụ đang hình thành.',
          storytelling_analysis: `Các lá bài ${drawnCards.map(d => d.card.name).join(', ')} đang nói chuyện với nhau về câu hỏi của bạn. Hãy lắng nghe tiếng nói bên trong.`,
          actionable_advice: 'Kiên nhẫn và tin tưởng — câu trả lời sẽ đến đúng lúc.',
          positivity_score: 60,
        },
        affirmation: 'Mọi điều diễn ra đều có lý do của nó.',
      });
    } finally {
      setLoading(false);
      setPhase('result');
    }
  }, [drawnCards, question]);


  // Auto-fetch when entering interpreting phase
  useEffect(() => {
    if (phase === 'interpreting' && drawnCards.length === 3 && !aiResult) {
      fetchInterpretation();
    }
  }, [phase, drawnCards, aiResult, fetchInterpretation]);

  const handleReset = () => {
    setPhase('ask');
    setQuestion('');
    setDrawnCards([]);
    setRevealedCount(0);
    setAiResult(null);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return 'var(--gold-400)';
    return '#ef4444';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '✨';
    if (score >= 40) return '🌙';
    return '🌑';
  };

  const phaseIndex = ['ask', 'drawing', 'interpreting', 'result'].indexOf(phase);

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '40px 24px', minHeight: '85vh', position: 'relative', zIndex: 1 }}>
      {/* Progress Bar */}
      <div className="progress-bar">
        {['Đặt câu hỏi', 'Bốc bài', 'Giải mã', 'Kết quả'].map((step, i) => (
          <div key={step} className="progress-step">
            <div className={`progress-dot ${phaseIndex > i ? 'done' : phaseIndex === i ? 'active' : ''}`}>
              {phaseIndex > i ? '✓' : i + 1}
            </div>
            {i < 3 && <div className={`progress-line ${phaseIndex > i ? 'active' : ''}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ========== PHASE 1: ASK ========== */}
        {phase === 'ask' && (
          <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', paddingTop: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
              🔮 Hỏi Vũ Trụ
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 36px' }}>
              Đặt câu hỏi bất kỳ — vũ trụ sẽ tự bốc 3 lá bài và tìm câu trả lời phù hợp nhất cho bạn.
            </p>

            <div style={{ marginBottom: '28px' }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="VD: Tháng này tôi có tìm được người yêu không? / Tôi nên chuyển việc bây giờ hay đợi thêm?..."
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '12px',
                  background: 'rgba(147, 122, 216, 0.06)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical', minHeight: '120px',
                  fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--purple-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button onClick={handleSubmit} className="btn-primary" disabled={!question.trim()}
              style={{ opacity: question.trim() ? 1 : 0.4, padding: '14px 44px', fontSize: '1.05rem' }}>
              Gửi Câu Hỏi ✦
            </button>
          </motion.div>
        )}

        {/* ========== PHASE 2: DRAWING — Reveal cards one by one ========== */}
        {phase === 'drawing' && (
          <motion.div key="drawing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>Câu hỏi của bạn:</p>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '32px', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
              &ldquo;{question}&rdquo;
            </p>

            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--gold-400)', marginBottom: '28px' }}>
              ✦ Vũ Trụ Đang Bốc Bài Cho Bạn ✦
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
              {drawnCards.map((drawn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.7, rotateY: 180 }}
                  animate={revealedCount > i
                    ? { opacity: 1, y: 0, scale: 1, rotateY: 0 }
                    : { opacity: 0.3, y: 20, scale: 0.85, rotateY: 180 }
                  }
                  transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
                  style={{ textAlign: 'center' }}
                >
                  {/* Position label */}
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                    {POSITION_ICONS[i]} {POSITION_LABELS[i]}
                  </p>
                  <div style={{
                    width: '160px', height: '267px', borderRadius: '12px', overflow: 'hidden',
                    position: 'relative', border: '2px solid var(--border-gold)',
                    boxShadow: revealedCount > i ? '0 8px 40px rgba(200,164,85,0.35)' : '0 4px 16px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 0.5s',
                  }}>
                    {revealedCount > i ? (
                      <Image src={drawn.card.image} alt={drawn.card.name} fill
                        style={{ objectFit: 'cover', transform: drawn.isReversed ? 'rotate(180deg)' : 'none' }}
                        unoptimized />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, #1a1a3e, #0d0d2b)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '2.5rem' }}>✦</span>
                      </div>
                    )}
                  </div>
                  {revealedCount > i && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '10px' }}>
                      <p style={{ fontFamily: 'var(--font-title)', fontSize: '0.9rem', color: 'var(--gold-300)', fontWeight: 600 }}>
                        {drawn.card.name}
                      </p>
                      <span style={{ color: drawn.isReversed ? '#e8a090' : 'var(--teal-300)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {drawn.isReversed ? '⟳ Ngược' : '↑ Xuôi'}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {revealedCount < 3 && (
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: 'var(--gold-500)', marginTop: '32px', fontSize: '0.9rem' }}
              >
                ✦ Đang bốc lá bài {revealedCount + 1}/3... ✦
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ========== PHASE 3: INTERPRETING ========== */}
        {phase === 'interpreting' && (
          <motion.div key="interpreting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 32px' }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200, 164, 85, 0.5) 0%, rgba(200, 164, 85, 0) 70%)',
                  boxShadow: '0 0 50px rgba(200, 164, 85, 0.3)',
                }}
              />
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', transformOrigin: 'center' }}>
                  <div style={{
                    position: 'absolute', top: `${15 + i * 8}%`, left: '50%',
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--gold-400)' : 'var(--teal-300)',
                    boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--gold-glow)' : 'rgba(100, 180, 255, 0.5)'}`,
                  }} />
                </motion.div>
              ))}
              {/* Mini card fan */}
              {drawnCards.slice(0, 3).map((d, i) => (
                <motion.div key={i}
                  animate={{ y: [0, -8, 0], rotate: [(i - 1) * 15, (i - 1) * 18, (i - 1) * 15] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: '45px', height: '75px', borderRadius: '5px', overflow: 'hidden',
                    border: '1px solid rgba(200, 164, 85, 0.3)', boxShadow: '0 3px 15px rgba(0,0,0,0.4)',
                    transformOrigin: 'bottom center', marginLeft: '-22px', marginTop: '-55px',
                  }}>
                  <Image src={d.card.image} alt="" fill style={{ objectFit: 'cover', opacity: 0.6 }} unoptimized />
                </motion.div>
              ))}
            </div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '10px' }}>
              ✦ Đang Tìm Kiếm Câu Trả Lời ✦
            </motion.h2>

            <motion.p
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', lineHeight: 1.7 }}>
              Vũ trụ đang kết nối câu hỏi của bạn với năng lượng 3 lá bài...
            </motion.p>
          </motion.div>
        )}

        {/* ========== PHASE 4: RESULT ========== */}
        {phase === 'result' && drawnCards.length === 3 && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '750px', margin: '0 auto' }}>

            {/* Question */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Câu hỏi:</p>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6 }}>
                &ldquo;{question}&rdquo;
              </p>
            </div>

            {/* Short Answer — big highlight box */}
            {aiResult?.synthesis?.short_answer && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{
                  textAlign: 'center', marginBottom: '32px', padding: '24px',
                  background: 'rgba(200, 164, 85, 0.08)', borderRadius: '14px',
                  border: '1px solid rgba(200, 164, 85, 0.25)',
                }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  CÂU TRẢ LỜI TỪ VŨ TRỤ
                </p>
                <p style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--gold-400)', lineHeight: 1.5, fontWeight: 700 }}>
                  {aiResult.synthesis.short_answer}
                </p>
                {aiResult.synthesis.positivity_score != null && (
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{getScoreEmoji(aiResult.synthesis.positivity_score)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Năng lượng tích cực:</span>
                    <div style={{
                      width: '120px', height: '8px', borderRadius: '4px',
                      background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${aiResult.synthesis.positivity_score}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${getScoreColor(aiResult.synthesis.positivity_score)}, ${getScoreColor(aiResult.synthesis.positivity_score)}aa)`,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '0.85rem', fontWeight: 700,
                      color: getScoreColor(aiResult.synthesis.positivity_score),
                    }}>
                      {aiResult.synthesis.positivity_score}%
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ===== 3 CARDS — DETAILED ===== */}
            <h3 style={{
              fontFamily: 'var(--font-title)', fontSize: '1.15rem', color: 'var(--gold-400)',
              marginBottom: '16px', textAlign: 'center',
            }}>
              🃏 Giải Nghĩa Từng Lá Bài
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {drawnCards.map((drawn, i) => {
                const aiCard = aiResult?.cards_readings?.[i];
                const keywords = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                    style={{
                      background: 'rgba(200, 164, 85, 0.04)', border: '1px solid rgba(200, 164, 85, 0.15)',
                      borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden',
                    }}>
                    {/* Position accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-gold)' }} />

                    <div style={{ display: 'flex', gap: '20px' }}>
                      {/* Card image — BIG */}
                      <div style={{
                        width: '110px', height: '183px', borderRadius: '10px', overflow: 'hidden',
                        flexShrink: 0, position: 'relative', border: '2px solid var(--border-gold)',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.35)',
                      }}>
                        <Image src={drawn.card.image} alt={drawn.card.name} fill
                          style={{ objectFit: 'cover', transform: drawn.isReversed ? 'rotate(180deg)' : 'none' }}
                          unoptimized />
                      </div>

                      {/* Card details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header: position + name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700,
                            background: 'var(--gradient-teal)', color: 'white', border: 'none',
                          }}>
                            {POSITION_ICONS[i]} {POSITION_LABELS[i]}
                          </span>
                          <span style={{
                            padding: '2px 8px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 600,
                            background: drawn.isReversed ? 'rgba(232,160,144,0.15)' : 'rgba(100,200,150,0.15)',
                            color: drawn.isReversed ? '#e8a090' : '#64c896',
                          }}>
                            {drawn.isReversed ? '⟳ Ngược' : '↑ Xuôi'}
                          </span>
                        </div>

                        <h3 style={{
                          fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-title)',
                          color: 'var(--gold-300)', marginBottom: '8px',
                        }}>
                          {drawn.card.name}
                        </h3>

                        {/* Keywords */}
                        {keywords && keywords.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            {keywords.slice(0, 4).map((kw, ki) => (
                              <span key={ki} style={{
                                padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem',
                                background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                                border: '1px solid rgba(255,255,255,0.08)',
                              }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* AI focus point — the main interpretation */}
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
                          {aiCard?.focus_point || drawn.card.detailedMeaning || 'Thông điệp đang được giải mã...'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ===== SYNTHESIS — Combined story ===== */}
            {aiResult?.synthesis?.storytelling_analysis && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ marginBottom: '24px' }}>
                <div style={{
                  background: 'rgba(200, 164, 85, 0.06)', border: '1px solid rgba(200, 164, 85, 0.2)',
                  borderRadius: '14px', padding: '28px', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-gold)' }} />
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.15rem', color: 'var(--gold-400)', marginBottom: '14px' }}>
                    📖 Ý Nghĩa Kết Hợp 3 Lá Bài
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 2 }}>
                    {aiResult.synthesis.storytelling_analysis}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actionable Advice */}
            {aiResult?.synthesis?.actionable_advice && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{
                  background: 'rgba(100, 180, 255, 0.06)', border: '1px solid rgba(100, 180, 255, 0.15)',
                  borderRadius: '12px', padding: '18px 20px', marginBottom: '20px',
                }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64b4ff', marginBottom: '6px', letterSpacing: '1px' }}>💡 LỜI KHUYÊN HÀNH ĐỘNG</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.8 }}>
                  {aiResult.synthesis.actionable_advice}
                </p>
              </motion.div>
            )}

            {/* Affirmation */}
            {aiResult?.affirmation && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                style={{
                  background: 'var(--gradient-gold)', borderRadius: '12px', padding: '16px 24px',
                  textAlign: 'center', marginBottom: '32px',
                }}>
                <p style={{ color: '#0a0a12', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
                  ✦ &ldquo;{aiResult.affirmation}&rdquo; ✦
                </p>
              </motion.div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleReset} className="btn-primary" style={{ padding: '14px 32px' }}>Hỏi Câu Khác 🔄</button>
              <Link href="/boi-bai" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block', padding: '14px 32px' }}>
                Chọn Kiểu Trải Bài
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
