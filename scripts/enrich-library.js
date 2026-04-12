#!/usr/bin/env node
/**
 * Wizkoo Library — ISBN Enrichment Script
 * ────────────────────────────────────────────────────────────────────────────
 * Reads the 218-book CSV, looks up ISBNs via Open Library (primary) and
 * Google Books (fallback), then generates cover, library, purchase, and
 * Amazon URLs. Writes an enriched CSV ready for import-library.js.
 *
 * Usage:
 *   node scripts/enrich-library.js --csv path/to/books.csv
 *   node scripts/enrich-library.js --csv path/to/books.csv --out path/to/enriched.csv
 *   node scripts/enrich-library.js --csv path/to/books.csv --delay 600
 *
 * Options:
 *   --csv     Input CSV path (required)
 *   --out     Output CSV path (default: input-path with _enriched suffix)
 *   --delay   Milliseconds between API calls (default: 500, min: 300)
 *
 * Requirements: Node 18+ (built-in fetch)
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const args    = process.argv.slice(2);
const getArg  = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const CSV_IN  = getArg('--csv');
const CSV_OUT = getArg('--out');
const DELAY_MS = Math.max(300, parseInt(getArg('--delay') || '500', 10));

if (!CSV_IN) {
  console.error('Usage: node scripts/enrich-library.js --csv path/to/books.csv [--out enriched.csv] [--delay 500]');
  process.exit(1);
}

const outPath = CSV_OUT || CSV_IN.replace(/\.csv$/i, '_enriched.csv');

/* ── Minimal CSV parser (RFC 4180) ───────────────────────────────────────── */
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

/* ── CSV serialiser ──────────────────────────────────────────────────────── */
function csvField(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}
function serializeCSV(rows) {
  return rows.map(r => r.map(csvField).join(',')).join('\r\n') + '\r\n';
}

/* ── API helpers ─────────────────────────────────────────────────────────── */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchJSON(url, label) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Wizkoo/1.0 (mailto:hello@wizkoo.com)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ── Open Library search ─────────────────────────────────────────────────── */
async function lookupOpenLibrary(title, author) {
  const q = encodeURIComponent(title);
  const a = encodeURIComponent(author);
  const url = `https://openlibrary.org/search.json?title=${q}&author=${a}&limit=3&fields=isbn,title,author_name`;
  const data = await fetchJSON(url, 'OL');
  if (!data || !data.docs || data.docs.length === 0) return null;

  // Prefer exact-ish title match
  const titleLow = title.toLowerCase();
  const authorLow = author.toLowerCase();

  for (const doc of data.docs) {
    const docTitle  = (doc.title || '').toLowerCase();
    const docAuthors = (doc.author_name || []).join(' ').toLowerCase();
    // Must share at least the first word of title and author surname
    const titleWord = titleLow.split(/\s+/)[0];
    const authorSurname = authorLow.split(/\s+/).pop();
    if (!docTitle.includes(titleWord)) continue;
    if (authorSurname.length > 2 && !docAuthors.includes(authorSurname)) continue;

    const isbns = doc.isbn || [];
    // Prefer ISBN-13
    const isbn13 = isbns.find(i => String(i).length === 13 && String(i).startsWith('97'));
    const isbn10 = isbns.find(i => String(i).length === 10);
    if (isbn13) return String(isbn13);
    if (isbn10) return String(isbn10);
  }

  // Fallback: just take first doc's first ISBN
  const firstDoc = data.docs[0];
  const isbns = firstDoc.isbn || [];
  const isbn13 = isbns.find(i => String(i).length === 13);
  if (isbn13) return String(isbn13);
  if (isbns[0]) return String(isbns[0]);
  return null;
}

