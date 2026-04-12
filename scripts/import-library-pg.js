#!/usr/bin/env node
/**
 * Wizkoo Library — Direct PostgreSQL Import Script
 * ────────────────────────────────────────────────────────────────────────────
 * Connects directly to Supabase's PostgreSQL using DATABASE_URL (bypasses RLS).
 * Reads the enriched 218-book CSV, validates all enums, upserts into
 * library_books, and inserts junction table rows for age_bands, themes,
 * standards, subjects, and diversity_tags.
 *
 * Usage:
 *   DATABASE_URL=postgresql://... node scripts/import-library-pg.js --csv path/to/enriched.csv
 *   node scripts/import-library-pg.js --csv path/to/enriched.csv --dry-run
 *
 * Or set DATABASE_URL in environment first:
 *   export DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
 *
 * Options:
 *   --csv       Input CSV path (required)
 *   --dry-run   Validate and report without writing anything
 *   --schema    Run sql/library-schema.sql first (creates tables if not exist)
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const args    = process.argv.slice(2);
const getArg  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const CSV_PATH  = getArg('--csv');
const DRY_RUN   = args.includes('--dry-run');
const RUN_SCHEMA = args.includes('--schema');

if (!CSV_PATH) {
  console.error('Usage: node scripts/import-library-pg.js --csv path/to/enriched.csv [--dry-run] [--schema]');
  process.exit(1);
}

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error([
    'Error: DATABASE_URL environment variable not set.',
    'Get it from: Supabase Dashboard → Settings → Database → Connection string (URI, port 5432)',
    '',
    'Set it with:',
    '  export DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres',
    '  node scripts/import-library-pg.js --csv enriched.csv',
  ].join('\n'));
  process.exit(1);
}

/* ── Enum validation sets ────────────────────────────────────────────────── */
const VALID = {
  reading_level: new Set(['pre-reader', 'early-reader', 'independent', 'advanced']),
  book_format:   new Set(['board-book', 'picture-book', 'early-reader', 'chapter-book', 'nonfiction', 'graphic-novel', 'poetry']),
  parent_role:   new Set(['read-together', 'read-side-by-side', 'read-and-discuss', 'read-and-explore']),
  age_band:      new Set(['2-4', '5-7', '8-10', '10-12']),
  subject:       new Set(['science', 'geography', 'history', 'math', 'art', 'language-arts', 'social-emotional']),
  diversity_tag: new Set([
    'author-black', 'author-indigenous', 'author-asian', 'author-latino',
    'author-middle-eastern', 'author-pacific-islander', 'author-mixed-heritage',
    'protagonist-poc', 'protagonist-indigenous', 'protagonist-asian',
    'protagonist-latino', 'protagonist-middle-eastern',
    'protagonist-disability', 'protagonist-neurodivergent', 'protagonist-lgbtq',
    'setting-africa', 'setting-asia', 'setting-latin-america',
    'setting-middle-east', 'setting-pacific-islands', 'setting-indigenous-lands',
    'setting-global-multi-region', 'multilingual', 'translated-work',
  ]),
};

/* ── CSV parser ──────────────────────────────────────────────────────────── */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false, i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 2; }
      else if (ch === '"')                   { inQ = false; i++; }
      else                                   { field += ch; i++; }
    } else {
      if      (ch === '"')  { inQ = true; i++; }
      else if (ch === ',')  { row.push(field.trim()); field = ''; i++; }
      else if (ch === '\r' && text[i + 1] === '\n') {
        row.push(field.trim()); rows.push(row); row = []; field = ''; i += 2;
      }
      else if (ch === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; i++; }
      else                  { field += ch; i++; }
    }
  }
  if (field || row.length) { row.push(field.trim()); if (row.some(c => c)) rows.push(row); }
  return rows;
}

/* ── Slug generator ──────────────────────────────────────────────────────── */
const slugCounts = {};
function toSlug(title) {
  let slug = title
    .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
  const key = slug;
  slugCounts[key] = (slugCounts[key] || 0) + 1;
  if (slugCounts[key] > 1) slug += '-' + slugCounts[key];
  return slug;
}

