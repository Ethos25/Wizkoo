import re

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Using regex DOTALL to match across newlines
pattern = re.compile(r'<div class="plan-founder">.*?</div>\s*</div>\s*</div>', re.DOTALL)

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

# Replace ONLY the very first match which is our block
if pattern.search(content):
    content = pattern.sub(new_html, content, count=1)
    print("HTML replaced successfully.")
else:
    print("Could not find HTML.")

with open('C:\\Users\\amyog\\Desktop\\Wizkoo\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
