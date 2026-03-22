'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Card = {
  id: number;
  card_id: number;
  name: string;
  number: number;
  arcana: string;
  suit: string | null;
  slug: string;
};

type Meaning = {
  id: number;
  card_id: number;
  category: string;
  content: string;
};

type EmbeddingStats = {
  total: number;
  withEmbedding: number;
  withoutEmbedding: number;
};

const CATEGORIES = ['GENERAL', 'LOVE', 'CAREER', 'FINANCE', 'HEALTH', 'GROWTH', 'CREATIVE'] as const;

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  GENERAL: { label: 'Tổng quát', emoji: '🌟' },
  LOVE: { label: 'Tình yêu', emoji: '💕' },
  CAREER: { label: 'Sự nghiệp', emoji: '💼' },
  FINANCE: { label: 'Tài chính', emoji: '💰' },
  HEALTH: { label: 'Sức khỏe', emoji: '🏥' },
  GROWTH: { label: 'Phát triển', emoji: '🌱' },
  CREATIVE: { label: 'Sáng tạo', emoji: '🎨' },
};

export default function AdminMeaningsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [existingMeanings, setExistingMeanings] = useState<Meaning[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Embedding state
  const [embStats, setEmbStats] = useState<EmbeddingStats | null>(null);
  const [embGenerating, setEmbGenerating] = useState(false);
  const [embMessage, setEmbMessage] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load cards
  useEffect(() => {
    fetch('/api/cards')
      .then(r => r.json())
      .then(setCards)
      .catch(e => console.error(e));
  }, []);

  // Load embedding stats
  const loadEmbStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/embeddings');
      const data = await res.json();
      setEmbStats(data);
    } catch (e) {
      console.error('Failed to load embedding stats', e);
    }
  }, []);

  useEffect(() => { loadEmbStats(); }, [loadEmbStats]);

  // Generate embeddings
  const handleGenerateEmbeddings = async (regenerateAll = false) => {
    setEmbGenerating(true);
    setEmbMessage(regenerateAll ? '🔄 Đang xóa embeddings cũ và tạo lại...' : '🚀 Đang tạo embeddings...');

    try {
      const res = await fetch('/api/admin/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerateAll }),
      });
      const data = await res.json();

      if (res.ok) {
        setEmbMessage(`✅ Đã tạo ${data.updated}/${data.total} embeddings!${data.errors ? ` (${data.errors.length} lỗi)` : ''}`);
        if (data.errors) {
          console.error('Embedding errors:', data.errors);
        }
      } else {
        setEmbMessage(`❌ Lỗi: ${data.error}`);
      }

      await loadEmbStats();
    } catch (e: any) {
      setEmbMessage(`❌ Lỗi kết nối: ${e.message}`);
    }

    setEmbGenerating(false);
  };

  // Load meanings when card selected
  const loadMeanings = useCallback(async (cardId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${cardId}/meanings`);
      const data: Meaning[] = await res.json();
      setExistingMeanings(data);

      // Build form data: merge existing meanings into all categories
      const form: Record<string, string> = {};
      for (const cat of CATEGORIES) {
        const existing = data.find(m => m.category === cat);
        form[cat] = existing?.content || '';
      }
      setFormData(form);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setSearchQuery(`${card.number}. ${card.name}`);
    setShowDropdown(false);
    setMessage('');
    loadMeanings(card.card_id);
  };

  // Save all
  const handleSave = async () => {
    if (!selectedCard) return;
    setSaving(true);
    setMessage('');

    try {
      // Delete all existing meanings for this card
      for (const m of existingMeanings) {
        await fetch(`/api/cards/${selectedCard.card_id}/meanings`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meaningId: m.id }),
        });
      }

      // Insert all non-empty meanings
      const meanings = CATEGORIES
        .filter(cat => formData[cat]?.trim())
        .map(cat => ({ category: cat, content: formData[cat].trim() }));

      if (meanings.length > 0) {
        await fetch(`/api/cards/${selectedCard.card_id}/meanings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meanings }),
        });
      }

      setMessage(`✅ Đã lưu ${meanings.length}/${CATEGORIES.length} categories!`);
      loadMeanings(selectedCard.card_id);
    } catch (e: any) {
      setMessage(`❌ Lỗi: ${e.message}`);
    }
    setSaving(false);
  };

  // Filter cards for search
  const suitLabels: Record<string, string> = { wands: '🪄 Wands', cups: '🏆 Cups', swords: '⚔️ Swords', pentacles: '⭐ Pentacles' };
  const q = searchQuery.toLowerCase();
  const filteredCards = cards.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.number.toString().includes(q) ||
    (c.suit || '').toLowerCase().includes(q)
  );
  const filteredMajor = filteredCards.filter(c => c.arcana === 'major');
  const filteredSuits = ['wands', 'cups', 'swords', 'pentacles'].map(suit => ({
    suit,
    cards: filteredCards.filter(c => c.suit === suit),
  })).filter(g => g.cards.length > 0);

  const filledCount = CATEGORIES.filter(cat => formData[cat]?.trim()).length;
  const embPercent = embStats ? Math.round((embStats.withEmbedding / Math.max(embStats.total, 1)) * 100) : 0;

  return (
    <div>
      {/* ===== EMBEDDING SECTION ===== */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,26,46,0.9), rgba(22,33,62,0.9))',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🧠</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#d4af37' }}>Vector Embeddings</h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>
              FPT AI Factory — multilingual-e5-large (1024 dims)
            </p>
          </div>
        </div>

        {/* Stats */}
        {embStats && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: '#ccc' }}>
                {embStats.withEmbedding}/{embStats.total} meanings có embedding
              </span>
              <span style={{ color: embPercent === 100 ? '#4a8' : '#d4af37', fontWeight: 600 }}>
                {embPercent}%
              </span>
            </div>
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${embPercent}%`,
                height: '100%',
                background: embPercent === 100
                  ? 'linear-gradient(90deg, #4a8, #6c6)'
                  : 'linear-gradient(90deg, #d4af37, #f0d060)',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleGenerateEmbeddings(false)}
            disabled={embGenerating || (embStats?.withoutEmbedding === 0)}
            style={{
              background: embGenerating ? '#333' : 'linear-gradient(135deg, #d4af37, #b8942e)',
              border: 'none',
              color: embGenerating ? '#888' : '#000',
              borderRadius: '8px',
              padding: '10px 24px',
              cursor: embGenerating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              opacity: (embStats?.withoutEmbedding === 0) ? 0.5 : 1,
            }}
          >
            {embGenerating ? '⏳ Đang xử lý...' : `🚀 Generate (${embStats?.withoutEmbedding ?? '?'} còn thiếu)`}
          </button>

          <button
            onClick={() => {
              if (confirm('Xóa tất cả embeddings cũ và tạo lại?\nQuá trình này sẽ mất vài phút.')) {
                handleGenerateEmbeddings(true);
              }
            }}
            disabled={embGenerating}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#d4af37',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: embGenerating ? 'not-allowed' : 'pointer',
              fontSize: '13px',
            }}
          >
            🔄 Regenerate All
          </button>

          {embMessage && (
            <span style={{
              padding: '6px 14px',
              background: embMessage.startsWith('✅') ? 'rgba(100,200,100,0.1)' : embMessage.startsWith('❌') ? 'rgba(255,100,100,0.1)' : 'rgba(212,175,55,0.1)',
              borderRadius: '6px',
              fontSize: '13px',
              color: embMessage.startsWith('✅') ? '#6c6' : embMessage.startsWith('❌') ? '#f66' : '#d4af37',
            }}>
              {embMessage}
            </span>
          )}
        </div>
      </div>

      {/* ===== CARD MEANINGS SECTION ===== */}
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#d4af37' }}>
        📖 Quản lý Card Meanings
      </h2>

      {/* Searchable Card Selector */}
      <div style={{ marginBottom: '24px', position: 'relative' }} ref={dropdownRef}>
        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '14px' }}>
          Chọn lá bài:
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder="🔍 Tìm kiếm card... (vd: Fool, Magician, Wands...)"
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '10px 12px',
            background: '#1a1a2e',
            color: '#e0e0e0',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '8px',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {showDropdown && filteredCards.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxWidth: '500px',
            maxHeight: '350px',
            overflowY: 'auto',
            background: '#1a1a2e',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            marginTop: '4px',
            zIndex: 50,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}>
            {filteredMajor.length > 0 && (
              <>
                <div style={{ padding: '6px 12px', fontSize: '11px', color: '#d4af37', fontWeight: 700, background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid #2a2a3e' }}>
                  🏛️ Major Arcana
                </div>
                {filteredMajor.map(c => (
                  <div
                    key={c.card_id}
                    onClick={() => handleCardSelect(c)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: selectedCard?.card_id === c.card_id ? '#d4af37' : '#ccc',
                      background: selectedCard?.card_id === c.card_id ? 'rgba(212,175,55,0.1)' : 'transparent',
                      borderBottom: '1px solid #1f1f30',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = selectedCard?.card_id === c.card_id ? 'rgba(212,175,55,0.1)' : 'transparent')}
                  >
                    {c.number}. {c.name}
                  </div>
                ))}
              </>
            )}
            {filteredSuits.map(({ suit, cards: suitCards }) => (
              <div key={suit}>
                <div style={{ padding: '6px 12px', fontSize: '11px', color: '#d4af37', fontWeight: 700, background: 'rgba(212,175,55,0.08)', borderBottom: '1px solid #2a2a3e' }}>
                  {suitLabels[suit]}
                </div>
                {suitCards.map(c => (
                  <div
                    key={c.card_id}
                    onClick={() => handleCardSelect(c)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: selectedCard?.card_id === c.card_id ? '#d4af37' : '#ccc',
                      background: selectedCard?.card_id === c.card_id ? 'rgba(212,175,55,0.1)' : 'transparent',
                      borderBottom: '1px solid #1f1f30',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.15)')}
                    onMouseLeave={e => (e.currentTarget.style.background = selectedCard?.card_id === c.card_id ? 'rgba(212,175,55,0.1)' : 'transparent')}
                  >
                    {c.number}. {c.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCard && (
        <>
          {/* Card Info */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{ fontSize: '32px' }}>🃏</span>
            <div>
              <strong style={{ color: '#d4af37', fontSize: '18px' }}>{selectedCard.name}</strong>
              <div style={{ color: '#888', fontSize: '13px' }}>
                {selectedCard.arcana === 'major' ? 'Major Arcana' : `${selectedCard.suit} — Minor Arcana`}
                {' · '}{filledCount}/{CATEGORIES.length} categories
              </div>
            </div>
          </div>

          {/* All 7 categories form */}
          {loading ? (
            <p style={{ color: '#888' }}>Đang tải...</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
              {CATEGORIES.map(cat => {
                const hasData = formData[cat]?.trim();
                const info = CATEGORY_LABELS[cat];
                return (
                  <div key={cat} style={{
                    background: '#12121f',
                    border: `1px solid ${hasData ? 'rgba(212, 175, 55, 0.25)' : '#2a2a3e'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}>
                      <span style={{
                        background: hasData ? 'rgba(212, 175, 55, 0.15)' : 'rgba(100,100,120,0.15)',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: hasData ? '#d4af37' : '#666',
                      }}>
                        {info.emoji} {info.label}
                      </span>
                      {hasData && (
                        <span style={{ fontSize: '11px', color: '#4a8' }}>✓ Đã có</span>
                      )}
                      {!hasData && (
                        <span style={{ fontSize: '11px', color: '#666' }}>Chưa có</span>
                      )}
                    </div>
                    <textarea
                      value={formData[cat] || ''}
                      onChange={e => setFormData({ ...formData, [cat]: e.target.value })}
                      placeholder={`Nhập nội dung ${info.label.toLowerCase()}...`}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#1a1a2e',
                        color: '#e0e0e0',
                        border: '1px solid #2a2a3e',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical',
                        lineHeight: 1.5,
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Save button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving ? '#333' : 'linear-gradient(135deg, #d4af37, #b8942e)',
                border: 'none',
                color: saving ? '#888' : '#000',
                borderRadius: '8px',
                padding: '12px 32px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              {saving ? '⏳ Đang lưu...' : '💾 Lưu tất cả'}
            </button>
            {message && (
              <span style={{
                padding: '8px 16px',
                background: message.startsWith('✅') ? 'rgba(100,200,100,0.1)' : 'rgba(255,100,100,0.1)',
                borderRadius: '6px',
                fontSize: '14px',
              }}>
                {message}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
