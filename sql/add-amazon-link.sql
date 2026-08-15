-- ═══════════════════════════════════════════════════════════════════════════
-- HISTORICAL EVIDENCE ONLY — DO NOT EXECUTE
--
-- Historical Wizkoo Library bootstrap follow-up: add amazon_link column.
-- This file is not current schema authority. Current database changes are
-- governed from wizkoo-app/apps/app/supabase/migrations/.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE library_books
  ADD COLUMN IF NOT EXISTS amazon_link TEXT;
