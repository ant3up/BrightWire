/**
 * Vapi Webhook Handler for Recording Contact Outcomes
 * 
 * This webhook receives call outcomes from Vapi and updates Google Sheets
 * with the contact results for each business.
 */

const GoogleSheetsHelper = require('../lib/googlesheets');
require('dotenv').config();

/**
 * Handle Vapi webhook for call outcomes
 * 
 * Expected Vapi payload structure:
 * {
 *   "type": "conversation-update",
 *   "conversation": {
 *     "id": "conv_123",
 *     "status": "ended",
 *     "endedReason": "customer-ended-call",
 *     "cost": 0.15,
 *     "duration": 120
 *   },
 *   "call": {
 *     "id": "call_456",
 *     "status": "ended",
 *     "phoneNumberId": "phone_789"
 *   },
 *   "assistant": {
 *     "id": "assistant_123",
 *     "name": "Sales Agent"
 *   },
 *   "customer": {
 *     "number": "+61412345678",
 *     "name": "John Smith"
 *   },
 *   "transcript": {
 *     "messages": [
 *       {
 *         "role": "assistant",
 *         "message": "Hello, this is Alex from BrightWire Electrical...",
 *         "time": 0
 *       },
 *       {
 *         "role": "customer", 
 *         "message": "Hi, I'm interested in your services",
 *         "time": 5
 *       }
 *     ]
 *   },
 *   "analysis": {
 *     "sentiment": "positive",
 *     "intent": "interested",
 *     "outcome": "qualified_lead",
 *     "nextSteps": "send_preview",
 *     "notes": "Customer expressed interest in website preview"
 *   }
 * }
 */
