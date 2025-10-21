# 🧪 Google Sheets Integration Test Guide

## 📋 Current Test Results

The Google Sheets integration test is **working correctly** but needs proper configuration. Here's what we found:

```
✅ Test script is functional
✅ Environment variable checking works
✅ Google Sheets library is properly installed
❌ Missing required environment variables
```

## 🔧 Setup Required

To test the Google Sheets integration, you need to:

### 1. Create Your `.env` File

Copy the template and fill in your values:

```bash
# Copy the test configuration
cp test-config.env .env

# Edit with your actual values
notepad .env  # or use your preferred editor
```

### 2. Get Your Google Sheets Credentials

Follow the detailed setup guide in `GOOGLE-SHEETS-SETUP.md` to get:

- **Google Sheet ID** - From your Google Sheets URL
- **Service Account Email** - From your Google Cloud service account
- **Private Key** - From the downloaded JSON file

### 3. Fill in Your `.env` File

```env
# Google Sheets Configuration
USE_GOOGLE_SHEETS=true
GOOGLE_SHEET_ID=1ABC123DEF456GHI789JKL  # Your actual sheet ID
GOOGLE_SERVICE_ACCOUNT_EMAIL=brightwire-automation@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GOOGLE_WORKSHEET_NAME=Sheet1

# Other required variables...
GITHUB_TOKEN=ghp_your_github_token
VERCEL_TOKEN=your_vercel_token
# ... etc
```

## 🧪 Test Commands

### 1. Test Google Sheets Connection Only

```bash
# Test just the Google Sheets connection
node scripts/testGoogleSheets.js
```

### 2. Test Full Integration

```bash
# Test the complete automation with Google Sheets
node scripts/createPreviewBranches.js --dry-run=true
```

### 3. Test with Custom Sheet

```bash
# Test with a specific sheet
node scripts/createPreviewBranches.js --sheet=your-sheet-id --dry-run=true
```

## 📊 Expected Test Results

### ✅ Successful Connection
```
🧪 Testing Google Sheets Integration
=====================================

📋 Checking environment variables...
✅ All required environment variables found

🔗 Testing Google Sheets connection...
📖 Reading data from Google Sheets: 1ABC123DEF456GHI789JKL
✅ Successfully connected to Google Sheets!
📊 Found 5 rows

📋 Sample data (first row):
{
  "id": "1",
  "business_name": "ABC Electrical",
  "phone": "0412 345 678",
  "address": "123 Main St",
  "suburb": "Melbourne",
  "wants_preview": "yes",
  "preview_url": "",
  "branch": "",
  "status": "",
  "deployedAt": "",
  "error": ""
}

✅ All required columns found
📋 Getting worksheet headers...
Headers: id, business_name, phone, address, suburb, wants_preview, preview_url, branch, status, deployedAt, error

🎉 Google Sheets integration test completed successfully!
```

### ❌ Common Issues

#### Missing Environment Variables
```
❌ Missing required environment variables:
  • GOOGLE_SHEET_ID
  • GOOGLE_SERVICE_ACCOUNT_EMAIL
  • GOOGLE_PRIVATE_KEY
```

#### Permission Denied
```
❌ Google Sheets test failed:
Permission denied. Check service account has Editor access to the sheet.
```

#### Invalid Sheet ID
```
❌ Google Sheets test failed:
Sheet not found. Check GOOGLE_SHEET_ID is correct.
```

## 🔧 Troubleshooting

### 1. Check Environment Variables

```bash
# Verify your .env file exists and has the right values
cat .env | grep GOOGLE
```

### 2. Test Google Sheets Access

```bash
# Test with a simple connection
node -e "
const GoogleSheetsHelper = require('./lib/googlesheets');
const sheets = new GoogleSheetsHelper();
sheets.getAllRows().then(data => {
  console.log('✅ Connection successful!');
  console.log('📊 Found', data.length, 'rows');
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
});
"
```

### 3. Check Sheet Structure

Your Google Sheet should have these columns in row 1:
- `id`, `business_name`, `phone`, `address`, `suburb`, `wants_preview`
- `preview_url`, `branch`, `status`, `deployedAt`, `error`

### 4. Verify Service Account Access

1. Go to your Google Sheet
2. Click "Share" button
3. Add your service account email
4. Give it "Editor" permissions
5. Click "Send"

## 🎯 Next Steps

1. **Set up Google Cloud project** (see `GOOGLE-SHEETS-SETUP.md`)
2. **Create Google Sheet** with business data
3. **Configure `.env` file** with your credentials
4. **Run the test** with `node scripts/testGoogleSheets.js`
5. **Test full automation** with `node scripts/createPreviewBranches.js --dry-run=true`

## 📞 Need Help?

If you encounter issues:

1. **Check the setup guide** in `GOOGLE-SHEETS-SETUP.md`
2. **Verify your credentials** are correct
3. **Test with dry-run mode** first
4. **Check the troubleshooting section** above

The Google Sheets integration is ready to use once you have the proper credentials configured! 🚀
