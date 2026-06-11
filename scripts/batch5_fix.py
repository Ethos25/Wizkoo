import csv, json

SWEEP_JSON = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

with open(SWEEP_JSON, encoding='utf-8') as f:
    data = json.load(f)

score5 = [b for b in data if b['current_score'] == 5]

# Read current CSV, find and fix the 5 misaligned rows (indices 95-99)
# Also add missing Temple Grandin (idx 99)
# The 5 affected book IDs:
affected_ids = {
    score5[95]['id'],  # Still Life
    score5[96]['id'],  # Sulwe
    score5[97]['id'],  # Swirl by Swirl
    score5[98]['id'],  # Teaching for Change
}

correct_data = {
    score5[95]['id']: {'v2':4,'decision':'drop-to-4','doors':3,
        'door_list':'visual art and illustration, social-emotional (loss and memory), narrative/wordless storytelling',
        'sl':'n/a',
        'rationale':'Three doors at picture-book density: visual art, social-emotional, narrative. No subject tags confirmed. Conservative hold at 4 pending subject confirmation; does not reach five-door threshold on available evidence.'},
    score5[96]['id']: {'v2':4,'decision':'drop-to-4','doors':4,
        'door_list':'colorism and social-emotional identity, astronomy/night sky (extended metaphor), African heritage, visual art/illustration',
        'sl':'no',
        'rationale':'Four doors: colorism, astronomy, cultural heritage, visual art. Second layer fails: the night-and-day origin story is woven into the surface narrative as the plot resolution — both the metaphor and the self-acceptance lesson are accessible simultaneously to all readers, not discovered at older re-reading.'},
    score5[97]['id']: {'v2':3,'decision':'drop-to-3','doors':3,
        'door_list':'mathematics (spirals and Fibonacci), natural science, visual art',
        'sl':'n/a',
        'rationale':'Three doors at picture-book density: math, natural science, visual art. OD only 67ch. Single concept (spirals in nature) executed with craft — calibrates with the Press Here anchor for concept books where the concept is the book.'},
    score5[98]['id']: {'v2':4,'decision':'drop-to-4','doors':5,
        'door_list':'civil rights history, education as civil rights tool (citizenship schools), biography, citizenship and voting rights, African American history',
        'sl':'no',
        'rationale':'Five doors: civil rights, education, biography, voting rights, African American history. Early-reader format limits concept depth; biography of Septima Clark delivered in linear sequence at early-reader density.'},
}
temple_grandin = {'v2':4,'decision':'drop-to-4','doors':5,
    'door_list':'autism and neurodivergence, animal science and behavior, agricultural engineering, biography, social-emotional wisdom',
    'sl':'no',
    'rationale':'Five subjects confirmed. OD only 82ch for an independent-level book — extremely thin. Single band (10-12). Inspiring biography with multi-domain reach delivered too thinly to embed a structural second layer.'}

# Read existing CSV and rewrite with corrections
rows = []
with open(OUT_PATH, 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        rows.append(row)

print(f'Total rows before fix: {len(rows)}')

# Fix affected rows
fixed = 0
for i, row in enumerate(rows):
    bid = row[0]
    if bid in correct_data:
        c = correct_data[bid]
        bk = next(b for b in score5 if b['id'] == bid)
        rows[i] = [bk['id'], bk['title'], bk['author'], 5, c['v2'], c['decision'], c['doors'], c['door_list'], c['sl'], c['rationale']]
        fixed += 1

print(f'Fixed {fixed} rows')

# Add missing Temple Grandin
bk = score5[99]
rows.append([bk['id'], bk['title'], bk['author'], 5, temple_grandin['v2'], temple_grandin['decision'], temple_grandin['doors'], temple_grandin['door_list'], temple_grandin['sl'], temple_grandin['rationale']])
print(f'Added Temple Grandin')

# Write corrected CSV
with open(OUT_PATH, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f'Total rows after fix: {len(rows)}')
