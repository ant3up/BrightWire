# Automated Multi-Branch Preview Generator

This automation system creates unique preview branches for each business from an Excel spreadsheet, updates template files with business-specific data, and retrieves Vercel deployment URLs.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run install-automation
```

### 2. Configure Environment

Copy the example environment file and fill in your details:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo-name
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id
SITE_FILE_PATHS=["public/site-config.json","src/config/site.json"]
```

### 3. Prepare Your Data Source

You can use either **Excel files** or **Google Sheets** as your data source.

#### Option A: Excel File
Create `clients.xlsx` with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| `id` | Optional unique identifier | 1, 2, 3... |
| `business_name` | Business name | "ABC Electrical" |
| `phone` | Phone number | "0412 345 678" |
| `address` | Street address | "123 Main St" |
| `suburb` | Suburb/City | "Melbourne" |
| `wants_preview` | yes/no | "yes" |
| `preview_url` | (auto-filled) | "https://preview-abc-electrical-abc123.vercel.app" |
| `branch` | (auto-filled) | "preview/abc-electrical-abc123" |
| `status` | (auto-filled) | "deployed", "failed", "dry-run" |
| `deployedAt` | (auto-filled) | "2024-01-15T10:30:00.000Z" |

#### Option B: Google Sheets (Recommended)

1. **Create a Google Sheet** with the same columns as above
2. **Set up Google Cloud Service Account** (see `GOOGLE-SHEETS-SETUP.md` for detailed instructions)
3. **Configure environment variables**:
   ```env
   USE_GOOGLE_SHEETS=true
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   ```
4. **Test the connection**:
   ```bash
   node scripts/testGoogleSheets.js
   ```

### 4. Run the Automation

```bash
# Create previews for all eligible businesses
npm run create-previews

# Or with custom options
node scripts/createPreviewBranches.js --sheet=my-clients.xlsx --limit=5 --dry-run=true
```

## 📋 Detailed Usage

### Creating Preview Branches

```bash
# Basic usage
node scripts/createPreviewBranches.js

# With custom options
node scripts/createPreviewBranches.js --sheet=clients.xlsx --limit=10 --dry-run=false

# Dry run (test mode)
node scripts/createPreviewBranches.js --dry-run=true
```

**Command Line Options:**
- `--sheet=filename.xlsx` - Specify Excel file path
- `--limit=N` - Process only N businesses
- `--dry-run=true/false` - Test mode without making changes

### Cleaning Up Old Branches

```bash
# Clean up branches older than 30 days
npm run cleanup-previews

# With custom age limit
node scripts/cleanupOldPreviews.js --max-age=14 --dry-run=true
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GITHUB_TOKEN` | ✅ | GitHub Personal Access Token | `ghp_...` |
| `GITHUB_OWNER` | ✅ | GitHub username/org | `your-username` |
| `GITHUB_REPO` | ✅ | Repository name | `your-repo` |
| `GITHUB_BASE_BRANCH` | ❌ | Base branch to fork from | `main` |
| `VERCEL_TOKEN` | ✅ | Vercel Personal Token | `vercel_...` |
| `VERCEL_PROJECT_ID` | ✅ | Vercel project ID | `prj_...` |
| `VERCEL_TEAM_ID` | ❌ | Vercel team ID (if applicable) | `team_...` |
| `SITE_BASE_URL` | ❌ | Fallback base URL | `https://yoursite.vercel.app` |
| `SITE_FILE_PATHS` | ✅ | JSON array of file paths | `["public/config.json"]` |
| `SHEET_PATH` | ❌ | Excel file path | `clients.xlsx` |
| `DRY_RUN` | ❌ | Test mode flag | `false` |
| `MAX_AGE_DAYS` | ❌ | Cleanup age limit | `30` |

### Template File Setup

Your template files should contain placeholders that will be replaced:

```json
{
  "businessName": "{{BUSINESS_NAME}}",
  "phone": "{{PHONE}}",
  "address": "{{ADDRESS}}",
  "suburb": "{{SUBURB}}"
}
```

**Supported Placeholders:**
- `{{BUSINESS_NAME}}` - Business name
- `{{PHONE}}` - Phone number
- `{{ADDRESS}}` - Street address
- `{{SUBURB}}` - Suburb/City (uses address field if no suburb column exists)

## 🔄 Workflow

### 1. Branch Creation Process

1. **Read Excel file** - Load business data
2. **Filter eligible businesses** - `wants_preview=yes` and no existing `status`
3. **Generate branch name** - `preview/business-name-shortid`
4. **Create GitHub branch** - Fork from base branch
5. **Update template files** - Replace placeholders with business data
6. **Commit changes** - Push updates to new branch
7. **Wait for Vercel deployment** - Poll until ready
8. **Capture preview URL** - Get deployment URL
9. **Update Excel file** - Write results back to spreadsheet

### 2. Branch Naming Convention

- Format: `preview/{sanitized-business-name}-{shortid}`
- Sanitization: lowercase, hyphens for spaces, remove special chars
- Example: `preview/abc-electrical-abc123`

### 3. Excel File Updates

The script automatically updates these columns:
- `preview_url` - Vercel deployment URL
- `branch` - GitHub branch name
- `status` - `deployed`, `failed`, or `dry-run`
- `deployedAt` - ISO timestamp
- `error` - Error message (if failed)

