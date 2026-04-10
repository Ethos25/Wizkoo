#!/usr/bin/env python3
"""
Generator for Wizkoo 44 remaining ESA state pages.
Produces esa/[slug]/index.html for each state.
"""

import os

BASE = os.path.join(os.path.dirname(__file__), '..')

# ─── SHARED HTML FRAGMENTS ──────────────────────────────────────────────────

HEAD_CSS = """<style>
:root{--saffron:#E8AF38;--ink:#0C1020;--paper:#FAFAFA;--linen:#F2F0EA;--warm:#ECEAE3;--rule:#E0DED6;--mid:#4A4850;--expo:cubic-bezier(0.16,1,0.3,1)}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--linen);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
@media(hover:hover){html,body,a,button{cursor:none}}
.cursor{position:fixed;width:8px;height:8px;border-radius:50%;background:var(--saffron);pointer-events:none;z-index:9999;transition:width .25s var(--expo),height .25s var(--expo),margin .25s var(--expo),opacity .2s;opacity:0;mix-blend-mode:exclusion}.cursor.visible{opacity:1}.cursor.hover{width:28px;height:28px;margin:-10px 0 0 -10px;background:rgba(232,175,56,.25);border:1.5px solid var(--saffron)}
.sr{opacity:0;transform:translateY(24px);transition:opacity 700ms var(--expo),transform 700ms var(--expo)}.sr.v{opacity:1;transform:translateY(0)}
.sr-btn{opacity:0;transition:opacity 600ms ease}.sr-btn.v{opacity:1}
.back-bar{background:var(--linen);padding:clamp(80px,12vh,120px) clamp(20px,4vw,48px) 0;max-width:780px;margin:0 auto}
.back-link{font-family:'Space Mono',monospace;font-size:.5rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(12,16,32,.4);text-decoration:none;transition:color .2s}.back-link:hover{color:var(--saffron)}.back-link::before{content:'← '}
.hero{background:var(--linen);padding:clamp(28px,4vh,44px) clamp(20px,4vw,48px) clamp(48px,8vh,80px)}
.hero-inner{max-width:780px;margin:0 auto}
.hero-ey{font-family:'Space Mono',monospace;font-weight:400;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--saffron);margin-bottom:clamp(14px,2vh,20px);opacity:0;animation:fu .5s var(--expo) forwards .1s}
.hero-h{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.7rem,3.2vw,2.6rem);line-height:1.15;letter-spacing:-.03em;color:var(--ink);margin-bottom:clamp(14px,2vh,20px);opacity:0;animation:fu .5s var(--expo) forwards .25s}
.hero-sub{font-family:'Inter',sans-serif;font-size:clamp(.85rem,1vw,.92rem);line-height:1.7;color:rgba(12,16,32,.45);max-width:600px;opacity:0;animation:fu .5s var(--expo) forwards .4s}
.date-stamp{font-family:'Space Mono',monospace;font-size:.45rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(12,16,32,.28);margin-top:clamp(16px,2.5vh,24px);opacity:0;animation:fu .5s var(--expo) forwards .5s}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.sec{padding:clamp(48px,8vh,88px) clamp(20px,4vw,48px)}
.sec-linen{background:var(--linen)}
.sec-warm{background:var(--warm)}
.sec-warm::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(12,16,32,.005) 59px,rgba(12,16,32,.005) 60px);pointer-events:none}
.sec-inner{max-width:780px;margin:0 auto;position:relative;z-index:1}
.sec-ey{font-family:'Space Mono',monospace;font-weight:400;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--saffron);margin-bottom:clamp(10px,1.5vh,16px)}
.sec-h{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.1rem,1.6vw,1.4rem);line-height:1.3;letter-spacing:-.02em;color:var(--ink);margin-bottom:clamp(24px,3.5vh,36px)}
.callout{background:rgba(232,175,56,.06);border-left:3px solid rgba(232,175,56,.5);padding:clamp(16px,2.5vh,24px);margin-bottom:clamp(24px,3.5vh,36px)}
.callout-label{font-family:'Space Mono',monospace;font-size:.44rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(232,175,56,.8);margin-bottom:8px}
.callout-text{font-family:'Inter',sans-serif;font-size:clamp(.82rem,.94vw,.88rem);line-height:1.75;color:rgba(12,16,32,.65)}
.callout-text a{color:var(--saffron);text-decoration:none;border-bottom:1px solid rgba(232,175,56,.3)}.callout-text a:hover{border-color:var(--saffron)}
.ineligible-box{background:rgba(12,16,32,.03);border:1px solid var(--rule);border-left:3px solid rgba(12,16,32,.15);padding:clamp(16px,2.5vh,24px);margin-bottom:clamp(24px,3.5vh,36px)}
.ineligible-label{font-family:'Space Mono',monospace;font-size:.44rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(12,16,32,.35);margin-bottom:8px}
.ineligible-text{font-family:'Inter',sans-serif;font-size:clamp(.82rem,.94vw,.88rem);line-height:1.75;color:rgba(12,16,32,.65)}
.status-box{background:rgba(12,16,32,.03);border:1px solid var(--rule);padding:clamp(20px,3vh,32px);margin-bottom:clamp(28px,4vh,40px)}
.status-label{font-family:'Space Mono',monospace;font-size:.44rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(12,16,32,.3);margin-bottom:10px}
.status-text{font-family:'Inter',sans-serif;font-size:clamp(.85rem,1vw,.92rem);line-height:1.8;color:rgba(12,16,32,.6)}
.status-text a{color:var(--saffron);text-decoration:none;border-bottom:1px solid rgba(232,175,56,.3)}.status-text a:hover{border-color:var(--saffron)}
.prog-table{display:flex;flex-direction:column;gap:0;border:1px solid var(--rule)}
.prog-row{display:grid;grid-template-columns:clamp(160px,25vw,220px) 1fr;border-bottom:1px solid var(--rule)}
.prog-row:last-child{border-bottom:none}
.prog-label{font-family:'Space Mono',monospace;font-size:.48rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(12,16,32,.4);padding:clamp(12px,1.8vh,18px) clamp(16px,2vw,24px);background:rgba(12,16,32,.015);display:flex;align-items:flex-start;line-height:1.6}
.prog-value{font-family:'Inter',sans-serif;font-size:clamp(.82rem,.94vw,.88rem);line-height:1.75;color:rgba(12,16,32,.7);padding:clamp(12px,1.8vh,18px) clamp(16px,2vw,24px)}
.prog-value a{color:var(--saffron);text-decoration:none;border-bottom:1px solid rgba(232,175,56,.3);transition:border-color .2s}.prog-value a:hover{border-color:var(--saffron)}
.prog-value strong{color:var(--ink);font-weight:600}
.alt-list{display:flex;flex-direction:column;gap:clamp(16px,2.5vh,24px)}
.alt-item{padding-left:clamp(16px,2vw,24px);border-left:2px solid rgba(232,175,56,.2)}
.alt-name{font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(.88rem,1.02vw,.95rem);color:var(--ink);margin-bottom:4px;letter-spacing:-.01em}
.alt-desc{font-family:'Inter',sans-serif;font-size:clamp(.82rem,.94vw,.88rem);line-height:1.75;color:rgba(12,16,32,.5)}
.wiz-card{background:var(--paper);border:1.5px solid var(--ink);padding:clamp(24px,3.5vh,40px) clamp(20px,3vw,32px);position:relative;margin-top:clamp(20px,3vh,32px)}
.wiz-card::after{content:'';position:absolute;top:6px;left:6px;right:-6px;bottom:-6px;background:rgba(232,175,56,.08);z-index:-1;pointer-events:none}
.wiz-status{font-family:'Inter',sans-serif;font-size:clamp(.82rem,.94vw,.88rem);line-height:1.75;color:rgba(12,16,32,.55);padding:clamp(14px,2vh,20px);background:rgba(232,175,56,.04);border-left:2px solid rgba(232,175,56,.3)}
.wiz-status strong{color:var(--ink)}
.wiz-reimburse{font-family:'Inter',sans-serif;font-size:clamp(.78rem,.88vw,.84rem);line-height:1.75;color:rgba(12,16,32,.42);margin-top:clamp(14px,2vh,20px);font-style:italic}
.prose{font-family:'Inter',sans-serif;font-size:clamp(.85rem,1vw,.92rem);line-height:1.85;color:rgba(12,16,32,.6)}
.prose p{margin-bottom:1.1rem}.prose p:last-child{margin-bottom:0}
.prose strong{font-weight:600;color:rgba(12,16,32,.78)}
.faq-section{background:var(--linen);padding:clamp(56px,9vh,100px) clamp(20px,4vw,48px)}
.faq-inner{max-width:780px;margin:0 auto}
.faq-ey{font-family:'Space Mono',monospace;font-weight:400;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--mid);margin-bottom:clamp(24px,3.5vh,36px)}
.faq-item{border-bottom:1px solid var(--rule);padding:clamp(14px,2vh,20px) 0}
.faq-item:first-of-type{border-top:1px solid var(--rule)}
.faq-q{font-family:'Sora',sans-serif;font-weight:500;font-size:clamp(.86rem,1vw,.93rem);color:var(--ink);background:none;border:none;width:100%;text-align:left;padding:0;display:flex;align-items:center;justify-content:space-between;gap:16px;letter-spacing:-.01em;line-height:1.5}
@media(hover:hover){.faq-q{cursor:none}}
.faq-q::after{content:'+';font-family:'Sora',sans-serif;font-weight:200;font-size:1.2rem;color:var(--saffron);flex-shrink:0;transition:transform .3s var(--expo)}
.faq-q[aria-expanded="true"]::after{transform:rotate(45deg)}
.faq-a{font-family:'Inter',sans-serif;font-size:clamp(.8rem,.92vw,.86rem);line-height:1.8;color:rgba(12,16,32,.52);padding-top:clamp(8px,1.2vh,14px);max-width:92%}
.cta{background:var(--ink);padding:clamp(72px,12vh,140px) clamp(20px,4vw,48px);text-align:center;position:relative;overflow:hidden}
.cta::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(255,255,255,.012) 59px,rgba(255,255,255,.012) 60px);pointer-events:none}
.cta-glow{position:absolute;width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-45%);background:radial-gradient(circle,rgba(232,175,56,.04) 0%,transparent 55%);pointer-events:none}
.cta-h{font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(1.4rem,2.5vw,2rem);line-height:1.15;letter-spacing:-.03em;color:rgba(240,242,248,.92);margin-bottom:clamp(20px,3vh,32px);position:relative;z-index:1}
.cta-btn{display:inline-block;background:var(--saffron);color:var(--ink);font-family:'Sora',sans-serif;font-weight:600;font-size:.68rem;letter-spacing:.06em;padding:14px 44px;border:none;text-decoration:none;box-shadow:6px 6px 0 rgba(232,175,56,.3);transition:transform .3s var(--expo),box-shadow .3s var(--expo);position:relative;z-index:1}.cta-btn:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 rgba(232,175,56,.4)}
.cta-sub{font-family:'Space Mono',monospace;font-size:.48rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(240,242,248,.25);margin-top:clamp(14px,2vh,20px);position:relative;z-index:1}
.fnote{background:var(--ink);padding:0 clamp(20px,4vw,48px) 28px;text-align:center}
.fnote p{font-family:'Inter',sans-serif;font-size:clamp(.65rem,.75vw,.72rem);line-height:1.7;color:rgba(240,242,248,.38);max-width:680px;margin:0 auto;font-style:italic}
@media(max-width:768px){.back-bar,.hero,.sec,.faq-section,.cta,.fnote{padding-left:20px;padding-right:20px}.prog-row{grid-template-columns:1fr}.prog-label{padding-bottom:4px;border-bottom:none}}
@media(hover:none)and(pointer:coarse){.cursor{display:none!important}}
@media(prefers-reduced-motion:reduce){.hero-ey,.hero-h,.hero-sub,.date-stamp{opacity:1!important;animation:none!important}.sr,.sr-btn{opacity:1!important;transform:none!important;transition:none!important}}
</style>"""

