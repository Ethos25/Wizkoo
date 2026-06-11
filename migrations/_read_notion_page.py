import json, sys

with open(r'C:\Users\amyog\.claude\projects\C--Users-amyog-Desktop-Wizkoo\8ba1b846-2055-4019-bbe7-ee0b8c651fda\tool-results\mcp-bdcbdfaa-d296-4d8a-8486-b3fd0adf2693-notion-fetch-1777381179791.txt', encoding='utf-8') as f:
    raw = f.read()

data = json.loads(raw)
text = data[0]['text']
print(f'Total chars: {len(text)}', file=sys.stderr)

# The page is one big string — find the last H2 headings
import re
headings = [(m.start(), m.group()) for m in re.finditer(r'^#{1,3} .+', text, re.MULTILINE)]
print(f'Found {len(headings)} headings', file=sys.stderr)
for pos, h in headings[-10:]:
    sys.stdout.buffer.write((f'  pos={pos}: {h}\n').encode('utf-8'))

# Print final 3000 chars
sys.stdout.buffer.write(b'\n=== FINAL 3000 CHARS ===\n')
sys.stdout.buffer.write(text[-3000:].encode('utf-8'))
