'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Phase = 'topic' | 'shuffle' | 'select' | 'reveal' | 'interpreting' | 'result';

interface CardResult {
  card_id: number;
  name: string;
  name_vi: string;
  number: number;
  arcana: string;
  suit: string | null;
  image: string;
  slug: string;
  description: string;
  meaning: string;
  category: string;
  isReversed: boolean;
}

const topics = [
  { id: 'LOVE', label: 'Tình Yêu', icon: '💕', desc: 'Tình cảm, mối quan hệ, đối phương' },
  { id: 'CAREER', label: 'Sự Nghiệp', icon: '💼', desc: 'Công việc, phát triển, cơ hội' },
  { id: 'FINANCE', label: 'Tài Chính', icon: '💰', desc: 'Tiền bạc, đầu tư, thu nhập' },
  { id: 'HEALTH', label: 'Sức Khỏe', icon: '🌿', desc: 'Thể chất, tinh thần, năng lượng' },
  { id: 'GENERAL', label: 'Tổng Quan', icon: '✨', desc: 'Thông điệp tổng thể cho bạn' },
  { id: 'GROWTH', label: 'Phát Triển', icon: '🌱', desc: 'Tâm linh, trưởng thành, bài học' },
  { id: 'CREATIVE', label: 'Sáng Tạo', icon: '🎨', desc: 'Nghệ thuật, cảm hứng, ý tưởng' },
];

// 10 vị trí Celtic Cross
const celticPositions = [
  { label: 'Hiện Tại', desc: 'Tình hình hiện tại của bạn' },
  { label: 'Thách Thức', desc: 'Trở ngại chính bạn đang đối mặt' },
  { label: 'Nền Tảng', desc: 'Gốc rễ sâu xa của vấn đề' },
  { label: 'Quá Khứ', desc: 'Điều vừa qua ảnh hưởng đến bạn' },
  { label: 'Khả Năng', desc: 'Kết quả tốt nhất có thể xảy ra' },
  { label: 'Tương Lai Gần', desc: 'Điều sắp xảy ra trong thời gian tới' },
  { label: 'Bản Thân', desc: 'Thái độ và cách bạn nhìn nhận tình hình' },
  { label: 'Môi Trường', desc: 'Ảnh hưởng của người xung quanh' },
  { label: 'Hy Vọng & Sợ Hãi', desc: 'Điều bạn mong muốn hoặc lo lắng' },
  { label: 'Kết Quả', desc: 'Kết quả cuối cùng nếu tiếp tục con đường này' },
];

const TOTAL_DECK = 78;
const ROW_SIZE = 39;
const CARD_COUNT = 10;

