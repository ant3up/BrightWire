#!/usr/bin/env node

const XLSX = require('xlsx');

/**
 * Create a template Excel file for the automation system
 */
function createTemplate() {
  console.log('📝 Creating Excel template...');
  
  // Sample data
  const data = [
    {
      id: 1,
      business_name: 'ABC Electrical',
      phone: '0412 345 678',
      address: '123 Main St',
      suburb: 'Melbourne',
      wants_preview: 'yes',
      preview_url: '',
      branch: '',
      status: '',
      deployedAt: '',
      error: ''
    },
    {
      id: 2,
      business_name: 'XYZ Plumbing',
      phone: '0413 456 789',
      address: '456 Oak Ave',
      suburb: 'Sydney',
      wants_preview: 'yes',
      preview_url: '',
      branch: '',
      status: '',
      deployedAt: '',
      error: ''
    },
    {
      id: 3,
      business_name: 'DEF Carpentry',
      phone: '0414 567 890',
      address: '789 Pine Rd',
      suburb: 'Brisbane',
      wants_preview: 'no',
      preview_url: '',
      branch: '',
      status: '',
      deployedAt: '',
      error: ''
    },
    {
      id: 4,
      business_name: 'GHI Landscaping',
      phone: '0415 678 901',
      address: '321 Elm St',
      suburb: 'Perth',
      wants_preview: 'yes',
      preview_url: '',
      branch: '',
      status: '',
      deployedAt: '',
      error: ''
    },
    {
      id: 5,
      business_name: 'JKL Roofing',
      phone: '0416 789 012',
      address: '654 Maple Dr',
      suburb: 'Adelaide',
      wants_preview: 'yes',
      preview_url: '',
      branch: '',
      status: '',
      deployedAt: '',
      error: ''
    }
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Write file
  XLSX.writeFile(workbook, 'clients-template.xlsx');
  
  console.log('✅ Template created: clients-template.xlsx');
  console.log('\n📋 Template includes:');
  console.log('  • Sample business data');
  console.log('  • All required columns');
  console.log('  • Ready for automation');
  console.log('\n💡 Copy to clients.xlsx and customize with your data');
}

// Run if called directly
if (require.main === module) {
  createTemplate();
}

module.exports = createTemplate;
