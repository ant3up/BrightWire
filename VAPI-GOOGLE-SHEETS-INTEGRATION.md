# 📞 Vapi + Google Sheets Integration Guide

## 🎯 Overview

This integration allows your Vapi agent to automatically record contact outcomes in Google Sheets after each phone call. The system tracks call results, customer sentiment, and next steps for each business contact.

## 🏗️ Architecture

```
Vapi Agent → Webhook → Google Sheets → Preview Generation
     ↓           ↓           ↓              ↓
  Phone Call → Outcome → Update Sheet → Send Preview
```

## 📋 Prerequisites

1. **Vapi Account** - [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. **Google Cloud Project** - For Sheets API access
3. **Webhook Server** - To receive Vapi events
4. **Google Sheet** - With business data and outcome columns

## 🚀 Quick Setup

### 1. Update Google Sheets Structure

```bash
# Add contact outcome columns to your sheet
node scripts/updateGoogleSheetsStructure.js
```

This adds these columns:
- `call_outcome` - Result of the call
- `call_sentiment` - Customer sentiment  
- `call_duration` - Call length
- `call_cost` - Call cost
- `call_ended_reason` - Why call ended
- `call_transcript` - Full conversation
- `call_notes` - AI-generated notes
- `next_steps` - Recommended action
- `last_contacted` - Contact timestamp
- `contact_attempts` - Number of attempts

### 2. Deploy Webhook Server

```bash
# Start the webhook server
node api/vapi-webhook-server.js
```

Or deploy to your hosting platform:
- **Vercel**: `vercel deploy`
- **Railway**: `railway up`
- **Heroku**: `git push heroku main`

### 3. Configure Vapi Agent

1. **Create Assistant** in Vapi Dashboard
2. **Upload Configuration**: Use `vapi-agent-with-outcomes.json`
3. **Set Webhook URL**: `https://your-domain.com/vapi-webhook`
4. **Add Webhook Secret**: For authentication

### 4. Test Integration

```bash
# Test Google Sheets connection
node scripts/testGoogleSheets.js

# Test webhook server
curl -X POST https://your-domain.com/health
```

## 📊 Google Sheets Structure

Your sheet should have these columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | Number | Unique ID | 1 |
| `business_name` | Text | Business name | "ABC Electrical" |
| `phone` | Text | Phone number | "+61412345678" |
| `address` | Text | Street address | "123 Main St" |
| `suburb` | Text | Suburb/City | "Melbourne" |
| `wants_preview` | Text | "yes"/"no" | "yes" |
| `call_outcome` | Text | Call result | "qualified_lead" |
| `call_sentiment` | Text | Customer mood | "positive" |
| `call_duration` | Number | Seconds | 120 |
| `call_cost` | Number | Cost in dollars | 0.15 |
| `call_ended_reason` | Text | Why ended | "customer-ended-call" |
| `call_transcript` | Text | Full conversation | "Hello, this is Alex..." |
| `call_notes` | Text | AI summary | "Customer interested in preview" |
| `next_steps` | Text | Next action | "send_preview" |
| `last_contacted` | Text | ISO timestamp | "2024-01-01T10:00:00Z" |
| `contact_attempts` | Number | Attempt count | 1 |

## 🔧 Configuration

### Environment Variables

```env
# Google Sheets
USE_GOOGLE_SHEETS=true
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_WORKSHEET_NAME=Sheet1

# Webhook Server
PORT=3000
API_BASE_URL=https://your-domain.com
API_TOKEN=your_api_token
SMS_API_TOKEN=your_sms_token
```

### Vapi Agent Configuration

```json
{
  "name": "BrightWire Sales Agent",
  "serverUrl": "https://your-domain.com/vapi-webhook",
  "serverUrlSecret": "your-webhook-secret",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "record_contact_outcome",
        "description": "Record the outcome of the contact attempt"
      }
    }
  ]
}
```

## 📞 Call Flow

### 1. **Outbound Call Initiated**
- Vapi calls business from your list
- Agent introduces BrightWire services
- Collects business information

### 2. **During Call**
- Agent assesses interest level
- Records customer responses
- Determines next steps

### 3. **Call Ends**
- Vapi sends webhook to your server
- Server updates Google Sheets
- Records outcome and sentiment

### 4. **Post-Call Actions**
- If qualified lead: Generate preview
- Send SMS with preview link
- Update contact status

## 🎯 Call Outcomes

The system tracks these outcomes:

| Outcome | Description | Next Steps |
|---------|-------------|------------|
| `qualified_lead` | Interested in service | Send preview |
| `not_interested` | Not interested | Remove from list |
| `no_answer` | No one answered | Schedule callback |
| `busy` | Line busy | Try again later |
| `wrong_number` | Invalid number | Remove from list |
| `callback_requested` | Wants callback | Schedule follow-up |
| `do_not_call` | Do not contact | Remove from list |

## 📱 SMS Integration

When a qualified lead is identified:

```javascript
// Automatic SMS sent to customer
const message = `Hi ${businessName}! Your personalized website preview is ready! View it here: ${previewUrl}`;
```

## 🔍 Monitoring & Analytics

### Google Sheets Dashboard

Track these metrics:
- **Call Success Rate**: Qualified leads / Total calls
- **Average Call Duration**: Total time / Number of calls  
- **Cost per Lead**: Total cost / Qualified leads
- **Response Rate**: Answered calls / Total attempts

### Real-time Updates

- **Live Sheet Updates**: See results as calls complete
- **Team Collaboration**: Multiple users can view progress
- **Export Data**: Download results for analysis

## 🛠️ Troubleshooting

### Common Issues

#### 1. **Webhook Not Receiving Events**
```bash
# Check webhook URL in Vapi dashboard
# Verify server is running and accessible
curl -X POST https://your-domain.com/vapi-webhook
```

#### 2. **Google Sheets Not Updating**
```bash
# Test Google Sheets connection
node scripts/testGoogleSheets.js

# Check service account permissions
# Verify sheet ID is correct
```

#### 3. **SMS Not Sending**
```bash
# Check SMS_API_TOKEN is set
# Verify SMS service configuration
# Test with curl request
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true node api/vapi-webhook-server.js

# Check webhook logs
tail -f webhook.log
```

## 📈 Advanced Features

### 1. **Call Scheduling**
- Schedule calls for optimal times
- Avoid calling same number multiple times
- Respect do-not-call requests

### 2. **Follow-up Automation**
- Automatic callback scheduling
- Email follow-up sequences
- Campaign management

### 3. **Analytics Dashboard**
- Real-time call metrics
- Conversion tracking
- Cost analysis

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Option 2: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up

# Set environment variables
railway variables set GOOGLE_SHEET_ID=your_id
```

### Option 3: Heroku
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Set environment variables
heroku config:set GOOGLE_SHEET_ID=your_id
```

## 📞 Next Steps

1. **Set up Google Sheets** with business data
2. **Deploy webhook server** to your hosting platform
3. **Configure Vapi agent** with webhook URL
4. **Test with sample calls** to verify integration
5. **Start calling businesses** and watch results update in real-time!

## 🎉 Benefits

- **Real-time Tracking**: See call results as they happen
- **Team Collaboration**: Multiple users can view progress
- **Automatic Follow-up**: Qualified leads get previews automatically
- **Cost Tracking**: Monitor call costs and ROI
- **Data Export**: Download results for analysis
- **Scalable**: Handle hundreds of calls per day

Your Vapi + Google Sheets integration is now ready for production use! 🚀

