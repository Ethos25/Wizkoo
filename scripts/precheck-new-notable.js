#!/usr/bin/env node
'use strict';
const https = require('https');

const SUPABASE_KEY = 'sb_publishable_a6vN0LZHHzUiMriweg5nyQ_QZxVgf_h';

const books = [
  ['Fireworks','Matthew Burgess'],
  ['Every Monday Mabel','Jashar Awan'],
  ['Stalactite and Stalagmite: A Big Tale From a Little Cave','Drew Beckmeyer'],
  ['Sundust','Zeke Peña'],
  ['Our Lake','Angie Kang'],
  ["Will's Race for Home",'Jewell Parker Rhodes'],
  ['All the Blues in the Sky','Renée Watson'],
  ['The Teacher of Nomad Land: A World War II Story','Daniel Nayeri'],
  ['The Nine Moons of Han Yu and Luli','Karina Yan Glaser'],
  ['A Sea of Lemon Trees: The Corrido of Roberto Alvarez','María Dolores Águila'],
  ['Alberto Salas Plays Paka Paka con la Papa','Sara Andrea Fajardo'],
  ['Silenced Voices: Reclaiming Memories from the Guatemalan Genocide','Pablo Leon'],
  ['Stop That Mop!','Jonathan Fenske'],
  ['The Pecan Sheller','Lupe Ruiz-Flores'],
  ['Popo the Xolo','Paloma Angelina Lopez'],
  ['A-Ztec: A Bilingual Alphabet Book','Emmanuel Valtierra'],
  ['The Invisible Parade','Leigh Bardugo and John Picacio'],
  ['The Incredibly Human Henson Blayze','Derrick Barnes'],
  ['Dragon Flower','Chen Jiang Hong'],
  ['The Lighthouse Keeper','Eugenio Fernández Vázquez'],
  ['Making Art','Diana Ejaita'],
  ['Little Rebels','Yuyi Morales'],
  ['Sunday','Marcelo Tolentino'],
  ['Island Storm','Brian Floca'],
  ["Don't Trust Fish",'Neil Sharpson'],
  ['Mistaco','Eliza Kinkz'],
  ['The History of We','Nikkolas Smith'],
  ['J vs. K','Jerry Craft and Kwame Alexander'],
  ['Pocket','Katherine Applegate'],
  ['Afloat','Kirli Saunders'],
  ['Brave','Weshoyot Alvitre'],
  ['Across So Many Seas','Ruth Behar'],
  ['Revolutionary Mary: The True Story of One Woman, the Declaration of Independence, and America\'s Fight for Freedom','Karen Blumenthal and Jen McCartney'],
  ['Malcolm X: A Graphic Biography for Young Readers','Ibram X. Kendi'],
  ['Croco','Azul López'],
  ['The Day the Books Disappeared','Joanna Ho'],
  ['Dark Nights and Light Hearts: A Muslim Book of Opposites','Hena Khan'],
  ['Earthrise: How the Apollo 8 Crew Photographed the World','Leonard S. Marcus'],
  ['Tuck Everlasting: The Graphic Novel','Natalie Babbitt'],
  ['The Slightly Spooky Tale of Fox and Mole','Cecilia Heikkilä'],
  ['The Library in the Woods','R. Gregory Christie'],
  ['One Crazy Summer: The Graphic Novel','Rita Williams-Garcia'],
  ['The Leaving Room','Amber McBride'],
  ['Where Only Storms Grow: A Novel About the Dust Bowl','Alyssa Colman'],
  ['Wanda Hears the Stars: A Blind Astronomer Listens to the Universe','Amy S. Hansen and Wanda Díaz Merced'],
  ['Tuck Me In! A Science Bedtime Story','Nathan W. Pyle'],
  ['Neon','Jason Reynolds'],
  ['Legendary Frybread Drive-In: Intertribal Stories','edited by Cynthia Leitich Smith'],
  ['Anything','Rebecca Stead'],
  ['My Daddy Is a Cowboy','TBD — verify before import'],
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

  // Flag placeholder entries
  const placeholders = books.filter(([,a]) => a.includes('TBD') || a.includes('verify'));
  if (placeholders.length) {
    console.log('⚠ PLACEHOLDER AUTHOR DETECTED — needs fixing before import:');
    placeholders.forEach(([t,a]) => console.log('  • ' + t + ' (author: "' + a + '")'));
    console.log('');
  }

  const duplicates = [], noCovers = [], lowAvail = [], results = [];

  process.stdout.write('Checking ' + books.length + ' books');
  for (const [title, author] of books) {
    if (author.includes('TBD') || author.includes('verify')) {
      results.push({ title, author, placeholder: true });
      process.stdout.write('?');
      continue;
    }
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
    if (b.placeholder) { console.log('  [⚠ TBD]  ' + b.title + ' — author needs verification'); return; }
    if (b.dup) { console.log('  [DUPE]  ' + b.title); return; }
    n++;
    const flags = (!b.cover ? ' ⚠NO-COVER' : '') + (b.editions <= 1 && b.ratings === 0 ? ' ⚠LOW-AVAIL' : '');
    console.log('  ' + String(n).padStart(2) + '. ' + b.title.padEnd(54) + b.editions + ' ed  ' + b.ratings + ' ratings' + flags);
  });
  console.log('\nClean count: ' + n + ' (of ' + books.length + ', ' + duplicates.length + ' dupes, ' + placeholders.length + ' placeholders)');
})();
