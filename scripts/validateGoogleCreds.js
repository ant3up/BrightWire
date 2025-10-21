#!/usr/bin/env node

require('dotenv').config();

/**
 * Validate Google Sheets credentials format
 */
function validateGoogleCredentials() {
  console.log('🔍 Validating Google Sheets Credentials');
  console.log('=====================================');
  console.log('');

  const requiredVars = [
    'USE_GOOGLE_SHEETS',
    'GOOGLE_SHEET_ID', 
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY'
  ];

  let allValid = true;

  console.log('📋 Checking environment variables...');
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`❌ ${varName}: Missing`);
      allValid = false;
    } else {
      console.log(`✅ ${varName}: Set`);
      
      // Special validation for private key
      if (varName === 'GOOGLE_PRIVATE_KEY') {
        if (!value.includes('-----BEGIN PRIVATE KEY-----')) {
          console.log(`⚠️  ${varName}: Missing proper format (should start with -----BEGIN PRIVATE KEY-----)`);
          allValid = false;
        } else if (!value.includes('\\n')) {
          console.log(`⚠️  ${varName}: Missing line breaks (should include \\n characters)`);
          allValid = false;
        } else {
          console.log(`✅ ${varName}: Format looks correct`);
        }
      }
    }
  });

  console.log('');
  
  if (allValid) {
    console.log('🎉 All Google Sheets credentials are properly configured!');
    console.log('');
    console.log('🧪 You can now test the connection:');
    console.log('   node scripts/testGoogleSheets.js');
  } else {
    console.log('❌ Some credentials are missing or incorrectly formatted.');
    console.log('');
    console.log('💡 To fix the GOOGLE_PRIVATE_KEY:');
    console.log('   1. Get your private key from the Google Cloud service account JSON file');
    console.log('   2. Add it to your .env file in this format:');
    console.log('      GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_KEY_HERE\\n-----END PRIVATE KEY-----\\n"');
    console.log('   3. Make sure to include the \\n characters for line breaks');
  }
}

// Run validation
validateGoogleCredentials();