SHARED_JS = """<script>
(function(){if(window.matchMedia('(prefers-reduced-motion:reduce)').matches)return;var e=document.querySelectorAll('.sr,.sr-btn');if(!e.length||!window.IntersectionObserver)return;var o=new IntersectionObserver(function(n){n.forEach(function(i){if(i.isIntersecting){i.target.classList.add('v');o.unobserve(i.target)}})},{threshold:.06,rootMargin:'0px 0px -15px 0px'});e.forEach(function(el){o.observe(el)})})();
document.querySelectorAll('.faq-q').forEach(function(btn){btn.addEventListener('click',function(){var a=btn.nextElementSibling;var open=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',!open);a.hidden=open})});
(function(){if(window.matchMedia('(hover:none)').matches)return;var c=document.getElementById('cursor');if(!c)return;var mx=0,my=0,cx=0,cy=0;document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!c.classList.contains('visible'))c.classList.add('visible')},{passive:true});(function l(){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;c.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(l)})();document.addEventListener('mouseover',function(e){if(e.target.closest('a,button'))c.classList.add('hover')},{passive:true});document.addEventListener('mouseout',function(e){if(e.target.closest('a,button'))c.classList.remove('hover')},{passive:true})})();
</script>"""

FOOTER_NOTE = """<div class="fnote">
  <p>This page is for informational purposes only and is not legal or financial advice. ESA program details, eligibility, and funding amounts change frequently. Always verify current information directly with your state's education department before making financial decisions. Last verified: April 2026.</p>
</div>"""

CTA_SECTION = """<section class="cta">
  <div class="cta-glow"></div>
  <h2 class="cta-h sr">Build My Family's Week</h2>
  <a href="/plan" class="cta-btn sr-btn" style="transition-delay:100ms" aria-label="Build My Family's Week">Build My Family's Week</a>
  <p class="cta-sub sr-btn" style="transition-delay:200ms">No credit card for first plan.</p>
</section>"""

def head(title, desc, slug, jsonld):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="https://wizkoo.com/esa/{slug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@200;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">
{jsonld}
</script>
{HEAD_CSS}
</head>
<body>
<div class="cursor" id="cursor"></div>
<div id="wizkoo-nav"></div>
<script src="/components/nav.js"></script>
<main>
<div class="back-bar">
  <a href="/esa" class="back-link">Back to ESA Guide</a>
</div>"""

def tail():
    return f"""
{CTA_SECTION}
{FOOTER_NOTE}
</main>
<div id="site-footer"></div>
<script src="/components/footer.js"></script>
{SHARED_JS}
</body>
</html>"""

def faq_section(q1, a1, q2, a2):
    return f"""<section class="faq-section">
  <div class="faq-inner">
    <div class="faq-ey sr">FAQ</div>
    <div class="faq-item sr" style="transition-delay:50ms">
      <button class="faq-q" aria-expanded="false">{q1}</button>
      <div class="faq-a" hidden>{a1}</div>
    </div>
    <div class="faq-item sr" style="transition-delay:100ms">
      <button class="faq-q" aria-expanded="false">{q2}</button>
      <div class="faq-a" hidden>{a2}</div>
    </div>
  </div>
</section>"""

def prog_row(label, value):
    return f"""      <div class="prog-row">
        <div class="prog-label">{label}</div>
        <div class="prog-value">{value}</div>
      </div>"""

def callout(label, text):
    return f"""    <div class="callout">
      <div class="callout-label">{label}</div>
      <div class="callout-text">{text}</div>
    </div>"""

def ineligible_box(label, text):
    return f"""    <div class="ineligible-box">
      <div class="ineligible-label">{label}</div>
      <div class="ineligible-text">{text}</div>
    </div>"""

def wiz_not_listed(platform, contact):
    return f"""    <div class="wiz-card">
      <div class="wiz-status"><strong>Wizkoo is not yet listed on {platform}.</strong> We're in the approval process and will update this page when approved.</div>
      <p class="wiz-reimburse">In the meantime, families in states that allow direct reimbursement for educational software subscriptions may be able to use ESA funds for Wizkoo by submitting a receipt. Check with {contact} before purchasing.</p>
    </div>"""

def wizkoo_no_esa_section(state, update_phrase="If {state} introduces an ESA program"):
    phrase = update_phrase.format(state=state)
    return f"""<section class="sec sec-linen">
  <div class="sec-inner sr">
    <div class="sec-ey">Wizkoo works without ESA</div>
    <div class="sec-h">You don't need an ESA to use Wizkoo.</div>
    <div class="prose">
      <p>Most homeschool families fund their curriculum through personal budgets, and Wizkoo is built to be worth it either way.</p>
      <p><strong>$50/month or $499/year.</strong> Every child in your family, one price. No per-child pricing. No vendor approval needed. No waiting.</p>
      <p>Your first plan is free, no credit card required.</p>
      <p>{phrase}, we'll update this page immediately.</p>
    </div>
  </div>
