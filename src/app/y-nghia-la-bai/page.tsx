import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMajorArcana, getMinorBySuit } from '@/data/tarot-cards';

export const metadata: Metadata = {
  title: 'Ý Nghĩa 78 Lá Bài Tarot — Thư Viện Tarot',
  description: 'Tra cứu ý nghĩa 78 lá bài Tarot: 22 lá Major Arcana và 56 lá Minor Arcana. Nghĩa xuôi, nghĩa ngược chi tiết.',
};

const suits = [
  { id: 'wands', label: 'Wands', icon: '🪄', desc: 'Lửa — Sáng tạo, Đam mê' },
  { id: 'cups', label: 'Cups', icon: '🏆', desc: 'Nước — Cảm xúc, Tình yêu' },
  { id: 'swords', label: 'Swords', icon: '⚔️', desc: 'Khí — Trí tuệ, Thử thách' },
  { id: 'pentacles', label: 'Pentacles', icon: '⭐', desc: 'Đất — Vật chất, Tài chính' },
];

export default function CardLibraryPage() {
  const majorCards = getMajorArcana();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ color: 'var(--gold-500)', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>
          THƯ VIỆN TAROT
        </p>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '12px' }}>
          Ý Nghĩa 78 Lá Bài Tarot
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          Khám phá ý nghĩa sâu sắc của từng lá bài — cả nghĩa xuôi và ngược.
        </p>
      </div>

      {/* Major Arcana */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ⭐ Major Arcana <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>— 22 lá</span>
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px',
        }}>
          {majorCards.map((card) => (
            <Link key={card.id} href={`/y-nghia-la-bai/${card.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ textAlign: 'center', transition: 'transform 0.2s' }}>
                <div style={{
                  width: '90px', height: '150px', borderRadius: '8px', overflow: 'hidden',
                  position: 'relative', margin: '0 auto',
                  border: '1.5px solid rgba(187, 161, 55, 0.2)',
                  transition: 'all 0.3s',
                }}>
                  <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
                </div>
                <p style={{
                  marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)',
                  fontFamily: 'var(--font-title)', lineHeight: 1.3,
                }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', fontSize: '0.65rem' }}>
                    {card.number}
                  </span>
                  {card.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Minor Arcana by Suit */}
      {suits.map((suit) => {
        const suitCards = getMinorBySuit(suit.id);
        return (
          <section key={suit.id} style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontFamily: 'var(--font-title)', fontSize: '1.2rem', color: 'var(--purple-300)',
              marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              {suit.icon} {suit.label}{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 400 }}>
                — {suit.desc} — {suitCards.length} lá
              </span>
            </h2>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '14px',
            }}>
              {suitCards.map((card) => (
                <Link key={card.id} href={`/y-nghia-la-bai/${card.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '80px', height: '133px', borderRadius: '6px', overflow: 'hidden',
                      position: 'relative', margin: '0 auto',
                      border: '1.5px solid var(--border)',
                      transition: 'all 0.3s',
                    }}>
                      <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <p style={{
                      marginTop: '4px', fontSize: '0.65rem', color: 'var(--text-muted)',
                      lineHeight: 1.2,
                    }}>
                      {card.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
