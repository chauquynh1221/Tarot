'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomCards, getCombinationMeaning, type TarotCard } from '@/data/tarot-cards';
import Image from 'next/image';
import Link from 'next/link';

type Phase = 'topic' | 'shuffle' | 'select' | 'reveal' | 'result';

const topics = [
  { id: 'love', label: 'Tình Yêu', icon: '💕', desc: 'Tình cảm, mối quan hệ, đối phương' },
  { id: 'career', label: 'Sự Nghiệp', icon: '💼', desc: 'Công việc, phát triển, cơ hội' },
  { id: 'finance', label: 'Tài Chính', icon: '💰', desc: 'Tiền bạc, đầu tư, thu nhập' },
  { id: 'health', label: 'Sức Khỏe', icon: '🌿', desc: 'Thể chất, tinh thần, năng lượng' },
  { id: 'general', label: 'Tổng Quan', icon: '✨', desc: 'Thông điệp tổng thể cho bạn' },
];

const positions = [
  { label: 'Quá Khứ', desc: 'Những gì đã xảy ra và ảnh hưởng đến bạn' },
  { label: 'Hiện Tại', desc: 'Tình hình và năng lượng hiện tại' },
  { label: 'Tương Lai', desc: 'Xu hướng và khả năng sắp tới' },
];

const TOTAL_DECK = 78;
const ROW_SIZE = 39;

