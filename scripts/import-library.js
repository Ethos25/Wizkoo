#!/usr/bin/env node
/**
 * Wizkoo Library — Seed Data Import Script
 * ────────────────────────────────────────────────────────────────────────────
 * Reads Beth's spreadsheet (exported as CSV) and inserts books into Supabase.
 *
 * Usage:
 *   node scripts/import-library.js --csv path/to/books.csv
 *   node scripts/import-library.js --csv path/to/books.csv --dry-run
 *
 * Requirements:
 *   Node 18+ (for built-in fetch)
 *   SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables set
 *   (Use service key for import — not the anon key)
 *
 *   export SUPABASE_URL=https://yourproject.supabase.co
 *   export SUPABASE_SERVICE_KEY=your_service_role_key_here
 *
 * CSV column order (must match exactly):
 *   title | author | illustrator | publisher | year_published | isbn |
 *   book_format | orbital_score | reading_level | page_count | read_aloud_minutes |
 *   parent_role | age_bands | themes | standards | subjects | diversity_tags |
 *   hook | orbital_description | best_for | pairs_with |
 *   talk_about_1 | talk_about_2 | talk_about_3 | heads_up |
 *   library_link | purchase_link | cover_image_url
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};
const DRY_RUN = args.includes('--dry-run');
const CSV_PATH = getArg('--csv');

if (!CSV_PATH) {
  console.error('Usage: node scripts/import-library.js --csv path/to/books.csv [--dry-run]');
  process.exit(1);
}

/* ── Supabase config ─────────────────────────────────────────────────────── */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error([
    'Error: Missing environment variables.',
    '  export SUPABASE_URL=https://yourproject.supabase.co',
    '  export SUPABASE_SERVICE_KEY=your_service_role_key',
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
  standard_type: new Set(['CCSS', 'NGSS']),
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
/**
 * Minimal RFC 4180-compliant CSV parser.
 * Handles quoted fields with embedded commas and newlines.
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field.trim());
        field = '';
        i++;
      } else if (ch === '\r' && text[i + 1] === '\n') {
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
        i += 2;
      } else if (ch === '\n') {
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }
  // Last field/row
  if (field || row.length > 0) {
    row.push(field.trim());
    if (row.some(c => c !== '')) rows.push(row);
  }

  return rows;
}

/* ── Slug generator ──────────────────────────────────────────────────────── */
const slugCounts = {};
function toSlug(title) {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

  const key = slug;
  slugCounts[key] = (slugCounts[key] || 0) + 1;
  if (slugCounts[key] > 1) slug = slug + '-' + slugCounts[key];
  return slug;
}

/* ── Parse comma-separated values ───────────────────────────────────────── */
function splitList(str) {
  if (!str || !str.trim()) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

/* ── Parse standard code ─────────────────────────────────────────────────────
 * Handles both colon and dot separators:
 *   "CCSS:ELA-LITERACY.RL.4.1"  → { code: "ELA-LITERACY.RL.4.1", type: "CCSS" }
 *   "CCSS.ELA-LITERACY.RL.K.2"  → { code: "CCSS.ELA-LITERACY.RL.K.2", type: "CCSS" }
 *   "NGSS:3-LS1-1"              → { code: "3-LS1-1", type: "NGSS" }
 *   "NGSS.3-LS4-3"              → { code: "NGSS.3-LS4-3", type: "NGSS" }
 * For dot-prefixed codes the full string is kept as the code (it IS the standard code).
 */
function parseStandard(raw) {
  const trimmed = raw.trim();
  // Colon separator: strip prefix, rest is the code
  if (trimmed.startsWith('NGSS:')) return { code: trimmed.slice(5).trim(), type: 'NGSS' };
  if (trimmed.startsWith('CCSS:')) return { code: trimmed.slice(5).trim(), type: 'CCSS' };
  // Dot separator: determine type from prefix, keep full string as code
  if (trimmed.startsWith('NGSS.')) return { code: trimmed, type: 'NGSS' };
  if (trimmed.startsWith('CCSS.')) return { code: trimmed, type: 'CCSS' };
  // No recognised prefix — default to CCSS
  return { code: trimmed, type: 'CCSS' };
}

/* ── Supabase REST helper ────────────────────────────────────────────────── */
async function supabaseInsert(table, records) {
  if (DRY_RUN) return { data: records, error: null };

  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(Array.isArray(records) ? records : [records]),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { data: null, error: body };
  }
  return { data: body, error: null };
}

async function supabaseUpsert(table, records) {
  if (DRY_RUN) return { data: records, error: null };

  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation,resolution=merge-duplicates',
    },
    body: JSON.stringify(Array.isArray(records) ? records : [records]),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { data: null, error: body };
  }
  return { data: body, error: null };
}

