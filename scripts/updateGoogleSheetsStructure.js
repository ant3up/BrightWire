#!/usr/bin/env node

/**
 * Update Google Sheets Structure for Vapi Contact Outcomes
 * 
 * This script adds the necessary columns to your Google Sheet for recording
 * contact outcomes from Vapi calls.
 */

const GoogleSheetsHelper = require('../lib/googlesheets');
require('dotenv').config();

/**
 * Add contact outcome columns to Google Sheets
 */
async function updateGoogleSheetsStructure() {
  try {
    console.log('📊 Updating Google Sheets Structure for Vapi Integration');
    console.log('=======================================================');
    
    // Check if Google Sheets is enabled
    if (process.env.USE_GOOGLE_SHEETS !== 'true') {
      console.log('⚠️  Google Sheets not enabled. Set USE_GOOGLE_SHEETS=true in .env');
      return;
    }
    
    console.log('\n🔗 Connecting to Google Sheets...');
    const sheets = new GoogleSheetsHelper();
    
    // Get current headers
    console.log('\n📋 Getting current headers...');
    const currentHeaders = await sheets.getHeaders();
    console.log('Current headers:', currentHeaders.join(', '));
    
    // Define new columns for contact outcomes
    const newColumns = [
      'call_outcome',           // qualified_lead, not_interested, no_answer, etc.
      'call_sentiment',         // positive, negative, neutral
      'call_duration',          // Duration in seconds
      'call_cost',             // Cost of the call
      'call_ended_reason',     // customer-ended-call, assistant-ended-call, etc.
      'call_transcript',       // Full conversation transcript
      'call_notes',            // AI-generated notes from the call
      'next_steps',            // What to do next (send_preview, follow_up, etc.)
      'last_contacted',         // Timestamp of last contact
      'contact_attempts'       // Number of contact attempts
    ];
    
    // Check which columns are missing
    const missingColumns = newColumns.filter(col => !currentHeaders.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('\n✅ All contact outcome columns already exist!');
      return;
    }
    
    console.log(`\n➕ Adding ${missingColumns.length} new columns:`);
    missingColumns.forEach(col => console.log(`  • ${col}`));
    
    // Get all current data
    console.log('\n📖 Reading current data...');
    const currentData = await sheets.getAllRows();
    console.log(`Found ${currentData.length} existing rows`);
    
    // Create a new worksheet with updated structure
    const newWorksheetName = `Updated_${new Date().toISOString().split('T')[0]}`;
    console.log(`\n📝 Creating new worksheet: ${newWorksheetName}`);
    
    // Combine existing headers with new columns
    const allHeaders = [...currentHeaders, ...missingColumns];
    
    // Create new worksheet
    const createSuccess = await sheets.createWorksheet(newWorksheetName, allHeaders);
    
    if (!createSuccess) {
      throw new Error('Failed to create new worksheet');
    }
    
    console.log('✅ New worksheet created successfully');
    
    // Copy existing data to new worksheet
    console.log('\n📋 Copying existing data to new worksheet...');
    
    // Temporarily switch to new worksheet
    const originalWorksheetName = sheets.worksheetName;
    sheets.worksheetName = newWorksheetName;
    
    // Add existing data with new columns
    for (const row of currentData) {
      const newRow = { ...row };
      // Initialize new columns with default values
      missingColumns.forEach(col => {
        newRow[col] = '';
      });
      
      await sheets.addRow(newRow);
    }
    
    console.log(`✅ Copied ${currentData.length} rows to new worksheet`);
    
    // Restore original worksheet name
    sheets.worksheetName = originalWorksheetName;
    
    console.log('\n🎉 Google Sheets structure updated successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Review the new worksheet structure');
    console.log('  2. Update your Vapi webhook URL to point to your server');
    console.log('  3. Test the integration with a sample call');
    console.log(`  4. Switch to the new worksheet: ${newWorksheetName}`);
    
    console.log('\n📊 New column descriptions:');
    console.log('  • call_outcome: Result of the call (qualified_lead, not_interested, etc.)');
    console.log('  • call_sentiment: Customer sentiment (positive, negative, neutral)');
    console.log('  • call_duration: Length of call in seconds');
    console.log('  • call_cost: Cost of the call');
    console.log('  • call_ended_reason: Why the call ended');
    console.log('  • call_transcript: Full conversation text');
    console.log('  • call_notes: AI-generated summary');
    console.log('  • next_steps: Recommended next action');
    console.log('  • last_contacted: When they were last contacted');
    console.log('  • contact_attempts: Number of times contacted');
    
  } catch (error) {
    console.error('\n❌ Failed to update Google Sheets structure:');
    console.error(error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your Google Sheets credentials in .env');
    console.log('  2. Ensure the service account has edit access');
    console.log('  3. Verify GOOGLE_SHEET_ID is correct');
    console.log('  4. Check that USE_GOOGLE_SHEETS=true');
    
    process.exit(1);
  }
}

// Run the update
if (require.main === module) {
  updateGoogleSheetsStructure();
}

module.exports = updateGoogleSheetsStructure;

