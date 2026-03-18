import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { tarotCards, getCardBySlug } from '@/data/tarot-cards';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return tarotCards.map(card => ({ slug: card.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};
  return {
    title: `${card.name} — Ý Nghĩa Lá Bài Tarot`,
    description: card.description,
  };
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  // Related cards
  const related = tarotCards
    .filter(c => c.id !== card.id && c.arcana === card.arcana && c.suit === card.suit)
    .slice(0, 4);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '28px', display: 'flex', gap: '8px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <Link href="/y-nghia-la-bai" style={{ color: 'var(--purple-400)', textDecoration: 'none' }}>78 Lá Bài</Link>
        <span style={{ color: 'var(--text-muted)' }}>→</span>
        <span style={{ color: 'var(--text-secondary)' }}>{card.name}</span>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap', marginBottom: '48px' }}>
        {/* Card image */}
        <div style={{
          width: '220px', height: '367px', borderRadius: '14px', overflow: 'hidden',
          position: 'relative', flexShrink: 0,
          border: '3px solid rgba(187, 161, 55, 0.3)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          margin: '0 auto',
        }}>
          <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
        </div>

        {/* Card info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="tag" style={{ fontSize: '0.7rem' }}>
              {card.arcana === 'major' ? 'Major Arcana' : `Minor — ${card.suit}`}
            </span>
            {card.element && (
              <span className="tag" style={{ fontSize: '0.7rem' }}>
                {card.element}
              </span>
            )}
            {card.zodiac && (
              <span className="tag" style={{ fontSize: '0.7rem' }}>
                {card.zodiac}
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 700,
            color: 'var(--gold-400)', marginBottom: '6px',
          }}>
            {card.name}
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            #{card.number} {card.arcana === 'major' ? 'in Major Arcana' : `of ${card.suit?.charAt(0).toUpperCase()}${card.suit?.slice(1)}`}
          </p>

          <p style={{
            color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px',
          }}>
            {card.detailedMeaning}
          </p>

          {/* Upright */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--purple-300)', fontWeight: 700, marginBottom: '10px' }}>
              ☀️ Nghĩa Xuôi (Upright)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {card.upright.map((m, i) => (
                <span key={i} className="tag">{m}</span>
              ))}
            </div>
          </div>

          {/* Reversed */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#fca5a5', fontWeight: 700, marginBottom: '10px' }}>
              🌙 Nghĩa Ngược (Reversed)
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {card.reversed.map((m, i) => (
                <span key={i} className="tag tag-reversed">{m}</span>
              ))}
            </div>
          </div>

          {/* Yes/No */}
          <div style={{
            display: 'inline-block', padding: '8px 16px', borderRadius: '10px',
            background: card.yesNo === 'yes' ? 'rgba(34, 197, 94, 0.1)' : card.yesNo === 'no' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${card.yesNo === 'yes' ? '#22c55e30' : card.yesNo === 'no' ? '#ef444430' : '#f59e0b30'}`,
            fontSize: '0.85rem',
          }}>
            <span style={{ fontWeight: 700, color: card.yesNo === 'yes' ? '#22c55e' : card.yesNo === 'no' ? '#ef4444' : '#f59e0b' }}>
              Yes/No: {card.yesNo === 'yes' ? 'CÓ' : card.yesNo === 'no' ? 'KHÔNG' : 'CÓ THỂ'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="result-card" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', color: 'var(--gold-400)', marginBottom: '16px' }}>
          📖 Ý Nghĩa Chi Tiết
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 2, fontSize: '1rem' }}>
          {card.description}
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 2, fontSize: '1rem', marginTop: '12px' }}>
          {card.detailedMeaning}
        </p>
      </div>

      {/* Related cards */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: 'var(--purple-300)', marginBottom: '20px' }}>
            Lá Bài Liên Quan
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {related.map((r) => (
              <Link key={r.id} href={`/y-nghia-la-bai/${r.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ textAlign: 'center', width: '90px' }}>
                  <div style={{
                    width: '80px', height: '133px', borderRadius: '6px', overflow: 'hidden',
                    position: 'relative', margin: '0 auto',
                    border: '1.5px solid var(--border)', transition: 'all 0.3s',
                  }}>
                    <Image src={r.image} alt={r.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <p style={{ marginTop: '4px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{r.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Link href="/boi-bai/3-la" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 36px' }}>
          Trải Bài Với Lá Này ✨
        </Link>
      </div>
    </div>
  );
}