</section>"""

def make_jsonld(q1, a1, q2, a2):
    import json
    d = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":q1,"acceptedAnswer":{"@type":"Answer","text":a1}},
        {"@type":"Question","name":q2,"acceptedAnswer":{"@type":"Answer","text":a2}}
    ]}
    return json.dumps(d)

# ─── TEMPLATE 1: ACTIVE ESA, HOMESCHOOL ELIGIBLE ────────────────────────────

def build_t1(state, slug, title, meta_desc, hero_sub, program_name, esa_amount_label,
             esa_amount_val, platform, eligibility, app_info, participants, launched,
             wizkoo_section_h, wizkoo_intro_extra, platform_contact,
             rows_extra=None, callout_html=None,
             faq_q1=None, faq_a1=None, faq_q2=None, faq_a2=None):

    fq1 = faq_q1 or f"How much is the {state} ESA for homeschool families?"
    fa1 = faq_a1 or f"{state}'s {program_name} provides {esa_amount_val} for homeschool families."
    fq2 = faq_q2 or f"Can I use my {state} ESA for Wizkoo?"
    fa2 = faq_a2 or f"Wizkoo is not yet listed on {platform}. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo as an educational software subscription. Check with {platform_contact} before purchasing."

    jsonld = make_jsonld(fq1, fa1, fq2, fa2)

    rows = [prog_row("Program Name", program_name)]
    rows.append(prog_row(esa_amount_label, esa_amount_val))
    if rows_extra:
        for r in rows_extra:
            rows.append(prog_row(r[0], r[1]))
    rows.append(prog_row("Marketplace Platform", f"<strong>{platform}.</strong> You browse approved vendors and purchase directly using your ESA funds through {platform}."))
    rows.append(prog_row("Eligibility", eligibility))
    rows.append(prog_row("Application", app_info))
    rows.append(prog_row("Participating Students", participants))
    rows.append(prog_row("Program Launched", launched))

    html = head(title, meta_desc, slug, jsonld)
    html += f"""
<section class="hero">
  <div class="hero-inner">
    <div class="hero-ey">ESA in {state}</div>
    <h1 class="hero-h">{state} families can use ESA funds for homeschool curriculum.</h1>
    <p class="hero-sub">{hero_sub}</p>
    <p class="date-stamp">As of April 2026</p>
  </div>
</section>

<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">Program details</div>
    <div class="sec-h">{state}'s {program_name}</div>
"""
    if callout_html:
        html += callout_html
    html += f"""    <div class="prog-table">
{chr(10).join(rows)}
    </div>
  </div>
</section>

<section class="sec sec-linen">
  <div class="sec-inner sr">
    <div class="sec-ey">Using your {state} ESA for Wizkoo</div>
    <div class="sec-h">{wizkoo_section_h}</div>
    <p style="font-family:'Inter',sans-serif;font-size:clamp(.85rem,1vw,.92rem);line-height:1.85;color:rgba(12,16,32,.6);margin-bottom:clamp(16px,2.5vh,24px)">Wizkoo is a personalized weekly learning platform for families with children ages 2 to 12. One theme connects every subject. Every child at the table gets a plan matched to their age and reading level.</p>
    <p style="font-family:'Inter',sans-serif;font-size:clamp(.85rem,1vw,.92rem);line-height:1.85;color:rgba(12,16,32,.6);margin-bottom:0">{wizkoo_intro_extra}</p>
{wiz_not_listed(platform, platform_contact)}
  </div>
</section>

{faq_section(fq1, fa1, fq2, fa2)}
"""
    html += tail()
    return html

# ─── TEMPLATE 2: ACTIVE ESA, HOMESCHOOL NOT ELIGIBLE ─────────────────────────

def build_t2(state, slug, title, meta_desc, hero_sub, program_name,
             esa_amount, eligibility_detail, app_info, participants, launched,
             ineligible_text, platform,
             faq_q1=None, faq_a1=None, faq_q2=None, faq_a2=None,
             callout_html=None, rows_extra=None):

    fq1 = faq_q1 or f"Does {state} have an ESA program for homeschool families?"
    fa1 = faq_a1 or f"{state} has an ESA program ({program_name}), but it currently does not cover homeschool families. {eligibility_detail}"
    fq2 = faq_q2 or f"How do homeschool families in {state} pay for curriculum?"
    fa2 = faq_a2 or f"Most homeschool families in {state} fund curriculum through personal budgets. Wizkoo is $50/month or $499/year for your whole family, no ESA required."

    jsonld = make_jsonld(fq1, fa1, fq2, fa2)

    html = head(title, meta_desc, slug, jsonld)
    html += f"""
<section class="hero">
  <div class="hero-inner">
    <div class="hero-ey">ESA in {state}</div>
    <h1 class="hero-h">{state} has an ESA program, but it doesn't cover homeschool families.</h1>
    <p class="hero-sub">{hero_sub}</p>
    <p class="date-stamp">As of April 2026</p>
  </div>
</section>

<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What {state} offers</div>
    <div class="sec-h">{program_name}</div>
"""
    if callout_html:
        html += callout_html
    else:
        html += ineligible_box("Homeschool families are not eligible", ineligible_text)

    rows = [prog_row("Program Name", program_name)]
    rows.append(prog_row("ESA Amount", esa_amount))
    rows.append(prog_row("Eligibility", eligibility_detail))
    rows.append(prog_row("Application", app_info))
    rows.append(prog_row("Participating Students", participants))
    rows.append(prog_row("Program Launched", launched))
    if rows_extra:
        for r in rows_extra:
            rows.append(prog_row(r[0], r[1]))

    html += f"""    <div class="prog-table">
{chr(10).join(rows)}
    </div>
  </div>
</section>

{wizkoo_no_esa_section(state, "If {state} expands ESA eligibility to include homeschool families")}

{faq_section(fq1, fa1, fq2, fa2)}
"""
    html += tail()
    return html

# ─── TEMPLATE 3: NO ESA ───────────────────────────────────────────────────────

def build_t3(state, slug, title, meta_desc, hero_sub, doe_url,
             alt_section_html=None,
             faq_q1=None, faq_a1=None, faq_q2=None, faq_a2=None,
             update_phrase=None):

    fq1 = faq_q1 or f"Does {state} have an ESA program?"
    fa1 = faq_a1 or f"No. {state} does not currently have an Education Savings Account program. Several states add new ESA programs each year. We monitor {state}'s legislature and will update this page if that changes."
    fq2 = faq_q2 or f"How do homeschool families in {state} pay for curriculum?"
    fa2 = faq_a2 or f"Most homeschool families in {state} fund curriculum through personal budgets. Wizkoo is $50/month or $499/year for your whole family, no ESA required."

    jsonld = make_jsonld(fq1, fa1, fq2, fa2)
    up = update_phrase or "If {state} introduces an ESA program"

    html = head(title, meta_desc, slug, jsonld)
    html += f"""
<section class="hero">
  <div class="hero-inner">
    <div class="hero-ey">ESA in {state}</div>
    <h1 class="hero-h">{state} does not currently have an ESA program.</h1>
    <p class="hero-sub">{hero_sub}</p>
    <p class="date-stamp">As of April 2026</p>
  </div>
