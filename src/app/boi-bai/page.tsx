import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bói Bài Tarot Online - Chọn Kiểu Trải Bài',
  description: 'Chọn kiểu trải bài Tarot phù hợp: Trải bài 3 lá, Yes/No Tarot, Tarot tình yêu, sự nghiệp, tài chính. Bói bài miễn phí.',
};

const spreadTypes = [
  {
    icon: '🃏', title: 'Trải Bài 3 Lá', subtitle: 'Quá Khứ — Hiện Tại — Tương Lai',
    desc: 'Phương pháp kinh điển giúp bạn nhìn thấy bức tranh toàn cảnh.',
    href: '/boi-bai/3-la',
  },
  {
    icon: '✅', title: 'Yes / No Tarot', subtitle: 'Một câu hỏi — Một câu trả lời',
    desc: 'Rút 1 lá bài duy nhất để nhận câu trả lời Có hoặc Không.',
    href: '/boi-bai/yes-no',
  },
  {
    icon: '💕', title: 'Tarot Tình Yêu', subtitle: 'Giải mã tình cảm đôi lứa',
    desc: 'Tìm hiểu sâu về mối quan hệ tình cảm và tương lai tình yêu.',
    href: '/boi-bai/3-la?topic=love',
  },
  {
    icon: '💼', title: 'Tarot Sự Nghiệp', subtitle: 'Định hướng con đường',
    desc: 'Nhận thông điệp từ vũ trụ về công việc và hướng phát triển.',
    href: '/boi-bai/3-la?topic=career',
  },
  {
    icon: '💰', title: 'Tarot Tài Chính', subtitle: 'Vận may tài lộc',
    desc: 'Dự đoán vận may tài chính và lời khuyên quản lý tiền bạc.',
    href: '/boi-bai/3-la?topic=finance',
  },
  {
    icon: '🌟', title: 'Tarot Tổng Quan', subtitle: 'Thông điệp cho ngày mới',
    desc: 'Nhận thông điệp tổng quan từ vũ trụ cho ngày hôm nay.',
    href: '/boi-bai/3-la?topic=general',
  },
];

export default function BoiBaiPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <p style={{
          color: 'var(--gold-500)', fontSize: '0.85rem', letterSpacing: '3px',
          textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px',
        }}>
          Bói Bài Tarot Online
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
          fontFamily: 'var(--font-heading)', marginBottom: '16px',
        }}>
          Chọn Kiểu{' '}
          <span style={{
            background: 'var(--gradient-gold)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Trải Bài</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
          Hít thở sâu, tĩnh tâm và đặt câu hỏi trong lòng trước khi chọn.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {spreadTypes.map((spread) => (
          <Link key={spread.title} href={spread.href} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '32px', height: '100%', cursor: 'pointer' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{spread.icon}</div>
              <h2 style={{
                fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px',
                color: 'var(--text-primary)', fontFamily: 'var(--font-heading)',
              }}>
                {spread.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--gold-500)', fontWeight: 600, marginBottom: '12px' }}>
                {spread.subtitle}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {spread.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
