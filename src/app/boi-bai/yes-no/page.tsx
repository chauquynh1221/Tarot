'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getRandomCards, type TarotCard } from '@/features/cards';

type Phase = 'ask' | 'reveal' | 'interpreting' | 'result';

interface YesNoResult {
  answer: string;
  confidence_score: number;
  reasoning: string;
  guidance: string;
}

export default function YesNoPage() {
  const [phase, setPhase] = useState<Phase>('ask');
  const [question, setQuestion] = useState('');
  const [drawnCard, setDrawnCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);
  const [aiResult, setAiResult] = useState<YesNoResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleDraw = () => {
    if (!question.trim()) return;
    const [drawn] = getRandomCards(1);
    setDrawnCard(drawn);
    setPhase('reveal');
  };

  const handleFlip = () => setPhase('interpreting');

  // Auto-flip card 1.5s after reveal
  useEffect(() => {
    if (phase === 'reveal') {
      const t = setTimeout(() => setPhase('interpreting'), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Fetch AI Yes/No reading
  const fetchYesNo = useCallback(async () => {
    if (!drawnCard) return;
    setLoadingAI(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/reading/yes-no', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: drawnCard.card.id,
          name: drawnCard.card.name,
          isReversed: drawnCard.isReversed,
          question,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.interpretation) {
        setAiResult(data.interpretation);
      }
    } catch (err: any) {
      console.error('Yes/No AI error:', err);
    } finally {
      setLoadingAI(false);
      setPhase('result');
    }
  }, [drawnCard, question]);

  // Trigger AI call when entering interpreting phase
  useEffect(() => {
    if (phase === 'interpreting' && drawnCard && !aiResult) {
      fetchYesNo();
    }
  }, [phase, drawnCard, aiResult, fetchYesNo]);

  const handleReset = () => {
    setPhase('ask');
    setQuestion('');
    setDrawnCard(null);
    setAiResult(null);
    setLoadingAI(false);
  };

  // Fallback answer from card data (used if AI fails)
  const getFallbackAnswer = () => {
    if (!drawnCard) return { text: '', color: '', emoji: '' };
    if (drawnCard.isReversed) return { text: 'KHÔNG', color: '#ef4444', emoji: '✗' };
    return drawnCard.card.yesNo === 'yes'
      ? { text: 'CÓ', color: '#22c55e', emoji: '✓' }
      : drawnCard.card.yesNo === 'no'
      ? { text: 'KHÔNG', color: '#ef4444', emoji: '✗' }
      : { text: 'CÓ THỂ', color: 'var(--gold-400)', emoji: '~' };
  };

  // Get answer color based on AI result or fallback
  const getAnswerDisplay = () => {
    if (aiResult) {
      const a = aiResult.answer.toUpperCase();
      if (a.includes('CÓ') && !a.includes('KHÔNG') && !a.includes('CÂN')) {
        return { text: 'CÓ', color: '#22c55e' };
      }
      if (a.includes('KHÔNG')) {
        return { text: 'KHÔNG', color: '#ef4444' };
      }
      return { text: 'CẦN CÂN NHẮC', color: 'var(--gold-400)' };
    }
    return getFallbackAnswer();
  };

  const answerDisplay = getAnswerDisplay();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', minHeight: '80vh', position: 'relative', zIndex: 1 }}>
      <AnimatePresence mode="wait">
        {/* ASK PHASE */}
        {phase === 'ask' && (
          <motion.div key="ask" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
              Yes / No Tarot
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.7, fontSize: '1rem' }}>
              Đặt một câu hỏi Có/Không, rút lá bài và nhận câu trả lời.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                style={{
                  width: '100%', padding: '16px 20px', borderRadius: '12px',
                  background: 'rgba(147, 122, 216, 0.06)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical', minHeight: '100px',
                  fontFamily: 'var(--font-body)', outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--purple-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button onClick={handleDraw} className="btn-primary" disabled={!question.trim()}
              style={{ opacity: question.trim() ? 1 : 0.4, padding: '14px 40px' }}>
              Rút Lá Bài 🔮
            </button>
          </motion.div>
        )}

        {/* REVEAL PHASE */}
        {phase === 'reveal' && drawnCard && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Câu hỏi của bạn:</p>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '32px', fontSize: '1rem' }}>
              &ldquo;{question}&rdquo;
            </p>

            <div className="tarot-card" onClick={handleFlip} style={{ margin: '0 auto', cursor: 'pointer' }}>
              <div className="tarot-card-inner">
                <div className="tarot-card-face tarot-card-back" />
                <div className="tarot-card-face tarot-card-front">
                  <Image src={drawnCard.card.image} alt={drawnCard.card.name} fill
                    style={{ objectFit: 'cover', transform: drawnCard.isReversed ? 'rotate(180deg)' : 'none' }}
                    unoptimized />
                </div>
              </div>
            </div>

            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ color: 'var(--gold-500)', marginTop: '16px', fontSize: '0.85rem' }}
            >
              ✨ Chạm để lật ✨
            </motion.p>
          </motion.div>
        )}

        {/* INTERPRETING PHASE — Loading */}
        {phase === 'interpreting' && drawnCard && (
          <motion.div
            key="interpreting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Crystal ball animation */}
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 32px' }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200, 164, 85, 0.5) 0%, rgba(200, 164, 85, 0) 70%)',
                  boxShadow: '0 0 50px rgba(200, 164, 85, 0.3)',
                }}
              />
              {/* Orbiting particles */}
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', transformOrigin: 'center' }}
                >
                  <div style={{
                    position: 'absolute', top: `${15 + i * 10}%`, left: '50%',
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--gold-400)' : 'var(--teal-300)',
                    boxShadow: `0 0 12px ${i % 2 === 0 ? 'var(--gold-glow)' : 'rgba(100, 180, 255, 0.5)'}`,
                  }} />
                </motion.div>
              ))}
              {/* Card thumbnail */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '50px', height: '83px', borderRadius: '6px', overflow: 'hidden',
                  border: '1.5px solid rgba(200, 164, 85, 0.4)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                <Image src={drawnCard.card.image} alt="" fill style={{ objectFit: 'cover', opacity: 0.7, transform: drawnCard.isReversed ? 'rotate(180deg)' : 'none' }} unoptimized />
              </motion.div>
            </div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '10px' }}
            >
              Đang Tìm Câu Trả Lời...
            </motion.h2>

            <motion.p
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '350px', lineHeight: 1.7 }}
            >
              Vũ trụ đang soi chiếu câu hỏi của bạn...
            </motion.p>
          </motion.div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && drawnCard && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Câu hỏi:</p>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '28px', fontSize: '0.95rem' }}>
              &ldquo;{question}&rdquo;
            </p>

            {/* Main Answer Circle */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: '130px', height: '130px', borderRadius: '50%',
                background: `${answerDisplay.color}15`, border: `3px solid ${answerDisplay.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px', flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: answerDisplay.color, fontFamily: 'var(--font-title)' }}>
                {answerDisplay.text}
              </span>
            </motion.div>

            {/* Confidence Score */}
            {aiResult && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '24px' }}>
                Độ tin cậy: <span style={{ color: answerDisplay.color, fontWeight: 700 }}>{aiResult.confidence_score}%</span>
              </motion.p>
            )}

            {/* Card + AI interpretation */}
            <div className="result-card" style={{ textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{
                  width: '100px', height: '167px', borderRadius: '8px', overflow: 'hidden',
                  position: 'relative', flexShrink: 0, border: '2px solid rgba(187, 161, 55, 0.3)',
                }}>
                  <Image src={drawnCard.card.image} alt={drawnCard.card.name} fill
                    style={{ objectFit: 'cover', transform: drawnCard.isReversed ? 'rotate(180deg)' : 'none' }}
                    unoptimized />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.15rem', color: 'var(--gold-400)', marginBottom: '6px' }}>
                    {drawnCard.card.name}
                    {drawnCard.isReversed && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '6px' }}>(Ngược)</span>}
                  </h3>

                  {aiResult ? (
                    <div>
                      {/* Reasoning */}
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '12px' }}>
                        {aiResult.reasoning}
                      </p>

                      {/* Guidance */}
                      <div style={{
                        background: 'rgba(100, 180, 255, 0.06)', border: '1px solid rgba(100, 180, 255, 0.15)',
                        borderRadius: '8px', padding: '10px 12px',
                      }}>
                        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64b4ff', marginBottom: '4px' }}>💡 LỜI KHUYÊN</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                          {aiResult.guidance}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '12px' }}>
                        {drawnCard.card.detailedMeaning}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(drawnCard.isReversed ? drawnCard.card.reversed : drawnCard.card.upright).map((m, j) => (
                          <span key={j} className={drawnCard.isReversed ? 'tag tag-reversed' : 'tag'}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleReset} className="btn-primary">Hỏi Câu Khác 🔄</button>
              <Link href="/boi-bai/3-la" className="btn-gold" style={{ textDecoration: 'none' }}>Trải 3 Lá</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
