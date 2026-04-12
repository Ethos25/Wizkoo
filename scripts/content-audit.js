#!/usr/bin/env node
'use strict';

const fs = require('fs');
const data = JSON.parse(fs.readFileSync(
  'C:/Users/amyog/.claude/projects/C--Users-amyog-Desktop-Wizkoo/a0557c22-3042-4f26-aa89-eef808005560/tool-results/b04ebw3zp.txt',
  'utf8'
));

// ── AUDIT FLAGS ───────────────────────────────────────────────────────────────
// Key = exact title string as stored in DB
// type: REMOVE (banned content) | REVIEW (gray zone)
const AUDIT = {

  // ── REMOVE ──────────────────────────────────────────────────────────────────
  'Speak': {
    type: 'REMOVE',
    reason: 'Sexual assault (rape) is the explicit central subject; DB heads_up confirms this directly. Automatic ban: sexual content/sexual assault.',
  },
  'The Scarlet Letter': {
    type: 'REMOVE',
    reason: 'Adultery and sexual sin are the primary subject matter of the entire text. Automatic ban: sexual content.',
  },
  'The Catcher in the Rye': {
    type: 'REMOVE',
    reason: 'Contains pervasive profanity, explicit reference to hiring a prostitute, sustained alcohol and tobacco use, and depression with suicidal ideation. Multiple automatic bans.',
  },
  'The Chocolate War': {
    type: 'REMOVE',
    reason: 'Contains sexual content (masturbation scenes), profanity throughout, and graphic physical violence. Multiple automatic bans.',
  },
  'Ethan Frome': {
    type: 'REMOVE',
    reason: 'Adultery is the central plot and the climax is a mutual suicide attempt (the sled smashup) by the two lovers. Automatic bans: sexual content + suicide.',
  },
  'My Antonia': {
    type: 'REMOVE',
    reason: 'Mr. Shimerda\'s suicide by self-inflicted gunshot is depicted on-page and is a pivotal narrative event. Automatic ban: suicide.',
  },
  'Red Rising': {
    type: 'REMOVE',
    reason: 'Adult sci-fi with graphic gladiatorial killing throughout and a sexual assault threat against a main character. DB confirms "Violence throughout." Automatic ban: graphic violence + sexual content.',
  },
  'The Devil in the White City': {
    type: 'REMOVE',
    reason: 'Adult nonfiction about a serial killer\'s murders described in graphic detail. DB confirms "Serial murder is a parallel narrative." Automatic ban: graphic violence.',
  },
  'Dune': {
    type: 'REMOVE',
    reason: 'The spice melange — an explicitly addictive mind-altering drug — is the central substance and plot driver throughout; Guild Navigators and Fremen are depicted as addicted. Automatic ban: substance use/drugs.',
  },
  "O Pioneers!": {
    type: 'REMOVE',
    reason: 'Frank shoots and kills Emil and Marie (engaged in an extramarital affair) in a graphic double murder that is the dramatic climax of the novel. Automatic ban: graphic violence; adult sexual themes.',
  },

  // ── REVIEW ──────────────────────────────────────────────────────────────────
  'Adventures of Huckleberry Finn': {
    type: 'REVIEW',
    reason: 'The N-word is used approximately 219 times throughout; pervasive racial slurs are inappropriate for unsupervised use on a children\'s curriculum platform regardless of literary merit.',
  },
  "Ain't Burned All the Bright": {
    type: 'REVIEW',
    reason: 'Centers on police violence against Black people, systemic racial trauma, and heavy emotional distress as sustained themes; ages 10-12.',
  },
  'All the Blues in the Sky': {
    type: 'REVIEW',
    reason: 'Death of a child\'s best friend is the central sustained plot driver. DB heads_up confirms: "Centers on the death of a child\'s best friend; preview before reading."',
  },
  'Amber Brown Is Not a Crayon': {
    type: 'REVIEW',
    reason: 'Parental divorce and its emotional impact on the child protagonist is a sustained central theme throughout the book and series.',
  },
  'Because of Mr. Terupt': {
    type: 'REVIEW',
    reason: 'A teacher suffers a traumatic brain injury from a snowball; child guilt and the teacher\'s survival/recovery dominate the second half of the book.',
  },
  'Bomb': {
    type: 'REVIEW',
    reason: 'Covers the Manhattan Project, the Holocaust, and mass death at Hiroshima in detailed nonfiction for ages 10-12; graphic historical atrocity beyond picture-book level.',
  },
  'Bridge to Terabithia': {
    type: 'REVIEW',
    reason: 'The sudden accidental death of child friend Leslie is the central sustained emotional event; grief and loss dominate the second half of the novel.',
  },
  'Choosing Brave: How Mamie Till-Mobley and Emmett Till Sparked the Civil Rights Movement': {
    type: 'REVIEW',
    reason: 'The torture, murder, and mutilation of 14-year-old Emmett Till is described; requires careful preview for age-appropriateness given the graphic nature of the killing.',
  },
  'Counting by 7s': {
    type: 'REVIEW',
    reason: 'Both adoptive parents die in a car accident early in the book. DB heads_up confirms parental death is "the central emotional engine."',
  },
  'Counting on Grace': {
    type: 'REVIEW',
    reason: 'Child labor in early-1900s textile mills is the central subject; children work dangerous conditions and are deprived of education.',
  },
  'Destiny of the Republic': {
    type: 'REVIEW',
    reason: 'Centers on the assassination and slow death of President Garfield; graphic medical malpractice and the president\'s months-long dying are detailed.',
  },
  'Divergent': {
    type: 'REVIEW',
    reason: 'Graphic dystopian violence throughout including characters murdered during initiation; war violence in the climax. At the outer edge of the platform\'s age range.',
  },
  'Echo': {
    type: 'REVIEW',
    reason: 'Three storylines set in Nazi Germany (Jewish persecution), Japanese American internment, and Depression-era prejudice; dark historical atrocity requires preview for ages 8-10.',
  },
  'Esperanza Rising': {
    type: 'REVIEW',
    reason: 'Father is murdered by bandits in the opening chapters; death of parent is the central plot catalyst; sustained immigration hardship and labor strike violence.',
  },
  'Fahrenheit 451': {
    type: 'REVIEW',
    reason: 'Mildred overdoses on sleeping pills (possible suicide attempt); violence and death are present throughout the dystopian narrative.',
  },
  'Fatty Legs': {
    type: 'REVIEW',
    reason: 'Depicts sustained emotional abuse and deliberate cultural erasure of an Indigenous child in a residential school; abuse as primary subject matter.',
  },
  'Feathers': {
    type: 'REVIEW',
    reason: 'References a stillborn sibling; racial threat of violence against Black children in 1970s South is a sustained central theme.',
  },
  'Freewater': {
    type: 'REVIEW',
    reason: 'Slavery and the violence of enslavement (beatings, family separation, pursuit of escapees) are the central subject; graphic historical atrocity for ages 8-10 requires preview.',
  },
  'Ghost': {
    type: 'REVIEW',
    reason: 'The protagonist witnessed his father shoot at his mother in a domestic violence incident. DB heads_up confirms this is the book\'s backstory and central emotional driver.',
  },
  'Holes': {
    type: 'REVIEW',
    reason: 'A character is attacked with a shovel; a historical murder (Kissin\' Kate Barlow) is depicted; the work-camp-for-juveniles setting involves coercion and physical threat.',
  },
  'Inside Out & Back Again': {
    type: 'REVIEW',
    reason: 'Vietnamese refugee family flees Saigon at the fall; war displacement, cultural trauma, and refugee hardship are sustained central themes for ages 8-10.',
  },
  "Isaac's Storm": {
    type: 'REVIEW',
    reason: 'The 1900 Galveston hurricane killed up to 12,000 people; mass death and graphic destruction are detailed throughout for ages 10-12.',
  },
  'Liesl and Po': {
    type: 'REVIEW',
    reason: 'Death of the protagonist\'s father is the central plot catalyst; the girl is locked in an attic by an abusive stepmother for an extended period.',
  },
  'Little House on the Prairie': {
    type: 'REVIEW',
    reason: 'Contains sustained racist depictions of Native Americans including dehumanizing language that requires careful context-setting before use.',
  },
  "Mama's Nightingale": {
    type: 'REVIEW',
    reason: 'Father\'s immigration detention and family separation are the central emotional driver; the trauma of the immigration detention system is sustained throughout.',
  },
  'March: Book One': {
    type: 'REVIEW',
    reason: 'Graphic depictions of civil rights protesters being beaten by police; violent racial history depicted in graphic novel format for ages 8-10/10-12.',
  },
  'Merci Suarez Changes Gears': {
    type: 'REVIEW',
    reason: 'Grandfather\'s advancing Alzheimer\'s and approaching death are the sustained emotional center of the narrative; heavy illness as primary subject.',
  },
  'My Brother Sam Is Dead': {
    type: 'REVIEW',
    reason: 'Sam is executed by a firing squad by his own side; his death and the family\'s grief are the central sustained emotional weight of the Revolutionary War narrative.',
  },
  'The Name of the Wind': {
    type: 'REVIEW',
    reason: 'Adult epic fantasy with mature romantic content, morally complex violence, and adult themes throughout; not written for or appropriate for a children\'s curriculum platform.',
  },
  'One Crazy Summer: The Graphic Novel': {
    type: 'REVIEW',
    reason: 'The mother abandoned her three daughters; maternal abandonment is the sustained traumatic emotional center of the entire narrative.',
  },
  'Pancho Rabbit and the Coyote': {
    type: 'REVIEW',
    reason: 'The Coyote is a predatory human smuggler who traps and endangers migrants crossing the border; human trafficking-adjacent themes for ages 5-7/8-10.',
  },
  'Pax': {
    type: 'REVIEW',
    reason: 'A boy\'s father forces him to abandon his beloved pet fox before sending him away due to approaching war; war violence and wartime family trauma are central.',
  },
  'Saints of the Household': {
    type: 'REVIEW',
    reason: 'Two brothers witness a physical assault. DB heads_up confirms "Violence is the central event." Physical abuse as primary subject matter.',
  },
  'Seabiscuit: An American Legend': {
    type: 'REVIEW',
    reason: 'Appears to be the full adult Hillenbrand text rather than a young readers edition; contains adult narrative scope, gambling detail, and horse-injury descriptions.',
  },
  'Ship Breaker': {
    type: 'REVIEW',
    reason: 'Graphic survival violence throughout; the villain is a drug lord (the protagonist\'s father); drug trade as background world-building in a dystopia for ages 10-12.',
  },
  'Silenced Voices: Reclaiming Memories from the Guatemalan Genocide': {
    type: 'REVIEW',
    reason: 'Guatemalan genocide is the central subject; survivor testimony and descriptions of atrocity require careful evaluation for age-appropriateness.',
  },
  'Stella by Starlight': {
    type: 'REVIEW',
    reason: 'A KKK cross-burning opens the book; sustained racial terrorism and the threat of violence against Black characters are central themes.',
  },
  'Summer of the Monkeys': {
    type: 'REVIEW',
    reason: 'The boy\'s grandfather provides him alcohol as a folk remedy; depiction of an adult giving alcohol to a child.',
  },
  'The Fighting Ground': {
    type: 'REVIEW',
    reason: 'A 13-year-old boy experiences Revolutionary War combat; he witnesses killing and is traumatized by violence for ages 8-10.',
  },
  'The Giver': {
    type: 'REVIEW',
    reason: 'Society practices euthanasia ("release"); a baby is injected and killed on-page in a pivotal scene; systematic killing of inconvenient people is central to the dystopian world.',
  },
  'The House of the Scorpion': {
    type: 'REVIEW',
    reason: 'Drug lord\'s clone raised for organ harvesting; drug trafficking is the economic backbone of the dystopia. DB heads_up confirms "Organ harvesting."',
  },
  'The House with a Clock in Its Walls': {
    type: 'REVIEW',
    reason: 'A necromancer\'s countdown clock threatens to end all human life; occult and dark magic are the central conflict; may conflict with some families\' religious values.',
  },
  'The Hunger Games': {
    type: 'REVIEW',
    reason: 'Children are forced to murder each other in a televised arena; the deaths of child characters are graphic and sustained throughout the narrative.',
  },
  'The Leaving Room': {
    type: 'REVIEW',
    reason: 'DB confirms the book is set in a realm all young people pass through when they die; death of young people is the explicit central subject matter.',
  },
  'The Maze Runner': {
    type: 'REVIEW',
    reason: 'Characters are killed by mechanical monsters throughout; boys die violently in the maze; the death toll is significant and on-page.',
  },
  'The One and Only Bob': {
    type: 'REVIEW',
    reason: "Bob's backstory involves a dog-fighting ring; animal cruelty (dog fighting) is referenced in the plot as Bob searches for his sister.",
  },
  'The Ox-Bow Incident': {
    type: 'REVIEW',
    reason: 'Three innocent men are lynched by a vigilante mob; graphic injustice and the death of innocent characters are the central moral weight of the novel.',
  },
  'The Pigman': {
    type: 'REVIEW',
    reason: "Two teenagers' reckless and callous behavior contributes to the death of the elderly Pigman; teen culpability for an old man's death is the central moral weight.",
  },
  'The Red Badge of Courage': {
    type: 'REVIEW',
    reason: 'Civil War battle violence and death are depicted graphically; soldiers die on-page and the protagonist struggles with cowardice and psychological trauma.',
  },
  'To Kill a Mockingbird': {
    type: 'REVIEW',
    reason: 'A rape trial is the central plot; racial slurs appear throughout the text; the false rape accusation against a Black man by a white woman is the moral center.',
  },
  'Tuck Everlasting': {
    type: 'REVIEW',
    reason: 'Mae Tuck kills a man (the Man in Yellow Suit) by striking him on the head with a gun barrel; on-page killing is a pivotal plot event.',
  },
  'Tuck Everlasting: The Graphic Novel': {
    type: 'REVIEW',
    reason: 'Same content as the source novel: Mae Tuck\'s killing of the Man in Yellow Suit is depicted in graphic novel format.',
  },
  'Where Only Storms Grow': {
    type: 'REVIEW',
    reason: 'Dust Bowl displacement, extreme poverty, and implied threat of violence in an unstable frontier setting; requires preview for age-appropriateness.',
  },
};

