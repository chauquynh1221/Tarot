import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const blogData: Record<string, {
  title: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
}> = {
  'tarot-la-gi': {
    title: 'Tarot Là Gì? Hướng Dẫn Đầy Đủ Cho Người Mới Bắt Đầu',
    category: 'Kiến thức nền tảng',
    date: '15/03/2025',
    readTime: '8 phút',
    content: [
      'Tarot là một hệ thống biểu tượng gồm 78 lá bài, được sử dụng rộng rãi trong việc khám phá tiềm thức, thấu hiểu hiện tại và định hướng tương lai. Mỗi lá bài Tarot mang trong mình một câu chuyện, hình ảnh và ý nghĩa riêng biệt.',
      'Ban đầu được biết đến như một bộ bài chơi ở Châu Âu từ thế kỷ 15, Tarot dần phát triển thành một công cụ tâm linh được các nhà huyền học, chiêm tinh gia sử dụng. Bộ bài Tarot gồm 22 lá Ẩn Chính (Major Arcana) và 56 lá Ẩn Phụ (Minor Arcana).',
      '22 lá Ẩn Chính tượng trưng cho những bài học lớn và cột mốc trong cuộc sống. Chúng bao gồm các lá bài từ The Fool (0) đến The World (21), mỗi lá đại diện cho một khía cạnh khác nhau của hành trình cuộc đời.',
      '56 lá Ẩn Phụ chia thành 4 bộ: Gậy (Wands - Lửa), Cốc (Cups - Nước), Kiếm (Swords - Khí), Tiền (Pentacles - Đất). Mỗi bộ gồm các lá số từ Ace đến 10 và 4 lá cung đình: Page, Knight, Queen, King.',
      'Để bắt đầu với Tarot, bạn không cần có khả năng siêu nhiên. Chỉ cần một tâm trí cởi mở, sự tập trung và niềm tin vào trực giác của bản thân. Hãy bắt đầu bằng việc làm quen với từng lá bài và ý nghĩa của chúng.',
    ],
  },
  'y-nghia-22-la-an-chinh': {
    title: 'Ý Nghĩa 22 Lá Ẩn Chính (Major Arcana) Trong Tarot',
    category: 'Kiến thức nền tảng',
    date: '12/03/2025',
    readTime: '12 phút',
    content: [
      'Major Arcana - hay Ẩn Chính - là 22 lá bài quan trọng nhất trong bộ bài Tarot. Chúng đại diện cho những bài học lớn, những bước ngoặt và sự chuyển đổi trong cuộc đời.',
      'Bắt đầu với The Fool (Kẻ Khờ) - lá bài số 0, tượng trưng cho sự khởi đầu mới, bước nhảy của niềm tin vào những điều chưa biết. The Fool đại diện cho sự tự do, phiêu lưu và tiềm năng vô hạn.',
      'Tiếp theo là The Magician (Nhà Ảo Thuật), biểu tượng của sáng tạo và ý chí mạnh mẽ. The High Priestess (Nữ Tư Tế) đại diện cho trực giác và sự bí ẩn. The Empress (Nữ Hoàng) tượng trưng cho sự phong phú và nuôi dưỡng.',
      'Hành trình tiếp tục qua The Emperor (Hoàng Đế - quyền lực), The Hierophant (Giáo Hoàng - truyền thống), The Lovers (Đôi Tình Nhân - tình yêu), The Chariot (Cỗ Xe - chiến thắng), cho đến The World (Thế Giới) - sự hoàn thành viên mãn.',
      'Mỗi lá Ẩn Chính đều có cả nghĩa xuôi (upright) và nghĩa ngược (reversed). Nghĩa xuôi thường mang ý nghĩa tích cực, còn nghĩa ngược cảnh báo về những thử thách hoặc khía cạnh cần lưu ý.',
    ],
  },
};

const defaultContent = {
  title: 'Bài Viết Tarot',
  category: 'Kiến thức',
  date: '01/03/2025',
  readTime: '5 phút',
  content: [
    'Nội dung bài viết đang được cập nhật. Vui lòng quay lại sau để đọc đầy đủ.',
    'Trong khi chờ đợi, bạn có thể khám phá các bài viết khác trong blog hoặc thử trải bài Tarot miễn phí.',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogData[slug] || { ...defaultContent, title: slug.replace(/-/g, ' ') };
  return {
    title: post.title,
    description: post.content[0],
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogData[slug] || { ...defaultContent, title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '32px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Link href="/blog" style={{ color: 'var(--purple-400)', textDecoration: 'none' }}>
          Blog
        </Link>
        <span style={{ margin: '0 8px' }}>→</span>
        <span>{post.category}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <span style={{
          padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem',
          background: 'rgba(139, 92, 246, 0.1)', color: 'var(--purple-300)',
          border: '1px solid rgba(139, 92, 246, 0.2)', fontWeight: 600,
        }}>
          {post.category}
        </span>

        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800,
          fontFamily: 'var(--font-heading)', marginTop: '16px', marginBottom: '16px',
          lineHeight: 1.3,
        }}>
          {post.title}
        </h1>

        <div style={{
          display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem',
        }}>
          <span>📅 {post.date}</span>
          <span>⏱ {post.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <article style={{ marginBottom: '48px' }}>
        {post.content.map((paragraph, i) => (
          <p
            key={i}
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.9,
              marginBottom: '20px',
            }}
          >
            {paragraph}
          </p>
        ))}
      </article>

      {/* CTA */}
      <div className="glass-card" style={{
        padding: '32px', textAlign: 'center', marginBottom: '48px',
      }}>
        <h3 style={{
          fontSize: '1.2rem', fontFamily: 'var(--font-heading)',
          color: 'var(--gold-400)', marginBottom: '12px',
        }}>
          Muốn thử trải bài Tarot?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
          Áp dụng kiến thức vừa học vào thực tế. Trải bài miễn phí ngay!
        </p>
        <Link href="/boi-bai" className="btn-mystical" style={{ textDecoration: 'none' }}>
          Bói Bài Ngay ✨
        </Link>
      </div>

      {/* Back */}
      <Link href="/blog" style={{
        color: 'var(--purple-400)', textDecoration: 'none', fontSize: '0.95rem',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        ← Tất cả bài viết
      </Link>
    </div>
  );
}
