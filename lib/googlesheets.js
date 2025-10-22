const { JWT } = require('google-auth-library');
require('dotenv').config();

// google-spreadsheet is ESM-only; use dynamic import to support CommonJS
let googleSpreadsheetModulePromise = null;
function loadGoogleSpreadsheetModule() {
  if (!googleSpreadsheetModulePromise) {
    googleSpreadsheetModulePromise = import('google-spreadsheet');
  }
  return googleSpreadsheetModulePromise;
}

/**
 * Google Sheets helper for reading and writing business data
 */
class GoogleSheetsHelper {
  constructor() {
    this.GoogleSpreadsheetCtor = null;
    this.googleSpreadsheetInitPromise = null;
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    this.privateKey = process.env.GOOGLE_PRIVATE_KEY;
    this.worksheetName = process.env.GOOGLE_WORKSHEET_NAME || 'Sheet1';
    
    if (!this.sheetId) {
      throw new Error('GOOGLE_SHEET_ID is required');
    }
    if (!this.serviceAccountEmail || !this.privateKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are required');
    }
  }

  async getGoogleSpreadsheetConstructor() {
    if (this.GoogleSpreadsheetCtor) {
      return this.GoogleSpreadsheetCtor;
    }
    if (!this.googleSpreadsheetInitPromise) {
      this.googleSpreadsheetInitPromise = (async () => {
        const mod = await loadGoogleSpreadsheetModule();
        const GoogleSpreadsheet = mod.GoogleSpreadsheet || mod.default;
        if (!GoogleSpreadsheet) {
          throw new Error('Failed to load google-spreadsheet module');
        }
        this.GoogleSpreadsheetCtor = GoogleSpreadsheet;
        return this.GoogleSpreadsheetCtor;
      })();
    }
    return this.googleSpreadsheetInitPromise;
  }

  /**
   * Initialize Google Sheets connection
   * @returns {Promise<GoogleSpreadsheet>} Connected spreadsheet
   */
  async initialize() {
    try {
      console.log('🔗 Connecting to Google Sheets...');
      
      // Create JWT auth
      const serviceAccountAuth = new JWT({
        email: this.serviceAccountEmail,
        key: this.privateKey.replace(/\\n/g, '\n'),
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file'
        ],
      });

      // Initialize spreadsheet
      const GoogleSpreadsheet = await this.getGoogleSpreadsheetConstructor();
      const doc = new GoogleSpreadsheet(this.sheetId, serviceAccountAuth);
      await doc.loadInfo();
      
      console.log(`✅ Connected to: ${doc.title}`);
      return doc;
    } catch (error) {
      console.error('❌ Failed to connect to Google Sheets:', error.message);
      throw new Error(`Google Sheets connection failed: ${error.message}`);
    }
  }

  /**
   * Get all rows from the worksheet
   * @returns {Promise<Array>} Array of business objects
   */
  async getAllRows() {
    try {
      console.log(`📖 Reading from Google Sheets: ${this.sheetId}`);
      
      const doc = await this.initialize();
      const sheet = doc.sheetsByTitle[this.worksheetName] || doc.sheetsByIndex[0];
      
      if (!sheet) {
        throw new Error(`Worksheet '${this.worksheetName}' not found`);
      }

      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();
      
      // Convert to plain objects
      const data = rows.map(row => {
        const obj = {};
        sheet.headerValues.forEach(header => {
          obj[header] = row.get(header);
        });
        return obj;
      });

      console.log(`✅ Read ${data.length} rows from Google Sheets`);
      return data;
    } catch (error) {
      console.error('❌ Failed to read Google Sheets:', error.message);
      throw new Error(`Failed to read Google Sheets: ${error.message}`);
    }
  }

  /**
   * Update a specific row in the worksheet
   * @param {number} rowIndex - Row index to update (1-based)
   * @param {Object} updates - Object with column names and new values
   * @returns {Promise<boolean>} Success status
   */
  async updateRow(rowIndex, updates) {
    try {
      console.log(`📝 Updating row ${rowIndex} in Google Sheets`);
      
      const doc = await this.initialize();
      const sheet = doc.sheetsByTitle[this.worksheetName] || doc.sheetsByIndex[0];
      
      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();
      
      if (rowIndex > rows.length) {
        console.log(`⚠️  Row ${rowIndex} not found`);
        return false;
      }

      const row = rows[rowIndex - 1]; // Convert to 0-based index
      
      // Update each field
      Object.keys(updates).forEach(key => {
        row.set(key, updates[key]);
      });
      
      await row.save();
      console.log(`✅ Updated row ${rowIndex}:`, updates);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to update row ${rowIndex}:`, error.message);
      return false;
    }
  }

  /**
   * Add a new row to the worksheet
   * @param {Object} businessData - Business data object
   * @returns {Promise<boolean>} Success status
   */
  async addRow(businessData) {
    try {
      console.log(`➕ Adding new row to Google Sheets`);
      
      const doc = await this.initialize();
      const sheet = doc.sheetsByTitle[this.worksheetName] || doc.sheetsByIndex[0];
      
      await sheet.loadHeaderRow();
      await sheet.addRow(businessData);
      
      console.log(`✅ Added new row:`, businessData.business_name);
      return true;
    } catch (error) {
      console.error(`❌ Failed to add row:`, error.message);
      return false;
    }
  }

  /**
   * Find row by business name
   * @param {string} businessName - Business name to search for
   * @returns {Promise<Object|null>} Business object or null if not found
   */
  async findRowByBusinessName(businessName) {
    try {
      const data = await this.getAllRows();
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

  /**
   * Get worksheet headers
   * @returns {Promise<Array>} Array of header names
   */
  async getHeaders() {
    try {
      const doc = await this.initialize();
      const sheet = doc.sheetsByTitle[this.worksheetName] || doc.sheetsByIndex[0];
      
      await sheet.loadHeaderRow();
      console.log(`📋 Headers: ${sheet.headerValues.join(', ')}`);
      
      return sheet.headerValues;
    } catch (error) {
      console.error('❌ Failed to get headers:', error.message);
      throw new Error(`Failed to get headers: ${error.message}`);
    }
  }

  /**
   * Create a new worksheet with headers
   * @param {string} worksheetName - Name of the new worksheet
   * @param {Array} headers - Array of header names
   * @returns {Promise<boolean>} Success status
   */
  async createWorksheet(worksheetName, headers) {
    try {
      console.log(`📝 Creating worksheet: ${worksheetName}`);
      
      const doc = await this.initialize();
      const sheet = await doc.addSheet({
        title: worksheetName,
        headerValues: headers
      });
      
      console.log(`✅ Created worksheet: ${worksheetName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create worksheet:`, error.message);
      return false;
    }
  }
}

module.exports = GoogleSheetsHelper;
