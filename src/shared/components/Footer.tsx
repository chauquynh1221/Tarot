import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(5, 2, 23, 0.9) 30%, #050217 100%)',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 10,
      marginTop: '80px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 24px 32px',
      }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #d4a017)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>✦</div>
              <span style={{
                fontSize: '1.3rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #c4b5fd 0%, #d4a017 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Châu Tarot</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Khám phá bản thân qua lá bài Tarot. Bói bài miễn phí, chính xác và chuyên nghiệp nhất Việt Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--gold-500)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Khám Phá
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/boi-bai', label: 'Bói Bài Tarot' },
                { href: '/boi-bai/3-la', label: 'Trải Bài 3 Lá' },
                { href: '/boi-bai/yes-no', label: 'Yes/No Tarot' },
                { href: '/y-nghia-la-bai', label: '78 Lá Bài' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Knowledge */}
          <div>
            <h4 style={{ color: 'var(--gold-500)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Kiến Thức
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { href: '/blog', label: 'Blog Tarot' },
                { href: '/blog', label: 'Kiến Thức Nền Tảng' },
                { href: '/blog', label: 'Tình Yêu & Tarot' },
                { href: '/blog', label: 'Sự Nghiệp & Tài Chính' },
              ].map((link, i) => (
                <Link key={i} href={link.href} style={{
                  color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem',
                  transition: 'color 0.2s',
                }}>{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--gold-500)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Liên Hệ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>📧 contact@tarotvutru.com</span>
              <span>📍 TP. Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="cosmic-divider">
          <span>☽</span>
        </div>

        {/* Bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: '8px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2025 Châu Tarot. Mọi quyền được bảo lưu.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/chinh-sach-bao-mat" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
              Chính sách bảo mật
            </Link>
            <Link href="/dieu-khoan" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
              Điều khoản
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
