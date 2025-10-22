// Use dynamic import for ESM-only @octokit/rest
let octokitModulePromise = null;
function loadOctokitModule() {
  if (!octokitModulePromise) {
    octokitModulePromise = import('@octokit/rest');
  }
  return octokitModulePromise;
}

/**
 * GitHub API helper functions for branch and file operations
 */
class GitHubHelper {
  constructor() {
    this.octokitInstance = null;
    this.octokitInitPromise = null;
    this.owner = process.env.GITHUB_OWNER;
    this.repo = process.env.GITHUB_REPO;
    this.baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
  }

  async getOctokit() {
    if (this.octokitInstance) return this.octokitInstance;
    if (!this.octokitInitPromise) {
      this.octokitInitPromise = (async () => {
        const mod = await loadOctokitModule();
        const { Octokit } = mod;
        this.octokitInstance = new Octokit({ auth: process.env.GITHUB_TOKEN });
        return this.octokitInstance;
      })();
    }
    return this.octokitInitPromise;
  }

  /**
   * Get the latest commit SHA for the base branch
   * @returns {Promise<string>} The commit SHA
   */
  async getBaseBranchSha() {
    try {
      console.log(`📋 Getting latest SHA for branch: ${this.baseBranch}`);
      const octokit = await this.getOctokit();
      const { data } = await octokit.rest.repos.getBranch({
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
   * Check if a branch exists
   * @param {string} branchName - The name of the branch to check
   * @returns {Promise<boolean>} True if branch exists
   */
  async branchExists(branchName) {
    try {
      const octokit = await this.getOctokit();
      await octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: branchName,
      });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Find existing preview branch for a business
   * @param {string} businessName - The business name to search for
   * @returns {Promise<string|null>} Existing branch name or null
   */
  async findExistingPreviewBranch(businessName) {
    try {
      const octokit = await this.getOctokit();
      const sanitized = businessName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
      
      console.log(`🔍 Searching for existing branch matching: ${sanitized}`);
      
      const branches = await octokit.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
        per_page: 100
      });
      
      // Look for branches that start with preview/ and contain the business name
      const matchingBranch = branches.data.find(branch => 
        branch.name.startsWith('preview/') && 
        branch.name.includes(sanitized)
      );
      
      if (matchingBranch) {
        console.log(`✅ Found existing branch: ${matchingBranch.name}`);
        return matchingBranch.name;
      }
      
      console.log(`❌ No existing branch found for: ${businessName}`);
      return null;
    } catch (error) {
      console.error(`❌ Failed to search for existing branch:`, error.message);
      return null;
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
      const octokit = await this.getOctokit();
      
      // Check if branch already exists
      try {
        await octokit.rest.repos.getBranch({
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
      await octokit.rest.git.createRef({
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
      const octokit = await this.getOctokit();
      
      const { data } = await octokit.rest.repos.getContent({
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
      const octokit = await this.getOctokit();
      
      // Get current file SHA if it exists
      let currentSha = null;
      try {
        const { data } = await octokit.rest.repos.getContent({
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
      await octokit.rest.repos.createOrUpdateFileContents({
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
   * Update multiple files in a single commit
   * @param {Array<Object>} files - Array of {path, content} objects
   * @param {string} branchName - Branch to update
   * @param {string} commitMessage - Commit message
   * @returns {Promise<boolean>} Success status
   */
  async updateMultipleFiles(files, branchName, commitMessage) {
    try {
      console.log(`📝 Updating ${files.length} files in single commit on branch: ${branchName}`);
      const octokit = await this.getOctokit();
      
      // Get current tree SHA for the branch
      const { data: branchData } = await octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: branchName,
      });
      
      const baseTree = branchData.commit.commit.tree.sha;
      
      // Get current file SHAs
      const treeItems = [];
      for (const file of files) {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner: this.owner,
            repo: this.repo,
            path: file.path,
            ref: branchName,
          });
          treeItems.push({
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: data.sha,
          });
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }
          // File doesn't exist, will be created
        }
      }
      
      // Create blobs for new content
      const newTreeItems = [];
      for (const file of files) {
        const { data: blob } = await octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: file.content,
          encoding: 'utf-8',
        });
        
        newTreeItems.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        });
      }
      
      // Create new tree
      const { data: newTree } = await octokit.rest.git.createTree({
        owner: this.owner,
        repo: this.repo,
        base_tree: baseTree,
        tree: newTreeItems,
      });
      
      // Create new commit
      const { data: newCommit } = await octokit.rest.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message: commitMessage,
        tree: newTree.sha,
        parents: [branchData.commit.sha],
      });
      
      // Update branch reference
      await octokit.rest.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branchName}`,
        sha: newCommit.sha,
      });
      
      console.log(`✅ Updated ${files.length} files in single commit`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to update multiple files:`, error.message);
      throw new Error(`Failed to update multiple files: ${error.message}`);
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
      const octokit = await this.getOctokit();
      await octokit.rest.git.deleteRef({
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
      const octokit = await this.getOctokit();
      const { data } = await octokit.rest.repos.listBranches({
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
