'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import CardOfTheDay from '@/components/CardOfTheDay';
import { tarotCards } from '@/data/tarot-cards';

const readingTypes = [
  { icon: '🃏', title: 'Trải Bài 3 Lá', desc: 'Quá khứ — Hiện tại — Tương lai', href: '/boi-bai/3-la' },
  { icon: '✅', title: 'Yes / No Tarot', desc: 'Câu trả lời Có hoặc Không', href: '/boi-bai/yes-no' },
  { icon: '💕', title: 'Tarot Tình Yêu', desc: 'Giải mã tình cảm đôi lứa', href: '/boi-bai/3-la?topic=love' },
  { icon: '💼', title: 'Tarot Sự Nghiệp', desc: 'Định hướng con đường phát triển', href: '/boi-bai/3-la?topic=career' },
];

// Show a few featured cards
const featuredCards = tarotCards.filter(c => c.arcana === 'major').slice(0, 6);

export default function HomePage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ===== HERO ===== */}
      <section style={{
        minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 40px', position: 'relative',
      }}>
        <div style={{ maxWidth: '900px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '2.5rem', marginBottom: '16px' }}
          >
            ✦
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              color: 'var(--gold-500)', fontSize: '0.85rem', letterSpacing: '3px',
              textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px',
            }}
          >
            Lắng Nghe Vũ Trụ — Hiểu Rõ Chính Mình
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
              lineHeight: 1.2, marginBottom: '24px', fontFamily: 'var(--font-title)',
            }}
          >
            Khám Phá Bản Thân{' '}
            <span style={{
              background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Qua Lá Bài Tarot
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            style={{
              color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8,
              maxWidth: '620px', margin: '0 auto 36px',
            }}
          >
            Bói bài Tarot online miễn phí. Trải bài 3 lá, Yes/No, giải mã 78 lá bài
            — giúp bạn tìm câu trả lời cho tình yêu, sự nghiệp và cuộc sống.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/boi-bai/3-la" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 36px', fontSize: '1.05rem' }}>
              Trải Bài Ngay ✨
            </Link>
            <Link href="/y-nghia-la-bai" className="btn-gold" style={{ textDecoration: 'none', padding: '14px 36px', fontSize: '1.05rem' }}>
              78 Lá Bài 📖
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== READING TYPES ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="section-title">
          <h2>Chọn Kiểu Trải Bài</h2>
          <p>Mỗi kiểu trải bài mang đến góc nhìn khác nhau. Hãy chọn cách bạn muốn kết nối với vũ trụ.</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px',
        }}>
          {readingTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={type.href} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>{type.icon}</div>
                  <h3 style={{
                    fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px',
                    color: 'var(--text-primary)', fontFamily: 'var(--font-title)',
                  }}>{type.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{type.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CARD OF THE DAY ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="section-title">
          <h2>Lá Bài Hôm Nay</h2>
          <p>Mỗi ngày vũ trụ gửi đến bạn một thông điệp. Chạm vào lá bài để khám phá.</p>
        </div>
        <CardOfTheDay />
      </section>

      {/* ===== FEATURED CARDS ===== */}
      <section style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="section-title">
          <h2>Bộ Ẩn Chính</h2>
          <p>22 lá bài Major Arcana — những bài học lớn nhất trong cuộc sống</p>
        </div>

        <div style={{
          display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {featuredCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/y-nghia-la-bai/${card.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '120px', textAlign: 'center',
                }}>
                  <div style={{
                    width: '100px', height: '167px', borderRadius: '8px',
                    overflow: 'hidden', position: 'relative',
                    border: '2px solid rgba(187, 161, 55, 0.2)',
                    transition: 'all 0.3s',
                    margin: '0 auto',
                  }}>
                    <Image src={card.image} alt={card.name} fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                  <p style={{
                    marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)',
                    fontFamily: 'var(--font-title)',
                  }}>
                    {card.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/y-nghia-la-bai" className="btn-gold" style={{
            textDecoration: 'none', padding: '12px 32px', fontSize: '0.9rem',
          }}>
            Xem Tất Cả 78 Lá →
          </Link>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '550px', margin: '0 auto' }}
        >
          <p style={{ fontSize: '2rem', marginBottom: '16px' }}>✦</p>
          <h2 style={{
            fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-title)',
            marginBottom: '16px',
          }}>
            Sẵn Sàng Khám Phá?
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px',
          }}>
            Đặt câu hỏi, hít thở sâu và để vũ trụ gửi đến bạn thông điệp qua lá bài Tarot.
          </p>
          <Link href="/boi-bai/3-la" className="btn-primary" style={{
            textDecoration: 'none', padding: '16px 48px', fontSize: '1.1rem',
          }}>
            Bắt Đầu 🌟
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
