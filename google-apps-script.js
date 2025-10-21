/**
 * Google Apps Script for BrightWire Preview Automation
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire script
 * 4. Save the project (Ctrl+S)
 * 5. Go to Triggers (clock icon) > Add Trigger
 * 6. Set: Function = onEdit, Event source = From spreadsheet, Event type = On edit
 * 7. Save the trigger
 * 
 * The script will automatically trigger when someone sets wants_preview = "yes"
 */

// Configuration - Update these values
const WEBHOOK_URL = 'https://brightwire-electrical-website.vercel.app/api/preview';
const WEBHOOK_SECRET = '7ba1be77753b4b91cf8623de7e6ad608d6e163cb42839b2fbffd31aca562a225';

// Column mapping - adjust if your sheet has different column positions
const COLUMNS = {
  BUSINESS_NAME: 1,    // Column A
  PHONE: 2,           // Column B  
  ADDRESS: 3,         // Column C
  WANTS_PREVIEW: 4,   // Column D
  PREVIEW_URL: 5,     // Column E
  BRANCH: 6,          // Column F
  STATUS: 7,          // Column G
  DEPLOYED_AT: 8,      // Column H
  ERROR: 9            // Column I
};

/**
 * Triggered when the sheet is edited
 */
function onEdit(e) {
  try {
    const range = e.range;
    const sheet = e.source.getActiveSheet();
    
    // Only process if the edit is in the wants_preview column
    if (range.getColumn() === COLUMNS.WANTS_PREVIEW) {
      const row = range.getRow();
      const value = range.getValue();
      
      // Only trigger if wants_preview is set to "yes"
      if (value && value.toString().toLowerCase().trim() === 'yes') {
        console.log(`Preview requested for row ${row}`);
        
        // Get business data from the row
        const businessData = getBusinessData(sheet, row);
        
        if (businessData) {
          // Trigger the webhook
          triggerPreviewGeneration(row, businessData);
        }
      }
    }
  } catch (error) {
    console.error('Error in onEdit:', error);
    // Log error to a cell for debugging
    const sheet = e.source.getActiveSheet();
    const errorCell = sheet.getRange(e.range.getRow(), COLUMNS.ERROR);
    errorCell.setValue(`Apps Script Error: ${error.message}`);
  }
}

/**
 * Get business data from a specific row
 */
function getBusinessData(sheet, row) {
  try {
    const businessName = sheet.getRange(row, COLUMNS.BUSINESS_NAME).getValue();
    const phone = sheet.getRange(row, COLUMNS.PHONE).getValue();
    const address = sheet.getRange(row, COLUMNS.ADDRESS).getValue();
    
    if (!businessName) {
      console.log(`No business name found in row ${row}`);
      return null;
    }
    
    return {
      rowIndex: row,
      business_name: businessName,
      phone: phone,
      address: address
    };
  } catch (error) {
    console.error(`Error getting business data for row ${row}:`, error);
    return null;
  }
}

/**
 * Trigger preview generation via webhook
 */
function triggerPreviewGeneration(rowIndex, businessData) {
  try {
    console.log(`Triggering preview for: ${businessData.business_name}`);
    
    const payload = {
      rowIndex: rowIndex,
      business_name: businessData.business_name,
      phone: businessData.phone,
      address: businessData.address
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-preview-secret': WEBHOOK_SECRET
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    console.log('Webhook response:', responseData);
    
    if (responseData.ok) {
      // Update status in the sheet
      updateSheetStatus(rowIndex, 'triggered', 'Preview generation triggered');
    } else {
      throw new Error(responseData.error || 'Unknown webhook error');
    }
    
  } catch (error) {
    console.error('Error triggering preview:', error);
    updateSheetStatus(rowIndex, 'error', `Webhook failed: ${error.message}`);
  }
}

/**
 * Update status in the Google Sheet
 */
function updateSheetStatus(rowIndex, status, message) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Update status column
    sheet.getRange(rowIndex, COLUMNS.STATUS).setValue(status);
    
    // Update error column if there's an error
    if (status === 'error') {
      sheet.getRange(rowIndex, COLUMNS.ERROR).setValue(message);
    }
    
    console.log(`Updated row ${rowIndex} status to: ${status}`);
  } catch (error) {
    console.error('Error updating sheet status:', error);
  }
}

/**
 * Manual function to test the webhook
 * Run this from the Apps Script editor to test
 */
function testWebhook() {
  const testData = {
    rowIndex: 1,
    business_name: 'Test Business',
    phone: '0400 000 000',
    address: '123 Test Street'
  };
  
  triggerPreviewGeneration(1, testData);
}

/**
 * Manual function to process all rows with wants_preview = "yes"
 * Run this from the Apps Script editor to process all pending requests
 */
function processAllPendingPreviews() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let processedCount = 0;
    
    for (let i = 1; i < values.length; i++) { // Start from row 2 (skip header)
      const row = i + 1; // Convert to 1-based row number
      const wantsPreview = values[i][COLUMNS.WANTS_PREVIEW - 1];
      const currentStatus = values[i][COLUMNS.STATUS - 1];
      
      if (wantsPreview && wantsPreview.toString().toLowerCase().trim() === 'yes' && 
          (!currentStatus || currentStatus === '')) {
        
        const businessData = getBusinessData(sheet, row);
        if (businessData) {
          triggerPreviewGeneration(row, businessData);
          processedCount++;
          
          // Add a small delay to avoid overwhelming the webhook
          Utilities.sleep(1000);
        }
      }
    }
    
    console.log(`Processed ${processedCount} pending preview requests`);
    return processedCount;
  } catch (error) {
    console.error('Error processing all pending previews:', error);
    throw error;
  }
}
