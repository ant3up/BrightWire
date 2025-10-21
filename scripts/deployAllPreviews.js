require('dotenv').config();
const { execSync } = require('child_process');
const GoogleSheetsHelper = require('../lib/googleSheets');

/**
 * Simple script to manually deploy all preview branches using Vercel CLI
 * and update Google Sheets with the results
 */
class PreviewDeployer {
  constructor() {
    this.googleSheets = new GoogleSheetsHelper();
  }

  async run() {
    try {
      console.log('🚀 Deploying all preview branches...');
      
      // Get all preview branches
      const branches = this.getPreviewBranches();
      console.log(`📋 Found ${branches.length} preview branches`);
      
      const results = [];
      
      for (const branch of branches) {
        console.log(`\n🌿 Deploying: ${branch}`);
        
        try {
          // Switch to branch
          execSync(`git checkout ${branch}`, { stdio: 'pipe' });
          
          // Deploy using Vercel CLI
          const deployOutput = execSync('vercel --prod --yes', { 
            stdio: 'pipe',
            encoding: 'utf8'
          });
          
          // Extract URL from output
          const urlMatch = deployOutput.match(/Production: (https:\/\/[^\s]+)/);
          const url = urlMatch ? urlMatch[1] : null;
          
          if (url) {
            console.log(`✅ Deployed: ${url}`);
            results.push({ branch, url, status: 'success' });
          } else {
            console.log(`❌ Could not extract URL from: ${deployOutput}`);
            results.push({ branch, url: null, status: 'failed', error: 'Could not extract URL' });
          }
          
        } catch (error) {
          console.log(`❌ Failed to deploy ${branch}: ${error.message}`);
          results.push({ branch, url: null, status: 'failed', error: error.message });
        }
      }
      
      // Switch back to main
      execSync('git checkout main', { stdio: 'pipe' });
      
      // Update Google Sheets
      await this.updateGoogleSheets(results);
      
      // Print summary
      this.printSummary(results);
      
    } catch (error) {
      console.error('💥 Error:', error.message);
      throw error;
    }
  }
  
  /**
   * Get all preview branches from git
   */
  getPreviewBranches() {
    try {
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
   * Update Google Sheets with deployment results
   */
  async updateGoogleSheets(results) {
    try {
      console.log('\n💾 Updating Google Sheets...');
      
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
          } else {
            console.log(`⚠️  No matching business found for: ${businessName}`);
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
}

// Run the script if called directly
if (require.main === module) {
  const deployer = new PreviewDeployer();
  deployer.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = PreviewDeployer;
