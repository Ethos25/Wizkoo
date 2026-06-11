import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score5 = [b for b in data if b['current_score'] == 5]
print(f'Score-5 books loaded: {len(score5)}')

batch1 = [
  {'idx':0,'v2':5,'decision':'hold-5','doors':5,'door_list':'immigration experience, Vietnamese war history, father-son relationship, cultural identity, grief/memorial','sl':'yes','rationale':'Five integrated doors: immigration, war history, sustenance, cultural identity, grief. Second layer holds: fishing reads as quiet morning with dad at 5-6; at 7-9 the wartime refugee backstory embedded in the fathers silences becomes visible — same scenes, different meaning.'},
  {'idx':1,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'photography/art, surface tension physics, states of matter, real-world science observation','sl':'no','rationale':'Four natural doors: art, physics, chemistry, observation. Second layer fails: visual wonder of water reads the same at every age — more vocabulary, same meaning.'},
  {'idx':2,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'civil rights history, childrens advocacy/policy, biography, civic/legal process','sl':'no','rationale':'Four doors: civil rights, advocacy, biography, civics. Second layer fails: inspiring biography fully decoded once; policy mechanism delivered linearly.'},
  {'idx':3,'v2':4,'decision':'drop-to-4','doors':3,'door_list':'abolitionism history, biography (multiple young subjects), civics/social justice','sl':'n/a','rationale':'Three doors: history, biography, civics. Single age band (10-12), advanced level. Does not reach five-door threshold.'},
  {'idx':4,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'space science, AI/machine consciousness, friendship, grief/loss','sl':'no','rationale':'Four doors: space science, AI ethics, friendship, loss. Second layer fails: consciousness questions addressed explicitly through rovers narration rather than embedded structurally.'},
  {'idx':5,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'deep-sea ecology, research methodology, instrumentation/technology, food web science','sl':'no','rationale':'Four doors: ecology, methodology, technology, systems science. Carbon-cycle implications present but delivered in linear nonfiction sequence.'},
  {'idx':6,'v2':4,'decision':'drop-to-4','doors':3,'door_list':'abolitionism history, African American biography, civics/resistance','sl':'n/a','rationale':'Three doors: history, biography, civics. Single band (10-12), advanced. Does not reach five-door threshold.'},
  {'idx':7,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'comparative scale/math, zoology','sl':'n/a','rationale':'Two doors: scale math and animal science. Concept book at picture-book density — single idea (actual size) is the entire book. Calibrates with Press Here anchor.'},
  {'idx':8,'v2':4,'decision':'drop-to-4','doors':3,'door_list':'Latin American cultural heritage, music/performance, food history','sl':'n/a','rationale':'Three doors: cultural heritage, music, food history. Early-reader format limits concept density; does not reach five-door threshold.'},
  {'idx':9,'v2':3,'decision':'drop-to-3','doors':2,'door_list':'social-emotional frustration/resilience, humor/language play','sl':'n/a','rationale':'Two doors: social-emotional and comic language. Second layer absent: complaints read identically at every age — same gag, same meaning. Beloved but narrow in domain scope.'},
  {'idx':10,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'aviation history, space exploration, materials science, American technological history','sl':'no','rationale':'Four doors: aviation, space, materials science, history. Cloth-from-Kitty-Hawk narrative engaging but delivers meaning once.'},
  {'idx':11,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'epidemiology, social history of poverty, public health policy, Southern US history','sl':'no','rationale':'Four doors: epidemiology, social history, public health, regional history. Single band (10-12). Poverty-disease connection delivered explicitly, not structurally embedded.'},
  {'idx':12,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'epidemiology, American history (1790s Philadelphia), public health response, social behavior under crisis','sl':'no','rationale':'Four doors: epidemiology, history, public health, social dynamics. Classic narrative nonfiction; delivers meaning in linear sequence.'},
  {'idx':13,'v2':5,'decision':'hold-5','doors':5,'door_list':'animal sensory biology, philosophy of perception, evolutionary biology, ecology, consciousness/cognition','sl':'yes','rationale':'Five integrated doors: sensory science, philosophy, evolution, ecology, cognition. Second layer holds: at 7-9 reads as cool animal facts; at 10-12 the umwelt concept reveals that every creature experiences a different reality — a philosophical layer inaccessible to the younger reader.'},
  {'idx':14,'v2':4,'decision':'drop-to-4','doors':3,'door_list':'baseball history, pre-WWII American culture, biography of players','sl':'n/a','rationale':'Three doors: sports history, cultural history, biography. Single band (10-12). Does not reach five-door threshold.'},
  {'idx':15,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'bee biology, mathematical navigation angular encoding, ecology/pollination, science communication','sl':'near-miss','rationale':'Four doors: biology, mathematics, ecology, communication. Second layer genuine (dance reads as communication at 5-6 and as precise mathematical encoding at 7-9) but door count does not reach five required for Score 5.'},
  {'idx':16,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'chemistry/materials science, art history, natural world sources, cultural geography','sl':'no','rationale':'Four doors: chemistry, art history, natural science, geography. Origin-of-pigments concept delivered in discovery sequence without structural second-reading layer.'},
  {'idx':17,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'aviation history, racial history/civil rights, biography multiple subjects, WWII history','sl':'no','rationale':'Four doors: aviation, racial history, biography, WWII. Inspiring biography; racial-barrier content delivered explicitly rather than embedded for re-reading discovery.'},
  {'idx':18,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'American history, science and invention, civic philosophy, publishing/media history','sl':'no','rationale':'Four doors: history, science, civics, media. Scrapbook format delivers breadth; Enlightenment philosophical layer browsable but not structurally embedded.'},
  {'idx':19,'v2':4,'decision':'drop-to-4','doors':4,'door_list':'aerospace engineering, women in STEM history, Cold War history, propellant chemistry','sl':'no','rationale':'Four doors: engineering, gender history, Cold War, chemistry. Early-reader format limits density; biography delivers inspiring narrative linearly.'},
]

with open(OUT_PATH, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['book_id','title','author','current_score','v2_score','decision','door_count','doors_identified','second_layer_pass','rationale'])
    for b in batch1:
        bk = score5[b['idx']]
        writer.writerow([bk['id'], bk['title'], bk['author'], 5, b['v2'], b['decision'], b['doors'], b['door_list'], b['sl'], b['rationale']])

print(f'Batch 1 written: {len(batch1)} rows')
holds = sum(1 for b in batch1 if b['decision']=='hold-5')
drop4 = sum(1 for b in batch1 if b['decision']=='drop-to-4')
drop3 = sum(1 for b in batch1 if b['decision']=='drop-to-3')
print(f'  hold-5: {holds} | drop-to-4: {drop4} | drop-to-3: {drop3}')
