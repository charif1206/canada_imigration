# 📊 Google Sheets Data Flow Guide

## Overview
This guide explains how the Canada Immigration application sends client data to Google Sheets, how to test it, and how to debug issues using the new detailed logging system.

---

## 🔄 Data Flow Journey

### Step 1: Client Registration or Creation
```
Client Registration/Creation
         ↓
   Client Service
         ↓
   Create Client in Database (Prisma)
         ↓
   Trigger Sheet Service
```

**Where it happens:**
- File: `src/modules/clients/clients.service.ts`
- Methods: `registerClient()` (line 57) or `createClient()` (line 175)
- Both methods call: `await this.sheetsService.sendDataToSheet(client);`

### Step 2: Sheet Service Initialization
```
Application Startup
         ↓
    Constructor
         ↓
   Initialize Google Sheets
```

**File**: `src/modules/sheets/sheets.service.ts` (Constructor + initializeGoogleSheets method)

**What happens:**
1. Check for `GOOGLE_CREDENTIALS_PATH` environment variable
2. If file exists → Use credentials file
3. If not → Try environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY)
4. If neither → Log error, Sheets disabled

**Logs to watch for:**
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] ✅ Google Sheets service initialized with credentials file
         OR
[SHEETS] ✅ Google Sheets service initialized with environment variables
         OR
[SHEETS] ❌ Google Sheets credentials not configured.
```

### Step 3: Data Preparation
```
Client Data Object
    ↓
Extract Fields:
  - id
  - name
  - email
  - phone
  - passportNumber
  - nationality
  - dateOfBirth
  - address
  - immigrationType
  - isValidated
  - createdAt
    ↓
Format into Array Row
```

**Data Mapping:**

| Column | Source | Type | Example |
|--------|--------|------|---------|
| A | clientData.id | UUID | 123e4567-e89b-12d3-a456-426614174000 |
| B | clientData.name | String | John Doe |
| C | clientData.email | String | john@example.com |
| D | clientData.phone | String | +1-416-555-0001 |
| E | clientData.passportNumber | String | CA123456789 |
| F | clientData.nationality | String | Canadian |
| G | clientData.dateOfBirth | String | 1990-05-15 |
| H | clientData.address | String | 123 Main St, Toronto |
| I | clientData.immigrationType | String | skilled-worker |
| J | clientData.isValidated | Boolean | Yes/No |
| K | clientData.createdAt | DateTime | 11/1/2025, 7:05:00 PM |

**Logs to watch for:**
```
[SHEETS] 📤 Starting data send for client: John Doe (john@example.com)
[SHEETS] 📋 Preparing data row for client ID: 123e4567-e89b-12d3-a456-426614174000
[SHEETS] ✏️ Row prepared with 11 columns
```

### Step 4: Validation
```
Check Configuration:
  1. Is this.sheets initialized? 
  2. Is GOOGLE_SHEETS_ID set?
  3. Are credentials valid?
```

**Logs to watch for:**
```
[SHEETS] ⚠️ Google Sheets client not initialized. Spreadsheet ID: <id>
         (means credentials are not set up correctly)

