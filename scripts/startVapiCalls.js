#!/usr/bin/env node

/**
 * Start Vapi Outbound Calls from Google Sheets
 * 
 * This script reads phone numbers from Google Sheets and initiates
 * outbound calls using your existing Vapi agent.
 */

const GoogleSheetsHelper = require('../lib/googlesheets');
const fetch = require('node-fetch');
require('dotenv').config();

/**
 * Start outbound calls to businesses in Google Sheets
 */
async function startVapiCalls() {
  try {
    console.log('📞 Starting Vapi Outbound Calls from Google Sheets');
    console.log('==================================================');
    
    // Check environment variables
    console.log('\n📋 Checking environment variables...');
    const requiredVars = [
      'VAPI_API_KEY',
      'VAPI_ASSISTANT_ID',
      'VAPI_PHONE_NUMBER_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`  • ${varName}`));
      console.log('\n💡 Add these to your .env file:');
      console.log('VAPI_API_KEY=your_vapi_api_key');
      console.log('VAPI_ASSISTANT_ID=your_assistant_id');
      console.log('VAPI_PHONE_NUMBER_ID=your_phone_number_id');
      return;
    }
    
    console.log('✅ All required environment variables found');
    
    // Check Google Sheets connection
    console.log('\n🔗 Connecting to Google Sheets...');
    const sheets = new GoogleSheetsHelper();
    const businesses = await sheets.getAllRows();
    console.log(`✅ Connected to Google Sheets (${businesses.length} businesses found)`);
    
    // Filter businesses that haven't been called yet
    const businessesToCall = businesses.filter(business => {
      // Skip if no phone number
      if (!business.phone) return false;
      
      // Skip if already called recently (within 24 hours)
      if (business.last_contacted) {
        const lastContact = new Date(business.last_contacted);
        const now = new Date();
        const hoursSinceLastCall = (now - lastContact) / (1000 * 60 * 60);
        if (hoursSinceLastCall < 24) return false;
      }
      
      // Skip if marked as do not call
      if (business.call_outcome === 'do_not_call') return false;
      
      // Skip if wrong number
      if (business.call_outcome === 'wrong_number') return false;
      
      return true;
    });
    
    console.log(`📋 Found ${businessesToCall.length} businesses to call`);
    
    if (businessesToCall.length === 0) {
      console.log('⚠️  No businesses available for calling');
      console.log('💡 Check your Google Sheet for businesses with phone numbers');
      return;
    }
    
    // Ask for confirmation
    console.log('\n📞 Businesses to call:');
    businessesToCall.slice(0, 5).forEach((business, index) => {
      console.log(`  ${index + 1}. ${business.business_name} - ${business.phone}`);
    });
    
    if (businessesToCall.length > 5) {
      console.log(`  ... and ${businessesToCall.length - 5} more`);
    }
    
    console.log('\n⚠️  This will start making actual phone calls!');
    console.log('💡 Make sure your webhook server is running to receive call outcomes');
    
    // Start calling businesses
    console.log('\n🚀 Starting outbound calls...');
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const business of businessesToCall) {
      try {
        console.log(`\n📞 Calling ${business.business_name} (${business.phone})...`);
        
        const callResult = await makeVapiCall(business);
        
        if (callResult.success) {
          console.log(`✅ Call initiated successfully`);
          successCount++;
        } else {
          console.log(`❌ Call failed: ${callResult.error}`);
          errorCount++;
        }
        
        results.push({
          business_name: business.business_name,
          phone: business.phone,
          success: callResult.success,
          call_id: callResult.call_id,
          error: callResult.error
        });
        
        // Wait between calls to avoid rate limiting
        console.log('⏳ Waiting 5 seconds before next call...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error(`❌ Error calling ${business.business_name}:`, error.message);
        errorCount++;
        
        results.push({
          business_name: business.business_name,
          phone: business.phone,
          success: false,
          error: error.message
        });
      }
    }
    
    // Print summary
    console.log('\n📊 Call Summary:');
    console.log(`✅ Successful calls: ${successCount}`);
    console.log(`❌ Failed calls: ${errorCount}`);
    console.log(`📞 Total attempts: ${results.length}`);
    
    // Update Google Sheets with call attempts
    console.log('\n📝 Updating Google Sheets with call attempts...');
    await updateCallAttempts(sheets, results);
    
    console.log('\n🎉 Outbound calling completed!');
    console.log('\n📝 Next steps:');
    console.log('  1. Monitor your webhook server for call outcomes');
    console.log('  2. Check Google Sheets for updated results');
    console.log('  3. Review call transcripts and outcomes');
    
  } catch (error) {
    console.error('\n❌ Failed to start outbound calls:');
    console.error(error.message);
    console.error('Stack trace:', error.stack);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your Vapi API key and assistant ID');
    console.log('  2. Verify Google Sheets connection');
    console.log('  3. Ensure webhook server is running');
    console.log('  4. Check that phone numbers are valid');
    
    process.exit(1);
  }
}

