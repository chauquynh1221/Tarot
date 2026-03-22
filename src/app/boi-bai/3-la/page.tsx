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
  const [cardCount, setCardCount] = useState(3);
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
  const [loadingAI, setLoadingAI] = useState(false);
  const [synthesis, setSynthesis] = useState<any>(null);
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);

  // Create session via API
  const handleTopicSelect = useCallback(async (t: string) => {
    setTopic(t);
    setError('');
    setPhase('shuffle');

    // Start shuffle animation
    let round = 0;
    const interval = setInterval(() => {
      round++;
      setShuffleRound(round);
      if (round >= 4) {
        clearInterval(interval);
      }
    }, 700);

    try {
      const res = await fetch('/api/reading/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: t, cardCount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessionId(data.sessionId);

      // Wait for shuffle animation to finish
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (round >= 4) {
            clearInterval(check);
            resolve(null);
          }
        }, 200);
      });
      setTimeout(() => setPhase('select'), 300);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message);
      setPhase('topic');
    }
  }, [cardCount]);

  // User picks a face-down card
  const handleCardPick = useCallback((deckIndex: number) => {
    if (selectedIndices.includes(deckIndex) || selectedIndices.length >= cardCount) return;
    const newSelected = [...selectedIndices, deckIndex];
    setSelectedIndices(newSelected);

    if (newSelected.length === cardCount) {
      // Send picks to server
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
  }, [selectedIndices, cardCount, sessionId]);

  // Flip card in reveal phase
  const handleFlipCard = useCallback((index: number) => {
    setRevealedCards(prev => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === cardCount) {
        setTimeout(() => setPhase('interpreting'), 800);
      }
      return next;
    });
  }, [cardCount]);

  // Auto-flip all cards with stagger when entering reveal phase
  useEffect(() => {
    if (phase === 'reveal') {
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 0; i < cardCount; i++) {
        const t = setTimeout(() => handleFlipCard(i), 1000 + i * 600);
        timers.push(t);
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [phase, cardCount, handleFlipCard]);

  // Fetch AI interpretations — 1 call per card, all in parallel, then auto-synthesis
  const fetchAIInterpretations = useCallback(async (cards: CardResult[], cat: string) => {
    setLoadingAI(true);
    let results: any[] = [];
    try {
      // Fire all card interpretation requests in parallel
      const promises = cards.map(card =>
        fetch('/api/reading/interpret-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            card_id: card.card_id,
            name: card.name,
            isReversed: card.isReversed,
            category: cat,
          }),
        })
          .then(res => res.json())
          .catch(err => ({ card_id: card.card_id, name: card.name, isReversed: card.isReversed, interpretation: null, error: err.message }))
      );
      results = await Promise.all(promises);
      setInterpretations(results);
    } catch (err: any) {
      console.error('Interpret error:', err);
    } finally {
      setLoadingAI(false);
      setPhase('result');
    }

    // Auto-synthesis using fresh results directly (avoids stale closure)
    if (cards.length > 1) {
      // Build cardsData — use AI interpretation when available, fallback to raw card data
      const cardsData = results.map((r: any, i: number) => ({
        card_name: r.interpretation?.card_name || r.name || cards[i].name,
        position: positions[i]?.label || `Lá ${i + 1}`,
        orientation: r.interpretation?.orientation || (cards[i].isReversed ? 'Ngược' : 'Xuôi'),
        summary: r.interpretation?.summary || r.interpretation?.analysis || cards[i].meaning?.substring(0, 80) || '',
        analysis: r.interpretation?.analysis || r.interpretation?.summary || '',
      }));
      // Only skip synthesis if we have nothing at all
      if (cardsData.some(c => c.card_name)) {
        setLoadingSynthesis(true);
        const categoryLabel = topics.find(t => t.id === cat)?.label || cat;
        try {
          const controller = new AbortController();
          const synthTimeout = setTimeout(() => controller.abort(), 45000);
          const res = await fetch('/api/reading/synthesis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cards: cardsData, category: categoryLabel }),
            signal: controller.signal,
          });
          clearTimeout(synthTimeout);
          const data = await res.json();
          if (res.ok && data.synthesis) {
            setSynthesis(data.synthesis);
          } else {
            setSynthesis({
              overall_theme: `Bức tranh ${categoryLabel}`,
              narrative: results.map((r: any) => r.interpretation?.summary || r.name).filter(Boolean).join('. ') + '.',
              combined_advice: 'Hãy lắng nghe trực giác của bạn.',
              final_thought: 'Mọi con đường đều dẫn đến ánh sáng bên trong bạn.',
            });
          }
        } catch (synthErr: any) {
          console.error('Synthesis error:', synthErr);
          setSynthesis({
            overall_theme: 'Thông điệp từ vũ trụ',
            narrative: results.map((r: any) => r.interpretation?.summary || r.name).filter(Boolean).join('. ') + '.',
            combined_advice: 'Hãy tin tưởng vào hành trình của bạn.',
            final_thought: 'Ánh sáng luôn chờ đợi bên trong bạn.',
          });
        } finally {
          setLoadingSynthesis(false);
        }
      }
    }

  }, []);

  // Auto-fetch AI when entering interpreting phase
  useEffect(() => {
    if (phase === 'interpreting' && resultCards.length > 0 && interpretations.length === 0) {
      fetchAIInterpretations(resultCards, topic);
    }
  }, [phase, resultCards, topic, interpretations.length, fetchAIInterpretations]);



  // Synthesis: combine all card interpretations
  const handleSynthesis = useCallback(async () => {
    const validCards = interpretations.filter((x: any) => x.interpretation);
    if (validCards.length < 2) return;
    setLoadingSynthesis(true);
    try {
      const cardsData = validCards.map((x: any, i: number) => ({
        card_name: x.interpretation.card_name || x.name,
        position: positions[i]?.label || `Lá ${i + 1}`,
        orientation: x.interpretation.orientation || (x.isReversed ? 'Ngược' : 'Xuôi'),
        summary: x.interpretation.summary || '',
        analysis: x.interpretation.analysis || '',
      }));

      const categoryLabel = topics.find(t => t.id === topic)?.label || topic;

      // Timeout after 30 seconds
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('/api/reading/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: cardsData, category: categoryLabel }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.synthesis) {
        setSynthesis(data.synthesis);
      } else {
        // Fallback: create synthesis from existing interpretations
        setSynthesis({
          overall_theme: `Bức tranh ${categoryLabel}`,
          narrative: validCards.map((x: any) => x.interpretation.summary).filter(Boolean).join('. ') + '.',
          combined_advice: validCards.find((x: any) => x.interpretation.advice)?.interpretation.advice || 'Hãy lắng nghe trực giác của bạn.',
          final_thought: 'Mọi con đường đều dẫn đến ánh sáng bên trong bạn.',
        });
      }
    } catch (err: any) {
      console.error('Synthesis error:', err);
      // Fallback on any error (timeout, network, etc.)
      const validCards = interpretations.filter((x: any) => x.interpretation);
      setSynthesis({
        overall_theme: 'Thông điệp từ vũ trụ',
        narrative: validCards.map((x: any) => x.interpretation?.summary).filter(Boolean).join('. ') + '.',
        combined_advice: 'Hãy tin tưởng vào hành trình của bạn.',
        final_thought: 'Ánh sáng luôn chờ đợi bên trong bạn.',
      });
    } finally {
      setLoadingSynthesis(false);
    }
  }, [interpretations, topic]);

  // Auto-trigger synthesis once interpretations load (for multi-card spreads)
  // NOTE: The main auto-synthesis now runs inline inside fetchAIInterpretations.
  // This useEffect handles the edge case where user manually navigates back to result phase.
  useEffect(() => {
    if (
      phase === 'result' &&
      cardCount > 1 &&
      interpretations.length > 0 &&
      !synthesis &&
      !loadingSynthesis
    ) {
      // Only trigger via handleSynthesis if inline synthesis somehow didn't run
      handleSynthesis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synthesis, loadingSynthesis]);


  // Reset
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
              Trải Bài Tarot
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.7 }}>
              Hít thở sâu, tĩnh tâm và chọn chủ đề bạn muốn hỏi.
            </p>

            {/* Card count selector */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
              {[1, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setCardCount(n)}
                  style={{
                    padding: '12px 28px', borderRadius: '12px', cursor: 'pointer',
                    border: cardCount === n ? '2px solid var(--gold-400)' : '2px solid var(--border)',
                    background: cardCount === n ? 'rgba(200,164,85,0.12)' : 'transparent',
                    color: cardCount === n ? 'var(--gold-400)' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: '0.95rem',
                    transition: 'all 0.3s',
                  }}
                >
                  {n === 1 ? '🃏 1 Lá' : '🃏🃏🃏 3 Lá'}
                </button>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              maxWidth: '800px',
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
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              height: '440px', position: 'relative',
            }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '160px', height: '267px',
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
                    duration: 1.2, repeat: Infinity,
                    ease: 'easeInOut', delay: i * 0.06,
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

        {/* ===== PHASE 3: CARD SELECTION — 78 face-down cards ===== */}
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
              Hãy suy ngẫm điều bạn cần giải đáp và chọn {cardCount} lá bài
            </p>

            {/* Position indicators */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '36px' }}>
              {(cardCount === 1 ? [{ label: 'Thông điệp', desc: '' }] : positions).map((pos, i) => (
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

            {/* Mobile: Auto-pick button */}
            {isMobile && selectedIndices.length < cardCount && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '20px' }}
              >
                <button
                  onClick={() => {
                    // Pick random unique indices
                    const available = Array.from({ length: ROW_SIZE * 2 }, (_, i) => i)
                      .filter(i => !selectedIndices.includes(i));
                    const needed = cardCount - selectedIndices.length;
                    const picks: number[] = [];
                    while (picks.length < needed && available.length > 0) {
                      const idx = Math.floor(Math.random() * available.length);
                      picks.push(available.splice(idx, 1)[0]);
                    }
                    picks.forEach((p, delay) =>
                      setTimeout(() => handleCardPick(p), delay * 300)
                    );
                  }}
                  style={{
                    padding: '14px 32px',
                    background: 'var(--gradient-gold)',
                    border: 'none',
                    borderRadius: '50px',
                    color: '#0a0a12',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(200,164,85,0.4)',
                    letterSpacing: '0.5px',
                  }}
                >
                  ✨ Chọn Ngẫu Nhiên
                </button>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '8px' }}>
                  Hoặc chạm vào lá bài để chọn thủ công
                </p>
              </motion.div>
            )}

            {loading && (
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: 'var(--gold-500)', marginBottom: '24px', fontSize: '0.9rem' }}
              >
                ✦ Đang giải mã lá bài... ✦
              </motion.p>
            )}

            {/* ROW 1 */}
            <div style={{
              border: '1px solid rgba(200, 164, 85, 0.15)',
              borderRadius: '12px',
              padding: '30px 20px',
              marginBottom: '28px',
              position: 'relative',
              overflow: 'visible',
              minHeight: isMobile ? '160px' : '280px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                position: 'relative', height: '260px',
              }}>
                {Array.from({ length: ROW_SIZE }).map((_, i) => {
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= cardCount && !isPicked;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative', flex: '1 1 0', minWidth: 0,
                        height: '240px',
                        cursor: isPicked || isDisabled || loading ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled && !loading ? { zIndex: 50 } : {}}
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
                          position: 'absolute', bottom: 0, left: '50%',
                          width: isMobile ? '70px' : '150px',
                          height: isMobile ? '112px' : '240px',
                          marginLeft: isMobile ? '-35px' : '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat',
                          borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked
                            ? '0 0 30px rgba(200, 164, 85, 0.4), 0 -10px 30px rgba(200, 164, 85, 0.1)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled && !loading ? {
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
              padding: '30px 20px',
              position: 'relative',
              overflow: 'visible',
              minHeight: '280px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                position: 'relative', height: '260px',
              }}>
                {Array.from({ length: ROW_SIZE }).map((_, j) => {
                  const i = ROW_SIZE + j;
                  const isPicked = selectedIndices.includes(i);
                  const pickNumber = selectedIndices.indexOf(i) + 1;
                  const isDisabled = selectedIndices.length >= cardCount && !isPicked;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: j * 0.02 + 0.3 }}
                      onClick={() => handleCardPick(i)}
                      style={{
                        position: 'relative', flex: '1 1 0', minWidth: 0,
                        height: '240px',
                        cursor: isPicked || isDisabled || loading ? 'default' : 'pointer',
                        zIndex: isPicked ? 50 : 1,
                      }}
                      whileHover={!isPicked && !isDisabled && !loading ? { zIndex: 50 } : {}}
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
                          position: 'absolute', bottom: 0, left: '50%',
                          width: '150px', height: '240px', marginLeft: '-75px',
                          background: 'url(/cards/card-back.png) center/cover no-repeat',
                          borderRadius: '10px',
                          border: isPicked ? '2.5px solid var(--gold-400)' : '1.5px solid rgba(200, 164, 85, 0.1)',
                          boxShadow: isPicked
                            ? '0 0 30px rgba(200, 164, 85, 0.4), 0 -10px 30px rgba(200, 164, 85, 0.1)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                          opacity: isDisabled ? 0.25 : 1,
                        }}
                        animate={isPicked ? { y: -100 } : { y: 0 }}
                        whileHover={!isPicked && !isDisabled && !loading ? {
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
        {phase === 'reveal' && resultCards.length > 0 && (
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
                Chạm vào từng lá bài để lật
              </p>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap',
            }}>
              {resultCards.map((card, i) => (
                <motion.div
                  key={card.card_id}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring', stiffness: 150 }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{
                    color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 700,
                    marginBottom: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                  }}>
                    {cardCount === 1 ? 'Thông điệp' : positions[i]?.label}
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
                          style={{ objectFit: 'cover', transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
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
                      {card.isReversed && (
                        <span style={{ color: '#e8a090', fontSize: '0.75rem' }}>(Ngược)</span>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {revealedCards.size < cardCount && (
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

        {/* ===== PHASE 5: INTERPRETING (LOADING) ===== */}
        {phase === 'interpreting' && (
          <motion.div
            key="interpreting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Cosmic orb */}
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 40px' }}>
              {/* Central glow */}
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
              {/* Orbiting stars */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
                    transformOrigin: 'center',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: `${10 + i * 8}%`, left: '50%',
                    width: `${6 - i * 0.5}px`, height: `${6 - i * 0.5}px`, borderRadius: '50%',
                    background: i % 2 === 0 ? 'var(--gold-400)' : 'var(--teal-300)',
                    boxShadow: `0 0 ${10 + i * 3}px ${i % 2 === 0 ? 'var(--gold-glow)' : 'rgba(100, 180, 255, 0.5)'}`,
                  }} />
                </motion.div>
              ))}
              {/* Card fan animation */}
              {resultCards.slice(0, 3).map((card, i) => (
                <motion.div
                  key={card.card_id}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [(i - 1) * 15, (i - 1) * 18, (i - 1) * 15],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: '60px', height: '100px', borderRadius: '6px', overflow: 'hidden',
                    border: '1.5px solid rgba(200, 164, 85, 0.4)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    transformOrigin: 'bottom center',
                    marginLeft: '-30px', marginTop: '-70px',
                  }}
                >
                  <Image src={card.image} alt="" fill style={{ objectFit: 'cover', opacity: 0.7 }} unoptimized />
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
              Vũ trụ đang giải mã thông điệp từ {cardCount} lá bài của bạn...
            </motion.p>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '28px', justifyContent: 'center' }}>
              {resultCards.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], background: ['rgba(200,164,85,0.3)', 'rgba(200,164,85,1)', 'rgba(200,164,85,0.3)'] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(200,164,85,0.3)' }}
                />
              ))}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
              ✦ Năng lượng đang được kết nối ✦
            </p>
          </motion.div>
        )}

        {/* ===== PHASE 6: RESULT ===== */}
        {phase === 'result' && resultCards.length > 0 && (
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

            {/* Individual cards + AI */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {resultCards.map((card, i) => {
                const interp = interpretations.find((x: any) => x.card_id === card.card_id);
                return (
                  <motion.div
                    key={card.card_id}
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
                          style={{ objectFit: 'cover', transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
                          unoptimized
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <span className="tag" style={{ background: 'var(--gradient-teal)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.72rem' }}>
                            {cardCount === 1 ? 'Thông điệp' : positions[i]?.label}
                          </span>
                          <h3 style={{
                            fontSize: '1.3rem', fontWeight: 700,
                            fontFamily: 'var(--font-title)', color: 'var(--gold-300)',
                          }}>
                            {card.name}
                            {card.isReversed && <span style={{ color: '#e8a090', fontSize: '0.8rem', marginLeft: '8px' }}>(Ngược)</span>}
                          </h3>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '10px' }}>
                          {cardCount === 1 ? 'Thông điệp dành cho bạn' : positions[i]?.desc}
                        </p>

                        {/* AI Interpretation */}
                        {interp?.interpretation ? (
                          <div>
                            <p style={{ color: 'var(--gold-400)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                              {interp.interpretation.summary}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.85, marginBottom: '12px' }}>
                              {interp.interpretation.analysis}
                            </p>
                            <div style={{
                              background: 'rgba(100, 180, 255, 0.06)', border: '1px solid rgba(100, 180, 255, 0.15)',
                              borderRadius: '8px', padding: '12px 14px', marginBottom: '10px',
                            }}>
                              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64b4ff', marginBottom: '4px' }}>💡 LỜI KHUYÊN</p>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                {interp.interpretation.advice}
                              </p>
                            </div>
                            <div style={{
                              background: 'rgba(200, 164, 85, 0.08)', borderRadius: '8px', padding: '10px 14px',
                            }}>
                              <p style={{ color: 'var(--gold-400)', fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                                ✦ &ldquo;{interp.interpretation.affirmation}&rdquo;
                              </p>
                            </div>
                          </div>
                        ) : interp?.error ? (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.85 }}>
                            {card.meaning}
                          </p>
                        ) : (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.93rem', lineHeight: 1.85 }}>
                            {card.meaning}
                          </p>
                        )}

                        <Link href={`/y-nghia-la-bai/${card.slug}`} style={{
                          display: 'inline-block', marginTop: '10px',
                          color: 'var(--teal-300)', fontSize: '0.82rem', textDecoration: 'none',
                        }}>
                          Xem chi tiết {card.name} →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Loading AI */}
            {loadingAI && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}
              >
                <p style={{ color: 'var(--gold-500)', fontSize: '0.9rem' }}>✦ Vũ trụ đang giải mã ý nghĩa lá bài cho bạn... ✦</p>
              </motion.div>
            )}

            {/* Synthesis Section */}
            {!synthesis && !loadingSynthesis && interpretations.length > 0 && cardCount > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <button
                  onClick={handleSynthesis}
                  className="btn-primary"
                  style={{ padding: '14px 36px', fontSize: '1rem' }}
                >
                  🔮 Xem Tổng Kết Ý Nghĩa
                </button>
              </div>
            )}

            {loadingSynthesis && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}
              >
                <p style={{ color: 'var(--gold-500)', fontSize: '0.9rem' }}>✦ Năng lượng đang xâu chuỗi ý nghĩa các lá bài... ✦</p>
              </motion.div>
            )}

            {synthesis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px' }}
              >
                <div style={{
                  background: 'rgba(200, 164, 85, 0.06)', border: '1px solid rgba(200, 164, 85, 0.2)',
                  borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gradient-gold)' }} />
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '6px', textAlign: 'center' }}>
                    🔮 Tổng Kết Trải Bài
                  </h3>
                  <p style={{ textAlign: 'center', color: 'var(--gold-500)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px' }}>
                    {synthesis.overall_theme}
                  </p>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.9, marginBottom: '20px' }}>
                    {synthesis.narrative}
                  </p>

                  <div style={{
                    background: 'rgba(100, 180, 255, 0.06)', border: '1px solid rgba(100, 180, 255, 0.15)',
                    borderRadius: '10px', padding: '16px', marginBottom: '16px',
                  }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64b4ff', marginBottom: '6px' }}>💎 LỜI KHUYÊN TỔNG HỢP</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
                      {synthesis.combined_advice}
                    </p>
                  </div>

                  <div style={{
                    background: 'var(--gradient-gold)', borderRadius: '10px', padding: '16px 20px', textAlign: 'center',
                  }}>
                    <p style={{ color: '#0a0a12', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
                      ✦ &ldquo;{synthesis.final_thought}&rdquo; ✦
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
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