async function handleVapiWebhook(req, res) {
  try {
    console.log('📞 Vapi webhook received:', JSON.stringify(req.body, null, 2));
    
    const { type, conversation, call, customer, transcript, analysis } = req.body;

    // Handle tool calls from Vapi (function calling)
    if (type === 'tool-calls') {
      return await handleToolCalls(req, res);
    }
    
    // Validate required data
    if (!conversation || !call || !customer) {
      return res.status(400).json({
        error: 'Invalid webhook payload',
        message: 'Missing required fields: conversation, call, or customer'
      });
    }
    
    // Only process conversation updates
    if (type !== 'conversation-update') {
      return res.status(200).json({
        message: 'Webhook type not processed',
        type: type
      });
    }
    
    // Only process ended conversations
    if (conversation.status !== 'ended') {
      return res.status(200).json({
        message: 'Conversation not ended yet',
        status: conversation.status
      });
    }
    
    console.log(`🎯 Processing call outcome for customer: ${customer.number}`);
    
    // Initialize Google Sheets helper
    const sheets = new GoogleSheetsHelper();
    
    // Find the business record by phone number
    const businessData = await findBusinessByPhone(sheets, customer.number);
    
    if (!businessData) {
      console.log(`⚠️  No business found for phone: ${customer.number}`);
      return res.status(404).json({
        error: 'Business not found',
        message: `No business record found for phone number: ${customer.number}`
      });
    }
    
    console.log(`📋 Found business: ${businessData.business_name}`);
    
    // Prepare outcome data
    const outcomeData = {
      call_outcome: analysis?.outcome || 'unknown',
      call_sentiment: analysis?.sentiment || 'neutral',
      call_duration: conversation.duration || 0,
      call_cost: conversation.cost || 0,
      call_ended_reason: conversation.endedReason || 'unknown',
      call_transcript: transcript ? JSON.stringify(transcript.messages) : '',
      call_notes: analysis?.notes || '',
      next_steps: analysis?.nextSteps || '',
      last_contacted: new Date().toISOString(),
      contact_attempts: (parseInt(businessData.contact_attempts) || 0) + 1
    };
    
    // Update the business record
    const updateSuccess = await updateBusinessOutcome(sheets, businessData, outcomeData);
    
    if (updateSuccess) {
      console.log(`✅ Updated contact outcome for ${businessData.business_name}`);
      
      // If this is a qualified lead, trigger preview creation
      if (analysis?.outcome === 'qualified_lead' && analysis?.nextSteps === 'send_preview') {
        console.log(`🚀 Triggering preview creation for qualified lead`);
        await triggerPreviewCreation(businessData, outcomeData);
      }
      
      return res.status(200).json({
        success: true,
        business_name: businessData.business_name,
        outcome: outcomeData.call_outcome,
        message: 'Contact outcome recorded successfully'
      });
    } else {
      console.error(`❌ Failed to update contact outcome for ${businessData.business_name}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to update Google Sheets',
        business_name: businessData.business_name
      });
    }
    
  } catch (error) {
    console.error('❌ Vapi webhook error:', error.message);
    console.error('Stack trace:', error.stack);
    
    return res.status(500).json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message
    });
  }
}

/**
 * Handle Vapi tool calls
 * Expected payload shape:
 * {
 *   type: 'tool-calls',
 *   toolCallList: [{ toolName, argumentsJson, toolCallId }]
 * }
 */
async function handleToolCalls(req, res) {
  try {
    const toolCalls = req.body.toolCallList || [];
    if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
      return res.status(400).json({ error: 'No tool calls provided' });
    }

    const sheets = new GoogleSheetsHelper();
    const results = [];

    for (const call of toolCalls) {
      const toolName = call.toolName || call.name;
      let args = {};
      try {
        // Vapi generally sends arguments as JSON string
        if (typeof call.argumentsJson === 'string') {
          args = JSON.parse(call.argumentsJson);
        } else if (call.arguments) {
          args = call.arguments;
        }
      } catch (e) {
        args = {};
      }

      switch (toolName) {
        case 'record_contact_outcome': {
          const outcomePayload = await toolRecordContactOutcome(sheets, args);
          results.push({ toolCallId: call.toolCallId, result: outcomePayload });
          break;
        }
        case 'send_preview_to_customer': {
          const payload = await toolSendPreviewToCustomer(args);
          results.push({ toolCallId: call.toolCallId, result: payload });
          break;
        }
        case 'mark_do_not_call': {
          const payload = await toolMarkOutcomeFlag(sheets, args, 'do_not_call');
          results.push({ toolCallId: call.toolCallId, result: payload });
          break;
        }
        case 'mark_wrong_number': {
          const payload = await toolMarkOutcomeFlag(sheets, args, 'wrong_number');
          results.push({ toolCallId: call.toolCallId, result: payload });
          break;
        }
        case 'schedule_follow_up': {
          const payload = await toolScheduleFollowUp(sheets, args);
          results.push({ toolCallId: call.toolCallId, result: payload });
          break;
        }
        default: {
          results.push({ toolCallId: call.toolCallId, error: `Unknown tool: ${toolName}` });
        }
      }
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error('❌ Tool-calls handler error:', error.message);
    return res.status(500).json({ error: 'Tool-calls processing failed', message: error.message });
  }
}

async function toolRecordContactOutcome(sheets, args) {
  const {
    outcome,
    sentiment,
    next_steps: nextSteps,
    notes,
    interest_level: interestLevel,
    business_name: businessName,
    contact_person: contactPerson,
    phone_number: phoneNumber
  } = args || {};

  if (!outcome || (!phoneNumber && !businessName)) {
    return { ok: false, error: 'Missing required arguments' };
  }

  // Find business by phone first, fallback by name
  let business = null;
  if (phoneNumber) {
    business = await findBusinessByPhone(sheets, phoneNumber);
  }
  if (!business && businessName) {
    const all = await sheets.getAllRows();
    business = all.find(b => (b.business_name || '').toLowerCase() === businessName.toLowerCase()) || null;
  }
  if (!business) {
    return { ok: false, error: 'Business not found' };
  }

  const updates = {
    call_outcome: outcome,
    call_sentiment: sentiment || 'neutral',
    next_steps: nextSteps || '',
    call_notes: notes || '',
    last_contacted: new Date().toISOString(),
    contact_attempts: (parseInt(business.contact_attempts) || 0) + 1
  };
  if (interestLevel) updates.interest_level = interestLevel;
  if (contactPerson) updates.contact_person = contactPerson;

  // Update wants_preview to 'yes' if client agrees to preview
  if (outcome === 'qualified_lead' && nextSteps === 'send_preview') {
    updates.wants_preview = 'yes';
  }

  const allBusinesses = await sheets.getAllRows();
  const rowIndex = allBusinesses.findIndex(b => b.id === business.id) + 2;
  const ok = rowIndex > 1 && await sheets.updateRow(rowIndex, updates);

  // Trigger preview if qualified
  if (ok && outcome === 'qualified_lead' && nextSteps === 'send_preview') {
    try {
      await triggerPreviewCreation(business, updates);
    } catch (e) {
      // non-fatal
    }
  }

  return { ok: !!ok, business_name: business.business_name, updates };
}

async function toolSendPreviewToCustomer(args) {
  const { phone_number: phoneNumber, preview_url: previewUrl, business_name: businessName } = args || {};
  if (!phoneNumber || !previewUrl) {
    return { ok: false, error: 'phone_number and preview_url are required' };
  }
  try {
    await sendPreviewToCustomer(phoneNumber, previewUrl, businessName || 'there');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function toolMarkOutcomeFlag(sheets, args, outcomeValue) {
  const { phone_number: phoneNumber, business_name: businessName } = args || {};
  if (!phoneNumber && !businessName) {
    return { ok: false, error: 'Provide phone_number or business_name' };
  }
  let business = null;
  if (phoneNumber) {
    business = await findBusinessByPhone(sheets, phoneNumber);
  }
  if (!business && businessName) {
    const all = await sheets.getAllRows();
    business = all.find(b => (b.business_name || '').toLowerCase() === businessName.toLowerCase()) || null;
  }
  if (!business) return { ok: false, error: 'Business not found' };
  const all = await sheets.getAllRows();
  const rowIndex = all.findIndex(b => b.id === business.id) + 2;
  const ok = rowIndex > 1 && await sheets.updateRow(rowIndex, {
    call_outcome: outcomeValue,
    last_contacted: new Date().toISOString(),
    contact_attempts: (parseInt(business.contact_attempts) || 0) + 1
  });
  return { ok: !!ok, business_name: business.business_name, outcome: outcomeValue };
}

async function toolScheduleFollowUp(sheets, args) {
  const { phone_number: phoneNumber, business_name: businessName, when_iso: whenIso } = args || {};
  if (!phoneNumber && !businessName) return { ok: false, error: 'Provide phone_number or business_name' };
  let business = null;
  if (phoneNumber) {
    business = await findBusinessByPhone(sheets, phoneNumber);
  }
  if (!business && businessName) {
    const all = await sheets.getAllRows();
    business = all.find(b => (b.business_name || '').toLowerCase() === businessName.toLowerCase()) || null;
  }
  if (!business) return { ok: false, error: 'Business not found' };
  const all = await sheets.getAllRows();
  const rowIndex = all.findIndex(b => b.id === business.id) + 2;
  const ok = rowIndex > 1 && await sheets.updateRow(rowIndex, {
    next_steps: 'follow_up_call',
    follow_up_at: whenIso || '',
    last_contacted: new Date().toISOString(),
    contact_attempts: (parseInt(business.contact_attempts) || 0) + 1
  });
  return { ok: !!ok, business_name: business.business_name, follow_up_at: whenIso || '' };
}

/**
 * Find business record by phone number
 * @param {GoogleSheetsHelper} sheets - Google Sheets helper instance
 * @param {string} phoneNumber - Customer phone number
 * @returns {Promise<Object|null>} Business record or null
 */
async function findBusinessByPhone(sheets, phoneNumber) {
  try {
    const allBusinesses = await sheets.getAllRows();
    
    // Normalize phone number for comparison
    const normalizedPhone = phoneNumber.replace(/[^\d]/g, '');
    
    const business = allBusinesses.find(biz => {
      if (!biz.phone) return false;
      
      // Normalize stored phone number
      const normalizedStored = biz.phone.replace(/[^\d]/g, '');
      
      // Check if phone numbers match (with or without country code)
      return normalizedStored === normalizedPhone || 
             normalizedStored === normalizedPhone.slice(-10) ||
             normalizedPhone === normalizedStored.slice(-10);
    });
    
    return business || null;
  } catch (error) {
    console.error('❌ Error finding business by phone:', error.message);
    return null;
  }
}

/**
 * Update business record with contact outcome
 * @param {GoogleSheetsHelper} sheets - Google Sheets helper instance
 * @param {Object} businessData - Business record
 * @param {Object} outcomeData - Contact outcome data
 * @returns {Promise<boolean>} Success status
 */
async function updateBusinessOutcome(sheets, businessData, outcomeData) {
  try {
    // Find the row index for this business
    const allBusinesses = await sheets.getAllRows();
    const rowIndex = allBusinesses.findIndex(biz => biz.id === businessData.id) + 2; // +2 because sheets are 1-indexed and have header row
    
    if (rowIndex === 1) { // +2 - 1 = 1 means not found
      console.error(`❌ Business row not found for ID: ${businessData.id}`);
      return false;
    }
    
    // Update the business record
    const updateSuccess = await sheets.updateRow(rowIndex, outcomeData);
    
    if (updateSuccess) {
      console.log(`✅ Updated row ${rowIndex} with contact outcome`);
      return true;
    } else {
      console.error(`❌ Failed to update row ${rowIndex}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error updating business outcome:`, error.message);
    return false;
  }
}

/**
 * Trigger preview creation for qualified leads
 * @param {Object} businessData - Business record
 * @param {Object} outcomeData - Contact outcome data
 */
async function triggerPreviewCreation(businessData, outcomeData) {
  try {
    console.log(`🎯 Triggering preview creation for ${businessData.business_name}`);
    
    // Call the preview creation API
    const response = await fetch(`${process.env.API_BASE_URL}/api/create-preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_TOKEN}`
      },
      body: JSON.stringify({
        business_name: businessData.business_name,
        phone: businessData.phone,
        address: businessData.address || '',
        suburb: businessData.suburb || '',
        source: 'vapi_call',
        call_outcome: outcomeData.call_outcome,
        call_notes: outcomeData.call_notes
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Preview created: ${result.preview_url}`);
      
      // Send preview URL to customer via SMS
      await sendPreviewToCustomer(businessData.phone, result.preview_url, businessData.business_name);
      
    } else {
      console.error(`❌ Preview creation failed: ${result.error}`);
    }
    
  } catch (error) {
    console.error(`❌ Error triggering preview creation:`, error.message);
  }
}

/**
 * Send preview URL to customer via SMS
 * @param {string} phone - Customer phone number
 * @param {string} previewUrl - Preview URL to send
 * @param {string} businessName - Business name
 */
async function sendPreviewToCustomer(phone, previewUrl, businessName) {
  try {
    console.log(`📱 Sending preview SMS to ${phone}`);
    
    // Example SMS service integration (replace with your SMS provider)
    const smsResponse = await fetch('https://api.sms-service.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SMS_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: phone,
        message: `Hi ${businessName}! Your personalized website preview is ready! View it here: ${previewUrl}`
      })
    });
    
    if (smsResponse.ok) {
      console.log(`✅ SMS sent to ${phone}`);
    } else {
      console.error(`❌ SMS failed for ${phone}`);
    }
  } catch (error) {
    console.error(`❌ SMS error:`, error.message);
  }
}

/**
 * Health check endpoint
 */
async function healthCheck(req, res) {
  return res.status(200).json({
    status: 'healthy',
    service: 'vapi-webhook',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  handleVapiWebhook,
  healthCheck,
  findBusinessByPhone,
  updateBusinessOutcome
};
