import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Tarot - Kiến Thức & Bài Viết',
  description: 'Khám phá kiến thức Tarot qua các bài viết chuyên sâu về tình yêu, sự nghiệp, tài chính và phát triển bản thân.',
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  icon: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'tarot-la-gi',
    title: 'Tarot Là Gì? Hướng Dẫn Đầy Đủ Cho Người Mới Bắt Đầu',
    excerpt: 'Tìm hiểu tất cả về Tarot từ nguồn gốc, cấu tạo bộ bài 78 lá đến cách đọc bài cơ bản. Bài viết toàn diện nhất cho người mới.',
    category: 'Kiến thức nền tảng',
    categoryColor: '#8b5cf6',
    date: '15/03/2025',
    readTime: '8 phút',
    icon: '📚',
  },
  {
    slug: 'y-nghia-22-la-an-chinh',
    title: 'Ý Nghĩa 22 Lá Ẩn Chính (Major Arcana) Trong Tarot',
    excerpt: 'Giải mã chi tiết 22 lá bài Ẩn Chính - những bài học lớn nhất mà vũ trụ muốn gửi đến bạn qua bộ bài Tarot.',
    category: 'Kiến thức nền tảng',
    categoryColor: '#8b5cf6',
    date: '12/03/2025',
    readTime: '12 phút',
    icon: '⭐',
  },
  {
    slug: 'tarot-tinh-yeu-huong-dan',
    title: 'Hướng Dẫn Đọc Tarot Tình Yêu: Hỏi Gì Và Như Thế Nào?',
    excerpt: 'Bí quyết đặt câu hỏi đúng khi trải bài Tarot về tình yêu. Các trải bài phổ biến và cách giải mã thông điệp tình cảm.',
    category: 'Tình yêu',
    categoryColor: '#ec4899',
    date: '10/03/2025',
    readTime: '7 phút',
    icon: '💕',
  },
  {
    slug: 'nhan-dien-red-flag-tarot',
    title: 'Nhận Diện "Red Flag" Qua Lăng Kính Tarot',
    excerpt: 'Bài học cảnh tỉnh cho những mối quan hệ độc hại. Những lá bài nào cảnh báo bạn nên cẩn thận trong tình yêu?',
    category: 'Tình yêu',
    categoryColor: '#ec4899',
    date: '08/03/2025',
    readTime: '6 phút',
    icon: '🚩',
  },
  {
    slug: 'tarot-su-nghiep-2025',
    title: 'Tarot Sự Nghiệp 2025: Thông Điệp Cho Từng Cung Hoàng Đạo',
    excerpt: 'Dự đoán xu hướng sự nghiệp năm 2025 cho 12 cung hoàng đạo qua lá bài Tarot. Cơ hội và thách thức nào đang chờ bạn?',
    category: 'Sự nghiệp & Tài chính',
    categoryColor: '#f59e0b',
    date: '05/03/2025',
    readTime: '10 phút',
    icon: '💼',
  },
  {
    slug: 'tarot-tai-chinh',
    title: 'Trải Bài Tarot Cho Tài Chính: Nên Hỏi Gì?',
    excerpt: 'Cách sử dụng Tarot để nhận thông điệp về tài chính, đầu tư và quản lý tiền bạc. Những lá bài tốt lành nhất cho tài chính.',
    category: 'Sự nghiệp & Tài chính',
    categoryColor: '#f59e0b',
    date: '03/03/2025',
    readTime: '8 phút',
    icon: '💰',
  },
  {
    slug: '4-nguyen-to-tarot',
    title: 'Làm Quen Với 4 Nguyên Tố Trong Tarot: Lửa, Nước, Khí và Đất',
    excerpt: 'Hiểu rõ cách 4 nguyên tố ảnh hưởng đến ý nghĩa của từng bộ bài: Gậy (Lửa), Cốc (Nước), Kiếm (Khí), Tiền (Đất).',
    category: 'Kiến thức nền tảng',
    categoryColor: '#8b5cf6',
    date: '01/03/2025',
    readTime: '6 phút',
    icon: '🌊',
  },
  {
    slug: 'tarot-va-gioi-han-ban-than',
    title: 'Tarot Và Giới Hạn Bản Thân: Bạn Có Đang Tự Cản Bước Mình?',
    excerpt: 'Sử dụng Tarot như công cụ phản chiếu tâm lý để nhận diện những rào cản vô hình và vượt qua giới hạn bản thân.',
    category: 'Phát triển bản thân',
    categoryColor: '#22c55e',
    date: '28/02/2025',
    readTime: '7 phút',
    icon: '🧠',
  },
  {
    slug: 'nghe-thuat-dat-cau-hoi-tarot',
    title: 'Nghệ Thuật Đặt Câu Hỏi Tarot: Hỏi Đúng, Hiểu Sâu',
    excerpt: 'Cách đặt câu hỏi sao cho bài Tarot có thể trả lời tốt nhất. Tránh những câu hỏi "đóng" và mở ra không gian cho thông điệp.',
    category: 'Kiến thức nền tảng',
    categoryColor: '#8b5cf6',
    date: '25/02/2025',
    readTime: '5 phút',
    icon: '❓',
  },
];

const categories = [
  { name: 'Tất cả', color: 'var(--gold-500)' },
  { name: 'Kiến thức nền tảng', color: '#8b5cf6' },
  { name: 'Tình yêu', color: '#ec4899' },
  { name: 'Sự nghiệp & Tài chính', color: '#f59e0b' },
  { name: 'Phát triển bản thân', color: '#22c55e' },
];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{
          color: 'var(--gold-500)', fontSize: '0.85rem', letterSpacing: '3px',
          textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px',
        }}>
          Blog Tarot
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
          fontFamily: 'var(--font-heading)', marginBottom: '16px',
        }}>
          Kiến Thức{' '}
          <span style={{
            background: 'var(--gradient-gold)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>& Bài Viết</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
          Nâng cao hiểu biết về Tarot qua những bài viết chuyên sâu, dễ hiểu.
        </p>
      </div>

      {/* Categories */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        justifyContent: 'center', marginBottom: '48px',
      }}>
        {categories.map((cat) => (
          <span
            key={cat.name}
            style={{
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              background: `${cat.color}12`,
              color: cat.color,
              border: `1px solid ${cat.color}30`,
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {cat.name}
          </span>
        ))}
      </div>

      {/* Blog Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <article
              className="glass-card"
              style={{
                padding: '28px 24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
              }}>
                <span style={{ fontSize: '28px' }}>{post.icon}</span>
                <span style={{
                  padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem',
                  background: `${post.categoryColor}15`,
                  color: post.categoryColor,
                  fontWeight: 600,
                }}>
                  {post.category}
                </span>
              </div>

              <h2 style={{
                fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4,
                marginBottom: '12px', color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}>
                {post.title}
              </h2>

              <p style={{
                fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                flex: 1, marginBottom: '16px',
              }}>
                {post.excerpt}
              </p>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: '0.75rem', color: 'var(--text-muted)',
              }}>
                <span>{post.date}</span>
                <span>⏱ {post.readTime}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
