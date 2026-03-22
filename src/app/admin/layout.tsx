'use client';

import { useState, useEffect, useCallback } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logging, setLogging] = useState(false);

  // Check if already authenticated (sessionStorage)
  useEffect(() => {
    const token = sessionStorage.getItem('admin_auth');
    if (token === 'authenticated') {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = useCallback(async () => {
    if (!password.trim()) return;
    setLogging(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'authenticated');
        setAuthenticated(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Sai mật khẩu');
      }
    } catch {
      setError('Lỗi kết nối');
    }
    setLogging(false);
  }, [password]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthenticated(false);
    setPassword('');
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888' }}>⏳</p>
      </div>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body), sans-serif',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '380px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔐</span>
          <h1 style={{ color: '#d4af37', fontSize: '20px', marginBottom: '8px' }}>Admin Panel</h1>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Nhập mật khẩu để truy cập</p>

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Mật khẩu..."
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f0f1a',
              color: '#e0e0e0',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              fontSize: '15px',
              marginBottom: '16px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />

          {error && (
            <p style={{
              color: '#ff6b6b',
              fontSize: '13px',
              marginBottom: '12px',
              background: 'rgba(255,100,100,0.1)',
              padding: '8px',
              borderRadius: '6px',
            }}>
              ❌ {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={logging || !password.trim()}
            style={{
              width: '100%',
              padding: '12px',
              background: logging ? '#333' : 'linear-gradient(135deg, #d4af37, #b8942e)',
              color: logging ? '#888' : '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: logging ? 'not-allowed' : 'pointer',
            }}
          >
            {logging ? '⏳ Đang xác thực...' : '🔓 Đăng nhập'}
          </button>
        </div>
      </div>
    );
  }

  // Authenticated — show admin layout
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f1a',
      color: '#e0e0e0',
      fontFamily: 'var(--font-body), sans-serif',
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontSize: '24px' }}>🔮</span>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#d4af37', margin: 0 }}>
          Châu Tarot — Admin
        </h1>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/admin/meanings" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px' }}>
            📖 Card Meanings
          </a>
          <a href="/admin/logs" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '14px' }}>
            📋 AI Logs
          </a>
          <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            ← Về trang chủ
          </a>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,100,100,0.15)',
              border: '1px solid rgba(255,100,100,0.3)',
              color: '#ff6b6b',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🚪 Đăng xuất
          </button>
        </nav>
      </header>
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
