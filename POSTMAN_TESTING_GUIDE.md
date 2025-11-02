# 🧪 Complete Backend Testing Guide with Postman

## 📥 Step 1: Import Collection into Postman

### Option A: Import from HTTP File (Recommended)

1. **Open Postman**
2. **Click "Import"** (top-left)
3. **Select "File"** tab
4. **Choose:** `backend/res/client-auth.http`
5. **Click "Import"**

✅ Postman will automatically create a collection with all tests!

### Option B: Manual Setup

If import doesn't work, follow the manual setup below.

---

## 🔧 Step 2: Create Postman Environment

### Create Environment Variables

1. **Click "Environments"** (left sidebar)
2. **Click "Create"**
3. **Name:** `Canada Immigration Dev`
4. **Add these variables:**

```
Variable Name        | Type    | Initial Value
--------------------|---------|------------------
baseUrl              | string  | http://localhost:3000
contentType          | string  | application/json
timestamp            | string  | {{$timestamp}}
clientToken          | string  | (leave empty for now)
adminToken           | string  | (leave empty for now)
```

5. **Click "Save"**
6. **Select this environment** (top-right dropdown)

---

## 📝 Step 3: Create Collection

### Create New Collection

1. **Click "Collections"** (left sidebar)
2. **Click "Create"** (or "+" icon)
3. **Name:** `Canada Immigration API`
4. **Click "Create"**

---

## 🧬 Step 4: Add Requests

### Quick Start - 3 Step Test

#### **QS-1: Register New Client**

1. **New Request** → **Name:** `QS-1: Register Client`
2. **Method:** `POST`
3. **URL:** `{{baseUrl}}/clients/register`
4. **Headers:**
   - `Content-Type`: `application/json`

5. **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test-client-{{$timestamp}}@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

6. **Send** ✅
7. **Copy the `email` and `access_token` from response**

---

#### **QS-2: Login Client**

1. **New Request** → **Name:** `QS-2: Login Client`
2. **Method:** `POST`
3. **URL:** `{{baseUrl}}/clients/login`
4. **Headers:**
   - `Content-Type`: `application/json`

5. **Body (raw JSON):**
```json
{
  "email": "test-client-1730456789@example.com",
  "password": "TestPass123!"
}
```

⚠️ **Important:** Replace the email with the one from QS-1 response

6. **Send** ✅
7. **Copy the `access_token` from response**

---

#### **QS-3: Get Client Profile**

1. **New Request** → **Name:** `QS-3: Get Profile`
2. **Method:** `GET`
3. **URL:** `{{baseUrl}}/clients/profile`
4. **Headers:**
   - `Authorization`: `Bearer {{clientToken}}`

5. **Pre-request Script:**
```javascript
// Set the token from previous response
pm.environment.set("clientToken", pm.response.json().access_token);
```

6. **Send** ✅

✅ **If all 3 work, authentication is working perfectly!**

---

## 📊 All Backend Endpoints

### **CLIENT AUTHENTICATION**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | POST | `/clients/register` | Register new client |
| 2 | POST | `/clients/login` | Client login |
| 3 | GET | `/clients/profile` | Get client profile (protected) |

### **CLIENT MANAGEMENT**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 4 | GET | `/clients` | List all clients |
| 5 | GET | `/clients/:id` | Get specific client |
| 6 | POST | `/clients` | Create client (admin) |
| 7 | PATCH | `/clients/:id/validate` | Validate client |
| 8 | GET | `/clients/:id/validation-status` | Check validation |
| 9 | POST | `/clients/:id/messages` | Send message |
| 10 | GET | `/clients/:id/messages` | Get client messages |

### **ADMIN AUTHENTICATION**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 11 | POST | `/auth/register` | Register admin |
| 12 | POST | `/auth/login` | Admin login |
| 13 | GET | `/auth/profile` | Get admin profile |
| 14 | PATCH | `/auth/change-password` | Change password |

### **ADMIN DASHBOARD**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 15 | GET | `/admin/dashboard` | Dashboard stats |
| 16 | GET | `/admin/clients/recent` | Recent clients |
| 17 | GET | `/admin/clients/pending` | Pending validation |
| 18 | GET | `/admin/messages` | All messages |
| 19 | PATCH | `/admin/messages/:id/read` | Mark message read |

---

## 🎯 Complete Test Scenarios

### **Scenario 1: Client Registration & Login**

**Request 1: Register**
```
POST /clients/register
{
  "name": "John Doe",
  "email": "john-{{$timestamp}}@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```
Expected: 201 Created + access_token

**Request 2: Login** (use email from Request 1)
```
POST /clients/login
{
  "email": "john-xxx@example.com",
  "password": "SecurePass123!"
}
```
Expected: 200 OK + access_token

**Request 3: Get Profile** (use token from Request 2)
```
GET /clients/profile
Authorization: Bearer <token>
```
Expected: 200 OK + client data

---

### **Scenario 2: Error Cases**

#### **Test: Duplicate Email Registration**
```
POST /clients/register
{
  "email": "john-xxx@example.com",
  "password": "AnotherPass123!",
  "name": "Another User",
  "phone": "+1987654321"
}
```
Expected: 409 Conflict

#### **Test: Invalid Password on Login**
```
POST /clients/login
{
  "email": "john-xxx@example.com",
  "password": "WrongPassword!"
}
```
Expected: 401 Unauthorized

#### **Test: Non-existent Email**
```
POST /clients/login
{
  "email": "nonexistent@example.com",
  "password": "SomePassword123!"
}
```
Expected: 401 Unauthorized

#### **Test: Profile Without Token**
```
GET /clients/profile
```
Expected: 401 Unauthorized

---

### **Scenario 3: Client Management**

