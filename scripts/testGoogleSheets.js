#!/usr/bin/env node

const GoogleSheetsHelper = require('../lib/googlesheets');
require('dotenv').config();

/**
 * Test script for Google Sheets integration
 */
async function testGoogleSheets() {
  try {
    console.log('🧪 Testing Google Sheets Integration');
    console.log('=====================================');
    
    // Check environment variables
    const requiredVars = [
      'GOOGLE_SHEET_ID',
      'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      'GOOGLE_PRIVATE_KEY'
    ];
    
    console.log('\n📋 Checking environment variables...');
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`  • ${varName}`));
      console.error('\n💡 Please check your .env file');
      return;
    }
    
    console.log('✅ All required environment variables found');
    
    // Test connection
    console.log('\n🔗 Testing Google Sheets connection...');
    const sheets = new GoogleSheetsHelper();
    
    // Test getting all rows
    console.log('\n📖 Reading data from Google Sheets...');
    const data = await sheets.getAllRows();
    
    console.log(`✅ Successfully connected to Google Sheets!`);
    console.log(`📊 Found ${data.length} rows`);
    
    if (data.length > 0) {
      console.log('\n📋 Sample data (first row):');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check for required columns
      const requiredColumns = ['business_name', 'phone', 'address', 'wants_preview'];
      const sampleRow = data[0];
      const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
      
      if (missingColumns.length > 0) {
        console.log('\n⚠️  Missing required columns:');
        missingColumns.forEach(col => console.log(`  • ${col}`));
        console.log('\n💡 Please ensure your Google Sheet has these columns');
      } else {
        console.log('\n✅ All required columns found');
        console.log('📝 Note: Using address field for both address and suburb placeholders');
      }
    } else {
      console.log('\n⚠️  No data found in Google Sheets');
      console.log('💡 Please add some sample business data');
    }
    
    // Test headers
    console.log('\n📋 Getting worksheet headers...');
    const headers = await sheets.getHeaders();
    console.log('Headers:', headers.join(', '));
    
    console.log('\n🎉 Google Sheets integration test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Add business data to your Google Sheet');
    console.log('  2. Set wants_preview to "yes" for businesses that want previews');
    console.log('  3. Run: node scripts/createPreviewBranches.js --dry-run=true');
    
  } catch (error) {
    console.error('\n❌ Google Sheets test failed:');
    console.error(error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Check your .env file has correct credentials');
    console.log('  2. Ensure service account has access to the sheet');
    console.log('  3. Verify GOOGLE_SHEET_ID is correct');
    console.log('  4. Check GOOGLE_PRIVATE_KEY format (should include \\n)');
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testGoogleSheets();
}

module.exports = testGoogleSheets;
