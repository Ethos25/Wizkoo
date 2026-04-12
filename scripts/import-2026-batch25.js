#!/usr/bin/env node
'use strict';

const fs    = require('fs');
const https = require('https');
const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error('Set DATABASE_URL first.'); process.exit(1); }

/* ── CSV parser ─────────────────────────────────────────────────────────────── */
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
  heads_up:24, library_note:25, purchase_link:26, cover_image_url:27,
};

function splitList(str) {
  if (!str || !str.trim()) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}
function splitPipe(str) {
  if (!str || !str.trim()) return [];
  return str.split('|').map(s => s.trim()).filter(Boolean);
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
function mapSubjects(rawList) {
  const valid = new Set(['science','geography','history','math','art','language-arts','social-emotional']);
  const seen = new Set(), out = [];
  for (const s of rawList) {
    if (valid.has(s) && !seen.has(s)) { seen.add(s); out.push(s); }
  }
  return out;
}

/* ── HTTP helpers ───────────────────────────────────────────────────────────── */
function httpsGet(hostname, path, headers) {
  return new Promise((resolve) => {
    const req = https.get({ hostname, path, headers: headers || {} }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(14000, () => { req.destroy(); resolve(null); });
  });
}

function checkImageUrl(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'HEAD' }, res => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(8000, () => { req.destroy(); resolve(false); });
      req.end();
    } catch(e) { resolve(false); }
  });
}

async function enrichFromOL(title, author) {
  const q = encodeURIComponent(title), a = encodeURIComponent(author);
  let data = await httpsGet('openlibrary.org',
    '/search.json?title=' + q + '&author=' + a + '&limit=1&fields=cover_i,isbn',
    { 'User-Agent': 'WizkooImport/1.0' });
  if (!data || !data.docs || !data.docs.length) {
    const q2 = encodeURIComponent(title + ' ' + author);
    data = await httpsGet('openlibrary.org',
      '/search.json?q=' + q2 + '&limit=1&fields=cover_i,isbn',
      { 'User-Agent': 'WizkooImport/1.0' });
  }
  if (!data || !data.docs || !data.docs.length) return null;
  const doc = data.docs[0];
  const isbns = doc.isbn || [];
  const isbn13 = isbns.find(i => String(i).length === 13 && String(i).startsWith('97')) || null;
  const isbn10 = isbn13 ? isbn13toIsbn10(isbn13) : (isbns.find(i => String(i).length === 10) || null);
  return { isbn: isbn13, isbn10, cover_i: doc.cover_i || null };
}

async function enrich(title, author, csvIsbn) {
  const ol = await enrichFromOL(title, author);
  const isbn = ol ? ol.isbn : (csvIsbn || null);
  const isbn10 = ol ? ol.isbn10 : (isbn ? isbn13toIsbn10(isbn) : null);

  // 1. OL cover_i
  if (ol && ol.cover_i) {
    return {
      isbn,
      cover_image_url: 'https://covers.openlibrary.org/b/id/' + ol.cover_i + '-L.jpg',
      library_link:  isbn ? 'https://search.worldcat.org/search?q=' + isbn : null,
      purchase_link: isbn ? 'https://bookshop.org/books?keywords=' + isbn : null,
      amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
      source: 'ol',
    };
  }

  // 2. OL cover by ISBN
  if (isbn) {
    const coverUrl = 'https://covers.openlibrary.org/b/isbn/' + isbn + '-L.jpg';
    const ok = await checkImageUrl(coverUrl);
    if (ok) {
      return {
        isbn,
        cover_image_url: coverUrl,
        library_link:  'https://search.worldcat.org/search?q=' + isbn,
        purchase_link: 'https://bookshop.org/books?keywords=' + isbn,
        amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
        source: 'ol-isbn',
      };
    }
  }

  return {
    isbn,
    cover_image_url: null,
    library_link:  isbn ? 'https://search.worldcat.org/search?q=' + isbn : null,
    purchase_link: isbn ? 'https://bookshop.org/books?keywords=' + isbn : null,
    amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
    source: 'none',
  };
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
async function main() {
  console.log('\n📚 Wizkoo Library — 2026 Batch 25 Import\n');
  const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false }, max: 3 });
  await pool.query('SELECT 1');
  console.log('✓ Database connected\n');

  const raw = fs.readFileSync('C:/Users/amyog/Downloads/wizkoo_2026_batch_25.csv', 'utf8');
  const rows = parseCSV(raw).slice(1);

  let imported = 0, skipped = 0;
  const errors = [], noCovers = [];

  for (const cols of rows) {
    const get = (idx) => (cols[idx] || '').trim();
    const title = get(COL.title);
    if (!title) continue;

    const author = get(COL.author);
    process.stdout.write('  ' + title.slice(0, 48).padEnd(50) + ' … ');

    const csvIsbn = get(COL.isbn) || null;
    const e = await enrich(title, author, csvIsbn);
    if (!e.cover_image_url) noCovers.push(title);

    const slug        = toSlug(title);
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
        author || null, get(COL.illustrator) || null,
        get(COL.publisher) || null, parseInt(get(COL.year_published), 10) || null,
        e.isbn || null, get(COL.book_format), parseInt(get(COL.orbital_score), 10),
        get(COL.reading_level), parseInt(get(COL.page_count), 10) || null,
        parseInt(get(COL.read_aloud_minutes), 10) || null, get(COL.parent_role),
        get(COL.hook), get(COL.orbital_description), get(COL.best_for), get(COL.pairs_with),
        talk_about.length ? talk_about : null, get(COL.heads_up) || null,
        e.library_link || null, e.purchase_link || null,
        e.cover_image_url || null, e.amazon_link || null,
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
      const coverFlag = e.cover_image_url ? '🖼  [' + e.source + ']' : '⚠  no cover';
      console.log('✓  ' + (e.isbn || 'no ISBN') + '  ' + coverFlag);
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
  console.log('✗ Errors:    ' + skipped);
  console.log('═'.repeat(60));
  if (noCovers.length) {
    console.log('\n⚠ No cover after OL fallbacks (patch via Amazon):');
    noCovers.forEach(t => console.log('  • ' + t));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach(e => console.log('  • ' + e));
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
