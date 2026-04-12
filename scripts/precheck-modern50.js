#!/usr/bin/env node
'use strict';
const https = require('https');

const SUPABASE_KEY = 'sb_publishable_a6vN0LZHHzUiMriweg5nyQ_QZxVgf_h';

const books = [
  ['Hot Dog','Doug Salati'],
  ['Big','Vashti Harrison'],
  ['In Every Life','Marla Frazee'],
  ['Chooch Helped','Andrea L. Rogers'],
  ['Fireworks','Matthew Burgess'],
  ['How Dinosaurs Went Extinct: A Safety Guide','Ame Dyckman'],
  ['Unflappable','Matthew Ward'],
  ['Invisible Things','Andy J. Pizza'],
  ['Too Much: An Overwhelming Day','Jolene Gutierrez'],
  ['There Was a Party for Langston','Jason Reynolds'],
  ['The Yellow Bus','Loren Long'],
  ['Drawn Onward','Daniel Nayeri'],
  ['My Strange Shrinking Parents','Zeno Sworder'],
  ['Once Upon a Book','Grace Lin'],
  ['How to Write a Poem','Kwame Alexander'],
  ['Jumper: A Day in the Life of a Backyard Jumping Spider','Jessica Lanan'],
  ['Wombats Are Pretty Weird: A (Not So) Serious Guide','Abi Cushman'],
  ['The Search for the Giant Arctic Jellyfish','Chloe Savage'],
  ['Mae and Gerty and the Matter with Matter','Elaine Vickers'],
  ['Hello, Stranger','Barbara O\'Connor'],
  ['Pony','R.J. Palacio'],
  ['Mexikid','Pedro Martín'],
  ['A Rover\'s Story','Jasmine Warga'],
  ['Iveliz Explains It All','Andrea Beatriz Arango'],
  ['The Marvellers','Dhonielle Clayton'],
  ['The Eyes and the Impossible','Dave Eggers'],
  ['Simon Sort of Says','Erin Bow'],
  ['Eagle Drums','Nasugraq Rainey Hopson'],
  ['The Many Assassinations of Samir, the Seller of Dreams','Daniel Nayeri'],
  ['The First State of Being','Erin Entrada Kelly'],
  ['Freewater','Amina Luqman-Dawson'],
  ['My Antarctica: True Adventures in the Land of Mummified Seals, Space Robots, and So Much More','G. Neri'],
  ['The Lumbering Giants of Windy Pines','Mo Netz'],
  ['Elf Dog and Owl Head','M.T. Anderson'],
  ['Pocket','Katherine Applegate'],
  ["Ain't Burned All the Bright",'Jason Reynolds'],
  ['J vs. K','Jerry Craft and Kwame Alexander'],
  ['Benny on the Case','Wesley King'],
  ['Please Pay Attention','Jamie Sumner'],
  ["Botticelli's Apprentice",'Ursula Murray Husted'],
  ['The Pecan Sheller','Lupe Ruiz-Flores'],
  ['The Truth about Dragons','Julie Leung'],
  ["Don't Trust Fish",'Neil Sharpson'],
  ['The Bear Out There','Jess Hannigan'],
  ['At the Window','Hope Lim'],
  ['Grief Is an Elephant','Tamara Ellis Smith'],
  ['NOA','Aaron Becker'],
  ['Still Life','Alex London'],
  ['The Poisoned King','Katherine Rundell'],
  ['Busted','Dan Gemeinhart'],
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
  const data = await httpsGet('uswqovyeltrkpjtdxjqj.supabase.co',
    '/rest/v1/library_books?select=title&limit=1000',
    { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY });
  return new Set((data || []).map(b => b.title.toLowerCase().trim()));
}

async function checkOL(title, author) {
  const q = encodeURIComponent(title), a = encodeURIComponent(author);
  const data = await httpsGet('openlibrary.org',
    '/search.json?title=' + q + '&author=' + a + '&limit=1&fields=cover_i,edition_count,ratings_count',
    { 'User-Agent': 'WizkooCheck/1.0' });
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
    if (isDup) { duplicates.push({ title, author }); results.push({ title, dup: true }); process.stdout.write('D'); continue; }
    const ol = await checkOL(title, author);
    if (!ol.cover) noCovers.push({ title, author, editions: ol.editions, ratings: ol.ratings });
    if (ol.editions <= 1 && ol.ratings === 0) lowAvail.push({ title, author, editions: ol.editions, ratings: ol.ratings });
    results.push({ title, author, dup: false, cover: ol.cover, editions: ol.editions, ratings: ol.ratings });
    process.stdout.write('.');
  }
  console.log('\n');

  console.log('=== GATE 1: DUPLICATES (' + duplicates.length + ') ===');
  if (!duplicates.length) console.log('None.');
  else duplicates.forEach(b => console.log('  DUPE: ' + b.title));

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
    console.log('  ' + String(n).padStart(2) + '. ' + b.title.padEnd(54) + b.editions + ' ed  ' + b.ratings + ' ratings' + flags);
  });
  console.log('\nClean count: ' + n + ' (of ' + books.length + ', ' + duplicates.length + ' dupes removed)');
})();
