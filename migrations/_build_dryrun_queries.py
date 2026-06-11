import csv, json

# Load current CSV (458 rows)
remove_ids = []
retire_ids = []
retag_rows = []  # list of {id, new_bands, heads_up}
all_ids = []

with open('migrations/library_phase6_p1_retag_audit.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        bid = row['id'].strip()
        dec = row['decision'].strip()
        all_ids.append(bid)
        if dec == 'remove-from-database':
            remove_ids.append(bid)
        elif dec == 'retire-from-browse':
            retire_ids.append(bid)
        elif dec == 'retag':
            new_bands = [b.strip() for b in row['new_bands'].split(',') if b.strip()]
            heads_up = row.get('heads_up', '').strip()
            retag_rows.append({
                'id': bid,
                'title': row['title'],
                'new_bands': new_bands,
                'heads_up': heads_up,
            })

print(f'all={len(all_ids)} remove={len(remove_ids)} retire={len(retire_ids)} retag={len(retag_rows)}')

def sql_list(ids):
    return ','.join(f"'{i}'" for i in ids)

# Save updated state
with open('migrations/_tmp_ids.json', 'w') as f:
    json.dump({
        'all': all_ids,
        'remove': remove_ids,
        'retire': retire_ids,
    }, f)

# Save retag rows for dry-run generation
with open('migrations/_tmp_retag_rows.json', 'w', encoding='utf-8') as f:
    json.dump(retag_rows, f, ensure_ascii=False, indent=2)

# Print heads_up rows
heads_up_rows = [r for r in retag_rows if r['heads_up']]
print(f'heads_up rows: {len(heads_up_rows)}')
for r in heads_up_rows:
    print(f"  {r['id']}: {r['title']}")

# Print new band distribution
from collections import Counter
band_counter = Counter()
for r in retag_rows:
    for b in r['new_bands']:
        band_counter[b] += 1
print('New band distribution (retag rows):', dict(sorted(band_counter.items())))

# Count retag rows that include 10-12 in new_bands (ON CONFLICT DO NOTHING case)
keep_10_12 = [r for r in retag_rows if '10-12' in r['new_bands']]
print(f'Retag rows keeping 10-12: {len(keep_10_12)}')
