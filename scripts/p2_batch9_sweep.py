import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score4 = [b for b in data if b['current_score'] == 4]

batch = [
  {'idx':160,'v2':4,'decision':'hold-4','doors':3,'door_list':'market economics and commerce, language arts and rhyme (cumulative repetition), cultural geography and community life','sl':'n/a','rationale':'Three doors confirmed by subject tags (geography, language-arts, math). 541ch at two young bands with three confirmed cross-domain doors in economics, language arts, and cultural geography.'},
  {'idx':161,'v2':4,'decision':'hold-4','doors':3,'door_list':'ornithology and owl biology, scientific field methodology and patience, ecology and nocturnal habitat','sl':'n/a','rationale':'Three doors: owl biology, scientific field methodology, nocturnal ecology. 329ch at two bands with three confirmed cross-domain science doors.'},
  {'idx':162,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (sensory overwhelm and overstimulation), social coping strategies','sl':'n/a','rationale':'Two doors: social-emotional (sensory overwhelm), social coping. Social-emotional tag confirmed; single concept at two young bands. Does not reach three-door threshold.'},
  {'idx':163,'v2':4,'decision':'hold-4','doors':4,'door_list':'oceanography and ocean current science, marine pollution and conservation, scientific tracking methodology (ocean debris tracking), environmental science','sl':'n/a','rationale':'Four doors: oceanography, marine pollution/conservation, scientific methodology, environmental science. Science tag confirmed; 351ch single-band nonfiction with four confirmed cross-domain doors.'},
  {'idx':164,'v2':4,'decision':'hold-4','doors':4,'door_list':'African American folklore and mythology, West African Anansi trickster tradition, social-emotional (grief, legacy, and ancestral connection), heroic adventure narrative','sl':'n/a','rationale':'Four doors: African American folklore, West African mythology, social-emotional, adventure narrative. History tag confirmed; 266ch single-band novel with four confirmed cross-domain doors.'},
  {'idx':165,'v2':4,'decision':'hold-4','doors':3,'door_list':'animal biology and comparative sleep science, ecology and habitat diversity, narrative structure (cumulative bedtime format)','sl':'n/a','rationale':'Three doors: animal biology/sleep science, ecology, narrative structure. Science tag confirmed; 351ch at two young bands with confirmed animal science and ecological cross-domain reach.'},
  {'idx':166,'v2':4,'decision':'hold-4','doors':3,'door_list':'social-emotional (equanimity and emotional regulation), character development and growth narrative, humor and comedic craft','sl':'n/a','rationale':'Three doors: social-emotional equanimity, character growth, comedic narrative. 283ch at three bands with confirmed cross-domain reach beyond single social-emotional concept.'},
  {'idx':167,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (anxiety, school transitions, and shared worry), social problem-solving','sl':'n/a','rationale':'Two doors: social-emotional (anxiety/transitions), social problem-solving. 213ch; single concept about normalizing anxiety. Does not reach three-door threshold.'},
  {'idx':168,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (opportunity cost, courage, and seizing chances), economics concept (opportunity cost)','sl':'n/a','rationale':'Two doors: social-emotional courage, opportunity cost concept. 192ch; single concept about taking chances. Does not reach three-door threshold.'},
  {'idx':169,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional (creative courage and pursuing ideas), visual art and color metaphor (sepia to color)','sl':'n/a','rationale':'Two doors: social-emotional creative courage, visual art. 101ch; single concept (nurture your ideas) with visual art metaphor. Does not reach three-door threshold.'},
  {'idx':170,'v2':4,'decision':'hold-4','doors':3,'door_list':'American frontier and colonial history, social-emotional (courage, belonging, and identity), survival and adventure narrative','sl':'n/a','rationale':'Three doors: frontier/colonial history, social-emotional, survival narrative. 324ch at two bands with confirmed historical and social-emotional cross-domain reach.'},
  {'idx':171,'v2':4,'decision':'hold-4','doors':3,'door_list':'Australian wildlife biology and wombat ecology, science of unusual evolutionary adaptations, humor and narrative satire','sl':'n/a','rationale':'Three doors: wildlife biology/ecology, evolutionary adaptation science, narrative satire. Science tag confirmed; 271ch at two bands with confirmed wombat biology and evolutionary content.'},
  {'idx':172,'v2':4,'decision':'hold-4','doors':4,'door_list':'women\'s history across scientific disciplines, biography (50 subjects across fields), history of scientific discovery and methodology, gender equity in STEM','sl':'n/a','rationale':'Four doors: women\'s history, biography (50 pioneers), scientific history, gender equity. 315ch single-band reference-style nonfiction with four confirmed substantive cross-domain doors.'},
  {'idx':173,'v2':4,'decision':'hold-4','doors':3,'door_list':'Aztec and Mexican cultural mythology, Xoloitzcuintli breed history and biology, oral narrative and mythological storytelling','sl':'n/a','rationale':'Three doors: Aztec cultural mythology, Xolo breed history/biology, mythological narrative. History tag confirmed; 277ch at two bands with confirmed cultural mythology and animal history cross-domain reach.'},
]

with open(OUT_PATH, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    for b in batch:
        bk = score4[b['idx']]
        writer.writerow([bk['id'], bk['title'], bk['author'], 4, b['v2'], b['decision'], b['doors'], b['door_list'], b['sl'], b['rationale']])

print(f'P2 Batch 9 appended: {len(batch)} rows')
holds = sum(1 for b in batch if b['decision']=='hold-4')
drops = sum(1 for b in batch if b['decision']=='drop-to-3')
print(f'  hold-4: {holds} | drop-to-3: {drops}')
