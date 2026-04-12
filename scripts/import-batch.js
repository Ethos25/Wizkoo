#!/usr/bin/env node
/**
 * Wizkoo Library — Batch Import (direct pg + Open Library enrichment)
 * Usage: DATABASE_URL=postgresql://... node scripts/import-batch.js
 */
'use strict';

const https = require('https');
const { Pool } = require('pg');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error('Set DATABASE_URL first.'); process.exit(1); }

/* ── Books ────────────────────────────────────────────────────────────────── */
const BOOKS = [
  {
    title: 'Goodnight Moon', author: 'Margaret Wise Brown', illustrator: 'Clement Hurd',
    year_published: 1947, book_format: 'board-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 32, read_aloud_minutes: 5,
    parent_role: 'read-together', age_bands: ['2-4'],
    themes: ['bedtime','stars','routine','language','night-sky'],
    subjects: ['language-arts','science'],
    hook: 'The most soothing two minutes in childhood — and a secret lesson in language pattern and the night sky.',
    orbital_description: 'Every object in the room becomes a vocabulary lesson; every repetition builds phonological awareness; the moon outside the window opens a first conversation about astronomy and the natural world.',
    best_for: 'Ages 2-4, pre-reader. 5 min read-aloud.',
    pairs_with: 'Pairs with night sky themes in Atlas — find the moon on the globe.',
    talk_about: ['What do you say goodnight to before you sleep?','Why does the moon look different on different nights?'],
    heads_up: null,
  },
  {
    title: 'Where the Wild Things Are', author: 'Maurice Sendak', illustrator: 'Maurice Sendak',
    year_published: 1963, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 48, read_aloud_minutes: 8,
    parent_role: 'read-together', age_bands: ['2-4'],
    themes: ['imagination','anger','home','wild-creatures','emotional-regulation'],
    subjects: ['social-emotional','language-arts'],
    hook: 'Max sails to a land of monsters and discovers that home is the most powerful place of all — and that anger is something you can return from.',
    orbital_description: "The book opens emotional literacy, imaginative geography, and the psychology of big feelings. Max's journey out and back mirrors every child's experience of being overwhelmed and finding a way home.",
    best_for: 'Ages 2-4, pre-reader. 8 min read-aloud.',
    pairs_with: 'Pairs with the emotions weekly theme and social-emotional learning activities.',
    talk_about: ['Have you ever felt so angry you wanted to run away?','What would your wild rumpus look like?','Why do you think Max wanted to go home?'],
    heads_up: null,
  },
  {
    title: 'The Very Hungry Caterpillar', author: 'Eric Carle', illustrator: 'Eric Carle',
    year_published: 1969, book_format: 'board-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 26, read_aloud_minutes: 5,
    parent_role: 'read-together', age_bands: ['2-4'],
    themes: ['life-cycle','counting','food','days-of-week','metamorphosis'],
    subjects: ['science','math'],
    hook: "One tiny egg becomes a butterfly — and along the way teaches counting and one of biology's most astonishing transformations.",
    orbital_description: "This is a science lesson disguised as a story: metamorphosis, food chains, number sequences, and days of the week fold into a single caterpillar's journey. Children absorb the life cycle before they know they're learning it.",
    best_for: 'Ages 2-4, pre-reader. 5 min read-aloud.',
    pairs_with: "Pairs with Elementum's carbon and organic chemistry elements; Atlas butterfly migration routes.",
    talk_about: ['Why does the caterpillar eat so much?','What would you eat if you were very hungry for a whole week?','What comes after the cocoon?'],
    heads_up: null,
  },
  {
    title: 'Make Way for Ducklings', author: 'Robert McCloskey', illustrator: 'Robert McCloskey',
    year_published: 1941, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 64, read_aloud_minutes: 10,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['urban-nature','Boston','problem-solving','community','city'],
    subjects: ['science','social-emotional','geography'],
    hook: 'A mother duck navigates the city of Boston to find a safe home for her ducklings — and an entire city stops to help her do it.',
    orbital_description: "The book opens urban ecology, Boston's real geography and landmarks, community cooperation, and early problem-solving. The city children can later find on a globe is woven through every illustration.",
    best_for: 'Ages 2-4, pre-reader. 10 min read-aloud.',
    pairs_with: 'Pairs with Atlas city geography and the community weekly theme.',
    talk_about: ['What would it feel like to walk through a busy city as a duck?','Why did all the people stop to help?','Can you find Boston on a map?'],
    heads_up: null,
  },
  {
    title: 'Blueberries for Sal', author: 'Robert McCloskey', illustrator: 'Robert McCloskey',
    year_published: 1948, book_format: 'picture-book', orbital_score: 4,
    reading_level: 'pre-reader', page_count: 56, read_aloud_minutes: 8,
    parent_role: 'read-together', age_bands: ['2-4'],
    themes: ['nature','seasons','mother-child','Maine','foraging'],
    subjects: ['science','social-emotional'],
    hook: 'A little girl and a bear cub both follow the wrong mother in the blueberry patch — a perfect parallel story about summer food and staying close.',
    orbital_description: "The book teaches foraging and wild food ecosystems gently; the parallel structure builds narrative comprehension; Maine's blueberry landscape is a real ecosystem children can later explore.",
    best_for: 'Ages 2-4, pre-reader. 8 min read-aloud.',
    pairs_with: 'Pairs with the seasons theme and plant-and-food weekly plans.',
    talk_about: ['Have you ever picked food right from a plant?','Why did both mothers lose their children at the same time?','What other wild foods can you find in a forest?'],
    heads_up: null,
  },
  {
    title: 'Owl Moon', author: 'Jane Yolen', illustrator: 'John Schoenherr',
    year_published: 1987, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 32, read_aloud_minutes: 8,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['nature-observation','winter','father-daughter','patience','birds'],
    subjects: ['science','social-emotional'],
    hook: 'A child and her father hike into the snowy woods at night to find an owl — and the silence teaches more than any classroom could.',
    orbital_description: 'Owl Moon is a masterclass in nature observation: types of owls, nocturnal behavior, winter ecology, and the art of stillness. The parent-child relationship models scientific patience. After this one a child will listen differently outdoors.',
    best_for: 'Ages 2-4, pre-reader. 8 min read-aloud.',
    pairs_with: 'Pairs with the night sky, birds, and seasons themes in the weekly plan.',
    talk_about: ['Have you ever had to be very quiet to see something wild?','What does it feel like to walk in the woods at night?','Why do owls come out when it\'s dark?'],
    heads_up: null,
  },
  {
    title: 'Mike Mulligan and His Steam Shovel', author: 'Virginia Lee Burton', illustrator: 'Virginia Lee Burton',
    year_published: 1939, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 48, read_aloud_minutes: 10,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['machines','work','teamwork','engineering','change'],
    subjects: ['science','history'],
    hook: 'Mike and his steam shovel Mary Anne dig the town hall cellar in one day — and find that being useful takes many forms.',
    orbital_description: 'This is an engineering story, a labor history, and a lesson about obsolescence and reinvention. Children encounter excavation, civic architecture, and the economics of technological change while cheering for a steam shovel.',
    best_for: 'Ages 2-4, pre-reader. 10 min read-aloud.',
    pairs_with: 'Pairs with the engineering and machines themes; Atlas landmark geography.',
    talk_about: ['Why did people stop using steam shovels?','How did Mike dig the cellar so fast?','What new machine might replace something we use today?'],
    heads_up: null,
  },
  {
    title: 'The Little House', author: 'Virginia Lee Burton', illustrator: 'Virginia Lee Burton',
    year_published: 1942, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 44, read_aloud_minutes: 10,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['seasons','change','environment','city-vs-country','history'],
    subjects: ['science','social-emotional','history'],
    hook: 'A little house watches the city grow up around her across a century — and finally finds her way back to the countryside.',
    orbital_description: 'Compressed into one picture book: urban growth, seasonal cycles, environmental change, transportation history, and the passage of time across generations. The illustrations map a century of American city-building.',
    best_for: 'Ages 2-4, pre-reader. 10 min read-aloud.',
    pairs_with: 'Pairs with the seasons, geography, and history of American growth themes.',
    talk_about: ['How did the neighborhood around the little house change?','Would you rather live in the city or the country?','Why do cities grow?'],
    heads_up: null,
  },
  {
    title: 'Frederick', author: 'Leo Lionni', illustrator: 'Leo Lionni',
    year_published: 1967, book_format: 'picture-book', orbital_score: 5,
    reading_level: 'pre-reader', page_count: 40, read_aloud_minutes: 8,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['art','seasons','purpose','creativity','community'],
    subjects: ['art','social-emotional','science'],
    hook: 'While his mouse family stores food for winter, Frederick stores colors, words, and sunlight — and saves them all when the cold and dark close in.',
    orbital_description: 'Frederick opens art, seasonal ecology, community roles, and the invisible labor of creative work. The book makes children ask what counts as useful — a question that leads into economics, ecology, and the human need for beauty.',
    best_for: 'Ages 2-4, pre-reader. 8 min read-aloud.',
    pairs_with: 'Pairs with the seasons theme, art weekly plans, and community roles.',
    talk_about: ["Why did Frederick collect words and colors instead of food?","Is a poet's work as important as a farmer's work?",'What would you collect to share with your family?'],
    heads_up: null,
  },
  {
    title: 'Swimmy', author: 'Leo Lionni', illustrator: 'Leo Lionni',
    year_published: 1963, book_format: 'picture-book', orbital_score: 4,
    reading_level: 'pre-reader', page_count: 40, read_aloud_minutes: 7,
    parent_role: 'read-together', age_bands: ['2-4','5-7'],
    themes: ['ocean','community','problem-solving','camouflage','teamwork'],
    subjects: ['science','social-emotional'],
    hook: 'A small black fish leads his red school to swim together in the shape of a giant fish — and teaches camouflage and cooperation in one image.',
    orbital_description: "The book opens ocean ecosystems, animal defense strategies including schooling and camouflage, and problem-solving through collective action. Swimmy's solution is a real biological strategy used by fish.",
    best_for: 'Ages 2-4, pre-reader. 7 min read-aloud.',
    pairs_with: 'Pairs with the ocean, animals, and community weekly themes.',
    talk_about: ['Why do fish swim together in schools?','How did Swimmy\'s idea protect the other fish?','What else in nature works by cooperation?'],
    heads_up: null,
  },
  {
    title: "Charlotte's Web", author: 'E.B. White', illustrator: 'Garth Williams',
    year_published: 1952, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 192, read_aloud_minutes: 25,
    parent_role: 'read-side-by-side', age_bands: ['5-7','8-10'],
    themes: ['friendship','death','farm-life','writing','seasons','spiders'],
    subjects: ['science','language-arts','social-emotional'],
    hook: "A spider writes words in her web to save a pig — and asks children to think about friendship, mortality, and what a life well spent looks like.",
    orbital_description: "Charlotte's Web opens spider biology including web construction and egg sacs, farm ecology, seasonal cycles, and the mechanics of persuasion through written language. The death of Charlotte is the finest introduction to mortality in children's literature.",
    best_for: 'Ages 5-7, independent reader. ~192 pages.',
    pairs_with: 'Pairs with the writing, animals, and seasons weekly themes; Atlas farm regions.',
    talk_about: ['Why do you think Charlotte helped Wilbur?','What does it mean to be a true friend?',"What is 'some pig' — and why did it work?"],
    heads_up: null,
  },
  {
    title: 'Ramona the Pest', author: 'Beverly Cleary', illustrator: 'Louis Darling',
    year_published: 1968, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 192, read_aloud_minutes: 20,
    parent_role: 'read-side-by-side', age_bands: ['5-7'],
    themes: ['school','personality','Oregon','family','humor'],
    subjects: ['social-emotional','language-arts'],
    hook: 'Ramona starts kindergarten and immediately becomes the most complicated child in the class — through no fault of her own.',
    orbital_description: 'Ramona opens school as a social and academic system, the experience of being misunderstood, Portland Oregon as a real place, and the gap between what children intend and what adults observe. Ramona is always right about her intentions.',
    best_for: 'Ages 5-7, independent reader. ~192 pages.',
    pairs_with: 'Pairs with the school, community, and identity weekly themes; Atlas Pacific Northwest.',
    talk_about: ["Why does Ramona keep getting into trouble even when she's not trying to?",'Is Ramona a pest or does she just think differently?',"What do you think Ramona's teacher actually thinks of her?"],
    heads_up: null,
  },
  {
    title: 'Harriet the Spy', author: 'Louise Fitzhugh', illustrator: 'Louise Fitzhugh',
    year_published: 1964, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 300, read_aloud_minutes: 20,
    parent_role: 'read-side-by-side', age_bands: ['5-7','8-10'],
    themes: ['observation','writing','New-York-City','friendship','secrets'],
    subjects: ['language-arts','social-emotional','geography'],
    hook: 'Harriet writes everything she observes about everyone in her notebook — until the notebook is found.',
    orbital_description: "The book opens the ethics of observation and private writing, the social costs of honesty without kindness, New York City's Upper East Side geography, and the question of what separates a scientist from a snoop.",
    best_for: 'Ages 5-7, independent reader. ~300 pages.',
    pairs_with: 'Pairs with the writing, observation, and New York City weekly themes.',
    talk_about: ['Was Harriet wrong to write what she wrote?','What is the difference between observing carefully and invading privacy?','Why is being a spy so different from being a scientist if they both observe things?'],
    heads_up: null,
  },
  {
    title: 'The Phantom Tollbooth', author: 'Norton Juster', illustrator: 'Jules Feiffer',
    year_published: 1961, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 256, read_aloud_minutes: 20,
    parent_role: 'read-side-by-side', age_bands: ['5-7','8-10'],
    themes: ['language','math','wordplay','imagination','learning'],
    subjects: ['language-arts','math'],
    hook: 'A bored boy drives his toy car through a magic tollbooth into a land where words and numbers are at war — and discovers that everything is interesting if you pay attention.',
    orbital_description: 'The book is a sustained argument for curiosity: every pun is a grammar lesson, every math puzzle is a logic problem, every character a concept made literal. Children who read this look at language differently for life.',
    best_for: 'Ages 5-7, independent reader. ~256 pages.',
    pairs_with: 'Pairs with the language arts, math, wordplay, and curiosity weekly themes.',
    talk_about: ['What does the Humbug keep getting wrong and why?','What does it mean that Milo was bored before he found the tollbooth?','Pick a character and explain what concept they represent.'],
    heads_up: null,
  },
  {
    title: 'The Giver', author: 'Lois Lowry', illustrator: null,
    year_published: 1993, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 179, read_aloud_minutes: 20,
    parent_role: 'read-and-discuss', age_bands: ['8-10','10-12'],
    themes: ['memory','conformity','ethics','utopia','choice'],
    subjects: ['social-emotional','language-arts'],
    hook: 'In a community where every pain has been eliminated, one boy learns what has been lost — and what he must do about it.',
    orbital_description: 'The book opens utopian political philosophy, the biology of color perception, the ethics of collective vs. individual choice, and the hidden cost of safety. Every comfort in the novel has a price and the price is named precisely.',
    best_for: 'Ages 8-10, independent reader. ~179 pages.',
    pairs_with: 'Pairs with the ethics, philosophy, and community weekly themes.',
    talk_about: ['Is the community better or worse than ours?','What is the cost of never feeling pain?',"What would you do in Jonas's position?"],
    heads_up: null,
  },
  {
    title: 'Holes', author: 'Louis Sachar', illustrator: null,
    year_published: 1998, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 233, read_aloud_minutes: 18,
    parent_role: 'read-and-discuss', age_bands: ['8-10','10-12'],
    themes: ['justice','Texas-desert','friendship','history','consequences'],
    subjects: ['social-emotional','history','science'],
    hook: 'Stanley Yelnats is sent to a detention camp in the Texas desert where the boys dig holes every day — and the holes have nothing to do with building character.',
    orbital_description: 'Every survival technique and desert detail is accurate; the Texas geography is real; the three timelines braid into a single argument about how historical injustice echoes into the present. The onion is botany and it is also everything.',
    best_for: 'Ages 8-10, independent reader. ~233 pages.',
    pairs_with: 'Pairs with the Texas geography, history, and ecology weekly themes; Atlas Texas desert.',
    talk_about: ['Why are the boys really digging holes?','How are the three time periods connected?','What does the onion have to do with anything?'],
    heads_up: null,
  },
  {
    title: 'Bridge to Terabithia', author: 'Katherine Paterson', illustrator: 'Donna Diamond',
    year_published: 1977, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'independent', page_count: 208, read_aloud_minutes: 18,
    parent_role: 'read-and-discuss', age_bands: ['8-10'],
    themes: ['friendship','grief','imagination','Virginia','death'],
    subjects: ['social-emotional','art'],
    hook: 'Two fifth-graders build an imaginary kingdom in the woods — and then one of them dies.',
    orbital_description: 'The book is the most honest treatment of sudden childhood death in literature: there is no warning, no preparation, and grief arrives incorrectly. The Virginia setting is rural and specific and Terabithia is as real as only a child\'s imagination can make it.',
    best_for: 'Ages 8-10, independent reader. ~208 pages.',
    pairs_with: 'Pairs with the grief, friendship, and creativity weekly themes.',
    talk_about: ['How does Jesse feel about Leslie before she dies?',"Why doesn't grief feel the way Jesse expected it to?",'What does Jesse do at the end and why does it matter?'],
    heads_up: 'A child character dies suddenly — discuss before reading if helpful.',
  },
  {
    title: 'To Kill a Mockingbird', author: 'Harper Lee', illustrator: null,
    year_published: 1960, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'advanced', page_count: 281, read_aloud_minutes: 20,
    parent_role: 'read-and-discuss', age_bands: ['10-12'],
    themes: ['Alabama','justice','childhood','courage','law'],
    subjects: ['history','social-emotional','language-arts'],
    hook: 'Scout Finch watches her father defend a Black man in 1930s Alabama — and learns that courage means doing the right thing when you will almost certainly lose.',
    orbital_description: 'The book opens Jim Crow law and its daily operation, 1930s Southern Alabama geography and economy, the mechanics of a trial, and the question of what justice looks like when the system is designed to produce injustice.',
    best_for: 'Ages 10-12, advanced reader. ~281 pages.',
    pairs_with: 'Pairs with the American history, civil rights, and law weekly themes.',
    talk_about: ['Is Atticus a hero?','Why does Tom Robinson lose even though he\'s innocent?','What does Scout understand at the end that she didn\'t at the beginning?'],
    heads_up: 'Contains racial slurs and racially motivated violence — discuss historical context before reading.',
  },
  {
    title: 'The Hunger Games', author: 'Suzanne Collins', illustrator: null,
    year_published: 2008, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'advanced', page_count: 374, read_aloud_minutes: 20,
    parent_role: 'read-and-discuss', age_bands: ['10-12'],
    themes: ['dystopia','survival','media-critique','courage','revolution'],
    subjects: ['social-emotional','science','language-arts'],
    hook: 'Katniss Everdeen volunteers for a televised death match to save her sister — and the broadcast is the weapon.',
    orbital_description: "The book opens game theory, ecological survival skills including hunting and plant identification, and the use of media as political control. The Districts are mapped to real US geographic resources and the Capitol's logic is internally consistent.",
    best_for: 'Ages 10-12, advanced reader. ~374 pages.',
    pairs_with: 'Pairs with the dystopia, ecology, and media-critique weekly themes.',
    talk_about: ['Why does the Capitol broadcast the Games — what does the broadcast accomplish?',"What is Katniss's actual strategy in the arena?",'What plant and survival knowledge does Katniss use and where did she learn it?'],
    heads_up: null,
  },
  {
    title: 'Fahrenheit 451', author: 'Ray Bradbury', illustrator: null,
    year_published: 1953, book_format: 'chapter-book', orbital_score: 5,
    reading_level: 'advanced', page_count: 256, read_aloud_minutes: 18,
    parent_role: 'read-and-discuss', age_bands: ['10-12'],
    themes: ['censorship','books','fire','conformity','dystopia'],
    subjects: ['language-arts','social-emotional'],
    hook: 'Fireman Montag burns books for a living — until he reads one.',
    orbital_description: 'The book opens the mechanics of censorship, the technology of distraction, and the physics of fire. The fireman-as-book-burner inverts every assumption children have about the profession. The society that produced the censorship is the real subject.',
    best_for: 'Ages 10-12, advanced reader. ~256 pages.',
    pairs_with: 'Pairs with the books, censorship, and dystopia weekly themes.',
    talk_about: ['Why does the government burn books instead of just banning them?','Is Mildred a victim or a collaborator?','What do the book people at the end represent?'],
    heads_up: null,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
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

function olGet(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'WizkooImport/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(12000, () => { req.destroy(); resolve(null); });
  });
}

