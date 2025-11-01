# 🧪 Client Authentication Testing Guide

## 📁 Files

- **`client-auth-clean.http`** ← Use this organized version (NEW!)
- `client-auth.http` - Old version (keep for reference)

---

## 📚 Structure of `client-auth-clean.http`

The file is organized into 8 clear sections:

### 1. **Configuration**
- Base URL: `http://localhost:3000`
- Content Type: `application/json`
- Token placeholder: `@clientToken`

### 2. **⚡ Quick Start (3 Tests - 2 minutes)**
Follow these 3 steps:
1. Register → Copy email
2. Login → Copy token
3. Get Profile → Verify auth works

### 3. **📋 View All Clients**
- GET all registered clients

### 4. **✅ Registration Tests (9 Tests)**
Test registration with different scenarios:
- Skilled Worker
- Family Sponsorship
- Student Visa
- Business Immigration
- Refugee Status
- No Immigration Type
- Special characters
- International phone
- Long names

### 5. **🔐 Login Tests - Valid (2 Tests)**
- Valid credentials
- Multiple login attempts

### 6. **❌ Error Cases - Login (5 Tests)**
- Email not found
- Wrong password
- Missing email
- Missing password
- Email case sensitivity

### 7. **❌ Error Cases - Registration (7 Tests)**
- Duplicate email
- Invalid email format
- Weak password
- Missing password
- Missing email
- Missing name

### 8. **🔓 Profile Tests (4 Tests)**
- Valid token
- No token
- Invalid token
- Expired token

---

## 🚀 How to Use

### Step 1: Copy File Name
```
client-auth-clean.http
```

### Step 2: Open in Postman or VS Code HTTP Client

**In Postman:**
- Create → HTTP Request
- Copy-paste each request

**In VS Code:**
- Install "REST Client" extension
- Click "Send Request" above each test

### Step 3: Quick Start Workflow
1. **Run**: Register test
2. **Copy**: Email from response
3. **Paste**: Email in Login test
4. **Run**: Login test
5. **Copy**: access_token from response
6. **Paste**: Token in @clientToken at top
7. **Run**: Get Profile test

### Step 4: Test Everything
- Register with different immigration types
- Test all error cases
- Verify error messages are now descriptive

---

## ✅ Success Indicators

### Register (201 Created)
```json
{
  "access_token": "eyJhbGciOi...",
  "client": {
    "id": "xxx-xxx-xxx",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "immigrationType": "skilled-worker"
  }
}
```

### Login (200 OK)
```json
{
  "access_token": "eyJhbGciOi...",
  "client": {
    "id": "xxx-xxx-xxx",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Get Profile (200 OK)
```json
{
  "id": "xxx-xxx-xxx",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

---

## ❌ Error Messages (Now Descriptive!)

### Email Not Found (401)
**Old:** "Invalid credentials"
**New:** "No account found with email 'test@example.com'. Please check your email or register first."

### Wrong Password (401)
**Old:** "Invalid credentials"
**New:** "Password is incorrect. Please check your password and try again."

### Duplicate Email (409)
**Old:** "Email already registered"
**New:** "Email 'test@example.com' is already registered. Please use a different email or try logging in."

---

## 📊 Test Results Checklist

### Quick Start (3/3)
- [ ] Register: Status 201
- [ ] Login: Status 200, Got token
- [ ] Get Profile: Status 200

### Registration Tests (9/9)
- [ ] Skilled Worker: 201
- [ ] Family Sponsorship: 201
- [ ] Student Visa: 201
- [ ] Business Immigration: 201
- [ ] Refugee Status: 201
- [ ] No Type: 201
- [ ] Special Characters: 201
- [ ] International Phone: 201
- [ ] Long Name: 201

### Login Tests (2/2)
- [ ] Valid Credentials: 200
- [ ] Multiple Attempts: 200

### Error Cases - Login (5/5)
- [ ] Email Not Found: 401 (Correct message)
- [ ] Wrong Password: 401 (Correct message)
- [ ] Missing Email: 400
- [ ] Missing Password: 400
- [ ] Case Sensitivity: 401

### Error Cases - Registration (7/7)
- [ ] Duplicate Email: 409 (Correct message)
- [ ] Invalid Email: 400
- [ ] Weak Password: 400
- [ ] Missing Password: 400
- [ ] Missing Email: 400
- [ ] Missing Name: 400

### Profile Tests (4/4)
- [ ] Valid Token: 200
- [ ] No Token: 401
- [ ] Invalid Token: 401
- [ ] Expired Token: 401

---

## 💡 Pro Tips

1. **Always use unique emails** - Use timestamp: `test-{{$timestamp}}@example.com`
2. **Save tokens** - Copy token from response and paste in @clientToken
3. **Understand error codes:**
   - `200/201` = Success
   - `400` = Bad request (invalid input)
   - `401` = Unauthorized (auth failed)
   - `409` = Conflict (duplicate email)
4. **Test errors intentionally** - Helps understand API behavior
5. **Check backend logs** - Shows detailed error info

---

## 🔄 Complete Test Workflow

```
1. Quick Start (2 min)
   ↓
2. Registration Tests (5 min)
   ↓
3. Login Tests (3 min)
   ↓
4. Error Cases (5 min)
   ↓
5. Profile Tests (2 min)
   ↓
6. Review Results
   ↓
✅ Complete!
```

**Total Time: ~17 minutes**

---

## 📝 Notes

- All error messages are now **descriptive and helpful**
- Each test includes comments explaining what it does
- Organized by feature and outcome
- Easy to scan and find specific tests
- Ready for Postman or VS Code HTTP Client

---

**Happy Testing! 🚀**
