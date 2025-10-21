require('dotenv').config();

const PreviewBranchCreator = require('../scripts/createPreviewBranches.js');

const PREVIEW_SECRET = process.env.PREVIEW_WEBHOOK_SECRET || '';

// Allow long running job (up to 15 minutes)
module.exports.config = { maxDuration: 900 };

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

    const { rowIndex, business_name, processAll } = req.body || {};

    const creator = new PreviewBranchCreator();

    if (rowIndex || business_name) {
      const data = await creator.readData();
      let row;
      if (rowIndex) {
        row = data[Number(rowIndex) - 1];
      } else if (business_name) {
        row = data.find(
          (r) => (r.business_name || '').toLowerCase() === String(business_name).toLowerCase()
        );
      }

      if (!row) {
        res.status(404).json({ error: 'Row not found' });
        return;
      }

      const result = await creator.processBusiness(row, 0);
      res.status(200).json({ ok: true, result });
      return;
    }

    if (processAll === true) {
      await creator.run();
      res.status(200).json({ ok: true });
      return;
    }

    // Default: require explicit rowIndex/business_name to avoid long executions
    res.status(400).json({ error: 'Provide rowIndex or business_name, or set processAll=true' });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Internal error' });
  }
};


