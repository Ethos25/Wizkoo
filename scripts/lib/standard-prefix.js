'use strict';
/**
 * Wizkoo Library — standard code ↔ framework
 * ────────────────────────────────────────────────────────────────────────────
 * One source of truth for "which framework does this standard code belong to".
 * Used by the two importers (scripts/import-library.js, import-library-pg.js)
 * and by the guard (scripts/check-standard-types.js).
 *
 * The framework is read from the code's own prefix. It is never assumed.
 * Guessing is what published NGSS codes as Common Core: hyphen-form codes
 * ("NGSS-2-LS4-1") matched no branch and fell through to a CCSS default.
 */

/* Accepted separators after the framework name: ":" strips the prefix (the
 * rest is the code), "." and "-" keep the full string as the code. */
const SEPARATORS = [':', '.', '-'];
const FRAMEWORKS = ['NGSS', 'CCSS'];

/**
 * Framework a code declares through its own prefix.
 * @returns {'NGSS'|'CCSS'|null} null when the code carries no framework prefix
 *   (e.g. "3-LS1-1", written by a colon-form CSV cell that stripped it).
 */
function frameworkFromCode(code) {
  const t = String(code || '').trim().toUpperCase();
  for (const fw of FRAMEWORKS) {
    for (const sep of SEPARATORS) {
      if (t.startsWith(fw + sep)) return fw;
    }
  }
  return null;
}

/**
 * Parse a CSV standards cell entry into { code, type }.
 * Throws on an unrecognised prefix — the importer must stop rather than guess.
 *
 *   "NGSS:3-LS1-1"             → { code: "3-LS1-1",             type: "NGSS" }
 *   "NGSS.3-LS4-3"             → { code: "NGSS.3-LS4-3",        type: "NGSS" }
 *   "NGSS-2-LS4-1"             → { code: "NGSS-2-LS4-1",        type: "NGSS" }
 *   "CCSS.ELA-LITERACY.RL.K.2" → { code: "CCSS.ELA-...RL.K.2",  type: "CCSS" }
 */
function parseStandard(raw) {
  const t = String(raw).trim();
  for (const fw of FRAMEWORKS) {
    if (t.startsWith(fw + ':')) return { code: t.slice(fw.length + 1).trim(), type: fw };
    if (t.startsWith(fw + '.') || t.startsWith(fw + '-')) return { code: t, type: fw };
  }
  throw new Error(
    `Unrecognised standard prefix: "${raw}". Every standard must begin with ` +
    `NGSS or CCSS followed by ":", "." or "-". The importer will not guess a framework.`
  );
}

/**
 * Validate every standards cell in a CSV before anything is written.
 * @param {string[][]} dataRows  CSV rows, header already removed
 * @param {number} standardsCol  0-based index of the standards column
 * @param {number} titleCol      0-based index of the title column
 * @param {(s: string) => string[]} splitList  the caller's list splitter
 * @returns {string[]} one message per offending value; empty means clean
 */
function preflightStandards(dataRows, standardsCol, titleCol, splitList) {
  const problems = [];
  dataRows.forEach((cols, i) => {
    const cell  = (cols[standardsCol] || '').trim();
    const title = (cols[titleCol] || '').trim();
    for (const entry of splitList(cell)) {
      try { parseStandard(entry); }
      catch (e) { problems.push(`Row ${i + 2} "${title}": ${e.message}`); }
    }
  });
  return problems;
}

module.exports = { parseStandard, frameworkFromCode, preflightStandards };
