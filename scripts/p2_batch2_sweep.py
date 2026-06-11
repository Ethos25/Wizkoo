import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score4 = [b for b in data if b['current_score'] == 4]

batch = [
  {'idx':20,'v2':4,'decision':'hold-4','doors':3,'door_list':'community and intergenerational service, social-emotional (generosity and belonging), cultural heritage','sl':'n/a','rationale':'Three doors: community service, social-emotional, cultural heritage. 283ch at three bands with confirmed intergenerational and cultural reach beyond simple social-emotional framing.'},
  {'idx':21,'v2':4,'decision':'hold-4','doors':3,'door_list':'linguistics and onomastics (names and their meaning), social-emotional (identity, bullying, belonging), school community dynamics','sl':'n/a','rationale':'Three doors: linguistics/onomastics, social-emotional, school community. Kevin Henkes picture book opens the substantive linguistics of naming alongside social dynamics.'},
  {'idx':22,'v2':4,'decision':'hold-4','doors':4,'door_list':'medieval European history, plague and epidemiology, historical fiction craft, medical and apothecary history','sl':'n/a','rationale':'Four doors: medieval history, epidemiology, historical fiction, medical history. Two-band historical fiction set against plague; four substantive cross-domain doors.'},
  {'idx':23,'v2':4,'decision':'hold-4','doors':4,'door_list':'urban ecology and wildlife biology, field guide and scientific methodology, natural history, urban geography and land use','sl':'n/a','rationale':'Four doors confirmed: urban ecology, scientific methodology, natural history, urban geography. Science tag confirmed; naturalist guide to urban wildlife with four substantive domains.'},
  {'idx':24,'v2':4,'decision':'hold-4','doors':4,'door_list':'espionage and intelligence narrative, international geography, history and current events, social-emotional (found family and teamwork)','sl':'n/a','rationale':'Four doors: espionage narrative, international geography, history/current events, social-emotional. History tag confirmed; adventure novel with four cross-domain doors.'},
  {'idx':25,'v2':4,'decision':'hold-4','doors':3,'door_list':'social-emotional (neurodivergent perspective and impulse), school community and friendship dynamics, narrative and character craft','sl':'n/a','rationale':'Three doors: neurodivergent social-emotional, school community, narrative craft. Classic kids novel with confirmed three-door cross-domain reach.'},
  {'idx':26,'v2':4,'decision':'hold-4','doors':3,'door_list':'marine and coastal ecology, social-emotional curiosity and courage, beach geography and natural science','sl':'n/a','rationale':'Three doors: marine/coastal ecology, social-emotional, geography. Science tag confirmed; beach ecology at two bands with three substantive doors.'},
  {'idx':27,'v2':4,'decision':'hold-4','doors':3,'door_list':'ecology and food chain science, predator-prey dynamics, biodiversity and natural history','sl':'n/a','rationale':'Three doors: ecology/food chains, predator-prey science, biodiversity. Science tag confirmed; food chain narrative with three genuine natural science doors.'},
  {'idx':28,'v2':4,'decision':'hold-4','doors':4,'door_list':'animal behavior and ethology (dawn awakening sequence), light physics and dawn phenomena, forest lake ecology, nature observation science','sl':'n/a','rationale':'Four doors: ethology, light physics, forest ecology, scientific observation. ALSC 2026 Notable; OD confirms physics of light, specific animal behavior sequences, and ecology of dawn as four distinct scientific domains.'},
  {'idx':29,'v2':4,'decision':'hold-4','doors':3,'door_list':'dance arts and performing arts history, biography, African American cultural history','sl':'n/a','rationale':'Three doors: dance arts, biography, Black cultural history. 350ch biography of Debbie Allen at two bands; three substantive cross-domain doors confirmed.'},
  {'idx':30,'v2':4,'decision':'hold-4','doors':3,'door_list':'arachnid biology (webs, molting, silk production), cross-species ecology and relationships, narrative and epistolary form','sl':'n/a','rationale':'Three doors: arachnid biology, cross-species ecology, epistolary form. OD confirms specific biological content (molting, silk); three substantive doors at picture-book density.'},
  {'idx':31,'v2':4,'decision':'hold-4','doors':3,'door_list':'rhetoric and persuasion (escalating negotiation tactics), interactive narrative form (fourth wall), social-emotional (saying no and holding boundaries)','sl':'n/a','rationale':'Three doors: rhetoric/persuasion, fourth-wall narrative, social-emotional. OD confirms genuine persuasion and argumentation content; three doors at picture-book density.'},
  {'idx':32,'v2':4,'decision':'hold-4','doors':3,'door_list':'animal science facts and humor, social-emotional (trust and healthy skepticism), narrative satire and humor craft','sl':'n/a','rationale':'Three doors: animal science, social-emotional skepticism, narrative satire. 292ch at three bands; humorous animal science with genuine cross-domain reach.'},
  {'idx':33,'v2':4,'decision':'hold-4','doors':3,'door_list':'Chinese cultural heritage and botanical history, plant science (dragon flower biology), social-emotional and intergenerational relationships','sl':'n/a','rationale':'Three doors: Chinese cultural history, botanical science, intergenerational social-emotional. 317ch at two bands with cultural heritage and plant science confirmed.'},
  {'idx':34,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'narrative humor and cause-effect logic, social-emotional (sharing and food culture)','sl':'n/a','rationale':'Two doors: narrative humor/cause-effect, social-emotional. OD confirms pure delight engineering at two young bands; the salsa-fire cause-effect is the book at every age. Does not reach three-door threshold.'},
  {'idx':35,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (conflict, assumptions, friendship repair), cognitive development (correcting assumptions)','sl':'n/a','rationale':'Two doors: social-emotional, cognitive development. 188ch at two young bands; single concept about conflict over a shared resource. Does not reach three-door threshold.'},
  {'idx':36,'v2':4,'decision':'hold-4','doors':4,'door_list':'memoir and autobiographical narrative, disability and hearing loss (Deaf identity), social-emotional (belonging and friendship), graphic novel form and visual storytelling','sl':'n/a','rationale':'Four doors: memoir/autobiography, Deaf identity, social-emotional, graphic narrative. Single-band graphic memoir; four substantive cross-domain doors confirmed.'},
  {'idx':37,'v2':4,'decision':'hold-4','doors':3,'door_list':'fantasy and magical realism, social-emotional (grief, friendship, acceptance), literary narrative craft','sl':'n/a','rationale':'Three doors: fantasy/magical realism, social-emotional, literary craft. 325ch at two bands; fantasy novel with confirmed cross-domain reach.'},
  {'idx':38,'v2':4,'decision':'hold-4','doors':3,'door_list':'literary intertextuality and library science, mystery and puzzle-solving, game theory and logical reasoning','sl':'n/a','rationale':'Three doors: literary intertextuality, mystery/puzzle, game theory. Language-arts tag confirmed; escape-room-style mystery anchored in book history with three confirmed cross-domain doors.'},
  {'idx':39,'v2':4,'decision':'hold-4','doors':4,'door_list':'natural science observation and curiosity, language arts and poetry, social-emotional (wonder and agency), world geography and exploration','sl':'n/a','rationale':'Four doors confirmed by subject tags (language-arts, science, social-emotional) plus geography. 416ch at two young bands with four substantive cross-domain doors.'},
]

with open(OUT_PATH, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for b in batch:
        bk = score4[b['idx']]
        writer.writerow([bk['id'], bk['title'], bk['author'], 4, b['v2'], b['decision'], b['doors'], b['door_list'], b['sl'], b['rationale']])

print(f'P2 Batch 2 appended: {len(batch)} rows')
holds = sum(1 for b in batch if b['decision']=='hold-4')
drops = sum(1 for b in batch if b['decision']=='drop-to-3')
print(f'  hold-4: {holds} | drop-to-3: {drops}')
