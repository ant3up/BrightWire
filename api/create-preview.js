const PreviewBranchCreator = require('../scripts/createPreviewBranches');
const SheetUpdater = require('../scripts/updateSheet');
require('dotenv').config();

/**
 * API endpoint for creating a single business preview
 * Can be called by Vapi or other external services
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { business_name, phone, address, suburb } = req.body;

    // Validate required fields
    if (!business_name || !phone || !address || !suburb) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'business_name, phone, address, and suburb are required',
        example: {
          business_name: 'ABC Electrical',
          phone: '0412 345 678',
          address: '123 Main St',
          suburb: 'Melbourne'
        }
      });
    }

    console.log(`🚀 Creating preview for: ${business_name}`);

    // Create business object
    const business = {
      business_name,
      phone,
      address,
      suburb,
      wants_preview: 'yes'
    };

    // Initialize creator
    const creator = new PreviewBranchCreator();
    
    // Process the business (single business mode)
    const result = await creator.processBusiness(business, 0);

    // Return result
    if (result.status === 'deployed') {
      res.status(200).json({
        success: true,
        business_name: result.business_name,
        preview_url: result.preview_url,
        branch: result.branch,
        status: result.status,
        deployedAt: result.deployedAt
      });
    } else if (result.status === 'failed') {
      res.status(500).json({
        success: false,
        business_name: result.business_name,
        error: result.error,
        status: result.status,
        failedAt: result.failedAt
      });
    } else {
      res.status(200).json({
        success: true,
        business_name: result.business_name,
        preview_url: result.preview_url,
        branch: result.branch,
        status: result.status,
        message: 'Preview created successfully'
      });
    }

  } catch (error) {
    console.error('❌ API Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Example usage with curl:
 * 
 * curl -X POST http://localhost:3000/api/create-preview \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "business_name": "ABC Electrical",
 *     "phone": "0412 345 678",
 *     "address": "123 Main St",
 *     "suburb": "Melbourne"
 *   }'
 * 
 * Example response:
 * {
 *   "success": true,
 *   "business_name": "ABC Electrical",
 *   "preview_url": "https://preview-abc-electrical-abc123.vercel.app",
 *   "branch": "preview/abc-electrical-abc123",
 *   "status": "deployed",
 *   "deployedAt": "2024-01-15T10:30:00.000Z"
 * }
 */
