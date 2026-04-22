import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', encoding='utf-8') as f:
    src = f.read()

# ── Step 1: Replace rotating-placeholder preamble with minimal var declaration ──
OLD_PREAMBLE = (
    "(function(){\n"
    "  var tier1=['Dinosaurs','LEGO','Horses','Space','Dragons','Minecraft','Superheroes','Unicorns','Pokemon','Cooking'];\n"
    "  var tier2=['Trucks','Trains','Sharks','Mermaids','Ocean','Volcanoes','Fairies','Butterflies','Knights','Pirates','Robots','Baking','Music','Drawing','Dance','Soccer','Sports','Coding','Writing','Mythology','Planets','Weather','Rainbows','Nature','Bugs','Farm','Dogs','Dolphins','Magic','Photography'];\n"
)
CONTENT_MOD_MARKER = "  /* \u2500\u2500 Content moderation \u2014 Layer 1 client-side blocklist \u2500\u2500 */"

preamble_start = src.find(OLD_PREAMBLE)
assert preamble_start != -1, 'OLD_PREAMBLE not found'

mod_marker_pos = src.find(CONTENT_MOD_MARKER, preamble_start)
assert mod_marker_pos != -1, 'CONTENT_MOD_MARKER not found'

NEW_PREAMBLE = (
    "(function(){\n"
    "  var input=document.getElementById('nh-theme');\n"
    "  if(!input) return;\n\n"
)

src = src[:preamble_start] + NEW_PREAMBLE + src[mod_marker_pos:]

# ── Step 2: Remove suggestEl var declaration ──
OLD_SUGGEST_VAR = "  var suggestEl=document.getElementById('theme-suggest');\n\n"
src = src.replace(OLD_SUGGEST_VAR, '', 1)

# ── Step 3: Remove suggestEl listener block ──
OLD_SUGGEST_BLOCK = (
    '  /* "See suggestions" \u2014 fills a random Tier 1 word */\n'
    "  if(suggestEl){\n"
    "    suggestEl.addEventListener('click',function(e){\n"
    "      e.preventDefault();\n"
    "      var pick=tier1[Math.floor(Math.random()*tier1.length)];\n"
    "      input.value=pick;\n"
    "      input.dispatchEvent(new Event('input',{bubbles:true}));\n"
    "      hideThemeError();\n"
    "    });\n"
    "  }\n\n"
)
src = src.replace(OLD_SUGGEST_BLOCK, '', 1)

# ── Step 4: Fix blocked-theme branch — remove V13-only calls ──
OLD_BLOCKED = (
    "        input.value='';\n"
    "        input.style.width='';\n"
    "        input.classList.add('ph-overlay');\n"
    "        showOverlay();\n"
    "        startRotation();\n"
    "        return;"
)
NEW_BLOCKED = (
    "        input.value='';\n"
    "        return;"
)
count = src.count(OLD_BLOCKED)
assert count == 1, f'Expected 1 occurrence of OLD_BLOCKED, found {count}'
src = src.replace(OLD_BLOCKED, NEW_BLOCKED, 1)

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', 'w', encoding='utf-8') as f:
    f.write(src)

print('IIFE-theme step done. File now', len(src.splitlines()), 'lines')
