'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/boi-bai', label: 'Bói Tarot' },
  { href: '/y-nghia-la-bai', label: '78 Lá Bài' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(12, 8, 32, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(147, 122, 216, 0.1)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>✦</span>
          <span style={{
            fontFamily: 'var(--font-title)', fontSize: '1.3rem', fontWeight: 700,
            background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Châu Tarot
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{ display: 'flex', gap: '4px' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                textDecoration: 'none', color: 'var(--text-secondary)',
                padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500,
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/boi-bai/3-la" className="btn-primary" style={{
            textDecoration: 'none', padding: '8px 20px', fontSize: '0.85rem',
          }}>
            Bói Ngay ✨
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)',
              fontSize: '1.5rem', cursor: 'pointer', padding: '4px',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px 24px', background: 'rgba(12, 8, 32, 0.98)',
            borderTop: '1px solid var(--border)',
          }}
        >
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{
              textDecoration: 'none', color: 'var(--text-secondary)', display: 'block',
              padding: '12px 0', fontSize: '1rem', borderBottom: '1px solid var(--border)',
            }}>
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
