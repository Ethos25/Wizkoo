const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`file://${path.resolve(__dirname, '../index.html')}`);
  
  const rects = await page.evaluate(() => {
    const wrap = document.querySelector('.plan-founder-wrap').getBoundingClientRect();
    const container = document.querySelector('.plan-founder').getBoundingClientRect();
    const left = document.querySelector('.pf-left').getBoundingClientRect();
    const right = document.querySelector('.pf-right').getBoundingClientRect();
    const box = document.querySelector('.box-mockup').getBoundingClientRect();
    return {
      wrap: { width: wrap.width, left: wrap.left, right: wrap.right },
      container: { width: container.width, left: container.left, right: container.right },
      left: { width: left.width, left: left.left, right: left.right },
      right: { width: right.width, left: right.left, right: right.right },
      box: { width: box.width, left: box.left, right: box.right },
      viewportWidth: window.innerWidth
    };
  });
  console.log(rects);
  await browser.close();
})();
