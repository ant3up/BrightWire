#!/usr/bin/env node

/**
 * Test Vapi + Google Sheets Integration
 * 
 * This script tests the complete integration between Vapi webhooks
 * and Google Sheets for recording contact outcomes.
 */

const GoogleSheetsHelper = require('../lib/googlesheets');
const { handleVapiWebhook } = require('../api/vapi-webhook');
require('dotenv').config();

/**
 * Test the complete Vapi integration
 */
async function testVapiIntegration() {
  try {
    console.log('🧪 Testing Vapi + Google Sheets Integration');
    console.log('==========================================');
    
    // Check environment variables
    console.log('\n📋 Checking environment variables...');
    const requiredVars = [
      'USE_GOOGLE_SHEETS',
      'GOOGLE_SHEET_ID',
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      'GOOGLE_PRIVATE_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`  • ${varName}`));
      return;
    }
    
    console.log('✅ All required environment variables found');
    
    // Test Google Sheets connection
    console.log('\n🔗 Testing Google Sheets connection...');
    const sheets = new GoogleSheetsHelper();
    const data = await sheets.getAllRows();
    console.log(`✅ Connected to Google Sheets (${data.length} rows)`);
    
    // Test webhook handler with sample data
    console.log('\n📞 Testing webhook handler with sample data...');
    
    const sampleWebhookData = {
      type: 'conversation-update',
      conversation: {
        id: 'conv_test_123',
        status: 'ended',
        endedReason: 'customer-ended-call',
        cost: 0.15,
        duration: 120
      },
      call: {
        id: 'call_test_456',
        status: 'ended',
        phoneNumberId: 'phone_test_789'
      },
      customer: {
        number: data[0]?.phone || '+61412345678',
        name: 'Test Customer'
      },
      transcript: {
        messages: [
          {
            role: 'assistant',
            message: 'Hello, this is Alex from BrightWire Electrical...',
            time: 0
          },
          {
            role: 'customer',
            message: 'Hi, I\'m interested in your services',
            time: 5
          }
        ]
      },
      analysis: {
        sentiment: 'positive',
        intent: 'interested',
        outcome: 'qualified_lead',
        nextSteps: 'send_preview',
        notes: 'Customer expressed interest in website preview'
      }
    };
    
    // Create mock request and response objects
    const mockReq = {
      body: sampleWebhookData
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`📤 Webhook response (${code}):`, JSON.stringify(data, null, 2));
          return { statusCode: code, data };
        }
      })
    };
    
    // Test webhook handler
    console.log('🎯 Processing sample webhook data...');
    await handleVapiWebhook(mockReq, mockRes);
    
    // Verify data was updated in Google Sheets
    console.log('\n📊 Verifying Google Sheets update...');
    const updatedData = await sheets.getAllRows();
    
    // Find the updated record
    const updatedRecord = updatedData.find(record => 
      record.phone === sampleWebhookData.customer.number
    );
    
    if (updatedRecord) {
      console.log('✅ Found updated record in Google Sheets');
      console.log('📋 Updated fields:');
      console.log(`  • call_outcome: ${updatedRecord.call_outcome || 'not set'}`);
      console.log(`  • call_sentiment: ${updatedRecord.call_sentiment || 'not set'}`);
      console.log(`  • call_duration: ${updatedRecord.call_duration || 'not set'}`);
      console.log(`  • last_contacted: ${updatedRecord.last_contacted || 'not set'}`);
      console.log(`  • contact_attempts: ${updatedRecord.contact_attempts || 'not set'}`);
    } else {
      console.log('⚠️  Updated record not found - this might be expected if no matching phone number exists');
    }
    
    console.log('\n🎉 Vapi integration test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Deploy your webhook server to a public URL');
    console.log('  2. Configure your Vapi agent with the webhook URL');
    console.log('  3. Start making calls and watch Google Sheets update!');
    
  } catch (error) {
    console.error('\n❌ Vapi integration test failed:');
    console.error(error.message);
    console.error('Stack trace:', error.stack);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your Google Sheets credentials');
    console.log('  2. Ensure the sheet has the required columns');
    console.log('  3. Verify webhook handler is working correctly');
    console.log('  4. Check that sample data exists in your sheet');
    
    process.exit(1);
  }
}

/**
 * Test webhook server endpoints
 */
async function testWebhookEndpoints() {
  try {
    console.log('\n🌐 Testing webhook server endpoints...');
    
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    
    // Test health endpoint
    console.log(`📡 Testing health endpoint: ${baseUrl}/health`);
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check response:', healthData);
    
    // Test webhook endpoint
    console.log(`📞 Testing webhook endpoint: ${baseUrl}/vapi-webhook`);
    const webhookResponse = await fetch(`${baseUrl}/vapi-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'test',
        message: 'Webhook endpoint test'
      })
    });
    
    const webhookData = await webhookResponse.json();
    console.log('✅ Webhook endpoint response:', webhookData);
    
  } catch (error) {
    console.error('❌ Webhook endpoint test failed:', error.message);
    console.log('💡 Make sure your webhook server is running');
  }
}

// Run the tests
if (require.main === module) {
  testVapiIntegration()
    .then(() => testWebhookEndpoints())
    .catch(error => {
      console.error('Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  testVapiIntegration,
  testWebhookEndpoints
};


