-- ═══════════════════════════════════════════════════════════════════════════
-- Wizkoo Library — Migration v1.2: add amazon_link column
-- Run this if you already ran library-schema.sql and need to add the new column.
-- Safe to run multiple times (IF NOT EXISTS).
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE library_books
  ADD COLUMN IF NOT EXISTS amazon_link TEXT;
