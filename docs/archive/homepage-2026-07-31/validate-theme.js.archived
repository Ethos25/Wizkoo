'use strict';
/**
 * POST /api/validate-theme  { "theme": "dinosaurs", "clientBlocked": false }
 *
 * Layer 2 — server-side blocklist
 * Layer 3 — OpenAI Moderation API  (requires OPENAI_API_KEY)
 *
 * Logging — Notion primary, file fallback (non-blocking, 1-second cap)
 *   NOTION_API_KEY            Notion integration token
 *   NOTION_MODERATION_DB_ID   Notion database ID
 *   IP_HASH_SALT              Secret salt for IP hashing (required; rotate periodically)
 *   OPENAI_API_KEY            OpenAI key for Layer 3
 *
 * File fallback order: /var/log/wizkoo/moderation.log → /tmp/wizkoo-moderation.log
 * On Netlify /var/log is not writable; the /tmp path will always be used there.
 * Replace with Supabase / S3 append for durable persistence.
 *
 * WIRING LAYER 1 LOGS FROM THE CLIENT (index.html capture listener):
 *   After showThemeError(), fire-and-forget:
 *     fetch('/api/validate-theme', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ theme: val, clientBlocked: true }),
 *     }).catch(() => {});
 *   The server re-validates (will also block) and logs layer = "client_blocklist".
 *
 * VERCEL BACKEND (wizkoo-plan-generator):
 *   Copy isBlocked() + BLOCKLIST to the /plan/onboarding handler.
 *   Run before processing query params. Return 400 "Invalid theme." on hit.
 *   Never expose the matched term.
 */

const https  = require('https');
const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/* ── Blocklist ───────────────────────────────────────────────────────────── */
const BLOCKLIST = [
  /* sexual */
  'sexy','sexual','porn','pornographic','nude','naked',
  'masturbat','orgasm','ejaculat','erection','boner','hardon',
  'penis','vagina','vulva','clitoris','anus','anal','rectum',
  'cock','dick','pussy','cunt','tit','boob','nipple',
  'testicles','scrotum',
  'butthole','asshole','arsehole','blowjob','handjob',
  'rimjob','rimming','fellatio','cunnilingus',
  'threesome','orgy','gangbang','incest','pedophil','pedo',
  'bestiality','zoophilia','hentai','lolicon','shotacon',
  'rape','molest','grope','fondle',
  'stripper','escort','prostitut','whore','slut','skank','hooker',
  'dildo','vibrator',
  'cum','cumshot','jizz','jism','semen',
  'fuck','fucker','fucking','fuk','phuck','fvck',
  'shit','crap','piss',
  'bitch','bastard','wank','wanker','twat','tosser',
  'smut','pervert','fetish','lewd',
  'nudes','sexting','onlyfans','camgirl','camboy',
  'xxx','xrated','x-rated',
  /* drugs */
  'cocaine','heroin','meth','methamphetamine','crack',
  'lsd','mdma','ecstasy','fentanyl','opioid',
  'ketamine','psilocybin','shrooms',
  'marijuana','cannabis','stoner','bong','blunt','spliff',
  'drugs','druggie','junkie',
  /* violence / self-harm */
  'self-harm','selfharm','self harm',
  'gore','decapitat','dismember','mutilat','massacre','genocide',
  'terrorist','terrorism','snuff',
  'kill yourself','hang yourself',
  /* hate speech */
  'nigger','nigga','faggot','kike','spic','chink',
  'gook','wetback','tranny','retard',
  /* hateful figures / ideologies */
  'hitler','nazi','kkk','white power','white supremac',
  'heil','antisemit',
];

/* Exact-match only — allows "sex education", "gun safety", etc. to pass */
const BLOCKLIST_EXACT = [
  'sex','gun','rifle','pistol','bomb','grenade','explosive',
  'cutting','hanging','overdose',
  'murder','suicide','weed',
];

function normalizeLeet(s) {
  return s.toLowerCase()
    .replace(/0/g,'o').replace(/3/g,'e').replace(/1/g,'i')
    .replace(/4/g,'a').replace(/5/g,'s').replace(/@/g,'a')
    .replace(/!/g,'i').replace(/\$/g,'s').replace(/7/g,'t');
}

function isBlocked(val) {
  const n = normalizeLeet(val.trim());
  for (const term of BLOCKLIST) {
    const esc = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp('\\b' + esc, 'i').test(n)) return true;
  }
  return false;
}

function isExactBlocked(val) {
  const n = normalizeLeet(val.trim());
  return BLOCKLIST_EXACT.includes(n);
}

/* ── IP hashing ──────────────────────────────────────────────────────────── */
function hashIP(ip) {
  const salt = process.env.IP_HASH_SALT || 'CHANGE-THIS-SALT-IN-ENV';
  return crypto
    .createHash('sha256')
    .update(salt + (ip || '').split(',')[0].trim())
    .digest('hex')
    .slice(0, 32);
}

