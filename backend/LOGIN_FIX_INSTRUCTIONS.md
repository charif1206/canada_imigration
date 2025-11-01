# 🚨 Login Error Fix - Step by Step

## The Problem

You got **401 Unauthorized** because:

```
You tried to login with: john.doe@example.com
But that email was NEVER registered!
```

The backend log shows:
```
[Nest] 12768  - 11/01/2025, 1:13:19 AM     LOG [ClientsService] Registering new client: john.doe@example.com
[Nest] 12768  - 11/01/2025, 1:13:41 AM     LOG [ClientsService] Client login attempt: john.doe@example.com
```

But also shows earlier:
```
[Nest] 12768  - 11/01/2025, 1:12:29 AM   LOG [ClientsService] Registering new client: test-client-1761955949@example.com
```

**Issue**: The test file has hardcoded old emails that don't match what's in the database.

---

## ✅ Solution: Follow These Exact Steps

### Step 1: Register a Fresh Client
Open `backend/res/client-auth.http`

**Find this request (QS-1):**
```http
POST {{baseUrl}}/clients/register
Content-Type: {{contentType}}

{
  "name": "Test User",
  "email": "test-client-{{$timestamp}}@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}
```

**Click "Send Request"**

**You'll get back:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "id": "13a03122-5d3f-44c6-a8d2-a279d2283e47",
    "name": "Test User",
    "email": "test-client-1761955949@example.com",  👈 COPY THIS
    "phone": "+1234567890",
    "immigrationType": "skilled-worker"
  }
}
```

✅ **COPY the email from the response**

---

### Step 2: Update QS-2 with the Correct Email

**Find QS-2:**
```http
### QS-2: Login with Same Credentials (copy email from QS-1 response)
# ⚠️ CRITICAL: Copy the EXACT email from QS-1 response and paste it here
POST {{baseUrl}}/clients/login
Content-Type: {{contentType}}

{
  "email": "test-client-1761955949@example.com",  👈 REPLACE THIS
  "password": "TestPass123!"
}
```

**Replace `test-client-1761955949@example.com` with the email you got in Step 1**

For example, if Step 1 returned `test-client-1761999999@example.com`, change it to:
```json
{
  "email": "test-client-1761999999@example.com",
  "password": "TestPass123!"
}
```

---

### Step 3: Login
**Click "Send Request" on QS-2**

You should get:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": { ... }
}
```

✅ **COPY the access_token**

---

### Step 4: Get Profile
**Find QS-3:**
```http
### QS-3: Get Profile (copy token from QS-2 response to @clientToken above)
GET {{baseUrl}}/clients/profile
Authorization: Bearer {{clientToken}}
```

**At the top of the file, update:**
```http
@clientToken = <paste token from QS-2 here>
```

Change from:
```http
@clientToken = 
```

To:
```http
@clientToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM2EwMzEyMi01ZDNmLTQ0YzYtYThkMi1hMjc5ZDIyODNlNDciLCJlbWFpbCI6InRlc3QtY2xpZW50LTE3NjE5NTU5NDlAZXhhbXBsZS5jb20iLCJ0eXBlIjoiY2xpZW50IiwiaWF0IjoxNzMwNDU1MzAyLCJleHAiOjE3MzA1NDE3MDJ9...
```

**Click "Send Request" on QS-3**

You should get:
```json
{
  "id": "13a03122-5d3f-44c6-a8d2-a279d2283e47",
  "name": "Test User",
  "email": "test-client-1761955949@example.com",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker",
  "isValidated": false,
  "messages": [],
  "createdAt": "2025-11-01T01:12:29.000Z"
}
```

✅ **SUCCESS! All 3 steps work!**

---

## 🔍 Why This Happens

The HTTP test file originally had hardcoded test emails:
```http
{
  "email": "john.doe@example.com",  ❌ This doesn't exist!
  "password": "SecurePass123!"
}
```

But you never registered that email. The registration uses `{{$timestamp}}` to create unique emails each time:
```http
{
  "email": "test-client-{{$timestamp}}@example.com",  ✅ Creates new email each time
  "password": "TestPass123!"
}
```

So each test creates a NEW email. You must use that exact same email for login.

---

## 🧪 Quick Reference

| Step | What to Do | Expected Response |
|------|-----------|------------------|
| 1️⃣ QS-1 Register | Click "Send Request" | 201 + access_token + email |
| 2️⃣ Copy Email | Highlight email from Step 1 response | Email like `test-client-1761955949@example.com` |
| 3️⃣ QS-2 Login | Update email in QS-2, click "Send Request" | 200 + new access_token |
| 4️⃣ Copy Token | Highlight access_token from Step 3 response | JWT token |
| 5️⃣ QS-3 Profile | Update @clientToken at top, click "Send Request" | 200 + full client profile |

---

## 🚨 Common Mistakes

❌ **Don't:** Use the same email twice
```
First test: test-client-1111@example.com ✓ works
Second test: test-client-1111@example.com ✗ "Conflict: Email already registered"
```

✅ **Do:** Use fresh email each time (the `{{$timestamp}}` handles this automatically)

---

❌ **Don't:** Copy old emails from previous test
```
Old email: john.doe@example.com ✗ Never registered
Login: john.doe@example.com ✗ Returns 401
```

✅ **Do:** Use email from current registration
```
Register: test-client-1761955949@example.com ✓ Returns email
Login: test-client-1761955949@example.com ✓ Works!
```

---

❌ **Don't:** Use wrong token
```
Get old token from Session 1: token_abc123 ✗ Expired
Use in Session 2: Bearer token_abc123 ✗ Returns 401
```

✅ **Do:** Use current session token
```
Login: Returns token_xyz789
Profile: Bearer token_xyz789 ✓ Works!
```

---

## 📋 Test Workflow

```
START
  ↓
[QS-1] Register → Get email
  ↓
[QS-2] Update email + Login → Get token
  ↓
[QS-3] Update token + Profile → Success!
  ↓
END
```

**Each request depends on the output of the previous request.**

---

## ✨ The Backend Code (Already Fixed)

The backend `loginClient()` method is correct:

```typescript
// async loginClient(loginDto: ClientLoginDto) {
//   // Find client in database using raw SQL
//   const client = await this.prisma.$queryRaw`
//     SELECT * FROM "Client" WHERE email = ${loginDto.email}
//   ` as any[];

//   if (!client || client.length === 0) {
//     throw new UnauthorizedException('Invalid credentials kkkk');
//   }

//   // If you see "Invalid credentials kkkk" → email doesn't exist in database
//   // Solution: Register the email first with QS-1
  
//   const clientData = client[0];
//   const isPasswordValid = await bcrypt.compare(loginDto.password, clientData.password);

//   if (!isPasswordValid) {
//     throw new UnauthorizedException('Invalid credentials111111111111');
//   }

//   // If you see "Invalid credentials111111111111" → password is wrong
//   // Solution: Make sure password is "TestPass123!" (case-sensitive)
  
//   // Generate and return token
//   const token = this.jwtService.sign({
//     sub: clientData.id,
//     email: clientData.email,
//     type: 'client',
//   });

//   return { access_token: token, client: { ...clientData, password: undefined } };
// }
```

---

## 🎯 Bottom Line

**The 401 error means: "Client with this email doesn't exist in database"**

**Fix:** Register a new client first with QS-1, then use THAT email for QS-2 login.

**The auth system is working correctly!** You just needed to use the right email. 👍
