# Google Sheets Integration Setup Guide

## Overview
This guide explains how to configure Google Sheets integration to automatically send client data from the backend to a Google Spreadsheet.

## Credentials Configuration

### Your Service Account Details
- **Project ID**: `canadattt`
- **Service Account Email**: `canada@canadattt.iam.gserviceaccount.com`
- **Credentials File**: `backend/src/utils/credantial/canadattt-70391ad7a6db.json`

## Setup Steps

### 1. Create or Locate Your Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet or open an existing one
3. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### 2. Share Spreadsheet with Service Account

**IMPORTANT**: You must share your spreadsheet with the service account email!

1. Open your Google Spreadsheet
2. Click the **Share** button (top right)
3. Add this email: `canada@canadattt.iam.gserviceaccount.com`
4. Give it **Editor** permissions
5. Click **Send**

### 3. Configure Environment Variables

Update `backend/.env` file:

```env
# Google Sheets Integration
GOOGLE_SHEETS_ID=YOUR_SPREADSHEET_ID_HERE
GOOGLE_SERVICE_ACCOUNT_EMAIL=canada@canadattt.iam.gserviceaccount.com
GOOGLE_CREDENTIALS_PATH=./src/utils/credantial/canadattt-70391ad7a6db.json
```

**Replace** `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID.

### 4. Verify Credentials File

Ensure the credentials file exists at:
```
backend/src/utils/credantial/canadattt-70391ad7a6db.json
```

The file should contain:
```json
{
  "type": "service_account",
  "project_id": "canadattt",
  "private_key_id": "70391ad7a6dbc1c6a467efe24b2187327b17498b",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "canada@canadattt.iam.gserviceaccount.com",
  "client_id": "117576084637035130777",
  ...
}
```

## How It Works

### Automatic Data Export

When a new client registers, the backend automatically:

1. Saves client data to PostgreSQL database
2. Sends the data to Google Sheets (if configured)
3. Appends a new row with client information

### Spreadsheet Structure

The spreadsheet will have the following columns:

| Client ID | Name | Email | Phone | Passport Number | Nationality | Date of Birth | Address | Immigration Type | Validated | Created At |
|-----------|------|-------|-------|----------------|-------------|---------------|---------|-----------------|-----------|------------|
| uuid-1234 | John | john@... | +1234... | AB123456 | USA | 1990-01-01 | 123 Main St | skilled-worker | No | 2025-10-31 |

### Header Row

The first time you restart the server after configuration, you may need to manually create the header row or use the `createHeaderRow()` method.

## Testing the Integration

### 1. Start the Backend

```bash
cd backend
npm run start:dev
```

Check the logs for:
```
✅ Google Sheets service initialized with credentials file
```

### 2. Register a Test Client

Use the frontend registration or send a POST request:

```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "email": "test@example.com",
    "phone": "+1234567890",
    "immigrationType": "skilled-worker"
  }'
```

### 3. Check Your Spreadsheet

Open your Google Spreadsheet and verify that a new row was added with the client data.

## Troubleshooting

### Error: "Failed to initialize Google Sheets"

**Possible causes:**
- Credentials file path is incorrect
- Credentials file is malformed
- Environment variables not loaded

**Solution:**
1. Verify the file exists at `backend/src/utils/credantial/canadattt-70391ad7a6db.json`
2. Check that `.env` file is in the `backend/` directory
3. Restart the backend server

### Error: "The caller does not have permission"

**Cause:** Spreadsheet not shared with service account

**Solution:**
1. Open your Google Spreadsheet
2. Click Share button
3. Add `canada@canadattt.iam.gserviceaccount.com` as Editor
4. Click Send

### Error: "Spreadsheet not found"

**Cause:** Invalid Spreadsheet ID

**Solution:**
1. Check that `GOOGLE_SHEETS_ID` in `.env` matches your spreadsheet
2. Ensure the ID is just the ID part, not the full URL
3. Verify the spreadsheet exists and you have access

### Data Not Appearing in Sheet

**Check the logs:**
```
[SheetsService] Data sent to Google Sheets for client: John Doe
```

If you see:
```
Google Sheets not configured. Data not sent.
```

Then the service wasn't initialized properly. Check your configuration.

## Authentication Methods

The service supports two authentication methods (in order of priority):

### Method 1: Credentials File (Recommended)
Uses the JSON file directly:
```env
GOOGLE_CREDENTIALS_PATH=./src/utils/credantial/canadattt-70391ad7a6db.json
```

### Method 2: Environment Variables (Fallback)
Uses individual environment variables:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=canada@canadattt.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS:**

1. **Never commit credentials to Git**
   - The credentials file is already in `.gitignore`
   - Never commit `.env` files to version control

2. **Restrict Service Account Permissions**
   - Only share spreadsheets that need automation
   - Use Editor permissions (not Owner)

3. **Rotate Keys Regularly**
   - Rotate service account keys every 90 days
   - Delete old keys after rotation

4. **Environment-Specific Credentials**
   - Use different service accounts for dev/staging/production
   - Never use production credentials in development

## Advanced Configuration

### Custom Sheet Name

To use a different sheet name (default is "Sheet1"):

Update the range in `sheets.service.ts`:
```typescript
range: 'MyCustomSheet!A:K',  // Change "MyCustomSheet" to your sheet name
```

### Multiple Spreadsheets

To send data to multiple spreadsheets:

1. Create multiple sheet IDs in `.env`:
```env
GOOGLE_SHEETS_ID_CLIENTS=spreadsheet_id_1
GOOGLE_SHEETS_ID_ARCHIVE=spreadsheet_id_2
```

2. Modify the service to support multiple targets

### Custom Column Mapping

To change which columns are exported, modify the `values` array in `sendDataToSheet()`:

```typescript
const values = [
  [
    clientData.name,           // Column A
    clientData.email,          // Column B
    clientData.phone,          // Column C
    // Add or remove columns as needed
  ],
];
```

## API Reference

### SheetsService Methods

#### `sendDataToSheet(clientData)`
Sends client data to Google Sheets

**Parameters:**
- `clientData`: Client object with registration details

**Returns:** `Promise<void>`

#### `createHeaderRow()`
Creates or updates the header row

**Returns:** `Promise<void>`

## Support

For issues with:
- **Google Cloud Console**: [Google Cloud Support](https://cloud.google.com/support)
- **Google Sheets API**: [Sheets API Documentation](https://developers.google.com/sheets/api)
- **Service Account**: [Service Accounts Guide](https://cloud.google.com/iam/docs/service-accounts)

## Quick Reference

**Service Account Email**: `canada@canadattt.iam.gserviceaccount.com`

**Required Scopes**:
- `https://www.googleapis.com/auth/spreadsheets`

**Credentials File Location**:
- `backend/src/utils/credantial/canadattt-70391ad7a6db.json`

**Environment Variables**:
```env
GOOGLE_SHEETS_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=canada@canadattt.iam.gserviceaccount.com
GOOGLE_CREDENTIALS_PATH=./src/utils/credantial/canadattt-70391ad7a6db.json
```

---

✅ **Integration Complete!** Your client data will now automatically sync to Google Sheets.
