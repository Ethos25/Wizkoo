#!/usr/bin/env node
/**
 * Wizkoo Library — standards framework guard
 * ────────────────────────────────────────────────────────────────────────────
 * Asserts that no library_standards row's standard_type contradicts the
 * framework its own standard_code declares. A row saying standard_type='CCSS'
 * on the code "NGSS-2-LS4-1" makes the site publish a machine-readable claim
 * that an NGSS code is Common Core (js/library-book.js derives the framework
 * label from standard_type alone).
 *
 * Reads the library over the public REST endpoint using the same public config
 * the site itself ships in js/supabase-config.js — no credentials to supply.
 *
 * REPORTS BY DEFAULT, DOES NOT FAIL. As of the 2026-08-12 founder ruling the
 * 30 known contradictions are staying in the table: the library's parent-facing
 * standards claims are being removed, and the rows are retained only for the
 * plan generator's internal ranking, which does not read standard_type. A check
 * that fails forever on data nobody intends to correct is worse than no check,
 * so this one prints its findings and exits 0. Pass --strict to make it
 * enforcing (exit 1 on any contradiction) if the rows are ever corrected.
 *
 * Note this guards stored rows only. New imports are already blocked from
 * creating contradictions by the preflight in both importer scripts.
 *
 * Usage:
 *   node scripts/check-standard-types.js            # report, always exit 0
 *   node scripts/check-standard-types.js --strict   # exit 1 on contradictions
 *
 * Exit codes:
 *   0  report mode, or strict mode with no contradiction
 *   1  strict mode with at least one contradiction, or the check could not run
 * ────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { frameworkFromCode } = require('./lib/standard-prefix');

const STRICT = process.argv.includes('--strict');

/* Read the site's own public Supabase config (URL + anon key are published in
 * the browser bundle by design). Values are used, never printed. */
function readSiteConfig() {
  const file = path.resolve(__dirname, '../js/supabase-config.js');
  const src  = fs.readFileSync(file, 'utf-8');
  const grab = (name) => {
    const m = src.match(new RegExp(name + "\\s*=\\s*'([^']+)'"));
    return m ? m[1] : null;
  };
  const url = grab('WIZKOO_SUPABASE_URL');
  const key = grab('WIZKOO_SUPABASE_ANON_KEY');
  if (!url || !key) {
    throw new Error(`Could not read Supabase config from ${file}`);
  }
  return { url, key };
}

async function fetchStandards({ url, key }) {
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const endpoint =
      `${url}/rest/v1/library_standards` +
      `?select=standard_code,standard_type,library_books(slug)` +
      `&order=standard_code.asc`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Range: `${from}-${from + PAGE - 1}`,
      },
    });
    if (!res.ok) {
      throw new Error(`REST query failed: ${res.status} ${res.statusText}`);
    }
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return rows;
}

async function main() {
  let rows;
  try {
    rows = await fetchStandards(readSiteConfig());
  } catch (e) {
    console.error(`✗ Guard could not run: ${e.message}`);
    process.exit(1);
  }

  const contradictions = [];
  let unprefixed = 0;

  for (const r of rows) {
    const declared = frameworkFromCode(r.standard_code);
    if (declared === null) { unprefixed++; continue; }   // code carries no prefix to check
    if (declared !== r.standard_type) {
      const slug = (r.library_books && r.library_books.slug) || '(unknown book)';
      contradictions.push(
        `${slug}: "${r.standard_code}" declares ${declared}, ` +
        `stored standard_type = '${r.standard_type}'`
      );
    }
  }

  console.log(`Checked ${rows.length} library_standards rows ` +
              `(${unprefixed} carry no framework prefix and cannot be checked).`);

  if (contradictions.length > 0) {
    const mark = STRICT ? '✗' : '!';
    const say  = STRICT ? console.error : console.log;
    say(`\n${mark} ${contradictions.length} row(s) whose standard_type ` +
        `contradicts the code's own prefix:`);
    contradictions.forEach(m => say('  • ' + m));
    say('\nAnything rendering a framework label from standard_type alone would ' +
        'name the wrong framework for these rows.');
    if (STRICT) { process.exit(1); }
    say('Reporting only (run with --strict to fail). See the header for why.\n');
    return;
  }

  console.log('✓ No row contradicts its code\'s prefix.');
}

main();