// ── GENERATE CSV ──────────────────────────────────────────────────────────────
function csvEsc(s) {
  const str = (s === null || s === undefined) ? '' : String(s);
  return '"' + str.replace(/"/g, '""') + '"';
}

const rows = [];
for (const book of data) {
  const f = AUDIT[book.title];
  const age_bands = (book.age_bands || []).join(', ');

  if (!f) {
    rows.push([book.id, book.title, book.author, age_bands, 'CLEAN', '', 'Keep']);
  } else {
    const rec = f.type === 'REMOVE' ? 'Remove immediately' : 'Amy review required';
    rows.push([book.id, book.title, book.author, age_bands, f.type, f.reason, rec]);
  }
}

// Sort: REMOVE first, then REVIEW, then CLEAN
const order = { REMOVE: 0, REVIEW: 1, CLEAN: 2 };
rows.sort((a, b) => (order[a[4]] || 2) - (order[b[4]] || 2));

const header = ['id', 'title', 'author', 'age_bands', 'flag_type', 'flag_reason', 'recommendation'];
const csv = [header, ...rows].map(r => r.map(csvEsc).join(',')).join('\n');
fs.writeFileSync('C:/Users/amyog/Desktop/Wizkoo/library-content-audit.csv', csv, 'utf8');

// ── SUMMARY ───────────────────────────────────────────────────────────────────
const removes = rows.filter(r => r[4] === 'REMOVE');
const reviews = rows.filter(r => r[4] === 'REVIEW');
const cleans  = rows.filter(r => r[4] === 'CLEAN');

console.log('════════════════════════════════════════════════════════════');
console.log('  WIZKOO LIBRARY CONTENT SAFETY AUDIT');
console.log('════════════════════════════════════════════════════════════');
console.log('  Total books audited : ' + rows.length);
console.log('  REMOVE flags        : ' + removes.length);
console.log('  REVIEW flags        : ' + reviews.length);
console.log('  CLEAN               : ' + cleans.length);
console.log('════════════════════════════════════════════════════════════\n');
console.log('⛔ REMOVE — BANNED CONTENT CONFIRMED (' + removes.length + ')');
console.log('   These contain automatic-flag content. Recommend removal pending Amy\'s final decision.\n');
removes.forEach(r => {
  console.log('  • ' + r[1] + ' (' + r[2] + ')');
  console.log('    ' + r[5]);
  console.log('');
});
console.log('⚠  REVIEW — GRAY ZONE, AMY DECIDES (' + reviews.length + ')');
const seen = new Set();
reviews.forEach(r => {
  if (!seen.has(r[1])) {
    seen.add(r[1]);
    console.log('  • ' + r[1] + ' — ' + r[5].slice(0, 120) + (r[5].length > 120 ? '...' : ''));
  }
});
console.log('\n✅ Full CSV saved to: C:/Users/amyog/Desktop/Wizkoo/library-content-audit.csv');
