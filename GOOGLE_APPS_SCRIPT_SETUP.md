# Google Apps Script Setup for BrightWire Preview Automation

## Overview
This Google Apps Script monitors your Google Sheet and automatically triggers preview generation when someone sets `wants_preview = "yes"`.

## Setup Instructions

### 1. Open Your Google Sheet
- Go to your Google Sheet with the business data
- Make sure it has columns: `business_name`, `phone`, `address`, `wants_preview`, `preview_url`, `branch`, `status`, `deployedAt`, `error`

### 2. Create Apps Script
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete all the default code in the editor
3. Copy and paste the entire contents of `google-apps-script.js` into the editor
4. Save the project (Ctrl+S or Cmd+S)
5. Give it a name like "BrightWire Preview Automation"

### 3. Set Up Trigger
1. In the Apps Script editor, click the **Triggers** icon (clock) in the left sidebar
2. Click **+ Add Trigger**
3. Configure the trigger:
   - **Function to run**: `onEdit`
   - **Event source**: `From spreadsheet`
   - **Event type**: `On edit`
4. Click **Save**

### 4. Test the Setup
1. In your Google Sheet, set `wants_preview = "yes"` for any business
2. Check the Apps Script logs:
   - In Apps Script editor, go to **Executions** (clock icon)
   - Look for recent executions and check for any errors

### 5. Manual Testing (Optional)
You can also test manually:
1. In Apps Script editor, select `testWebhook` function
2. Click **Run** to test the webhook connection
3. Or select `processAllPendingPreviews` to process all rows with `wants_preview = "yes"`

## How It Works

1. **User sets `wants_preview = "yes"`** in Google Sheet
2. **Apps Script detects the change** via `onEdit` trigger
3. **Script calls webhook** with business data
4. **Webhook triggers GitHub Action** for cloud processing
5. **GitHub Action runs automation** and updates Google Sheet with results

## Troubleshooting

### Apps Script Not Triggering
- Check that the trigger is set up correctly
- Verify the column positions in the script match your sheet
- Check Apps Script execution logs for errors

### Webhook Not Working
- Verify the webhook URL is correct
- Check that the secret key matches
- Look at Apps Script execution logs for webhook response

### GitHub Action Not Running
- Ensure GitHub repository secrets are configured
- Check GitHub Actions tab for workflow runs
- Verify the webhook is receiving the correct payload

## Column Mapping
The script expects these columns (adjust if your sheet is different):
- Column A: `business_name`
- Column B: `phone`
- Column C: `address`
- Column D: `wants_preview`
- Column E: `preview_url`
- Column F: `branch`
- Column G: `status`
- Column H: `deployedAt`
- Column I: `error`

## Security Notes
- The webhook secret is embedded in the script for simplicity
- For production use, consider using Google Apps Script Properties Service to store secrets
- The webhook URL and secret are visible in the script - ensure your repository is private if needed
