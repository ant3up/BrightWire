const { Octokit } = require('@octokit/rest');

/**
 * GitHub API helper functions for branch and file operations
 */
class GitHubHelper {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    this.owner = process.env.GITHUB_OWNER;
    this.repo = process.env.GITHUB_REPO;
    this.baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
  }

  /**
   * Get the latest commit SHA for the base branch
   * @returns {Promise<string>} The commit SHA
   */
  async getBaseBranchSha() {
    try {
      console.log(`📋 Getting latest SHA for branch: ${this.baseBranch}`);
      const { data } = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.baseBranch,
      });
      
      const sha = data.commit.sha;
      console.log(`✅ Found base branch SHA: ${sha.substring(0, 7)}`);
      return sha;
    } catch (error) {
      console.error(`❌ Failed to get base branch SHA:`, error.message);
      throw new Error(`Failed to get base branch SHA: ${error.message}`);
    }
  }

  /**
   * Create a new branch pointing to the specified SHA
   * @param {string} branchName - The name of the branch to create
   * @param {string} sha - The SHA to point the branch to
   * @returns {Promise<boolean>} Success status
   */
  async createBranch(branchName, sha) {
    try {
      console.log(`🌿 Creating branch: ${branchName}`);
      
      // Check if branch already exists
      try {
        await this.octokit.rest.repos.getBranch({
          owner: this.owner,
          repo: this.repo,
          branch: branchName,
        });
        console.log(`⚠️  Branch ${branchName} already exists, skipping creation`);
        return true;
      } catch (error) {
        // Branch doesn't exist, which is what we want
        if (error.status !== 404) {
          throw error;
        }
      }

      // Create the new branch
      await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branchName}`,
        sha: sha,
      });

      console.log(`✅ Created branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create branch ${branchName}:`, error.message);
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  /**
   * Get file content from a specific branch
   * @param {string} pathInRepo - Path to the file in the repository
   * @param {string} branchName - Branch to read from
   * @returns {Promise<string>} File content as string
   */
  async getFileContent(pathInRepo, branchName = this.baseBranch) {
    try {
      console.log(`📖 Reading file: ${pathInRepo} from branch: ${branchName}`);
      
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: pathInRepo,
        ref: branchName,
      });

      if (data.type !== 'file') {
        throw new Error(`Path ${pathInRepo} is not a file`);
      }

      // Decode base64 content
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      console.log(`✅ Read file content (${content.length} chars)`);
      return content;
    } catch (error) {
      console.error(`❌ Failed to read file ${pathInRepo}:`, error.message);
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  /**
   * Create or update a file on a specific branch
   * @param {string} pathInRepo - Path to the file in the repository
   * @param {string} contentString - New content for the file
   * @param {string} branchName - Branch to update
   * @param {string} commitMessage - Commit message
   * @returns {Promise<boolean>} Success status
   */
  async createOrUpdateFileOnBranch(pathInRepo, contentString, branchName, commitMessage) {
    try {
      console.log(`📝 Updating file: ${pathInRepo} on branch: ${branchName}`);
      
      // Get current file SHA if it exists
      let currentSha = null;
      try {
        const { data } = await this.octokit.rest.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: pathInRepo,
          ref: branchName,
        });
        currentSha = data.sha;
        console.log(`📄 File exists, will update (SHA: ${currentSha.substring(0, 7)})`);
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }
        console.log(`📄 File doesn't exist, will create new file`);
      }

      // Encode content to base64
      const encodedContent = Buffer.from(contentString, 'utf-8').toString('base64');

      // Create or update the file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: pathInRepo,
        message: commitMessage,
        content: encodedContent,
        sha: currentSha, // null for new files
        branch: branchName,
      });

      console.log(`✅ Updated file: ${pathInRepo}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update file ${pathInRepo}:`, error.message);
      throw new Error(`Failed to update file: ${error.message}`);
    }
  }

  /**
   * Delete a branch
   * @param {string} branchName - Branch to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteBranch(branchName) {
    try {
      console.log(`🗑️  Deleting branch: ${branchName}`);
      
      await this.octokit.rest.git.deleteRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branchName}`,
      });

      console.log(`✅ Deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete branch ${branchName}:`, error.message);
      throw new Error(`Failed to delete branch: ${error.message}`);
    }
  }

  /**
   * List branches with a specific prefix
   * @param {string} prefix - Branch name prefix to filter by
   * @returns {Promise<Array>} Array of branch objects
   */
  async listBranchesWithPrefix(prefix) {
    try {
      console.log(`🔍 Listing branches with prefix: ${prefix}`);
      
      const { data } = await this.octokit.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
        per_page: 100,
      });

      const filteredBranches = data.filter(branch => 
        branch.name.startsWith(prefix)
      );

      console.log(`✅ Found ${filteredBranches.length} branches with prefix: ${prefix}`);
      return filteredBranches;
    } catch (error) {
      console.error(`❌ Failed to list branches:`, error.message);
      throw new Error(`Failed to list branches: ${error.message}`);
    }
  }
}

module.exports = GitHubHelper;