/* ── Google Books fallback ───────────────────────────────────────────────── */
async function lookupGoogleBooks(title, author) {
  const q = encodeURIComponent(`intitle:${title} inauthor:${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=3&printType=books&langRestrict=en`;
  const data = await fetchJSON(url, 'GB');
  if (!data || !data.items || data.items.length === 0) return null;

  const titleLow  = title.toLowerCase();
  const authorLow = author.toLowerCase();
  const titleWord = titleLow.split(/\s+/)[0];
  const authorSurname = authorLow.split(/\s+/).pop();

  for (const item of data.items) {
    const vi = item.volumeInfo || {};
    const itemTitle   = (vi.title || '').toLowerCase();
    const itemAuthors = (vi.authors || []).join(' ').toLowerCase();
    if (!itemTitle.includes(titleWord)) continue;
    if (authorSurname.length > 2 && !itemAuthors.includes(authorSurname)) continue;

    const ids = vi.industryIdentifiers || [];
    const isbn13 = ids.find(x => x.type === 'ISBN_13');
    const isbn10 = ids.find(x => x.type === 'ISBN_10');
    if (isbn13) return isbn13.identifier;
    if (isbn10) return isbn10.identifier;
  }

  // Fallback: first item's first ID
  const ids = (data.items[0]?.volumeInfo?.industryIdentifiers) || [];
  const isbn13 = ids.find(x => x.type === 'ISBN_13');
  if (isbn13) return isbn13.identifier;
  const isbn10 = ids.find(x => x.type === 'ISBN_10');
  if (isbn10) return isbn10.identifier;
  return null;
}

/* ── URL generators ─────────────────────────────────────────────────────── */
function coverUrl(isbn)    { return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`; }
function libraryUrl(isbn)  { return `https://search.worldcat.org/search?q=${isbn}`; }
function purchaseUrl(isbn) { return `https://bookshop.org/p/books?q=${isbn}`; }
function amazonUrl(isbn)   { return `https://www.amazon.com/s?k=${isbn}`; }

/* ── Cover image verification (HEAD request) ─────────────────────────────── */
async function coverExists(isbn) {
  try {
    const res = await fetch(coverUrl(isbn), {
      method: 'HEAD',
      signal: AbortSignal.timeout(8000),
    });
    // Open Library returns a 1×1 GIF for missing covers — check Content-Length
    if (!res.ok) return false;
    const len = res.headers.get('content-length');
    // 1×1 GIF is 43 bytes; anything > 500 bytes is a real cover
    return len === null || parseInt(len, 10) > 500;
  } catch {
    return false;
  }
}

/* ── Column map (0-based, matching original 28-col spec) ────────────────── */
const COL = {
  title: 0, author: 1, illustrator: 2, publisher: 3, year_published: 4,
  isbn: 5, book_format: 6, orbital_score: 7, reading_level: 8,
  page_count: 9, read_aloud_minutes: 10, parent_role: 11,
  age_bands: 12, themes: 13, standards: 14, subjects: 15, diversity_tags: 16,
  hook: 17, orbital_description: 18, best_for: 19, pairs_with: 20,
  talk_about_1: 21, talk_about_2: 22, talk_about_3: 23, heads_up: 24,
  library_link: 25, purchase_link: 26, cover_image_url: 27,
  // amazon_link will be appended as column 28 in the output
};

/* ── Main ────────────────────────────────────────────────────────────────── */
async function main() {
  console.log(`\n📚 Wizkoo Library Enrichment`);
  console.log(`   Input:  ${CSV_IN}`);
  console.log(`   Output: ${outPath}`);
  console.log(`   Delay:  ${DELAY_MS}ms between API calls\n`);

  const raw = fs.readFileSync(path.resolve(CSV_IN), 'utf-8');
  const rows = parseCSV(raw);
  const header = rows[0];
  const data   = rows.slice(1);

  // Build output header: original 28 cols + amazon_link
  const outHeader = [...header, 'amazon_link'];

  const stats = { total: data.length, enriched: 0, isbn_found: 0, isbn_missing: 0, cover_confirmed: 0, cover_missing: 0 };
  const errors = [];
  const outRows = [outHeader];

  for (let i = 0; i < data.length; i++) {
    const cols  = [...data[i]];
    // Pad to at least 28 cols
    while (cols.length < 28) cols.push('');

    const title  = (cols[COL.title]  || '').trim();
    const author = (cols[COL.author] || '').trim();
    const existingIsbn = (cols[COL.isbn] || '').trim();

    const lineNum = i + 2;
    process.stdout.write(`[${String(i + 1).padStart(3, ' ')}/${data.length}] "${title.slice(0, 50)}" … `);

    let isbn = existingIsbn || null;

    // ── ISBN lookup (skip if already populated) ────────────────────────────
    if (!isbn) {
      // Try Open Library first
      isbn = await lookupOpenLibrary(title, author);
      await sleep(DELAY_MS);

      // Fallback: Google Books
      if (!isbn) {
        isbn = await lookupGoogleBooks(title, author);
        await sleep(DELAY_MS);
      } else {
        await sleep(DELAY_MS);
      }
    }

    if (!isbn) {
      errors.push({ row: lineNum, title, author, reason: 'ISBN not found in Open Library or Google Books' });
      stats.isbn_missing++;
      process.stdout.write('✗ ISBN not found\n');

      // Still include the row in output, just with empty link fields
      const outCols = [...cols, ''];
      outRows.push(outCols);
      continue;
    }

    stats.isbn_found++;
    cols[COL.isbn] = isbn;

    // ── Generate URLs ──────────────────────────────────────────────────────
    cols[COL.library_link]  = libraryUrl(isbn);
    cols[COL.purchase_link] = purchaseUrl(isbn);
    const amzLink           = amazonUrl(isbn);
    const covUrl            = coverUrl(isbn);

    // ── Verify cover image exists ──────────────────────────────────────────
    const hasCover = await coverExists(isbn);
    await sleep(Math.floor(DELAY_MS / 2)); // shorter delay for HEAD request

    if (hasCover) {
      cols[COL.cover_image_url] = covUrl;
      stats.cover_confirmed++;
      process.stdout.write(`✓ ISBN ${isbn} cover ✓\n`);
    } else {
      cols[COL.cover_image_url] = '';
      stats.cover_missing++;
      errors.push({ row: lineNum, title, author, reason: `ISBN ${isbn} found but no cover image on Open Library` });
      process.stdout.write(`✓ ISBN ${isbn} cover ✗\n`);
    }

    const outCols = [...cols, amzLink];
    outRows.push(outCols);
    stats.enriched++;
  }

  // ── Write enriched CSV ─────────────────────────────────────────────────
  fs.writeFileSync(path.resolve(outPath), serializeCSV(outRows), 'utf-8');

  // ── Write error/report JSON ────────────────────────────────────────────
  const reportPath = outPath.replace(/\.csv$/i, '_report.json');
  const report = {
    run_at: new Date().toISOString(),
    input_file: CSV_IN,
    output_file: outPath,
    stats: {
      total_books:       stats.total,
      isbn_found:        stats.isbn_found,
      isbn_missing:      stats.isbn_missing,
      cover_confirmed:   stats.cover_confirmed,
      cover_missing:     stats.cover_missing,
      rows_enriched:     stats.enriched,
    },
    missing_isbn: errors.filter(e => e.reason.startsWith('ISBN not found')).map(e => `Row ${e.row}: ${e.title} — ${e.author}`),
    missing_cover: errors.filter(e => e.reason.includes('no cover')).map(e => `Row ${e.row}: ${e.title} — ISBN ${e.reason.match(/ISBN (\S+)/)?.[1]}`),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log(`✓ Enriched CSV:     ${outPath}`);
  console.log(`✓ Report:           ${reportPath}`);
  console.log('─'.repeat(60));
  console.log(`  Total books:      ${stats.total}`);
  console.log(`  ISBNs found:      ${stats.isbn_found}`);
  console.log(`  ISBNs missing:    ${stats.isbn_missing}`);
  console.log(`  Covers confirmed: ${stats.cover_confirmed}`);
  console.log(`  Covers missing:   ${stats.cover_missing}`);
  console.log('═'.repeat(60) + '\n');

  if (report.missing_isbn.length > 0) {
    console.log(`Books without ISBNs (${report.missing_isbn.length}):`);
    report.missing_isbn.forEach(l => console.log('  • ' + l));
    console.log('');
  }
  if (report.missing_cover.length > 0) {
    console.log(`ISBNs found but no cover image (${report.missing_cover.length}):`);
    report.missing_cover.forEach(l => console.log('  • ' + l));
    console.log('');
  }

  console.log('Next step:');
  console.log('  node scripts/import-library.js --csv ' + outPath + '\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
