// Vercel serverless function. Receives form submissions from public/index.html
// and creates a GitHub issue in the right client repo.
//
// Required environment variables (set in the Vercel project dashboard):
//   GITHUB_TOKEN    - fine-grained PAT, scope: only the client repos, Issues: read/write
//   CLIENT_REPOS    - JSON: {"krips":"etcp-clients/krips-site","advocis":"etcp-clients/advocis-site"}
//   ALLOWED_ORIGIN  - the form's public URL, e.g. https://updates.example.com

const MAX_LEN = 5000;

function bad(res, status, message) {
  return res.status(status).json({ error: message });
}

function escapeForMarkdown(s) {
  return String(s).replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'));
}

export default async function handler(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return bad(res, 405, 'Method not allowed');

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { client, name, email, page, description, urgency, website_url } = body;

  // Honeypot: real users leave this empty. Bots fill it.
  if (website_url) return res.status(200).json({ ok: true });

  if (!client || !name || !email || !page || !description || !urgency) {
    return bad(res, 400, 'Please fill in every field.');
  }
  for (const field of [client, name, email, page, description, urgency]) {
    if (typeof field !== 'string' || field.length > MAX_LEN) {
      return bad(res, 400, 'One of the fields is too long.');
    }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return bad(res, 400, 'That email address does not look right.');
  }

  let repoMap;
  try {
    repoMap = JSON.parse(process.env.CLIENT_REPOS || '{}');
  } catch {
    return bad(res, 500, 'Server misconfigured (CLIENT_REPOS).');
  }
  const repo = repoMap[client];
  if (!repo) return bad(res, 400, 'Unknown client.');

  const token = process.env.GITHUB_TOKEN;
  if (!token) return bad(res, 500, 'Server misconfigured (GITHUB_TOKEN).');

  const urgencyLabels = {
    whenever: 'Whenever you get to it',
    week: 'Within a week',
    '48h': 'Within 48 hours',
    rush: 'Same day (rush)',
  };

  const title = `[Update] ${page.slice(0, 80)}`;
  const issueBody = [
    `**From:** ${escapeForMarkdown(name)} (${escapeForMarkdown(email)})`,
    `**Page / section:** ${escapeForMarkdown(page)}`,
    `**Urgency:** ${urgencyLabels[urgency] || urgency}`,
    '',
    '**Request:**',
    '',
    escapeForMarkdown(description),
    '',
    '---',
    `_Submitted via intake form at ${new Date().toISOString()}._`,
  ].join('\n');

  const ghRes = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'etcp-clients-intake-form',
    },
    body: JSON.stringify({
      title,
      body: issueBody,
      labels: ['update-request', `urgency:${urgency}`],
    }),
  });

  if (!ghRes.ok) {
    const detail = await ghRes.text().catch(() => '');
    console.error('GitHub API error', ghRes.status, detail);
    return bad(res, 502, 'Could not file the request. Please email us instead.');
  }

  return res.status(200).json({ ok: true });
}