function splitList(str) {
  if (!str || !str.trim()) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

function parseStandard(raw) {
  const t = raw.trim();
  if (t.startsWith('NGSS:')) return { code: t.slice(5).trim(), type: 'NGSS' };
  if (t.startsWith('CCSS:')) return { code: t.slice(5).trim(), type: 'CCSS' };
  if (t.startsWith('NGSS.')) return { code: t, type: 'NGSS' };
  if (t.startsWith('CCSS.')) return { code: t, type: 'CCSS' };
  return { code: t, type: 'CCSS' };
}

/* ── Column map (0-based) ────────────────────────────────────────────────── */
const COL = {
  title:0, author:1, illustrator:2, publisher:3, year_published:4,
  isbn:5, book_format:6, orbital_score:7, reading_level:8, page_count:9,
  read_aloud_minutes:10, parent_role:11, age_bands:12, themes:13,
  standards:14, subjects:15, diversity_tags:16, hook:17, orbital_description:18,
  best_for:19, pairs_with:20, talk_about_1:21, talk_about_2:22, talk_about_3:23,
  heads_up:24, library_link:25, purchase_link:26, cover_image_url:27,
  amazon_link:28,
};

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n📚 Wizkoo Library Import (PostgreSQL direct)${DRY_RUN ? ' — DRY RUN' : ''}`);
  console.log(`   CSV: ${CSV_PATH}\n`);

  const pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 15000,
  });

  // Test connection
  try {
    await pool.query('SELECT 1');
    console.log('✓ Database connected\n');
  } catch (e) {
    console.error('✗ Database connection failed:', e.message);
    await pool.end();
    process.exit(1);
  }

  // Optionally run schema
  if (RUN_SCHEMA) {
    console.log('Running sql/library-schema.sql …');
    const schemaPath = path.resolve(__dirname, '../sql/library-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    try {
      await pool.query(schema);
      console.log('✓ Schema applied\n');
    } catch (e) {
      // Ignore "already exists" errors — tables are probably already there
      if (e.code === '42P07' || e.message.includes('already exists')) {
        console.log('  Tables already exist — skipping schema, running migration only\n');
        try {
          await pool.query('ALTER TABLE library_books ADD COLUMN IF NOT EXISTS amazon_link TEXT');
        } catch (_) {}
      } else {
        console.error('Schema error:', e.message);
        await pool.end();
        process.exit(1);
      }
    }
  } else {
    // Always ensure amazon_link column exists
    try {
      await pool.query('ALTER TABLE library_books ADD COLUMN IF NOT EXISTS amazon_link TEXT');
    } catch (e) {
      if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
        console.warn('Note: could not add amazon_link column (may already exist):', e.message);
      }
    }
  }

  // Read CSV
  const raw = fs.readFileSync(path.resolve(CSV_PATH), 'utf-8');
  const rows = parseCSV(raw);
  const dataRows = rows.slice(1); // skip header
  console.log(`Found ${dataRows.length} data rows.\n`);

  const results = { imported: 0, skipped: 0, errors: [] };

  for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
    const cols    = dataRows[rowIdx];
    const lineNum = rowIdx + 2;
    const get = (idx) => (cols[idx] || '').trim();

    const title = get(COL.title);
    if (!title) { results.skipped++; results.errors.push(`Row ${lineNum}: empty title`); continue; }

    // ── Validate ──────────────────────────────────────────────────────────
    const errs = [];
    const orbital_score = parseInt(get(COL.orbital_score), 10);
    if (isNaN(orbital_score) || orbital_score < 1 || orbital_score > 5)
      errs.push(`orbital_score must be 1-5, got "${get(COL.orbital_score)}"`);

    const reading_level = get(COL.reading_level);
    if (!VALID.reading_level.has(reading_level))
      errs.push(`reading_level "${reading_level}" invalid`);

    const book_format = get(COL.book_format);
    if (!VALID.book_format.has(book_format))
      errs.push(`book_format "${book_format}" invalid`);

    const parent_role = get(COL.parent_role);
    if (!VALID.parent_role.has(parent_role))
      errs.push(`parent_role "${parent_role}" invalid`);

    if (!get(COL.hook))               errs.push('hook required');
    if (!get(COL.orbital_description)) errs.push('orbital_description required');
    if (!get(COL.best_for))            errs.push('best_for required');
    if (!get(COL.pairs_with))          errs.push('pairs_with required');

    const age_bands    = splitList(get(COL.age_bands));
    const bad_bands    = age_bands.filter(x => !VALID.age_band.has(x));
    if (bad_bands.length) errs.push(`Unknown age_bands: ${bad_bands.join(', ')}`);

    const subject_list = splitList(get(COL.subjects));
    const bad_subjects = subject_list.filter(x => !VALID.subject.has(x));
    if (bad_subjects.length) errs.push(`Unknown subjects: ${bad_subjects.join(', ')}`);

    const diversity_list_raw = splitList(get(COL.diversity_tags));
    const bad_tags           = diversity_list_raw.filter(x => !VALID.diversity_tag.has(x));
    const diversity_list     = diversity_list_raw.filter(x => VALID.diversity_tag.has(x));
    if (bad_tags.length) {
      // Warn but don't skip — just drop the unknown tags
      results.errors.push(`Row ${lineNum} "${title}": diversity_tags dropped (not in enum): ${bad_tags.join(', ')}`);
      console.warn(`  ⚠ Row ${lineNum}: dropping unknown diversity_tags: ${bad_tags.join(', ')}`);
    }

    if (errs.length) {
      results.errors.push(`Row ${lineNum} "${title}": ${errs.join('; ')}`);
      results.skipped++;
      console.log(`  ✗ Row ${lineNum} "${title.slice(0,40)}" — ${errs[0]}`);
      continue;
    }

    // ── Build record ──────────────────────────────────────────────────────
    const talk_about = [get(COL.talk_about_1), get(COL.talk_about_2), get(COL.talk_about_3)].filter(Boolean);
    const slug = toSlug(title);

    const book = {
      slug,
      title,
      author:             get(COL.author)             || null,
      illustrator:        get(COL.illustrator)         || null,
      publisher:          get(COL.publisher)           || null,
      year_published:     parseInt(get(COL.year_published), 10) || null,
      isbn:               get(COL.isbn)                || null,
      book_format,
      orbital_score,
      reading_level,
      page_count:         parseInt(get(COL.page_count), 10) || null,
      read_aloud_minutes: parseInt(get(COL.read_aloud_minutes), 10) || null,
      parent_role,
      hook:               get(COL.hook),
      orbital_description: get(COL.orbital_description),
      best_for:           get(COL.best_for),
      pairs_with:         get(COL.pairs_with),
      talk_about:         talk_about.length ? talk_about : null,
      heads_up:           get(COL.heads_up)            || null,
      library_link:       get(COL.library_link)        || null,
      purchase_link:      get(COL.purchase_link)       || null,
      cover_image_url:    get(COL.cover_image_url)     || null,
      amazon_link:        get(COL.amazon_link)         || null,
      status:             'active',
      curated_by:         'beth-holloway',
    };

    if (DRY_RUN) {
      console.log(`[DRY RUN] Row ${lineNum}: "${title}" (slug: ${slug})`);
      results.imported++;
      continue;
    }

    process.stdout.write(`Row ${lineNum}: "${title.slice(0,45)}" … `);

    // ── Upsert in a transaction ───────────────────────────────────────────
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Upsert main book
      const upsertSQL = `
        INSERT INTO library_books (
          slug, title, author, illustrator, publisher, year_published, isbn,
          book_format, orbital_score, reading_level, page_count, read_aloud_minutes,
          parent_role, hook, orbital_description, best_for, pairs_with,
          talk_about, heads_up, library_link, purchase_link, cover_image_url,
          amazon_link, status, curated_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25
        )
        ON CONFLICT (slug) DO UPDATE SET
          title=EXCLUDED.title, author=EXCLUDED.author, illustrator=EXCLUDED.illustrator,
          publisher=EXCLUDED.publisher, year_published=EXCLUDED.year_published,
          isbn=EXCLUDED.isbn, book_format=EXCLUDED.book_format,
          orbital_score=EXCLUDED.orbital_score, reading_level=EXCLUDED.reading_level,
          page_count=EXCLUDED.page_count, read_aloud_minutes=EXCLUDED.read_aloud_minutes,
          parent_role=EXCLUDED.parent_role, hook=EXCLUDED.hook,
          orbital_description=EXCLUDED.orbital_description, best_for=EXCLUDED.best_for,
          pairs_with=EXCLUDED.pairs_with, talk_about=EXCLUDED.talk_about,
          heads_up=EXCLUDED.heads_up, library_link=EXCLUDED.library_link,
          purchase_link=EXCLUDED.purchase_link, cover_image_url=EXCLUDED.cover_image_url,
          amazon_link=EXCLUDED.amazon_link, updated_at=now()
        RETURNING id
      `;
      const { rows: bookRows } = await client.query(upsertSQL, [
        book.slug, book.title, book.author, book.illustrator, book.publisher,
        book.year_published, book.isbn, book.book_format, book.orbital_score,
        book.reading_level, book.page_count, book.read_aloud_minutes,
        book.parent_role, book.hook, book.orbital_description, book.best_for,
        book.pairs_with, book.talk_about, book.heads_up, book.library_link,
        book.purchase_link, book.cover_image_url, book.amazon_link,
        book.status, book.curated_by,
      ]);
      const bookId = bookRows[0].id;

      // Delete and re-insert junction rows (cleanest approach for upsert semantics)
      await client.query('DELETE FROM library_age_bands WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_themes WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_standards WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_subjects WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_diversity WHERE book_id=$1', [bookId]);

      // Age bands
      for (const ab of age_bands) {
        await client.query(
          'INSERT INTO library_age_bands (book_id, age_band) VALUES ($1,$2)',
          [bookId, ab]
        );
      }

      // Themes
      const theme_list = splitList(get(COL.themes));
      for (const t of theme_list) {
        await client.query(
          'INSERT INTO library_themes (book_id, theme) VALUES ($1,$2)',
          [bookId, t]
        );
      }

      // Standards
      const standards_raw = splitList(get(COL.standards));
      for (const s of standards_raw) {
        const { code, type } = parseStandard(s);
        if (!code) continue;
        await client.query(
          'INSERT INTO library_standards (book_id, standard_code, standard_type) VALUES ($1,$2,$3)',
          [bookId, code, type]
        );
      }

      // Subjects
      for (const s of subject_list) {
        await client.query(
          'INSERT INTO library_subjects (book_id, subject) VALUES ($1,$2)',
          [bookId, s]
        );
      }

      // Diversity tags
      for (const tag of diversity_list) {
        await client.query(
          'INSERT INTO library_diversity (book_id, tag) VALUES ($1,$2)',
          [bookId, tag]
        );
      }

      await client.query('COMMIT');
      results.imported++;
      console.log('✓');
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      results.errors.push(`Row ${lineNum} "${title}": ${e.message}`);
      results.skipped++;
      console.log(`✗ ${e.message.slice(0, 80)}`);
    } finally {
      client.release();
    }
  }

  await pool.end();

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log(`✓ Imported: ${results.imported}`);
  console.log(`✗ Skipped:  ${results.skipped}`);
  console.log('═'.repeat(60));

  if (results.errors.length) {
    console.log(`\nErrors (${results.errors.length}):`);
    results.errors.forEach(e => console.log('  • ' + e));
    const logPath = path.resolve('scripts/import-errors.log');
    fs.writeFileSync(logPath, results.errors.join('\n') + '\n');
    console.log(`\nError log: ${logPath}`);
  }
  console.log('');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
