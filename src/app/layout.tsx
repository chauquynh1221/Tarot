import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-title',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Châu Tarot — Bói Bài Tarot Online Miễn Phí',
    template: '%s | Châu Tarot',
  },
  description: 'Bói bài Tarot online miễn phí. Trải bài 3 lá, Yes/No, giải mã 78 lá bài Rider-Waite. Tình yêu, sự nghiệp, tài chính.',
  keywords: ['tarot', 'bói bài', 'trải bài tarot', 'tarot online', '78 lá bài', 'rider waite', 'bói tarot miễn phí'],
  openGraph: {
    title: 'Châu Tarot — Bói Bài Tarot Online Miễn Phí',
    description: 'Trải bài Tarot online miễn phí. 78 lá bài Rider-Waite, trải bài 3 lá, Yes/No.',
    type: 'website',
    locale: 'vi_VN',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {/* Ornate page frame with golden corners */}
        <div className="page-frame" aria-hidden="true" />
        <div className="corner-ornament corner-tl" aria-hidden="true" />
        <div className="corner-ornament corner-tr" aria-hidden="true" />
        <div className="corner-ornament corner-bl" aria-hidden="true" />
        <div className="corner-ornament corner-br" aria-hidden="true" />

        {/* Floating golden particles */}
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />
        <div className="particle" aria-hidden="true" />

        <Header />
        <main style={{ paddingTop: '64px', position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
