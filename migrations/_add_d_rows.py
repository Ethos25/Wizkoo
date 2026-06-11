import csv, json

new_rows = [
    {
        'audit_index': 'D-002',
        'id': '5abb6a6c-7eae-4002-8c7a-56d402181843',
        'title': 'We Are Not Free',
        'author': 'Traci Chee (editor)',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'chapter-book',
        'year_published': '2020',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Amy Session 13 directive (sustained classroom/peer cruelty) applied; book fell outside original three-population audit scope. Removed per Amy directive Session 13 coverage-audit follow-on.'
    },
    {
        'audit_index': 'D-003',
        'id': '454778a9-fd3d-4c91-af0a-900df0c9487b',
        'title': 'Watership Down',
        'author': 'Richard Adams',
        'current_bands': '10-12',
        'reading_level': 'advanced',
        'book_format': 'chapter-book',
        'year_published': '1972',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Pre-1990 + sustained animal violence (predator scenes, rabbit-vs-rabbit combat, human-caused warren destruction) at adult-tier intensity. Same logic as Gentle Ben removal.'
    },
    {
        'audit_index': 'D-004',
        'id': 'c0259c16-6d6b-4721-970c-e2abb2aa31f2',
        'title': 'Redwall',
        'author': 'Brian Jacques',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'chapter-book',
        'year_published': '1986',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Pre-1990 + sustained animal-combat content across the series. Same logic as Watership Down removal.'
    },
    {
        'audit_index': 'D-005',
        'id': '04fe6e65-55e0-4908-8c2c-ba777226a1bd',
        'title': 'The Sign of the Beaver',
        'author': 'Elizabeth George Speare',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'chapter-book',
        'year_published': '1983',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': "Pre-1990 frontier-era white-boy/Native-boy friendship narrative with period framing concerns. Same logic as Little House removal."
    },
    {
        'audit_index': 'D-006',
        'id': '0fdb403d-a93f-4bd2-b585-9f16a5e99e79',
        'title': 'Island of the Blue Dolphins',
        'author': "Scott O'Dell",
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'chapter-book',
        'year_published': '1960',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Pre-1990 Indigenous (Lone Woman of San Nicolas) story written by non-Indigenous author. Same logic as period-framing-by-non-Indigenous-author removals.'
    },
    {
        'audit_index': 'D-007',
        'id': '8ef2a95a-591a-425d-ba55-e61b93376c94',
        'title': 'Impossible Escape',
        'author': 'Steve Sheinkin',
        'current_bands': '10-12',
        'reading_level': 'advanced',
        'book_format': 'nonfiction',
        'year_published': '2023',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': "Holocaust escape narrative; violence-as-subject. Same logic as Lions' Run removal."
    },
    {
        'audit_index': 'D-008',
        'id': 'e74470fc-0af5-4e0e-b91f-99ac204c4c17',
        'title': 'The Boys Who Challenged Hitler',
        'author': 'Phillip Hoose',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'nonfiction',
        'year_published': '2015',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Nazi-era resistance; violence-as-subject. Same logic as Holocaust/Nazi-era violence-as-subject removals.'
    },
    {
        'audit_index': 'D-009',
        'id': '22c5f14f-5de4-452a-aa4f-ae1c9dd5b666',
        'title': 'Fallout: Spies, Superbombs, and the Ultimate Cold War Showdown',
        'author': 'Steve Sheinkin',
        'current_bands': '10-12',
        'reading_level': 'advanced',
        'book_format': 'nonfiction',
        'year_published': '2021',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Cold War nuclear weapons + Cuban Missile Crisis; violence-as-subject.'
    },
    {
        'audit_index': 'D-010',
        'id': 'c636a07b-30ac-4c72-9f2e-16295b8de345',
        'title': 'Most Dangerous: Daniel Ellsberg and the Secret History of the Vietnam War',
        'author': 'Steve Sheinkin',
        'current_bands': '10-12',
        'reading_level': 'advanced',
        'book_format': 'nonfiction',
        'year_published': '2015',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Vietnam War + Pentagon Papers; violence-as-subject.'
    },
    {
        'audit_index': 'D-011',
        'id': '3e3eb02c-dcc1-424c-8f31-9874049685d6',
        'title': 'Port Chicago 50',
        'author': 'Steve Sheinkin',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'nonfiction',
        'year_published': '2014',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Military explosion + civil rights mutiny trial; violence-as-subject.'
    },
    {
        'audit_index': 'D-012',
        'id': '0b78eb0e-6340-46e6-9f60-17e1e2c595ba',
        'title': 'Never Caught, the Story of Ona Judge',
        'author': 'Erica Armstrong Dunbar and Kathleen Van Cleve',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'nonfiction',
        'year_published': '2019',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': "Slavery as central subject (enslaved woman escaping George Washington's household); violence-as-subject. Same logic as civil-rights-era violence-as-subject removals."
    },
    {
        'audit_index': 'D-013',
        'id': '4e39cc4b-e033-4f76-9079-219e2ca14057',
        'title': 'Undefeated: Jim Thorpe and the Carlisle Indian School Football Team',
        'author': 'Steve Sheinkin',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'nonfiction',
        'year_published': '2017',
        'browse_visible': 'True',
        'population': '',
        'decision': 'remove-from-database',
        'new_bands': '',
        'beth_review_flag': 'amy-approved',
        'heads_up': '',
        'rationale': 'Carlisle Indian Industrial School = boarding-school violence against Indigenous children implied throughout; violence-as-subject.'
    },
    {
        'audit_index': 'D-014',
        'id': '4b949473-c1d6-478e-9d32-aece92e29bd5',
        'title': 'Guts',
        'author': 'Raina Telgemeier',
        'current_bands': '10-12',
        'reading_level': 'independent',
        'book_format': 'graphic-novel',
        'year_published': '2019',
        'browse_visible': 'True',
        'population': '',
        'decision': 'retag',
        'new_bands': '10-12',
        'beth_review_flag': 'none',
        'heads_up': "Raina's anxiety, panic attacks, and recurring stomach symptoms are the book's subject; some readers will see themselves, others may find it activating.",
        'rationale': 'Approved with heads_up applied. Memoir; identity narrative not removed; parents get context they may want.'
    },
]

# Read existing CSV
with open('migrations/library_phase6_p1_retag_audit.csv', encoding='utf-8', newline='') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    rows = list(reader)

print(f'Rows before: {len(rows)}')
rows.extend(new_rows)

with open('migrations/library_phase6_p1_retag_audit.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f'Rows after: {len(rows)}  (expected 458)')

decisions = {}
for r in rows:
    d = r['decision']
    decisions[d] = decisions.get(d, 0) + 1
print('By decision:', decisions)

# Regenerate approval check CSV
approval_rows = [r for r in rows if r['decision'] == 'remove-from-database']
approval_fields = ['audit_index','id','title','author','current_bands','decision','rationale','beth_review_flag']
with open('migrations/phase6_amy_approval_check.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=approval_fields, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(approval_rows)
print(f'Approval check CSV: {len(approval_rows)} removal rows')

# Show D-row removals
d_removals = [r for r in approval_rows if r['audit_index'].startswith('D-')]
print(f'D-row removals: {len(d_removals)}')
print(f'Total: 56 original + {len(d_removals)} D-rows = {56 + len(d_removals)}')