</section>
"""
    if alt_section_html:
        html += alt_section_html

    html += wizkoo_no_esa_section(state, up)
    html += "\n"
    html += faq_section(fq1, fa1, fq2, fa2)
    html += tail()
    return html

# ─── STATE DEFINITIONS ────────────────────────────────────────────────────────

pages = {}

# ── TEMPLATE 1 STATES ──

# ALABAMA
pages['alabama'] = build_t1(
    state="Alabama", slug="alabama",
    title="Alabama ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Alabama ESA guide for homeschool families. CHOOSE Act ESA, $2,000/year for homeschool families. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="Alabama now funds homeschool families through the CHOOSE Act ESA. Wizkoo at $499/year fits within your ESA, with room left over for books, supplies, and more.",
    program_name="CHOOSE Act ESA",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$2,000/student/year</strong> ($4,000 family cap)",
    platform="ClassWallet",
    eligibility="<strong>Income-based.</strong> At or below 300% of the federal poverty level through 2026-27; expanding to universal eligibility in 2027-28.",
    app_info='2026-27 window closed March 31, 2026. <a href="https://chooseact.alabama.gov/" target="_blank" rel="noopener">chooseact.alabama.gov</a>',
    participants="~19,000 actively using (April 2026); 23,576 awards issued",
    launched="2025",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Alabama's CHOOSE Act ESA funding for homeschool families.",
    platform_contact="the Alabama Department of Revenue",
    rows_extra=[
        ("ESA Amount (Private School)", "$7,000/student/year"),
        ("Additional Notes", "First 500 ESA slots each year are reserved for students with special needs."),
    ],
    faq_a1="Alabama's CHOOSE Act ESA provides $2,000/year per student for homeschool families (with a $4,000 family cap) and $7,000/year for private school students. Income eligibility is at or below 300% FPL through 2026-27, expanding to universal in 2027-28.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the Alabama Department of Revenue before purchasing.",
)

# LOUISIANA
pages['louisiana'] = build_t1(
    state="Louisiana", slug="louisiana",
    title="Louisiana ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Louisiana ESA guide for homeschool families. LA GATOR Scholarship, $5,243–$7,626/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At $5,243–$7,626/year, your ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="LA GATOR Scholarship",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$5,243–$7,626/year per student</strong> (tiered by income)",
    platform="Odyssey",
    eligibility="<strong>Income-based, phasing to universal.</strong> At or below 250% FPL in 2025-26; at or below 400% FPL in 2026-27; universal thereafter.",
    app_info='<a href="https://www.louisianabelieves.com/" target="_blank" rel="noopener">louisianabelieves.com</a>',
    participants="~6,000 (estimated)",
    launched="2025",
    wizkoo_section_h="One line item in your Odyssey account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Louisiana's ESA funding for homeschool families.",
    platform_contact="the Louisiana Department of Education",
    callout_html=callout("Verify with Louisiana DOE",
        'The LA GATOR Scholarship is a new program (2025). Program details on this page are sourced from EdChoice and are still being independently verified. Confirm current eligibility requirements, funding amounts, and application status directly with the <a href="https://www.louisianabelieves.com/" target="_blank" rel="noopener">Louisiana Department of Education</a> before making decisions.'),
    faq_a1="Louisiana's LA GATOR Scholarship provides $5,243–$7,626/year per student (tiered by income). The program is phasing to universal eligibility: at or below 250% FPL in 2025-26, at or below 400% FPL in 2026-27, and universal thereafter. Data is being independently verified — confirm current amounts with the Louisiana DOE.",
    faq_a2="Wizkoo is not yet listed on Odyssey. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the Louisiana Department of Education before purchasing.",
)

# INDIANA
pages['indiana'] = build_t1(
    state="Indiana", slug="indiana",
    title="Indiana ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Indiana ESA guide for homeschool families. INESA program for students with disabilities and their siblings. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="Indiana's INESA provides up to $20,000/year for students with disabilities. Wizkoo is $499/year — one line item in your ClassWallet account.",
    program_name="Indiana Education Scholarship Account (INESA)",
    esa_amount_label="ESA Amount",
    esa_amount_val="<strong>Up to $20,000/year</strong> for students with disabilities (100% of state special ed funding); up to $8,000/year for eligible siblings",
    platform="ClassWallet",
    eligibility="<strong>Disability-targeted.</strong> Requires an active IEP. Siblings of qualifying students are also eligible. Income at or below 400% of free and reduced lunch threshold (~$238K for a family of four). Not a universal program.",
    app_info='2026-27 applications open March 1 through September 1, 2026; priority deadline April 15. <a href="https://www.in.gov/tos/inesa/" target="_blank" rel="noopener">in.gov/tos/inesa</a>',
    participants="1,018 (2024-25: 862 students with disabilities + 156 siblings)",
    launched="2022",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Indiana's INESA funding.",
    platform_contact="the Indiana Treasurer of State (transitioning to IDOE July 1, 2026)",
    callout_html=callout("Eligibility note",
        "INESA is targeted to students with an active IEP and their siblings — it is not a universal program. Indiana's separate Choice Scholarship voucher serves 79,000+ students but covers private school tuition only. The INESA is transitioning from the Treasurer's office to the Indiana Department of Education (IDOE) on July 1, 2026."),
    faq_a1="Indiana's INESA provides up to $20,000/year for students with disabilities and up to $8,000/year for eligible siblings. Eligibility requires an active IEP and household income at or below 400% of the free and reduced lunch threshold. The program is small — approximately 1,000 students — and has hit its $10M annual cap in recent cycles.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the Indiana Treasurer of State (or IDOE after July 1, 2026) before purchasing.",
)

# ARKANSAS
pages['arkansas'] = build_t1(
    state="Arkansas", slug="arkansas",
    title="Arkansas ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Arkansas ESA guide for homeschool families. Education Freedom Account (LEARNS Act), $6,864/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At $6,864/year, your ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Education Freedom Account (LEARNS Act)",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$6,864/year per student</strong>",
    platform="ClassWallet",
    eligibility="<strong>Universal</strong> as of 2025-26 (phased in from 2023). No income limits, no enrollment caps.",
    app_info='2026-27 open March 9 – June 1, 2026 (four priority windows). <a href="https://dese.ade.arkansas.gov/offices/office-of-school-choice-and-parent-empowerment/education-freedom-accounts" target="_blank" rel="noopener">dese.ade.arkansas.gov</a>',
    participants="~46,578 active (2025-26)",
    launched="2023",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Arkansas's ESA funding for homeschool families.",
    platform_contact="the Arkansas Department of Education",
    faq_a1="Arkansas's Education Freedom Account (LEARNS Act) provides $6,864/year per student. The program is universal as of 2025-26 — no income limits, no enrollment caps.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the Arkansas Department of Education before purchasing.",
)

# UTAH
pages['utah'] = build_t1(
    state="Utah", slug="utah",
    title="Utah ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Utah ESA guide for homeschool families. Utah Fits All Scholarship, $4,000–$6,000/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At $4,000–$6,000/year, your Utah Fits All Scholarship covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Utah Fits All Scholarship (UFA)",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$4,000/year</strong> (ages 5–12) · <strong>$6,000/year</strong> (ages 13–18)",
    platform="Odyssey",
    eligibility="<strong>Universal</strong>, but funding-capped. Priority order: prior recipients, at or below 200% FPL, siblings, 200–555% FPL, then open lottery.",
    app_info='New students: April 1 – May 1, 2026. <a href="https://schools.utah.gov/utahfitsallscholarship" target="_blank" rel="noopener">schools.utah.gov/utahfitsallscholarship</a>',
    participants="~16,000 (2025-26)",
    launched="2024",
    wizkoo_section_h="One line item in your Odyssey account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Utah's scholarship funding for homeschool families.",
    platform_contact="the Utah State Board of Education",
    callout_html=callout("Legal challenge — program continues while appeal proceeds",
        "Utah's Fits All Scholarship was ruled unconstitutional by a district court in April 2025. The state is appealing to the Utah Supreme Court. The program continues to operate for current participants while the appeal is pending. Check <a href=\"https://schools.utah.gov/utahfitsallscholarship\" target=\"_blank\" rel=\"noopener\">schools.utah.gov</a> for the latest status before applying."),
    rows_extra=[("ESA Amount (Private School)", "$8,000/year")],
    faq_a1="Utah's Fits All Scholarship provides $4,000/year for students ages 5–12 and $6,000/year for students ages 13–18. The program is universal but funding-capped with a priority enrollment order. Note: the program was ruled unconstitutional in April 2025 and continues operating while a Utah Supreme Court appeal is pending.",
    faq_a2="Wizkoo is not yet listed on Odyssey. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the Utah State Board of Education before purchasing.",
)

# SOUTH CAROLINA
pages['south-carolina'] = build_t1(
    state="South Carolina", slug="south-carolina",
    title="South Carolina ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="South Carolina ESA guide for homeschool families. Education Scholarship Trust Fund (ESTF), $7,500/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At $7,500/year, your ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Education Scholarship Trust Fund (ESTF)",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$7,500/year per student</strong> (2025-26); projected $7,634 (2026-27)",
    platform="ClassWallet",
    eligibility="<strong>Income-based.</strong> At or below 300% FPL in 2025-26; expanding to at or below 500% FPL in 2026-27. Priority for prior participants, military families, and students switching from public school.",
    app_info='2025-26 cap of 10,000 reached February 2026. 2026-27 renewals open. <a href="https://ed.sc.gov/newsroom/strategic-engagement/education-scholarship-trust-fund-program/" target="_blank" rel="noopener">ed.sc.gov</a>',
    participants="10,000 (statutory cap reached February 2026)",
    launched="2024",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within South Carolina's ESTF funding for homeschool families.",
    platform_contact="the South Carolina Department of Education",
    faq_a1="South Carolina's Education Scholarship Trust Fund provides $7,500/year per student (2025-26), expanding to a projected $7,634 in 2026-27. Eligibility is income-based at or below 300% FPL in 2025-26, expanding to 500% FPL in 2026-27. The program hit its 10,000-student cap in February 2026.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the South Carolina Department of Education before purchasing.",
)

# WEST VIRGINIA
pages['west-virginia'] = build_t1(
    state="West Virginia", slug="west-virginia",
    title="West Virginia ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="West Virginia ESA guide for homeschool families. Hope Scholarship Program, $5,267/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At $5,267/year, your ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Hope Scholarship Program",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$5,267.38/year per student</strong> (2025-26); projected $5,435.62 (2026-27)",
    platform="State-specific (TheoPay)",
    eligibility="<strong>Nearly universal.</strong> 2025-26 requires 45-day public school attendance or incoming kindergartner. Fully universal beginning July 1, 2026.",
    app_info='Rolling. Funding is prorated by enrollment date: 100% March–June 15; 75% June–September; 50% September–November; 25% December–February. <a href="https://hopescholarshipwv.gov/" target="_blank" rel="noopener">hopescholarshipwv.gov</a>',
    participants="~14,600 (2025-26)",
    launched="2022-23",
    wizkoo_section_h="One line item in your TheoPay account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within West Virginia's Hope Scholarship funding for homeschool families.",
    platform_contact="the West Virginia State Treasurer's Office",
    faq_a1="West Virginia's Hope Scholarship provides $5,267/year per student (2025-26), with a projected increase to $5,435 in 2026-27. The program requires 45 days of public school attendance or incoming kindergarten status in 2025-26, then becomes fully universal on July 1, 2026. Funds are prorated based on when you enroll.",
    faq_a2="Wizkoo is not yet listed on TheoPay (West Virginia's state-specific platform). We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the West Virginia Treasurer's Office before purchasing.",
)

# MISSOURI
pages['missouri'] = build_t1(
    state="Missouri", slug="missouri",
    title="Missouri ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Missouri ESA guide for homeschool families. MOScholars Empowerment Scholarship Accounts, ~$4,000–$5,000/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At ~$4,000–$5,000/year, your MOScholars ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="MOScholars Empowerment Scholarship Accounts",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>~$4,000–$5,000/year per student</strong> (approximately 50% of per-pupil spending)",
    platform="State-specific",
    eligibility="<strong>Income-limited and special needs.</strong> This is a tax-credit ESA funded through private donations to Educational Assistance Organizations.",
    app_info='<a href="https://dese.mo.gov/" target="_blank" rel="noopener">dese.mo.gov</a>',
    participants="Not confirmed",
    launched="2021",
    wizkoo_section_h="One line item in your MOScholars account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Missouri's MOScholars ESA funding.",
    platform_contact="your Educational Assistance Organization",
    callout_html=callout("Verify with Missouri DOE",
        'MOScholars is a tax-credit ESA — it is funded through private donations to Educational Assistance Organizations rather than directly from state appropriations. Program details on this page are sourced from EdChoice and are still being independently verified. Confirm current eligibility, amounts, and application process with the <a href="https://dese.mo.gov/" target="_blank" rel="noopener">Missouri Department of Elementary and Secondary Education</a>.'),
    faq_a1="Missouri's MOScholars program provides approximately $4,000–$5,000/year per student. MOScholars is a tax-credit ESA funded through private donations to Educational Assistance Organizations, not a direct state appropriation. Eligibility is limited to income-qualifying families and students with special needs. Data is being independently verified.",
    faq_a2="Wizkoo is not yet listed with Missouri's ESA providers. We're working on it. Check with your Educational Assistance Organization about approved expenses before purchasing.",
)

# NORTH CAROLINA
pages['north-carolina'] = build_t1(
    state="North Carolina", slug="north-carolina",
    title="North Carolina ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="North Carolina ESA guide for homeschool families. Education Student Accounts (ESA+), $9,000/year for students with disabilities. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="North Carolina's ESA+ provides $9,000/year (up to $17,000 for high-need disabilities) for students with an eligibility determination. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Education Student Accounts (ESA+)",
    esa_amount_label="ESA Amount",
    esa_amount_val="<strong>$9,000/year base award</strong> per student; up to $17,000 for students with high-need disabilities",
    platform="ClassWallet",
    eligibility="<strong>Disability-targeted.</strong> Requires an Eligibility Determination from a North Carolina public school within the past 3 years. No income cap.",
    app_info='Priority window February 2 – March 2; lottery in April. 2026-27 cycle closed. <a href="https://k12.ncseaa.edu/the-education-student-accounts/" target="_blank" rel="noopener">k12.ncseaa.edu</a>',
    participants="~5,500 (fall 2025)",
    launched="2022-23",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within North Carolina's ESA+ funding.",
    platform_contact="the NC State Education Assistance Authority (NCSEAA)",
    callout_html=callout("Eligibility note — disability determination required",
        "North Carolina's ESA+ is specifically for students with disabilities who have received an Eligibility Determination from a NC public school within the past 3 years. North Carolina's separate Opportunity Scholarship voucher serves 103,000+ students but covers private school tuition only and is not available for homeschool families."),
    faq_a1="North Carolina's ESA+ provides a $9,000 base award per year for students with disabilities (up to $17,000 for high-need cases). To qualify, students must have an Eligibility Determination from a North Carolina public school within the past 3 years. There is no income cap.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with NCSEAA before purchasing.",
)

# NEW HAMPSHIRE
pages['new-hampshire'] = build_t1(
    state="New Hampshire", slug="new-hampshire",
    title="New Hampshire ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="New Hampshire ESA guide for homeschool families. Education Freedom Accounts (EFA), ~$4,265/year. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="At ~$4,265/year, your ESA covers curriculum, tutoring, testing, and more. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Education Freedom Accounts (EFA)",
    esa_amount_label="ESA Amount (Homeschool)",
    esa_amount_val="<strong>$4,265.64 base/year per student</strong> (2025-26); average ~$4,909 including supplemental aid",
    platform="ClassWallet",
    eligibility="<strong>Universal</strong> since June 2025 (SB 295). Priority enrollment exempt from cap: current EFA students, siblings, students with disabilities, and families at or below 350% FPL. Non-priority cap: 10,000 (with 25% annual escalator).",
    app_info='Rolling — open year-round for 2026-27. <a href="https://www.education.nh.gov/pathways-education/education-freedom-accounts" target="_blank" rel="noopener">education.nh.gov</a>',
    participants="10,510 (October 2025)",
    launched="2021-22 (universal since 2025)",
    wizkoo_section_h="One line item in your ClassWallet account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within New Hampshire's EFA funding for homeschool families.",
    platform_contact="the New Hampshire Department of Education",
    rows_extra=[("Additional Funding", "+$2,142 for special education; +$2,346 for free/reduced-price lunch eligible students")],
    faq_a1="New Hampshire's Education Freedom Accounts provide a base of $4,265.64/year per student (2025-26), with average disbursements around $4,909 including supplemental aid for special education and income-eligible families. The program became universal in June 2025 with a priority enrollment structure.",
    faq_a2="Wizkoo is not yet listed on ClassWallet. We're working on it. Families in states that allow direct reimbursement for educational software may be able to submit a receipt for Wizkoo. Check with the New Hampshire Department of Education before purchasing.",
)

# MISSISSIPPI
pages['mississippi'] = build_t1(
    state="Mississippi", slug="mississippi",
    title="Mississippi ESA Guide for Homeschool Families | Wizkoo",
    meta_desc="Mississippi ESA guide for homeschool families. Equal Opportunity for Students with Special Needs ESA, ~$7,089/year for students with disabilities. Learn how to use your ESA for curriculum like Wizkoo.",
    hero_sub="Mississippi's ESA program provides ~$7,089/year for students with disabilities who withdraw from public school. Wizkoo is $499/year — one line item, not the whole budget.",
    program_name="Equal Opportunity for Students with Special Needs (ESA)",
    esa_amount_label="ESA Amount",
    esa_amount_val="<strong>~$7,089/year per student</strong> (FY2024 rate; FY2026 amount not yet published)",
    platform="State-specific (reimbursement-based)",
    eligibility="<strong>Disability-only.</strong> Requires an active IEP from within the past 3 years. Student must withdraw from public school. Rolling enrollment with a 500-student-per-year cap.",
    app_info='Rolling year-round. <a href="https://mdek12.org/specialeducation/esa/" target="_blank" rel="noopener">mdek12.org/specialeducation/esa</a>',
    participants="~345 active (2024-25)",
    launched="2015-16",
    wizkoo_section_h="One line item in your Mississippi ESA account.",
    wizkoo_intro_extra="At $50/month or $499/year, Wizkoo fits within Mississippi's ESA funding.",
    platform_contact="the Mississippi Department of Education Office of Special Education",
    callout_html=callout("Eligibility note — students with disabilities only",
        "Mississippi's ESA program is exclusively for students with an active IEP from the past 3 years. Families receive quarterly reimbursements after submitting receipts — there is no pre-loaded debit card or marketplace. This is a small, reimbursement-based program."),
    faq_a1="Mississippi's Equal Opportunity for Students with Special Needs ESA provides approximately $7,089/year (FY2024 rate). The program is exclusively for students with an active IEP who withdraw from public school. It is a small, reimbursement-based program — families submit receipts quarterly rather than spending from a pre-loaded account.",
    faq_a2="Mississippi's ESA uses direct reimbursement rather than a marketplace platform. Families may be able to submit a Wizkoo receipt as an educational software subscription expense. Check with the Mississippi Department of Education's Office of Special Education to confirm whether software subscriptions are an approved category.",
)

# ── TEMPLATE 2 STATES ──

# TENNESSEE
pages['tennessee'] = build_t2(
    state="Tennessee", slug="tennessee",
    title="Tennessee ESA for Homeschool Families | Wizkoo",
    meta_desc="Tennessee's ESA programs do not cover homeschool families. Here's what Tennessee homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Tennessee's Education Freedom Scholarship and ESA Pilot both require private school enrollment. Homeschool families are not currently eligible for ESA funds in Tennessee.",
    program_name="Education Freedom Scholarship (EFS) + ESA Pilot",
    esa_amount="<strong>$7,295/year</strong> (EFS, 2025-26) · <strong>~$9,800/year</strong> (Pilot, varies by county) — private school enrollment required",
    eligibility_detail="EFS is universal but requires private school enrollment — 20,000-student cap reached at 56,000+ applicants. The ESA Pilot covers 3 counties and requires income at or below 2x the free/reduced lunch threshold.",
    app_info='EFS 2026-27 applications closed February 6. Pilot: April 15 – May 15, 2026. <a href="https://www.tn.gov/education/efs.html" target="_blank" rel="noopener">tn.gov/education/efs.html</a>',
    participants="EFS: 20,000 (2025-26, at cap) · Pilot: 3,693 (2024-25)",
    launched="EFS 2025 · Pilot 2022",
    ineligible_text="Tennessee's EFS and ESA Pilot both require enrollment at an accredited private school. If you homeschool in Tennessee, neither program is available for curriculum purchases at this time. This restriction applies regardless of income.",
    platform="State-specific (Theodore)",
    faq_a1="Tennessee has two ESA programs — the Education Freedom Scholarship (EFS) and the ESA Pilot — but both currently require private school enrollment. Homeschool families are not eligible for either program at this time.",
    faq_a2="Most homeschool families in Tennessee fund curriculum through personal budgets. Tennessee does not currently offer a tax credit or deduction for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# WYOMING
pages['wyoming'] = build_t2(
    state="Wyoming", slug="wyoming",
    title="Wyoming ESA for Homeschool Families | Wizkoo",
    meta_desc="Wyoming's ESA program exists in law but is currently blocked by a court injunction. Here's what Wyoming homeschool families need to know.",
    hero_sub="Wyoming's ESA exists in law but is currently blocked by a court injunction. No funds have been disbursed. We'll update this page as the legal situation develops.",
    program_name="Wyoming ESA / Steamboat Legacy Scholarship",
    esa_amount="<strong>$7,000/year per student</strong> (once disbursements begin)",
    eligibility_detail="Universal K–12 (Pre-K for families at or below 250% FPL). Must not be concurrently enrolled in a public school.",
    app_info='Applications suspended due to court injunction. <a href="https://edu.wyoming.gov/parents/education-savings-accounts/" target="_blank" rel="noopener">edu.wyoming.gov</a>',
    participants="0 — court injunction prevents disbursement",
    launched="Not yet launched",
    ineligible_text="",
    platform="Odyssey",
    callout_html=callout("Court-blocked — no funds disbursed",
        'Wyoming\'s ESA program was enacted into law but is currently blocked by a court injunction issued October 7, 2025. Applications are suspended and no funds have been disbursed. The state is appealing. Check <a href="https://edu.wyoming.gov/parents/education-savings-accounts/" target="_blank" rel="noopener">edu.wyoming.gov</a> for the latest status.'),
    faq_a1="Wyoming's ESA (Steamboat Legacy Scholarship) exists in law and would provide $7,000/year per student, but it is currently blocked by a court injunction issued October 7, 2025. No students are enrolled and no funds have been disbursed. The state is appealing. We'll update this page as the legal situation develops.",
    faq_a2="Most homeschool families in Wyoming fund curriculum through personal budgets. Wizkoo is $50/month or $499/year for your whole family. If Wyoming's ESA program launches, we'll update this page immediately.",
)

# ── TEMPLATE 3 STATES ──

# MONTANA
pages['montana'] = build_t3(
    state="Montana", slug="montana",
    title="Montana ESA for Homeschool Families | Wizkoo",
    meta_desc="Montana does not currently have an active ESA program. Here's what Montana homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Montana's Special Needs ESA exists in law but was blocked by a court ruling in December 2025. Montana does offer a tax credit scholarship, but it is not available to homeschool families.",
    doe_url="https://opi.mt.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Montana offers</div>
    <div class="sec-h">Tax credit scholarship and a court-blocked special needs ESA.</div>
    {callout("Special Needs ESA — blocked by court (December 2025)", 'Montana enacted a Special Needs ESA (HB 393) that was blocked by a district court on December 8, 2025. The state is appealing. As of April 2026, $0 has been disbursed and no students are enrolled. Check <a href="https://opi.mt.gov/" target="_blank" rel="noopener">opi.mt.gov</a> for updates.')}
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Tax Credit Scholarship (HB 279)</div>
        <div class="alt-desc">$150 individual tax credit for donations to Student Grant Organizations (SGOs). $1M annual cap. Funds private school tuition only — not available for homeschool families.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Montana enacted a Special Needs ESA (HB 393) that was blocked by a district court on December 8, 2025. The state is appealing. No students are enrolled and no funds have been disbursed. Montana also has a tax credit scholarship (HB 279), but it funds private school tuition only and is not available to homeschool families.",
    faq_a2="Most homeschool families in Montana fund curriculum through personal budgets. Montana does not offer tax credits or deductions for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# OHIO
pages['ohio'] = build_t3(
    state="Ohio", slug="ohio",
    title="Ohio ESA for Homeschool Families | Wizkoo",
    meta_desc="Ohio does not currently have an active ESA program. Here's what Ohio homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Ohio's ACE ESA program ended in October 2025. Ohio does offer multiple private school voucher programs, but none apply to homeschool families.",
    doe_url="https://education.ohio.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Ohio offers</div>
    <div class="sec-h">Private school vouchers — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">EdChoice / EdChoice Expansion</div>
        <div class="alt-desc">Voucher programs for private school tuition. Income-eligible families can receive up to ~$6,000–$8,000/year. Private school enrollment required.</div>
      </div>
      <div class="alt-item">
        <div class="alt-name">Jon Peterson Special Needs Scholarship / Autism Scholarship</div>
        <div class="alt-desc">Voucher scholarships for students with disabilities attending private schools. Not available for homeschool families.</div>
      </div>
      <div class="alt-item">
        <div class="alt-name">Note on ACE ESA</div>
        <div class="alt-desc">Ohio's ACE ESA program, which did allow homeschool use, ended October 2025 and is no longer accepting participants.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Ohio's ACE ESA ended in October 2025. Ohio currently offers several private school voucher programs (EdChoice, EdChoice Expansion, Cleveland Scholarship, Jon Peterson Special Needs, Autism Scholarship), but all require private school enrollment and are not available to homeschool families.",
    faq_a2="Most homeschool families in Ohio fund curriculum through personal budgets. Ohio does not currently offer tax credits or deductions for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# SOUTH DAKOTA
pages['south-dakota'] = build_t3(
    state="South Dakota", slug="south-dakota",
    title="South Dakota ESA for Homeschool Families | Wizkoo",
    meta_desc="South Dakota does not currently have an ESA program. Here's what South Dakota homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="South Dakota does not currently have an ESA program. ESA bills failed in committee in 2025 and 2026 legislation expanded the tax credit only.",
    doe_url="https://doe.sd.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What South Dakota offers</div>
    <div class="sec-h">A tax credit scholarship for private school tuition.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Partners in Education Tax Credit</div>
        <div class="alt-desc">Insurance premium tax-credit scholarship program. $5M annual cap. Funds private school tuition only — not available for homeschool families. ESA bills HB 1009 and HB 1020 died in 2025 committee; S.B. 84 (2026) expanded the tax credit but did not create an ESA.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="No. South Dakota does not have an ESA program. ESA bills (HB 1009, HB 1020) died in committee in 2025, and 2026 legislation (S.B. 84) only expanded an existing tax credit. South Dakota does have a tax credit scholarship program for private school tuition, but it is not available to homeschool families.",
    faq_a2="Most homeschool families in South Dakota fund curriculum through personal budgets. South Dakota does not offer tax credits or deductions specifically for homeschool curriculum. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# VIRGINIA
pages['virginia'] = build_t3(
    state="Virginia", slug="virginia",
    title="Virginia ESA for Homeschool Families | Wizkoo",
    meta_desc="Virginia does not currently have an ESA program. Here's what Virginia homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Virginia does not currently have an ESA program. Virginia offers a tax credit scholarship, but it is for private school enrollment only and is not available to homeschool families.",
    doe_url="https://www.doe.virginia.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Virginia offers</div>
    <div class="sec-h">A tax credit scholarship for private school only.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Education Improvement Scholarships Tax Credits (EISTC)</div>
        <div class="alt-desc">65% tax credit for donations to scholarship-granting organizations. Income at or below 300% FPL. $25M annual cap. Private school enrollment required — not available to homeschool families.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="No. Virginia does not have an ESA program. Virginia does offer an Education Improvement Scholarships Tax Credit (EISTC), but it is a private school scholarship only and is not available to homeschool families.",
    faq_a2="Most homeschool families in Virginia fund curriculum through personal budgets. Virginia does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# OKLAHOMA
pages['oklahoma'] = build_t3(
    state="Oklahoma", slug="oklahoma",
    title="Oklahoma ESA for Homeschool Families | Wizkoo",
    meta_desc="Oklahoma does not have a true ESA program, but offers a Parental Choice Tax Credit of $1,000/year for homeschool families. Here's what Oklahoma homeschool families need to know.",
    hero_sub="Oklahoma doesn't have an ESA, but does offer a $1,000 refundable Parental Choice Tax Credit for homeschool families — the first broad-based education tax credit available to Oklahoma homeschoolers.",
    doe_url="https://oklahoma.gov/tax/individuals/parental-choice-tax-credit.html",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Oklahoma offers</div>
    <div class="sec-h">A refundable tax credit — available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Parental Choice Tax Credit</div>
        <div class="alt-desc"><strong>$1,000/year for homeschool families.</strong> $5,000–$7,500 for private school families (AGI-tiered). Refundable — you receive the credit even if you owe no state taxes. 39,373 approved as of February 2026. This is not a true ESA — it is a tax credit claimed on your state income tax return, not a pre-loaded spending account. Apply at <a href="https://oklahoma.gov/tax/individuals/parental-choice-tax-credit.html" target="_blank" rel="noopener">oklahoma.gov/tax</a>.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Oklahoma does not have a true ESA program. Oklahoma does offer a Parental Choice Tax Credit — $1,000/year refundable for homeschool families, $5,000–$7,500 for private school families (AGI-tiered). It is claimed on your state tax return, not a marketplace account. 39,373 applications were approved as of February 2026.",
    faq_a2="Oklahoma homeschool families can claim the $1,000 Parental Choice Tax Credit on their state income tax return. Most families also supplement with personal budgets for the remainder of curriculum costs. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
    update_phrase="If Oklahoma creates a full ESA program",
)

# NEVADA
pages['nevada'] = build_t3(
    state="Nevada", slug="nevada",
    title="Nevada ESA for Homeschool Families | Wizkoo",
    meta_desc="Nevada does not currently have an active ESA program. Here's what Nevada homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Nevada's 2015 ESA law was struck down by the state Supreme Court. Nevada currently offers a private school scholarship program, but it does not cover homeschool families.",
    doe_url="https://doe.nv.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Nevada offers</div>
    <div class="sec-h">A private school scholarship — not available to homeschool families.</div>
    {callout("Nevada's 2015 ESA law", "Nevada passed a universal ESA law in 2015 (SB 302), but the Nevada Supreme Court struck it down due to the funding mechanism used. No new ESA legislation has been enacted since.")}
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Opportunity Scholarship</div>
        <div class="alt-desc">Corporate tax-credit scholarship. Maximum $10,094/student. Income at or below 300% FPL. Cap approximately $6.7M/year. Private school enrollment required — not available to homeschool families.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Nevada passed a universal ESA law in 2015, but the Nevada Supreme Court struck it down due to the funding mechanism used. Nevada currently offers the Opportunity Scholarship (corporate tax-credit, private school only). No active ESA program exists as of April 2026.",
    faq_a2="Most homeschool families in Nevada fund curriculum through personal budgets. Nevada does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# IDAHO
pages['idaho'] = build_t3(
    state="Idaho", slug="idaho",
    title="Idaho ESA for Homeschool Families | Wizkoo",
    meta_desc="Idaho does not currently have an ESA program, but offers a Parental Choice Tax Credit of up to $500/year for homeschool families. Here's what Idaho homeschool families need to know.",
    hero_sub="Idaho doesn't have an ESA, but offers a refundable Parental Choice Tax Credit of up to $500/year for homeschool families. The Idaho Supreme Court upheld the credit in February 2026.",
    doe_url="https://www.sde.idaho.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Idaho offers</div>
    <div class="sec-h">A refundable tax credit — available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Parental Choice Tax Credit</div>
        <div class="alt-desc"><strong>Up to $500/year for homeschool families.</strong> Up to $5,000/year for private school families. Refundable — you receive the credit even if you owe no state taxes. The Idaho Supreme Court upheld the credit as constitutional in February 2026. Apply through <a href="https://tax.idaho.gov" target="_blank" rel="noopener">tax.idaho.gov</a>.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Idaho does not have an ESA program. Idaho does offer a Parental Choice Tax Credit — up to $500/year refundable for homeschool families, up to $5,000/year for private school families. The Idaho Supreme Court upheld the credit as constitutional in February 2026. It is claimed on your state income tax return.",
    faq_a2="Idaho homeschool families can claim the Parental Choice Tax Credit (up to $500) on their state income tax return. Most families also supplement with personal budgets. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
    update_phrase="If Idaho expands its education funding programs to include a full ESA",
)

# PENNSYLVANIA
pages['pennsylvania'] = build_t3(
    state="Pennsylvania", slug="pennsylvania",
    title="Pennsylvania ESA for Homeschool Families | Wizkoo",
    meta_desc="Pennsylvania does not currently have an ESA program. Here's what Pennsylvania homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Pennsylvania does not currently have an ESA program. Pennsylvania offers substantial tax-credit scholarship programs, but they are for private school enrollment only.",
    doe_url="https://www.education.pa.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Pennsylvania offers</div>
    <div class="sec-h">Tax-credit scholarships for private school — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">EITC + OSTC Scholarships</div>
        <div class="alt-desc">Pennsylvania's Educational Improvement Tax Credit (EITC) and Opportunity Scholarship Tax Credit (OSTC) programs have a combined cap of approximately $590M and issued ~77,670 scholarships averaging $2,218 per student. Private school enrollment required — not available to homeschool families.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Pennsylvania does not have an ESA program. Pennsylvania's EITC and OSTC programs are large corporate tax-credit scholarship programs for private school tuition only. They are not available to homeschool families.",
    faq_a2="Most homeschool families in Pennsylvania fund curriculum through personal budgets. Pennsylvania does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# WISCONSIN
pages['wisconsin'] = build_t3(
    state="Wisconsin", slug="wisconsin",
    title="Wisconsin ESA for Homeschool Families | Wizkoo",
    meta_desc="Wisconsin does not currently have an ESA program. Here's what Wisconsin homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Wisconsin does not currently have an ESA program. Wisconsin has the nation's oldest private school voucher program, but vouchers are for private school tuition only.",
    doe_url="https://dpi.wi.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Wisconsin offers</div>
    <div class="sec-h">Private school vouchers — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Milwaukee / Racine / Statewide Parental Choice Programs (MPCP/RPCP/WPCP)</div>
        <div class="alt-desc">Wisconsin has three geographic voucher programs serving 53,000+ students combined. MPCP rates: $10,877 (K–8) and $13,371 (9–12). All require private school enrollment — not available to homeschool families. Wisconsin's voucher program, established in 1990, is the nation's oldest.</div>
      </div>
      <div class="alt-item">
        <div class="alt-name">Special Needs Scholarship Program (SNSP)</div>
        <div class="alt-desc">Voucher scholarship for students with disabilities attending private schools. Private school enrollment required.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Wisconsin does not have an ESA program. Wisconsin has the nation's oldest private school voucher program (established 1990), serving 53,000+ students across three geographic programs. All require private school enrollment and are not available to homeschool families.",
    faq_a2="Most homeschool families in Wisconsin fund curriculum through personal budgets. Wisconsin does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# RHODE ISLAND
pages['rhode-island'] = build_t3(
    state="Rhode Island", slug="rhode-island",
    title="Rhode Island ESA for Homeschool Families | Wizkoo",
    meta_desc="Rhode Island does not currently have an ESA program. Here's what Rhode Island homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Rhode Island does not currently have an ESA program. Rhode Island offers a small tax credit scholarship, but it is for private school enrollment only.",
    doe_url="https://ride.ri.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Rhode Island offers</div>
    <div class="sec-h">A tax credit scholarship for private school — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Tax Credits for Contributions to SGOs</div>
        <div class="alt-desc">75–90% corporate tax credit for donations to scholarship-granting organizations. Approximately $1.5M cap serving ~500 students. Private school enrollment required.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Rhode Island does not have an ESA program. Rhode Island offers a small corporate tax-credit scholarship (~$1.5M cap, ~500 students) for private school tuition only. It is not available to homeschool families.",
    faq_a2="Most homeschool families in Rhode Island fund curriculum through personal budgets. Rhode Island does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# MINNESOTA
pages['minnesota'] = build_t3(
    state="Minnesota", slug="minnesota",
    title="Minnesota ESA for Homeschool Families | Wizkoo",
    meta_desc="Minnesota does not currently have an ESA program, but offers a K-12 education deduction and credit that cover homeschool expenses. Here's what Minnesota homeschool families need to know.",
    hero_sub="Minnesota doesn't have an ESA, but offers a K-12 education deduction and credit that homeschool families can use for curriculum expenses — including educational software.",
    doe_url="https://education.mn.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Minnesota offers</div>
    <div class="sec-h">A K-12 education deduction and credit — available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">K-12 Education Deduction</div>
        <div class="alt-desc"><strong>$1,625–$2,500 deduction per child</strong> (varies by grade level) for qualifying educational expenses. Covers homeschool curriculum, tutoring, and educational software. Claimed on your Minnesota state income tax return.</div>
      </div>
      <div class="alt-item">
        <div class="alt-name">K-12 Education Credit</div>
        <div class="alt-desc"><strong>75% of qualifying expenses, up to $1,000 per family.</strong> Covers similar expenses as the deduction. Income-limited. Claimed on your Minnesota state income tax return. Verify current eligibility at <a href="https://revenue.state.mn.us" target="_blank" rel="noopener">revenue.state.mn.us</a>.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Minnesota does not have an ESA program. Minnesota does offer a K-12 education deduction ($1,625–$2,500 per child) and a K-12 education credit (75% of expenses, up to $1,000 per family) that cover homeschool curriculum expenses including educational software. Both are claimed on your state income tax return.",
    faq_a2="Minnesota homeschool families can reduce curriculum costs through the state's K-12 education deduction and credit. Most families also supplement with personal budgets. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
    update_phrase="If Minnesota introduces an ESA program",
)

# ILLINOIS
pages['illinois'] = build_t3(
    state="Illinois", slug="illinois",
    title="Illinois ESA for Homeschool Families | Wizkoo",
    meta_desc="Illinois does not currently have an ESA program. Here's what Illinois homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Illinois does not currently have an ESA program. Illinois offers a tax credit for private school tuition, but it is not available to homeschool families.",
    doe_url="https://www.isbe.net/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Illinois offers</div>
    <div class="sec-h">A tax credit for private school tuition — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">K-12 Private School Tuition Tax Credit</div>
        <div class="alt-desc">$750/student tax credit for private school tuition expenses. Private school enrollment required — not available to homeschool families.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Illinois does not have an ESA program. Illinois offers a $750/student tax credit for private school tuition only. It is not available to homeschool families.",
    faq_a2="Most homeschool families in Illinois fund curriculum through personal budgets. Illinois does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# VERMONT
pages['vermont'] = build_t3(
    state="Vermont", slug="vermont",
    title="Vermont ESA for Homeschool Families | Wizkoo",
    meta_desc="Vermont does not currently have an ESA program. Here's what Vermont homeschool families need to know and how to fund curriculum without ESA.",
    hero_sub="Vermont does not currently have an ESA program. Vermont has a Town Tuitioning program, but it is not available to homeschool families and was significantly restricted by Act 73 in July 2025.",
    doe_url="https://education.vermont.gov/",
    alt_section_html=f"""<section class="sec sec-warm" style="position:relative">
  <div class="sec-inner sr">
    <div class="sec-ey">What Vermont offers</div>
    <div class="sec-h">Town Tuitioning — not available to homeschool families.</div>
    <div class="alt-list">
      <div class="alt-item">
        <div class="alt-name">Town Tuitioning (est. 1869)</div>
        <div class="alt-desc">Vermont's historic program allows students in towns without public schools to attend nearby public or approved independent schools using public funds. It is not available to homeschool families. Act 73 (July 2025) added significant restrictions to the program.</div>
      </div>
    </div>
  </div>
