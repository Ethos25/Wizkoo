import json, re

result_file = r'C:\Users\amyog\.claude\projects\C--Users-amyog-Desktop-Wizkoo\6221fde8-01fd-45ca-8957-d74be929236f\tool-results\mcp-supabase-execute_sql-1777505570704.txt'
with open(result_file, encoding='utf-8') as f:
    raw = f.read()

outer = json.loads(raw)
inner = json.loads(outer[0]['text'])
result_str = inner['result']

m = re.search(r'<untrusted-data-[a-f0-9-]+>\s*(\[.*?\])\s*</untrusted-data-[a-f0-9-]+>', result_str, re.DOTALL)
if not m:
    print('NO MATCH')
    print(repr(result_str[:300]))
else:
    books = json.loads(m.group(1))
    print(f'Parsed {len(books)} books in batch 2')
    score5 = [b for b in books if b['orbital_score'] == 5]
    score4 = [b for b in books if b['orbital_score'] == 4]
    print(f'Score 5: {len(score5)} | Score 4: {len(score4)}')

    # Load existing and append
    existing_file = r'C:\Users\amyog\Desktop\Wizkoo\exports\sweep_books.json'
    with open(existing_file, encoding='utf-8') as f2:
        existing = json.load(f2)

    new_entries = []
    for b in books:
        new_entries.append({
            'id': b['id'],
            'title': b['title'],
            'author': b['author'],
            'year_published': b.get('year_published'),
            'book_format': b.get('book_format'),
            'reading_level': b.get('reading_level'),
            'current_score': b['orbital_score'],
            'orbital_description': b.get('orbital_description'),
            'heads_up': b.get('heads_up'),
            'cover_quality': b.get('cover_quality'),
            'browse_visible': b.get('browse_visible'),
            'bands': b.get('bands', []),
            'subjects': b.get('subjects', []),
        })

    combined = existing + new_entries
    with open(existing_file, 'w', encoding='utf-8') as f3:
        json.dump(combined, f3, ensure_ascii=False, indent=2)

    total5 = sum(1 for b in combined if b['current_score'] == 5)
    total4 = sum(1 for b in combined if b['current_score'] == 4)
    print(f'Combined total: {len(combined)} books | Score 5: {total5} | Score 4: {total4}')
