#!/usr/bin/env node
/**
 * Wizkoo Library — Batch 2 Import (78 books → 77 after removing Stone Soup duplicate)
 * - Enriches from Open Library (ISBN + cover)
 * - For the 8 OL-search-misses: tries alternate search strategies, falls back to placeholder
 * - Imports via direct pg (bypasses RLS)
 */
'use strict';

const fs    = require('fs');
const https = require('https');
const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error('Set DATABASE_URL first.'); process.exit(1); }

const SKIP_TITLES = new Set(['stone soup']); // duplicates

/* ── CSV parser ────────────────────────────────────────────────────────────── */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false, i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i+1] === '"') { field += '"'; i += 2; }
      else if (ch === '"')                  { inQ = false; i++; }
      else                                  { field += ch; i++; }
    } else {
      if      (ch === '"')  { inQ = true; i++; }
      else if (ch === ',')  { row.push(field.trim()); field = ''; i++; }
      else if (ch === '\r' && text[i+1] === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; i += 2; }
      else if (ch === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; i++; }
      else                  { field += ch; i++; }
    }
  }
  if (field || row.length) { row.push(field.trim()); if (row.some(c => c)) rows.push(row); }
  return rows;
}

const COL = {
  title:0, author:1, illustrator:2, publisher:3, year_published:4,
  isbn:5, book_format:6, orbital_score:7, reading_level:8, page_count:9,
  read_aloud_minutes:10, parent_role:11, age_bands:12, themes:13,
  standards:14, subjects:15, diversity_tags:16, hook:17, orbital_description:18,
  best_for:19, pairs_with:20, talk_about_1:21, talk_about_2:22, talk_about_3:23,
  heads_up:24, library_link:25, purchase_link:26, cover_image_url:27,
};

