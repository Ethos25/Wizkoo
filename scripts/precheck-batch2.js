#!/usr/bin/env node
'use strict';
const https = require('https');

const SUPABASE_URL = 'https://uswqovyeltrkpjtdxjqj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_a6vN0LZHHzUiMriweg5nyQ_QZxVgf_h';

const books = [
  ['Inch by Inch','Leo Lionni'],
  ['Harold and the Purple Crayon','Crockett Johnson'],
  ['Beautiful Oops','Barney Saltzberg'],
  ['The Carrot Seed','Ruth Krauss'],
  ['Planting a Rainbow','Lois Ehlert'],
  ['Growing Vegetable Soup','Lois Ehlert'],
  ['Tops and Bottoms','Janet Stevens'],
  ['Click Clack Moo: Cows That Type','Doreen Cronin'],
  ['Diary of a Worm','Doreen Cronin'],
  ['Diary of a Spider','Doreen Cronin'],
  ['Green Eggs and Ham','Dr. Seuss'],
  ['The Lorax','Dr. Seuss'],
  ['If You Give a Mouse a Cookie','Laura Numeroff'],
  ['If You Give a Pig a Pancake','Laura Numeroff'],
  ['Chrysanthemum','Kevin Henkes'],
  ['Wemberly Worried','Kevin Henkes'],
  ["Lilly's Purple Plastic Purse",'Kevin Henkes'],
  ['Alexander and the Terrible Horrible No Good Very Bad Day','Judith Viorst'],
  ['Enemy Pie','Derek Munson'],
  ["The Recess Queen","Alexis O'Neill"],
  ['Roxaboxen','Alice McLerran'],
  ['Miss Rumphius','Barbara Cooney'],
  ['Frog and Toad Are Friends','Arnold Lobel'],
  ['Owl at Home','Arnold Lobel'],
  ['Grumpy Monkey','Suzanne Lang'],
  ['Dragons Love Tacos','Adam Rubin'],
  ['Extra Yarn','Mac Barnett'],
  ['This Is Not My Hat','Jon Klassen'],
  ['Sam and Dave Dig a Hole','Mac Barnett'],
  ['Leo the Late Bloomer','Robert Kraus'],
  ["Don't Let the Pigeon Drive the Bus",'Mo Willems'],
  ['Knuffle Bunny','Mo Willems'],
  ['Thunder Cake','Patricia Polacco'],
  ['The Keeping Quilt','Patricia Polacco'],
  ['Ish','Peter Reynolds'],
  ['The Garden of Abdul Gasazi','Chris Van Allsburg'],
  ['Jumanji','Chris Van Allsburg'],
  ['In a Small Small Pond','Denise Fleming'],
  ['The Book With No Pictures','B.J. Novak'],
  ['The Way I Feel','Janan Cain'],
  ['Goodnight Gorilla','Peggy Rathmann'],
  ['Officer Buckle and Gloria','Peggy Rathmann'],
  ['The Giving Tree','Shel Silverstein'],
  ['Chicka Chicka Boom Boom','Bill Martin Jr.'],
  ['Corduroy','Don Freeman'],
  ['Little Blue Truck','Alice Schertle'],
  ['George and Martha','James Marshall'],
  ['The Biggest Bear','Lynd Ward'],
  ['The Relatives Came','Cynthia Rylant'],
  ['What Do You Do with a Chance','Kobi Yamada'],
  ['The Napping House','Audrey Wood'],
  ['Sylvester and the Magic Pebble','William Steig'],
  ['Doctor De Soto','William Steig'],
  ['Brave Irene','William Steig'],
  ['The Big Red Barn','Margaret Wise Brown'],
  ['Runaway Bunny','Margaret Wise Brown'],
  ['Stone Soup','Marcia Brown'],
  ['Over in the Meadow','John Langstaff'],
  ['Clifford the Big Red Dog','Norman Bridwell'],
  ['The Day the Crayons Quit','Drew Daywalt'],
  ['The Hello Goodbye Window','Norton Juster'],
  ['How Do Dinosaurs Say Goodnight','Jane Yolen'],
  ['How a House Is Built','Gail Gibbons'],
  ['From Seed to Plant','Gail Gibbons'],
  ['Duck and Goose','Tad Hills'],
  ['The Pout-Pout Fish','Deborah Diesen'],
  ['The Very Quiet Cricket','Eric Carle'],
  ['Stellaluna','Janell Cannon'],
  ['Stuart Little','E.B. White'],
  ['The Trumpet of the Swan','E.B. White'],
  ['Ramona Quimby Age 8','Beverly Cleary'],
  ["Mr. Popper's Penguins",'Richard and Florence Atwater'],
  ['The Cricket in Times Square','George Selden'],
  ["My Father's Dragon",'Ruth Stiles Gannett'],
  ['Mrs. Piggle-Wiggle','Betty MacDonald'],
  ['Little House in the Big Woods','Laura Ingalls Wilder'],
  ['Little House on the Prairie','Laura Ingalls Wilder'],
  ['Tuck Everlasting','Natalie Babbitt'],
];

function httpsGet(hostname, path, headers) {
  return new Promise((resolve) => {
    const req = https.get({ hostname, path, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(12000, () => { req.destroy(); resolve(null); });
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

  const duplicates = [];
  const noCovers = [];
  const lowAvail = [];
  const results = [];

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

  console.log('\n=== GATE 3: LOW AVAILABILITY (' + lowAvail.length + ') ===');
  if (!lowAvail.length) console.log('None.');
  else lowAvail.forEach(b => console.log('  LOW-AVAIL: ' + b.title + ' [' + b.editions + ' ed, ' + b.ratings + ' ratings]'));

  console.log('\n=== FULL TABLE ===');
  let n = 0;
  results.forEach(b => {
    if (b.dup) { console.log('  [DUPE]  ' + b.title); return; }
    n++;
    const flags = (!b.cover ? ' ⚠NO-COVER' : '') + (b.editions <= 1 && b.ratings === 0 ? ' ⚠LOW-AVAIL' : '');
    console.log('  ' + String(n).padStart(2) + '. ' + b.title.padEnd(52) + b.editions + ' ed  ' + b.ratings + ' ratings' + flags);
  });
  console.log('\nClean (non-dupe) count: ' + n);
})();
