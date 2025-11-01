# ✅ Google Sheets Integration - Complete Overview

## 📊 Journey Explanation

### What Happens When You Create/Register a Client?

#### Step 1: Client Creation Event
```
User Registration Request
         ↓
POST /clients/register (or POST /clients)
         ↓
clients.service.ts receives request
```

**Code Location:** `src/modules/clients/clients.service.ts`
- **registerClient()** method (line 57)
- **createClient()** method (line 175)

**Both methods:**
```typescript
// 1. Create client in database
const client = await this.prisma.client.create({ data });

// 2. Immediately trigger sheets service
await this.sheetsService.sendDataToSheet(client);

// 3. Continue with other notifications
```

#### Step 2: Sheets Service Initialization (On App Start)
When the application starts, it initializes Google Sheets:

```
Application Boots
         ↓
SheetsService Constructor
         ↓
initializeGoogleSheets() method runs
         ↓
Try credentials file → Use it if exists
         ↓
If file not found → Use environment variables
         ↓
If neither exist → Log warning, continue without sheets
```

**Log Output (Success):**
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] ✅ Google Sheets service initialized with credentials file
         OR
[SHEETS] ✅ Google Sheets service initialized with environment variables
```

**Log Output (Warning):**
```
[SHEETS] ❌ Google Sheets credentials not configured.
```
*(Application continues working, just won't send data to sheets)*

#### Step 3: Data Preparation
When a client is created, this happens:

```
Client Object
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-416-555-0001",
    passportNumber: "CA123456789",
    nationality: "Canadian",
    dateOfBirth: "1990-05-15",
    address: "123 Main Street",
    immigrationType: "skilled-worker",
    isValidated: false,
    createdAt: "2025-11-01T19:05:00Z"
  }
         ↓
Extract fields
         ↓
Format into array:
[
  "123e4567-e89b-12d3-a456-426614174000",  // A: ID
  "John Doe",                               // B: Name
  "john@example.com",                       // C: Email
  "+1-416-555-0001",                        // D: Phone
  "CA123456789",                            // E: Passport
  "Canadian",                               // F: Nationality
  "1990-05-15",                             // G: DOB
  "123 Main Street",                        // H: Address
  "skilled-worker",                         // I: Immigration Type
  "No",                                     // J: Validated
  "11/1/2025, 7:05:00 PM"                  // K: Created At
]
         ↓
Send to Google Sheets API
]
```

**Log Output:**
```
[SHEETS] 📤 Starting data send for client: John Doe (john@example.com)
[SHEETS] 📋 Preparing data row for client ID: 123e4567-e89b-12d3-a456-426614174000
[SHEETS] ✏️ Row prepared with 11 columns
```

#### Step 4: Validation
Before sending, the service checks:

```
Is Google Sheets client initialized?
  ├─ NO  → Log warning, return early
  └─ YES → Continue

Is GOOGLE_SHEETS_ID set?
  ├─ NO  → Log error, return early
  └─ YES → Continue

Credentials valid?
  ├─ NO  → Log error, return early
  └─ YES → Continue to Step 5
