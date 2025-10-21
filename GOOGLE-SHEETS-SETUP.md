# 📊 Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets as your data source for the automated preview generation system.

## 🔧 Prerequisites

1. **Google Cloud Project** - You need a Google Cloud project
2. **Google Sheets API** - Enable the Google Sheets API
3. **Service Account** - Create a service account with proper permissions
4. **Google Sheet** - Create and share your business data sheet

## 📋 Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "BrightWire Automation"
4. Click "Create"

### 2. Enable Google Sheets API

1. In your Google Cloud project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 3. Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Enter details:
   - **Name**: `brightwire-automation`
   - **Description**: `Service account for BrightWire preview automation`
4. Click "Create and Continue"
5. Skip role assignment for now (click "Continue")
6. Click "Done"

### 4. Generate Service Account Key

1. In "Credentials" page, find your service account
2. Click on the service account email
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. **Download the JSON file** - you'll need this!

### 5. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "BrightWire Clients" (or any name you prefer)
4. Set up the following columns in row 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | business_name | phone | address | suburb | wants_preview | preview_url | branch | status | deployedAt | error |

### 6. Add Sample Data

Add some sample business data:

| id | business_name | phone | address | suburb | wants_preview | preview_url | branch | status | deployedAt | error |
|----|---------------|-------|---------|--------|---------------|-------------|--------|--------|------------|-------|
| 1 | ABC Electrical | 0412 345 678 | 123 Main St | Melbourne | yes | | | | | |
| 2 | XYZ Plumbing | 0413 456 789 | 456 Oak Ave | Sydney | yes | | | | | |
| 3 | DEF Carpentry | 0414 567 890 | 789 Pine Rd | Brisbane | no | | | | | |

### 7. Share Sheet with Service Account

1. In your Google Sheet, click "Share" button
2. Add the service account email (from step 3)
3. Give it "Editor" permissions
4. Click "Send"

### 8. Get Sheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0
```

The Sheet ID is: `1ABC123DEF456GHI789JKL`

### 9. Configure Environment Variables

Create or update your `.env` file:

```env
# Enable Google Sheets
USE_GOOGLE_SHEETS=true

# Google Sheets Configuration
GOOGLE_SHEET_ID=    
GOOGLE_SERVICE_ACCOUNT_EMAIL=brightwire-automation@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_FROM_JSON_FILE\n-----END PRIVATE KEY-----\n"
GOOGLE_WORKSHEET_NAME=Sheet1

# Other required variables...
GITHUB_TOKEN=ghp_your_github_token
VERCEL_TOKEN=your_vercel_token
# ... etc
```

## 🔑 Getting the Private Key

From the JSON file you downloaded in step 4:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "brightwire-automation@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

Copy the `private_key` value and the `client_email` value to your `.env` file.

## 🧪 Testing the Setup

### 1. Test Google Sheets Connection

```bash
node -e "
const GoogleSheetsHelper = require('./lib/googlesheets');
const sheets = new GoogleSheetsHelper();
sheets.getAllRows().then(data => {
  console.log('✅ Google Sheets connection successful!');
  console.log('📊 Found', data.length, 'rows');
  console.log('📋 Sample data:', data[0]);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
});
"
```

### 2. Test Full Automation

```bash
# Test with dry run
node scripts/createPreviewBranches.js --dry-run=true
```

## 📊 Google Sheet Structure

Your Google Sheet should have these columns:

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `id` | Number | Unique identifier | ✅ |
| `business_name` | Text | Business name | ✅ |
| `phone` | Text | Phone number | ✅ |
| `address` | Text | Street address | ✅ |
| `suburb` | Text | Suburb/City | ✅ |
| `wants_preview` | Text | "yes" or "no" | ✅ |
| `preview_url` | Text | Vercel deployment URL | ❌ (auto-filled) |
| `branch` | Text | GitHub branch name | ❌ (auto-filled) |
| `status` | Text | "deployed", "failed", "dry-run" | ❌ (auto-filled) |
| `deployedAt` | Text | ISO timestamp | ❌ (auto-filled) |
| `error` | Text | Error message (if failed) | ❌ (auto-filled) |

## 🔄 Workflow with Google Sheets

1. **Add Business Data** - Add new businesses to your Google Sheet
2. **Set wants_preview** - Mark "yes" for businesses that want previews
3. **Run Automation** - Execute the preview creation script
4. **Monitor Progress** - Watch the sheet update with results
5. **Share URLs** - Copy preview URLs to share with customers

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Service account not found"
```
Solution: Check GOOGLE_SERVICE_ACCOUNT_EMAIL is correct
```

#### 2. "Permission denied"
```
Solution: Ensure service account has Editor access to the sheet
```

#### 3. "Sheet not found"
```
Solution: Check GOOGLE_SHEET_ID is correct from the URL
```

#### 4. "Invalid private key"
```
Solution: Ensure private key includes \n characters and is properly quoted
```

### Debug Mode

Enable detailed logging:

```bash
DEBUG=true node scripts/createPreviewBranches.js
```

## 🔒 Security Best Practices

1. **Never commit** the service account JSON file to version control
2. **Use environment variables** for all credentials
3. **Limit service account permissions** to only what's needed
4. **Regularly rotate** service account keys
5. **Monitor access** through Google Cloud Console

## 📈 Benefits of Google Sheets

✅ **Real-time collaboration** - Multiple people can update data  
✅ **No file management** - No need to upload/download Excel files  
✅ **Automatic backups** - Google handles version history  
✅ **Easy sharing** - Share specific sheets with team members  
✅ **Mobile access** - Update data from anywhere  
✅ **Integration** - Works with other Google Workspace tools  

## 🎯 Next Steps

1. **Set up your Google Cloud project** (steps 1-4)
2. **Create and configure your Google Sheet** (steps 5-8)
3. **Update your environment variables** (step 9)
4. **Test the connection** (testing section)
5. **Run your first automation** with dry-run mode
6. **Go live** with real preview creation!

Your Google Sheets integration is now ready to power your automated preview generation system! 🚀
