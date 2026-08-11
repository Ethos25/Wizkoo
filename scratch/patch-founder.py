import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

old_css = r"\.plan-founder\{max-width:640px;margin:clamp\(52px,8vh,88px\) auto 0;text-align:center\}\s*/\* The quiet center: the only place the brand explains itself\. Runs unnamed\. \*/\s*\.founder-beat\{max-width:540px;margin:0 auto;text-align:left;font-size:clamp\(0\.95rem,1\.12vw,1\.05rem\);line-height:1\.85;letter-spacing:-0\.012em;color:rgba\(12,16,32,0\.74\);text-wrap:pretty\}\s*\.founder-beat::before\{content:'';display:block;width:28px;height:1px;background:#E8AF38;opacity:0\.85;margin:0 0 clamp\(20px,3vh,28px\)\}\s*\.founder-cta\{padding-top:clamp\(28px,4vh,40px\);display:flex;flex-direction:column;align-items:center\}"

new_css = """\.plan-founder {
  display: flex;
  gap: clamp(24px, 4vw, 40px);
  align-items: center;
  max-width: 1100px;
  width: 100%;
  margin: clamp(120px, 15vh, 200px) auto 0;
  box-sizing: border-box;
}
\.pf-left {
  display: flex;
  gap: clamp(24px, 4vw, 40px);
  flex: 1;
  align-items: flex-end; /* Bottom justify the vertical text */
}
\.pf-villain {
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
\.pf-content {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vh, 24px);
  max-width: 600px;
}
\.pf-l1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(32px, 4.5vw, 64px);
  font-weight: 300;
  line-height: 1.1;
  color: var(--ink);
  letter-spacing: -0.03em;
}
\.pf-l2 {
  font-family: 'Fraunces', serif;
  font-size: clamp(24px, 3.5vw, 48px);
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
\.pf-kinetic {
  display: inline-block;
  animation: nervous 2s infinite ease-in-out;
  border-bottom: 2px solid var(--saffron);
}
\.pf-l3 {
  font-family: 'Fraunces', serif;
  font-size: clamp(16px, 2vw, 22px);
  font-style: italic;
  font-weight: 400;
  color: rgba(12,16,32,0.9);
  line-height: 1.5;
  margin-left: 20px;
}
\.pf-l5 {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(12,16,32,0.5);
  margin-top: 16px;
}

\.pf-right {
  flex: 0 0 clamp(240px, 25vw, 320px);
  display: flex;
  justify-content: center;
}
\.pf-badge {
  background: var(--ink);
  color: var(--linen);
  padding: clamp(24px, 3vw, 40px) clamp(24px, 2.5vw, 32px);
  border-radius: 4px;
  position: relative;
  box-shadow: 0 32px 64px -16px rgba(12,16,32,0.3);
  transform: rotate(2deg);
  transition: transform 0.5s var(--expo);
}
\.pf-badge:hover {
  transform: rotate(0deg) scale(1.02);
}
\.pf-badge::before {
  content: ''; position: absolute; top: -12px; left: 50%; transform: translateX(-50%) rotate(-3deg);
  width: 60px; height: 24px; background: rgba(251,247,235,0.9); box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
\.pf-l4 {
  font-family: 'Fraunces', serif;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.4;
  font-style: italic;
}
\.pf-l4 strong {
  font-style: normal;
  font-size: clamp(20px, 1.8vw, 24px);
  color: var(--saffron);
  display: block;
  margin-bottom: 12px;
}"""

# Fix backslashes for exact string replacement
new_css = new_css.replace('\\.', '.')

old_html = r'<div class="plan-founder">\s*<p class="founder-beat">He was four.*?<span class="micro-copy">No credit card for first plan\.</span></div>\s*</div>'

new_html = """<div class="plan-founder">
      <div class="pf-left">
        <h2 class="pf-villain">The Villain Story.</h2>
        <div class="pf-content">
          <div class="pf-l1">He was four.<br>He was reading.</div>
          <div class="pf-l2">But he couldn't <span class="pf-kinetic">sit still</span> for thirty minutes.</div>
          <div class="pf-l3">— And the school said the children they accept do.</div>
          <div class="pf-l5">That single rejection launched four years of intense research.</div>

        </div>
      </div>
      <div class="pf-right">
        <div class="pf-badge">
          <div class="pf-l4">
            <strong>Wizkoo is what four years of it built.</strong>
            A PreK-5 mastery framework wrapped in a week that moves the way kids actually move.
          </div>
        </div>
      </div>
    </div>"""

import re
if re.search(old_css, content):
    content = re.sub(old_css, new_css, content)
    print("CSS replaced!")
else:
    print("Could not find old CSS")

if re.search(old_html, content, flags=re.DOTALL):
    content = re.sub(old_html, new_html, content, flags=re.DOTALL)
    print("HTML replaced!")
else:
    print("Could not find old HTML")

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