[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
         (means GOOGLE_SHEETS_ID is missing from .env)
```

### Step 5: API Call to Google Sheets
```
Call: sheets.spreadsheets.values.append()
  - spreadsheetId: from .env
  - range: 'Sheet1!A:K'
  - valueInputOption: 'USER_ENTERED'
  - data: [row with 11 columns]
         ↓
   Google API Response
```

**Logs to watch for:**
```
[SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e6f7g8h9i0j
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: John Doe (john@example.com) | 
Updates: 1 rows | Duration: 234ms
```

### Step 6: Error Handling
```
Common Error Scenarios:

1. 404 Not Found
   └─ Invalid GOOGLE_SHEETS_ID
   └─ Log: [SHEETS] ❌ ERROR 404 - Spreadsheet not found

2. 403 Forbidden
   └─ Service account doesn't have access
   └─ Need to share spreadsheet with service account email
   └─ Log: [SHEETS] ❌ ERROR 403 - Permission denied

3. Invalid Credentials
   └─ GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY wrong
   └─ Log: [SHEETS] ❌ ERROR - Google credentials are invalid

4. Not Configured
   └─ No credentials file or env vars
   └─ Data is not sent but doesn't break the application
   └─ Log: [SHEETS] ⚠️ Google Sheets not configured
```

---

## 🧪 Testing Guide

### Test Setup

#### Step 1: Check Your Environment Variables

Create a `.env` file in the `backend` directory with:

```bash
# Google Sheets Configuration (Option A: Using JSON credentials file)
GOOGLE_CREDENTIALS_PATH=path/to/credentials.json

# OR Option B: Using environment variables
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"

# Always required
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0jklmnopqrstu
```

**To get GOOGLE_SHEETS_ID:**
1. Open your Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit`

#### Step 2: Share Spreadsheet with Service Account

1. Open Google Sheet
2. Click "Share" button
3. Paste service account email in recipient field
4. Click "Share" (can use "Viewer" role)

**Service account email format:**
```
your-project@your-project.iam.gserviceaccount.com
```

#### Step 3: Ensure Headers Exist

Before sending data, create header row. You can:
- Manually add headers in row 1, OR
- Call the `createHeaderRow()` method (check logs to see if it's called during init)

Expected headers in row 1:
```
Client ID | Name | Email | Phone | Passport Number | Nationality | Date of Birth | Address | Immigration Type | Validated | Created At
```

### Test Scenario 1: Register a New Client (Full Test)

#### 1A. Start the Backend in Watch Mode
```bash
cd backend
npm run start:dev
```

**Expected logs:**
```
[Nest] <timestamp> LOG [SheetsService] [SHEETS] 🔧 Initializing Google Sheets service...
[Nest] <timestamp> LOG [SheetsService] [SHEETS] ✅ Google Sheets service initialized with credentials file
      OR
[Nest] <timestamp> LOG [SheetsService] [SHEETS] ✅ Google Sheets service initialized with environment variables
```

**If you see errors:**
```
[SHEETS] ⚠️ Google Sheets credentials not configured
         → Check your .env file and ensure Google credentials are set

[SHEETS] ❌ Failed to initialize Google Sheets: Error message
         → Check if credentials file path is correct or JSON is valid
```

#### 1B. Open REST Client File
File: `backend/res/client-auth-clean.http`

#### 1C. Run Registration Test
```http
### 1️⃣ REGISTER - Create new account
POST http://localhost:3000/clients/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test-{{$timestamp}}@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

#### 1D. Check Backend Logs
```
[SHEETS] 📤 Starting data send for client: Test User (test-1730000000@example.com)
[SHEETS] 📋 Preparing data row for client ID: 123e4567-e89b-12d3-a456-426614174000
[SHEETS] ✏️ Row prepared with 11 columns
[SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e6f7g8h9i0j
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: Test User (test-1730000000@example.com) | 
Updates: 1 rows | Duration: 145ms
```

#### 1E. Check Google Sheet
1. Refresh your Google Sheet
2. Should see new row with client data
3. Check all 11 columns are populated

### Test Scenario 2: Create Client via Admin Endpoint

#### 2A. Open Test File
File: `backend/res/clients.http`

#### 2B. Run Test 1: Create Client
```http
### Test 1: Create Client - Complete Data
POST http://localhost:3000/clients
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-416-555-0001",
  "passportNumber": "CA123456789",
  "nationality": "American",
  "dateOfBirth": "1990-05-15",
  "address": "123 Main Street, Toronto, ON M5V 2T6, Canada",
  "immigrationType": "skilled-worker",
  "notes": "Software Engineer with 5 years experience"
}
```

#### 2C. Check Backend Logs
Same logs as Scenario 1 - watch for:
```
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets
```

#### 2D. Check Google Sheet
New row should appear with all client data

### Test Scenario 3: Error Scenarios

#### 3A. Test Missing Spreadsheet ID

1. Remove or comment out `GOOGLE_SHEETS_ID` from `.env`
2. Restart backend
3. Register a client
4. Check logs for:
```
[SHEETS] ⚠️ Google Sheets client not initialized. Spreadsheet ID: undefined
         OR
[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
```
5. **Result**: Client is created in database, but data NOT sent to Sheets (graceful failure)

#### 3B. Test Invalid Spreadsheet ID

1. Set `GOOGLE_SHEETS_ID=invalid-id-12345` in `.env`
2. Restart backend
3. Register a client
4. Check logs for:
```
[SHEETS] ❌ ERROR 404 - Spreadsheet not found. 
Invalid GOOGLE_SHEETS_ID: invalid-id-12345 | Duration: 234ms
```

#### 3C. Test Permission Denied

1. Set `GOOGLE_SHEETS_ID` to a spreadsheet you DON'T have service account access to
2. Restart backend
3. Register a client
4. Check logs for:
```
[SHEETS] ❌ ERROR 403 - Permission denied. 
The service account doesn't have access to this spreadsheet. 
Please share the spreadsheet with the service account email.
```
5. **Fix**: Go to Google Sheet, share it with service account email

#### 3D. Test Invalid Credentials

1. Set invalid `GOOGLE_PRIVATE_KEY` in `.env`
2. Restart backend
3. Check logs for:
```
[SHEETS] ❌ ERROR - Google credentials are invalid. 
Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in .env
```

---

## 📊 Logging Reference

### Log Levels and Format

All logs follow this format:
```
[SHEETS] [EMOJI] [Level] Message
```

#### During Initialization
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] 📁 Checking for credentials file at: path/to/file
[SHEETS] 📂 Loading Google credentials from file: /absolute/path/file.json
[SHEETS] ✅ Google Sheets service initialized with credentials file
[SHEETS] ⚠️ GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is not set
[SHEETS] ❌ Google Sheets credentials not configured
```

#### During Data Send
```
[SHEETS] 📤 Starting data send for client: John Doe (john@example.com)
[SHEETS] ⚠️ Google Sheets client not initialized
[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
[SHEETS] 📋 Preparing data row for client ID: 123e4567-e89b-12d3-a456-426614174000
[SHEETS] ✏️ Row prepared with 11 columns
[SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e6f7g8h9i0j
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets
[SHEETS] 📊 Updated 11 cells in range Sheet1!A2:K2
[SHEETS] ❌ ERROR 404 - Spreadsheet not found
[SHEETS] ❌ ERROR 403 - Permission denied
[SHEETS] 🔍 Full error object: {...}
```

#### During Header Creation
```
[SHEETS] 📋 Creating header row...
[SHEETS] 🔗 Writing headers to spreadsheet: 1a2b3c4d5e6f7g8h9i0j
[SHEETS] ✅ SUCCESS - Header row created
[SHEETS] ❌ ERROR 404 - Spreadsheet not found
```

---

## 🐛 Troubleshooting

### Issue: "No data appears in spreadsheet"

**Check this:**
1. Logs show `[SHEETS] ✅ SUCCESS` → Data sent successfully
   - Check if spreadsheet has headers in row 1
   - Data might be in wrong sheet (check "Sheet1")
   - Refresh your browser

2. Logs show `[SHEETS] ⚠️ Google Sheets not configured`
   - Add `GOOGLE_SHEETS_ID` to `.env`
   - Restart backend with `npm run start:dev`

3. Logs show `[SHEETS] ❌ ERROR 403`
   - Share Google Sheet with service account email
   - Wait 1-2 minutes
   - Try again

### Issue: "404 Spreadsheet not found"

**Check this:**
1. Verify `GOOGLE_SHEETS_ID` in `.env` is correct
   - Get from URL: `docs.google.com/spreadsheets/d/[ID]/`
2. Confirm spreadsheet exists and you can open it
3. Restart backend: `npm run start:dev`

### Issue: "Credentials error"

**Check this:**
1. If using `GOOGLE_CREDENTIALS_PATH`:
   - File exists at correct path
   - JSON is valid (no syntax errors)
   - Run: `npm run start:dev` and check logs

2. If using env variables:
   - Check `GOOGLE_SERVICE_ACCOUNT_EMAIL` format: `xxx@xxx.iam.gserviceaccount.com`
   - Check `GOOGLE_PRIVATE_KEY` includes `\n` between lines
   - Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"`

### Issue: "High duration in logs (>5000ms)"

**Possible causes:**
1. Network latency - Normal for Google API
2. Large data or many columns
3. Google API rate limiting (rare)

**If consistently slow:**
- Check internet connection
- Check Google API quota (Google Cloud Console)

---

## 📈 Performance Metrics

### Normal Performance
- Duration: 100-300ms per request
- Rows affected: 1 per client
- Cells updated: 11 per client

### Expected Behavior
- Sending data to sheets is **non-blocking**
- Even if sheets fails, client is created in database
- Logs provide detailed error info for debugging

---

## 🔐 Security Notes

### Credentials Management

**DO:**
✅ Store `GOOGLE_PRIVATE_KEY` in `.env` (never in code)
✅ Store `GOOGLE_SHEETS_ID` in `.env`
✅ Use service account email (not personal account)
✅ Rotate credentials periodically

**DON'T:**
❌ Commit `.env` file to git
❌ Share credentials in logs
❌ Use personal Google account
❌ Expose `GOOGLE_PRIVATE_KEY` in responses

---

## 📝 Summary

| Step | Component | Location | Log Pattern |
|------|-----------|----------|------------|
| 1 | Registration | clients.service.ts | 📤 Starting data send |
| 2 | Initialize Sheets | sheets.service.ts | 🔧 Initializing |
| 3 | Validate Config | sheets.service.ts | ✅/❌ Initialized |
| 4 | Prepare Data | sheets.service.ts | 📋 Preparing row |
| 5 | Format Data | sheets.service.ts | ✏️ Row prepared |
| 6 | Connect & Send | sheets.service.ts | 🔗 Connecting |
| 7 | Success/Error | sheets.service.ts | ✅/❌ SUCCESS |

---

## 🆘 Need Help?

Check logs in this order:
1. **Initialization logs** - Are credentials loaded?
2. **Data preparation logs** - Is data formatted correctly?
3. **API call logs** - Did Google API respond?
4. **Error logs** - What's the specific error code?

Each log line tells you exactly what happened at that step!
