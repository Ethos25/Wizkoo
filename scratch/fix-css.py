import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Delete the old .plan-founder related CSS
content = re.sub(r'\.plan-founder\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-villain\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-content\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-col-main\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-col-side\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l1\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l2\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l3\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l4\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l4\sstrong\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-l5\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-right\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-badge[\s\S]*?\}', '', content) # Removes .pf-badge, .pf-badge:hover, .pf-badge::before
content = re.sub(r'\.pf-kinetic\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'@keyframes\snervous\s*\{[\s\S]*?\}', '', content)
content = re.sub(r'\.pf-left\s*\{[\s\S]*?\}', '', content)


new_css = """.plan-founder {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  align-items: center;
  max-width: 1100px;
  width: 100%;
  margin: clamp(10px, 2vh, 40px) auto 0;
  box-sizing: border-box;
}
.pf-left {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  flex: 1;
  align-items: flex-end; /* Bottom justify the vertical text */
}
.pf-villain {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: 'Space Mono', monospace;
  font-size: clamp(14px, 1.8vw, 24px);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--saffron);
  letter-spacing: -0.05em;
  line-height: 1;
  margin: 0;
  white-space: nowrap;
}
.pf-content {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 16px);
  max-width: 600px;
}
.pf-l1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  line-height: 1.1;
  color: var(--ink);
  letter-spacing: -0.03em;
}
.pf-l2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(20px, 2.5vw, 32px);
  font-weight: 600;
  font-style: italic;
  color: var(--ink);
  line-height: 1.1;
  letter-spacing: -0.02em;
  border-left: 3px solid var(--saffron);
  padding-left: clamp(16px, 2vw, 20px);
}
@keyframes nervous {
  0%, 100% { font-variation-settings: "wght" 600; transform: translateX(0); }
  50% { font-variation-settings: "wght" 300; transform: translateX(2px); color: var(--saffron); }
}
.pf-kinetic {
  display: inline-block;
  animation: nervous 2s infinite ease-in-out;
  border-bottom: 2px solid var(--saffron);
}
.pf-l3 {
  font-family: 'Fraunces', serif;
  font-size: clamp(16px, 2vw, 22px);
  font-style: italic;
  font-weight: 400;
  color: rgba(12,16,32,0.9);
  line-height: 1.5;
  margin-left: 20px;
}
.pf-l5 {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(12,16,32,0.5);
  margin-top: 16px;
}
.pf-right {
  flex: 0 0 clamp(240px, 25vw, 320px);
  display: flex;
  justify-content: center;
}
.pf-badge {
  background: var(--ink);
  color: var(--linen);
  padding: clamp(24px, 3vw, 40px) clamp(24px, 2.5vw, 32px);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 32px 64px -16px rgba(12,16,32,0.3);
  transform: rotate(2deg);
  transition: transform 0.5s var(--expo);
}
.pf-badge:hover {
  transform: rotate(0deg) scale(1.02);
}
.pf-badge::before {
  content: ''; position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-3deg);
  width: 60px; height: 24px; background: rgba(251,247,235,0.9); box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.pf-l4 {
  font-family: 'Fraunces', serif;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.4;
  font-style: italic;
}
.pf-l4 strong {
  font-style: normal;
  font-size: clamp(20px, 1.8vw, 24px);
  color: var(--saffron);
  display: block;
  margin-bottom: 12px;
}
</style>
"""

content = content.replace('</style>\n<!-- \u25a0 \u25a0 \u25a0 HERO SYSTEM', new_css + '<!-- \u25a0 \u25a0 \u25a0 HERO SYSTEM')

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
