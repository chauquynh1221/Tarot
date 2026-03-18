'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { tarotCards } from '@/data/tarot-cards';

export default function CardOfTheDay() {
  const card = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % tarotCards.length;
    return tarotCards[index];
  }, []);

  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className={`tarot-card ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(true)}
        style={{ margin: '0 auto', cursor: 'pointer' }}
      >
        <div className="tarot-card-inner">
          <div className="tarot-card-face tarot-card-back" />
          <div className="tarot-card-face tarot-card-front">
            <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
          </div>
        </div>
      </div>

      {flipped ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '20px', maxWidth: '400px', margin: '20px auto 0' }}
        >
          <h3 style={{
            fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)',
            marginBottom: '8px',
          }}>
            {card.name}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>
            {card.description}
          </p>
          <Link href={`/y-nghia-la-bai/${card.slug}`} style={{
            color: 'var(--purple-400)', fontSize: '0.85rem', textDecoration: 'none',
            display: 'inline-block', marginTop: '12px',
          }}>
            Xem chi tiết →
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
