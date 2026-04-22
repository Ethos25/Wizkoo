
import sys

V14_CSS = """\
/* ═══ NEW HERO SECTION ═══ */
/* Accessibility utility — preserved from V13; architectural move to shared file deferred */
.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

/* -- Desk note: imported from reference verbatim (no tape, no rotation) -- */
.desk{position:relative;background:#FBF7EB;padding:26px 30px 22px;box-shadow:0 1px 0 rgba(12,16,32,0.04),0 22px 48px -32px rgba(12,16,32,0.28),inset 0 0 0 0.5px rgba(184,132,20,0.08);margin-bottom:42px}
.desk::before{content:'';position:absolute;top:-8px;left:0;right:0;height:10px;background:radial-gradient(circle at 7px 10px,#FBF7EB 5px,transparent 5.6px),radial-gradient(circle at 22px 8px,#FBF7EB 4.2px,transparent 4.8px),radial-gradient(circle at 38px 10px,#FBF7EB 5px,transparent 5.6px),radial-gradient(circle at 53px 8px,#FBF7EB 4.2px,transparent 4.8px);background-size:60px 10px;background-repeat:repeat-x}
.desk-head{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:12px}
.desk-title{font-family:'Fraunces',serif;font-weight:400;font-style:italic;font-size:22px;letter-spacing:-0.015em;color:#0C1020;line-height:1.15}
.desk-title::first-letter{color:#E8AF38}
.desk-kicker{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.28em;text-transform:uppercase;color:var(--ink-28);white-space:nowrap}
.desk-body{font-family:'Fraunces',serif;font-weight:300;font-style:italic;font-size:15px;line-height:1.55;color:rgba(12,16,32,0.82);text-wrap:pretty}
.desk-body strong{font-style:normal;font-weight:500;color:#0C1020}
.desk-body .hl{font-style:normal;font-weight:500;color:#2E4B8A;border-bottom:1px solid rgba(46,75,138,0.38);padding-bottom:1px}
.desk-foot{margin-top:14px;padding-top:10px;border-top:1px dashed rgba(12,16,32,0.15);display:flex;justify-content:space-between;align-items:baseline;font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-45)}
.desk-foot .left-sig{color:#0C1020;font-weight:700}
.desk-foot em{font-style:normal;color:var(--ink-45)}

/* -- Hero layout -- */
.hero{padding:72px 0 96px;position:relative}
.wrap{width:100%;max-width:1200px;margin:0 auto;padding:0 56px;box-sizing:border-box}
.hero-grid{display:grid;gap:0;align-items:start;position:relative}
.hero-grid::before{content:'';position:absolute;left:calc(50.5% - 0.5px);top:24px;bottom:24px;width:1px;background:linear-gradient(180deg,transparent 0%,#E8AF38 16%,#E8AF38 84%,transparent 100%);opacity:0.42}
.hero-grid::after{content:'';position:absolute;left:calc(50.5% - 3px);top:48%;width:7px;height:1px;background:#E8AF38;opacity:0.6}

/* -- Left column -- */
.left{padding:8px 88px 8px 0;display:flex;flex-direction:column;position:relative}
.left-header{display:flex;align-items:center;gap:14px;margin-bottom:44px;font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:0.26em;text-transform:uppercase;color:var(--ink-45)}
.left-header .tick{width:20px;height:1px;background:#E8AF38;opacity:0.9;display:inline-block}
.left-header .saffron{color:#E8AF38;font-weight:700}
.left h1{font-family:'Fraunces',serif;line-height:0.96;letter-spacing:-0.035em;color:#0C1020;text-wrap:balance;margin:0}
.left h1 .l1{display:block;font-weight:300;opacity:0.78;font-size:clamp(2.2rem,3.6vw,3.2rem);font-style:normal;letter-spacing:-0.025em}
.left h1 .l2{display:block;font-weight:700;color:#E8AF38;font-size:clamp(2.8rem,5vw,4.6rem);margin-top:-2px;letter-spacing:-0.04em}
.left h1 .l3{display:block;margin-top:6px;font-family:'Fraunces',serif;font-weight:300;font-style:italic;font-size:clamp(1.6rem,2.4vw,2rem);letter-spacing:-0.02em;color:#0C1020;opacity:0.88}
.left-and-sub{margin-top:10px;font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:16px;line-height:1.5;color:var(--ink-60);max-width:34ch;text-wrap:pretty}
.left .desk{margin-top:40px;max-width:460px}
.left-foot{margin-top:28px;padding-top:22px;border-top:1px solid var(--ink-12);max-width:460px;display:flex;align-items:baseline;gap:20px;font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-45);line-height:1.8}
.left-foot .dot{width:3px;height:3px;border-radius:50%;background:#E8AF38;opacity:0.8;display:inline-block;transform:translateY(-3px)}
.left-foot em{font-style:normal;color:#0C1020;font-weight:700;letter-spacing:0.18em}

/* -- Right column -- */
.right{padding:8px 0 8px 80px;position:relative;display:flex;flex-direction:column}
.right-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;gap:20px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:var(--ink-45)}
.right-meta .dateline{display:flex;align-items:baseline;gap:10px}
.right-meta .dateline strong{color:#E8AF38;font-weight:700}
.right-meta .folio{color:var(--ink-28);letter-spacing:0.3em}

/* -- Form -- */
.form-head{display:flex;align-items:baseline;justify-content:space-between;gap:20px;margin-bottom:28px;padding-bottom:12px;border-bottom:1px solid var(--ink-12)}
.form-head h2{font-family:'Fraunces',serif;font-weight:300;font-style:italic;font-size:clamp(1.5rem,2vw,1.85rem);line-height:1.15;letter-spacing:-0.02em;color:#0C1020}
.form-head h2 .roman{color:#E8AF38;font-weight:400;letter-spacing:0.02em;margin-right:10px;font-style:normal;font-family:'Space Mono',monospace;font-size:0.5em;vertical-align:0.25em}
.form-head .count{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;color:var(--ink-45);white-space:nowrap}
.form-head .count em{font-style:normal;color:#E8AF38;font-weight:700}
.fields{display:flex;flex-direction:column;gap:26px}
.field{display:grid;grid-template-columns:28px 1fr;align-items:baseline;gap:16px}
.field-num{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-28);font-weight:700;padding-top:6px;transition:color .25s}
.field.has-value .field-num{color:#E8AF38}
.field-body{display:flex;flex-direction:column;gap:4px}
.field-label{font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13px;color:#0C1020;letter-spacing:-0.005em;line-height:1.3;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.field-label .aux{font-family:'Space Mono',monospace;font-weight:400;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-45)}
.field-input-row{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.theme-input,.name-input{font-family:'Fraunces',serif;font-weight:400;font-style:italic;color:#0C1020;letter-spacing:-0.01em;background:transparent;border:0;outline:0;padding:4px 2px;margin:0;line-height:1.2;border-bottom:2px solid var(--ink-12);transition:border-bottom-color .25s,background .25s,color .2s}
.theme-input{font-size:24px;width:100%;max-width:100%}
.name-input{font-size:20px;width:var(--w,12ch)}
.theme-input::placeholder,.name-input::placeholder{color:var(--ink-28);font-style:italic}
.theme-input:focus,.name-input:focus{border-bottom-color:#E8AF38;background:linear-gradient(to top,rgba(232,175,56,0.10) 0%,rgba(232,175,56,0) 45%)}
.field.has-value .theme-input,.field.has-value .name-input{color:var(--saffron-deep);border-bottom-color:#E8AF38}
.theme-examples{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-45)}
.theme-examples .lbl{color:var(--ink-28)}
.theme-chip{font-family:'Fraunces',serif;font-style:italic;font-weight:400;font-size:12px;letter-spacing:-0.005em;text-transform:none;color:var(--ink-60);padding:3px 10px;background:rgba(255,253,245,0.7);border:0.5px solid var(--ink-12);cursor:pointer;transition:all .2s}
.theme-chip:hover{color:var(--saffron-deep);border-color:#E8AF38;background:rgba(232,175,56,0.08)}
.field-error{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--saffron-deep);margin-top:8px;display:none;line-height:1.7}
.field-error.visible{display:block}
.age-group{display:flex;align-items:baseline;gap:14px}
.age-group .lbl{font-family:'Plus Jakarta Sans',sans-serif;font-weight:500;font-size:13px;color:var(--ink-60);letter-spacing:0.01em}
.age-box{display:inline-flex;align-items:stretch;border:1px solid var(--ink-12);background:rgba(255,253,245,0.5);transition:border-color .2s,background .2s}
.age-box:hover,.age-box:focus-within{border-color:#E8AF38;background:rgba(255,253,245,1)}
#f-age{width:52px;padding:8px;font-family:'Fraunces',serif;font-style:italic;font-weight:400;font-size:22px;color:var(--ink-28);letter-spacing:-0.01em;background:transparent;border:0;outline:0;text-align:center;-moz-appearance:textfield;appearance:textfield}
#f-age::-webkit-outer-spin-button,#f-age::-webkit-inner-spin-button{-webkit-appearance:none}
.field.has-value #f-age{color:var(--saffron-deep)}
.age-steppers{display:flex;flex-direction:column;border-left:1px solid var(--ink-12)}
.age-steppers button{width:26px;height:22px;border:0;background:transparent;font-family:'Space Mono',monospace;font-size:9px;color:var(--ink-45);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:color .15s,background .15s}
.age-steppers button:first-child{border-bottom:1px solid var(--ink-12)}
.age-steppers button:hover{color:var(--saffron-deep);background:rgba(232,175,56,0.12)}
.age-hint{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ink-28)}
.wiggly-fieldset{border:none;padding:0;margin:0}
.toggle-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:6px}
.toggle-segment{display:inline-flex;align-items:stretch;border:1px solid var(--ink-12);background:rgba(255,253,245,0.5);position:relative}
.toggle-opt{position:relative;padding:8px 18px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-45);transition:color .2s;display:flex;align-items:center;gap:7px}
.toggle-opt+.toggle-opt{border-left:1px solid var(--ink-12)}
.toggle-opt input[type=radio]{position:absolute;opacity:0;pointer-events:none}
.toggle-opt::before{content:'';width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ink-28);background:transparent;transition:all .2s;flex-shrink:0}
.toggle-opt:has(input:checked)::before{border-color:#E8AF38;background:#E8AF38;box-shadow:0 0 0 2.5px rgba(232,175,56,0.18)}
.toggle-opt:has(input:checked){color:var(--saffron-deep)}
.toggle-opt:hover{color:#0C1020}
.toggle-note{font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:13.5px;color:var(--ink-60);line-height:1.4;max-width:38ch;padding-left:16px;border-left:1px solid rgba(232,175,56,0.35);transition:opacity .3s}
.cta-row{margin-top:40px;padding-top:28px;border-top:1px solid var(--ink-12);display:flex;align-items:center;gap:32px;flex-wrap:wrap}
.lbracket{position:relative;font-family:'Space Mono',monospace;font-weight:500;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#0C1020;padding:14px 22px;line-height:1;background:transparent;border:0;cursor:pointer;transition:color .2s}
.lbracket::before{content:'';position:absolute;right:0;top:0;bottom:0;width:5px;background:#E8AF38}
.lbracket::after{content:'';position:absolute;left:0;right:0;bottom:0;height:5px;background:#E8AF38}
.lbracket .arrow{display:inline-block;margin-left:0.5em;transition:transform .25s}
.lbracket:hover:not(:disabled){color:#5A3A10}
.lbracket:hover:not(:disabled) .arrow{transform:translateX(4px)}
.lbracket:disabled{opacity:0.4;cursor:not-allowed}
.lbracket:disabled::before,.lbracket:disabled::after{background:rgba(232,175,56,0.3)}
.cta-note{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-45);line-height:1.7;margin-top:16px}
.sibling-note{margin-top:22px;font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:14px;color:var(--ink-60);line-height:1.5}
.sibling-note em{font-style:normal;color:#0C1020;font-weight:500;border-bottom:1px dashed rgba(232,175,56,0.6);padding-bottom:1px}
.gate{max-width:460px;margin-top:24px}
@media(max-width:768px){
  .hero{padding:48px 0 72px}
  .wrap{padding:0 24px}
  .hero-grid{grid-template-columns:1fr;gap:48px}
  .hero-grid::before,.hero-grid::after{display:none}
  .left{padding:0}
  .right{padding:0}
  .left h1 .l1{font-size:1.9rem}
  .left h1 .l2{font-size:2.6rem}
  .left h1 .l3{font-size:1.5rem}
  .left .desk{max-width:100%}
}

"""

import re

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', encoding='utf-8') as f:
    src = f.read()

m_start = re.search(r'/\*[^*]*NEW HERO SECTION[^*]*\*/', src)
m_end   = re.search(r'/\*[^*]*HERO INTAKE FORM[^*]*\*/', src)
assert m_start, 'CSS_START not found'
assert m_end,   'CSS_END not found'
start_idx = m_start.start()
end_idx   = m_end.start()

result = src[:start_idx] + V14_CSS + src[end_idx:]

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', 'w', encoding='utf-8') as f:
    f.write(result)

lines = len(result.splitlines())
print('CSS step done. File now', lines, 'lines')
