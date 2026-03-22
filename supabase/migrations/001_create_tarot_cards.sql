-- ============================================================
-- Châu Tarot — Database Schema
-- Supabase PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- BẢNG: tarot_cards — 78 lá bài Tarot
-- ============================================================
CREATE TABLE IF NOT EXISTS tarot_cards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,                              -- Tên tiếng Anh: "The Fool", "Ace of Wands"
  number        INT NOT NULL,                               -- Số thứ tự trong bộ
  arcana        TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
  suit          TEXT CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles')),
  image         TEXT NOT NULL,                              -- URL hình ảnh lá bài
  description   TEXT NOT NULL DEFAULT '',                   -- Mô tả chi tiết (tiếng Việt)
  detailed_meaning TEXT NOT NULL DEFAULT '',                -- Ý nghĩa chi tiết
  upright       TEXT[] NOT NULL DEFAULT '{}',               -- Từ khóa khi xuôi
  reversed      TEXT[] NOT NULL DEFAULT '{}',               -- Từ khóa khi ngược
  keywords      TEXT[] NOT NULL DEFAULT '{}',               -- Từ khóa tìm kiếm
  element       TEXT,                                       -- Nguyên tố: Fire, Water, Air, Earth
  zodiac        TEXT,                                       -- Cung hoàng đạo liên quan
  yes_no        TEXT NOT NULL DEFAULT 'maybe' CHECK (yes_no IN ('yes', 'no', 'maybe')),
  slug          TEXT NOT NULL UNIQUE,                       -- URL-friendly slug
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tarot_cards_arcana ON tarot_cards(arcana);
CREATE INDEX idx_tarot_cards_suit ON tarot_cards(suit);
CREATE INDEX idx_tarot_cards_slug ON tarot_cards(slug);
CREATE INDEX idx_tarot_cards_number ON tarot_cards(number);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tarot_cards_updated_at
  BEFORE UPDATE ON tarot_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- BẢNG: reading_sessions — Lịch sử bói bài
-- ============================================================
CREATE TABLE IF NOT EXISTS reading_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_question   TEXT NOT NULL DEFAULT '',
  selected_topic  TEXT NOT NULL,
  picked_cards    TEXT NOT NULL,                            -- JSON string: ["card_id_1", "card_id_2", "card_id_3"]
  ai_response     TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reading_sessions_created ON reading_sessions(created_at DESC);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE tarot_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc tất cả lá bài (public)
CREATE POLICY "Allow public read tarot_cards"
  ON tarot_cards FOR SELECT
  USING (true);

-- Cho phép tạo reading sessions (public)
CREATE POLICY "Allow public insert reading_sessions"
  ON reading_sessions FOR INSERT
  WITH CHECK (true);

-- Cho phép đọc reading sessions (public)
CREATE POLICY "Allow public read reading_sessions"
  ON reading_sessions FOR SELECT
  USING (true);
