// Use native fetch (Node 18+) or fallback to node-fetch
const fetch = globalThis.fetch || require('node-fetch');

/**
 * Vercel API helper functions for deployment monitoring
 */
class VercelHelper {
  constructor() {
    this.token = process.env.VERCEL_TOKEN;
    this.projectId = process.env.VERCEL_PROJECT_ID;
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.baseUrl = process.env.SITE_BASE_URL;
    
    if (!this.token) {
      throw new Error('VERCEL_TOKEN is required');
    }
    if (!this.projectId) {
      throw new Error('VERCEL_PROJECT_ID is required');
    }
  }

  /**
   * Get deployment by branch name
   * @param {string} branchName - The branch name to search for
   * @returns {Promise<Object|null>} Deployment object or null if not found
   */
  async getDeploymentByBranch(branchName) {
    try {
      console.log(`🔍 Searching for deployment with branch: ${branchName}`);

      const base = this.teamId
        ? `teamId=${this.teamId}&projectId=${this.projectId}`
        : `projectId=${this.projectId}`;

      // Prefer v13 deployments API (more consistent metadata), fallback to v6
      const urls = [
        `https://api.vercel.com/v13/deployments?${base}&limit=50&target=preview`,
        `https://api.vercel.com/v6/deployments?${base}&limit=50`,
      ];

      let data;
      for (const u of urls) {
        const response = await fetch(u, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          data = await response.json();
          if (Array.isArray(data?.deployments) && data.deployments.length > 0) break;
        }
      }

      if (!data) {
        throw new Error('Vercel API error: could not retrieve deployments');
      }

      const deployments = data.deployments || [];

      const normalize = (s) => (s || '').toLowerCase().trim();
      const wanted = normalize(branchName);

      const matchesBranch = (dep) => {
        const candidates = [
          dep.git?.ref,
          dep.meta?.gitBranch,
          dep.meta?.githubCommitRef,
          dep.meta?.gitlabCommitRef,
          dep.meta?.branch,
          dep.meta?.ref,
          dep.meta?.githubCommitBranch,
          dep.name,
        ]
          .filter(Boolean)
          .map(normalize);

        // Also try to remove potential prefix like 'refs/heads/' or 'origin/'
        const expanded = candidates.flatMap((c) => [
          c,
          c.replace(/^refs\/heads\//, ''),
          c.replace(/^origin\//, ''),
        ]);

        return expanded.some((c) => c === wanted || c.endsWith(wanted) || wanted.endsWith(c));
      };

      const deployment = deployments.find(matchesBranch);

      if (deployment) {
        console.log(`✅ Found deployment: ${deployment.uid} (state: ${deployment.state})`);
        return deployment;
      } else {
        console.log(`⚠️  No deployment found for branch: ${branchName}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Failed to get deployment by branch:`, error.message);
      throw new Error(`Failed to get deployment: ${error.message}`);
    }
  }

  /**
   * Wait for a deployment to be ready
   * @param {string} branchName - The branch name to monitor
   * @param {number} timeoutMs - Timeout in milliseconds (default: 3 minutes)
   * @param {number} pollIntervalMs - Polling interval in milliseconds (default: 4 seconds)
   * @returns {Promise<Object>} Deployment result with url, state, and deploymentId
   */
  async waitForDeploymentByBranch(branchName, timeoutMs = 600000, pollIntervalMs = 4000) {
    const startTime = Date.now();
    const timeout = startTime + timeoutMs;
    
    console.log(`⏳ Waiting for deployment of branch: ${branchName}`);
    console.log(`⏰ Timeout: ${timeoutMs / 1000}s, Poll interval: ${pollIntervalMs / 1000}s`);

    while (Date.now() < timeout) {
      try {
        const deployment = await this.getDeploymentByBranch(branchName);
        
        if (!deployment) {
          console.log(`⏳ No deployment found yet, waiting...`);
          await this.sleep(pollIntervalMs);
          continue;
        }

        const state = deployment.state;
        console.log(`📊 Deployment state: ${state}`);

        if (state === 'READY') {
          const url = deployment.url || deployment.alias?.[0] || this.constructPreviewUrl(deployment);
          console.log(`🎉 Deployment ready! URL: ${url}`);
          return {
            url,
            state,
            deploymentId: deployment.uid,
            deployment
          };
        }

        if (state === 'ERROR' || state === 'CANCELED') {
          throw new Error(`Deployment failed with state: ${state}`);
        }

        // Still building, wait and try again
        console.log(`⏳ Deployment still building (${state}), waiting...`);
        await this.sleep(pollIntervalMs);

      } catch (error) {
        if (error.message.includes('Deployment failed')) {
          throw error;
        }
        console.log(`⚠️  Error checking deployment: ${error.message}, retrying...`);
        await this.sleep(pollIntervalMs);
      }
    }

    throw new Error(`Deployment timeout after ${timeoutMs / 1000} seconds`);
  }

  /**
   * Construct preview URL from deployment data
   * @param {Object} deployment - Deployment object from Vercel API
   * @returns {string} Preview URL
   */
  constructPreviewUrl(deployment) {
    // Try different URL patterns that Vercel might use
    if (deployment.url) {
      return deployment.url;
    }
    
    if (deployment.alias && deployment.alias.length > 0) {
      return `https://${deployment.alias[0]}`;
    }

    if (deployment.url) {
      return deployment.url;
    }

    // Fallback: construct URL from deployment ID
    const deploymentId = deployment.uid;
    return `https://${this.projectId}-${deploymentId.substring(0, 8)}.vercel.app`;
  }

  /**
   * Get deployment details by ID
   * @param {string} deploymentId - The deployment ID
   * @returns {Promise<Object>} Deployment details
   */
  async getDeploymentById(deploymentId) {
    try {
      console.log(`🔍 Getting deployment details: ${deploymentId}`);
      
      const url = this.teamId 
        ? `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${this.teamId}`
        : `https://api.vercel.com/v13/deployments/${deploymentId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
      }

      const deployment = await response.json();
      console.log(`✅ Retrieved deployment details`);
      return deployment;
    } catch (error) {
      console.error(`❌ Failed to get deployment details:`, error.message);
      throw new Error(`Failed to get deployment details: ${error.message}`);
    }
  }

  /**
   * List all deployments for the project
   * @param {number} limit - Number of deployments to retrieve
   * @returns {Promise<Array>} Array of deployment objects
   */
  async listDeployments(limit = 20) {
    try {
      console.log(`📋 Listing deployments (limit: ${limit})`);
      
      const url = this.teamId 
        ? `https://api.vercel.com/v6/deployments?projectId=${this.projectId}&teamId=${this.teamId}&limit=${limit}`
        : `https://api.vercel.com/v6/deployments?projectId=${this.projectId}&limit=${limit}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Retrieved ${data.deployments?.length || 0} deployments`);
      return data.deployments || [];
    } catch (error) {
      console.error(`❌ Failed to list deployments:`, error.message);
      throw new Error(`Failed to list deployments: ${error.message}`);
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

module.exports = VercelHelper;