</section>""",
    faq_a1="Vermont does not have an ESA program. Vermont has a Town Tuitioning program (established 1869) that allows students in towns without public schools to attend other schools, but it is not available to homeschool families. Act 73 (July 2025) added significant restrictions to Town Tuitioning.",
    faq_a2="Most homeschool families in Vermont fund curriculum through personal budgets. Vermont does not offer tax credits or deductions specifically for homeschool curriculum expenses. Wizkoo is $50/month or $499/year for your whole family, no ESA required.",
)

# SIMPLE TIER 3 — NO ESA, NO ALTERNATIVES

SIMPLE_T3 = [
    ("New York", "new-york", "https://www.nysed.gov/", "New York does not currently have ESA legislation pending.", None),
    ("Kentucky", "kentucky", "https://education.ky.gov/",
     "Kentucky does not currently have an active ESA program. ESA legislation may be introduced in 2026 — we monitor the legislature and will update this page if that changes.", None),
    ("Hawaii", "hawaii", "https://www.hawaiipublicschools.org/", "Hawaii does not currently have ESA legislation pending.", None),
    ("Maine", "maine", "https://www.maine.gov/doe/", "Maine does not currently have ESA legislation pending.", None),
    ("Massachusetts", "massachusetts", "https://www.doe.mass.edu/", "Massachusetts does not currently have ESA legislation pending.", None),
    ("North Dakota", "north-dakota", "https://www.nd.gov/dpi/", "North Dakota does not currently have ESA legislation pending.", None),
    ("Washington", "washington", "https://www.k12.wa.us/", "Washington does not currently have ESA legislation pending.", None),
    ("New Mexico", "new-mexico", "https://webnew.ped.state.nm.us/", "New Mexico does not currently have ESA legislation pending.", None),
    ("New Jersey", "new-jersey", "https://www.nj.gov/education/", "New Jersey does not currently have ESA legislation pending.", None),
    ("Nebraska", "nebraska", "https://www.education.ne.gov/", "Nebraska does not currently have ESA legislation pending.", None),
    ("Kansas", "kansas", "https://www.ksde.org/", "Kansas does not currently have ESA legislation pending.", None),
    ("Delaware", "delaware", "https://www.doe.k12.de.us/", "Delaware does not currently have ESA legislation pending.", None),
    ("Alaska", "alaska", "https://education.alaska.gov/", "Alaska does not currently have ESA legislation pending.", None),
    ("Michigan", "michigan", "https://www.michigan.gov/mde", "Michigan does not currently have ESA legislation pending.", None),
    ("Oregon", "oregon", "https://www.oregon.gov/ode/", "Oregon does not currently have ESA legislation pending.", None),
    ("Connecticut", "connecticut", "https://portal.ct.gov/sde", "Connecticut does not currently have ESA legislation pending.", None),
    ("Colorado", "colorado", "https://www.cde.state.co.us/", "Colorado does not currently have ESA legislation pending.", None),
    ("Maryland", "maryland", "https://www.marylandpublicschools.org/",
     "Maryland does not currently have an active ESA program. ESA legislation may be introduced in 2026 — we monitor the legislature and will update this page if that changes.", None),
]

for state, slug, doe_url, hero_sub, _ in SIMPLE_T3:
    has_pending = "may be introduced" in hero_sub
    faq_pending = ""
    if has_pending:
        faq_pending = f" ESA legislation may be introduced in {state} in 2026 — we monitor the legislature and will update this page if that changes."
    pages[slug] = build_t3(
        state=state, slug=slug,
        title=f"{state} ESA for Homeschool Families | Wizkoo",
        meta_desc=f"{state} does not currently have an ESA program. Here's what {state} homeschool families need to know and how to fund curriculum without ESA.",
        hero_sub=hero_sub,
        doe_url=doe_url,
        faq_a1=f"No. {state} does not currently have an Education Savings Account program.{faq_pending} Several states add new ESA programs each year. We monitor {state}'s legislature and will update this page if that changes.",
    )

# ── WRITE FILES ──────────────────────────────────────────────────────────────

count = 0
for slug, html in pages.items():
    out_dir = os.path.join(BASE, 'esa', slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    count += 1
    print(f"  wrote  esa/{slug}/index.html")

print(f"\nDone — {count} pages written.")
