# Postman Testing - Step by Step Video Guide

## 📺 Follow Along

### Step 1: Download Postman
1. Go to https://www.postman.com/downloads/
2. Download Postman for Windows
3. Install and open

### Step 2: Create New Request

1. Click "+" or "Create New"
2. Select "HTTP Request"
3. Name: "Test Register"

### Step 3: Register Client

**In the request:**
- **Method:** Select "POST" (dropdown on left)
- **URL:** http://localhost:3000/clients/register
- **Tab: Headers**
  - Key: `Content-Type`
  - Value: `application/json`
- **Tab: Body**
  - Select "raw" radio button
  - Select "JSON" from dropdown
  - Paste:

```json
{
  "name": "Test User",
  "email": "test-1730456789@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

- **Click "Send" (blue button)**

**You should get:**
- Status: 201 Created
- Body with access_token

**Copy the email from response** ← Important!

---

### Step 4: Create Login Request

1. Click "+" again
2. Name: "Test Login"
3. **Method:** POST
4. **URL:** http://localhost:3000/clients/login
5. **Headers:** Content-Type: application/json
6. **Body (raw JSON):**

```json
{
  "email": "test-1730456789@example.com",
  "password": "TestPass123!"
}
```

⚠️ Use the email from Step 3!

- **Click "Send"**

**You should get:**
- Status: 200 OK
- Body with new access_token

**Copy the access_token** ← Important!

---

### Step 5: Create Profile Request

1. Click "+" again
2. Name: "Test Get Profile"
3. **Method:** GET
4. **URL:** http://localhost:3000/clients/profile
5. **Tab: Headers**
   - Click "Add"
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Paste the token from Step 4 (include "Bearer " at the start!)

- **Click "Send"**

**You should get:**
- Status: 200 OK
- Your full client profile

---

## ✅ Success!

If all 3 requests returned success:
- ✅ Registration working
- ✅ Login working
- ✅ Authentication working
- ✅ Backend is complete!

---

## 🔍 Response Check

### Good Response (201)
```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "xxx",
    "name": "Test User",
    "email": "test-1730456789@example.com",
    ...
  }
}
```

### Bad Response (401)
```
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## 🧪 Additional Tests

### Get All Clients
- Method: GET
- URL: http://localhost:3000/clients
- Headers: Content-Type: application/json
- Send

### Test Error: Wrong Password
- Method: POST
- URL: http://localhost:3000/clients/login
- Body:
```json
{
  "email": "test-1730456789@example.com",
  "password": "WrongPassword123!"
}
```
- Expected: 401 Unauthorized

### Test Error: Duplicate Email
- Method: POST
- URL: http://localhost:3000/clients/register
- Body:
```json
{
  "name": "Another",
  "email": "test-1730456789@example.com",
  "password": "AnotherPass123!",
  "phone": "+1111111111"
}
```
- Expected: 409 Conflict

---

## 💡 Tips

1. **Unique Emails:** Use different email each time:
   - test-111@example.com
   - test-222@example.com
   - test-333@example.com

2. **Save Requests:** Click "Save" button after each request to add to collection

3. **Organize:** Drag requests into folders:
   - Authentication
   - Client Management
   - Admin
   - Error Cases

4. **Environment Variables:** 
   - Create environment with `baseUrl = http://localhost:3000`
   - Use `{{baseUrl}}/clients/register` instead of full URL

---

## 🎯 Next: Test All Endpoints

Once Quick Start works, test these:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /clients/register | POST | Create client |
| /clients/login | POST | Client login |
| /clients/profile | GET | Get profile |
| /clients | GET | List clients |
| /clients/:id | GET | Get client |
| /clients/:id/messages | GET | Get messages |
| /clients/messages | POST | Send message |
| /admin/dashboard | GET | Admin dashboard |
| /admin/clients/recent | GET | Recent clients |

---

**Ready! Let's test! 🚀**
