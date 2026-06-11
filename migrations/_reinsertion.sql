-- library_books
INSERT INTO library_books (id, slug, title, author, orbital_score, reading_level, book_format, parent_role, hook, orbital_description, best_for, pairs_with, status, browse_visible, cover_image_url, year_published, heads_up, curated_by) VALUES
('4ed65746-1652-494c-95fd-649d3f1053b9', 'clifford-the-big-red-dog', 'Clifford the Big Red Dog', 'Norman Bridwell', 4, 'pre-reader', 'picture-book', 'read-together', 'Emily Elizabeth''s love for her tiny puppy makes him the biggest dog in the world — and the town has to rearrange itself around Clifford.', '', '', '', 'active', false, 'https://covers.openlibrary.org/b/id/383686-L.jpg', 1963, NULL, 'beth-holloway'),
('e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'the-big-red-barn', 'The Big Red Barn', 'Margaret Wise Brown', 4, 'pre-reader', 'picture-book', 'read-together', 'A farm day from morning to night — every animal named, every sound captured, the whole cycle complete.', '', '', '', 'active', false, 'https://covers.openlibrary.org/b/id/51035-L.jpg', 1989, NULL, 'beth-holloway'),
('92abc47c-b823-4963-865a-df090866dbd4', 'dad-i-miss-you', 'Dad, I Miss You', 'Nadia Sammurtok', 3, 'pre-reader', 'picture-book', 'read-together', 'An Inuit child misses their father — and the specific landscape of the Arctic holds both the missing and the love.', '', '', '', 'active', true, 'https://covers.openlibrary.org/b/isbn/9781772274820-L.jpg', 2025, NULL, 'beth-holloway'),
('afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'my-daddy-is-a-cowboy', 'My Daddy Is a Cowboy', 'Stephanie Seales', 3, 'early-reader', 'picture-book', 'read-together', 'A girl and her father take an early morning horseback ride through their city — six starred reviews for a book about just-us time that the Coretta Scott King committee found essential.', '', '', '', 'active', true, 'https://covers.openlibrary.org/b/id/14637947-L.jpg', 2025, NULL, 'beth-holloway'),
('f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'the-biggest-bear', 'The Biggest Bear', 'Lynd Ward', 4, 'pre-reader', 'picture-book', 'read-together', 'Johnny brings home a bear cub — and learns the hard way that wild animals and farms don''t mix for long.', '', '', '', 'active', true, 'https://covers.openlibrary.org/b/id/255418-L.jpg', 1952, 'The bear cub Johnny raised must be released or destroyed; emotional separation depicted.', 'beth-holloway'),
('bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'ruthie-roses-big-idea-a-poetry-story', 'Ruthie Rose''s Big Idea: A Poetry Story', 'John Schu', 3, 'early-reader', 'picture-book', 'read-together', 'A girl has a big idea she''s afraid to share — and she discovers that sharing is how ideas grow.', '', '', '', 'active', true, 'https://m.media-amazon.com/images/I/91jafBQOtXL._SL500_.jpg', 2025, NULL, 'beth-holloway'),
('da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'stalactite-and-stalagmite-a-big-tale-from-a-little-cave', 'Stalactite and Stalagmite: A Big Tale From a Little Cave', 'Drew Beckmeyer', 5, 'early-reader', 'picture-book', 'read-side-by-side', 'Two tiny cave formations witness the entire history of the world — from the dinosaurs to right now — and can''t quite agree on what it means.', '', '', '', 'active', true, 'https://covers.openlibrary.org/b/isbn/9781665926645-L.jpg', 2025, NULL, 'beth-holloway');

-- library_themes
INSERT INTO library_themes (id, book_id, theme) VALUES
(gen_random_uuid(), '4ed65746-1652-494c-95fd-649d3f1053b9', 'community'),
(gen_random_uuid(), '4ed65746-1652-494c-95fd-649d3f1053b9', 'dogs'),
(gen_random_uuid(), '4ed65746-1652-494c-95fd-649d3f1053b9', 'friendship'),
(gen_random_uuid(), '4ed65746-1652-494c-95fd-649d3f1053b9', 'size'),
(gen_random_uuid(), '4ed65746-1652-494c-95fd-649d3f1053b9', 'suburban'),
(gen_random_uuid(), 'e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'animals'),
(gen_random_uuid(), 'e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'day-cycle'),
(gen_random_uuid(), 'e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'farm'),
(gen_random_uuid(), 'e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'seasons'),
(gen_random_uuid(), 'e233c979-8bb2-4fa5-9104-12f044ebbbd3', 'sleep'),
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'father'),
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'grief'),
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'Inuit'),
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'longing'),
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'missing'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'city'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'cowboy'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'father-daughter'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'horseback'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'morning'),
(gen_random_uuid(), 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'bears'),
(gen_random_uuid(), 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'consequences'),
(gen_random_uuid(), 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'New-England'),
(gen_random_uuid(), 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'responsibility'),
(gen_random_uuid(), 'f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', 'wild-animals'),
(gen_random_uuid(), 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'creativity'),
(gen_random_uuid(), 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'ideas'),
(gen_random_uuid(), 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'poetry'),
(gen_random_uuid(), 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'school'),
(gen_random_uuid(), 'bd8424be-a34e-48be-8c9a-d218fd5ab4bd', 'sharing'),
(gen_random_uuid(), 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'cave-formations'),
(gen_random_uuid(), 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'earth-history'),
(gen_random_uuid(), 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'geology'),
(gen_random_uuid(), 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'humor'),
(gen_random_uuid(), 'da5b14b2-cede-4fac-9f15-f909f0c9bcd9', 'time');

-- library_subjects
INSERT INTO library_subjects (id, book_id, subject) VALUES
(gen_random_uuid(), '92abc47c-b823-4963-865a-df090866dbd4', 'social-emotional'),
(gen_random_uuid(), 'afdd6964-9729-4b39-bc67-7e61f4ec1abd', 'social-emotional');

-- library_age_bands
INSERT INTO library_age_bands (book_id, age_band) VALUES
('4ed65746-1652-494c-95fd-649d3f1053b9', '3-4'),
('4ed65746-1652-494c-95fd-649d3f1053b9', '5-6'),
('e233c979-8bb2-4fa5-9104-12f044ebbbd3', '3-4'),
('e233c979-8bb2-4fa5-9104-12f044ebbbd3', '5-6'),
('92abc47c-b823-4963-865a-df090866dbd4', '3-4'),
('92abc47c-b823-4963-865a-df090866dbd4', '5-6'),
('afdd6964-9729-4b39-bc67-7e61f4ec1abd', '3-4'),
('afdd6964-9729-4b39-bc67-7e61f4ec1abd', '5-6'),
('afdd6964-9729-4b39-bc67-7e61f4ec1abd', '7-9'),
('f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', '5-6'),
('f3dc1bda-55bd-4cf9-b5e8-e0d1a0a0fa12', '7-9'),
('bd8424be-a34e-48be-8c9a-d218fd5ab4bd', '5-6'),
('bd8424be-a34e-48be-8c9a-d218fd5ab4bd', '7-9'),
('da5b14b2-cede-4fac-9f15-f909f0c9bcd9', '5-6'),
('da5b14b2-cede-4fac-9f15-f909f0c9bcd9', '7-9') ON CONFLICT DO NOTHING;
