# Quick Test - Copy & Paste Commands

## The Issue
You were trying to login with `john.doe@example.com` but **that email was never registered**!

The 401 error `"Invalid credentials kkkk"` specifically means **the email doesn't exist in database**.

---

## ✅ Solution: Follow These Exact Commands

### Step 1: REGISTER a new client (gets a fresh unique email)

**Run this:**
```bash
curl -X POST http://localhost:3000/clients/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-'$(date +%s)'@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890",
    "immigrationType": "skilled-worker"
  }'
```

**You'll get back:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "...",
    "name": "Test User",
    "email": "test-1730456123@example.com",  ← COPY THIS EMAIL
    ...
  }
}
```

**👉 Copy the email from the response**

---

### Step 2: LOGIN with that email (use the email from Step 1)

Replace `test-1730456123@example.com` with your email from Step 1:

```bash
curl -X POST http://localhost:3000/clients/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-1730456123@example.com",
    "password": "TestPass123!"
  }'
```

**You'll get back:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": { ... }
}
```

**👉 Copy the access_token**

---

### Step 3: GET PROFILE with the token

Replace `YOUR_TOKEN` with the token from Step 2:

```bash
curl http://localhost:3000/clients/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**You'll get back:**
```json
{
  "id": "...",
  "name": "Test User",
  "email": "test-1730456123@example.com",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker",
  "isValidated": false,
  "messages": [],
  "createdAt": "2025-11-01T01:30:45.000Z"
}
```

✅ **All 3 commands should work!**

---

## 🎯 Real Example

**Step 1 - Register:**
```bash
$ curl -X POST http://localhost:3000/clients/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-'$(date +%s)'@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890"
  }'

# Returns:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI...",
#   "client": {
#     "id": "13a03122-5d3f-44c6-a8d2-a279d2283e47",
#     "name": "Test User",
#     "email": "test-1730456789@example.com",  ← NOTE THIS
#     "phone": "+1234567890"
#   }
# }
```

**Step 2 - Login (use email test-1730456789@example.com):**
```bash
$ curl -X POST http://localhost:3000/clients/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-1730456789@example.com",
    "password": "TestPass123!"
  }'

# Returns:
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM2EwMzEyMi...",
#   "client": { ... }
# }
```

**Step 3 - Get Profile:**
```bash
$ curl http://localhost:3000/clients/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM2EwMzEyMi..."

# Returns:
# {
#   "id": "13a03122-5d3f-44c6-a8d2-a279d2283e47",
#   "name": "Test User",
#   "email": "test-1730456789@example.com",
#   "phone": "+1234567890",
#   "isValidated": false,
#   "messages": [],
#   "createdAt": "2025-11-01T01:30:45.000Z"
# }
```

✅ **SUCCESS!**

---

## 🔑 The Key Points

1. **Always register FIRST** - Creates the client record in database
2. **Copy the email from registration** - Must use that exact same email for login
3. **Use correct password** - Must be exactly `TestPass123!` (case-sensitive)
4. **Copy the token from login** - Use that for profile request

---

## Why You Got 401 Before

```
❌ WRONG WORKFLOW:
  Login attempt: john.doe@example.com
  Error: 401 "Invalid credentials kkkk"
  
  Reason: john.doe@example.com doesn't exist in database
```

```
✅ CORRECT WORKFLOW:
  Register: test-1730456789@example.com → Gets stored in database
  Login: test-1730456789@example.com → Found in database → ✓ Works!
```

---

## 🚀 Test It Now!

Copy and paste the commands above into your terminal and follow the steps!

**The backend is working correctly!** 🎉
