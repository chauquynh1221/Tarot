import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bói Bài Tarot Online - Chọn Kiểu Trải Bài',
  description: 'Chọn kiểu trải bài Tarot phù hợp: Trải bài 3 lá, Yes/No Tarot, Tarot tình yêu, sự nghiệp, tài chính. Bói bài miễn phí.',
};

const spreadTypes = [
  {
    icon: '🃏', title: 'Trải Bài 3 Lá', subtitle: 'Quá Khứ — Hiện Tại — Tương Lai',
    desc: 'Phương pháp kinh điển giúp bạn nhìn thấy bức tranh toàn cảnh về quá khứ, hiện tại và tương lai. Chọn chủ đề (Tình Yêu, Sự Nghiệp, Tài Chính...) và rút 3 lá bài.',
    cards: '3 lá',
    href: '/boi-bai/3-la',
  },
  {
    icon: '✅', title: 'Yes / No Tarot', subtitle: 'Một câu hỏi — Một câu trả lời',
    desc: 'Đặt một câu hỏi Có/Không, rút 1 lá bài duy nhất và nhận câu trả lời nhanh chóng từ vũ trụ.',
    cards: '1 lá',
    href: '/boi-bai/yes-no',
  },
  {
    icon: '☘️', title: 'Celtic Cross', subtitle: 'Phân tích chuyên sâu — 10 vị trí',
    desc: 'Phương pháp trải bài toàn diện nhất trong Tarot. 10 lá bài giúp phân tích sâu về tình huống hiện tại, thử thách, mục tiêu, và kết quả cuối cùng.',
    cards: '10 lá',
    href: '/boi-bai/celtic-cross',
  },
  {
    icon: '🔮', title: 'Hỏi Vũ Trụ', subtitle: 'Câu hỏi bất kỳ — Vũ trụ trả lời',
    desc: 'Đặt câu hỏi tự do bất kỳ. Hệ thống sẽ tự bốc 3 lá bài và dùng AI tìm kiếm ngữ nghĩa để đưa ra câu trả lời sát nhất.',
    cards: '3 lá (tự động)',
    href: '/boi-bai/cau-hoi',
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
              {'cards' in spread && (
                <p style={{ marginTop: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-400)' }}>
                  🎴 {spread.cards}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
