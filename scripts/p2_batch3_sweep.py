import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score4 = [b for b in data if b['current_score'] == 4]

batch = [
  {'idx':40,'v2':4,'decision':'hold-4','doors':3,'door_list':'fantasy world-building and mythology, social-emotional (sibling dynamics and courage), nature stewardship and ecological metaphor','sl':'n/a','rationale':'Three doors: fantasy/mythology, social-emotional, ecological stewardship. 240ch single-band fantasy novel with three substantive cross-domain doors.'},
  {'idx':41,'v2':4,'decision':'hold-4','doors':3,'door_list':'Caribbean cultural music and heritage, music education and rhythm science, social-emotional identity and self-discovery','sl':'n/a','rationale':'Three doors: Caribbean music culture, music education, social-emotional identity. Social-emotional tag confirmed; 367ch at two bands with genuine cultural and musical domain reach.'},
  {'idx':42,'v2':4,'decision':'hold-4','doors':3,'door_list':'chemistry and physics of fireworks (combustion, color emission), history of fireworks and cultural celebration, visual art and color science','sl':'n/a','rationale':'Three doors: chemistry/physics, cultural history, visual art/color science. 244ch at three bands; fireworks history delivers genuine cross-domain science and cultural content.'},
  {'idx':43,'v2':4,'decision':'hold-4','doors':3,'door_list':'music education and sound science, social-emotional community and collaboration, creative arts and environmental repurposing','sl':'n/a','rationale':'Three doors: music/sound science, community social-emotional, creative arts. 317ch at two bands; found-sound concept opens genuine cross-domain reach.'},
  {'idx':44,'v2':4,'decision':'hold-4','doors':4,'door_list':'Dominican American and Latinx cultural identity, hair identity politics and cultural significance, graphic novel form and visual storytelling, social-emotional belonging','sl':'n/a','rationale':'Four doors: cultural identity, hair/identity politics, graphic narrative form, social-emotional. 334ch graphic novel at two bands with four confirmed cross-domain doors.'},
  {'idx':45,'v2':4,'decision':'hold-4','doors':3,'door_list':'plant biology and botany, ecology and pollination science, scientific process and observation methodology','sl':'n/a','rationale':'Three doors: plant biology, ecology/pollination, scientific methodology. Science tag confirmed; 216ch nonfiction with three genuine science doors.'},
  {'idx':46,'v2':4,'decision':'hold-4','doors':4,'door_list':'art history and authentication (Michelangelo sculpture), mystery and detective narrative, New York City geography and urban life, social-emotional independence and resourcefulness','sl':'n/a','rationale':'Four doors: art history, mystery, NYC geography, social-emotional independence. Classic single-band novel; four substantive cross-domain doors confirmed.'},
  {'idx':47,'v2':4,'decision':'hold-4','doors':3,'door_list':'astronomy and solar science, poetry and language arts, ecological observation and natural cycles','sl':'n/a','rationale':'Three doors: solar science, poetry, ecological observation. Science tag confirmed; 319ch nonfiction poetry at two young bands with three confirmed science and literary doors.'},
  {'idx':48,'v2':4,'decision':'hold-4','doors':3,'door_list':'zoo animal biology and species identification, visual narrative literacy and wordless storytelling, narrative sequence and comic structure','sl':'n/a','rationale':'Three doors: animal biology, visual narrative literacy, narrative structure. OD confirms zoo species content alongside storytelling-from-visual-cues; three substantive doors at picture-book density.'},
  {'idx':49,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (emotional validation, right to feel bad), narrative humor','sl':'n/a','rationale':'Two doors: social-emotional, narrative humor. OD confirms single concept (validating negative emotions) with humorous delivery. Does not reach three-door threshold.'},
  {'idx':50,'v2':4,'decision':'hold-4','doors':3,'door_list':'Black hair culture and cultural identity, father-daughter relationship and intergenerational bonds, social-emotional self-acceptance','sl':'n/a','rationale':'Three subject tags confirmed (art, science, social-emotional). 122ch picture book with three confirmed domains: hair as cultural domain, visual art, and social-emotional identity.'},
  {'idx':51,'v2':4,'decision':'hold-4','doors':3,'door_list':'Great Depression history and American history, social-emotional resilience and new beginnings, historical fiction and narrative biography','sl':'n/a','rationale':'Three doors: Depression-era history, social-emotional resilience, historical fiction craft. 359ch at two bands with confirmed historical and social-emotional reach.'},
  {'idx':52,'v2':4,'decision':'hold-4','doors':3,'door_list':'social-emotional (social anxiety and introversion), urban community dynamics and belonging, graphic narrative form and visual storytelling','sl':'n/a','rationale':'Three doors: social-emotional introversion, urban community, graphic narrative. 315ch at two bands; graphic novel form confirmed with three substantive cross-domain doors.'},
  {'idx':53,'v2':4,'decision':'hold-4','doors':3,'door_list':'Southern American history and regional culture, social-emotional (grief, identity, and coming-of-age), literary narrative craft','sl':'n/a','rationale':'Three doors: Southern history/culture, social-emotional, narrative craft. 284ch at two bands with confirmed historical and emotional cross-domain reach.'},
  {'idx':54,'v2':4,'decision':'hold-4','doors':3,'door_list':'book history and publishing process, creative collaboration and literary craft, biography of publisher-author relationship','sl':'n/a','rationale':'Three doors: book history/publishing, creative collaboration, biography. 357ch at two bands; meta-narrative about how Winnie-the-Pooh was made opens three confirmed cross-domain doors.'},
  {'idx':55,'v2':4,'decision':'hold-4','doors':3,'door_list':'construction engineering and architecture, trades and career awareness, social studies and community infrastructure','sl':'n/a','rationale':'Three doors: construction engineering, trades/careers, social studies. Science tag confirmed; 229ch at three bands with three genuine cross-domain doors.'},
  {'idx':56,'v2':4,'decision':'hold-4','doors':3,'door_list':'paleontology and extinction science, safety rules and life skills (satirized), humor and narrative satire','sl':'n/a','rationale':'Three doors: paleontology/earth science, satirized safety/life skills, narrative humor. 310ch at three bands; satirical safety guide format opens genuine science and humor craft domains.'},
  {'idx':57,'v2':4,'decision':'hold-4','doors':3,'door_list':'paleontology and dinosaur biology, social-emotional (bedtime routines and emotional regulation), comparative narrative structure','sl':'n/a','rationale':'Three doors: dinosaur biology, social-emotional, comparative narrative structure. 233ch at two young bands; paleontology facts embedded in the behavioral comparison structure.'},
  {'idx':58,'v2':4,'decision':'hold-4','doors':4,'door_list':'wildlife tracking and biology, scientific field methodology, ecology and habitat, social-emotional curiosity and patient observation','sl':'n/a','rationale':'Four doors confirmed by subject tags (science, social-emotional). 437ch at two young bands; scientific field methodology and wildlife biology confirmed alongside ecological and social-emotional doors.'},
  {'idx':59,'v2':4,'decision':'hold-4','doors':3,'door_list':'bird biology and ornithology, social-emotional independence and growth, narrative satire and humor craft','sl':'n/a','rationale':'Three doors: bird/ornithology biology, social-emotional independence, narrative satire. 284ch at three bands; gosling guide format opens genuine avian science and satire doors.'},
]

with open(OUT_PATH, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for b in batch:
        bk = score4[b['idx']]
        writer.writerow([bk['id'], bk['title'], bk['author'], 4, b['v2'], b['decision'], b['doors'], b['door_list'], b['sl'], b['rationale']])

print(f'P2 Batch 3 appended: {len(batch)} rows')
holds = sum(1 for b in batch if b['decision']=='hold-4')
drops = sum(1 for b in batch if b['decision']=='drop-to-3')
print(f'  hold-4: {holds} | drop-to-3: {drops}')
