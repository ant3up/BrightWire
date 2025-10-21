const fs = require('fs');
const XLSX = require('xlsx');

/**
 * Helper script to update Excel sheet with preview results
 */
class SheetUpdater {
  constructor(sheetPath) {
    this.sheetPath = sheetPath;
  }

  /**
   * Update a specific row in the Excel file
   * @param {number} rowIndex - Row index to update (0-based)
   * @param {Object} updates - Object with column names and new values
   */
  updateRow(rowIndex, updates) {
    try {
      console.log(`📝 Updating row ${rowIndex + 1} in ${this.sheetPath}`);
      
      // Read existing file
      const workbook = XLSX.readFile(this.sheetPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON for easier manipulation
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Update the specific row
      if (rowIndex < data.length) {
        Object.assign(data[rowIndex], updates);
        console.log(`✅ Updated row ${rowIndex + 1}:`, updates);
      } else {
        console.log(`⚠️  Row ${rowIndex + 1} not found`);
        return false;
      }
      
      // Convert back to worksheet
      const newWorksheet = XLSX.utils.json_to_sheet(data);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
      
      // Write back to file
      XLSX.writeFile(newWorkbook, this.sheetPath);
      console.log(`💾 Saved updated sheet to ${this.sheetPath}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to update row ${rowIndex + 1}:`, error.message);
      return false;
    }
  }

  /**
   * Add a new row to the Excel file
   * @param {Object} businessData - Business data object
   */
  addRow(businessData) {
    try {
      console.log(`➕ Adding new row to ${this.sheetPath}`);
      
      // Read existing file
      const workbook = XLSX.readFile(this.sheetPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // Add new row
      data.push(businessData);
      
      // Convert back to worksheet
      const newWorksheet = XLSX.utils.json_to_sheet(data);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
      
      // Write back to file
      XLSX.writeFile(newWorkbook, this.sheetPath);
      console.log(`✅ Added new row:`, businessData.business_name);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to add row:`, error.message);
      return false;
    }
  }

  /**
   * Get all rows from the Excel file
   * @returns {Array} Array of business objects
   */
  getAllRows() {
    try {
      const workbook = XLSX.readFile(this.sheetPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`📖 Read ${data.length} rows from ${this.sheetPath}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to read rows:`, error.message);
      return [];
    }
  }

  /**
   * Find row by business name
   * @param {string} businessName - Business name to search for
   * @returns {Object|null} Business object or null if not found
   */
  findRowByBusinessName(businessName) {
    try {
      const data = this.getAllRows();
      const row = data.find(business => 
        business.business_name && 
        business.business_name.toLowerCase() === businessName.toLowerCase()
      );
      
      if (row) {
        console.log(`🔍 Found business: ${businessName}`);
      } else {
        console.log(`⚠️  Business not found: ${businessName}`);
      }
      
      return row || null;
    } catch (error) {
      console.error(`❌ Failed to find business:`, error.message);
      return null;
    }
  }
}

module.exports = SheetUpdater;
