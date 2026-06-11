import csv, json

OUT_PATH = r'C:\Users\amyog\Desktop\Wizkoo\exports\library_orbital_score_sweep_v2.csv'

# Three books with wrong decisions due to batch1 index mismatch:
# Almost Underwear (1c5e53e9) → got drop-to-3 (was Alexander's rationale), should be drop-to-4
# An Immense World (10d01d03) → got drop-to-4 (was An American Plague rationale), should be hold-5
# Baseball's Shining Season (1cd2d48f) → got hold-5 (was An Immense World rationale), should be drop-to-4

corrections = {
    '1c5e53e9-5189-40a1-9de1-8e0a7ccf16a9': {
        'v2_score': '4', 'decision': 'drop-to-4', 'door_count': '4',
        'doors_identified': 'aviation history, space exploration, materials science, American technological history',
        'second_layer_pass': 'no',
        'rationale': 'Four doors: aviation, space, materials science, history. Cloth-from-Kitty-Hawk narrative engaging but delivers meaning once; no structural re-reading layer.'
    },
    '10d01d03-4e42-4423-b475-77160130f560': {
        'v2_score': '5', 'decision': 'hold-5', 'door_count': '5',
        'doors_identified': 'animal sensory biology, philosophy of perception, evolutionary biology, ecology, consciousness/cognition',
        'second_layer_pass': 'yes',
        'rationale': 'Five integrated doors: sensory science, philosophy, evolution, ecology, cognition. Second layer holds: at 7-9 reads as cool animal facts about different senses; at 10-12 the umwelt concept reveals that every creature experiences a different reality — a philosophical layer inaccessible to the younger reader.'
    },
    '1cd2d48f-0fc7-4100-beba-4618e87a6ce4': {
        'v2_score': '4', 'decision': 'drop-to-4', 'door_count': '3',
        'doors_identified': 'baseball history, pre-WWII American culture, biography of players',
        'second_layer_pass': 'n/a',
        'rationale': 'Three doors: sports history, cultural history, biography. Single band (10-12). Does not reach five-door threshold.'
    },
}

rows = []
with open(OUT_PATH, 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = list(reader)

fixed = 0
for i, row in enumerate(rows):
    bid = row[0]
    if bid in corrections:
        c = corrections[bid]
        row[4] = c['v2_score']
        row[5] = c['decision']
        row[6] = c['door_count']
        row[7] = c['doors_identified']
        row[8] = c['second_layer_pass']
        row[9] = c['rationale']
        rows[i] = row
        fixed += 1
        print(f'Fixed: {row[1][:50]} -> {c["decision"]}')

with open(OUT_PATH, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f'\nFixed {fixed} rows. Total rows: {len(rows)}')
