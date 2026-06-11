import re, sys, json

def slugify(title):
    s = title.lower()
    s = re.sub(r"[''']", '', s)
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def esc(s):
    return s.replace("'", "''")

books = [
    {
        'id': '4ed65746-1652-494c-95fd-649d3f1053b9',
        'title': 'Clifford the Big Red Dog',
        'author': 'Norman Bridwell',
        'orbital_score': 4,
        'reading_level': 'pre-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': "Emily Elizabeth's love for her tiny puppy makes him the biggest dog in the world — and the town has to rearrange itself around Clifford.",
        'cover_image_url': 'https://covers.openlibrary.org/b/id/383686-L.jpg',
        'year_published': 1963,
        'browse_visible': 'false',
        'heads_up': None,
        'bands': ['3-4', '5-6'],
        'themes': ['community', 'dogs', 'friendship', 'size', 'suburban'],
        'subjects': [],
    },
    {
        'id': 'e233c979-8bb2-4fa5-9104-12f044ebbbd3',
        'title': 'The Big Red Barn',
        'author': 'Margaret Wise Brown',
        'orbital_score': 4,
        'reading_level': 'pre-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': 'A farm day from morning to night — every animal named, every sound captured, the whole cycle complete.',
        'cover_image_url': 'https://covers.openlibrary.org/b/id/51035-L.jpg',
        'year_published': 1989,
        'browse_visible': 'false',
        'heads_up': None,
        'bands': ['3-4', '5-6'],
        'themes': ['animals', 'day-cycle', 'farm', 'seasons', 'sleep'],
        'subjects': [],
    },
    {
        'id': '92abc47c-b823-4963-865a-df090866dbd4',
        'title': 'Dad, I Miss You',
        'author': 'Nadia Sammurtok',
        'orbital_score': 3,
        'reading_level': 'pre-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': 'An Inuit child misses their father — and the specific landscape of the Arctic holds both the missing and the love.',
        'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9781772274820-L.jpg',
        'year_published': 2025,
        'browse_visible': 'true',
        'heads_up': None,
        'bands': ['3-4', '5-6'],
        'themes': ['father', 'grief', 'Inuit', 'longing', 'missing'],
        'subjects': ['social-emotional'],
    },
    {
        'id': 'afdd6964-9729-4b39-bc67-7e61f4ec1abd',
        'title': 'My Daddy Is a Cowboy',
        'author': 'Stephanie Seales',
        'orbital_score': 3,
        'reading_level': 'early-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': 'A girl and her father take an early morning horseback ride through their city — six starred reviews for a book about just-us time that the Coretta Scott King committee found essential.',
        'cover_image_url': 'https://covers.openlibrary.org/b/id/14637947-L.jpg',
        'year_published': 2025,
        'browse_visible': 'true',
        'heads_up': None,
        'bands': ['3-4', '5-6', '7-9'],
        'themes': ['city', 'cowboy', 'father-daughter', 'horseback', 'morning'],
        'subjects': ['social-emotional'],
    },
    {
        'id': 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12',
        'title': 'The Biggest Bear',
        'author': 'Lynd Ward',
        'orbital_score': 4,
        'reading_level': 'pre-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': "Johnny brings home a bear cub — and learns the hard way that wild animals and farms don't mix for long.",
        'cover_image_url': 'https://covers.openlibrary.org/b/id/255418-L.jpg',
        'year_published': 1952,
        'browse_visible': 'true',
        'heads_up': 'The bear cub Johnny raised must be released or destroyed; emotional separation depicted.',
        'bands': ['5-6', '7-9'],
        'themes': ['bears', 'consequences', 'New-England', 'responsibility', 'wild-animals'],
        'subjects': [],
    },
    {
        'id': 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd',
        'title': "Ruthie Rose's Big Idea: A Poetry Story",
        'author': 'John Schu',
        'orbital_score': 3,
        'reading_level': 'early-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-together',
        'hook': "A girl has a big idea she's afraid to share — and she discovers that sharing is how ideas grow.",
        'cover_image_url': 'https://m.media-amazon.com/images/I/91jafBQOtXL._SL500_.jpg',
        'year_published': 2025,
        'browse_visible': 'true',
        'heads_up': None,
        'bands': ['5-6', '7-9'],
        'themes': ['creativity', 'ideas', 'poetry', 'school', 'sharing'],
        'subjects': [],
    },
    {
        'id': 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9',
        'title': 'Stalactite and Stalagmite: A Big Tale From a Little Cave',
        'author': 'Drew Beckmeyer',
        'orbital_score': 5,
        'reading_level': 'early-reader',
        'book_format': 'picture-book',
        'parent_role': 'read-side-by-side',
        'hook': "Two tiny cave formations witness the entire history of the world — from the dinosaurs to right now — and can't quite agree on what it means.",
        'cover_image_url': 'https://covers.openlibrary.org/b/isbn/9781665926645-L.jpg',
        'year_published': 2025,
        'browse_visible': 'true',
        'heads_up': None,
        'bands': ['5-6', '7-9'],
        'themes': ['cave-formations', 'earth-history', 'geology', 'humor', 'time'],
        'subjects': [],
    },
]

