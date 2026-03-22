'use client';

import { useState, useEffect, useCallback } from 'react';

interface LogEntry {
  id: string;
  user_question: string;
  selected_topic: string;
  picked_cards: string;
  ai_response: string;
  created_at: string;
}

const TOPICS = ['', 'LOVE', 'CAREER', 'FINANCE', 'HEALTH', 'GENERAL', 'GROWTH', 'CREATIVE', 'YES_NO', 'CUSTOM_QUESTION'];
const TOPIC_LABELS: Record<string, string> = {
  '': 'Tất cả', LOVE: '💕 Tình Yêu', CAREER: '💼 Sự Nghiệp', FINANCE: '💰 Tài Chính',
  HEALTH: '🌿 Sức Khỏe', GENERAL: '✨ Tổng Quan', GROWTH: '🌱 Phát Triển',
  CREATIVE: '🎨 Sáng Tạo', YES_NO: '✅ Yes/No', CUSTOM_QUESTION: '🔮 Hỏi Vũ Trụ',
};

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '12px',
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (topic) params.set('topic', topic);
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, topic]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleClearAll = async () => {
    await fetch('/api/admin/logs', { method: 'DELETE' });
    setLogs([]);
    setTotal(0);
    setTotalPages(0);
    setPage(1);
    setConfirmDelete(false);
  };

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('vi-VN') + ' ' + dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const tryParseJson = (s: string) => {
    try { return JSON.parse(s); } catch { return null; }
  };

  return (
    <div style={{ color: '#e0e0e0', fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#d4af37', marginBottom: '4px' }}>📋 AI Reading Logs</h1>
          <p style={{ color: '#888', fontSize: '13px' }}>{total} logs</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {confirmDelete ? (
            <>
              <span style={{ color: '#e88090', fontSize: '13px' }}>Xoá tất cả?</span>
              <button onClick={handleClearAll} style={{
                padding: '8px 16px', background: 'rgba(220, 80, 80, 0.25)', color: '#e88090',
                border: '1px solid rgba(220, 80, 80, 0.5)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
              }}>✓ Xác nhận</button>
              <button onClick={() => setConfirmDelete(false)} style={{
                padding: '8px 12px', background: 'rgba(255,255,255,0.06)', color: '#888',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
              }}>✕ Huỷ</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{
              padding: '8px 16px', background: 'rgba(220, 80, 80, 0.15)', color: '#e88090',
              border: '1px solid rgba(220, 80, 80, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            }}>🗑️ Xoá Tất Cả</button>
          )}
        </div>
      </div>

      {/* Topic filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {TOPICS.map(t => (
          <button key={t} onClick={() => { setTopic(t); setPage(1); }}
            style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
              border: topic === t ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
              background: topic === t ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.04)',
              color: topic === t ? '#d4af37' : '#aaa',
              transition: 'all 0.2s',
            }}>
            {TOPIC_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Đang tải...</p>}

      {/* Logs */}
      {!loading && logs.length === 0 && (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Chưa có logs nào.</p>
      )}

      {logs.map(log => {
        const isExpanded = expandedId === log.id;
        const aiParsed = tryParseJson(log.ai_response);
        const cardsParsed = tryParseJson(log.picked_cards);

        return (
          <div key={log.id} style={cardStyle}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    background: 'rgba(212, 175, 55, 0.15)', color: '#d4af37',
                  }}>
                    {TOPIC_LABELS[log.selected_topic] || log.selected_topic}
                  </span>
                  <span style={{ color: '#666', fontSize: '12px' }}>{formatDate(log.created_at)}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#ccc', lineHeight: 1.5, marginBottom: '4px' }}>
                  <strong style={{ color: '#aaa' }}>Q:</strong> {log.user_question}
                </p>
                <p style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Cards:</strong> {cardsParsed ? (cardsParsed.name || JSON.stringify(cardsParsed).substring(0, 120)) : log.picked_cards.substring(0, 120)}
                </p>
              </div>
              <button onClick={() => setExpandedId(isExpanded ? null : log.id)}
                style={{
                  padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                  background: isExpanded ? 'rgba(100,180,255,0.15)' : 'rgba(255,255,255,0.06)',
                  color: isExpanded ? '#64b4ff' : '#888',
                  border: '1px solid ' + (isExpanded ? 'rgba(100,180,255,0.3)' : 'rgba(255,255,255,0.1)'),
                }}>
                {isExpanded ? '▲ Thu gọn' : '▼ Xem Chi Tiết'}
              </button>
            </div>

            {/* Expanded — 3 sections: DB Data, Prompt, AI Result */}
            {isExpanded && (
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Section 1: DB Query Data */}
                <div style={{
                  padding: '14px', background: 'rgba(34, 197, 94, 0.06)', borderRadius: '8px',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                }}>
                  <p style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                    🗄️ DỮ LIỆU QUERY TỪ DATABASE
                  </p>
                  <pre style={{
                    fontSize: '12px', color: '#bbb', lineHeight: 1.7,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    maxHeight: '300px', overflowY: 'auto',
                  }}>
                    {aiParsed?.db_query_data
                      ? JSON.stringify(aiParsed.db_query_data, null, 2)
                      : '(Không có dữ liệu DB — log cũ)'}
                  </pre>
                </div>

                {/* Section 2: Prompt Sent */}
                <div style={{
                  padding: '14px', background: 'rgba(100, 180, 255, 0.06)', borderRadius: '8px',
                  border: '1px solid rgba(100, 180, 255, 0.15)',
                }}>
                  <p style={{ fontSize: '11px', color: '#64b4ff', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                    📝 PROMPT GỬI LÊN AI
                  </p>
                  <pre style={{
                    fontSize: '12px', color: '#bbb', lineHeight: 1.7,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    maxHeight: '250px', overflowY: 'auto',
                  }}>
                    {aiParsed?.prompt_sent || '(Không có prompt — log cũ)'}
                  </pre>
                </div>

                {/* Section 3: AI Result */}
                <div style={{
                  padding: '14px', background: 'rgba(168, 130, 255, 0.06)', borderRadius: '8px',
                  border: '1px solid rgba(168, 130, 255, 0.15)',
                }}>
                  <p style={{ fontSize: '11px', color: '#a882ff', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                    🤖 KẾT QUẢ TỪ AI
                  </p>
                  <pre style={{
                    fontSize: '12px', color: '#bbb', lineHeight: 1.7,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    maxHeight: '400px', overflowY: 'auto',
                  }}>
                    {aiParsed?.ai_result
                      ? JSON.stringify(aiParsed.ai_result, null, 2)
                      : (aiParsed ? JSON.stringify(aiParsed, null, 2) : log.ai_response)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: page > 1 ? 'pointer' : 'default',
              background: 'rgba(255,255,255,0.06)', color: page > 1 ? '#ccc' : '#555',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>← Trước</button>
          <span style={{ padding: '8px 12px', color: '#888', fontSize: '13px' }}>
            Trang {page}/{totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: page < totalPages ? 'pointer' : 'default',
              background: 'rgba(255,255,255,0.06)', color: page < totalPages ? '#ccc' : '#555',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>Sau →</button>
        </div>
      )}
    </div>
  );
}
