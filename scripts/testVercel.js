#!/usr/bin/env node

require('dotenv').config();

/**
 * Test Vercel API access
 */
async function testVercelAPI() {
  try {
    console.log('🧪 Testing Vercel API Access');
    console.log('============================');
    
    const fetch = globalThis.fetch || require('node-fetch');
    
    // Test 1: List deployments
    console.log('\n📋 Testing deployments API...');
    const deploymentsUrl = process.env.VERCEL_TEAM_ID 
      ? `https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}&teamId=${process.env.VERCEL_TEAM_ID}&limit=5`
      : `https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}&limit=5`;
    
    console.log('URL:', deploymentsUrl);
    
    const response = await fetch(deploymentsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Vercel API access successful!');
      console.log('📊 Found', data.deployments?.length || 0, 'deployments');
      
      if (data.deployments && data.deployments.length > 0) {
        console.log('\n📋 Recent deployments:');
        data.deployments.slice(0, 3).forEach((dep, i) => {
          console.log(`  ${i + 1}. ${dep.name} - ${dep.state} - ${dep.url || 'No URL'}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Vercel API error:', response.status, response.statusText);
      console.log('Error details:', errorText);
      
      if (response.status === 403) {
        console.log('\n💡 403 Forbidden - Possible solutions:');
        console.log('  1. Check your Vercel token has correct permissions');
        console.log('  2. Verify VERCEL_PROJECT_ID is correct');
        console.log('  3. Check if you need VERCEL_TEAM_ID for team projects');
        console.log('  4. Try regenerating your Vercel token');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testVercelAPI();
}

module.exports = testVercelAPI;
