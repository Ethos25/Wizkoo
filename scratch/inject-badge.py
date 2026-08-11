import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSS
old_css_pattern = re.compile(r'\.plan-founder \{.*?(?=\.ec-section|\.founder-content)', re.DOTALL)

new_css = """.plan-founder {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  align-items: center;
  max-width: 1100px;
  width: 100%;
  margin: clamp(30px, 4vh, 60px) auto 0;
  box-sizing: border-box;
}
.pf-left {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
  flex: 1;
  align-items: flex-end;
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
.pf-l3 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(14px, 1.5vw, 18px);
  color: #666;
  line-height: 1.4;
}
.pf-right {
  display: flex;
  justify-content: flex-end;
  flex: 0.8;
}
.pf-badge {
  background: var(--ink);
  color: #FFF;
  padding: clamp(24px, 3vw, 40px);
  border-radius: 12px;
  max-width: 320px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
.pf-l4 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(13px, 1.2vw, 15px);
  line-height: 1.5;
  opacity: 0.9;
}
.pf-l4 strong {
  display: block;
  font-size: clamp(16px, 1.5vw, 20px);
  margin-bottom: 12px;
  color: var(--saffron);
}
.pf-kinetic {
  display: inline-block;
  animation: nervous 0.1s infinite;
}
@keyframes nervous {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, 1px) rotate(0.5deg); }
  50% { transform: translate(-1px, -1px) rotate(-0.5deg); }
  75% { transform: translate(-1px, 1px) rotate(0.5deg); }
  100% { transform: translate(1px, -1px) rotate(-0.5deg); }
}
"""

# HTML Replacement
old_html_pattern = re.compile(r'<div class="plan-founder">.*?</div>\s*</div>\s*</div>\s*</div>', re.DOTALL)

new_html = """<div class="plan-founder">
      <div class="pf-left">
        <h2 class="pf-villain">The Villain Story.</h2>
        <div class="pf-content">
          <div class="pf-l1">He was four.<br>He was reading.</div>
          <div class="pf-l2">But he couldn't <span class="pf-kinetic">sit still</span> for thirty minutes.</div>
          <div class="pf-l3">
            — And the school said the children they accept do.<br><br>
            That single rejection launched four years of intense research.
          </div>
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
    </div>
"""

def inject():
    global content
    
    # 1. Replace CSS
    css_match = old_css_pattern.search(content)
    if css_match:
        content = content[:css_match.start()] + new_css + content[css_match.end():]
        print("CSS Replaced.")
    else:
        print("CSS NOT FOUND")
        
    # 2. Replace HTML
    # We need to make sure we don't accidentally match the wrong div
    html_match = old_html_pattern.search(content)
    if html_match:
        content = content[:html_match.start()] + new_html + content[html_match.end():]
        print("HTML Replaced.")
    else:
        print("HTML NOT FOUND")

inject()

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
