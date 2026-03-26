/**
 * Generates wizkoo-og.png — Blueprint spec OG image.
 * 1200×630, split layout: dark left (#0C1020) + saffron right (#E8AF38)
 */
const { chromium } = require('@playwright/test');
const path = require('path');

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Sora:wght@200;700;800&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;display:flex}

  /* ── LEFT PANEL ── */
  .left{
    width:660px;height:630px;
    background:#0C1020;
    padding:52px 56px;
    display:flex;flex-direction:column;
    justify-content:space-between;
    position:relative;
  }
  /* Warm saffron glow bleeding from the right edge onto the dark panel */
  .left::after{
    content:'';
    position:absolute;
    top:0;right:0;
    width:80px;height:100%;
    background:linear-gradient(90deg,transparent,rgba(232,175,56,0.08));
    pointer-events:none;
  }

  /* Wordmark */
  .wm{
    font-family:'Sora',sans-serif;
    font-weight:800;
    font-size:28px;
    letter-spacing:-0.04em;
    color:#F0F2F8;
    display:flex;align-items:baseline;gap:0;line-height:1;
  }
  .wm .k{color:#E8AF38;display:inline-block;transform:rotate(8deg);transform-origin:bottom center}
  .wm-dot{display:inline-block;position:relative}
  .wm-dot::after{
    content:'';position:absolute;
    top:0.1em;right:-0.22em;
    width:0.22em;height:0.22em;
    border-radius:50%;background:#E8AF38;
  }

  /* Eyebrow */
  .eyebrow{
    font-family:'Space Mono',monospace;
    font-size:11px;
    letter-spacing:0.2em;
    text-transform:uppercase;
    color:#8C91A5;
    margin-top:32px;
    margin-bottom:20px;
  }

  /* Headline */
  .headline{
    font-family:'Sora',sans-serif;
    font-weight:200;
    font-size:72px;
    line-height:1.06;
    letter-spacing:-0.03em;
    color:#F0F2F8;
    flex:1;
    display:flex;
    align-items:center;
  }
  .headline-inner{display:block}
  .dot{color:#E8AF38}

  /* Tags */
  .tags{
    font-family:'Space Mono',monospace;
    font-size:11px;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color:#8C91A5;
  }

  /* ── RIGHT PANEL ── */
  .right{
    width:540px;height:630px;
    background:#E8AF38;
    padding:52px 0;
    display:flex;flex-direction:column;
    justify-content:space-between;
  }

  .done{
    font-family:'Sora',sans-serif;
    font-weight:800;
    font-size:100px;
    letter-spacing:-0.04em;
    line-height:1;
    color:#0C1020;
    flex:1;
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .site{
    font-family:'Space Mono',monospace;
    font-size:11px;
    letter-spacing:0.16em;
    text-transform:uppercase;
    color:#0C1020;
    opacity:0.6;
    text-align:right;
    padding-right:48px;
  }
</style>
</head>
<body>
  <div class="left">
    <!-- Wordmark -->
    <div>
      <div class="wm">wiz<span class="k">k</span>o<span class="wm-dot">o</span></div>
      <div class="eyebrow">Learning plans · For whatever your family's into</div>
    </div>

    <!-- Headline -->
    <div class="headline">
      <span class="headline-inner">
        One theme<span class="dot">.</span><br>
        Every subject<span class="dot">.</span><br>
        All week<span class="dot">.</span>
      </span>
    </div>

    <!-- Identity tags -->
    <div class="tags">Homeschool · After School · Summer</div>
  </div>

  <div class="right">
    <div></div>
    <div class="done">Done.</div>
    <div class="site">wizkoo.com</div>
  </div>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(HTML, { waitUntil: 'networkidle' });
  // Extra wait for Google Fonts to load
  await page.waitForTimeout(2000);
  const outPath = path.resolve('wizkoo-og.png');
  await page.screenshot({ path: outPath, fullPage: false });
  console.log('OG image written to:', outPath);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