#### **Get All Clients**
```
GET /clients
Authorization: Bearer <admin_token> (optional)
```
Expected: 200 OK + list of clients

#### **Get Specific Client**
```
GET /clients/:id
Authorization: Bearer <admin_token>
```
Expected: 200 OK + client details

#### **Send Message**
```
POST /clients/messages
Content-Type: application/json
Authorization: Bearer <client_token>

{
  "clientId": "xxx-xxx-xxx",
  "subject": "Help needed",
  "content": "I need help with my application"
}
```
Expected: 201 Created

#### **Get Client Messages**
```
GET /clients/:id/messages
Authorization: Bearer <token>
```
Expected: 200 OK + messages

---

### **Scenario 4: Admin Operations**

#### **Admin Register**
```
POST /auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "role": "admin"
}
```
Expected: 201 Created + access_token

#### **Admin Login**
```
POST /auth/login
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```
Expected: 200 OK + access_token

#### **Get Dashboard**
```
GET /admin/dashboard
Authorization: Bearer <admin_token>
```
Expected: 200 OK + dashboard stats

#### **Get Recent Clients**
```
GET /admin/clients/recent
Authorization: Bearer <admin_token>
```
Expected: 200 OK + recent clients

#### **Get Pending Clients**
```
GET /admin/clients/pending
Authorization: Bearer <admin_token>
```
Expected: 200 OK + pending clients

#### **Validate Client**
```
PATCH /clients/:id/validate
Authorization: Bearer <admin_token>

{
  "isValidated": true,
  "notes": "Documents verified"
}
```
Expected: 200 OK + updated client

---

## 💾 Save as Postman Collection

### **Export Your Tests**

1. **Right-click your collection**
2. **Click "Export"**
3. **Choose "Collection v2.1"**
4. **Save file**

Now you can share and import this collection anytime!

---

## 🔐 Postman Scripts (Optional)

### **Pre-request Script (Auto generate timestamp)**

Add to collection Pre-request:
```javascript
// Auto generate unique email
const timestamp = new Date().getTime();
pm.environment.set("timestamp", timestamp);
```

### **Post-request Script (Auto capture token)**

Add to login requests:
```javascript
// Auto capture token
if (pm.response.code === 200) {
  const response = pm.response.json();
  if (response.access_token) {
    pm.environment.set("clientToken", response.access_token);
    console.log("✅ Token saved to clientToken");
  }
}
```

---

## 📋 Request Checklist

### **Before Each Test**

- [ ] Backend is running (`npm run start:dev`)
- [ ] Postman environment selected
- [ ] Base URL is `http://localhost:3000`
- [ ] Content-Type is `application/json`

### **After Each Test**

- [ ] Check status code (200, 201, 401, 409, etc.)
- [ ] Check response body
- [ ] Verify error messages if applicable
- [ ] Save token if authentication response

---

## 🎯 Test Order (Recommended)

1. ✅ QS-1: Register Client
2. ✅ QS-2: Login Client
3. ✅ QS-3: Get Profile
4. ✅ Get All Clients
5. ✅ Send Message
6. ✅ Get Messages
7. ✅ Test Error Cases (duplicate email, wrong password, etc.)
8. ✅ Admin Login
9. ✅ Get Dashboard
10. ✅ Validate Client

---

## 🐛 Troubleshooting

### **Issue: 401 Unauthorized on Login**
- ✅ Make sure email matches registration email (case-sensitive)
- ✅ Password must be exactly `TestPass123!` or what you registered with
- ✅ Check that client was actually registered first

### **Issue: 409 Conflict on Register**
- ✅ Email already exists in database
- ✅ Use a new email with timestamp: `test-{{$timestamp}}@example.com`

### **Issue: Token Expired**
- ✅ Tokens expire in 24 hours
- ✅ Login again to get a new token
- ✅ Update the `clientToken` environment variable

### **Issue: Connection Refused**
- ✅ Backend not running
- ✅ Start with: `npm run start:dev`
- ✅ Check if running on `http://localhost:3000`

---

## 📚 Response Examples

### **Successful Registration (201)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "cm3xxx...",
    "name": "Test User",
    "email": "test-client-1730456789@example.com",
    "phone": "+1234567890",
    "immigrationType": "skilled-worker",
    "isValidated": false,
    "createdAt": "2025-11-01T12:05:48.000Z"
  }
}
```

### **Successful Login (200)**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "cm3xxx...",
    "name": "Test User",
    "email": "test-client-1730456789@example.com",
    "phone": "+1234567890",
    "immigrationType": "skilled-worker",
    "isValidated": false,
    "createdAt": "2025-11-01T12:05:48.000Z"
  }
}
```

### **Profile Success (200)**
```json
{
  "id": "cm3xxx...",
  "name": "Test User",
  "email": "test-client-1730456789@example.com",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker",
  "isValidated": false,
  "messages": [],
  "createdAt": "2025-11-01T12:05:48.000Z",
  "updatedAt": "2025-11-01T12:05:48.000Z"
}
```

### **Error: Invalid Credentials (401)**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### **Error: Duplicate Email (409)**
```json
{
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## ✅ Complete Testing Checklist

- [ ] Download and open Postman
- [ ] Import HTTP collection or create manually
- [ ] Create environment with baseUrl variable
- [ ] Test QS-1: Register
- [ ] Test QS-2: Login
- [ ] Test QS-3: Profile
- [ ] Test duplicate email error
- [ ] Test wrong password error
- [ ] Test non-existent email error
- [ ] Test get all clients
- [ ] Test admin endpoints
- [ ] Verify all status codes
- [ ] Check response structures

---

## 🚀 Ready to Test!

Everything is set up and ready. Start with the Quick Start tests and work your way through all scenarios!

**Good luck! 🎉**
