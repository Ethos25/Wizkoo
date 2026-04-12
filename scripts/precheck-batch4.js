#!/usr/bin/env node
'use strict';
const https = require('https');

const SUPABASE_KEY = 'sb_publishable_a6vN0LZHHzUiMriweg5nyQ_QZxVgf_h';

const books = [
  ['My Side of the Mountain','Jean Craighead George'],
  ['The Hundred Dresses','Eleanor Estes'],
  ['The Penderwicks on Gardam Street','Jeanne Birdsall'],
  ['The Moffats','Eleanor Estes'],
  ['Ben Franklin\'s Almanac','Candace Fleming'],
  ['Flat Stanley','Jeff Brown'],
  ['The Great Brain','John D. Fitzgerald'],
  ['Amber Brown Is Not a Crayon','Paula Danziger'],
  ['Gentle Ben','Walt Morey'],
  ['By the Great Horn Spoon!','Sid Fleischman'],
  ['Sideways Stories from Wayside School','Louis Sachar'],
  ['Counting on Grace','Elizabeth Winthrop'],
  ['Savvy','Ingrid Law'],
  ['Amelia Bedelia','Peggy Parish'],
  ['Clementine','Sara Pennypacker'],
  ['The Lemonade War','Jacqueline Davies'],
  ['The One and Only Bob','Katherine Applegate'],
  ['Because of Mr. Terupt','Rob Buyea'],
  ['The House with a Clock in Its Walls','John Bellairs'],
  ['Mr. Revere and I','Robert Lawson'],
  ['Chasing Vermeer','Blue Balliett'],
  ['Summer of the Monkeys','Wilson Rawls'],
  ['The Fighting Ground','Avi'],
  ['Al Capone Does My Shirts','Gennifer Choldenko'],
  ['Liesl and Po','Lauren Oliver'],
  ['My Brother Sam Is Dead','James Lincoln Collier'],
  ['Poppy','Avi'],
  ['Isaac\'s Storm','Erik Larson'],
  ['Fablehaven','Brandon Mull'],
  ['Unraveling Freedom','Ann Bausum'],
  ['The Chocolate War','Robert Cormier'],
  ['Speak','Laurie Halse Anderson'],
  ['The Catcher in the Rye','J.D. Salinger'],
  ['My Antonia','Willa Cather'],
  ['Adventures of Huckleberry Finn','Mark Twain'],
  ['Ship Breaker','Paolo Bacigalupi'],
  ['The Pigman','Paul Zindel'],
  ['Divergent','Veronica Roth'],
  ['The Maze Runner','James Dashner'],
  ['Ethan Frome','Edith Wharton'],
  ['The Scarlet Letter','Nathaniel Hawthorne'],
  ['The Red Badge of Courage','Stephen Crane'],
  ['O Pioneers!','Willa Cather'],
  ['The Devil in the White City','Erik Larson'],
  ['Seabiscuit: An American Legend','Laura Hillenbrand'],
  ['Dune','Frank Herbert'],
  ['The Ox-Bow Incident','Walter Van Tilburg Clark'],
  ['Destiny of the Republic','Candice Millard'],
  ['The Name of the Wind','Patrick Rothfuss'],
  ['Red Rising','Pierce Brown'],
  ['Steve Jobs: The Man Who Thought Different','Karen Blumenthal'],
];

function httpsGet(hostname, path, headers) {
  return new Promise((resolve) => {
    const req = https.get({ hostname, path, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(14000, () => { req.destroy(); resolve(null); });
  });
}

async function getExistingTitles() {
  const data = await httpsGet(
    'uswqovyeltrkpjtdxjqj.supabase.co',
    '/rest/v1/library_books?select=title&limit=1000',
    { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
  );
  return new Set((data || []).map(b => b.title.toLowerCase().trim()));
}

async function checkOL(title, author) {
  const q = encodeURIComponent(title);
  const a = encodeURIComponent(author);
  const data = await httpsGet(
    'openlibrary.org',
    '/search.json?title=' + q + '&author=' + a + '&limit=1&fields=cover_i,edition_count,ratings_count',
    { 'User-Agent': 'WizkooCheck/1.0' }
  );
  if (!data || !data.docs || !data.docs.length) return { cover: false, editions: 0, ratings: 0 };
  const doc = data.docs[0];
  return { cover: !!doc.cover_i, editions: doc.edition_count || 0, ratings: doc.ratings_count || 0 };
}

(async () => {
  process.stdout.write('Fetching existing DB titles... ');
  const existing = await getExistingTitles();
  console.log(existing.size + ' books in DB.\n');

  const duplicates = [], noCovers = [], lowAvail = [], results = [];

  process.stdout.write('Checking ' + books.length + ' books');
  for (const [title, author] of books) {
    const isDup = existing.has(title.toLowerCase().trim());
    if (isDup) {
      duplicates.push({ title, author });
      results.push({ title, author, dup: true });
      process.stdout.write('D');
      continue;
    }
    const ol = await checkOL(title, author);
    if (!ol.cover) noCovers.push({ title, author, editions: ol.editions, ratings: ol.ratings });
    if (ol.editions <= 1 && ol.ratings === 0) lowAvail.push({ title, author, editions: ol.editions, ratings: ol.ratings });
    results.push({ title, author, dup: false, cover: ol.cover, editions: ol.editions, ratings: ol.ratings });
    process.stdout.write('.');
  }
  console.log('\n');

  console.log('=== GATE 1: DUPLICATES (' + duplicates.length + ') ===');
  if (!duplicates.length) console.log('None.');
  else duplicates.forEach(b => console.log('  DUPE: ' + b.title + ' (' + b.author + ')'));

  console.log('\n=== GATE 2: NO COVER IMAGE (' + noCovers.length + ') ===');
  if (!noCovers.length) console.log('None.');
  else noCovers.forEach(b => console.log('  NO-COVER: ' + b.title + ' [' + b.editions + ' ed, ' + b.ratings + ' ratings]'));

  console.log('\n=== GATE 3: LOW AVAILABILITY (<=1 ed + 0 ratings) (' + lowAvail.length + ') ===');
  if (!lowAvail.length) console.log('None.');
  else lowAvail.forEach(b => console.log('  LOW-AVAIL: ' + b.title + ' [' + b.editions + ' ed, ' + b.ratings + ' ratings]'));

  console.log('\n=== FULL TABLE ===');
  let n = 0;
  results.forEach(b => {
    if (b.dup) { console.log('  [DUPE]  ' + b.title); return; }
    n++;
    const flags = (!b.cover ? ' ⚠NO-COVER' : '') + (b.editions <= 1 && b.ratings === 0 ? ' ⚠LOW-AVAIL' : '');
    console.log('  ' + String(n).padStart(2) + '. ' + b.title.padEnd(46) + b.editions + ' ed  ' + b.ratings + ' ratings' + flags);
  });
  console.log('\nClean count: ' + n + ' (of ' + books.length + ' total, ' + duplicates.length + ' dupes removed)');
})();
