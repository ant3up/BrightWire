/**
 * Vapi Webhook Server
 * 
 * Express server to handle Vapi webhook events and update Google Sheets
 * with contact outcomes.
 */

const express = require('express');
const { handleVapiWebhook, healthCheck } = require('./vapi-webhook');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', healthCheck);

// Vapi webhook endpoint
app.post('/vapi-webhook', handleVapiWebhook);

// Alternative endpoint for compatibility
app.post('/webhook', handleVapiWebhook);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Vapi Webhook Server',
    status: 'running',
    endpoints: {
      health: '/health',
      webhook: '/vapi-webhook',
      alt_webhook: '/webhook'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error.message);
  console.error('Stack trace:', error.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 Vapi Webhook Server started');
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📞 Webhook URL: http://localhost:${PORT}/vapi-webhook`);
    console.log('\n📋 Environment check:');
    console.log(`  • USE_GOOGLE_SHEETS: ${process.env.USE_GOOGLE_SHEETS || 'not set'}`);
    console.log(`  • GOOGLE_SHEET_ID: ${process.env.GOOGLE_SHEET_ID ? 'set' : 'not set'}`);
    console.log(`  • API_BASE_URL: ${process.env.API_BASE_URL || 'not set'}`);
    console.log(`  • SMS_API_TOKEN: ${process.env.SMS_API_TOKEN ? 'set' : 'not set'}`);
  });
}

module.exports = app;

