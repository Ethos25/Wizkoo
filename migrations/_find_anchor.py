import json, sys, re

with open(r'C:\Users\amyog\.claude\projects\C--Users-amyog-Desktop-Wizkoo\8ba1b846-2055-4019-bbe7-ee0b8c651fda\tool-results\mcp-bdcbdfaa-d296-4d8a-8486-b3fd0adf2693-notion-fetch-1777381179791.txt', encoding='utf-8') as f:
    raw = f.read()

data = json.loads(raw)
text = data[0]['text']

# Find first <page url= occurrence
first_page = text.find('<page url=')
sys.stdout.buffer.write(f'First <page url= at position: {first_page}\n'.encode('utf-8'))

# Print 500 chars before first <page url= to find anchor text
anchor_region = text[max(0, first_page-600):first_page]
sys.stdout.buffer.write(b'\n=== 600 CHARS BEFORE FIRST CHILD PAGE ===\n')
sys.stdout.buffer.write(anchor_region.encode('utf-8'))

# Also look for the last H2/H3 style text (##) in the main content
# Try finding text that ends a section near the child pages
sys.stdout.buffer.write(b'\n\n=== FIRST 500 CHARS OF PAGE ===\n')
sys.stdout.buffer.write(text[:500].encode('utf-8'))
