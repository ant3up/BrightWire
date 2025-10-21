#!/usr/bin/env node

const GitHubHelper = require('../lib/github');
require('dotenv').config();

/**
 * Cleanup script to remove old preview branches
 */
class PreviewCleanup {
  constructor() {
    this.github = new GitHubHelper();
    this.dryRun = process.env.DRY_RUN === 'true';
    this.maxAgeDays = parseInt(process.env.MAX_AGE_DAYS) || 30;
    
    console.log('🧹 Preview Cleanup Started');
    console.log(`🔧 Dry Run: ${this.dryRun}`);
    console.log(`⏰ Max Age: ${this.maxAgeDays} days`);
  }

  /**
   * Check if a branch is older than the specified days
   * @param {Object} branch - Branch object from GitHub API
   * @returns {boolean} True if branch is old enough to delete
   */
  isBranchOld(branch) {
    const branchDate = new Date(branch.commit.commit.author.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.maxAgeDays);
    
    return branchDate < cutoffDate;
  }

  /**
   * Get branch details including commit information
   * @param {string} branchName - Name of the branch
   * @returns {Promise<Object>} Branch details with commit info
   */
  async getBranchDetails(branchName) {
    try {
      const { data } = await this.github.octokit.rest.repos.getBranch({
        owner: this.github.owner,
        repo: this.github.repo,
        branch: branchName,
      });
      
      return {
        name: branchName,
        commit: data.commit,
        protected: data.protected
      };
    } catch (error) {
      console.error(`❌ Failed to get branch details for ${branchName}:`, error.message);
      return null;
    }
  }

  /**
   * Delete a branch
   * @param {string} branchName - Name of the branch to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteBranch(branchName) {
    try {
      if (this.dryRun) {
        console.log(`🔧 DRY RUN: Would delete branch ${branchName}`);
        return true;
      }

      await this.github.deleteBranch(branchName);
      console.log(`✅ Deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete branch ${branchName}:`, error.message);
      return false;
    }
  }

  /**
   * List all preview branches
   * @returns {Promise<Array>} Array of preview branch objects
   */
  async listPreviewBranches() {
    try {
      console.log('🔍 Finding preview branches...');
      const branches = await this.github.listBranchesWithPrefix('preview/');
      
      console.log(`📋 Found ${branches.length} preview branches`);
      return branches;
    } catch (error) {
      console.error('❌ Failed to list preview branches:', error.message);
      throw error;
    }
  }

  /**
   * Get detailed information for all preview branches
   * @param {Array} branches - Array of branch objects
   * @returns {Promise<Array>} Array of detailed branch information
   */
  async getDetailedBranchInfo(branches) {
    console.log('📊 Getting detailed branch information...');
    
    const detailedBranches = [];
    
    for (const branch of branches) {
      const details = await this.getBranchDetails(branch.name);
      if (details) {
        detailedBranches.push(details);
      }
      
      // Add small delay to avoid rate limiting
      await this.sleep(100);
    }
    
    return detailedBranches;
  }

  /**
   * Filter branches that are old enough to delete
   * @param {Array} branches - Array of detailed branch information
   * @returns {Array} Array of branches to delete
   */
  filterOldBranches(branches) {
    const oldBranches = branches.filter(branch => {
      const isOld = this.isBranchOld(branch);
      const isProtected = branch.protected;
      
      if (isOld && !isProtected) {
        console.log(`🗑️  Branch ${branch.name} is ${this.getBranchAge(branch)} days old`);
        return true;
      } else if (isProtected) {
        console.log(`🛡️  Branch ${branch.name} is protected, skipping`);
        return false;
      } else {
        console.log(`⏳ Branch ${branch.name} is too recent (${this.getBranchAge(branch)} days old)`);
        return false;
      }
    });
    
    return oldBranches;
  }

  /**
   * Get the age of a branch in days
   * @param {Object} branch - Branch object with commit information
   * @returns {number} Age in days
   */
  getBranchAge(branch) {
    const branchDate = new Date(branch.commit.commit.author.date);
    const now = new Date();
    const diffTime = Math.abs(now - branchDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Main cleanup execution
   */
  async run() {
    try {
      // Parse command line arguments
      const args = this.parseCommandLineArgs();
      
      if (args.maxAge) {
        this.maxAgeDays = parseInt(args.maxAge);
        console.log(`⏰ Updated max age to: ${this.maxAgeDays} days`);
      }

      // List all preview branches
      const branches = await this.listPreviewBranches();
      
      if (branches.length === 0) {
        console.log('✅ No preview branches found');
        return;
      }

      // Get detailed information for each branch
      const detailedBranches = await this.getDetailedBranchInfo(branches);
      
      // Filter old branches
      const oldBranches = this.filterOldBranches(detailedBranches);
      
      if (oldBranches.length === 0) {
        console.log('✅ No old branches to delete');
        return;
      }

      console.log(`\n🗑️  Found ${oldBranches.length} old branches to delete:`);
      oldBranches.forEach(branch => {
        const age = this.getBranchAge(branch);
        console.log(`  • ${branch.name} (${age} days old)`);
      });

      // Confirm deletion (unless dry run)
      if (!this.dryRun) {
        console.log('\n⚠️  This will permanently delete the branches listed above.');
        console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
        
        await this.sleep(5000);
      }

      // Delete old branches
      const results = await this.deleteOldBranches(oldBranches);
      
      // Print summary
      this.printSummary(results);

    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Delete multiple old branches
   * @param {Array} branches - Array of branches to delete
   * @returns {Promise<Object>} Results summary
   */
  async deleteOldBranches(branches) {
    const results = {
      total: branches.length,
      deleted: 0,
      failed: 0,
      errors: []
    };

    console.log(`\n🗑️  Deleting ${branches.length} old branches...`);

    for (const branch of branches) {
      const success = await this.deleteBranch(branch.name);
      
      if (success) {
        results.deleted++;
      } else {
        results.failed++;
        results.errors.push(branch.name);
      }
      
      // Add delay to avoid rate limiting
      await this.sleep(200);
    }

    return results;
  }

  /**
   * Parse command line arguments
   * @returns {Object} Parsed arguments
   */
  parseCommandLineArgs() {
    const args = {};
    
    process.argv.forEach(arg => {
      if (arg.startsWith('--max-age=')) {
        args.maxAge = parseInt(arg.split('=')[1]);
      } else if (arg.startsWith('--dry-run=')) {
        this.dryRun = arg.split('=')[1] === 'true';
      }
    });

    return args;
  }

  /**
   * Print cleanup summary
   * @param {Object} results - Cleanup results
   */
  printSummary(results) {
    console.log('\n📊 CLEANUP SUMMARY');
    console.log('='.repeat(50));
    console.log(`🗑️  Branches processed: ${results.total}`);
    console.log(`✅ Successfully deleted: ${results.deleted}`);
    console.log(`❌ Failed to delete: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Failed branches:');
      results.errors.forEach(branchName => {
        console.log(`  • ${branchName}`);
      });
    }
    
    if (this.dryRun) {
      console.log('\n🔧 This was a dry run - no branches were actually deleted');
    }
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the script if called directly
if (require.main === module) {
  const cleanup = new PreviewCleanup();
  cleanup.run().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = PreviewCleanup;
