require('dotenv').config();
const { execSync } = require('child_process');
const VercelHelper = require('../lib/vercel');
const GoogleSheetsHelper = require('../lib/googleSheets');

/**
 * Script to manually trigger Vercel deployments for preview branches
 * This bypasses the automatic deployment detection issue
 */
class VercelDeploymentTrigger {
  constructor() {
    this.vercel = new VercelHelper();
    this.googleSheets = new GoogleSheetsHelper();
  }

  async run() {
    try {
      console.log('🚀 Triggering Vercel deployments for preview branches...');
      
      // Get all preview branches from GitHub
      console.log('📋 Getting preview branches from GitHub...');
      const branches = await this.getPreviewBranches();
      
      console.log(`✅ Found ${branches.length} preview branches`);
      
      // Trigger deployments for each branch
      const results = [];
      
      for (const branch of branches) {
        console.log(`\n🌿 Processing branch: ${branch}`);
        
        try {
          // Check if deployment already exists
          const existingDeployment = await this.vercel.getDeploymentByBranch(branch);
          
          if (existingDeployment && existingDeployment.state === 'READY') {
            console.log(`✅ Deployment already exists: ${existingDeployment.url}`);
            results.push({
              branch,
              url: existingDeployment.url,
              status: 'already_deployed'
            });
            continue;
          }
          
          // Trigger new deployment using Vercel CLI
          console.log(`🚀 Triggering deployment for ${branch}...`);
          
          try {
            // Use Vercel CLI to deploy the specific branch
            const deployCommand = `vercel --prod --yes --token=${process.env.VERCEL_TOKEN}`;
            
            // Switch to the branch and deploy
            execSync(`git checkout ${branch}`, { stdio: 'pipe' });
            const deployOutput = execSync(deployCommand, { 
              stdio: 'pipe',
              cwd: process.cwd(),
              timeout: 120000 // 2 minutes timeout
            });
            
            console.log(`✅ Deployment triggered for ${branch}`);
            
            // Wait a moment for deployment to start
            await this.sleep(5000);
            
            // Try to get the deployment URL
            const deployment = await this.waitForDeployment(branch, 60000); // 1 minute timeout
            
            if (deployment) {
              results.push({
                branch,
                url: deployment.url,
                status: 'deployed'
              });
              console.log(`🎉 Deployment ready: ${deployment.url}`);
            } else {
              results.push({
                branch,
                url: null,
                status: 'timeout'
              });
              console.log(`⏰ Deployment timeout for ${branch}`);
            }
            
          } catch (deployError) {
            console.log(`❌ Failed to deploy ${branch}: ${deployError.message}`);
            results.push({
              branch,
              url: null,
              status: 'failed',
              error: deployError.message
            });
          }
          
        } catch (error) {
          console.log(`❌ Error processing ${branch}: ${error.message}`);
          results.push({
            branch,
            url: null,
            status: 'error',
            error: error.message
          });
        }
      }
      
      // Update Google Sheets with results
      await this.updateGoogleSheets(results);
      
      // Print summary
      this.printSummary(results);
      
    } catch (error) {
      console.error('💥 Error:', error.message);
      throw error;
    }
  }
  
  /**
   * Get all preview branches from GitHub
   */
  async getPreviewBranches() {
    try {
      const { execSync } = require('child_process');
      const output = execSync('git branch -r', { encoding: 'utf8' });
      
      const branches = output
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.includes('preview/') && !line.includes('HEAD'))
        .map(line => line.replace('origin/', ''));
      
      return branches;
    } catch (error) {
      console.error('❌ Failed to get branches:', error.message);
      return [];
    }
  }
  
  /**
   * Wait for deployment to be ready
   */
  async waitForDeployment(branchName, timeoutMs = 60000) {
    const startTime = Date.now();
    const timeout = startTime + timeoutMs;
    
    while (Date.now() < timeout) {
      try {
        const deployment = await this.vercel.getDeploymentByBranch(branchName);
        
        if (deployment && deployment.state === 'READY') {
          return deployment;
        }
        
        if (deployment && (deployment.state === 'ERROR' || deployment.state === 'CANCELED')) {
          throw new Error(`Deployment failed with state: ${deployment.state}`);
        }
        
        await this.sleep(3000); // Wait 3 seconds before checking again
        
      } catch (error) {
        if (error.message.includes('Deployment failed')) {
          throw error;
        }
        await this.sleep(3000);
      }
    }
    
    return null;
  }
  
  /**
   * Update Google Sheets with deployment results
   */
  async updateGoogleSheets(results) {
    try {
      console.log('\n💾 Updating Google Sheets with deployment results...');
      
      const businesses = await this.googleSheets.getAllRows();
      
      for (const result of results) {
        if (result.url) {
          // Find matching business by branch name
          const businessName = result.branch.replace('preview/', '').replace(/-[a-z0-9]+$/, '').replace(/-/g, ' ');
          
          const businessIndex = businesses.findIndex(business => {
            if (!business.business_name) return false;
            const sheetName = business.business_name.toLowerCase();
            const searchName = businessName.toLowerCase();
            return sheetName.includes(searchName) || searchName.includes(sheetName);
          });
          
          if (businessIndex !== -1) {
            const business = businesses[businessIndex];
            console.log(`📝 Updating ${business.business_name} with URL: ${result.url}`);
            
            await this.googleSheets.updateRow(businessIndex + 1, {
              preview_url: result.url,
              branch: result.branch,
              status: 'deployed',
              deployedAt: new Date().toISOString()
            });
          }
        }
      }
      
      console.log('✅ Google Sheets updated successfully');
      
    } catch (error) {
      console.error('❌ Failed to update Google Sheets:', error.message);
    }
  }
  
  /**
   * Print summary of results
   */
  printSummary(results) {
    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('==================================================');
    
    const successful = results.filter(r => r.url);
    const failed = results.filter(r => !r.url);
    
    console.log(`✅ Successful deployments: ${successful.length}`);
    console.log(`❌ Failed deployments: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\n🌐 Preview URLs:');
      successful.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.branch}: ${result.url}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed deployments:');
      failed.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.branch}: ${result.error || 'Unknown error'}`);
      });
    }
  }
  
  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the script if called directly
if (require.main === module) {
  const trigger = new VercelDeploymentTrigger();
  trigger.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = VercelDeploymentTrigger;
