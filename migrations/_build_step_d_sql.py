import csv, json

retag_ids = []
band_pairs = []  # (book_id, age_band)
heads_up_pairs = []  # (book_id, heads_up_text)

with open('migrations/library_phase6_p1_retag_audit.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['decision'].strip() != 'retag':
            continue
        bid = row['id'].strip()
        retag_ids.append(bid)
        new_bands = [b.strip() for b in row['new_bands'].split(',') if b.strip()]
        for band in new_bands:
            band_pairs.append((bid, band))
        hu = row.get('heads_up', '').strip()
        if hu:
            heads_up_pairs.append((bid, hu))

print(f'retag_ids: {len(retag_ids)}')
print(f'band_pairs: {len(band_pairs)}')
print(f'heads_up_pairs: {len(heads_up_pairs)}')

def sql_list(ids):
    return ','.join(f"'{i}'" for i in ids)

# Step D DELETE (remove all existing band rows for retag books)
delete_sql = f"DELETE FROM library_age_bands WHERE book_id IN ({sql_list(retag_ids)})"
print(f'Step D DELETE sql length: {len(delete_sql)}')

# Step D INSERT — build VALUES list
values = ', '.join(f"('{bid}', '{band}')" for bid, band in band_pairs)
insert_sql = f"INSERT INTO library_age_bands (book_id, age_band) VALUES {values} ON CONFLICT DO NOTHING"
print(f'Step D INSERT sql length: {len(insert_sql)}')

# Heads up UPDATE — build individual UPDATE statements
# We'll do these as one per row but can batch with CASE WHEN
# Build as multiple separate statements joined with semicolons
# Actually build as a single query using CASE
# Safer: individual updates (9 books)
hu_updates = []
for bid, hu in heads_up_pairs:
    escaped = hu.replace("'", "''")
    hu_updates.append(f"UPDATE library_books SET heads_up = '{escaped}' WHERE id = '{bid}'")
print(f'heads_up updates: {len(hu_updates)}')

# Save to files for use in supabase calls
with open('migrations/_step_d_delete.sql', 'w') as f:
    f.write(delete_sql)
with open('migrations/_step_d_insert.sql', 'w') as f:
    f.write(insert_sql)
with open('migrations/_step_d_hupdates.json', 'w', encoding='utf-8') as f:
    json.dump(hu_updates, f, ensure_ascii=False, indent=2)

# Also save remove and retire ID lists
with open('migrations/_tmp_ids.json') as f:
    d = json.load(f)

with open('migrations/_step_b_delete.sql', 'w') as f:
    f.write(f"DELETE FROM library_books WHERE id IN ({sql_list(d['remove'])}) RETURNING id")

with open('migrations/_step_c_update.sql', 'w') as f:
    f.write(f"UPDATE library_books SET browse_visible = false WHERE id IN ({sql_list(d['retire'])}) RETURNING id")

with open('migrations/_step_c_delete_bands.sql', 'w') as f:
    f.write(f"DELETE FROM library_age_bands WHERE book_id IN ({sql_list(d['retire'])}) RETURNING book_id, age_band")

print('All SQL files written.')
print(f'Remove IDs: {len(d["remove"])}')
print(f'Retire IDs: {len(d["retire"])}')