/* ── HTTPS helper ────────────────────────────────────────────────────────── */
function httpsPost(hostname, urlPath, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyObj);
    const req  = https.request({
      hostname, path: urlPath, method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data || 'null'));
        else reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
      });
    });
    req.on('error', reject);
    req.setTimeout(4000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

/* ── Notion logging ──────────────────────────────────────────────────────── */
function logToNotion({ ts, theme, layer, aiScore, ipHash, ua }) {
  const token = process.env.NOTION_API_KEY;
  const dbId  = process.env.NOTION_MODERATION_DB_ID;
  if (!token || !dbId) return Promise.reject(new Error('Notion env vars not set'));

  const properties = {
    Theme:       { title:     [{ text: { content: String(theme).slice(0, 2000) } }] },
    Timestamp:   { date:      { start: ts } },
    Layer:       { select:    { name: layer } },
    'IP Hash':   { rich_text: [{ text: { content: ipHash } }] },
    'User Agent':{ rich_text: [{ text: { content: ua } }] },
    Status:      { select:    { name: 'new' } },
  };
  if (aiScore != null) properties['AI Score'] = { number: aiScore };

  return httpsPost('api.notion.com', '/v1/pages',
    { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' },
    { parent: { database_id: dbId }, properties },
  );
}

/* ── File fallback ───────────────────────────────────────────────────────── */
function logToFile(entry) {
  const line    = JSON.stringify(entry) + '\n';
  const targets = ['/var/log/wizkoo/moderation.log', '/tmp/wizkoo-moderation.log'];
  for (const p of targets) {
    try {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.appendFileSync(p, line);
      return;
    } catch (_) { /* try next */ }
  }
}

/* ── Orchestrate: Notion primary, file fallback, 1-second cap ───────────── */
async function logRejection({ theme, layer, aiScore, ip, ua }) {
  const entry = {
    ts:      new Date().toISOString(),
    theme:   String(theme).slice(0, 200),
    layer,
    aiScore: aiScore ?? null,
    ipHash:  hashIP(ip),
    ua:      String(ua || '').slice(0, 100),
    status:  'new',
  };
  try {
    await Promise.race([
      logToNotion(entry),
      new Promise((_, rej) => setTimeout(() => rej(new Error('log timeout')), 1000)),
    ]);
  } catch (_) {
    logToFile(entry); // synchronous fallback — always completes
  }
}

/* ── Layer 3: OpenAI Moderation ─────────────────────────────────────────── */
function checkOpenAI(theme) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Promise.resolve({ flagged: false });
  return httpsPost(
    'api.openai.com', '/v1/moderations',
    { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    { input: theme },
  ).then(json => {
    const result = json && json.results && json.results[0];
    if (!result) return { flagged: false };
    const scores  = result.category_scores || {};
    const topScore = Math.max(0, ...Object.values(scores));
    return { flagged: result.flagged || topScore > 0.5, scores, topScore };
  }).catch(() => ({ flagged: false })); // don't block on API error
}

/* ── Handler ─────────────────────────────────────────────────────────────── */
exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let theme, clientBlocked;
  try {
    ({ theme, clientBlocked } = JSON.parse(event.body || '{}'));
  } catch (_) {
    return { statusCode: 400, headers: JSON_HEADERS,
             body: JSON.stringify({ ok: false, message: 'Invalid theme.' }) };
  }

  if (!theme || typeof theme !== 'string' || !theme.trim()) {
    return { statusCode: 400, headers: JSON_HEADERS,
             body: JSON.stringify({ ok: false, message: 'Invalid theme.' }) };
  }

  const ip = (event.headers['x-forwarded-for'] || event.headers['client-ip'] || '');
  const ua = (event.headers['user-agent'] || '').slice(0, 100);

  /* Layer 2 — server-side blocklist.
     If clientBlocked is true the client already showed the error; we still
     re-validate (cannot trust client) and log as "client_blocklist" so the
     layer field accurately reflects where it was first caught. */
  if (isBlocked(theme) || isExactBlocked(theme)) {
    const layer = clientBlocked ? 'client_blocklist' : 'server_blocklist';
    await logRejection({ theme, layer, ip, ua });
    return { statusCode: 400, headers: JSON_HEADERS,
             body: JSON.stringify({ ok: false, message: 'Invalid theme.' }) };
  }

  /* Layer 3 — AI moderation */
  const modResult = await checkOpenAI(theme);
  if (modResult.flagged) {
    await logRejection({ theme, layer: 'ai_moderation', aiScore: modResult.topScore, ip, ua });
    return { statusCode: 400, headers: JSON_HEADERS,
             body: JSON.stringify({ ok: false, message: 'Invalid theme.' }) };
  }

  return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) };
};
