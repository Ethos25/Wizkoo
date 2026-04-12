#!/usr/bin/env node
'use strict';

const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error('Set DATABASE_URL first.'); process.exit(1); }

const FLAGGED_TITLES = [
  // ── REMOVE (10) ─────────────────────────────────────────────────────────────
  'Dune',
  'Ethan Frome',
  'My Antonia',
  'O Pioneers!',
  'Red Rising',
  'Speak',
  'The Catcher in the Rye',
  'The Chocolate War',
  'The Devil in the White City',
  'The Scarlet Letter',

  // ── REVIEW (54) ─────────────────────────────────────────────────────────────
  'Adventures of Huckleberry Finn',
  "Ain't Burned All the Bright",
  'All the Blues in the Sky',
  'Amber Brown Is Not a Crayon',
  'Because of Mr. Terupt',
  'Bomb',
  'Bridge to Terabithia',
  'Choosing Brave: How Mamie Till-Mobley and Emmett Till Sparked the Civil Rights Movement',
  'Counting by 7s',
  'Counting on Grace',
  'Destiny of the Republic',
  'Divergent',
  'Echo',
  'Esperanza Rising',
  'Fahrenheit 451',
  'Fatty Legs',
  'Feathers',
  'Freewater',
  'Ghost',
  'Holes',
  'Inside Out & Back Again',
  "Isaac's Storm",
  'Liesl and Po',
  'Little House on the Prairie',
  "Mama's Nightingale",
  'March: Book One',
  'Merci Suarez Changes Gears',
  'My Brother Sam Is Dead',
  'One Crazy Summer: The Graphic Novel',
  'Pancho Rabbit and the Coyote',
  'Pax',
  'Saints of the Household',
  'Seabiscuit: An American Legend',
  'Ship Breaker',
  'Silenced Voices: Reclaiming Memories from the Guatemalan Genocide',
  'Stella by Starlight',
  'Summer of the Monkeys',
  'The Fighting Ground',
  'The Giver',
  'The House of the Scorpion',
  'The House with a Clock in Its Walls',
  'The Hunger Games',
  'The Leaving Room',
  'The Maze Runner',
  'The Name of the Wind',
  'The One and Only Bob',
  'The Ox-Bow Incident',
  'The Pigman',
  'The Red Badge of Courage',
  'To Kill a Mockingbird',
  'Tuck Everlasting',
  'Tuck Everlasting: The Graphic Novel',
  'Where Only Storms Grow: A Novel About the Dust Bowl',
];

async function main() {
  const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await pool.query('SELECT 1');
  console.log('✓ Connected\n');

  // Look up all matching IDs (handles duplicates)
  const placeholders = FLAGGED_TITLES.map((_, i) => '$' + (i + 1)).join(', ');
  const { rows: found } = await pool.query(
    `SELECT id, title FROM library_books WHERE title IN (${placeholders}) ORDER BY title`,
    FLAGGED_TITLES
  );

  if (found.length === 0) {
    console.log('No matching books found.');
    await pool.end();
    return;
  }

  console.log(`Found ${found.length} book rows to delete:\n`);
  found.forEach(b => console.log('  • ' + b.title));
  console.log('');

  const ids = found.map(b => b.id);
  const idPlaceholders = ids.map((_, i) => '$' + (i + 1)).join(', ');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete junction tables first
    const junctions = ['library_age_bands', 'library_themes', 'library_subjects', 'library_standards'];
    for (const table of junctions) {
      const r = await client.query(`DELETE FROM ${table} WHERE book_id IN (${idPlaceholders})`, ids);
      console.log(`  Deleted ${r.rowCount} rows from ${table}`);
    }

    // Delete the books themselves
    const r = await client.query(`DELETE FROM library_books WHERE id IN (${idPlaceholders})`, ids);
    console.log(`  Deleted ${r.rowCount} rows from library_books`);

    await client.query('COMMIT');

    // Verify remaining count
    const { rows: remaining } = await client.query("SELECT COUNT(*) FROM library_books WHERE status = 'active'");
    console.log(`\n✓ Done. ${remaining[0].count} active books remain in the library.`);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('✗ Error — rolled back:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
