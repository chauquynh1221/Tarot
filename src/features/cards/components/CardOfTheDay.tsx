'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { tarotCards } from '../data/tarot-cards';

interface DailyReading {
  ten_la_bai: string;
  nang_luong_ngay: string;
  mo_dau: string;
  chi_tiet: {
    cong_viec: string;
    tinh_cam: string;
  };
  loi_nhan_chot: string;
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getEnergyColor(energy: string): string {
  if (energy.includes('Tích cực')) return '#22c55e';
  if (energy.includes('thận trọng')) return '#f59e0b';
  return '#8b8bff';
}

export default function CardOfTheDay() {
  const [card, setCard] = useState<typeof tarotCards[0] | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  // Pick card (localStorage-based per user per day)
  useEffect(() => {
    const todayKey = getTodayKey();
    const saved = localStorage.getItem('card-of-the-day');

    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.date === todayKey && data.slug) {
          const found = tarotCards.find(c => c.slug === data.slug);
          if (found) {
            setCard(found);
            setIsReversed(data.isReversed === true);
            if (data.reading) setReading(data.reading);
            return;
          }
        }
      } catch { /* ignore */ }
    }

    // Crypto-secure random: truly random card pick + reversed
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    const randomIndex = arr[0] % tarotCards.length;
    const reversed = arr[1] % 2 === 1; // 50/50
    const picked = tarotCards[randomIndex];
    setCard(picked);
    setIsReversed(reversed);
    localStorage.setItem('card-of-the-day', JSON.stringify({ date: todayKey, slug: picked.slug, isReversed: reversed }));
  }, []);

  // Fetch AI reading when card is flipped
  const handleFlip = async () => {
    if (flipped || !card) return;
    setFlipped(true);

    // If we already have a cached reading, don't fetch again
    if (reading) return;

    setLoadingAI(true);
    setAiError('');
    try {
      const res = await fetch('/api/reading/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: card.slug, isReversed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReading(data.reading);

      // Cache reading in localStorage
      const todayKey = getTodayKey();
      localStorage.setItem('card-of-the-day', JSON.stringify({
        date: todayKey, slug: card.slug, isReversed, reading: data.reading,
      }));
    } catch (err: any) {
      setAiError(err.message || 'Không thể kết nối AI');
    } finally {
      setLoadingAI(false);
    }
  };

  if (!card) return null;

  const energyColor = reading ? getEnergyColor(reading.nang_luong_ngay) : '#c8a455';

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={`tarot-card ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        style={{ margin: '0 auto', cursor: flipped ? 'default' : 'pointer' }}
      >
        <div className="tarot-card-inner">
          <div className="tarot-card-face tarot-card-back" />
          <div className="tarot-card-face tarot-card-front">
            <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover', transform: isReversed ? 'rotate(180deg)' : 'none' }} unoptimized />
          </div>
        </div>
      </div>

      {flipped ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '20px', maxWidth: '500px', margin: '20px auto 0' }}
        >
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '4px' }}>
            {card.name}
          </h3>
          {isReversed && (
            <p style={{ color: '#e8a090', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
              ↺ Ngược (Reversed)
            </p>
          )}

          {/* Loading state */}
          {loadingAI && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: 'rgba(200, 164, 85, 0.08)', border: '1px solid rgba(200, 164, 85, 0.2)',
                borderRadius: '12px', padding: '24px', marginBottom: '12px',
              }}
            >
              <p style={{ color: 'var(--gold-500)', fontSize: '0.9rem' }}>✦ Đang giải mã thông điệp cho bạn... ✦</p>
            </motion.div>
          )}

          {/* AI Error fallback */}
          {aiError && (
            <div style={{
              background: 'rgba(200, 164, 85, 0.08)', border: '1px solid rgba(200, 164, 85, 0.2)',
              borderRadius: '12px', padding: '16px 20px', marginBottom: '12px',
            }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
                {card.description}
              </p>
            </div>
          )}

          {/* AI Reading result */}
          {reading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Energy badge + opening */}
              <div style={{
                background: 'rgba(200, 164, 85, 0.08)', border: '1px solid rgba(200, 164, 85, 0.2)',
                borderRadius: '12px', padding: '20px', marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem',
                    fontWeight: 700, background: `${energyColor}18`, color: energyColor,
                    border: `1px solid ${energyColor}40`,
                  }}>
                    {reading.nang_luong_ngay}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', fontStyle: 'italic' }}>
                  {reading.mo_dau}
                </p>
              </div>

              {/* Work & Love */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div style={{
                  flex: 1, minWidth: '200px', background: 'rgba(100, 180, 255, 0.06)',
                  border: '1px solid rgba(100, 180, 255, 0.15)', borderRadius: '10px', padding: '14px',
                }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64b4ff', marginBottom: '6px', letterSpacing: '1px' }}>
                    💼 CÔNG VIỆC
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    {reading.chi_tiet.cong_viec}
                  </p>
                </div>
                <div style={{
                  flex: 1, minWidth: '200px', background: 'rgba(255, 130, 150, 0.06)',
                  border: '1px solid rgba(255, 130, 150, 0.15)', borderRadius: '10px', padding: '14px',
                }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ff8296', marginBottom: '6px', letterSpacing: '1px' }}>
                    💕 TÌNH CẢM
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    {reading.chi_tiet.tinh_cam}
                  </p>
                </div>
              </div>

              {/* Affirmation */}
              <div style={{
                background: 'var(--gradient-gold)', borderRadius: '10px', padding: '16px 20px',
                marginBottom: '12px',
              }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0a0a12', marginBottom: '4px', letterSpacing: '1px' }}>
                  ✦ THÔNG ĐIỆP HÔM NAY
                </p>
                <p style={{ color: '#0a0a12', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.6 }}>
                  &ldquo;{reading.loi_nhan_chot}&rdquo;
                </p>
              </div>
            </motion.div>
          )}

          <Link href={`/y-nghia-la-bai/${card.slug}`} style={{
            color: 'var(--purple-400)', fontSize: '0.85rem', textDecoration: 'none',
            display: 'inline-block', marginTop: '10px',
          }}>
            Xem chi tiết lá bài →
          </Link>
        </motion.div>
      ) : (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: 'var(--gold-500)', marginTop: '16px', fontSize: '0.85rem' }}
        >
          ✨ Chạm để lật ✨
        </motion.p>
      )}
    </div>
  );
}