/**
 * Make a Vapi outbound call
 * @param {Object} business - Business data from Google Sheets
 * @returns {Promise<Object>} Call result
 */
async function makeVapiCall(business) {
  try {
    const callData = {
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: business.phone,
        name: business.business_name || 'Business Owner'
      },
      // Add business context to the call
      assistantOverrides: {
        variableValues: {
          business_name: business.business_name,
          business_address: business.address,
          business_suburb: business.suburb,
          business_phone: business.phone
        }
      }
    };
    
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(callData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        call_id: result.id,
        message: 'Call initiated successfully'
      };
    } else {
      return {
        success: false,
        error: result.message || 'Unknown error',
        call_id: null
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      call_id: null
    };
  }
}

/**
 * Update Google Sheets with call attempts
 * @param {GoogleSheetsHelper} sheets - Google Sheets helper
 * @param {Array} results - Call results
 */
async function updateCallAttempts(sheets, results) {
  try {
    const allBusinesses = await sheets.getAllRows();
    
    for (const result of results) {
      const business = allBusinesses.find(biz => biz.phone === result.phone);
      
      if (business) {
        const rowIndex = allBusinesses.findIndex(biz => biz.id === business.id) + 2;
        
        const updates = {
          last_contacted: new Date().toISOString(),
          contact_attempts: (parseInt(business.contact_attempts) || 0) + 1
        };
        
        if (result.success) {
          updates.call_status = 'initiated';
          updates.call_id = result.call_id;
        } else {
          updates.call_status = 'failed';
          updates.call_error = result.error;
        }
        
        await sheets.updateRow(rowIndex, updates);
        console.log(`📝 Updated ${business.business_name} in Google Sheets`);
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to update Google Sheets:', error.message);
  }
}

/**
 * Test Vapi connection
 */
async function testVapiConnection() {
  try {
    console.log('🧪 Testing Vapi connection...');
    
    const response = await fetch('https://api.vapi.ai/assistant', {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Vapi connection successful');
      return true;
    } else {
      console.log('❌ Vapi connection failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Vapi connection error:', error.message);
    return false;
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    testVapiConnection();
  } else if (args.includes('--help')) {
    console.log('📞 Vapi Outbound Calls Script');
    console.log('=============================');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/startVapiCalls.js          # Start calling businesses');
    console.log('  node scripts/startVapiCalls.js --test   # Test Vapi connection');
    console.log('  node scripts/startVapiCalls.js --help    # Show this help');
    console.log('');
    console.log('Environment variables required:');
    console.log('  VAPI_API_KEY=your_vapi_api_key');
    console.log('  VAPI_ASSISTANT_ID=your_assistant_id');
    console.log('  VAPI_PHONE_NUMBER_ID=your_phone_number_id');
  } else {
    startVapiCalls();
  }
}

module.exports = {
  startVapiCalls,
  makeVapiCall,
  testVapiConnection
};


