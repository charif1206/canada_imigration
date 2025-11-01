# 🧪 JWT Error Messages - Test Guide

## ⚡ Quick Test (5 tests, 2 minutes)

### Prerequisites
1. Backend must be running: `npm run start:dev`
2. Open: `backend/res/client-auth-clean.http`

---

## 🔬 Test All 5 Scenarios

### ✅ PASS Criteria
Each test should return a **descriptive error message** (not generic "Unauthorized")

---

### Test 1: No Authorization Header

**Run:**
```http
GET {{baseUrl}}/clients/profile
```

**Expected Message:**
> "Authentication required. Please provide a valid access token in the Authorization header."

✅ Pass if message is descriptive

---

### Test 2: Invalid Token (Random String)

**Run:**
```http
GET {{baseUrl}}/clients/profile
Authorization: Bearer invalid.jwt.token
```

**Expected Message:**
> "Malformed access token. The token format is invalid. Please log in again to get a new token."

✅ Pass if message mentions "malformed" or "invalid format"

---

### Test 3: Incomplete Token

**Run:**
```http
GET {{baseUrl}}/clients/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**Expected Message:**
> "Malformed access token. The token format is invalid. Please log in again to get a new token."

✅ Pass if message is descriptive

---

### Test 4: Expired Token

**Run:**
```http
GET {{baseUrl}}/clients/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Expected Message:**
> "Your session has expired. Please log in again to continue."

✅ Pass if message mentions "expired" or "session"

---

### Test 5: Valid Token (Should Work)

**First, get a valid token:**
```http
POST {{baseUrl}}/clients/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test-{{$timestamp}}@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

**Copy the `access_token` from response**

**Then test:**
```http
GET {{baseUrl}}/clients/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected:** Status 200 with profile data

✅ Pass if profile data is returned

---

## 📊 Results Checklist

After running all tests:

- [ ] Test 1: Descriptive "Authentication required" message ✅
- [ ] Test 2: Descriptive "Malformed token" message ✅
- [ ] Test 3: Descriptive "Malformed token" message ✅
- [ ] Test 4: Descriptive "Session expired" message ✅
- [ ] Test 5: Profile data returned successfully ✅

**If all pass → JWT errors are now descriptive! 🎉**

---

## 🎯 Before vs After

### Before (Generic)
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### After (Descriptive)
```json
{
  "message": "Your session has expired. Please log in again to continue.",
  "statusCode": 401,
  "timestamp": "2025-11-01T10:30:00.000Z",
  "path": "/clients/profile"
}
```

---

## 💡 What to Look For

Each error response should have:
1. ✅ **Specific problem** identified
2. ✅ **Clear explanation** of what went wrong
3. ✅ **Actionable guidance** (e.g., "Please log in again")
4. ✅ **Timestamp** for debugging
5. ✅ **Path** showing which endpoint failed

---

**Ready to test! Run the backend and try all 5 scenarios above.** 🚀
