require('dotenv').config();
const VercelHelper = require('../lib/vercel');
const GoogleSheetsHelper = require('../lib/googleSheets');

/**
 * Script to find existing Vercel deployments and update Google Sheets
 * This bypasses the deployment waiting logic and just finds what's already deployed
 */
class DeploymentUpdater {
  constructor() {
    this.vercel = new VercelHelper();
    this.googleSheets = new GoogleSheetsHelper();
    this.sheetPath = process.env.SHEET_PATH || 'clients.xlsx';
  }

  async run() {
    try {
      console.log('🔍 Finding existing deployments and updating Google Sheets...');
      
      // Get all recent deployments
      console.log('📋 Fetching recent deployments...');
      const deployments = await this.vercel.listDeployments(20);
      
      console.log(`✅ Found ${deployments.length} recent deployments`);
      
      // Filter for preview deployments (branches starting with 'preview/')
      const previewDeployments = deployments.filter(dep => {
        const gitRef = dep.git?.ref || dep.meta?.gitBranch || dep.name || '';
        return gitRef.startsWith('preview/') && dep.state === 'READY';
      });
      
      console.log(`🎯 Found ${previewDeployments.length} ready preview deployments`);
      
      // Read current Google Sheets data
      console.log('📖 Reading Google Sheets data...');
      const businesses = await this.googleSheets.getAllRows();
      
      console.log(`📊 Found ${businesses.length} businesses in sheet`);
      
      // Update businesses with their deployment URLs
      let updatedCount = 0;
      
      for (const deployment of previewDeployments) {
        const gitRef = deployment.git?.ref || deployment.meta?.gitBranch || deployment.name || '';
        const branchName = gitRef.replace('preview/', '');
        
        console.log(`\n🔍 Processing deployment: ${deployment.uid}`);
        console.log(`   Branch: ${gitRef}`);
        console.log(`   URL: ${deployment.url}`);
        
        // Find matching business (remove the random suffix from branch name)
        const businessName = branchName.replace(/-[a-z0-9]+$/, '').replace(/-/g, ' ');
        
        console.log(`   Looking for business: "${businessName}"`);
        
        // Find the business in the sheet
        const businessIndex = businesses.findIndex(business => {
          if (!business.business_name) return false;
          
          // Try different matching strategies
          const sheetName = business.business_name.toLowerCase();
          const searchName = businessName.toLowerCase();
          
          return sheetName.includes(searchName) || 
                 searchName.includes(sheetName) ||
                 this.normalizeName(sheetName) === this.normalizeName(searchName);
        });
        
        if (businessIndex !== -1) {
          const business = businesses[businessIndex];
          console.log(`   ✅ Found matching business: "${business.business_name}"`);
          
          // Update the business with deployment info
          business.preview_url = deployment.url;
          business.branch = gitRef;
          business.status = 'deployed';
          business.deployedAt = new Date().toISOString();
          
          updatedCount++;
          console.log(`   📝 Updated: ${business.business_name}`);
        } else {
          console.log(`   ⚠️  No matching business found for: ${businessName}`);
        }
      }
      
      // Write updated data back to Google Sheets
      if (updatedCount > 0) {
        console.log(`\n💾 Writing ${updatedCount} updates to Google Sheets...`);
        
        // Update each business individually
        for (let i = 0; i < businesses.length; i++) {
          const business = businesses[i];
          if (business.preview_url && business.status === 'deployed') {
            await this.googleSheets.updateRow(i + 1, {
              preview_url: business.preview_url,
              branch: business.branch,
              status: business.status,
              deployedAt: business.deployedAt
            });
          }
        }
        
        console.log('✅ Google Sheets updated successfully');
      } else {
        console.log('ℹ️  No businesses were updated');
      }
      
      // Show summary
      console.log('\n📊 SUMMARY');
      console.log('==================================================');
      console.log(`✅ Preview deployments found: ${previewDeployments.length}`);
      console.log(`📝 Businesses updated: ${updatedCount}`);
      
      // Show deployment details
      console.log('\n🌐 Preview URLs:');
      previewDeployments.forEach((dep, index) => {
        console.log(`   ${index + 1}. ${dep.url} (${dep.git?.ref || dep.meta?.gitBranch || dep.name})`);
      });
      
    } catch (error) {
      console.error('💥 Error:', error.message);
      throw error;
    }
  }
  
  /**
   * Normalize business name for comparison
   */
  normalizeName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')        // Normalize spaces
      .trim();
  }
}

// Run the script if called directly
if (require.main === module) {
  const updater = new DeploymentUpdater();
  updater.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = DeploymentUpdater;
