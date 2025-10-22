#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const shortid = require('shortid');
require('dotenv').config();

const GitHubHelper = require('../lib/github');
const VercelHelper = require('../lib/vercel');
const GoogleSheetsHelper = require('../lib/googlesheets');

/**
 * Main script to create preview branches for businesses
 */
class PreviewBranchCreator {
  constructor() {
    this.github = new GitHubHelper();
    this.vercel = new VercelHelper();
    this.sheetPath = process.env.SHEET_PATH || 'clients.xlsx';
    this.dryRun = process.env.DRY_RUN === 'true';
    this.siteFilePaths = this.parseSiteFilePaths();
    this.useGoogleSheets = process.env.USE_GOOGLE_SHEETS === 'true';
    
    // Initialize Google Sheets if enabled
    if (this.useGoogleSheets) {
      this.googleSheets = new GoogleSheetsHelper();
    }
    
    console.log('🚀 Preview Branch Creator Started');
    console.log(`📊 Data Source: ${this.useGoogleSheets ? 'Google Sheets' : 'Excel File'}`);
    console.log(`📊 Sheet: ${this.sheetPath}`);
    console.log(`🔧 Dry Run: ${this.dryRun}`);
    console.log(`📁 Site Files: ${this.siteFilePaths.join(', ')}`);
  }

  /**
   * Parse SITE_FILE_PATHS from environment variable
   * @returns {Array<string>} Array of file paths
   */
  parseSiteFilePaths() {
    const paths = process.env.SITE_FILE_PATHS;
    if (!paths) {
      throw new Error('SITE_FILE_PATHS environment variable is required');
    }
    
    try {
      return JSON.parse(paths);
    } catch (error) {
      throw new Error('SITE_FILE_PATHS must be a valid JSON array of strings');
    }
  }

  /**
   * Sanitize business name for branch name
   * @param {string} businessName - The business name
   * @returns {string} Sanitized branch name
   */
  sanitizeBranchName(businessName) {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  }

  /**
   * Generate unique branch name
   * @param {string} businessName - The business name
   * @param {string} existingBranch - Existing branch name if any
   * @returns {string} Unique branch name
   */
  generateBranchName(businessName, existingBranch = null) {
    // If we have an existing branch, reuse it
    if (existingBranch && existingBranch.startsWith('preview/')) {
      console.log(`🔄 Reusing existing branch: ${existingBranch}`);
      return existingBranch;
    }
    
    const sanitized = this.sanitizeBranchName(businessName);
    const shortId = shortid.generate().toLowerCase();
    return `preview/${sanitized}-${shortId}`;
  }

