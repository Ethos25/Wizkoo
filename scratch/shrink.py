import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Shrink .plan-founder margin
content = re.sub(
    r'\.plan-founder \{\s*display: flex;\s*gap: clamp\(24px, 4vw, 64px\);\s*align-items: flex-start;\s*max-width: 1100px;\s*margin: clamp\(40px, 6vh, 80px\) auto 0;',
    r'.plan-founder {\n  display: flex;\n  gap: clamp(20px, 3vw, 40px);\n  align-items: flex-start;\n  max-width: 1100px;\n  margin: clamp(10px, 2vh, 40px) auto 0;',
    content
)

# Shrink .pf-l1 font size
content = re.sub(
    r'\.pf-l1 \{\s*font-family: \'Fraunces\', serif;\s*font-size: clamp\(36px, 5vw, 68px\);',
    r'.pf-l1 {\n  font-family: \'Fraunces\', serif;\n  font-size: clamp(28px, 4vw, 48px);',
    content
)

# Shrink .pf-l2 font size
content = re.sub(
    r'\.pf-l2 \{\s*font-family: \'Fraunces\', serif;\s*font-size: clamp\(24px, 3vw, 44px\);',
    r'.pf-l2 {\n  font-family: \'Fraunces\', serif;\n  font-size: clamp(20px, 2.5vw, 32px);',
    content
)

# Shrink gap in .pf-col-main
content = re.sub(
    r'\.pf-col-main \{\s*display: flex;\s*flex-direction: column;\s*gap: clamp\(16px, 2\.5vh, 24px\);',
    r'.pf-col-main {\n  display: flex;\n  flex-direction: column;\n  gap: clamp(8px, 1.5vh, 16px);',
    content
)

# Shrink gap in .pf-content
content = re.sub(
    r'\.pf-content \{\s*flex: 1;\s*display: grid;\s*grid-template-columns: 1\.2fr 1fr;\s*gap: clamp\(40px, 5vw, 80px\);',
    r'.pf-content {\n  flex: 1;\n  display: grid;\n  grid-template-columns: 1.2fr 1fr;\n  gap: clamp(20px, 3vw, 40px);',
    content
)

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
