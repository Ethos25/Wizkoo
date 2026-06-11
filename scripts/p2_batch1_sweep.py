import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score4 = [b for b in data if b['current_score'] == 4]

batch = [
  {'idx':0,'v2':4,'decision':'hold-4','doors':3,'door_list':'immigration and migration experience, global geography, social-emotional (hope and displacement)','sl':'n/a','rationale':'Three doors: migration history, geography, social-emotional. Delivers the migration journey at picture-book density with genuine cross-domain reach.'},
  {'idx':1,'v2':4,'decision':'hold-4','doors':4,'door_list':'biography, visual art and illustration, resilience and social-emotional, cultural history','sl':'n/a','rationale':'Four doors: biography, visual art, social-emotional resilience, cultural history. Multi-domain nonfiction biography with substantive cross-domain reach across two bands.'},
  {'idx':2,'v2':4,'decision':'hold-4','doors':4,'door_list':'civil rights history, legal history (court case), Mexican American cultural history, corrido as musical-literary form','sl':'n/a','rationale':'Four doors: civil rights, legal history, Mexican American cultural history, corrido form. The Roberto Alvarez desegregation case opens legal and cultural history simultaneously.'},
  {'idx':3,'v2':4,'decision':'hold-4','doors':3,'door_list':'plant biology and botany, ecology and pollination, natural cycles','sl':'n/a','rationale':'Three doors: plant biology, ecology, natural cycles. Science nonfiction spanning three bands; seed-to-plant process opens genuine cross-domain science reach.'},
  {'idx':4,'v2':4,'decision':'hold-4','doors':3,'door_list':'Aztec history and civilization, bilingual language arts (Spanish-English), indigenous cultural heritage','sl':'n/a','rationale':'Three doors: Aztec history, bilingual language arts, indigenous cultural heritage. Alphabet structure carries substantive civilization content with genuine dual-language engagement.'},
  {'idx':5,'v2':4,'decision':'hold-4','doors':3,'door_list':'ecology and ecological recovery, water science and earth science, nature observation methodology','sl':'n/a','rationale':'Three doors: ecology, earth science, scientific observation. Science tag confirmed; post-rain ecological recovery opens three substantive natural science domains.'},
  {'idx':6,'v2':4,'decision':'hold-4','doors':3,'door_list':'Korean American cultural identity and immigration, K-pop music and Korean popular culture, graphic novel form and visual storytelling','sl':'n/a','rationale':'Three doors: cultural identity/immigration, K-pop cultural domain, graphic narrative form. Graphic memoir with genuine cross-domain reach into Korean cultural life.'},
  {'idx':7,'v2':4,'decision':'hold-4','doors':3,'door_list':'fantasy world-building and mythology, social-emotional (identity and belonging), mystery and detective narrative structure','sl':'n/a','rationale':'Three doors: fantasy/mythology, social-emotional identity, mystery structure. Fantasy novel with confirmed social-emotional tag and cross-domain narrative architecture.'},
  {'idx':8,'v2':4,'decision':'hold-4','doors':3,'door_list':'social-emotional (sudden life change and resilience), memoir and narrative craft, family dynamics and intergenerational relationships','sl':'n/a','rationale':'Three doors: social-emotional, memoir craft, family dynamics. Two-band memoir-adjacent narrative with substantive cross-domain personal and relational reach.'},
  {'idx':9,'v2':4,'decision':'hold-4','doors':3,'door_list':'urban social geography and apartment community, observation and visual literacy, social-emotional (friendship, loss, reorientation)','sl':'n/a','rationale':'Three doors: urban geography, observation/visual literacy, social-emotional. ALSC 2026 Notable; OD confirms social geography of urban living alongside emotional sequence.'},
  {'idx':10,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'visual art and creative transformation, social-emotional (growth mindset and reframing mistakes)','sl':'n/a','rationale':'Two doors: visual art, social-emotional growth mindset. Interactive pop-up concept book; the mistake-as-material thesis is the book at every age. Does not reach three-door threshold.'},
  {'idx':11,'v2':4,'decision':'hold-4','doors':3,'door_list':'color science and chemistry (pigments and dyes), art history and color in art, cultural history of color across civilizations','sl':'n/a','rationale':'Three doors: color science, art history, cultural history. 376ch delivers pigment science and the cultural significance of color with genuine cross-domain reach.'},
  {'idx':12,'v2':4,'decision':'hold-4','doors':3,'door_list':'mystery and detective narrative, social-emotional (identity and courage), community geography and urban setting','sl':'n/a','rationale':'Three doors: mystery, social-emotional, community geography. Two-band mystery with confirmed social-emotional tag; cross-domain narrative reach across setting, character, and plot.'},
  {'idx':13,'v2':4,'decision':'hold-4','doors':3,'door_list':'literary intertextuality and library science, mystery and puzzle-solving narrative, game theory and logical reasoning','sl':'n/a','rationale':'Three doors: literary intertextuality, mystery/puzzle, game theory. Library-set mystery with genuine cross-domain reach into book history and logical reasoning.'},
  {'idx':14,'v2':4,'decision':'hold-4','doors':4,'door_list':'aviation history (Powder Puff Derby), women\'s history and gender barriers in aviation, American geography, biography (multiple subjects)','sl':'n/a','rationale':'Four doors: aviation history, women\'s history, American geography, biography. Single-band nonfiction about the first women\'s transcontinental air race; multi-domain historical reach.'},
  {'idx':15,'v2':4,'decision':'hold-4','doors':3,'door_list':'materials history (rubber and ball technology), global trade and economic history, cultural history of play across civilizations','sl':'n/a','rationale':'Three doors: materials science/history, global trade, cultural history. World-changing history of the bouncing ball opens materials science and global commerce.'},
  {'idx':16,'v2':4,'decision':'hold-4','doors':3,'door_list':'baseball history and Puerto Rican baseball tradition, Puerto Rican cultural history, biography','sl':'n/a','rationale':'Three doors: baseball/sports history, Puerto Rican cultural heritage, biography. Early reader biography of Clemente at two bands; three substantive doors confirmed.'},
  {'idx':17,'v2':4,'decision':'hold-4','doors':4,'door_list':'science process and scientific methodology, mathematics, STEM identity and gender (girls in science), social-emotional curiosity','sl':'n/a','rationale':'Four doors confirmed by subject tags (language-arts, math, science) plus STEM/gender. 550ch picture book at two bands with four substantive cross-domain doors.'},
  {'idx':18,'v2':4,'decision':'hold-4','doors':4,'door_list':'biography, space science and astronaut training, professional athletics (NFL career), social-emotional (grit, grace, perseverance)','sl':'n/a','rationale':'Four doors: biography, space science, professional sports, social-emotional. Leland Melvin memoir opens four distinct substantive domains with genuine cross-domain reach.'},
  {'idx':19,'v2':4,'decision':'hold-4','doors':3,'door_list':'art history (Vermeer and Dutch Golden Age), mystery and detective narrative, mathematical pattern and coincidence','sl':'n/a','rationale':'Three doors: art history, mystery/detective, mathematical pattern. Single-band mystery anchored in Vermeer scholarship; three substantive cross-domain doors confirmed.'},
]

with open(OUT_PATH, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for b in batch:
        bk = score4[b['idx']]
        writer.writerow([bk['id'], bk['title'], bk['author'], 4, b['v2'], b['decision'], b['doors'], b['door_list'], b['sl'], b['rationale']])

print(f'P2 Batch 1 appended: {len(batch)} rows')
holds = sum(1 for b in batch if b['decision']=='hold-4')
drops = sum(1 for b in batch if b['decision']=='drop-to-3')
print(f'  hold-4: {holds} | drop-to-3: {drops}')