## 🛠️ Troubleshooting

### Common Issues

#### 1. GitHub API Errors

**Error: 401 Unauthorized**
```
Solution: Check your GITHUB_TOKEN is valid and has 'repo' scope
```

**Error: 403 Forbidden**
```
Solution: Token may have insufficient permissions or rate limit exceeded
Wait 1 hour or use a different token
```

**Error: 404 Not Found**
```
Solution: Verify GITHUB_OWNER and GITHUB_REPO are correct
Check repository exists and token has access
```

#### 2. Vercel API Errors

**Error: Deployment not found**
```
Solution: Check VERCEL_PROJECT_ID is correct
Verify project is connected to GitHub
```

**Error: Timeout waiting for deployment**
```
Solution: Increase DEPLOYMENT_TIMEOUT_MS
Check Vercel project settings
```

#### 3. File Update Errors

**Error: File not found**
```
Solution: Verify SITE_FILE_PATHS exist in repository
Check file paths are correct relative to repo root
```

**Error: Invalid JSON in SITE_FILE_PATHS**
```
Solution: Ensure SITE_FILE_PATHS is valid JSON array
Example: ["public/config.json","src/config.js"]
```

#### 4. Excel File Issues

**Error: Excel file not found**
```
Solution: Check SHEET_PATH is correct
Ensure file exists and is readable
```

**Error: Invalid Excel format**
```
Solution: Ensure file has required columns
Check for proper Excel format (.xlsx)
```

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
DEBUG=true node scripts/createPreviewBranches.js
```

### Rate Limiting

The scripts include built-in delays to respect API rate limits:
- GitHub: 100ms delay between file operations
- Vercel: 4 second polling interval
- Excel: No delays needed

## 🔒 Security & Privacy

### Token Security
- Never commit tokens to version control
- Use environment variables or secure vaults
- Rotate tokens regularly
- Use minimal required permissions

### Privacy Considerations
- Preview URLs are semi-public
- Consider adding authentication to previews
- Set up automatic cleanup of old branches
- Monitor for unauthorized access

### Compliance
- Ensure compliance with telemarketing laws
- Respect SMS regulations in your jurisdiction
- Consider data retention policies
- Implement proper access controls

## 🧹 Maintenance

### Regular Cleanup

Set up automated cleanup of old preview branches:

```bash
# Clean branches older than 30 days
node scripts/cleanupOldPreviews.js --max-age=30

# Dry run to see what would be deleted
node scripts/cleanupOldPreviews.js --max-age=30 --dry-run=true
```

### Monitoring

Monitor your automation for:
- Failed deployments
- Rate limit hits
- Disk space usage
- Branch count growth

### Backup

Regularly backup:
- Excel files with business data
- Environment configuration
- GitHub repository
- Vercel project settings

## 📞 Vapi Integration

### Single Business Preview Creation

To trigger preview creation for a single business via API:

```bash
curl -X POST http://localhost:3000/api/create-preview \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "ABC Electrical",
    "phone": "0412 345 678",
    "address": "123 Main St",
    "suburb": "Melbourne"
  }'
```

### API Endpoint Example

Create `api/create-preview.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { business_name, phone, address, suburb } = req.body;
  
  // Create temporary Excel row
  const business = {
    business_name,
    phone,
    address,
    suburb,
    wants_preview: 'yes'
  };

  // Process single business
  const creator = new PreviewBranchCreator();
  const result = await creator.processBusiness(business, 0);
  
  res.json(result);
}
```

## 📊 Example Output

### Console Output
```
🚀 Preview Branch Creator Started
📊 Sheet: clients.xlsx
🔧 Dry Run: false
📁 Site Files: public/site-config.json, src/config/site.json

📖 Reading Excel file: clients.xlsx
✅ Read 25 rows from Excel file
📋 Found 15 eligible businesses

🏢 Processing business 1: ABC Electrical
🌿 Branch name: preview/abc-electrical-abc123
📋 Getting latest SHA for branch: main
✅ Found base branch SHA: a1b2c3d
🌿 Creating branch: preview/abc-electrical-abc123
✅ Created branch: preview/abc-electrical-abc123
📝 Updating file: public/site-config.json
📖 Reading file: public/site-config.json from branch: main
✅ Read file content (245 chars)
📝 Updating file: public/site-config.json on branch: preview/abc-electrical-abc123
✅ Updated file: public/site-config.json
⏳ Waiting for Vercel deployment...
🔍 Searching for deployment with branch: preview/abc-electrical-abc123
✅ Found deployment: dep_123456 (state: READY)
🎉 Deployment ready! URL: https://preview-abc-electrical-abc123.vercel.app

📊 SUMMARY
==================================================
✅ Successfully deployed: 1
❌ Failed: 0
🔧 Dry run: 0

🎉 Deployed previews:
  • ABC Electrical: https://preview-abc-electrical-abc123.vercel.app

📝 Results saved to: clients.xlsx
```

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review environment configuration
3. Test with dry-run mode first
4. Check API rate limits and permissions
5. Verify all required files exist

## 📝 License

This automation system is part of the BrightWire project and follows the same licensing terms.