async function enrich(book) {
  const q = encodeURIComponent(book.title);
  const a = encodeURIComponent(book.author);
  const data = await olGet('https://openlibrary.org/search.json?title=' + q + '&author=' + a + '&limit=1&fields=cover_i,isbn');
  if (!data || !data.docs || !data.docs.length) return {};
  const doc = data.docs[0];
  const isbns = doc.isbn || [];
  const isbn13 = isbns.find(i => String(i).length === 13 && String(i).startsWith('97')) || null;
  const isbn10 = isbn13 ? isbn13toIsbn10(isbn13) : (isbns.find(i => String(i).length === 10) || null);
  const coverId = doc.cover_i || null;
  return {
    isbn: isbn13,
    cover_image_url: coverId ? 'https://covers.openlibrary.org/b/id/' + coverId + '-L.jpg' : null,
    library_link:  isbn13 ? 'https://search.worldcat.org/search?q=' + isbn13 : null,
    purchase_link: isbn13 ? 'https://bookshop.org/books?keywords=' + isbn13 : null,
    amazon_link:   isbn10 ? 'https://www.amazon.com/dp/' + isbn10 : null,
  };
}

/* ── Main ─────────────────────────────────────────────────────────────────── */
async function main() {
  console.log('\n📚 Wizkoo Library — Batch Import (20 books, direct pg)\n');

  const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false }, max: 3 });
  await pool.query('SELECT 1');
  console.log('✓ Database connected\n');

  let imported = 0, skipped = 0;
  const errors = [];

  for (const book of BOOKS) {
    process.stdout.write('  ' + book.title.slice(0, 48).padEnd(50) + ' … ');

    // Enrich
    const e = await enrich(book);
    const slug = toSlug(book.title);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(`
        INSERT INTO library_books (
          slug, title, author, illustrator, year_published, isbn,
          book_format, orbital_score, reading_level, page_count, read_aloud_minutes,
          parent_role, hook, orbital_description, best_for, pairs_with,
          talk_about, heads_up, library_link, purchase_link, cover_image_url,
          amazon_link, status, curated_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
        )
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
        slug, book.title, book.author, book.illustrator || null,
        book.year_published || null, e.isbn || null,
        book.book_format, book.orbital_score, book.reading_level,
        book.page_count || null, book.read_aloud_minutes || null,
        book.parent_role, book.hook, book.orbital_description,
        book.best_for, book.pairs_with,
        book.talk_about && book.talk_about.length ? book.talk_about : null,
        book.heads_up || null,
        e.library_link || null, e.purchase_link || null,
        e.cover_image_url || null, e.amazon_link || null,
        'active', 'beth-holloway',
      ]);

      const bookId = rows[0].id;

      // Delete + re-insert junction rows
      await client.query('DELETE FROM library_age_bands WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_themes    WHERE book_id=$1', [bookId]);
      await client.query('DELETE FROM library_subjects  WHERE book_id=$1', [bookId]);

      for (const ab of book.age_bands)
        await client.query('INSERT INTO library_age_bands (book_id,age_band) VALUES ($1,$2)', [bookId, ab]);
      for (const t of book.themes)
        await client.query('INSERT INTO library_themes (book_id,theme) VALUES ($1,$2)', [bookId, t]);
      for (const s of book.subjects)
        await client.query('INSERT INTO library_subjects (book_id,subject) VALUES ($1,$2)', [bookId, s]);

      await client.query('COMMIT');
      console.log('✓  ' + (e.isbn || 'no ISBN') + '  ' + (e.cover_image_url ? '🖼' : '⚠ no cover'));
      imported++;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.log('✗  ' + err.message.slice(0, 80));
      errors.push(book.title + ': ' + err.message.slice(0, 100));
      skipped++;
    } finally {
      client.release();
    }
  }

  await pool.end();

  console.log('\n' + '═'.repeat(60));
  console.log('✓ Imported: ' + imported);
  console.log('✗ Skipped:  ' + skipped);
  console.log('═'.repeat(60) + '\n');
  if (errors.length) { console.log('Errors:'); errors.forEach(e => console.log('  • ' + e)); }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
