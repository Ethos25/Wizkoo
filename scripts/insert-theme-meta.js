'use strict';
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const rows = [
  ['ocean','Ocean & Marine Life','What lives at the bottom of the ocean that nobody has ever seen?','If you could breathe underwater for one day, where would you go first?','If the ocean could send every person on Earth one message, what do you think it would say?','If you could be any ocean creature for a day, which one would you pick and why?'],
  ['space','Space & Astronomy','If you could bring one thing from Earth to show someone on another planet, what would you pick?','If you were the first person to land on a brand-new planet, what would you name it?','What do you think it would feel like to look back at Earth from space?','If you could ask one question to a star and it would answer, what would you ask?'],
  ['animals','Animals','If animals held a meeting to talk about humans, what do you think they would say?','Which animal do you think has the most interesting life, and what makes it interesting?','If you woke up tomorrow as any animal, which one would you pick and what would you do first?','What animal do you think is secretly the cleverest, and why?'],
  ['insects','Insects & Bugs','If you could shrink down to the size of an ant for one day, where would you go first?','What do you think bugs talk about when no one is watching?','If a bee could explain its whole day to you, what do you think it would say?','Which insect do you think has the hardest job, and why?'],
  ['plants','Plants & Botany','If plants could feel things, what do you think a seed feels the moment it starts to grow?','What do you think a plant would ask for if it could ask you for anything?','If you could grow any plant anywhere in the world, what would you grow and where?','What do you think flowers are doing when nobody is looking at them?'],
  ['trees-forests','Trees & Forests','If a tree could remember everything it had ever seen, what story do you think it would tell?','What do you think the forest floor feels like to something small living in it?','If you could live in any kind of forest in the world, what would it look like?','What do you think trees do at night when no one is around?'],
  ['weather','Weather & Water Cycle','If you could control the weather for one day, what would you make happen?','Where do you think a raindrop has been before it falls on your head?','If a storm could think, what do you think it would be feeling?','What is the most interesting kind of weather you can imagine that does not exist yet?'],
  ['human-body','Human Body','What is the weirdest thing your body does without you telling it to?','If your bones could talk, what do you think they would complain about?','Which part of your body do you think works the hardest, and does it ever get tired?','If you could see inside your own body for one minute, what would you most want to look at?'],
  ['earth-science','Earth Science & Geology','If you could visit one volcano anywhere in the world, which one would you pick and why?','If you could dig straight down through the Earth, what do you think you would find?','What do you think a rock remembers from millions of years ago?','What would it feel like to stand on the Earth right when it was being made?'],
  ['ecosystems','Ecosystems & Habitats','If every living thing in your backyard disappeared for one day, what do you think would happen?','What do you think would happen if one animal suddenly vanished from the whole world?','If you could design a whole new ecosystem from scratch, what would live in it?','Which creature do you think does the most important job in a forest, and why?'],
  ['birds','Birds & Migration','If you could follow one bird on its entire migration journey, where do you think it would take you?','What do you think birds talk about when they sit together on a wire?','If you could fly like a bird for one day, what would be the first thing you would do?','What do you think a bird feels when it finally lands after flying for days without stopping?'],
  ['environment','Environment & Conservation','If the Earth could send every person one message right now, what do you think it would say?','If you could fix one thing about how humans take care of the planet, what would it be?','What do you think the world would look like in 100 years if everyone decided to take care of it?','If animals could vote on one law for humans to follow, what do you think they would pick?'],
  ['polar-regions','Polar Regions','If you could spend a week at the North or South Pole, which would you pick and what do you think would surprise you most?','What do you think it would feel like to stand somewhere where the sun never sets?','If a polar bear could give you advice about surviving in the cold, what do you think it would say?','What would you miss most if you lived somewhere frozen all year?'],
  ['math','Math & Numbers','If numbers had feelings, which number do you think would be the loneliest and why?','Where do you think you would find math if you looked really carefully at a spiderweb?','If you discovered a number nobody had ever found before, what would you name it?','What do you think math would look like if you could see it floating in the air around you?'],
  ['engineering','Engineering & Building','If you could build anything in the world and it would definitely work, what would you build?','What everyday problem do you think nobody has fixed yet, and how would you fix it?','If you had to build a house for a very unusual animal, what would it need?','What is the most impressive thing humans have ever built, and why does it impress you?'],
  ['physics','Physics & Forces','If gravity stopped working for exactly one minute, what would you do with that minute?','If you could slow down time to watch one thing happen, what would you choose?','What do you think light feels like when it is traveling really fast?','What would a world with no sound feel like, and what would you miss first?'],
  ['geography','Geography & Maps','If you could add one brand-new place to the map of the world, what would it be and what would be there?','Which place on Earth do you most want to visit someday, and what one thing are you most curious about?','If you drew a map of your neighborhood the way you really see it, what would it show that no regular map would?','If you could be a mapmaker drawing places no one has ever seen, what would you draw?'],
  ['american-history','American History','If you could spend one day with any person from American history, who would you pick and what would you ask them?','What moment in American history do you wish you could have seen with your own eyes?','What do you think kids your age were doing and thinking about 100 years ago?','If you could change one thing about how American history happened, what would it be?'],
  ['ancient-civilizations','Ancient Civilizations','If you could visit any ancient civilization at its peak, which would you choose and what is the first thing you would want to see?','What do you think ancient people were curious about that we still wonder about today?','If someone from ancient times could visit the world right now, what do you think would shock them most?','What invention from the ancient world do you think changed everything, and why?'],
  ['immigration','Immigration & Belonging','If your whole family had to move to a brand-new country tomorrow, what one thing would you bring with you?','What do you think it feels like to arrive somewhere new where you do not know anyone?','If you could keep one thing from where you come from and carry it everywhere you went, what would it be?','What do you think is the hardest part of starting somewhere new, and what might make it easier?'],
  ['art','Art & Creativity','If you could make a giant mural that every person in the world would see, what would you paint?','What do you think an artist feels the moment they decide a piece is finished?','If colors had sounds, what would your favorite color sound like?','If you could make art out of anything in nature, what materials would you use and what would you make?'],
  ['music','Music & Sound','If you could invent a brand-new instrument that has never existed, what would it look like and what would it sound like?','What song do you think the ocean would sing if it could make music?','If every person on Earth played one note at exactly the same moment, what do you think it would sound like?','What is the most interesting sound you have heard this week, and what do you think made it?'],
  ['storytelling','Storytelling & Books','If a book could write itself about your life right now, what do you think the title would be?','What story do you think has never been written yet but really should be?','If you could step inside any book and live there for a week, which one would you pick?','If your pet could tell you a story, what do you think it would be about?'],
  ['food-agriculture','Food & Agriculture','If you could only eat food you grew yourself, what do you think you would plant first?','Where do you think your favorite food was before it got to your plate?','If you had to invent a brand-new food that no one had ever tasted, what would it be made of?','What do you think farmers think about while they are working?'],
  ['water','Water & Rivers','If you followed a single drop of water from a cloud all the way to the ocean, where do you think it would go?','What do you think a river feels when it finally reaches the sea?','If you could only have one cup of clean water for a whole day, how would you use it?','What do you think is the most important thing water does that we never notice?'],
  ['identity','Identity & Self','If you could describe yourself using only three things that are not your name or what you look like, what would you say?','What is one thing about you that most people do not know, and do you wish they did?','If someone who had never met you had to draw a picture of who you are, what would you want them to include?','What do you think you will be most proud of when you grow up?'],
  ['community','Community & Belonging','If you could change one thing about your neighborhood to make it better for everyone, what would you change?','If every person in your community did one small kind thing on the same day, what do you think would happen?','Who in your life makes you feel like you really belong, and what do they do that makes you feel that way?','What does it feel like to be part of something bigger than yourself?'],
  ['family','Family','What is one story from before you were born that you wish you could have been there to see?','If your family had a theme song, what would it sound like?','What is something your grandparents knew how to do that you wish you could learn?','If your family could have one superpower that only works when you are all together, what would it be?'],
  ['kindness','Kindness & Empathy','What is the smallest kind thing someone has ever done for you that you still remember?','If kindness made a sound every time it happened, what do you think the world would sound like?','When was the last time you did something kind and did not tell anyone about it?','If you could feel exactly what another person is feeling for one minute, who would you choose and why?'],
  ['resilience','Resilience & Persistence','What is something you thought you would never be able to do that you can do now?','What do you do when something feels impossible but you are not ready to quit?','Who is the most persistent person you know, and what do you think keeps them going?','What is the difference between giving up and knowing when to stop?'],
  ['social-justice','Social Justice & Rights','If you could make one rule that every person in the world had to follow, what would it be?','What does fairness look like to you, and do you think the world always has it?','If you could fix one unfair thing in the world right now, what would you fix first?','Who do you think is doing the most important work in the world right now, and why?'],
  ['innovation','Innovation & Invention','What problem in your daily life do you wish someone would invent a solution for?','If you could invent something that would help every family in the world, what would it do?','What do you think the most useful invention of the next 100 years will be?','What is something everyone thinks is impossible that you think someone will figure out someday?'],
  ['cultural-traditions','Culture & Traditions','What is one tradition in your family that you hope you carry with you your whole life?','If you could borrow one tradition from another culture and bring it into your family, what would it be?','What do you think the world would be like if every culture had the exact same traditions?','What is one thing your family does that you would want to explain to someone from the other side of the world?'],
  ['emotions','Emotions & Regulation','If you could see emotions floating around a room like weather, what would a room full of happiness look like?','What do you do when you are feeling something really big and you are not sure what to call it?','If feelings had colors, which emotion would be the most colorful and which would be the plainest?','What is the hardest feeling to explain to someone who has never felt it?'],
  ['science-process','The Science of Science','If you could design any experiment in the world to answer any question, what would you want to find out?','What is something you wonder about all the time that you wish a scientist would figure out?','What do you think scientists do when their experiment gives them an answer they were not expecting?','If you could ask any question and know someone would definitely find the answer, what would you ask?'],
];

