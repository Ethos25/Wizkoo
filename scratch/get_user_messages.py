import json
import re

path = r"C:\Users\amyog\.gemini\antigravity\brain\666201f9-87e4-4d73-8504-fa53ba29a6c9\.system_generated\logs\transcript.jsonl"

messages = []
with open(path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("type") == "USER_INPUT":
                text = data.get('content', '')
                text = re.sub(r'\s+', ' ', text)
                messages.append(f"[{data.get('created_at')}] {text[:200]}")
        except:
            pass

for i, msg in enumerate(messages[-40:]):
    print(f"{i:02d}: {msg}")
