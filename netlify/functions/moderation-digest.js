'use strict';
/**
 * Netlify Scheduled Function: moderation-digest
 * Runs every Sunday at 14:00 UTC (9:00 AM EST / 10:00 AM EDT).
 * Schedule is set in netlify.toml — do not hardcode it here.
 *
 * Queries the Notion moderation database for all rejections in the past 7 days,
 * generates a plain-text summary + CSV, and emails it to ADMIN_EMAIL.
 *
 * Required env vars:
 *   NOTION_API_KEY              Notion integration token
 *   NOTION_MODERATION_DB_ID     Notion database ID
 *   ADMIN_EMAIL                 Destination for the digest
 *   RESEND_API_KEY              Resend (resend.com) API key for sending email
 *   RESEND_FROM_EMAIL           From address (e.g. moderation@wizkoo.com)
 *                               Must be a verified domain in your Resend account.
 *
 * Swapping email providers:
 *   Replace sendEmail() with any provider that accepts a JSON POST.
 *   SendGrid: POST https://api.sendgrid.com/v3/mail/send  Authorization: Bearer KEY
 *   Mailgun:  POST https://api.mailgun.net/v3/{domain}/messages  (form-encoded)
 */

const https = require('https');

/* ── HTTPS helpers ───────────────────────────────────────────────────────── */
function httpsPost(hostname, urlPath, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(bodyObj);
    const req  = https.request({
      hostname, path: urlPath, method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json',
                 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data || 'null') }); }
        catch (_) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

/* ── Notion: fetch all rejections since a given date (handles pagination) ── */
async function fetchRejections(since) {
  const token = process.env.NOTION_API_KEY;
  const dbId  = process.env.NOTION_MODERATION_DB_ID;
  if (!token || !dbId) throw new Error('Notion env vars not configured');

  const filter = {
    property: 'Timestamp',
    date: { on_or_after: since.toISOString() },
  };

  const rows   = [];
  let cursor   = undefined;
  let hasMore  = true;

  while (hasMore) {
    const payload = { filter, page_size: 100 };
    if (cursor) payload.start_cursor = cursor;

    const { status, body } = await httpsPost(
      'api.notion.com',
      `/v1/databases/${dbId}/query`,
      { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28' },
      payload,
    );

    if (status !== 200) throw new Error(`Notion query failed ${status}: ${JSON.stringify(body)}`);

    for (const page of body.results) {
      const p = page.properties;
      rows.push({
        ts:      p.Timestamp?.date?.start           || '',
        theme:   p.Theme?.title?.[0]?.text?.content || '',
        layer:   p.Layer?.select?.name              || '',
        aiScore: p['AI Score']?.number              ?? null,
        ipHash:  p['IP Hash']?.rich_text?.[0]?.text?.content || '',
        ua:      p['User Agent']?.rich_text?.[0]?.text?.content || '',
        status:  p.Status?.select?.name             || '',
      });
    }

    hasMore = body.has_more;
    cursor  = body.next_cursor || undefined;
  }

  return rows;
}

/* ── Build summary text ──────────────────────────────────────────────────── */
function buildDigest(rows, weekStart, weekEnd) {
  const total = rows.length;

  // Counts per layer
  const byLayer = {};
  for (const r of rows) {
    byLayer[r.layer] = (byLayer[r.layer] || 0) + 1;
  }

  // Theme frequency (case-insensitive)
  const themeCounts = {};
  for (const r of rows) {
    const key = r.theme.toLowerCase().trim();
    if (key) themeCounts[key] = (themeCounts[key] || 0) + 1;
  }
  const sorted   = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);
  const top10    = sorted.slice(0, 10);
  const repeated = sorted.filter(([, n]) => n >= 3);

  // Plain-text body
  const d1 = weekStart.toISOString().slice(0, 10);
  const d2 = weekEnd.toISOString().slice(0, 10);
  const lines = [
    `Wizkoo moderation digest`,
    `Week: ${d1} → ${d2}`,
    `Total rejections: ${total}`,
    '',
    'Rejections by layer:',
    ...Object.entries(byLayer).map(([l, n]) => `  ${l}: ${n}`),
    '',
    'Top 10 rejected themes:',
    ...(top10.length
      ? top10.map(([t, n], i) => `  ${i + 1}. "${t}" — ${n}×`)
      : ['  (none)']),
  ];

  if (repeated.length) {
    lines.push('');
    lines.push('Themes appearing 3+ times (possible bad actors or false positives):');
    for (const [t, n] of repeated) lines.push(`  "${t}" — ${n}×`);
  }

  lines.push('');
  lines.push('Full export attached as CSV.');

  return lines.join('\n');
}

/* ── Build CSV ───────────────────────────────────────────────────────────── */
function buildCSV(rows) {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Timestamp','Theme','Layer','AI Score','IP Hash','User Agent','Status'].join(',');
  const body   = rows.map(r =>
    [r.ts, escape(r.theme), r.layer, r.aiScore ?? '', escape(r.ipHash), escape(r.ua), r.status].join(',')
  ).join('\n');
  return header + '\n' + body;
}

/* ── Send email via Resend ───────────────────────────────────────────────── */
async function sendEmail({ subject, text, csvContent, weekEnd }) {
  const apiKey  = process.env.RESEND_API_KEY;
  const from    = process.env.RESEND_FROM_EMAIL || 'moderation@wizkoo.com';
  const to      = process.env.ADMIN_EMAIL;

  if (!apiKey || !to) throw new Error('RESEND_API_KEY or ADMIN_EMAIL not set');

  const filename = `wizkoo-moderation-${weekEnd.toISOString().slice(0, 10)}.csv`;

  const { status, body } = await httpsPost(
    'api.resend.com', '/emails',
    { Authorization: `Bearer ${apiKey}` },
    {
      from, to: [to],
      subject, text,
      attachments: [{ filename, content: Buffer.from(csvContent).toString('base64') }],
    },
  );

  if (status >= 400) throw new Error(`Resend ${status}: ${JSON.stringify(body)}`);
}

/* ── Handler ─────────────────────────────────────────────────────────────── */
exports.handler = async function() {
  const weekEnd   = new Date();
  const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

  let rows;
  try {
    rows = await fetchRejections(weekStart);
  } catch (err) {
    console.error('[moderation-digest] Notion query failed:', err.message);
    return { statusCode: 500, body: err.message };
  }

  const summaryText = buildDigest(rows, weekStart, weekEnd);
  const csvContent  = buildCSV(rows);
  const subject     = `Wizkoo moderation digest: ${rows.length} rejection${rows.length === 1 ? '' : 's'} this week`;

  try {
    await sendEmail({ subject, text: summaryText, csvContent, weekEnd });
    console.log(`[moderation-digest] Digest sent. ${rows.length} rows.`);
  } catch (err) {
    console.error('[moderation-digest] Email failed:', err.message);
    // Log to stdout so Netlify captures it even if email fails
    console.log('[moderation-digest] Summary:\n', summaryText);
    return { statusCode: 500, body: err.message };
  }

  return { statusCode: 200, body: 'ok' };
};
