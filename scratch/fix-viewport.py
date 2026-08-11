import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix margin
content = re.sub(
    r'margin: clamp\(120px, 15vh, 200px\) auto 0;',
    r'margin: clamp(40px, 8vh, 80px) auto 0;',
    content
)

# Fix pf-l1 font size
content = re.sub(
    r'\.pf-l1 \{\s*font-family: \'Fraunces\', serif;\s*font-size: clamp\(32px, 4\.5vw, 64px\);',
    r'.pf-l1 {\n  font-family: \'Fraunces\', serif;\n  font-size: clamp(28px, 3.5vw, 48px);',
    content
)

# Fix pf-l2 font size
content = re.sub(
    r'\.pf-l2 \{\s*font-family: \'Fraunces\', serif;\s*font-size: clamp\(24px, 3\.5vw, 48px\);',
    r'.pf-l2 {\n  font-family: \'Fraunces\', serif;\n  font-size: clamp(20px, 2.5vw, 36px);',
    content
)

# Reduce gap in content to save vertical space
content = re.sub(
    r'\.pf-content \{\s*display: flex;\s*flex-direction: column;\s*gap: clamp\(16px, 2vh, 24px\);',
    r'.pf-content {\n  display: flex;\n  flex-direction: column;\n  gap: clamp(12px, 1.5vh, 16px);',
    content
)

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