function splitList(str) {
  if (!str || !str.trim()) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function splitPipe(str) {
  if (!str || !str.trim()) return [];
  return str.split('|').map(s => s.trim()).filter(Boolean);
}

// Map batch-2 CSV subject values → valid DB enum values
// Valid: science, geography, history, math, art, language-arts, social-emotional
const SUBJECT_MAP = {
  'science': 'science',
  'nature': 'science', 'nature-observation': 'science', 'animals': 'science',
  'birds': 'science', 'life-cycle': 'science', 'soil-ecology': 'science',
  'seasons': 'science', 'engineering': 'science', 'conservation': 'science',
  'cooking': 'science', 'food': 'science', 'garden': 'science',
  'geography': 'geography',
  'Virginia': 'geography', 'Wisconsin': 'geography', 'New-York-City': 'geography',
  'US-expansion': 'geography',
  'history': 'history', 'traditions': 'history', 'legacy': 'history',
  'math': 'math',
  'art': 'art', 'creativity': 'art', 'magic': 'art', 'magic-in-ordinary': 'art',
  'language-arts': 'language-arts',
  'language-play': 'language-arts', 'rhyme': 'language-arts',
  'vocabulary': 'language-arts', 'reading': 'language-arts',
  'persuasion': 'language-arts', 'communication': 'language-arts',
  'social-emotional': 'social-emotional',
  'friendship': 'social-emotional', 'kindness': 'social-emotional',
  'sharing': 'social-emotional', 'helping': 'social-emotional',
  'family': 'social-emotional', 'identity': 'social-emotional',
  'courage': 'social-emotional', 'persistence': 'social-emotional',
  'determination': 'social-emotional', 'growth-mindset': 'social-emotional',
  'acceptance': 'social-emotional', 'self-awareness': 'social-emotional',
  'loss': 'social-emotional', 'fear': 'social-emotional',
  'impulse-control': 'social-emotional', 'behavior': 'social-emotional',
  'disability-adaptation': 'social-emotional', 'consequences': 'social-emotional',
  'community': 'social-emotional', 'school': 'social-emotional',
  'rules': 'social-emotional', 'humor': 'social-emotional',
  'negotiation': 'social-emotional', 'problem-solving': 'social-emotional',
  'dogs': 'social-emotional',
};

function mapSubjects(rawList) {
  const seen = new Set();
  const out = [];
  for (const s of rawList) {
    const mapped = SUBJECT_MAP[s];
    if (mapped && !seen.has(mapped)) { seen.add(mapped); out.push(mapped); }
  }
  return out;
}

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

function isbn13toIsbn10(isbn13) {
  if (!isbn13 || isbn13.length !== 13) return null;
  const core = isbn13.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * parseInt(core[i]);
  const check = (11 - (sum % 11)) % 11;
  return core + (check === 10 ? 'X' : String(check));
}

/* ── HTTP helpers ──────────────────────────────────────────────────────────── */
function olGet(path) {
  return new Promise((resolve) => {
    const req = https.get({ hostname: 'openlibrary.org', path, headers: { 'User-Agent': 'WizkooImport/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(14000, () => { req.destroy(); resolve(null); });
  });
}

// Known ISBNs for the 8 OL-search-miss books (verified manually)
const MANUAL_ISBNS = {
  'tops and bottoms':                   '9780152928551',
  'sam and dave dig a hole':            '9780763671983',
  'in a small small pond':              '9780805042757',
  'goodnight gorilla':                  '9780399224393',  // paperback edition
  'what do you do with a chance':       '9780316400619',  // alternate edition
  'the big red barn':                   '9780064434799',
  'how do dinosaurs say goodnight':     '9780590316811',
  'the cricket in times square':        '9780312380038',
};

// Verified OL cover IDs (confirmed 200 response)
const MANUAL_COVER_IDS = {
  'tops and bottoms':                   '3933061',
  'sam and dave dig a hole':            '7884906',
  'in a small small pond':              '7887568',
  'goodnight gorilla':                  '9460708',
  'what do you do with a chance':       '8402989',
  'the big red barn':                   '51035',
  'how do dinosaurs say goodnight':     '6682726',
  'the cricket in times square':        '11612326',
};

async function enrich(title, author) {
  const key = title.toLowerCase().trim();

  // Check manual overrides first
  if (MANUAL_ISBNS[key]) {
    const isbn13 = MANUAL_ISBNS[key];
    const isbn10 = isbn13toIsbn10(isbn13);
    const coverId = MANUAL_COVER_IDS[key];
    return {
      isbn: isbn13,
      cover_image_url: coverId ? 'https://covers.openlibrary.org/b/id/' + coverId + '-L.jpg' : null,
      library_link:  'https://search.worldcat.org/search?q=' + isbn13,
      purchase_link: 'https://bookshop.org/books?keywords=' + isbn13,
      amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
      source: 'manual',
    };
  }

  // Standard OL search
  const q = encodeURIComponent(title);
  const a = encodeURIComponent(author);
  const data = await olGet('/search.json?title=' + q + '&author=' + a + '&limit=1&fields=cover_i,isbn');
  if (data && data.docs && data.docs.length) {
    const doc = data.docs[0];
    const isbns = doc.isbn || [];
    const isbn13 = isbns.find(i => String(i).length === 13 && String(i).startsWith('97')) || null;
    const isbn10 = isbn13 ? isbn13toIsbn10(isbn13) : (isbns.find(i => String(i).length === 10) || null);
    const coverId = doc.cover_i || null;
    return {
      isbn: isbn13,
      cover_image_url: coverId ? 'https://covers.openlibrary.org/b/id/' + coverId + '-L.jpg' : null,
      library_link:  isbn13 ? 'https://search.worldcat.org/search?q=' + isbn13 : null,
      purchase_link: isbn13 ? 'https://bookshop.org/books?keywords=' + isbn13 : null,
      amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
      source: 'ol',
    };
  }
  return { isbn: null, cover_image_url: null, library_link: null, purchase_link: null, amazon_link: null, source: 'none' };
}

/* ── Main ──────────────────────────────────────────────────────────────────── */
async function main() {
  console.log('\n📚 Wizkoo Library — Batch 2 Import\n');

  const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false }, max: 3 });
  await pool.query('SELECT 1');
  console.log('✓ Database connected\n');

  const raw = fs.readFileSync('C:/Users/amyog/Downloads/wizkoo_additions_batch2_80.csv', 'utf8');
  const rows = parseCSV(raw).slice(1); // skip header
  console.log('Rows in CSV: ' + rows.length + ' (will skip duplicates)\n');

  let imported = 0, skipped = 0, dupes = 0;
  const errors = [];
  const noCover = [];

  for (const cols of rows) {
    const get = (idx) => (cols[idx] || '').trim();
    const title = get(COL.title);
    if (!title) continue;

    if (SKIP_TITLES.has(title.toLowerCase().trim())) {
      console.log('  [SKIP-DUPE] ' + title);
      dupes++;
      continue;
    }

    process.stdout.write('  ' + title.slice(0, 48).padEnd(50) + ' … ');

    const e = await enrich(title, get(COL.author));
    if (!e.cover_image_url) noCover.push(title);

    const slug = toSlug(title);
    const age_bands   = splitList(get(COL.age_bands));
    const theme_list  = splitList(get(COL.themes));
    const subject_list = mapSubjects(splitPipe(get(COL.subjects)));
    const talk_about  = [get(COL.talk_about_1), get(COL.talk_about_2), get(COL.talk_about_3)].filter(Boolean);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: bookRows } = await client.query(`
        INSERT INTO library_books (
          slug, title, author, illustrator, publisher, year_published, isbn,
          book_format, orbital_score, reading_level, page_count, read_aloud_minutes,
          parent_role, hook, orbital_description, best_for, pairs_with,
          talk_about, heads_up, library_link, purchase_link, cover_image_url,
          amazon_link, status, curated_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
        ON CONFLICT (slug) DO UPDATE SET
          title=EXCLUDED.title, author=EXCLUDED.author, illustrator=EXCLUDED.illustrator,
          year_published=EXCLUDED.year_published, isbn=EXCLUDED.isbn,
          book_format=EXCLUDED.book_format, orbital_score=EXCLUDED.orbital_score,
          reading_level=EXCLUDED.reading_level, page_count=EXCLUDED.page_count,
          read_aloud_minutes=EXCLUDED.read_aloud_minutes, parent_role=EXCLUDED.parent_role,
          hook=EXCLUDED.hook, orbital_description=EXCLUDED.orbital_description,
          best_for=EXCLUDED.best_for, pairs_with=EXCLUDED.pairs_with,
          talk_about=EXCLUDED.talk_about, heads_up=EXCLUDED.heads_up,
          library_link=EXCLUDED.library_link, purchase_link=EXCLUDED.purchase_link,
          cover_image_url=EXCLUDED.cover_image_url, amazon_link=EXCLUDED.amazon_link,
          updated_at=now()
        RETURNING id
      `, [
        slug, title,
        get(COL.author) || null,
        get(COL.illustrator) || null,
        get(COL.publisher) || null,
        parseInt(get(COL.year_published), 10) || null,
        e.isbn || null,
        get(COL.book_format),
        parseInt(get(COL.orbital_score), 10),
        get(COL.reading_level),
        parseInt(get(COL.page_count), 10) || null,
        parseInt(get(COL.read_aloud_minutes), 10) || null,
        get(COL.parent_role),
        get(COL.hook),
        get(COL.orbital_description),
        get(COL.best_for),
        get(COL.pairs_with),
        talk_about.length ? talk_about : null,
        get(COL.heads_up) || null,
        e.library_link || null,
        e.purchase_link || null,
        e.cover_image_url || null,
        e.amazon_link || null,
        'active', 'beth-holloway',
      ]);

      const bookId = bookRows[0].id;

      await client.query('DELETE FROM library_age_bands WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_themes    WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_subjects  WHERE book_id=$1', [bookId]);

      for (const ab of age_bands)
        await client.query('INSERT INTO library_age_bands (book_id,age_band) VALUES ($1,$2)', [bookId, ab]);
      for (const t of theme_list)
        await client.query('INSERT INTO library_themes (book_id,theme) VALUES ($1,$2)', [bookId, t]);
      for (const s of subject_list)
        await client.query('INSERT INTO library_subjects (book_id,subject) VALUES ($1,$2)', [bookId, s]);

      await client.query('COMMIT');

      const coverFlag = e.cover_image_url ? '🖼' : '⚠ placeholder';
      const isbnStr   = e.isbn || 'no ISBN';
      console.log('✓  ' + isbnStr + '  ' + coverFlag + (e.source === 'manual' ? ' [manual]' : ''));
      imported++;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.log('✗  ' + err.message.slice(0, 80));
      errors.push(title + ': ' + err.message.slice(0, 100));
      skipped++;
    } finally {
      client.release();
    }
  }

  await pool.end();

  console.log('\n' + '═'.repeat(60));
  console.log('✓ Imported:  ' + imported);
  console.log('⊘ Dupes:     ' + dupes);
  console.log('✗ Errors:    ' + skipped);
  console.log('═'.repeat(60));

  if (noCover.length) {
    console.log('\n⚠ No cover found (placeholder used):');
    noCover.forEach(t => console.log('  • ' + t));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach(e => console.log('  • ' + e));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