```

**Log Output (Issues):**
```
[SHEETS] ⚠️ Google Sheets client not initialized
[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
```

#### Step 5: API Call to Google Sheets
```
Call Google Sheets API
  ├─ Endpoint: sheets.spreadsheets.values.append()
  ├─ Params:
  │   ├─ spreadsheetId: from GOOGLE_SHEETS_ID env var
  │   ├─ range: 'Sheet1!A:K'
  │   └─ values: [[data array]]
  └─ Wait for response
         ↓
Response received
         ↓
Log success with details
```

**Log Output (Success):**
```
[SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e6f7g8h9i0j
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: John Doe (john@example.com) | 
Updates: 1 rows | Duration: 145ms
[SHEETS] 📊 Updated 11 cells in range Sheet1!A2:K2
```

#### Step 6: Error Handling
If something goes wrong:

```
API Call Error
         ↓
Check error code
  ├─ 404 → Spreadsheet not found
  ├─ 403 → Permission denied
  ├─ Invalid credentials
  └─ Other error
         ↓
Log specific error message
         ↓
Don't throw error (non-blocking)
         ↓
Client created in database successfully ✅
         ↓
Data just not sent to sheets ⚠️
```

**Log Output (Errors):**
```
[SHEETS] ❌ ERROR 404 - Spreadsheet not found. Invalid GOOGLE_SHEETS_ID: wrong-id

[SHEETS] ❌ ERROR 403 - Permission denied. The service account doesn't have access...

[SHEETS] ❌ ERROR - Google credentials are invalid. Check GOOGLE_SERVICE_ACCOUNT_EMAIL...
```

---

## 🧪 Testing Guide

### Pre-Setup: Configure Google Sheets

#### 1. Create Google Sheet
1. Go to https://docs.google.com/spreadsheets
2. Create new spreadsheet
3. Note the ID from URL

#### 2. Create Service Account (Google Cloud)
1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google Sheets API
4. Create service account
5. Generate JSON key
6. Download credentials

#### 3. Share Sheet with Service Account
1. Open your Google Sheet
2. Click "Share"
3. Enter service account email: `your-sa@project.iam.gserviceaccount.com`
4. Click "Share"

#### 4. Setup Backend .env File

Create `backend/.env`:

```bash
# Google Sheets Configuration (choose ONE option):

# Option A: Using credentials JSON file
GOOGLE_CREDENTIALS_PATH=path/to/your-credentials.json

# Option B: Using environment variables (from JSON key)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Always required
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0jklmnopqrstu

# Other configs
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
```

---

### Test 1: Verify Configuration (2 minutes)

**Step 1: Start Backend**
```bash
cd backend
npm run start:dev
```

**Expected logs during startup:**
```
[Nest] [timestamp] LOG [SheetsService] [SHEETS] 🔧 Initializing Google Sheets service...
[Nest] [timestamp] LOG [SheetsService] [SHEETS] ✅ Google Sheets service initialized with credentials file
[Nest] [timestamp] LOG [SheetsService] [SHEETS] Spreadsheet ID: 1a2b3c4d5e...
```

**If you see warning:**
```
[SHEETS] ❌ Google Sheets credentials not configured.
```

**Fix:** Check `.env` file settings

---

### Test 2: Register a Client (5 minutes)

**Step 1: Open REST Client**
File: `backend/res/client-auth-clean.http`

**Step 2: Run First Test**
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

Click "Send"

**Expected Response:**
```json
{
  "id": "123e4567...",
  "name": "Test User",
  "email": "test-1730462700000@example.com",
  "phone": "+1234567890",
  "status": "pending",
  "createdAt": "2025-11-01T19:05:00Z"
}
```

**Status: 201 Created ✅**

**Step 3: Check Backend Logs**

Watch for these logs (in order):
```
1. [SHEETS] 📤 Starting data send for client: Test User (test-1730462700000@example.com)
2. [SHEETS] 📋 Preparing data row for client ID: 123e4567...
3. [SHEETS] ✏️ Row prepared with 11 columns
4. [SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e...
5. [SHEETS] ✅ SUCCESS - Data sent to Google Sheets for client: Test User | Duration: 145ms
```

**Step 4: Verify in Google Sheet**
1. Open your Google Sheet
2. Press F5 to refresh
3. Look for new row with:
   - Column A (ID): 123e4567...
   - Column B (Name): Test User
   - Column C (Email): test-1730462700000@example.com
   - Other columns populated

---

### Test 3: Create Client via Admin (5 minutes)

**Step 1: Open REST Client**
File: `backend/res/clients.http`

**Step 2: Run Test 1**
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

Click "Send"

**Step 3: Check Backend Logs**

Same as Test 2 - should see ✅ SUCCESS message

**Step 4: Verify in Google Sheet**

New row should appear with all the data

---

### Test 4: Error Scenario - Missing GOOGLE_SHEETS_ID

**Step 1: Edit `.env`**
Remove or comment out the line:
```bash
# GOOGLE_SHEETS_ID=1a2b3c4d5e...
```

**Step 2: Restart Backend**
```bash
# Stop: Ctrl+C
# Start:
npm run start:dev
```

**Expected logs:**
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] ⚠️ Google Sheets client not initialized. Spreadsheet ID: undefined
```

**Step 3: Register a Client**

Use same test from Test 2

**Expected logs:**
```
[SHEETS] 📤 Starting data send for client: Test User...
[SHEETS] ❌ GOOGLE_SHEETS_ID environment variable is not set
```

**Step 4: Verify Behavior**
- ✅ Client IS created in database
- ⚠️ Data NOT sent to sheets
- ✅ Application continues working
- This is EXPECTED behavior (graceful degradation)

**Step 5: Fix and Restore**
Add back to `.env`:
```bash
GOOGLE_SHEETS_ID=1a2b3c4d5e...
```

Restart backend

---

### Test 5: Error Scenario - Invalid Spreadsheet ID

**Step 1: Edit `.env`**
```bash
GOOGLE_SHEETS_ID=invalid-wrong-id-12345
```

**Step 2: Restart Backend**

**Step 3: Register a Client**

**Expected logs:**
```
[SHEETS] ❌ ERROR 404 - Spreadsheet not found. 
Invalid GOOGLE_SHEETS_ID: invalid-wrong-id-12345 | Duration: 234ms
```

**Step 4: Verify**
- ✅ Client created in database
- ⚠️ Data not sent (404 error)
- Application continues working

**Step 5: Fix**
Set correct `GOOGLE_SHEETS_ID` in `.env`

---

### Test 6: Error Scenario - Permission Denied

**Step 1: Create a Second Google Sheet**

You have access to this one, but the service account doesn't

**Step 2: Set GOOGLE_SHEETS_ID to This New Sheet**

```bash
GOOGLE_SHEETS_ID=different-sheet-id-not-shared
```

**Step 3: Restart Backend**

**Step 4: Register a Client**

**Expected logs:**
```
[SHEETS] ❌ ERROR 403 - Permission denied. 
The service account doesn't have access to this spreadsheet. 
Please share the spreadsheet with the service account email.
```

**Step 5: Fix**
1. Open that sheet
2. Click "Share"
3. Paste service account email
4. Click "Share"
5. Restart backend
6. Try again - should see ✅ SUCCESS

---

## 📊 Data Mapping Reference

| Column | Header | Source Field | Data Type | Example |
|--------|--------|--------------|-----------|---------|
| A | Client ID | `client.id` | UUID | 123e4567-e89b-12d3-a456-426614174000 |
| B | Name | `client.name` | String | John Doe |
| C | Email | `client.email` | String | john@example.com |
| D | Phone | `client.phone` | String | +1-416-555-0001 |
| E | Passport Number | `client.passportNumber` | String | CA123456789 |
| F | Nationality | `client.nationality` | String | Canadian |
| G | Date of Birth | `client.dateOfBirth` | String | 1990-05-15 |
| H | Address | `client.address` | String | 123 Main St, Toronto |
| I | Immigration Type | `client.immigrationType` | String | skilled-worker |
| J | Validated | `client.isValidated` | Boolean | Yes/No |
| K | Created At | `client.createdAt` | DateTime | 11/1/2025, 7:05:00 PM |

---

## 📈 Log Reference

### Emojis and Their Meaning

| Emoji | Meaning | Level |
|-------|---------|-------|
| 🔧 | Initializing/Setup | INFO |
| 📁 | File system operation | DEBUG |
| 📂 | File found/loaded | INFO |
| 🔑 | Authentication | DEBUG |
| 📤 | Starting operation | DEBUG |
| 📋 | Preparing data | DEBUG |
| ✏️ | Data formatted | DEBUG |
| 🔗 | Connecting to API | DEBUG |
| ✅ | Success | INFO |
| 📊 | Detailed result | DEBUG |
| ⚠️ | Warning (not critical) | WARN |
| ❌ | Error | ERROR |
| 🔍 | Debug details | DEBUG |

### Log Examples

**Successful flow:**
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] ✅ Google Sheets service initialized with credentials file
[SHEETS] 📤 Starting data send for client: John Doe (john@example.com)
[SHEETS] 📋 Preparing data row for client ID: 123e4567...
[SHEETS] ✏️ Row prepared with 11 columns
[SHEETS] 🔗 Connecting to spreadsheet: 1a2b3c4d5e...
[SHEETS] ✅ SUCCESS - Data sent to Google Sheets | Duration: 145ms
```

**Error flow:**
```
[SHEETS] 🔧 Initializing Google Sheets service...
[SHEETS] ⚠️ Credentials file not found
[SHEETS] ✅ Google Sheets service initialized with environment variables
[SHEETS] 📤 Starting data send for client: John Doe (john@example.com)
[SHEETS] ❌ ERROR 403 - Permission denied. Please share the spreadsheet...
```

---

## 🆘 Troubleshooting

### Problem: "No data appears in spreadsheet"

**Check list:**
1. Backend logs show `✅ SUCCESS`?
   - YES: Data was sent, refresh sheet and check row 2+
   - NO: See other problems below

2. Sheet has headers in row 1?
   - Check columns: Client ID, Name, Email, etc.
   - If missing, add them manually

3. Are you looking in the right sheet?
   - Check Sheet tab name is "Sheet1"
   - Data goes to first sheet only

### Problem: "404 error - Spreadsheet not found"

**Check:**
1. Verify `GOOGLE_SHEETS_ID` in `.env`
2. Get correct ID from sheet URL: `docs.google.com/spreadsheets/d/[ID]/`
3. Restart backend after changing `.env`

### Problem: "403 error - Permission denied"

**Check:**
1. Is service account email the right format?
   - `your-sa@project.iam.gserviceaccount.com`
2. Did you share the sheet with this email?
   - Open sheet → Share button → Paste email
3. Wait 1-2 minutes for permission sync
4. Restart backend

### Problem: "Credentials error"

**Check:**
1. If using `GOOGLE_CREDENTIALS_PATH`:
   - File path is correct
   - File exists
   - JSON is valid

2. If using env variables:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` is not empty
   - `GOOGLE_PRIVATE_KEY` includes `\n` between lines
   - No typos

### Problem: "Very slow duration (>5 seconds)"

**Possible causes:**
1. Network latency
2. Google API rate limiting
3. Spreadsheet is very large

**Check:**
1. Internet connection speed
2. Check Google Cloud Console for quota usage
3. Try on different network to compare

---

## 🔐 Security Best Practices

✅ **DO:**
- Store credentials in `.env` file
- Use service account (not personal account)
- Share sheet with service account only
- Rotate credentials periodically

❌ **DON'T:**
- Commit `.env` to git
- Share `GOOGLE_PRIVATE_KEY` in messages
- Use personal Google account
- Store credentials in code

---

## 📝 Summary Table

| Step | Component | File | Function | Logs |
|------|-----------|------|----------|------|
| 1 | Registration | clients.service.ts | registerClient() | 📤 Starting |
| 2 | Initialize Sheets | sheets.service.ts | initializeGoogleSheets() | 🔧 Initializing |
| 3 | Validate Config | sheets.service.ts | sendDataToSheet() | ✅ Initialized |
| 4 | Prepare Data | sheets.service.ts | sendDataToSheet() | 📋 Preparing |
| 5 | Format Row | sheets.service.ts | sendDataToSheet() | ✏️ Prepared |
| 6 | API Call | sheets.service.ts | sendDataToSheet() | 🔗 Connecting |
| 7 | Response | sheets.service.ts | sendDataToSheet() | ✅ SUCCESS |

---

## 📚 Related Documents

- `SHEETS_QUICK_TEST.md` - Quick reference for testing
- `DUPLICATE_EMAIL_FIX.md` - Error handling for duplicate emails
- `JWT_ERRORS_FIXED.md` - JWT authentication errors