  /**
   * Replace placeholders in content
   * @param {string} content - Original content
   * @param {Object} business - Business data
   * @returns {string} Content with placeholders replaced
   */
  replacePlaceholders(content, business) {
    // Clean phone number for tel: links (remove spaces, +, -, etc.)
    const phoneClean = (business.phone || '').replace(/[\s+\-\(\)]/g, '');
    
    // Display phone formatter: 0450 903 942 (AU mobile style)
    const phoneDigits = (business.phone || '').replace(/\D/g, '');
    let phoneDisplay = business.phone || '';
    if (phoneDigits.length === 10 && phoneDigits.startsWith('04')) {
      phoneDisplay = `${phoneDigits.slice(0, 4)} ${phoneDigits.slice(4, 7)} ${phoneDigits.slice(7)}`;
    } else if (phoneDigits.length === 11 && phoneDigits.startsWith('614')) {
      // Convert +61 4xx xxx xxx → 04xx xxx xxx
      const local = `0${phoneDigits.slice(2)}`;
      phoneDisplay = `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
    }
    
    // Use the business name exactly as provided in the sheet
    const businessNameSanitized = (business.business_name || '').trim();
    
    return content
      .replace(/\{\{BUSINESS_NAME\}\}/g, businessNameSanitized)
      .replace(/\{\{PHONE\}\}/g, business.phone || '')
      .replace(/\{\{PHONE_DISPLAY\}\}/g, phoneDisplay)
      .replace(/\{\{PHONE_CLEAN\}\}/g, phoneClean)
      .replace(/\{\{ADDRESS\}\}/g, business.address || '')
      .replace(/\{\{SUBURB\}\}/g, business.address || ''); // Use address for suburb placeholder
  }

  /**
   * Read data from Excel file or Google Sheets
   * @returns {Promise<Array<Object>>} Array of business objects
   */
  async readData() {
    if (this.useGoogleSheets) {
      return await this.readGoogleSheets();
    } else {
      return this.readExcelFile();
    }
  }

  /**
   * Read Google Sheets data
   * @returns {Promise<Array<Object>>} Array of business objects
   */
  async readGoogleSheets() {
    try {
      console.log(`📖 Reading Google Sheets: ${this.googleSheets.sheetId}`);
      const data = await this.googleSheets.getAllRows();
      console.log(`✅ Read ${data.length} rows from Google Sheets`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to read Google Sheets:`, error.message);
      throw error;
    }
  }

  /**
   * Read Excel file and return worksheet data
   * @returns {Array<Object>} Array of business objects
   */
  readExcelFile() {
    try {
      console.log(`📖 Reading Excel file: ${this.sheetPath}`);
      
      if (!fs.existsSync(this.sheetPath)) {
        throw new Error(`Excel file not found: ${this.sheetPath}`);
      }

      const workbook = XLSX.readFile(this.sheetPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`✅ Read ${data.length} rows from Excel file`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to read Excel file:`, error.message);
      throw error;
    }
  }

  /**
   * Write data back to Excel file or Google Sheets
   * @param {Array<Object>} data - Updated data array
   */
  async writeData(data) {
    if (this.useGoogleSheets) {
      await this.writeGoogleSheets(data);
    } else {
      this.writeExcelFile(data);
    }
  }

  /**
   * Write data back to Google Sheets
   * @param {Array<Object>} data - Updated data array
   */
  async writeGoogleSheets(data) {
    try {
      console.log(`💾 Writing updated data to Google Sheets`);
      
      // Update only rows that have changes to avoid clearing other rows
      // and to reduce API usage/quota.
      let updated = 0;
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const hasChange = Boolean(row.preview_url || row.branch || row.triggered || row.deployedAt || row.error);
        if (!hasChange) {
          continue;
        }
        
        // Note: We want to update all rows that have changes, even if they're already deployed
        // This ensures the Google Sheet reflects the latest deployment results

        console.log(`📝 Updating row ${i + 1} with data:`, {
          preview_url: row.preview_url || '',
          branch: row.branch || '',
          triggered: row.triggered || '',
          deployedAt: row.deployedAt || '',
          Error: row.error || ''
        });
        
        const ok = await this.googleSheets.updateRow(i + 1, {
          preview_url: row.preview_url || '',
          branch: row.branch || '',
          triggered: row.triggered || '',
          deployedAt: row.deployedAt || '',
          Error: row.error || ''
        });
        if (ok) updated++;
        // Gentle throttle to avoid Google Sheets 429 per-minute limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      console.log(`✅ Updated ${updated} Google Sheets rows`);
    } catch (error) {
      console.error(`❌ Failed to write Google Sheets:`, error.message);
      throw error;
    }
  }

  /**
   * Write data back to Excel file
   * @param {Array<Object>} data - Updated data array
   */
  writeExcelFile(data) {
    try {
      console.log(`💾 Writing updated data to Excel file`);
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, this.sheetPath);
      
      console.log(`✅ Updated Excel file saved`);
    } catch (error) {
      console.error(`❌ Failed to write Excel file:`, error.message);
      throw error;
    }
  }

  /**
   * Process a single business row
   * @param {Object} business - Business data
   * @param {number} index - Row index
   * @returns {Promise<Object>} Updated business object
   */
  async processBusiness(business, index) {
    console.log(`\n🏢 Processing business ${index + 1}: ${business.business_name}`);
    
    // Clear any existing error when retrying
    if (business.Error && business.Error.toString().trim() !== '') {
      console.log(`🔄 Retrying business with previous error: ${business.Error}`);
      business.Error = ''; // Clear the error
    }
    
    try {
      // First, try to find an existing branch for this business
      let existingBranch = business.branch;
      if (!existingBranch || existingBranch.trim() === '') {
        existingBranch = await this.github.findExistingPreviewBranch(business.business_name);
      }
      
      // Generate branch name (reuse existing if available)
      const branchName = this.generateBranchName(business.business_name, existingBranch);
      console.log(`🌿 Branch name: ${branchName}`);

      if (this.dryRun) {
        console.log(`🔧 DRY RUN: Would create branch ${branchName}`);
        return {
          ...business,
          branch: branchName,
          triggered: 'dry-run',
          preview_url: `https://preview-${branchName}.vercel.app`,
          deployedAt: new Date().toISOString()
        };
      }

      // Get base branch SHA
      const baseSha = await this.github.getBaseBranchSha();
      
      // Check if branch already exists, if not create it
      const branchExists = await this.github.branchExists(branchName);
      if (branchExists) {
        console.log(`✅ Branch already exists: ${branchName}`);
      } else {
        console.log(`🌿 Creating new branch: ${branchName}`);
        await this.github.createBranch(branchName, baseSha);
      }

      // Update site files with business data (batch update)
      console.log(`📝 Updating ${this.siteFilePaths.length} files for ${business.business_name}`);
      
      const filesToUpdate = [];
      for (const filePath of this.siteFilePaths) {
        // Read original file content
        const originalContent = await this.github.getFileContent(filePath, this.github.baseBranch);
        
        // Replace placeholders
        const updatedContent = this.replacePlaceholders(originalContent, business);
        
        filesToUpdate.push({
          path: filePath,
          content: updatedContent
        });
      }
      
      // Update all files in a single commit
      await this.github.updateMultipleFiles(
        filesToUpdate,
        branchName,
        `Update template files for ${business.business_name} preview`
      );

      // Wait for Vercel deployment
      console.log(`⏳ Waiting for Vercel deployment...`);
      const deployment = await this.vercel.waitForDeploymentByBranch(branchName);
      
      console.log(`🎉 Deployment ready: ${deployment.url}`);

      return {
        ...business,
        branch: branchName,
        triggered: 'deployed',
        preview_url: deployment.url,
        deployedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Failed to process business: ${error.message}`);
      return {
        ...business,
        triggered: 'failed',
        error: error.message,
        failedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Main execution function
   */
  async run() {
    try {
      // Parse command line arguments
      const args = this.parseCommandLineArgs();
      const limit = args.limit; // Only use limit if specified

      // Read data from Excel file or Google Sheets
      const businesses = await this.readData();
      
      // Filter businesses that want preview and need processing
      const eligibleBusinesses = businesses.filter(business => {
        const wantsPreview = business.wants_preview && business.wants_preview.toString().toLowerCase().trim() === 'yes';
        const triggered = business.triggered ? business.triggered.toString().trim() : '';
        const hasError = business.Error && business.Error.toString().trim() !== '';
        const hasBusinessName = business.business_name && business.business_name.toString().trim() !== '';
        
        console.log(`Business: ${business.business_name}, wants_preview: ${business.wants_preview}, triggered: ${triggered}, Error: ${business.Error}`);
        
        // Skip if no business name
        if (!hasBusinessName) return false;
        
        // Skip if doesn't want preview
        if (!wantsPreview) return false;
        
        // Skip if already deployed successfully
        if (triggered === 'deployed') return false;
        
        // Process if triggered but has error (retry case)
        if (triggered === 'triggered' && hasError) return true;
        
        // Process if triggered status is 'error' (retry case)
        if (triggered === 'error') return true;
        
        // Process if not triggered yet (new case)
        if (triggered === '') return true;
        
        // Skip everything else
        return false;
      });

      console.log(`📋 Found ${eligibleBusinesses.length} eligible businesses`);
      
      if (eligibleBusinesses.length === 0) {
        console.log('✅ No businesses to process');
        return;
      }

      // Process all eligible businesses or limit if specified
      const businessesToProcess = limit ? eligibleBusinesses.slice(0, limit) : eligibleBusinesses;
      
      if (limit) {
        console.log(`🎯 Processing up to ${limit} businesses`);
      } else {
        console.log(`🎯 Processing all ${businessesToProcess.length} eligible businesses`);
      }
      const results = [];
      
      for (let i = 0; i < businessesToProcess.length; i++) {
        const business = businessesToProcess[i];
        const result = await this.processBusiness(business, i);
        results.push(result);
        
        // Update the original data array using business name to find the correct row
        const originalIndex = businesses.findIndex(b => 
          b.business_name && business.business_name && 
          b.business_name.toString().trim() === business.business_name.toString().trim()
        );
        if (originalIndex !== -1) {
          console.log(`🔄 Updating original row ${originalIndex + 1} for business: ${business.business_name}`);
          businesses[originalIndex] = result;
        } else {
          console.log(`⚠️  Could not find original row for business: ${business.business_name}`);
        }
      }

      // Write results back to Excel or Google Sheets
      await this.writeData(businesses);

      // Print summary
      this.printSummary(results);

    } catch (error) {
      console.error(`❌ Script failed:`, error.message);
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments
   * @returns {Object} Parsed arguments
   */
  parseCommandLineArgs() {
    const args = {};
    
    process.argv.forEach(arg => {
      if (arg.startsWith('--sheet=')) {
        this.sheetPath = arg.split('=')[1];
      } else if (arg.startsWith('--limit=')) {
        args.limit = parseInt(arg.split('=')[1]);
      } else if (arg.startsWith('--dry-run=')) {
        this.dryRun = arg.split('=')[1] === 'true';
      }
    });

    return args;
  }

  /**
   * Print summary of results
   * @param {Array<Object>} results - Processing results
   */
  printSummary(results) {
    console.log('\n📊 SUMMARY');
    console.log('='.repeat(50));
    
    const deployed = results.filter(r => r.triggered === 'deployed');
    const failed = results.filter(r => r.triggered === 'failed');
    const dryRun = results.filter(r => r.triggered === 'dry-run');
    
    console.log(`✅ Successfully deployed: ${deployed.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🔧 Dry run: ${dryRun.length}`);
    
    if (deployed.length > 0) {
      console.log('\n🎉 Deployed previews:');
      deployed.forEach(business => {
        console.log(`  • ${business.business_name}: ${business.preview_url}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed businesses:');
      failed.forEach(business => {
        console.log(`  • ${business.business_name}: ${business.error}`);
      });
    }
    
    console.log(`\n📝 Results saved to: ${this.sheetPath}`);
  }
}

// Run the script if called directly
if (require.main === module) {
  const creator = new PreviewBranchCreator();
  creator.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}
// Export class for programmatic use (e.g., serverless API)
module.exports = PreviewBranchCreator;
module.exports = PreviewBranchCreator;
