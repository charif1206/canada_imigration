# 🚀 Postman Testing - Quick Start

## 1️⃣ Setup Postman

### Download
- Go to: https://www.postman.com/downloads/
- Download and install for Windows

### Create Environment
- Click "Environments" → "Create"
- Name: `Dev`
- Add variable: `baseUrl = http://localhost:3000`
- Add variable: `clientToken = ` (leave empty)
- Click "Save"
- Select the environment (top right)

---

## 2️⃣ Test Quick Start (3 Simple Tests)

### Test 1: Register Client

```
Method: POST
URL: http://localhost:3000/clients/register

Body (JSON):
{
  "name": "Test User",
  "email": "test-1730456789@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

**Click "Send"**
- ✅ Expected: 201 Created
- 📌 Copy the `email` from response

---

### Test 2: Login Client

```
Method: POST
URL: http://localhost:3000/clients/login

Body (JSON):
{
  "email": "test-1730456789@example.com",
  "password": "TestPass123!"
}
```

**Click "Send"**
- ✅ Expected: 200 OK
- 📌 Copy the `access_token` from response

---

### Test 3: Get Profile

```
Method: GET
URL: http://localhost:3000/clients/profile

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

(Replace with your token from Test 2)
```

**Click "Send"**
- ✅ Expected: 200 OK
- 📌 Your client profile data

---

## 3️⃣ Test All Endpoints

### Authentication

| Method | URL | Body | Auth |
|--------|-----|------|------|
| POST | `/clients/register` | email, password, name, phone | No |
| POST | `/clients/login` | email, password | No |
| GET | `/clients/profile` | - | Bearer Token |

### Client Management

| Method | URL | Body | Auth |
|--------|-----|------|------|
| GET | `/clients` | - | No |
| GET | `/clients/:id` | - | No |
| POST | `/clients/messages` | clientId, subject, content | Bearer Token |
| GET | `/clients/:id/messages` | - | Bearer Token |

### Admin

| Method | URL | Body | Auth |
|--------|-----|------|------|
| POST | `/auth/login` | email, password | No |
| POST | `/auth/register` | email, password, name, role | No |
| GET | `/admin/dashboard` | - | Bearer Token |
| GET | `/admin/clients/recent` | - | Bearer Token |

---

## 4️⃣ Test Error Cases

### Duplicate Email
```
POST /clients/register
{
  "email": "test-1730456789@example.com",
  ...
}
```
Expected: 409 Conflict

### Wrong Password
```
POST /clients/login
{
  "email": "test-1730456789@example.com",
  "password": "WrongPassword!"
}
```
Expected: 401 Unauthorized

### Non-existent Email
```
POST /clients/login
{
  "email": "notexist@example.com",
  "password": "TestPass123!"
}
```
Expected: 401 Unauthorized

### No Authorization
```
GET /clients/profile
(no Authorization header)
```
Expected: 401 Unauthorized

---

## 5️⃣ Response Examples

### Success (201/200)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "xxx-xxx-xxx",
    "name": "Test User",
    "email": "test-1730456789@example.com",
    "phone": "+1234567890"
  }
}
```

### Error (401)
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Error (409)
```json
{
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}
```

---

## ✅ Test Checklist

- [ ] Backend running (`npm run start:dev`)
- [ ] Postman environment set with `baseUrl = http://localhost:3000`
- [ ] Test 1: Register (copy email)
- [ ] Test 2: Login with that email (copy token)
- [ ] Test 3: Profile with that token
- [ ] Test duplicate email error (409)
- [ ] Test wrong password error (401)
- [ ] Test no auth error (401)
- [ ] Test other endpoints

---

## 🎯 Tips

**Auto-generate unique emails:**
- Use: `test-{{$timestamp}}@example.com`
- Postman will replace `{{$timestamp}}` with current time

**Save tokens between requests:**
- Copy token from response
- Paste in Authorization header of next request

**Different content types:**
- Most endpoints use: `Content-Type: application/json`
- Set in "Headers" tab

**Check status codes:**
- 200/201 = Success
- 400 = Bad request
- 401 = Unauthorized
- 409 = Conflict
- 500 = Server error

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Backend not running. Run `npm run start:dev` |
| 401 Unauthorized | Missing Authorization header or wrong token |
| 409 Conflict | Email already registered. Use new email |
| 404 Not found | Wrong URL or endpoint doesn't exist |
| 500 Server error | Check backend logs for errors |

---

**Ready to test! 🚀**
