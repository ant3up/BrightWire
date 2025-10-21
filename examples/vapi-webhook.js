/**
 * Vapi Webhook Integration Example
 * 
 * This example shows how to integrate the preview creation system
 * with Vapi for automated business preview generation.
 */

const fetch = require('node-fetch');

/**
 * Vapi webhook handler for creating business previews
 * 
 * Expected Vapi payload:
 * {
 *   "conversation": {
 *     "id": "conv_123",
 *     "status": "ended"
 *   },
 *   "call": {
 *     "id": "call_456",
 *     "status": "ended"
 *   },
 *   "business": {
 *     "name": "ABC Electrical",
 *     "phone": "0412 345 678",
 *     "address": "123 Main St",
 *     "suburb": "Melbourne",
 *     "wants_preview": true
 *   }
 * }
 */
async function handleVapiWebhook(req, res) {
  try {
    const { business } = req.body;

    // Validate business data
    if (!business || !business.name || !business.phone) {
      return res.status(400).json({
        error: 'Invalid business data',
        message: 'Business name and phone are required'
      });
    }

    // Only create preview if business wants it
    if (!business.wants_preview) {
      return res.status(200).json({
        message: 'Business does not want preview',
        business_name: business.name
      });
    }

    console.log(`🎯 Vapi webhook: Creating preview for ${business.name}`);

    // Call the preview creation API
    const response = await fetch(`${process.env.API_BASE_URL}/api/create-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      },
      body: JSON.stringify({
        business_name: business.name,
        phone: business.phone,
        address: business.address || '',
        suburb: business.suburb || ''
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Preview created: ${result.preview_url}`);
      
      // Optional: Send preview URL back to Vapi or customer
      await sendPreviewToCustomer(business.phone, result.preview_url);
      
      return res.status(200).json({
        success: true,
        preview_url: result.preview_url,
        business_name: business.name
      });
    } else {
      console.error(`❌ Preview creation failed: ${result.error}`);
      
      return res.status(500).json({
        success: false,
        error: result.error,
        business_name: business.name
      });
    }

  } catch (error) {
    console.error('❌ Vapi webhook error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message
    });
  }
}

/**
 * Send preview URL to customer via SMS
 * @param {string} phone - Customer phone number
 * @param {string} previewUrl - Preview URL to send
 */
async function sendPreviewToCustomer(phone, previewUrl) {
  try {
    // Example SMS service integration
    const smsResponse = await fetch('https://api.sms-service.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SMS_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phone,
        message: `Your personalized website preview is ready! View it here: ${previewUrl}`
      })
    });

    if (smsResponse.ok) {
      console.log(`📱 SMS sent to ${phone}`);
    } else {
      console.error(`❌ SMS failed for ${phone}`);
    }
  } catch (error) {
    console.error('❌ SMS error:', error.message);
  }
}

/**
 * Example Vapi conversation flow:
 * 
 * 1. Customer calls Vapi number
 * 2. Vapi collects business information
 * 3. Vapi asks if they want a preview
 * 4. If yes, Vapi calls this webhook
 * 5. Webhook creates preview and sends URL
 * 6. Customer receives SMS with preview link
 */

module.exports = {
  handleVapiWebhook,
  sendPreviewToCustomer
};

/**
 * Environment variables needed for Vapi integration:
 * 
 * VAPI_WEBHOOK_URL=https://your-domain.com/api/vapi-webhook
 * API_BASE_URL=https://your-domain.com
 * API_TOKEN=your_api_token
 * SMS_API_TOKEN=your_sms_token
 * 
 * Vapi webhook configuration:
 * - URL: https://your-domain.com/api/vapi-webhook
 * - Method: POST
 * - Headers: Content-Type: application/json
 * - Authentication: Bearer token (optional)
 */
