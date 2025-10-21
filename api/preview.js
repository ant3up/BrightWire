const PREVIEW_SECRET = process.env.PREVIEW_WEBHOOK_SECRET || '';

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

    // Simple webhook that just acknowledges the request
    // The actual processing should be done via GitHub Actions or a separate service
    res.status(200).json({ 
      ok: true, 
      message: 'Webhook received. Use local script or GitHub Actions for actual processing.',
      rowIndex,
      business_name
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
};