async function main() {
  const client = await pool.connect();
  try {
    // Add theme_label column if not already present
    await client.query('ALTER TABLE library_theme_meta ADD COLUMN IF NOT EXISTS theme_label TEXT');

    let inserted = 0, updated = 0;

    for (const [slug, label, q0, q1, q2, q3] of rows) {
      const res = await client.query(
        `INSERT INTO library_theme_meta
           (theme, theme_label, at_the_table, at_the_table_alt_1, at_the_table_alt_2, at_the_table_alt_3)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (theme) DO UPDATE SET
           theme_label        = EXCLUDED.theme_label,
           at_the_table       = EXCLUDED.at_the_table,
           at_the_table_alt_1 = EXCLUDED.at_the_table_alt_1,
           at_the_table_alt_2 = EXCLUDED.at_the_table_alt_2,
           at_the_table_alt_3 = EXCLUDED.at_the_table_alt_3,
           updated_at         = now()
         RETURNING (xmax = 0) AS is_insert`,
        [slug, label, q0, q1, q2, q3]
      );
      res.rows[0].is_insert ? inserted++ : updated++;
    }

    const { rows: ct } = await client.query('SELECT COUNT(*) FROM library_theme_meta');
    console.log(`✓ Inserted: ${inserted}`);
    console.log(`✓ Updated:  ${updated}`);
    console.log(`✓ Total rows in library_theme_meta: ${ct[0].count}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
