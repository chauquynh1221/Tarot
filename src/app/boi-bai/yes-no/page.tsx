'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getRandomCards, type TarotCard } from '@/data/tarot-cards';

type Phase = 'ask' | 'reveal' | 'result';

export default function YesNoPage() {
  const [phase, setPhase] = useState<Phase>('ask');
  const [question, setQuestion] = useState('');
  const [drawnCard, setDrawnCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);

  const handleDraw = () => {
    if (!question.trim()) return;
    const [drawn] = getRandomCards(1);
    setDrawnCard(drawn);
    setPhase('reveal');
  };

  const getAnswer = () => {
    if (!drawnCard) return { text: '', color: '', emoji: '' };
    if (drawnCard.isReversed) return { text: 'KHÔNG', color: '#ef4444', emoji: '✗' };
    return drawnCard.card.yesNo === 'yes'
      ? { text: 'CÓ', color: '#22c55e', emoji: '✓' }
      : drawnCard.card.yesNo === 'no'
      ? { text: 'KHÔNG', color: '#ef4444', emoji: '✗' }
      : { text: 'CÓ THỂ', color: 'var(--gold-400)', emoji: '~' };
  };

  const handleFlip = () => setPhase('result');

  const handleReset = () => { setPhase('ask'); setQuestion(''); setDrawnCard(null); };

  const answer = getAnswer();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', minHeight: '80vh', position: 'relative', zIndex: 1 }}>
      <AnimatePresence mode="wait">
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

        {phase === 'reveal' && drawnCard && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Câu hỏi của bạn:</p>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '32px', fontSize: '1rem' }}>
              &ldquo;{question}&rdquo;
            </p>

            <div
              className={`tarot-card`}
              onClick={handleFlip}
              style={{ margin: '0 auto', cursor: 'pointer' }}
            >
              <div className="tarot-card-inner">
                <div className="tarot-card-face tarot-card-back" />
                <div className="tarot-card-face tarot-card-front">
                  <Image src={drawnCard.card.image} alt={drawnCard.card.name} fill
                    style={{ objectFit: 'cover', transform: drawnCard.isReversed ? 'rotate(180deg)' : 'none' }}
                    unoptimized
                  />
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

        {phase === 'result' && drawnCard && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Câu hỏi:</p>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '32px', fontSize: '0.95rem' }}>
              &ldquo;{question}&rdquo;
            </p>

            {/* Answer */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: `${answer.color}15`, border: `3px solid ${answer.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '2rem', fontWeight: 900, color: answer.color, fontFamily: 'var(--font-title)' }}>
                {answer.text}
              </span>
            </motion.div>

            {/* Card info */}
            <div className="result-card" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{
                  width: '100px', height: '167px', borderRadius: '8px', overflow: 'hidden',
                  position: 'relative', flexShrink: 0, border: '2px solid rgba(187, 161, 55, 0.3)',
                  margin: '0 auto',
                }}>
                  <Image src={drawnCard.card.image} alt={drawnCard.card.name} fill
                    style={{ objectFit: 'cover', transform: drawnCard.isReversed ? 'rotate(180deg)' : 'none' }}
                    unoptimized />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: 'var(--gold-400)', marginBottom: '6px' }}>
                    {drawnCard.card.name}
                    {drawnCard.isReversed && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginLeft: '6px' }}>(Reversed)</span>}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '12px' }}>
                    {drawnCard.card.detailedMeaning}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(drawnCard.isReversed ? drawnCard.card.reversed : drawnCard.card.upright).map((m, j) => (
                      <span key={j} className={drawnCard.isReversed ? 'tag tag-reversed' : 'tag'}>{m}</span>
                    ))}
                  </div>
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
