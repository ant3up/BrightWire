# 📞 How to Start Vapi Outbound Calls

## 🎯 Overview

This guide shows you how to start making outbound calls to businesses in your Google Sheet using your existing Vapi agent.

## 🚀 Quick Start

### 1. **Set Up Environment Variables**

Add these to your `.env` file:

```env
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id_here

# Google Sheets (already configured)
USE_GOOGLE_SHEETS=true
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# Optional: Call Scheduling
CALL_START_TIME=09:00
CALL_END_TIME=17:00
MAX_CALLS_PER_HOUR=10
CALL_INTERVAL_SECONDS=30
```

### 2. **Get Your Vapi Credentials**

1. **API Key**: Go to [Vapi Dashboard](https://dashboard.vapi.ai) → Settings → API Keys
2. **Assistant ID**: Go to Assistants → Your Assistant → Copy the ID
3. **Phone Number ID**: Go to Phone Numbers → Your Number → Copy the ID

### 3. **Start Making Calls**

```bash
# Option 1: Start calling immediately
npm run start-vapi-calls

# Option 2: Schedule calls with smart timing
npm run schedule-vapi-calls

# Option 3: Test Vapi connection first
node scripts/startVapiCalls.js --test
```

## 📊 How It Works

### 1. **Reads Your Google Sheet**
- Gets all businesses with phone numbers
- Filters out businesses already called recently
- Skips businesses marked as "do not call"

### 2. **Makes Outbound Calls**
- Uses your existing Vapi agent
- Passes business context to the agent
- Tracks call status in Google Sheets

### 3. **Records Outcomes**
- Webhook receives call results
- Updates Google Sheets with outcomes
- Generates previews for qualified leads

## 🎯 Call Flow

```
Google Sheet → Script → Vapi API → Phone Call → Webhook → Update Sheet
```

1. **Script reads** businesses from Google Sheet
2. **Calls Vapi API** to initiate outbound call
3. **Vapi calls** the business phone number
4. **Agent talks** to the business owner
5. **Call ends** and webhook receives outcome
6. **Google Sheets updated** with call results

## 📋 Google Sheet Requirements

Your sheet needs these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `business_name` | ✅ | Business name |
| `phone` | ✅ | Phone number (with country code) |
| `address` | ❌ | Business address |
| `suburb` | ❌ | Business suburb |
| `last_contacted` | ❌ | Last contact timestamp |
| `contact_attempts` | ❌ | Number of attempts |
| `call_outcome` | ❌ | Result of last call |

## 🚀 Starting Your First Calls

### Step 1: Test Connection
```bash
# Test Vapi connection
node scripts/startVapiCalls.js --test
```

### Step 2: Start Calling
```bash
# Start calling businesses
npm run start-vapi-calls
```

### Step 3: Monitor Results
- Watch your Google Sheet update in real-time
- Check your webhook server logs
- Review call outcomes and transcripts

## ⏰ Scheduled Calling

For automated calling during business hours:

```bash
# Start scheduled calling
npm run schedule-vapi-calls
```

This will:
- Only call during business hours (9 AM - 5 PM)
- Limit calls per hour (default: 10)
- Wait between calls (default: 30 seconds)
- Skip businesses already called recently

## 🔧 Configuration Options

### Call Timing
```env
CALL_START_TIME=09:00      # Start calling at 9 AM
CALL_END_TIME=17:00        # Stop calling at 5 PM
MAX_CALLS_PER_HOUR=10      # Max 10 calls per hour
CALL_INTERVAL_SECONDS=30   # Wait 30 seconds between calls
```

### Business Filtering
The script automatically skips:
- Businesses without phone numbers
- Businesses called in the last 24 hours
- Businesses marked as "do not call"
- Businesses with "wrong number" outcome
- Businesses with 3+ failed attempts

## 📞 Call Examples

### Example 1: Immediate Calling
```bash
# Call all available businesses now
npm run start-vapi-calls
```

### Example 2: Scheduled Calling
```bash
# Call during business hours with rate limiting
npm run schedule-vapi-calls
```

### Example 3: Test Mode
```bash
# Test Vapi connection without making calls
node scripts/startVapiCalls.js --test
```

## 🎯 Call Outcomes

Your Vapi agent will record these outcomes:

| Outcome | Description | Next Steps |
|---------|-------------|------------|
| `qualified_lead` | Interested in service | Generate preview |
| `not_interested` | Not interested | Remove from list |
| `no_answer` | No one answered | Schedule callback |
| `busy` | Line busy | Try again later |
| `wrong_number` | Invalid number | Remove from list |
| `callback_requested` | Wants callback | Schedule follow-up |
| `do_not_call` | Do not contact | Remove from list |

## 📱 Automatic Follow-up

When a qualified lead is identified:
1. **Preview generated** automatically
2. **SMS sent** to customer with preview link
3. **Sheet updated** with preview URL
4. **Follow-up scheduled** if needed

## 🔍 Monitoring Calls

### Real-time Updates
- **Google Sheets**: See results as calls complete
- **Webhook Logs**: Monitor call outcomes
- **Vapi Dashboard**: Track call status

### Analytics
- **Call Success Rate**: Qualified leads / Total calls
- **Average Duration**: Total time / Number of calls
- **Cost per Lead**: Total cost / Qualified leads
- **Response Rate**: Answered calls / Total attempts

## 🛠️ Troubleshooting

### Common Issues

#### 1. **"No businesses available for calling"**
- Check your Google Sheet has phone numbers
- Verify businesses aren't all marked as "do not call"
- Ensure some businesses haven't been called recently

#### 2. **"Vapi connection failed"**
- Check your VAPI_API_KEY is correct
- Verify VAPI_ASSISTANT_ID exists
- Ensure VAPI_PHONE_NUMBER_ID is valid

#### 3. **"Call failed" errors**
- Check phone numbers are valid (include country code)
- Verify your Vapi account has credits
- Ensure webhook server is running

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run start-vapi-calls
```

## 📊 Expected Results

After running the script, you should see:

1. **Google Sheet Updates**:
   - `last_contacted` timestamp updated
   - `contact_attempts` incremented
   - `call_status` set to "initiated" or "failed"
   - `call_id` recorded for successful calls

2. **Webhook Events**:
   - Call outcome webhooks received
   - Business records updated with results
   - Qualified leads get previews generated

3. **Call Analytics**:
   - Success rate tracking
   - Cost per lead analysis
   - Response rate monitoring

## 🎉 Ready to Start!

Your Vapi outbound calling system is now ready. You can:

1. **Start calling immediately**: `npm run start-vapi-calls`
2. **Schedule automated calling**: `npm run schedule-vapi-calls`
3. **Monitor results** in your Google Sheet
4. **Track outcomes** via webhook logs

Your automated business contact system is now live! 🚀


