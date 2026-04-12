#!/usr/bin/env node
'use strict';
const https = require('https');

const SUPABASE_KEY = 'sb_publishable_a6vN0LZHHzUiMriweg5nyQ_QZxVgf_h';

const books = [
  ['I Did It!','Michael Emberley'],
  ['Fish and Wave','Sergio Ruzzier'],
  ['Gigi and Ojiji','Melissa Iwai'],
  ['Owl and Penguin','Vikram Madan'],
  ['Fox Has a Problem','Corey R. Tabor'],
  ['Henry, Like Always','Jenn Bailey'],
  ['Worm and Caterpillar Are Friends','Kaz Windness'],
  ['Fox Versus Fox','Corey R. Tabor'],
  ['Towed by Toad','Jashar Awan'],
  ['Choosing Brave: How Mamie Till-Mobley and Emmett Till Sparked the Civil Rights Movement','Angela Joy'],
  ['Papá\'s Magical Water-Jug Clock','Jesús Trejo'],
  ['Jovita Wore Pants: The Story of a Mexican Freedom Fighter','Aida Salazar'],
  ['Lola','Karla Arenas Valenti'],
  ['We Go Way Back: A Story of Life on Earth and How It All Began','Idan Ben-Barak'],
  ['Before Colors: Where Pigments and Dyes Come From','Annette Bay Pimentel'],
  ['How to Count to 1','Casper Salmon'],
  ['Seen and Unseen: What Dorothea Lange, Toyo Miyatake, and Ansel Adams\'s Photographs Reveal About the Japanese American Incarceration','Elizabeth Partridge'],
  ['Frizzy','Claribel A. Ortega'],
  ['The Last Mapmaker','Christina Soontornvat'],
  ['Maizy Chen\'s Last Chance','Lisa Yee'],
  ['The Book of Turtles','Sy Montgomery'],
  ['Holding Her Own: The Exceptional Life of Jackie Ormes','Traci N. Todd'],
  ['Shipwrecked! by the Laws of Science: How 14 Shipwrecks Redefined What We Know About Our World','Martin W. Sandler'],
  ['Call Me Roberto!: The Story of Roberto Clemente','Nathalie Alonso'],
  ['Santiago Saw Things Differently: Santiago Ramón y Cajal, Scientific Artist','Christine Iverson'],
  ['The Iguanodon\'s Horn: How Two Centuries of Mystery, Mistakes, and Fossil Fixes Changed the Way We Look at Dinosaurs','Sean Rubin'],
  ['Nell Plants a Tree','Anne Wynter'],
  ['Never Give Up: Dr. Katalin Karikó and the Race to the COVID-19 Vaccine','Debbie Dadey'],
  ['Life after Whale','Lynn Brunelle'],
  ['The Mona Lisa Vanishes: A Legendary Painter, a Shocking Heist, and the Birth of a Global Celebrity','Nicholas Day'],
  ['Remarkably Ruby','Terri Libenson'],
  ['The Enigma Girls: How Ten Teenagers Broke Ciphers, Kept Secrets, and Helped Win World War II','Candace Fleming'],
  ['The Impossible Creatures','Katherine Rundell'],
  ['Saints of the Household','Ari Tison'],
  ['American Murderer: The Parasite That Haunted the South','Gail Jarrow'],
  ['The Fabulous Fannie Farmer: The Woman Who Changed the Way America Cooks','Emma Bland Smith'],
  ['Mimic Makers: Biomimicry Inventors Inspired by Nature','Kristen Nordstrom'],
  ['A Window into the Ocean Twilight Zone','Michelle Cusolito'],
  ['Plague-Busters! A Germ-Hunter\'s History of Fighting Deadly Disease','Lindsey Fitzharris'],
  ['A Seed Grows','Antoinette Portis'],
  ['Shining Star: Vera Rubin Discovers Dark Matter','Suzanne Slade'],
  ['The Wild Robot Protects','Peter Brown'],
  ['Creep, Leap, Crunch! A Food Chain Story','Jody Jensen Shaffer'],
  ['The Skull: A Tyrolean Folktale','Jon Klassen'],
  ['Aggie and the Ghost','Matthew Forsythe'],
  ['Dawn: Watch the World Awaken','Marc Martin'],
  ['Blast Off!: The Story of Mary Sherman Morgan, America\'s First Female Rocket Scientist','Suzanne Slade'],
  ['Bounce! The Wonderful, Wacky, World-Changing History of Rubber','Sarah Albee'],
  ['The Tenth Mistake of Hank Hooperman','Gennifer Choldenko'],
  ['The One and Only Ruby','Katherine Applegate'],
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