# Build library_books INSERT
book_vals = []
for b in books:
    slug = slugify(b['title'])
    hu = f"'{esc(b['heads_up'])}'" if b['heads_up'] else 'NULL'
    cover = f"'{esc(b['cover_image_url'])}'" if b['cover_image_url'] else 'NULL'
    val = (
        f"('{b['id']}', '{slug}', '{esc(b['title'])}', '{esc(b['author'])}', "
        f"{b['orbital_score']}, '{b['reading_level']}', '{b['book_format']}', "
        f"'{b['parent_role']}', '{esc(b['hook'])}', '', '', '', "
        f"'active', {b['browse_visible']}, {cover}, {b['year_published']}, "
        f"{hu}, 'beth-holloway')"
    )
    book_vals.append(val)

insert_books = (
    'INSERT INTO library_books '
    '(id, slug, title, author, orbital_score, reading_level, book_format, '
    'parent_role, hook, orbital_description, best_for, pairs_with, '
    'status, browse_visible, cover_image_url, year_published, heads_up, curated_by) VALUES\n'
    + ',\n'.join(book_vals)
)

# Build library_themes INSERT
theme_vals = []
for b in books:
    for t in b['themes']:
        theme_vals.append(f"(gen_random_uuid(), '{b['id']}', '{esc(t)}')")
insert_themes = (
    'INSERT INTO library_themes (id, book_id, theme) VALUES\n'
    + ',\n'.join(theme_vals)
)

# Build library_subjects INSERT (only non-empty)
subject_vals = []
for b in books:
    for s in b['subjects']:
        subject_vals.append(f"(gen_random_uuid(), '{b['id']}', '{esc(s)}')")

insert_subjects = None
if subject_vals:
    insert_subjects = (
        'INSERT INTO library_subjects (id, book_id, subject) VALUES\n'
        + ',\n'.join(subject_vals)
    )

# Build library_age_bands INSERT
band_vals = []
for b in books:
    for band in b['bands']:
        band_vals.append(f"('{b['id']}', '{band}')")
insert_bands = (
    'INSERT INTO library_age_bands (book_id, age_band) VALUES\n'
    + ',\n'.join(band_vals)
    + ' ON CONFLICT DO NOTHING'
)

print(f'library_books INSERT: {len(books)} rows')
print(f'library_themes INSERT: {len(theme_vals)} rows')
print(f'library_subjects INSERT: {len(subject_vals)} rows')
print(f'library_age_bands INSERT: {len(band_vals)} rows')

# Save SQL
with open('migrations/_reinsertion.sql', 'w', encoding='utf-8') as f:
    f.write('-- library_books\n')
    f.write(insert_books + ';\n\n')
    f.write('-- library_themes\n')
    f.write(insert_themes + ';\n\n')
    if insert_subjects:
        f.write('-- library_subjects\n')
        f.write(insert_subjects + ';\n\n')
    f.write('-- library_age_bands\n')
    f.write(insert_bands + ';\n')

# Also save the SQL strings to a JSON for easy loading
sqls = {
    'insert_books': insert_books,
    'insert_themes': insert_themes,
    'insert_subjects': insert_subjects,
    'insert_bands': insert_bands,
}
with open('migrations/_reinsertion_sqls.json', 'w', encoding='utf-8') as f:
    json.dump(sqls, f, ensure_ascii=False, indent=2)

print('Saved: migrations/_reinsertion.sql')
print('Saved: migrations/_reinsertion_sqls.json')
