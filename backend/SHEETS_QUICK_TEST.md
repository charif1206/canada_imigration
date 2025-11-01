# 🚀 Google Sheets Integration - Quick Test Guide

## 📋 Quick Summary

The **Google Sheets integration** automatically sends client data to a Google Sheet whenever a client is registered or created.

**Journey in 3 steps:**
1. Client created in database
2. Sheet Service triggered
3. Data appended to Google Sheet

---

## ⚙️ Setup Required

### Step 1: Create Google Sheet
1. Go to https://docs.google.com/spreadsheets
2. Create new spreadsheet
3. Copy the ID from URL: `https://docs.google.com/spreadsheets/d/[ID]/edit`

### Step 2: Create Service Account
1. Go to https://console.cloud.google.com
2. Create new project (or use existing)
3. Enable "Google Sheets API"
4. Create Service Account
5. Create JSON key
6. Share the Google Sheet with the service account email

### Step 3: Configure Backend
Create `.env` file in `backend/` folder:

```bash
# Option A: JSON credentials file
GOOGLE_CREDENTIALS_PATH=credentials.json

# Option B: Environment variables  
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Always required
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
```

---

## 🧪 Testing (Super Quick)

### Test 1: Simple Registration (2 minutes)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run start:dev
```

**Watch for this log:**
```
[SHEETS] ✅ Google Sheets service initialized
```

**Terminal 2 - Run Test:**
Open file: `backend/res/client-auth-clean.http`

Run first test: "1️⃣ REGISTER - Create new account"

**Check Backend Logs:**
```
[SHEETS] 📤 Starting data send for client: Test User (test-1730000000@example.com)
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets
```

**Verify in Google Sheet:**
1. Refresh your spreadsheet
2. Should see new row with client data

---

## 🔍 Understanding the Logs

### Success Log
```
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: John Doe (john@example.com) | Updates: 1 rows | Duration: 145ms
```

**What it means:**
- ✅ Data sent successfully
- Client name: John Doe
- Time taken: 145ms
- 1 row added to sheet

### Error: Not Configured
```
[SHEETS] ⚠️ Google Sheets client not initialized. Spreadsheet ID: undefined
[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
```

**Fix:** Add `GOOGLE_SHEETS_ID=your_id` to `.env`

### Error: 404 - Spreadsheet Not Found
```
[SHEETS] ❌ ERROR 404 - Spreadsheet not found. Invalid GOOGLE_SHEETS_ID: wrong-id
```

**Fix:** Check your `GOOGLE_SHEETS_ID` in `.env` matches the sheet URL

### Error: 403 - Permission Denied
```
[SHEETS] ❌ ERROR 403 - Permission denied. Please share the spreadsheet with the service account email.
```

**Fix:** 
1. Open your Google Sheet
2. Click "Share"
3. Paste service account email
4. Click "Share"

### Error: Invalid Credentials
```
[SHEETS] ❌ ERROR - Google credentials are invalid. Check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY
```

**Fix:** Check `.env` file:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` has correct format
- `GOOGLE_PRIVATE_KEY` has `\n` between lines
- JSON file is valid (if using `GOOGLE_CREDENTIALS_PATH`)

---

## 📊 Data Columns in Sheet

| Column | What's Sent | Example |
|--------|------------|---------|
| A | Client ID | 123e4567-e89b-12d3... |
| B | Name | John Doe |
| C | Email | john@example.com |
| D | Phone | +1-416-555-0001 |
| E | Passport Number | CA123456789 |
| F | Nationality | Canadian |
| G | Date of Birth | 1990-05-15 |
| H | Address | 123 Main St, Toronto |
| I | Immigration Type | skilled-worker |
| J | Validated | Yes/No |
| K | Created At | 11/1/2025, 7:05:00 PM |

---

## 🎯 Test Scenarios

### Scenario 1: Register New Client ✅
```http
POST http://localhost:3000/clients/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

**Expected:**
- Status: 201 Created
- Logs: `[SHEETS] ✅ SUCCESS`
- Google Sheet: New row appears

### Scenario 2: Create Client via Admin ✅
```http
POST http://localhost:3000/clients
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-416-555-0002",
  "passportNumber": "CA987654321"
}
```

**Expected:**
- Status: 201 Created
- Logs: `[SHEETS] ✅ SUCCESS`
- Google Sheet: New row appears

### Scenario 3: Missing Google Sheets ID ⚠️
1. Remove `GOOGLE_SHEETS_ID` from `.env`
2. Restart backend
3. Register client
4. Check logs: Should see "❌ GOOGLE_SHEETS_ID not set"
5. Client still created in database ✅

**This is EXPECTED behavior** - system doesn't crash, just skips sending to sheets

### Scenario 4: Invalid Spreadsheet ID ⚠️
1. Set `GOOGLE_SHEETS_ID=invalid-123` in `.env`
2. Restart backend
3. Register client
4. Check logs: Should see "❌ ERROR 404 - Spreadsheet not found"
5. Client still created in database ✅

**This is EXPECTED behavior** - graceful error handling

---

## 📝 Log Levels Explained

| Level | Symbol | Meaning | Example |
|-------|--------|---------|---------|
| LOG | 📤✅ | Important info | Data sent successfully |
| WARN | ⚠️ | Not critical | Config missing, but optional |
| ERROR | ❌ | Problem occurred | 404 error, permission denied |
| DEBUG | 🔍📋 | Detailed info | Step-by-step process |

**How to see debug logs:**
```bash
# Set environment variable before running
export LOG_LEVEL=debug
npm run start:dev
```

---

## 🆘 Quick Troubleshooting

| Issue | Check | Solution |
|-------|-------|----------|
| No data in sheet | Logs show ✅? | Refresh sheet, check if headers exist |
| 404 error | Logs show 404? | Verify `GOOGLE_SHEETS_ID` in `.env` |
| 403 error | Logs show 403? | Share sheet with service account email |
| App crashes | Logs show ❌? | Backend shouldn't crash - check logs carefully |
| Duration very slow (>5s) | Logs show duration? | Network issue, check internet connection |

---

## 🔗 Files to Know

| File | Purpose |
|------|---------|
| `src/modules/sheets/sheets.service.ts` | Main logic, all the logging |
| `src/modules/clients/clients.service.ts` | Calls sheets service when client created |
| `backend/res/client-auth-clean.http` | Test file for registration |
| `backend/res/clients.http` | Test file for admin client creation |
| `.env` | Configuration (Google credentials, sheet ID) |

---

## 📚 More Details?

Read the full guide: `SHEETS_DATA_FLOW_GUIDE.md`

**Contains:**
- Detailed journey explanation
- All test scenarios
- Complete troubleshooting guide
- Data mapping reference
- Performance tips
