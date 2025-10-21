const PREVIEW_SECRET = process.env.PREVIEW_WEBHOOK_SECRET || '';
const GITHUB_TOKEN = process.env.GH_TOKEN || '';
const GITHUB_OWNER = process.env.GH_OWNER || '';
const GITHUB_REPO = process.env.GH_REPO || '';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const auth = req.headers['x-preview-secret'];
    if (!PREVIEW_SECRET || auth !== PREVIEW_SECRET) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { rowIndex, business_name } = req.body || {};

    // Trigger GitHub Action
    if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
      const payload = {
        event_type: 'preview-request',
        client_payload: {
          rowIndex: rowIndex ? Number(rowIndex) : undefined,
          business_name: business_name || undefined
        }
      };

      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        res.status(200).json({ 
          ok: true, 
          message: 'GitHub Action triggered successfully',
          rowIndex,
          business_name
        });
        return;
      } else {
        console.error('GitHub API error:', response.status, await response.text());
      }
    }

    // Fallback: just acknowledge
    res.status(200).json({ 
      ok: true, 
      message: 'Webhook received. GitHub Actions not configured.',
      rowIndex,
      business_name
    });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
};


