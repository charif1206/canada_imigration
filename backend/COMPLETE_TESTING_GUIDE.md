# Backend Testing Guide - Canada Immigration System

## Table of Contents

1. [Quick Start](#quick-start)
2. [Unit Tests with Jest](#unit-tests-with-jest)
3. [HTTP Testing with VS Code REST Client](#http-testing-with-vs-code-rest-client)
4. [Testing with Postman](#testing-with-postman)
5. [Messages & Notifications Testing](#messages-notifications-testing)
6. [Google Sheets Testing](#google-sheets-testing)
7. [WhatsApp Service Testing](#whatsapp-service-testing)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- [x] Backend server running on `http://localhost:3000`
- [x] PostgreSQL database configured and running
- [x] Node.js installed (v18 or higher)
- [x] npm packages installed (`npm install` in backend folder)
- [x] Environment variables configured (.env file)

### Running All Tests

```powershell
# Navigate to backend directory
cd backend

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm test -- auth.service.spec.ts
```

---

## Unit Tests with Jest

### Overview

We have comprehensive unit tests for three core modules:
- **Auth Module**: Authentication, login, registration, password management
- **Clients Module**: Client management, validation, messages
- **Admin Module**: Dashboard statistics, recent clients, pending validations

### Test Files Location

```
backend/src/modules/
├── auth/
│   └── auth.service.spec.ts         (59 test cases)
├── clients/
│   └── clients.service.spec.ts       (48 test cases)
└── admin/
    └── admin.service.spec.ts         (19 test cases)
```

### Running Unit Tests

#### Run All Tests
```powershell
npm test
```

#### Run Specific Module Tests
```powershell
# Test authentication module
npm test -- auth.service.spec.ts

# Test clients module
npm test -- clients.service.spec.ts

# Test admin module
npm test -- admin.service.spec.ts
```

#### Run Tests in Watch Mode
```powershell
npm run test:watch
```
This will automatically re-run tests when you save changes to files.

#### Generate Coverage Report
```powershell
npm run test:cov
```
This creates a coverage report in `backend/coverage/` folder.

### Understanding Test Results

#### Successful Test Output
```
PASS  src/modules/auth/auth.service.spec.ts
  AuthService
    validateUser
      ✓ should return admin without password when credentials are correct (25ms)
      ✓ should return null when admin not found (15ms)
      ✓ should return null when password is incorrect (20ms)
    login
      ✓ should return access token and admin data (18ms)
    register
      ✓ should create new admin successfully (22ms)
      ✓ should throw ConflictException when username exists (12ms)
      ✓ should throw ConflictException when email exists (14ms)
      ✓ should hash password before storing (28ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

#### Failed Test Output
```
FAIL  src/modules/auth/auth.service.spec.ts
  AuthService
    validateUser
      ✕ should return admin without password when credentials are correct (45ms)

  ● AuthService › validateUser › should return admin without password when credentials are correct

    Expected: {"email": "test@example.com", "id": "admin123", "role": "admin", "username": "testadmin"}
    Received: null

      67 |       const result = await service.validateUser('testadmin', 'testpass123');
      68 |
    > 69 |       expect(result).toBeDefined();
         |                      ^
      70 |       expect(result.username).toBe('testadmin');
```

### Auth Module Tests

**Test Coverage:**
- ✅ User validation with correct/incorrect credentials
- ✅ Login with JWT token generation
- ✅ Admin registration (success and duplicate checks)
- ✅ Password hashing verification
- ✅ Password change functionality
- ✅ Profile retrieval

**Key Test Cases:**
```typescript
// Testing login
it('should return access token and admin data', async () => {
  const loginDto = { username: 'testadmin', password: 'testpass123' };
  const result = await service.login(loginDto);
  expect(result).toHaveProperty('access_token');
});

// Testing password hashing
it('should hash password before storing', async () => {
  await service.register(registerDto);
  const createCall = mockPrismaService.admin.create.mock.calls[0][0];
  expect(createCall.data.password).not.toBe(registerDto.password);
});
```

### Clients Module Tests

**Test Coverage:**
- ✅ Client creation with notifications
- ✅ Google Sheets integration on creation
- ✅ WhatsApp notifications to admin
- ✅ Client retrieval (all, by ID, with error handling)
- ✅ Client validation workflow
- ✅ Message creation and retrieval
- ✅ Unread message filtering
- ✅ Mark message as read

**Key Test Cases:**
```typescript
// Testing client creation
it('should create a client successfully', async () => {
  const result = await service.createClient(createClientDto);
  expect(result).toEqual(mockClient);
});

// Testing validation workflow
it('should validate client successfully', async () => {
  const validateDto = { isValidated: true, notes: 'Approved' };
  const result = await service.validateClient('client123', validateDto);
  expect(result.isValidated).toBe(true);
  expect(result.validatedAt).toBeDefined();
});
```

### Admin Module Tests

**Test Coverage:**
- ✅ Dashboard statistics calculation
- ✅ Recent clients retrieval with custom limits
- ✅ Pending validations filtering
- ✅ All messages retrieval with ordering
- ✅ Performance tests for large datasets

**Key Test Cases:**
```typescript
// Testing dashboard stats
it('should return dashboard statistics', async () => {
  const result = await service.getDashboardStats();
  expect(result).toEqual({
    totalClients: 100,
    validatedClients: 30,
    pendingClients: 70,
    unreadMessages: 15,
  });
});
```

### Debugging Failed Tests

1. **Read the error message carefully** - Jest shows exactly what went wrong
2. **Check the line number** - Go to that line in your test file
3. **Verify mock data** - Ensure your mock data matches expected structure
4. **Check service implementation** - The service code might have changed
5. **Run single test** - Isolate the failing test:
   ```powershell
   npm test -- auth.service.spec.ts -t "should return admin without password"
   ```

---

## HTTP Testing with VS Code REST Client

### Installation

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "REST Client"
3. Install the extension by Huachao Mao

### Test Files Location

```
backend/res/
├── auth.http          (19 test scenarios)
├── clients.http       (28 test scenarios)
├── messages.http      (20 test scenarios)
└── admin.http         (15 test scenarios)
```

### Using HTTP Test Files

1. **Open any .http file** in VS Code
2. **Look for "Send Request"** link above each request
3. **Click "Send Request"** to execute
4. **View response** in the right panel

### Testing Workflow

#### Step 1: Authenticate
```http
# Open: res/auth.http
# Run: POST Login (Valid Credentials)

POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "cm3fzq5ju0000hdfn5vnvmfvu",
    "username": "admin",
    "email": "admin@immigration.com",
    "role": "admin"
  }
}
```

#### Step 2: Copy the Token
- Copy the `access_token` value
- Update `@adminToken` variable at the top of each .http file:
  ```http
  @adminToken = YOUR_TOKEN_HERE
  ```

#### Step 3: Test Protected Endpoints
Now you can test protected endpoints that require authentication.

### Auth Module Testing

**Test Scenarios (19):**
1. Login with valid credentials ✓
2. Login with invalid username ✗
3. Login with invalid password ✗
4. Get profile (authenticated) ✓
5. Get profile (no token) ✗
6. Change password ✓
7. Change password (wrong current password) ✗
8. Register new admin (requires auth) ✓
9. Token validation ✓

### Clients Module Testing

**Test Scenarios (28):**
1. Register client (basic info) ✓
2. Register client (complete info) ✓
3. Register client (minimal info) ✓
4. Different immigration types (skilled, family, student, business, refugee) ✓
5. Get all clients ✓
6. Get client by ID ✓
7. Get client (invalid ID) ✗
8. Validate client ✓
9. Un-validate client ✓
10. Duplicate email handling ✗
11. Special characters in name ✓

### Messages Module Testing

**Test Scenarios (20):**
1. Send message to admin ✓
2. Get client messages ✓
3. Get all messages (admin) ✓
4. Get unread messages ✓
5. Mark message as read ✓
6. Send multiple messages ✓
7. Message filtering ✓
8. Error scenarios ✗

### Admin Module Testing

**Test Scenarios (15):**
1. Get dashboard statistics ✓
2. Get recent clients (default limit) ✓
3. Get recent clients (custom limit) ✓
4. Get pending validations ✓
5. Get all messages ✓
6. Authentication requirement tests ✗
7. Performance testing ⚡

### Variables in .http Files

Each .http file uses variables for reusability:

```http
@baseUrl = http://localhost:3000
@contentType = application/json
@adminToken = YOUR_JWT_TOKEN_HERE
@clientId = CLIENT_ID_HERE
```

Update these as needed for your tests.

---

## Testing with Postman

### Setup

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import Collection**: Use the .http files as reference to create requests
3. **Set Environment Variables**

### Create Postman Environment

1. Click "Environments" in Postman
2. Create new environment "Canada Immigration - Local"
3. Add variables:
   ```
   baseUrl: http://localhost:3000
   adminToken: (leave empty, will be set after login)
   clientId: (leave empty, will be set after creating client)
   ```

### Authentication Flow

#### 1. Login Request

```
Method: POST
URL: {{baseUrl}}/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "username": "admin",
  "password": "admin123"
}
```

#### 2. Save Token Automatically

Add this to the "Tests" tab of your login request:

```javascript
// Parse response
var jsonData = pm.response.json();

// Save token to environment
if (jsonData.access_token) {
    pm.environment.set("adminToken", jsonData.access_token);
    console.log("Token saved: " + jsonData.access_token);
}
```

Now the token is automatically saved and available for other requests!

#### 3. Use Token in Requests

For protected endpoints, add to Headers:
```
Authorization: Bearer {{adminToken}}
```

### Testing Client Registration

```
Method: POST
URL: {{baseUrl}}/clients/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

**Test Script** (add to Tests tab):
```javascript
// Check status code
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

// Check response structure
pm.test("Response has client id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.environment.set("clientId", jsonData.id);
});

// Check email
pm.test("Email matches", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.email).to.eql("john@example.com");
});
```

### Creating Test Collections

#### Collection 1: Authentication Tests
- Login (Valid Credentials)
- Login (Invalid Username)
- Login (Invalid Password)
- Get Profile
- Change Password
- Register Admin

#### Collection 2: Client Management Tests
- Register Client (Basic)
- Register Client (Complete)
- Get All Clients
- Get Client by ID
- Validate Client
- Get Client Status

#### Collection 3: Messaging Tests
- Send Message
- Get Client Messages
- Get All Messages (Admin)
- Get Unread Messages
- Mark Message as Read

#### Collection 4: Admin Dashboard Tests
- Get Dashboard Stats
- Get Recent Clients
- Get Pending Validations
- Get All Messages

### Running Collections

1. Click on collection name
2. Click "Run" button
3. Select requests to run
4. Click "Run Canada Immigration - Local"
5. View results

---

## Messages & Notifications Testing

### WebSocket Connection Testing

The notifications module uses **Socket.IO** for real-time communication. You need to test WebSocket connections separately from HTTP endpoints.

### Method 1: Using Socket.IO Client (Node.js)

Create a test file: `backend/test/socket-test.js`

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'  // Optional: if authentication required
  }
});

// Connection events
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

// Listen for notifications
socket.on('clientCreated', (data) => {
  console.log('📢 New Client Created:', data);
});

socket.on('messageReceived', (data) => {
  console.log('📩 New Message:', data);
});

socket.on('clientValidated', (data) => {
  console.log('✔️ Client Validated:', data);
});

// Keep connection open
setTimeout(() => {
  console.log('Closing connection...');
  socket.close();
}, 60000); // Keep open for 60 seconds
```

**Run the test:**
```powershell
cd backend
node test/socket-test.js
```

### Method 2: Using Postman WebSocket

1. **Create New WebSocket Request** in Postman
2. **Enter URL**: `ws://localhost:3000`
3. **Click "Connect"**
4. **Listen for events**: You should see notifications as they occur

### Method 3: Using Browser Console

Open browser console (F12) and run:

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('clientCreated', (data) => {
  console.log('Client Created:', data);
});

socket.on('messageReceived', (data) => {
  console.log('Message Received:', data);
});

socket.on('clientValidated', (data) => {
  console.log('Client Validated:', data);
});
```

### Testing Real-Time Notifications

#### Test 1: Client Creation Notification

1. **Start WebSocket listener** (Method 1, 2, or 3 above)
2. **Create a new client** using HTTP:
   ```http
   POST http://localhost:3000/clients/register
   Content-Type: application/json

   {
     "name": "Test User",
     "email": "test@example.com",
     "phone": "+1234567890",
     "immigrationType": "skilled-worker"
   }
   ```
3. **Check WebSocket listener** - You should see:
   ```
   📢 Client Created: {
     clientId: "cm3xxx...",
     name: "Test User",
     email: "test@example.com",
     timestamp: "2025-10-31T..."
   }
   ```

#### Test 2: Message Notification

1. **Keep WebSocket connected**
2. **Send a message**:
   ```http
   POST http://localhost:3000/clients/messages
   Content-Type: application/json

   {
     "clientId": "YOUR_CLIENT_ID",
     "subject": "Test Message",
     "content": "This is a test message"
   }
   ```
3. **Check WebSocket** - You should receive:
   ```
   📩 Message Received: {
     messageId: "cm3yyy...",
     clientId: "cm3xxx...",
     subject: "Test Message",
     timestamp: "2025-10-31T..."
   }
   ```

#### Test 3: Client Validation Notification

1. **Keep WebSocket connected**
2. **Validate a client** (requires admin token):
   ```http
   PATCH http://localhost:3000/clients/CLIENT_ID/validate
   Authorization: Bearer YOUR_ADMIN_TOKEN
   Content-Type: application/json

   {
     "isValidated": true,
     "notes": "Application approved"
   }
   ```
3. **Check WebSocket**:
   ```
   ✔️ Client Validated: {
     clientId: "cm3xxx...",
     isValidated: true,
     validatedAt: "2025-10-31T...",
     notes: "Application approved"
   }
   ```

### Troubleshooting WebSocket

#### Issue: Cannot connect to WebSocket

**Solution:**
1. Check if backend is running: `http://localhost:3000`
2. Verify CORS settings in `main.ts`:
   ```typescript
   app.enableCors({
     origin: '*',  // Or specific origins
     credentials: true,
   });
   ```
3. Check Socket.IO version compatibility

#### Issue: Not receiving notifications

**Solution:**
1. Check `notifications.gateway.ts` is properly configured
2. Verify event names match between gateway and client
3. Check if notifications service is being called after actions
4. Add console.log in `NotificationsGateway` methods

#### Issue: Connection drops frequently

**Solution:**
1. Increase timeout in client connection
2. Check server logs for errors
3. Verify network stability

---

## Google Sheets Testing

### Prerequisites

- ✅ Google Cloud project created
- ✅ Google Sheets API enabled
- ✅ Service account created with credentials
- ✅ Credentials file: `backend/src/utils/credantial/canadattt-70391ad7a6db.json`
- ✅ Spreadsheet created and shared with service account email

### Environment Variables

Verify your `.env` file has:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-spreadsheet-id-here
```

### Finding Your Spreadsheet ID

Your spreadsheet URL looks like:
```
https://docs.google.com/spreadsheets/d/1abc123xyz456/edit
                                      ^^^^^^^^^^^^^^^^
                                      This is your Sheet ID
```

### Test 1: Manual Sheet Export

Test the Google Sheets service directly:

**Create test file:** `backend/test/sheets-test.ts`

```typescript
import { SheetsService } from '../src/modules/sheets/sheets.service';
import { ConfigService } from '@nestjs/config';

async function testSheets() {
  const configService = new ConfigService();
  const sheetsService = new SheetsService(configService);

  const testClient = {
    id: 'test123',
    name: 'Test Client',
    email: 'test@example.com',
    phone: '+1234567890',
    passportNumber: 'AB123456',
    nationality: 'American',
    dateOfBirth: new Date('1990-01-01'),
    address: '123 Test St',
    immigrationType: 'skilled-worker',
    isValidated: false,
    validatedAt: null,
    notes: 'Test entry',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await sheetsService.sendDataToSheet(testClient);
    console.log('✅ Data sent to Google Sheets successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSheets();
```

**Run the test:**
```powershell
cd backend
npx ts-node test/sheets-test.ts
```

### Test 2: Automatic Export on Client Creation

1. **Create a new client** using HTTP or Postman:
   ```http
   POST http://localhost:3000/clients/register
   Content-Type: application/json

   {
     "name": "Google Sheets Test User",
     "email": "sheetstest@example.com",
     "phone": "+1234567890",
     "passportNumber": "TEST123",
     "nationality": "Canadian",
     "dateOfBirth": "1995-05-15",
     "address": "456 Test Avenue",
     "immigrationType": "family-sponsorship"
   }
   ```

2. **Check your Google Sheet** - A new row should appear with:
   - ID
   - Name: "Google Sheets Test User"
   - Email: "sheetstest@example.com"
   - Phone: "+1234567890"
   - Immigration Type: "family-sponsorship"
   - Created Date
   - Validation Status: false

### Test 3: Verify Sheet Headers

The first time data is sent, headers are created automatically:

**Expected Headers:**
```
| ID | Name | Email | Phone | Passport Number | Nationality | Date of Birth | Address | Immigration Type | Validated | Validated At | Notes | Created At | Updated At |
```

If headers are missing or incorrect:
1. Delete the first row in your sheet
2. Create a new client
3. Headers will be recreated

### Test 4: Bulk Data Export

Test exporting multiple clients:

```typescript
// In sheets-test.ts
const clients = [
  { name: 'Client 1', email: 'client1@example.com', ... },
  { name: 'Client 2', email: 'client2@example.com', ... },
  { name: 'Client 3', email: 'client3@example.com', ... },
];

for (const client of clients) {
  await sheetsService.sendDataToSheet(client);
  console.log(`✅ Exported: ${client.name}`);
}
```

### Verifying Sheet Permissions

1. **Open your Google Sheet**
2. **Click Share button**
3. **Verify service account email is added** with "Editor" permissions:
   ```
   your-service-account@your-project.iam.gserviceaccount.com
   ```

### Common Issues

#### Issue: "Invalid credentials"

**Solution:**
1. Check credentials file exists: `backend/src/utils/credantial/canadattt-70391ad7a6db.json`
2. Verify environment variables are correct
3. Check service account has "Editor" role in Google Cloud
4. Verify Google Sheets API is enabled

#### Issue: "Spreadsheet not found"

**Solution:**
1. Verify `GOOGLE_SHEET_ID` in .env is correct
2. Make sure spreadsheet is shared with service account email
3. Check if spreadsheet exists and is accessible

#### Issue: "Insufficient permissions"

**Solution:**
1. Share spreadsheet with service account (Editor access)
2. Check API is enabled in Google Cloud Console
3. Verify service account key is valid (not expired)

#### Issue: Data not appearing in sheet

**Solution:**
1. Check backend logs for errors
2. Verify `sheetsService.sendDataToSheet()` is called in `clients.service.ts`
3. Check network connectivity
4. Look for quota limits exceeded

### Monitoring Sheet Exports

Add logging to track exports:

```typescript
// In sheets.service.ts
async sendDataToSheet(client: any): Promise<void> {
  try {
    console.log(`📊 Exporting client to Google Sheets: ${client.email}`);
    // ... existing code ...
    console.log(`✅ Successfully exported: ${client.email}`);
  } catch (error) {
    console.error(`❌ Failed to export ${client.email}:`, error.message);
    throw error;
  }
}
```

---

## WhatsApp Service Testing

### ⚠️ Important: Twilio Configuration Required

The WhatsApp service requires Twilio credentials. Without these, WhatsApp notifications won't work.

### Setup Twilio

1. **Create Twilio Account**: https://www.twilio.com/try-twilio
2. **Get Twilio Phone Number** (WhatsApp enabled)
3. **Get API Credentials**:
   - Account SID
   - Auth Token

### Environment Variables

Add to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+1234567890
```

**Note:**
- `TWILIO_WHATSAPP_NUMBER`: Twilio sandbox number (for testing)
- `ADMIN_WHATSAPP_NUMBER`: Your WhatsApp number where you'll receive notifications

### Twilio Sandbox Setup

Before testing, you must join the Twilio Sandbox:

1. **Send WhatsApp message** to `+1 415 523 8886`
2. **Message content**: `join <your-sandbox-code>`
   - Example: `join clever-sunset`
3. **Wait for confirmation** message from Twilio

### Test 1: Send Test WhatsApp Message

Create test file: `backend/test/whatsapp-test.ts`

```typescript
import { WhatsAppService } from '../src/modules/whatsapp/whatsapp.service';
import { ConfigService } from '@nestjs/config';

async function testWhatsApp() {
  const configService = new ConfigService();
  const whatsappService = new WhatsAppService(configService);

  try {
    await whatsappService.sendMessageToAdmin('🧪 Test message from backend');
    console.log('✅ WhatsApp message sent successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWhatsApp();
```

**Run the test:**
```powershell
cd backend
npx ts-node test/whatsapp-test.ts
```

**Expected Result:** You should receive a WhatsApp message on your phone.

### Test 2: Client Registration Notification

1. **Create a new client** (WhatsApp notification is sent automatically):
   ```http
   POST http://localhost:3000/clients/register
   Content-Type: application/json

   {
     "name": "WhatsApp Test Client",
     "email": "whatsapp@example.com",
     "phone": "+1234567890",
     "immigrationType": "skilled-worker"
   }
   ```

2. **Check your WhatsApp** - You should receive:
   ```
   🔔 New client registered:
   Name: WhatsApp Test Client
   Email: whatsapp@example.com
   Type: skilled-worker
   ```

### Test 3: Message Notification

1. **Send a message from client**:
   ```http
   POST http://localhost:3000/clients/messages
   Content-Type: application/json

   {
     "clientId": "YOUR_CLIENT_ID",
     "subject": "Need Help",
     "content": "I have a question about my application"
   }
   ```

2. **Check your WhatsApp** - You should receive:
   ```
   📩 New message from WhatsApp Test Client:
   Subject: Need Help
   Content: I have a question about my application
   ```

### Test 4: Welcome Message to Client

```typescript
// Test sending welcome message to a client
await whatsappService.sendWelcomeMessage(
  '+1234567890',  // Client's WhatsApp number
  'John Doe'       // Client's name
);
```

**Client receives:**
```
👋 Welcome to Canada Immigration Services, John Doe!

Your application has been received. We'll review it and get back to you soon.

You can check your status anytime through our portal.
```

### Testing Without Twilio (Development Mode)

If you don't have Twilio credentials yet, the service logs messages to console:

```typescript
// In whatsapp.service.ts
private isTwilioConfigured(): boolean {
  return !!(
    this.accountSid &&
    this.authToken &&
    this.whatsappNumber &&
    this.adminWhatsappNumber
  );
}

async sendMessageToAdmin(message: string): Promise<void> {
  if (!this.isTwilioConfigured()) {
    console.log('📱 [DEV] WhatsApp to Admin:', message);
    return;
  }
  // ... send actual message
}
```

**Check backend logs** to see simulated messages.

### Common Issues

#### Issue: "Invalid WhatsApp number"

**Solution:**
1. Format must be: `whatsapp:+1234567890`
2. Include country code with `+`
3. No spaces or dashes

#### Issue: "Not authorized"

**Solution:**
1. Check Account SID and Auth Token are correct
2. Verify Twilio account is active
3. Check if you've exceeded free tier limits

#### Issue: "Recipient not in sandbox"

**Solution:**
1. Send `join <code>` message to Twilio sandbox number
2. Wait for confirmation
3. Number must be verified before receiving messages

#### Issue: "Message not received"

**Solution:**
1. Check phone number format
2. Verify recipient is in Twilio sandbox (for testing)
3. Check Twilio console for delivery logs
4. Verify your phone can receive WhatsApp messages

### Monitoring WhatsApp Delivery

Check Twilio console for message status:
1. Login to Twilio Console
2. Go to "Monitor" > "Logs" > "Messages"
3. See delivery status for each message:
   - ✅ Delivered
   - ⏳ Queued
   - ⏳ Sending
   - ❌ Failed

### Production Checklist

Before going to production:

- [ ] Request production access from Twilio
- [ ] Submit WhatsApp Business profile
- [ ] Get approval from WhatsApp/Meta
- [ ] Test with real phone numbers (not sandbox)
- [ ] Set up message templates for compliance
- [ ] Configure opt-in/opt-out handling
- [ ] Set up monitoring and alerts
- [ ] Plan for rate limits and quotas

---

## Troubleshooting

### Common Issues

#### Issue: "Cannot connect to database"

**Symptoms:**
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```powershell
   # Check service status
   Get-Service -Name postgresql*
   
   # Start if not running
   Start-Service postgresql-x64-14
   ```

2. Verify DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   ```

3. Test connection manually:
   ```powershell
   psql -U postgres -d canada_immigration
   ```

#### Issue: "JWT secret not configured"

**Symptoms:**
```
Error: JWT_SECRET is not defined
```

**Solution:**
Add to `.env`:
```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

#### Issue: "Port 3000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Find and kill process:
   ```powershell
   # Find process using port 3000
   netstat -ano | findstr :3000
   
   # Kill process (replace PID)
   taskkill /PID <PID> /F
   ```

2. Or change port in `.env`:
   ```env
   PORT=3001
   ```

#### Issue: "Module not found"

**Symptoms:**
```
Error: Cannot find module '@nestjs/jwt'
```

**Solution:**
```powershell
cd backend
npm install
```

#### Issue: "Prisma Client not generated"

**Symptoms:**
```
Error: @prisma/client did not initialize yet
```

**Solution:**
```powershell
cd backend
npx prisma generate
```

#### Issue: "Database schema out of sync"

**Symptoms:**
```
Error: Invalid `prisma.client.findMany()` invocation
```

**Solution:**
```powershell
cd backend
npx prisma migrate dev
```

### Test-Specific Issues

#### Unit Tests Failing

**Issue:** Tests fail with "Cannot find module"

**Solution:**
```powershell
# Install dev dependencies
npm install --save-dev @nestjs/testing
npm install --save-dev @types/jest
npm install --save-dev ts-jest
```

#### HTTP Tests Not Working

**Issue:** "Connection refused" in VS Code REST Client

**Solution:**
1. Ensure backend is running: `npm run start:dev`
2. Check URL: `http://localhost:3000` (not `https`)
3. Verify no firewall blocking

#### Socket.IO Connection Fails

**Issue:** WebSocket connection refused

**Solution:**
1. Check CORS configuration in `main.ts`
2. Verify Socket.IO adapter is installed:
   ```powershell
   npm install @nestjs/platform-socket.io socket.io
   ```
3. Check for proxy/firewall issues

### Getting Help

If you encounter issues not covered here:

1. **Check Backend Logs**: Look for error messages in terminal
2. **Check Database Logs**: PostgreSQL logs show connection issues
3. **Enable Debug Mode**: Set `DEBUG=*` environment variable
4. **Check Network**: Use `curl` or Postman to isolate issues
5. **Review Documentation**: Check NestJS, Prisma, and Twilio docs

---

## Summary

You now have comprehensive testing coverage:

### ✅ Unit Tests (Jest)
- 126 test cases across 3 modules
- Test auth, clients, admin services
- Run with: `npm test`

### ✅ HTTP Tests (VS Code REST Client)
- 82 HTTP test scenarios
- Test all endpoints manually
- Located in: `backend/res/`

### ✅ Real-Time Testing (Socket.IO)
- WebSocket connection testing
- Real-time notification verification
- Client/message/validation events

### ✅ Integration Tests
- Google Sheets export verification
- WhatsApp notification testing (requires Twilio)
- End-to-end workflows

### Testing Checklist

Before deployment, ensure:

- [ ] All unit tests pass (`npm test`)
- [ ] HTTP endpoints respond correctly
- [ ] Authentication works (login, register, protected routes)
- [ ] Client registration creates database entry
- [ ] Google Sheets export works
- [ ] WebSocket notifications are received
- [ ] WhatsApp notifications are sent (if configured)
- [ ] Validation workflow functions
- [ ] Messages can be sent and read
- [ ] Dashboard stats calculate correctly

**Next Steps:**
1. Run unit tests: `npm test`
2. Test HTTP endpoints using .http files
3. Verify WebSocket notifications work
4. Test Google Sheets integration
5. Configure and test WhatsApp (optional)
6. Fix any issues found
7. Document any additional tests needed

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or review backend logs for specific error messages.
