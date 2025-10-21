# Simple Google Apps Script Setup (Alternative Method)

If you're getting authentication errors, try this simpler approach:

## Method 1: Direct Apps Script Access
1. **Go directly to**: `https://script.google.com`
2. **Sign in** with your Google account
3. **Click "New Project"**
4. **Copy the code** from `google-apps-script.js`
5. **Save** the project (Ctrl+S)
6. **Name it**: "BrightWire Preview Automation"

## Method 2: Manual Trigger Setup
1. In Apps Script editor, click **"Triggers"** (clock icon)
2. Click **"+ Add Trigger"**
3. Set:
   - **Function**: `onEdit`
   - **Event source**: `From spreadsheet`
   - **Event type**: `On edit`
4. **Save**

## Method 3: Connect to Your Sheet
1. In Apps Script editor, click **"Deploy"** → **"New deployment"**
2. Choose **"Web app"**
3. Set **"Execute as"**: `Me`
4. Set **"Who has access"**: `Anyone`
5. **Deploy**
6. Copy the web app URL
7. Go to your Google Sheet
8. Go to **Extensions** → **Apps Script**
9. Paste the web app URL in the browser

## Method 4: Test Without Sheet Connection
You can test the webhook directly without connecting to the sheet:

1. In Apps Script editor, select the `testWebhook` function
2. Click **"Run"**
3. Check the logs to see if it works

## Troubleshooting
- **Clear browser cache** completely
- **Try incognito mode**
- **Use a different browser** (Chrome, Firefox, Edge)
- **Disable browser extensions** temporarily
- **Check if you have multiple Google accounts** - make sure you're signed into the right one

## If All Else Fails
We can set up the automation without Google Apps Script by:
1. Using a simple webhook endpoint
2. Manually triggering via curl commands
3. Setting up a scheduled job

Let me know which method works for you!
