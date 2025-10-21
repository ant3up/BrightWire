#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

/**
 * Deploy a specific branch to Vercel
 * @param {string} branchName - The branch to deploy
 */
function deployBranch(branchName) {
  try {
    console.log(`🚀 Deploying branch: ${branchName}`);
    
    // Checkout the branch
    console.log(`📋 Checking out branch: ${branchName}`);
    execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
    
    // Deploy to Vercel
    console.log(`🌐 Deploying to Vercel...`);
    execSync('npx vercel --prod', { stdio: 'inherit' });
    
    console.log(`✅ Deployment completed for branch: ${branchName}`);
  } catch (error) {
    console.error(`❌ Failed to deploy branch ${branchName}:`, error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const branchName = process.argv[2];
  if (!branchName) {
    console.error('❌ Please provide a branch name');
    console.log('Usage: node scripts/deployBranch.js <branch-name>');
    process.exit(1);
  }
  
  deployBranch(branchName);
}

module.exports = deployBranch;
