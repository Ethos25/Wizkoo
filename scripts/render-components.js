#!/usr/bin/env node
'use strict';

/**
 * render-components.js — renders components/nav.js and components/footer.js at
 * BUILD TIME and inlines what they produce into the served HTML.
 *
 * WHY THIS EXISTS. The entire internal link graph of wizkoo.com lived in those
 * two files and was injected at runtime. A crawler's first fetch is HTML with
 * no JavaScript run, so what Google saw on each page was:
 *
 *     /            2 internal links        /methodology     0
 *     /about       2                       /the-open-seat   0
 *     /pricing     1                       /ages            0
 *     /themes      1                       /games/atlas     0
 *
 * Fourteen nav and footer destinations existed on every page and were visible
 * on none of them. Search Console's "Discovered, currently not indexed" (57
 * pages) is the shape that produces: URLs known from the sitemap, reached by no
 * link, and so never worth crawling.
 *
 * HOW IT WORKS, AND WHY NOT BY HAND. nav.js and footer.js REMAIN the one place
 * the nav and footer are authored. This script does not re-state their markup;
 * it EXECUTES them against a minimal DOM stub and captures what they assign to
 * innerHTML. Markup can therefore never drift from the component, because there
 * is only ever one copy of it. Editing nav.js is still the whole edit.
 *
 * The stub answers getElementById for the two container ids and null for every
 * other lookup. That is not a limitation being worked around, it is the point:
 * returning null makes each component run its markup assignment and then stop
 * before the behaviour that must stay at runtime — the hamburger, the scroll
 * parallax, the active-link class, and the random star field, which must not be
 * frozen into the HTML or every build would differ from the last.
 *
 * DUPLICATION. Once the markup is in the HTML, the components must not inject
 * it a second time. Each guards on the markup already being present (see the
 * `pre-rendered` checks in nav.js and footer.js) and skips straight to wiring
 * up behaviour. The scoped <style> blocks are inlined here too, which the
 * components' existing `if (!document.getElementById('wn-styles'))` guards
 * already handle, so the nav is styled at first paint rather than a frame late.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO = path.resolve(__dirname, '..');

/** A DOM stub that answers only what nav.js and footer.js reach for. */
function makeStub({ containerId, pathname, bodyAttrs }) {
  const captured = { html: null, styleId: null, styleText: null };

  const container = {
    style: {},
    innerHTML: '',
    classList: { add() {}, remove() {}, contains() { return false; } },
    setAttribute() {},
    getAttribute() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    firstElementChild: null,
  };
  // Capture the markup assignment without letting it vanish into a plain field.
  Object.defineProperty(container, 'innerHTML', {
    get() { return captured.html || ''; },
    set(v) { captured.html = v; },
  });

  const styleEl = {
    set id(v) { captured.styleId = v; },
    get id() { return captured.styleId; },
    set textContent(v) { captured.styleText = v; },
    get textContent() { return captured.styleText; },
  };

  const document = {
    getElementById(id) { return id === containerId ? container : null; },
    createElement(tag) { return tag === 'style' ? styleEl : { style: {}, setAttribute() {} }; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    head: { appendChild() {} },
    body: {
      style: {},
      getAttribute(name) { return Object.prototype.hasOwnProperty.call(bodyAttrs, name) ? bodyAttrs[name] : null; },
    },
  };

  const window = {
    document,
    location: { pathname },
    addEventListener() {},
    innerHeight: 800,
    matchMedia() { return { matches: false, addEventListener() {} }; },
  };
  window.window = window;

  return { sandbox: { window, document, console }, captured };
}

/** Runs a component file against the stub and returns its markup and styles. */
function render(componentFile, opts) {
  const code = fs.readFileSync(path.join(REPO, componentFile), 'utf8');
  const { sandbox, captured } = makeStub(opts);
  vm.createContext(sandbox);
  try {
    vm.runInContext(code, sandbox, { filename: componentFile, timeout: 10000 });
  } catch (err) {
    throw new Error(`${componentFile} threw while pre-rendering: ${err.message}`);
  }
  if (!captured.html) {
    throw new Error(
      `${componentFile} produced no markup for #${opts.containerId}. The DOM stub in ` +
      `scripts/render-components.js no longer matches what the component reaches for.`
    );
  }
  return captured;
}

/** URL path a published file is served at — decides nav active state at runtime. */
function pathnameFor(rel) {
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404';
  if (/^esa\/[a-z-]+\/index\.html$/.test(rel)) return '/' + rel.replace(/index\.html$/, '');
  return '/' + rel.replace(/\.html$/, '');
}

const NAV_CONTAINER = /<div id="wizkoo-nav"><\/div>/;
const FOOTER_CONTAINER = /<div id="site-footer"><\/div>/;

/**
 * Inlines nav and footer markup into every published HTML file under outDir.
 * Returns a per-file record for the build report.
 */
function inlineInto(outDir, files) {
  // The nav is identical on every page; render it once.
  const nav = render('components/nav.js', {
    containerId: 'wizkoo-nav', pathname: '/', bodyAttrs: {},
  });

  // The footer varies by one attribute, so render one copy per treatment.
  const footerCache = new Map();
  const footerFor = (treatment) => {
    if (!footerCache.has(treatment)) {
      footerCache.set(treatment, render('components/footer.js', {
        containerId: 'site-footer',
        pathname: '/',
        bodyAttrs: { 'data-footer-treatment': treatment },
      }));
    }
    return footerCache.get(treatment);
  };

  const results = [];
  for (const rel of files) {
    if (!rel.endsWith('.html')) continue;
    const file = path.join(outDir, rel);
    let html = fs.readFileSync(file, 'utf8');

    const hasNav = NAV_CONTAINER.test(html);
    const hasFooter = FOOTER_CONTAINER.test(html);
    if (!hasNav && !hasFooter) { results.push({ rel, nav: false, footer: false }); continue; }

    if (hasNav) {
      html = html.replace(NAV_CONTAINER,
        '<div id="wizkoo-nav">\n' +
        `<style id="${nav.styleId}">${nav.styleText}</style>\n` +
        nav.html + '\n</div>');
    }

    if (hasFooter) {
      const m = html.match(/<body[^>]*\bdata-footer-treatment="([^"]*)"/);
      const treatment = (m ? m[1] : 'a').toLowerCase();
      const footer = footerFor(treatment);
      html = html.replace(FOOTER_CONTAINER,
        '<div id="site-footer">\n' +
        `<style id="${footer.styleId}">${footer.styleText}</style>\n` +
        footer.html + '\n</div>');
    }

    fs.writeFileSync(file, html);
    results.push({ rel, nav: hasNav, footer: hasFooter, pathname: pathnameFor(rel) });
  }
  return results;
}

module.exports = { inlineInto, render, pathnameFor };