/* ── Main import ─────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n📚 Wizkoo Library Import${DRY_RUN ? ' (DRY RUN — no data written)' : ''}`);
  console.log(`   CSV: ${CSV_PATH}\n`);

  // Read CSV
  let raw;
  try {
    raw = fs.readFileSync(path.resolve(CSV_PATH), 'utf-8');
  } catch (e) {
    console.error(`Error reading CSV: ${e.message}`);
    process.exit(1);
  }

  const rows = parseCSV(raw);
  if (rows.length < 2) {
    console.error('CSV appears empty or has no data rows.');
    process.exit(1);
  }

  // Skip header row
  const dataRows = rows.slice(1);
  console.log(`Found ${dataRows.length} data rows.\n`);

  // Column indices (0-based, matching the spec)
  const COL = {
    title:              0,
    author:             1,
    illustrator:        2,
    publisher:          3,
    year_published:     4,
    isbn:               5,
    book_format:        6,
    orbital_score:      7,
    reading_level:      8,
    page_count:         9,
    read_aloud_minutes: 10,
    parent_role:        11,
    age_bands:          12,
    themes:             13,
    standards:          14,
    subjects:           15,
    diversity_tags:     16,
    hook:               17,
    orbital_description:18,
    best_for:           19,
    pairs_with:         20,
    talk_about_1:       21,
    talk_about_2:       22,
    talk_about_3:       23,
    heads_up:           24,
    library_link:       25,
    purchase_link:      26,
    cover_image_url:    27,
    amazon_link:        28,   // added by enrich-library.js; absent in original 28-col CSV
  };

  const results = { imported: 0, skipped: 0, errors: [] };

  for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
    const cols = dataRows[rowIdx];
    const lineNum = rowIdx + 2; // 1-based, accounting for header

    const get = (idx) => (cols[idx] || '').trim();

    const title = get(COL.title);
    if (!title) {
      results.errors.push(`Row ${lineNum}: Empty title — skipping`);
      results.skipped++;
      continue;
    }

    // ── Validate required enum fields ────────────────────────────────────
    const validationErrors = [];

    const orbital_score = parseInt(get(COL.orbital_score), 10);
    if (isNaN(orbital_score) || orbital_score < 1 || orbital_score > 5) {
      validationErrors.push(`orbital_score must be 1-5, got "${get(COL.orbital_score)}"`);
    }

    const reading_level = get(COL.reading_level);
    if (!VALID.reading_level.has(reading_level)) {
      validationErrors.push(`reading_level "${reading_level}" not in: ${[...VALID.reading_level].join(', ')}`);
    }

    const book_format = get(COL.book_format);
    if (!VALID.book_format.has(book_format)) {
      validationErrors.push(`book_format "${book_format}" not in: ${[...VALID.book_format].join(', ')}`);
    }

    const parent_role = get(COL.parent_role);
    if (!VALID.parent_role.has(parent_role)) {
      validationErrors.push(`parent_role "${parent_role}" not in: ${[...VALID.parent_role].join(', ')}`);
    }

    const hook = get(COL.hook);
    if (!hook) validationErrors.push('hook is required');

    const orbital_description = get(COL.orbital_description);
    if (!orbital_description) validationErrors.push('orbital_description is required');

    const best_for = get(COL.best_for);
    if (!best_for) validationErrors.push('best_for is required');

    const pairs_with = get(COL.pairs_with);
    if (!pairs_with) validationErrors.push('pairs_with is required');

    // Age bands
    const age_band_list = splitList(get(COL.age_bands));
    const badBands = age_band_list.filter(ab => !VALID.age_band.has(ab));
    if (badBands.length) validationErrors.push(`Unknown age_bands: ${badBands.join(', ')}`);

    // Subjects
    const subject_list = splitList(get(COL.subjects));
    const badSubjects = subject_list.filter(s => !VALID.subject.has(s));
    if (badSubjects.length) validationErrors.push(`Unknown subjects: ${badSubjects.join(', ')}`);

    // Diversity tags
    const diversity_list = splitList(get(COL.diversity_tags));
    const badTags = diversity_list.filter(t => !VALID.diversity_tag.has(t));
    if (badTags.length) validationErrors.push(`Unknown diversity_tags: ${badTags.join(', ')}`);

    if (validationErrors.length > 0) {
      results.errors.push(`Row ${lineNum} "${title}": ${validationErrors.join('; ')}`);
      results.skipped++;
      continue;
    }

    // ── Build book record ────────────────────────────────────────────────
    const talk_about = [
      get(COL.talk_about_1),
      get(COL.talk_about_2),
      get(COL.talk_about_3),
    ].filter(Boolean);

    const bookRecord = {
      slug:               toSlug(title),
      title,
      author:             get(COL.author),
      illustrator:        get(COL.illustrator) || null,
      publisher:          get(COL.publisher)   || null,
      year_published:     parseInt(get(COL.year_published), 10) || null,
      isbn:               get(COL.isbn)        || null,
      book_format,
      orbital_score,
      reading_level,
      page_count:         parseInt(get(COL.page_count), 10) || null,
      read_aloud_minutes: parseInt(get(COL.read_aloud_minutes), 10) || null,
      parent_role,
      hook,
      orbital_description,
      best_for,
      pairs_with,
      talk_about:         talk_about.length > 0 ? talk_about : null,
      heads_up:           get(COL.heads_up)       || null,
      library_link:       get(COL.library_link)   || null,
      purchase_link:      get(COL.purchase_link)  || null,
      cover_image_url:    get(COL.cover_image_url)|| null,
      amazon_link:        get(COL.amazon_link)    || null,
      status:             'active',
      curated_by:         'beth-holloway',
    };

    // ── Insert main book record ──────────────────────────────────────────
    if (DRY_RUN) {
      console.log(`[DRY RUN] Row ${lineNum}: Would insert "${title}" (slug: ${bookRecord.slug})`);
    } else {
      process.stdout.write(`Row ${lineNum}: "${title}" … `);
    }

    const { data: bookData, error: bookError } = await supabaseUpsert('library_books', bookRecord);

    if (bookError) {
      const errMsg = `Row ${lineNum} "${title}": DB error — ${JSON.stringify(bookError)}`;
      results.errors.push(errMsg);
      results.skipped++;
      if (!DRY_RUN) console.log('✗');
      continue;
    }

    const bookId = DRY_RUN
      ? `dry-run-id-${rowIdx}`
      : (Array.isArray(bookData) ? bookData[0]?.id : bookData?.id);

    if (!bookId && !DRY_RUN) {
      results.errors.push(`Row ${lineNum} "${title}": Could not retrieve inserted book ID`);
      results.skipped++;
      console.log('✗ (no ID returned)');
      continue;
    }

    // ── Insert junction table rows ───────────────────────────────────────
    const junctionErrors = [];

    // Age bands
    if (age_band_list.length > 0) {
      const { error } = await supabaseUpsert('library_age_bands',
        age_band_list.map(ab => ({ book_id: bookId, age_band: ab }))
      );
      if (error) junctionErrors.push('age_bands: ' + JSON.stringify(error));
    }

    // Themes
    const theme_list = splitList(get(COL.themes));
    if (theme_list.length > 0) {
      const { error } = await supabaseUpsert('library_themes',
        theme_list.map(t => ({ book_id: bookId, theme: t }))
      );
      if (error) junctionErrors.push('themes: ' + JSON.stringify(error));
    }

    // Standards
    const standards_raw = splitList(get(COL.standards));
    if (standards_raw.length > 0) {
      const standardRecords = standards_raw.map(parseStandard).map(s => ({
        book_id: bookId,
        standard_code: s.code,
        standard_type: s.type,
      }));
      const { error } = await supabaseUpsert('library_standards', standardRecords);
      if (error) junctionErrors.push('standards: ' + JSON.stringify(error));
    }

    // Subjects
    if (subject_list.length > 0) {
      const { error } = await supabaseUpsert('library_subjects',
        subject_list.map(s => ({ book_id: bookId, subject: s }))
      );
      if (error) junctionErrors.push('subjects: ' + JSON.stringify(error));
    }

    // Diversity tags
    if (diversity_list.length > 0) {
      const { error } = await supabaseUpsert('library_diversity',
        diversity_list.map(t => ({ book_id: bookId, tag: t }))
      );
      if (error) junctionErrors.push('diversity: ' + JSON.stringify(error));
    }

    if (junctionErrors.length > 0) {
      const errMsg = `Row ${lineNum} "${title}" (book inserted, junction errors): ${junctionErrors.join('; ')}`;
      results.errors.push(errMsg);
      if (!DRY_RUN) console.log('⚠ (junction errors)');
    } else {
      results.imported++;
      if (!DRY_RUN) console.log('✓');
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log(`✓ Imported: ${results.imported}`);
  console.log(`✗ Skipped:  ${results.skipped}`);

  if (results.errors.length > 0) {
    console.log(`\nErrors (${results.errors.length}):`);
    results.errors.forEach(e => console.log('  • ' + e));

    // Write error log
    const logPath = path.resolve('scripts/import-errors.log');
    fs.writeFileSync(logPath, results.errors.join('\n') + '\n');
    console.log(`\nError log written to: ${logPath}`);
  }

  console.log('─'.repeat(60) + '\n');

  if (DRY_RUN) {
    console.log('DRY RUN complete. No data was written to Supabase.');
    console.log('Re-run without --dry-run to perform the actual import.\n');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