export default function ThreeCardPage() {
  const [phase, setPhase] = useState<Phase>('topic');
  const [topic, setTopic] = useState('');
  const [drawnCards, setDrawnCards] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [shuffleRound, setShuffleRound] = useState(0);

  const handleTopicSelect = useCallback((t: string) => {
    setTopic(t);
    setPhase('shuffle');

    let round = 0;
    const interval = setInterval(() => {
      round++;
      setShuffleRound(round);
      if (round >= 4) {
        clearInterval(interval);
        const drawn = getRandomCards(3);
        setDrawnCards(drawn);
        setTimeout(() => setPhase('select'), 300);
      }
    }, 700);
  }, []);

  const handleCardPick = useCallback((deckIndex: number) => {
    if (selectedIndices.includes(deckIndex) || selectedIndices.length >= 3) return;
    const newSelected = [...selectedIndices, deckIndex];
    setSelectedIndices(newSelected);

    if (newSelected.length === 3) {
      setTimeout(() => setPhase('reveal'), 800);
    }
  }, [selectedIndices]);

  const handleFlipCard = useCallback((index: number) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === 3) {
        setTimeout(() => setPhase('result'), 800);
      }
      return next;
    });
  }, []);

  const handleReset = () => {
    setPhase('topic');
    setTopic('');
    setDrawnCards([]);
    setSelectedIndices([]);
    setRevealedCards(new Set());
    setShuffleRound(0);
  };

  const phaseIndex = ['topic', 'shuffle', 'select', 'reveal', 'result'].indexOf(phase);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '40px 24px', minHeight: '85vh', position: 'relative', zIndex: 1 }}>
      {/* Progress Bar */}
      <div className="progress-bar">
        {['Chủ đề', 'Xáo bài', 'Chọn bài', 'Lật bài', 'Kết quả'].map((step, i) => (
          <div key={step} className="progress-step">
            <div className={`progress-dot ${phaseIndex > i ? 'done' : phaseIndex === i ? 'active' : ''}`}>
              {phaseIndex > i ? '✓' : i + 1}
            </div>
            {i < 4 && <div className={`progress-line ${phaseIndex > i ? 'active' : ''}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ===== PHASE 1: TOPIC SELECTION ===== */}
        {phase === 'topic' && (
          <motion.div
            key="topic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '10px' }}>
              Trải Bài 3 Lá
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '48px', lineHeight: 1.7 }}>
              Bạn muốn hỏi về chủ đề gì? Hít thở sâu, tập trung, rồi chọn.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              {topics.map((t) => (
                <button
                  key={t.id}
                  className="topic-chip"
                  onClick={() => handleTopicSelect(t.id)}
                >
                  <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '8px' }}>{t.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block', marginBottom: '4px', color: 'var(--gold-400)' }}>{t.label}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 2: SHUFFLE ===== */}
        {phase === 'shuffle' && (
          <motion.div
            key="shuffle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '40px' }}
          >
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', marginBottom: '40px', color: 'var(--gold-400)' }}>
              Đang Xáo Bài...
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '440px',
              position: 'relative',
            }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '160px',
                    height: '267px',
                    background: 'url(/cards/card-back.png) center/cover no-repeat',
                    borderRadius: '14px',
                    border: '2px solid rgba(200, 164, 85, 0.3)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    position: 'absolute',
                    left: `calc(50% - 80px + ${(i - 3) * 20}px)`,
                  }}
                  animate={{
                    x: [0, (i % 2 === 0 ? -120 : 100), 0, (i % 2 === 0 ? 80 : -70), 0],
                    y: [0, -20, 0, -15, 0],
                    rotate: [(i - 3) * 2, (i % 2 === 0 ? -12 : 10), (i - 3) * 2, (i % 2 === 0 ? 8 : -6), (i - 3) * 2],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.06,
                  }}
                />
              ))}
            </div>

            <motion.p
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: 'var(--gold-500)', marginTop: '32px', fontSize: '0.9rem' }}
            >
              ✦ Vũ trụ đang sắp xếp thông điệp cho bạn ✦
            </motion.p>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
              Lượt xáo: {shuffleRound}/4
            </p>
          </motion.div>
        )}

        {/* ===== PHASE 3: CARD SELECTION — TAROTVIET STYLE ===== */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}
          >
            <h2 style={{
              fontFamily: 'var(--font-title)', fontSize: '1.6rem', marginBottom: '6px',
              background: 'var(--gradient-gold)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Tập trung tâm trí và lắng nghe năng lượng
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
              Hãy suy ngẫm điều bạn thân cần giải đáp và chọn 3 lá bài
            </p>

            {/* Position indicators */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '36px' }}>
              {positions.map((pos, i) => (
                <div key={pos.label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: selectedIndices.length > i ? 1 : 0.4,
                  transition: 'all 0.4s',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: selectedIndices.length > i ? 'var(--gradient-gold)' : 'transparent',
                    border: selectedIndices.length > i ? '2px solid var(--gold-400)' : '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800,
                    color: selectedIndices.length > i ? '#0a0a12' : 'var(--text-muted)',
                    transition: 'all 0.4s',
                  }}>
                    {selectedIndices.length > i ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: selectedIndices.length > i ? 700 : 400,
                    color: selectedIndices.length > i ? 'var(--gold-400)' : 'var(--text-muted)',
                  }}>
                    {pos.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ROW 1 */}
            <div style={{
              border: '1px solid rgba(200, 164, 85, 0.15)',
              borderRadius: '12px',
              padding: '30px 20px 30px 20px',
              marginBottom: '28px',
              position: 'relative',
              overflow: 'visible',
              minHeight: '280px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                position: 'relative',
                height: '260px',
              }}>
                {Array.from({ length: ROW_SIZE }).map((_, i) => {
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= 3 && !isPicked;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative',
                        flex: '1 1 0',
                        minWidth: 0,
                        height: '240px',
                        cursor: isPicked || isDisabled ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled ? { zIndex: 50 } : {}}
                    >
                      {isPicked && (
                        <motion.div
                          initial={{ scale: 0, y: 0 }}
                          animate={{ scale: 1, y: -110 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          style={{
                            position: 'absolute', top: '-6px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'var(--gradient-gold)', color: '#0a0a12',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '0.85rem',
                            boxShadow: '0 0 20px var(--gold-glow)',
                            zIndex: 60,
                          }}
                        >
                          {pickNumber}
                        </motion.div>
                      )}

                      <motion.div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: '150px',
                          height: '240px',
                          marginLeft: '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat',
                          borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked
                            ? '0 0 30px rgba(200, 164, 85, 0.4), 0 -10px 30px rgba(200, 164, 85, 0.1)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled ? {
                          y: -60,
                          boxShadow: '0 15px 40px rgba(200, 164, 85, 0.25), 0 0 15px rgba(200, 164, 85, 0.1)',
                          borderColor: 'rgba(200, 164, 85, 0.4)',
                        } : {}}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ROW 2 */}
            <div style={{
              border: '1px solid rgba(200, 164, 85, 0.15)',
              borderRadius: '12px',
              padding: '30px 20px 30px 20px',
              position: 'relative',
              overflow: 'visible',
              minHeight: '280px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                position: 'relative',
                height: '260px',
              }}>
                {Array.from({ length: ROW_SIZE }).map((_, j) => {
                  const i = ROW_SIZE + j;
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= 3 && !isPicked;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: j * 0.02 + 0.3 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative',
                        flex: '1 1 0',
                        minWidth: 0,
                        height: '240px',
                        cursor: isPicked || isDisabled ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled ? { zIndex: 50 } : {}}
                    >
                      {isPicked && (
                        <motion.div
                          initial={{ scale: 0, y: 0 }}
                          animate={{ scale: 1, y: -110 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          style={{
                            position: 'absolute', top: '-6px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'var(--gradient-gold)', color: '#0a0a12',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '0.85rem',
                            boxShadow: '0 0 20px var(--gold-glow)',
                            zIndex: 60,
                          }}
                        >
                          {pickNumber}
                        </motion.div>
                      )}

                      <motion.div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: '150px',
                          height: '240px',
                          marginLeft: '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat',
                          borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked
                            ? '0 0 30px rgba(200, 164, 85, 0.4), 0 -10px 30px rgba(200, 164, 85, 0.1)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled ? {
                          y: -60,
                          boxShadow: '0 15px 40px rgba(200, 164, 85, 0.25), 0 0 15px rgba(200, 164, 85, 0.1)',
                          borderColor: 'rgba(200, 164, 85, 0.4)',
                        } : {}}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== PHASE 4: REVEAL (FLIP) ===== */}
        {phase === 'reveal' && drawnCards.length === 3 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '8px' }}>
                Lật Bài Để Xem Thông Điệp
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Chạm vào từng lá bài để lật — từ trái sang phải
              </p>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
            }}>
              {drawnCards.map(({ card, isReversed }, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 150 }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{
                    color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 700,
                    marginBottom: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                  }}>
                    {positions[i].label}
                  </p>

                  <div
                    className={`tarot-card ${revealedCards.has(i) ? 'flipped' : ''}`}
                    onClick={() => handleFlipCard(i)}
                    style={{ margin: '0 auto' }}
                  >
                    <div className="tarot-card-inner">
                      <div className="tarot-card-face tarot-card-back" />
                      <div className="tarot-card-face tarot-card-front">
                        <Image
                          src={card.image}
                          alt={card.name}
                          fill
                          style={{ objectFit: 'cover', transform: isReversed ? 'rotate(180deg)' : 'none' }}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>

                  {revealedCards.has(i) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ marginTop: '14px' }}
                    >
                      <p style={{
                        fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1rem',
                        color: 'var(--gold-300)',
                      }}>
                        {card.name}
                      </p>
                      {isReversed && (
                        <span style={{ color: '#e8a090', fontSize: '0.75rem' }}>(Reversed)</span>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {revealedCards.size < 3 && (
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textAlign: 'center', color: 'var(--gold-500)', marginTop: '36px', fontSize: '0.85rem' }}
              >
                ✦ Chạm vào lá bài để lật ✦
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ===== PHASE 5: RESULT ===== */}
        {phase === 'result' && drawnCards.length === 3 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem' }}>
                Kết Quả Trải Bài
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                {topics.find(t => t.id === topic)?.icon} {topics.find(t => t.id === topic)?.label}
              </p>
            </div>

            {/* Individual cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {drawnCards.map(({ card, isReversed }, i) => (
                <motion.div
                  key={card.id}
                  className="result-card"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '120px', height: '200px', borderRadius: '10px',
                      overflow: 'hidden', flexShrink: 0, position: 'relative',
                      border: '2px solid var(--border-gold)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}>
                      <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        style={{ objectFit: 'cover', transform: isReversed ? 'rotate(180deg)' : 'none' }}
                        unoptimized
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span className="tag" style={{ background: 'var(--gradient-teal)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.72rem' }}>
                          {positions[i].label}
                        </span>
                        <h3 style={{
                          fontSize: '1.3rem', fontWeight: 700,
                          fontFamily: 'var(--font-title)', color: 'var(--gold-300)',
                        }}>
                          {card.name}
                          {isReversed && <span style={{ color: '#e8a090', fontSize: '0.8rem', marginLeft: '8px' }}>(Reversed)</span>}
                        </h3>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '10px' }}>
                        {positions[i].desc}
                      </p>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '14px' }}>
                        {card.detailedMeaning}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(isReversed ? card.reversed : card.upright).map((m, j) => (
                          <span key={j} className={isReversed ? 'tag tag-reversed' : 'tag'}>{m}</span>
                        ))}
                      </div>

                      <Link href={`/y-nghia-la-bai/${card.slug}`} style={{
                        display: 'inline-block', marginTop: '10px',
                        color: 'var(--teal-300)', fontSize: '0.82rem', textDecoration: 'none',
                      }}>
                        Xem chi tiết {card.name} →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Combined Interpretation */}
            <motion.div
              className="result-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                borderColor: 'var(--border-gold)',
                background: 'rgba(200, 164, 85, 0.03)',
                marginBottom: '40px',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-title)', fontSize: '1.3rem',
                color: 'var(--gold-300)', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                🔮 Sự Kết Hợp Của 3 Lá Bài
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', justifyContent: 'center' }}>
                {drawnCards.map(({ card }, i) => (
                  <div key={card.id} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '80px', height: '133px', borderRadius: '8px',
                      overflow: 'hidden', position: 'relative',
                      border: '1.5px solid var(--border-gold)',
                    }}>
                      <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {positions[i].label}
                    </p>
                  </div>
                ))}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 2 }}>
                {getCombinationMeaning(drawnCards.map(d => d.card), topic)}
              </p>
            </motion.div>

            <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleReset} className="btn-primary">
                Trải Bài Lại 🔄
              </button>
              <Link href="/boi-bai" className="btn-gold" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Chọn Kiểu Khác
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
