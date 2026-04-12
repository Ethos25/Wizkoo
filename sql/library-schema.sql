-- ═══════════════════════════════════════════════════════════════════════════
-- Wizkoo Library — Supabase Schema
-- Run this in the Supabase SQL editor: https://app.supabase.com → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Main table ──────────────────────────────────────────────────────────────
CREATE TABLE library_books (
  -- IDENTITY
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT        UNIQUE NOT NULL,
  isbn              TEXT,
  title             TEXT        NOT NULL,
  author            TEXT        NOT NULL,
  illustrator       TEXT,
  publisher         TEXT,
  year_published    INTEGER,

  -- CURATION METADATA (Beth's 5 gates)
  --
  -- Gate 1 — Orbital Richness (1-5): how many subject doors does the book open?
  --   Activation sub-dimension: prefer books that change what the child notices,
  --   asks, or does in real life AFTER closing the book ("does this change the
  --   child's Tuesday?"). A book that crosses domains AND activates real-world
  --   curiosity scores higher than one that crosses domains but stays abstract.
  --   Family conversation sub-dimension: when two books score equally on orbital
  --   richness and activation, prefer the book the whole family can discuss across
  --   age gaps (2-year-old to 10-year-old all have something to say). Tiebreaker
  --   only — not a separate gate.
  orbital_score     INTEGER     NOT NULL CHECK (orbital_score BETWEEN 1 AND 5),
  literary_quality  BOOLEAN     NOT NULL DEFAULT true,
  reading_level     TEXT        NOT NULL CHECK (reading_level IN (
                      'pre-reader', 'early-reader', 'independent', 'advanced')),
  page_count        INTEGER,
  read_aloud_minutes INTEGER,
  book_format       TEXT        NOT NULL CHECK (book_format IN (
                      'board-book', 'picture-book', 'early-reader',
                      'chapter-book', 'nonfiction', 'graphic-novel', 'poetry')),
  parent_role       TEXT        NOT NULL CHECK (parent_role IN (
                      'read-together', 'read-side-by-side',
                      'read-and-discuss', 'read-and-explore')),

  -- COPY FIELDS (Talia's 7-field template)
  hook              TEXT        NOT NULL,
  orbital_description TEXT      NOT NULL,
  best_for          TEXT        NOT NULL,
  pairs_with        TEXT        NOT NULL,
  talk_about        TEXT[],
  heads_up          TEXT,

  -- LINKS
  cover_image_url   TEXT,
  library_link      TEXT,
  purchase_link     TEXT,
  amazon_link       TEXT,

  -- ADMIN
  status            TEXT        NOT NULL DEFAULT 'active' CHECK (status IN (
                      'active', 'under-review', 'retired')),
  curated_by        TEXT        NOT NULL DEFAULT 'beth-holloway',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Junction tables ──────────────────────────────────────────────────────────

CREATE TABLE library_age_bands (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id   UUID    NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  age_band  TEXT    NOT NULL CHECK (age_band IN ('2-4', '5-7', '8-10', '10-12')),
  UNIQUE(book_id, age_band)
);

CREATE TABLE library_themes (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id   UUID    NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  theme     TEXT    NOT NULL,
  UNIQUE(book_id, theme)
);

CREATE TABLE library_standards (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id       UUID    NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  standard_code TEXT    NOT NULL,
  standard_type TEXT    NOT NULL CHECK (standard_type IN ('CCSS', 'NGSS')),
  UNIQUE(book_id, standard_code)
);

CREATE TABLE library_subjects (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id   UUID    NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  subject   TEXT    NOT NULL CHECK (subject IN (
              'science', 'geography', 'history', 'math',
              'art', 'language-arts', 'social-emotional')),
  UNIQUE(book_id, subject)
);

-- Diversity tags are a CLOSED enum list — add new values here, never invent
-- them at data entry time.
CREATE TABLE library_diversity (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id   UUID    NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  tag       TEXT    NOT NULL CHECK (tag IN (
              -- Author identity
              'author-black', 'author-indigenous', 'author-asian',
              'author-latino', 'author-middle-eastern', 'author-pacific-islander',
              'author-mixed-heritage',
              -- Protagonist representation
              'protagonist-poc', 'protagonist-indigenous', 'protagonist-asian',
              'protagonist-latino', 'protagonist-middle-eastern',
              'protagonist-disability', 'protagonist-neurodivergent',
              'protagonist-lgbtq',
              -- Setting / perspective
              'setting-africa', 'setting-asia', 'setting-latin-america',
              'setting-middle-east', 'setting-pacific-islands', 'setting-indigenous-lands',
              'setting-global-multi-region',
              -- Language & translation
              'multilingual', 'translated-work')),
  UNIQUE(book_id, tag)
);

-- ── Theme meta table ────────────────────────────────────────────────────────
-- One row per weekly theme. Stores the "At the table" family conversation
-- question that surfaces in the plan generator output BELOW per-child book
-- recommendations. One question per week per family, visible to all children.
--
-- Design constraints (v1.1):
--   • Imagination questions, not comprehension questions
--   • The week's knowledge is a launchpad, not a test
--   • Any age can answer — the 2-year-old can point, the 6-year-old can
--     explain, the 10-year-old can hypothesize
--   • No wrong answer exists
--   • Sounds like dinner table conversation, not classroom instruction
--
-- Example questions (theme = 'volcanoes'):
--   "If you could visit one volcano anywhere in the world, which one and why?"
--   "If you could name a new volcano, what would you call it?"
--   "What do you think it sounds like right before a volcano erupts?"
--   "If a volcano showed up in our backyard, what's the first thing you'd do?"
CREATE TABLE library_theme_meta (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Matches the theme TEXT values used in library_themes junction table
  theme         TEXT        UNIQUE NOT NULL,
  -- The one family conversation question surfaced in the plan output this week
  at_the_table  TEXT        NOT NULL,
  -- Optional: alternate questions (rotate, or select by plan generator AI)
  at_the_table_alt_1 TEXT,
  at_the_table_alt_2 TEXT,
  at_the_table_alt_3 TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_themes_theme    ON library_themes(theme);
CREATE INDEX idx_age_bands_band  ON library_age_bands(age_band);
CREATE INDEX idx_standards_code  ON library_standards(standard_code);
CREATE INDEX idx_books_status    ON library_books(status);
CREATE INDEX idx_books_orbital   ON library_books(orbital_score DESC);
CREATE INDEX idx_theme_meta_theme ON library_theme_meta(theme);

-- ── updated_at function + triggers ──────────────────────────────────────────
-- Function defined once, shared by all tables that need updated_at tracking.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_library_books_updated_at
  BEFORE UPDATE ON library_books
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_library_theme_meta_updated_at
  BEFORE UPDATE ON library_theme_meta
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Library pages are fully public (no auth required).
ALTER TABLE library_books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_age_bands  ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_themes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_standards  ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_subjects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_diversity  ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_theme_meta ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT on active books and all junction tables
CREATE POLICY "public read active books"
  ON library_books FOR SELECT
  USING (status = 'active');

CREATE POLICY "public read age_bands"
  ON library_age_bands FOR SELECT USING (true);

CREATE POLICY "public read themes"
  ON library_themes FOR SELECT USING (true);

CREATE POLICY "public read standards"
  ON library_standards FOR SELECT USING (true);

CREATE POLICY "public read subjects"
  ON library_subjects FOR SELECT USING (true);

CREATE POLICY "public read diversity"
  ON library_diversity FOR SELECT USING (true);

CREATE POLICY "public read theme_meta"
  ON library_theme_meta FOR SELECT USING (true);

-- ── Plan Generator Query (reference) ────────────────────────────────────────
-- Primary: theme + age band + reading level, ranked by standards overlap
--
-- SELECT DISTINCT b.*
-- FROM library_books b
-- JOIN library_themes t ON b.id = t.book_id
-- JOIN library_age_bands a ON b.id = a.book_id
-- WHERE t.theme = $weekly_theme
--   AND a.age_band = $child_age_band
--   AND b.reading_level IN ($child_level, $one_level_below)
--   AND b.status = 'active'
-- ORDER BY
--   (SELECT COUNT(*) FROM library_standards ls
--    WHERE ls.book_id = b.id
--    AND ls.standard_code = ANY($week_standards)) DESC,
--   b.orbital_score DESC
-- LIMIT 5;
--
-- ── "At the table" query (run once per plan, not per child) ──────────────────
-- Fetch the family conversation question for the weekly theme:
--
-- SELECT at_the_table, at_the_table_alt_1, at_the_table_alt_2, at_the_table_alt_3
-- FROM library_theme_meta
-- WHERE theme = $weekly_theme
-- LIMIT 1;
--
-- ── Plan generator system prompt additions (v1.1) ────────────────────────────
--
-- ADD to per-child book recommendation block:
-- "For each recommended book, if the orbital_description field ends with an
-- activation line (format: 'After this one, [specific behavior]'), include it
-- as a standalone line below the hook, visually distinct."
--
-- ADD as a closer for the "This week's books" section (one per family, not per child):
--
--   At the table
--   "[at_the_table field from library_theme_meta for $weekly_theme]"
--
-- Voice rules for "At the table":
--   - Imagination question, not comprehension
--   - Any age can answer — the 2-year-old can point, the 10-year-old can hypothesize
--   - No wrong answer exists
--   - Sounds like dinner table conversation, not classroom instruction
--   - If no theme meta row exists for this week's theme, omit the section entirely
