# 📊 Google Sheets Integration - Complete Implementation

## 🎉 What's Been Added

Your automation system now supports **Google Sheets** as a data source alongside Excel files! This provides real-time collaboration, automatic backups, and easier data management.

## 📁 New Files Created

### Core Integration
- **`lib/googlesheets.js`** - Google Sheets API helper with full CRUD operations
- **`scripts/testGoogleSheets.js`** - Test script to verify Google Sheets connection
- **`GOOGLE-SHEETS-SETUP.md`** - Comprehensive setup guide

### Updated Files
- **`scripts/createPreviewBranches.js`** - Now supports both Excel and Google Sheets
- **`env.example`** - Added Google Sheets configuration variables
- **`README-AUTOMATION.md`** - Updated with Google Sheets instructions
- **`package.json`** - Added Google Sheets dependencies

## 🔧 New Dependencies Installed

```json
{
  "google-spreadsheet": "^5.0.2",
  "google-auth-library": "^10.4.1"
}
```

## 🚀 How to Use Google Sheets

### 1. Quick Setup

```bash
# Install dependencies (already done)
npm install google-spreadsheet google-auth-library

# Test Google Sheets connection
node scripts/testGoogleSheets.js
```

### 2. Environment Configuration

Add to your `.env` file:

```env
# Enable Google Sheets
USE_GOOGLE_SHEETS=true

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_WORKSHEET_NAME=Sheet1
```

### 3. Google Sheet Structure

Your Google Sheet should have these columns:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | business_name | phone | address | suburb | wants_preview | preview_url | branch | status | deployedAt | error |

### 4. Run Automation

```bash
# Same commands work for both Excel and Google Sheets
npm run create-previews

# Or with options
node scripts/createPreviewBranches.js --limit=5 --dry-run=true
```

## 🔄 Data Flow

### Reading Data
1. **Excel Mode**: Reads from local Excel file
2. **Google Sheets Mode**: Connects to Google Sheets API and reads data

### Writing Results
1. **Excel Mode**: Updates local Excel file
2. **Google Sheets Mode**: Updates individual rows in Google Sheets

### Real-time Updates
- Google Sheets updates are **immediate** and **collaborative**
- Multiple team members can see progress in real-time
- No need to share Excel files or manage versions

## 🎯 Benefits of Google Sheets

### ✅ **Real-time Collaboration**
- Multiple people can update business data simultaneously
- No file conflicts or version management issues
- Changes are visible immediately to all team members

### ✅ **Automatic Backups**
- Google handles version history automatically
- No risk of losing data
- Easy to revert changes if needed

### ✅ **Easy Sharing**
- Share specific sheets with team members
- Control access permissions
- No need to email files back and forth

### ✅ **Mobile Access**
- Update business data from anywhere
- Works on phones, tablets, and computers
- Offline editing with sync when online

### ✅ **Integration Ready**
- Works with other Google Workspace tools
- Can connect to external systems
- API access for custom integrations

## 🛠️ Setup Process

### Step 1: Google Cloud Setup
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account
4. Download service account JSON key

### Step 2: Google Sheet Setup
1. Create Google Sheet with required columns
2. Add sample business data
3. Share sheet with service account
4. Get sheet ID from URL

### Step 3: Environment Configuration
1. Copy service account credentials to `.env`
2. Set `USE_GOOGLE_SHEETS=true`
3. Test connection with `node scripts/testGoogleSheets.js`

### Step 4: Run Automation
1. Add business data to Google Sheet
2. Set `wants_preview=yes` for businesses that want previews
3. Run automation script
4. Watch results update in real-time!

## 🔒 Security Features

- **Service Account Authentication** - Secure API access
- **Environment Variables** - No hardcoded credentials
- **Permission Control** - Service account only has access to specific sheet
- **Audit Trail** - Google tracks all changes and access

## 📊 Monitoring & Debugging

### Test Connection
```bash
node scripts/testGoogleSheets.js
```

### Debug Mode
```bash
DEBUG=true node scripts/createPreviewBranches.js
```

### Check Sheet Structure
The test script will verify:
- ✅ Connection to Google Sheets
- ✅ Required columns exist
- ✅ Sample data format
- ✅ Service account permissions

## 🎉 Ready to Use!

Your automation system now supports both **Excel files** and **Google Sheets**:

- **Excel Mode**: `USE_GOOGLE_SHEETS=false` (default)
- **Google Sheets Mode**: `USE_GOOGLE_SHEETS=true`

The same commands work for both data sources, making it easy to switch between them or use both simultaneously for different purposes.

## 📞 Next Steps

1. **Follow the setup guide** in `GOOGLE-SHEETS-SETUP.md`
2. **Test the connection** with the test script
3. **Add your business data** to Google Sheets
4. **Run your first automation** with dry-run mode
5. **Go live** with real preview creation!

Your Google Sheets integration is now complete and ready for production use! 🚀
