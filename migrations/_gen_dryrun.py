import csv, json, datetime

# Load CSV
remove_books = []
retire_books = []
retag_books = []

with open('migrations/library_phase6_p1_retag_audit.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        dec = row['decision'].strip()
        entry = {
            'audit_index': row['audit_index'],
            'id': row['id'].strip(),
            'title': row['title'],
            'author': row['author'],
            'current_bands': [b.strip() for b in row['current_bands'].split(',') if b.strip()],
            'rationale': row['rationale'],
        }
        if dec == 'remove-from-database':
            entry['beth_review_flag'] = row['beth_review_flag']
            remove_books.append(entry)
        elif dec == 'retire-from-browse':
            retire_books.append(entry)
        elif dec == 'retag':
            entry['new_bands'] = [b.strip() for b in row['new_bands'].split(',') if b.strip()]
            entry['heads_up'] = row.get('heads_up', '').strip()
            retag_books.append(entry)

# Pre-verified counts from Supabase queries
step_a_data = {
    'description': 'DELETE old-format band rows, DROP old CHECK constraint, ADD new CHECK constraint, verify 0 invalid rows remain',
    'sql_step_a1': "DELETE FROM library_age_bands WHERE age_band IN ('2-4','5-7','8-10')",
    'sql_step_a2': 'ALTER TABLE library_age_bands DROP CONSTRAINT library_age_bands_age_band_check',
    'sql_step_a3': "ALTER TABLE library_age_bands ADD CONSTRAINT library_age_bands_age_band_check CHECK (age_band IN ('3-4','5-6','7-9','10-12'))",
    'sql_verify': "SELECT COUNT(*) FROM library_age_bands WHERE age_band NOT IN ('3-4','5-6','7-9','10-12')",
    'bands_to_delete': ['2-4', '5-7', '8-10'],
    'pre_verified_band_row_counts': {'2-4': 181, '5-7': 283, '8-10': 157},
    'pre_verified_total_junction_rows_to_delete': 621,
    'pre_verified_surviving_10_12_rows': 104,
    'new_constraint_values': ['3-4', '5-6', '7-9', '10-12'],
    'expected_post_step_a_invalid_rows': 0,
    'note': 'After Step A, the 104 surviving 10-12 rows are valid under the new constraint. Steps B/C/D run after Step A.'
}

# Step B stats
step_b_data = {
    'description': 'DELETE FROM library_books WHERE id IN (...) — cascades all junction tables via ON DELETE CASCADE',
    'count': len(remove_books),
    'note': 'ON DELETE CASCADE propagates to library_age_bands, library_themes, library_subjects, library_diversity',
    'books': remove_books,
}

# Step C stats
step_c_data = {
    'description': "UPDATE library_books SET browse_visible = false WHERE id IN (...)",
    'count': len(retire_books),
    'books': retire_books,
}

# Step D stats
from collections import Counter
band_counter = Counter()
for r in retag_books:
    for b in r['new_bands']:
        band_counter[b] += 1

on_conflict_cases = [r for r in retag_books if '10-12' in r['new_bands']]
heads_up_books = [r for r in retag_books if r.get('heads_up')]

step_d_data = {
    'description': 'INSERT INTO library_age_bands (book_id, age_band) ON CONFLICT DO NOTHING; UPDATE library_books SET heads_up WHERE applicable',
    'count': len(retag_books),
    'band_inserts_by_value': dict(sorted(band_counter.items())),
    'total_band_inserts': sum(band_counter.values()),
    'on_conflict_do_nothing_cases': len(on_conflict_cases),
    'on_conflict_note': 'These books already have 10-12 (survived Step A DELETE); INSERT ON CONFLICT DO NOTHING prevents UNIQUE violation',
    'heads_up_updates': len(heads_up_books),
    'heads_up_books': [{'id': r['id'], 'title': r['title'], 'heads_up': r['heads_up']} for r in heads_up_books],
    'books': retag_books,
}

# Step E dedup scan
step_e_data = {
    'description': 'SELECT title, author, year_published, COUNT(*) FROM library_books GROUP BY ... HAVING COUNT(*) > 1',
    'action': 'report-only — no deletes',
    'pre_migration_duplicates_found': 10,
    'pre_migration_duplicate_titles': [
        'Brown Girl Dreaming (resolved: Row A 18a6f7b1 removed as D-001)',
        'Blockhead: The Life of Fibonacci (resolved: d5f135cf in remove set)',
        'Hatchet (resolved: b9047b0e in remove set)',
        'Separate Is Never Equal (resolved: d6c2204a in remove set)',
        'The Dot (resolved: 10d5d8c1 in remove set)',
        'The Girl Who Drew Butterflies (resolved: ec9390ea in remove set)',
        'The Most Magnificent Thing (resolved: fbeac55d in remove set)',
        'The Name Jar (resolved: 8c8af4c0 in remove set)',
        'Those Shoes (resolved: 74e813b3 in remove set)',
        'What Do You Do With an Idea? (resolved: 510c58ce in remove set)',
    ],
    'post_migration_expected_duplicates': 0,
}

# Corpus change
corpus_data = {
    'before_total_active': 519,
    'step_b_removed': len(remove_books),
    'after_active': 519 - len(remove_books),
    'before_browse_visible': 519,
    'step_c_retired': len(retire_books),
    'after_browse_visible': 519 - len(remove_books) - len(retire_books),
    'note': 'All 519 pre-migration books are status=active and browse_visible=true',
}

# Final dry-run document
dryrun = {
    'generated_at': datetime.datetime.utcnow().isoformat() + 'Z',
    'csv_source': 'migrations/library_phase6_p1_retag_audit.csv',
    'csv_rows': len(remove_books) + len(retire_books) + len(retag_books),
    'mode': 'DRY_RUN — no database writes',
    'summary': {
        'remove_from_database': len(remove_books),
        'retire_from_browse': len(retire_books),
        'retag': len(retag_books),
        'heads_up_updates': len(heads_up_books),
    },
    'step_a_constraint_change': step_a_data,
    'step_b_remove_from_database': step_b_data,
    'step_c_retire_from_browse': step_c_data,
    'step_d_retag': step_d_data,
    'step_e_dedup_scan': step_e_data,
    'corpus_change': corpus_data,
}

ts = datetime.datetime.utcnow().strftime('%Y%m%d_%H%M%S')
outpath = f'migrations/phase6_dryrun_{ts}.json'
with open(outpath, 'w', encoding='utf-8') as f:
    json.dump(dryrun, f, ensure_ascii=False, indent=2)

print(f'Written: {outpath}')
print(f'Summary:')
print(f'  remove_from_database: {len(remove_books)}')
print(f'  retire_from_browse:   {len(retire_books)}')
print(f'  retag:                {len(retag_books)}')
print(f'  heads_up_updates:     {len(heads_up_books)}')
print(f'  band_inserts_total:   {sum(band_counter.values())}')
print(f'  corpus before:        519 active, 519 browse-visible')
print(f'  corpus after:         {corpus_data["after_active"]} active, {corpus_data["after_browse_visible"]} browse-visible')
print(f'  approval_check_csv:   migrations/phase6_amy_approval_check.csv ({len(remove_books)} rows)')
