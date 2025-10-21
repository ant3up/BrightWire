require('dotenv').config();
const VercelHelper = require('./lib/vercel');

async function debugVercel() {
  try {
    console.log('🔍 Debugging Vercel deployments...');
    
    const vercel = new VercelHelper();
    
    // List all recent deployments
    console.log('\n📋 Recent deployments:');
    const deployments = await vercel.listDeployments(10);
    
    deployments.forEach((dep, index) => {
      console.log(`\n${index + 1}. Deployment ID: ${dep.uid}`);
      console.log(`   State: ${dep.state}`);
      console.log(`   URL: ${dep.url || 'N/A'}`);
      console.log(`   Git Ref: ${dep.git?.ref || 'N/A'}`);
      console.log(`   Meta Git Branch: ${dep.meta?.gitBranch || 'N/A'}`);
      console.log(`   Name: ${dep.name || 'N/A'}`);
      console.log(`   Created: ${new Date(dep.createdAt).toLocaleString()}`);
    });
    
    // Test specific branch search
    console.log('\n🔍 Testing branch search for: preview/blue-mountains-auto-electrical-pty-ltd-1fylfp4tg');
    const specificDeployment = await vercel.getDeploymentByBranch('preview/blue-mountains-auto-electrical-pty-ltd-1fylfp4tg');
    
    if (specificDeployment) {
      console.log('✅ Found specific deployment:', specificDeployment.uid);
    } else {
      console.log('❌ No deployment found for that branch');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugVercel();