export default function CelticCrossPage() {
  const [phase, setPhase] = useState<Phase>('topic');
  const [topic, setTopic] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [resultCards, setResultCards] = useState<CardResult[]>([]);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // AI interpretation states
  const [interpretations, setInterpretations] = useState<any[]>([]);
  const [synthesis, setSynthesis] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);


  const handleTopicSelect = useCallback(async (t: string) => {
    setTopic(t);
    setError('');
    setPhase('shuffle');

    let round = 0;
    const interval = setInterval(() => {
      round++;
      setShuffleRound(round);
      if (round >= 4) clearInterval(interval);
    }, 700);

    try {
      const res = await fetch('/api/reading/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: t, cardCount: CARD_COUNT }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessionId(data.sessionId);

      await new Promise(resolve => {
        const check = setInterval(() => {
          if (round >= 4) { clearInterval(check); resolve(null); }
        }, 200);
      });
      setTimeout(() => setPhase('select'), 300);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message);
      setPhase('topic');
    }
  }, []);

  const handleCardPick = useCallback((deckIndex: number) => {
    if (selectedIndices.includes(deckIndex) || selectedIndices.length >= CARD_COUNT) return;
    const newSelected = [...selectedIndices, deckIndex];
    setSelectedIndices(newSelected);

    if (newSelected.length === CARD_COUNT) {
      setLoading(true);
      fetch('/api/reading/session/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, indices: newSelected }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setResultCards(data.cards);
          setLoading(false);
          setTimeout(() => setPhase('reveal'), 800);
        })
        .catch((err: any) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [selectedIndices, sessionId]);

  const handleFlipCard = useCallback((index: number) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === CARD_COUNT) {
        setTimeout(() => setPhase('interpreting'), 800);
      }
      return next;
    });
  }, []);

  // Auto-flip all 10 cards with stagger when entering reveal phase
  useEffect(() => {
    if (phase === 'reveal') {
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < CARD_COUNT; i++) {
        const t = setTimeout(() => handleFlipCard(i), 1000 + i * 400);
        timers.push(t);
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, handleFlipCard]);

  // Fetch AI — 10 parallel interpret-card calls + synthesis
  const fetchAIInterpretations = useCallback(async (cards: CardResult[], cat: string) => {
    setLoadingAI(true);
    try {
      // Step 1: 10 parallel interpret-card requests
      const promises = cards.map((card, i) =>
        fetch('/api/reading/interpret-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            card_id: card.card_id,
            name: card.name,
            isReversed: card.isReversed,
            category: cat,
            position: celticPositions[i]?.label,
          }),
        })
          .then(res => res.json())
          .catch(err => ({ card_id: card.card_id, name: card.name, interpretation: null, error: err.message }))
      );
      const results = await Promise.all(promises);
      setInterpretations(results);
      setPhase('result');

      // Step 2: Synthesis from the 10 interpretations
      setLoadingSynthesis(true);
      try {
        const cardsData = results.map((r, i) => ({
          card_name: r.interpretation?.card_name || cards[i].name,
          position: celticPositions[i]?.label || `Lá ${i + 1}`,
          orientation: r.interpretation?.orientation || (cards[i].isReversed ? 'Ngược' : 'Xuôi'),
          summary: r.interpretation?.summary || '',
          analysis: r.interpretation?.analysis || '',
        }));
        const topicLabel = topics.find(t => t.id === cat)?.label || cat;
        const controller = new AbortController();
        const synthTimeout = setTimeout(() => controller.abort(), 55000);
        const synthRes = await fetch('/api/reading/synthesis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cards: cardsData, category: topicLabel }),
          signal: controller.signal,
        });
        clearTimeout(synthTimeout);
        const synthData = await synthRes.json();
        if (synthRes.ok && synthData.synthesis) {
          const s = synthData.synthesis;
          setSynthesis({
            overview: s.narrative || s.overall_theme || '',
            key_message: s.overall_theme || '',
            divine_advice: s.combined_advice || '',
            future_path: s.final_thought || '',
          });
        } else {
          // Fallback: build from card summaries
          const summaries = results
            .filter(r => r.interpretation?.summary)
            .map((r, i) => `${celticPositions[i]?.label}: ${r.interpretation.summary}`)
            .join('. ');
          setSynthesis({
            overview: summaries || 'Các lá bài đang dệt nên câu chuyện về hành trình của bạn.',
            key_message: topicLabel,
            divine_advice: 'Hãy lắng nghe trực giác và hành động với sự tự tin.',
            future_path: 'Con đường phía trước đang mở ra những cơ hội mới.',
          });
        }
      } catch (synthErr) {
        console.error('Celtic Cross synthesis error:', synthErr);
        // Fallback synthesis on error
        const topicLabel = topics.find(t => t.id === cat)?.label || cat;
        setSynthesis({
          overview: 'Năng lượng 10 lá bài đang xâu chuỗi thành bức tranh toàn cảnh về hành trình của bạn.',
          key_message: topicLabel,
          divine_advice: 'Hãy tin tưởng vào tiến trình và kiên định với con đường của mình.',
          future_path: 'Mỗi bước đi đều có ý nghĩa — hãy tiếp tục tiến lên.',
        });
      } finally {
        setLoadingSynthesis(false);
      }
    } catch (err: any) {
      console.error('Celtic Cross AI error:', err);
      setPhase('result');
    } finally {
      setLoadingAI(false);
    }
  }, []);

  // Auto-fetch AI when entering interpreting phase
  useEffect(() => {
    if (phase === 'interpreting' && resultCards.length > 0 && !interpretations.length) {
      fetchAIInterpretations(resultCards, topic);
    }
  }, [phase, resultCards, topic, interpretations.length, fetchAIInterpretations]);


  const handleReset = () => {
    setPhase('topic');
    setTopic('');
    setSessionId('');
    setSelectedIndices([]);
    setRevealedCards(new Set());
    setResultCards([]);
    setShuffleRound(0);
    setError('');
    setLoading(false);
    setInterpretations([]);
    setSynthesis(null);
    setLoadingAI(false);
    setLoadingSynthesis(false);
  };

  const phaseIndex = ['topic', 'shuffle', 'select', 'reveal', 'interpreting', 'result'].indexOf(phase);

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '40px 24px', minHeight: '85vh', position: 'relative', zIndex: 1 }}>
      {/* Progress Bar */}
      <div className="progress-bar">
        {['Chủ đề', 'Xáo bài', 'Chọn bài', 'Lật bài', 'Giải mã', 'Kết quả'].map((step, i) => (
          <div key={step} className="progress-step">
            <div className={`progress-dot ${phaseIndex > i ? 'done' : phaseIndex === i ? 'active' : ''}`}>
              {phaseIndex > i ? '✓' : i + 1}
            </div>
            {i < 5 && <div className={`progress-line ${phaseIndex > i ? 'active' : ''}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ textAlign: 'center', padding: '16px', marginBottom: '24px', background: 'rgba(220,60,60,0.15)', borderRadius: '8px', color: '#e8a090' }}>
          ⚠️ {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* PHASE 1: TOPIC */}
        {phase === 'topic' && (
          <motion.div key="topic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '10px' }}>
              Celtic Cross
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '8px', lineHeight: 1.7 }}>
              Trải bài toàn diện nhất — 10 lá bài, 10 vị trí.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '40px' }}>
              Chọn chủ đề bạn muốn phân tích sâu:
            </p>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px', maxWidth: '700px', margin: '0 auto',
            }}>
              {topics.map((t) => (
                <button key={t.id} className="topic-chip" onClick={() => handleTopicSelect(t.id)}>
                  <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '8px' }}>{t.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', display: 'block', marginBottom: '4px', color: 'var(--gold-400)' }}>{t.label}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3, display: 'block' }}>{t.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: SHUFFLE */}
        {phase === 'shuffle' && (
          <motion.div key="shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', marginBottom: '40px', color: 'var(--gold-400)' }}>
              Đang Xáo Bài...
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '440px', position: 'relative' }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '160px', height: '267px',
                    background: 'url(/cards/card-back.png) center/cover no-repeat',
                    borderRadius: '14px', border: '2px solid rgba(200, 164, 85, 0.3)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5)', position: 'absolute',
                    left: `calc(50% - 80px + ${(i - 3) * 20}px)`,
                  }}
                  animate={{
                    x: [0, (i % 2 === 0 ? -120 : 100), 0, (i % 2 === 0 ? 80 : -70), 0],
                    y: [0, -20, 0, -15, 0],
                    rotate: [(i - 3) * 2, (i % 2 === 0 ? -12 : 10), (i - 3) * 2, (i % 2 === 0 ? 8 : -6), (i - 3) * 2],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 }}
                />
              ))}
            </div>
            <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: 'var(--gold-500)', marginTop: '32px', fontSize: '0.9rem' }}>
              ✦ Vũ trụ đang sắp xếp thông điệp cho bạn ✦
            </motion.p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
              Lượt xáo: {shuffleRound}/4
            </p>
          </motion.div>
        )}

        {/* PHASE 3: SELECT — 78 face-down cards */}
        {phase === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-title)', fontSize: '1.6rem', marginBottom: '6px',
              background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Chọn 10 Lá Bài Cho Celtic Cross
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
              Đã chọn: {selectedIndices.length} / {CARD_COUNT}
            </p>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
              {celticPositions.map((pos, i) => (
                <div key={pos.label} style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                  background: selectedIndices.length > i ? 'rgba(200,164,85,0.2)' : 'rgba(255,255,255,0.05)',
                  color: selectedIndices.length > i ? 'var(--gold-400)' : 'var(--text-muted)',
                  border: selectedIndices.length === i ? '1px solid var(--gold-400)' : '1px solid transparent',
                  transition: 'all 0.3s',
                }}>
                  {selectedIndices.length > i ? '✓' : `${i + 1}.`} {pos.label}
                </div>
              ))}
            </div>

            {/* Mobile: Auto-pick button */}
            {isMobile && selectedIndices.length < CARD_COUNT && !loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const available = Array.from({ length: ROW_SIZE * 2 }, (_, i) => i)
                      .filter(i => !selectedIndices.includes(i));
                    const needed = CARD_COUNT - selectedIndices.length;
                    const picks: number[] = [];
                    while (picks.length < needed && available.length > 0) {
                      const idx = Math.floor(Math.random() * available.length);
                      picks.push(available.splice(idx, 1)[0]);
                    }
                    picks.forEach((p, delay) => setTimeout(() => handleCardPick(p), delay * 200));
                  }}
                  style={{
                    padding: '14px 32px', background: 'var(--gradient-gold)', border: 'none',
                    borderRadius: '50px', color: '#0a0a12', fontWeight: 800, fontSize: '1rem',
                    cursor: 'pointer', boxShadow: '0 0 20px rgba(200,164,85,0.4)', letterSpacing: '0.5px',
                  }}
                >
                  ✨ Chọn Ngẫu Nhiên (10 lá)
                </button>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '8px' }}>
                  Hoặc chạm vào từng lá bài để chọn thủ công
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: 'var(--gold-500)', marginBottom: '24px', fontSize: '0.9rem' }}>
                ✦ Đang giải mã lá bài... ✦
              </motion.p>
            )}

            {/* ROW 1 */}
            <div style={{
              border: '1px solid rgba(200, 164, 85, 0.15)', borderRadius: '12px',
              padding: '30px 20px', marginBottom: '28px', overflow: 'visible',
              minHeight: isMobile ? '160px' : '280px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative', height: '260px' }}>
                {Array.from({ length: ROW_SIZE }).map((_, i) => {
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= CARD_COUNT && !isPicked;
                  return (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative', flex: '1 1 0', minWidth: 0, height: '240px',
                        cursor: isPicked || isDisabled || loading ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled && !loading ? { zIndex: 50 } : {}}
                    >
                      {isPicked && (
                        <motion.div initial={{ scale: 0, y: 0 }} animate={{ scale: 1, y: -110 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          style={{
                            position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'var(--gradient-gold)', color: '#0a0a12',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '0.7rem', boxShadow: '0 0 20px var(--gold-glow)', zIndex: 60,
                          }}>
                          {pickNumber}
                        </motion.div>
                      )}
                      <motion.div
                        style={{
                          position: 'absolute', bottom: 0, left: '50%',
                          width: isMobile ? '70px' : '150px',
                          height: isMobile ? '112px' : '240px',
                          marginLeft: isMobile ? '-35px' : '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat', borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked ? '0 0 30px rgba(200, 164, 85, 0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled && !loading ? { y: -60, boxShadow: '0 15px 40px rgba(200, 164, 85, 0.25)', borderColor: 'rgba(200, 164, 85, 0.4)' } : {}}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ROW 2 */}
            <div style={{
              border: '1px solid rgba(200, 164, 85, 0.15)', borderRadius: '12px',
              padding: '30px 20px', overflow: 'visible', minHeight: '280px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative', height: '260px' }}>
                {Array.from({ length: ROW_SIZE }).map((_, j) => {
                  const i = ROW_SIZE + j;
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= CARD_COUNT && !isPicked;
                  return (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: j * 0.02 + 0.3 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative', flex: '1 1 0', minWidth: 0, height: '240px',
                        cursor: isPicked || isDisabled || loading ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled && !loading ? { zIndex: 50 } : {}}
                    >
                      {isPicked && (
                        <motion.div initial={{ scale: 0, y: 0 }} animate={{ scale: 1, y: -110 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          style={{
                            position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'var(--gradient-gold)', color: '#0a0a12',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 900, fontSize: '0.7rem', boxShadow: '0 0 20px var(--gold-glow)', zIndex: 60,
                          }}>
                          {pickNumber}
                        </motion.div>
                      )}
                      <motion.div
                        style={{
                          position: 'absolute', bottom: 0, left: '50%', width: '150px', height: '240px', marginLeft: '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat', borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked ? '0 0 30px rgba(200, 164, 85, 0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled && !loading ? { y: -60, boxShadow: '0 15px 40px rgba(200, 164, 85, 0.25)', borderColor: 'rgba(200, 164, 85, 0.4)' } : {}}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* PHASE 4: REVEAL */}
        {phase === 'reveal' && resultCards.length > 0 && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '8px' }}>
                Lật Bài Celtic Cross
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Chạm vào từng lá bài để lật — theo thứ tự
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '24px', maxWidth: '900px', margin: '0 auto',
            }}>
              {resultCards.map((card, i) => (
                <motion.div key={card.card_id} initial={{ opacity: 0, y: 40, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 150 }} style={{ textAlign: 'center' }}>
                  <p style={{
                    color: 'var(--gold-400)', fontSize: '0.7rem', fontWeight: 700,
                    marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase',
                  }}>
                    {i + 1}. {celticPositions[i]?.label}
                  </p>

                  <div className={`tarot-card ${revealedCards.has(i) ? 'flipped' : ''}`}
                    onClick={() => handleFlipCard(i)} style={{ margin: '0 auto', width: '120px', height: '200px' }}>
                    <div className="tarot-card-inner" style={{ width: '120px', height: '200px' }}>
                      <div className="tarot-card-face tarot-card-back" style={{ width: '120px', height: '200px' }} />
                      <div className="tarot-card-face tarot-card-front" style={{ width: '120px', height: '200px' }}>
                        <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover', transform: card.isReversed ? 'rotate(180deg)' : 'none' }} unoptimized />
                      </div>
                    </div>
                  </div>

                  {revealedCards.has(i) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '8px' }}>
                      <p style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold-300)' }}>
                        {card.name}
                      </p>
                      {card.isReversed && <span style={{ color: '#e8a090', fontSize: '0.7rem' }}>(Ngược)</span>}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {revealedCards.size < CARD_COUNT && (
              <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ textAlign: 'center', color: 'var(--gold-500)', marginTop: '32px', fontSize: '0.85rem' }}>
                ✦ Chạm vào lá bài để lật ({revealedCards.size}/{CARD_COUNT}) ✦
              </motion.p>
            )}
          </motion.div>
        )}

        {/* PHASE 5: INTERPRETING (LOADING) */}
        {phase === 'interpreting' && (
          <motion.div
            key="interpreting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 40px' }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200, 164, 85, 0.6) 0%, rgba(200, 164, 85, 0) 70%)',
                  boxShadow: '0 0 60px rgba(200, 164, 85, 0.4), 0 0 120px rgba(200, 164, 85, 0.2)',
                }}
              />
              {[0, 1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', transformOrigin: 'center' }}
                >
                  <div style={{
                    position: 'absolute', top: `${10 + i * 8}%`, left: '50%',
                    width: `${6 - i * 0.5}px`, height: `${6 - i * 0.5}px`, borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--gold-400)' : 'var(--teal-300)',
                    boxShadow: `0 0 ${10 + i * 3}px ${i % 2 === 0 ? 'var(--gold-glow)' : 'rgba(100, 180, 255, 0.5)'}`,
                  }} />
                </motion.div>
              ))}
            </div>

            <motion.h2
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--gold-400)', marginBottom: '12px' }}
            >
              Đang Kết Nối Vũ Trụ...
            </motion.h2>

            <motion.p
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.7 }}
            >
              Vũ trụ đang giải mã thông điệp từ 10 lá bài Celtic Cross...
            </motion.p>

            <div style={{ display: 'flex', gap: '6px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {resultCards.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], background: ['rgba(200,164,85,0.3)', 'rgba(200,164,85,1)', 'rgba(200,164,85,0.3)'] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(200,164,85,0.3)' }}
                />
              ))}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
              ✦ Năng lượng đang được kết nối ✦
            </p>
          </motion.div>
        )}

        {/* PHASE 6: RESULT */}
        {phase === 'result' && resultCards.length > 0 && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem' }}>
                Kết Quả Celtic Cross
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                {topics.find(t => t.id === topic)?.icon} {topics.find(t => t.id === topic)?.label} — 10 lá bài
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {resultCards.map((card, i) => {
                const interp = interpretations.find((r: any) => r.card_id === card.card_id);
                const aiText = interp?.interpretation?.analysis || interp?.interpretation?.summary;
                return (
                  <motion.div key={card.card_id} className="result-card"
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '90px', height: '150px', borderRadius: '8px', overflow: 'hidden',
                        flexShrink: 0, position: 'relative', border: '2px solid var(--border-gold)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}>
                        <Image src={card.image} alt={card.name} fill
                          style={{ objectFit: 'cover', transform: card.isReversed ? 'rotate(180deg)' : 'none' }} unoptimized />
                      </div>

                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span className="tag" style={{
                            background: 'var(--gradient-teal)', color: 'white', border: 'none',
                            fontWeight: 700, fontSize: '0.65rem',
                          }}>
                            {i + 1}. {celticPositions[i]?.label}
                          </span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-title)', color: 'var(--gold-300)' }}>
                            {card.name}
                            {card.isReversed && <span style={{ color: '#e8a090', fontSize: '0.75rem', marginLeft: '6px' }}>(Ngược)</span>}
                          </h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '8px' }}>
                          {celticPositions[i]?.desc}
                        </p>

                        {/* AI Interpretation */}
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                          {aiText || card.meaning}
                        </p>

                        <Link href={`/y-nghia-la-bai/${card.slug}`} style={{
                          display: 'inline-block', marginTop: '8px',
                          color: 'var(--teal-300)', fontSize: '0.78rem', textDecoration: 'none',
                        }}>
                          Xem chi tiết →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading synthesis */}
            {loadingSynthesis && (
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
                <p style={{ color: 'var(--gold-500)', fontSize: '0.88rem' }}>✦ Đang tổng hợp thông điệp Celtic Cross... ✦</p>
              </motion.div>
            )}

            {/* Synthesis */}
            {synthesis && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
                <div style={{
                  background: 'rgba(200, 164, 85, 0.06)', border: '1px solid rgba(200, 164, 85, 0.2)',
                  borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-gold)' }} />
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '16px', textAlign: 'center' }}>
                    🔮 Tổng Kết Celtic Cross
                  </h3>

                  {/* Overview */}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.9, marginBottom: '16px' }}>
                    {synthesis.overview}
                  </p>

                  {/* Core Conflict */}
                  {synthesis.core_conflict && (
                    <div style={{
                      background: 'rgba(220, 80, 80, 0.06)', border: '1px solid rgba(220, 80, 80, 0.15)',
                      borderRadius: '8px', padding: '10px 12px', marginBottom: '12px',
                    }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e88090', marginBottom: '4px' }}>⚡ VẤN ĐỀ CỐT LÕI</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                        {synthesis.core_conflict}
                      </p>
                    </div>
                  )}

                  {/* Future Path */}
                  {synthesis.future_path && (
                    <div style={{
                      background: 'rgba(100, 200, 150, 0.06)', border: '1px solid rgba(100, 200, 150, 0.15)',
                      borderRadius: '8px', padding: '10px 12px', marginBottom: '12px',
                    }}>
                      <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64c896', marginBottom: '4px' }}>🛤️ LỘ TRÌNH TƯƠNG LAI</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                        {synthesis.future_path}
                      </p>
                    </div>
                  )}

                  {/* Divine Advice */}
                  <div style={{
                    background: 'rgba(100, 180, 255, 0.06)', border: '1px solid rgba(100, 180, 255, 0.15)',
                    borderRadius: '10px', padding: '14px', marginBottom: '14px',
                  }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64b4ff', marginBottom: '6px' }}>💎 LỜI KHUYÊN TỐI QUAN TRỌNG</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
                      {synthesis.divine_advice}
                    </p>
                  </div>

                  {/* Key Message */}
                  <div style={{ background: 'var(--gradient-gold)', borderRadius: '10px', padding: '16px 20px', textAlign: 'center' }}>
                    <p style={{ color: '#0a0a12', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
                      ✦ &ldquo;{synthesis.key_message}&rdquo; ✦
                    </p>
                  </div>

                </div>
              </motion.div>
            )}

            <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleReset} className="btn-primary">Trải Bài Lại 🔄</button>
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
