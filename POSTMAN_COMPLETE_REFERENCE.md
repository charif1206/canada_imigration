# 🧪 Complete Postman Testing Reference

## 📋 All Endpoints to Test

### 1. CLIENT AUTHENTICATION

#### Register Client
```
POST http://localhost:3000/clients/register

Body (JSON):
{
  "name": "Test User",
  "email": "test-1730456789@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890",
  "immigrationType": "skilled-worker"
}

Expected: 201 Created
{
  "access_token": "...",
  "client": { ... }
}
```

#### Login Client
```
POST http://localhost:3000/clients/login

Body (JSON):
{
  "email": "test-1730456789@example.com",
  "password": "TestPass123!"
}

Expected: 200 OK
{
  "access_token": "...",
  "client": { ... }
}
```

#### Get Client Profile
```
GET http://localhost:3000/clients/profile

Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Expected: 200 OK
{
  "id": "...",
  "name": "Test User",
  "email": "test-1730456789@example.com",
  ...
}
```

---

### 2. CLIENT MANAGEMENT

#### Get All Clients
```
GET http://localhost:3000/clients

Expected: 200 OK
[
  { "id": "...", "name": "...", "email": "..." },
  ...
]
```

#### Get Specific Client
```
GET http://localhost:3000/clients/cm3xxx123

Expected: 200 OK
{
  "id": "cm3xxx123",
  "name": "Test User",
  "email": "test@example.com",
  ...
}
```

#### Send Message (from client)
```
POST http://localhost:3000/clients/messages

Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body (JSON):
{
  "clientId": "cm3xxx123",
  "subject": "Help needed",
  "content": "I need assistance with my application"
}

Expected: 201 Created
{
  "id": "msg123",
  "clientId": "cm3xxx123",
  "subject": "Help needed",
  "content": "I need assistance with my application",
  ...
}
```

#### Get Client Messages
```
GET http://localhost:3000/clients/cm3xxx123/messages

Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Expected: 200 OK
[
  { "id": "...", "subject": "..." },
  ...
]
```

#### Validate Client
```
PATCH http://localhost:3000/clients/cm3xxx123/validate

Header:
Authorization: Bearer <admin_token>

Body (JSON):
{
  "isValidated": true,
  "notes": "Documents verified successfully"
}

Expected: 200 OK
{
  "id": "cm3xxx123",
  "isValidated": true,
  "notes": "Documents verified successfully",
  ...
}
```

#### Get Validation Status
```
GET http://localhost:3000/clients/cm3xxx123/validation-status

Header:
Authorization: Bearer <token>

Expected: 200 OK
{
  "clientId": "cm3xxx123",
  "name": "Test User",
  "isValidated": false,
  "validatedAt": null,
  "notes": ""
}
```

---

### 3. ADMIN AUTHENTICATION

#### Admin Register
```
POST http://localhost:3000/auth/register

Body (JSON):
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "role": "admin"
}

Expected: 201 Created
{
  "access_token": "...",
  "admin": { ... }
}
```

#### Admin Login
```
POST http://localhost:3000/auth/login

Body (JSON):
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}

Expected: 200 OK
{
  "access_token": "...",
  "admin": { ... }
}
```

#### Get Admin Profile
```
GET http://localhost:3000/auth/profile

Header:
Authorization: Bearer <admin_token>

Expected: 200 OK
{
  "id": "...",
  "name": "Admin User",
  "email": "admin@example.com",
  ...
}
```

#### Change Password
```
PATCH http://localhost:3000/auth/change-password

Header:
Authorization: Bearer <admin_token>

Body (JSON):
{
  "oldPassword": "AdminPass123!",
  "newPassword": "NewAdminPass123!"
}

Expected: 200 OK
{
  "message": "Password updated successfully"
}
```

---

### 4. ADMIN DASHBOARD

#### Get Dashboard
```
GET http://localhost:3000/admin/dashboard

Header:
Authorization: Bearer <admin_token>

Expected: 200 OK
{
  "totalClients": 5,
  "totalMessages": 10,
  "pendingValidation": 2,
  ...
}
```

#### Get Recent Clients
```
GET http://localhost:3000/admin/clients/recent

Header:
Authorization: Bearer <admin_token>

Expected: 200 OK
[
  { "id": "...", "name": "...", "createdAt": "..." },
  ...
]
```

#### Get Pending Clients
```
GET http://localhost:3000/admin/clients/pending

Header:
Authorization: Bearer <admin_token>

Expected: 200 OK
[
  { "id": "...", "name": "...", "isValidated": false },
  ...
]
```

#### Get All Messages (Admin)
```
GET http://localhost:3000/admin/messages

Header:
Authorization: Bearer <admin_token>

Expected: 200 OK
[
  { "id": "...", "subject": "...", "isRead": false },
  ...
]
```

#### Mark Message as Read
```
PATCH http://localhost:3000/admin/messages/msg123/read

Header:
Authorization: Bearer <admin_token>

Body (JSON):
{}

Expected: 200 OK
{
  "id": "msg123",
  "subject": "...",
  "isRead": true,
  ...
}
```

---

## ⚠️ ERROR RESPONSES

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "error": "Unauthorized",
  "statusCode": 401
}
```
**When:** Missing or invalid token

### 409 Conflict
```json
{
  "message": "Email already registered",
  "error": "Conflict",
  "statusCode": 409
}
```
**When:** Email already exists

### 404 Not Found
```json
{
  "message": "Client with ID xxx not found",
  "error": "Not Found",
  "statusCode": 404
}
```
**When:** Resource doesn't exist

### 400 Bad Request
```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```
**When:** Invalid input data

---

## 🎯 TEST EXECUTION PLAN

### Phase 1: Authentication (5 min)
1. Register client
2. Login client
3. Get profile
4. Test duplicate email error
5. Test wrong password error

### Phase 2: Client Management (5 min)
1. Get all clients
2. Get specific client
3. Send message
4. Get messages
5. Validate client

### Phase 3: Admin (5 min)
1. Admin register
2. Admin login
3. Admin profile
4. Get dashboard
5. Get recent clients

### Phase 4: Error Cases (3 min)
1. Missing Authorization header
2. Invalid token
3. Wrong password
4. Non-existent email
5. Duplicate email

**Total: ~18 minutes for full testing**

---

## ✅ PASS/FAIL CHECKLIST

### Must Pass (Critical)
- [ ] Register returns 201
- [ ] Login returns 200
- [ ] Profile returns 200 with token
- [ ] Profile returns 401 without token
- [ ] Duplicate email returns 409
- [ ] Wrong password returns 401

### Should Pass (Important)
- [ ] Get all clients returns 200
- [ ] Send message returns 201
- [ ] Admin login returns 200
- [ ] Dashboard returns 200
- [ ] Error messages are descriptive

### Nice to Have
- [ ] Timestamps are correct
- [ ] Password is not returned in response
- [ ] Pagination works
- [ ] Sorting works

---

## 🔑 Tips & Tricks

**Copy-Paste Shortcuts:**
1. Ctrl+C to copy response body
2. Ctrl+V to paste into next request

**Token Management:**
1. Save token in "Tests" tab:
```javascript
pm.environment.set("clientToken", pm.response.json().access_token);
```

2. Use in next request:
```
Authorization: Bearer {{clientToken}}
```

**Auto-Generate Data:**
- Email: `test-{{$timestamp}}@example.com`
- Phone: `+1{{$randomInt}}`

---

## 🚀 NEXT STEPS

1. Download Postman
2. Create environment
3. Follow Phase 1 tests
4. Document results
5. Move to Phase 2
6. Complete all phases
7. Export collection
8. Share with team

---

**Happy Testing! 🎉**
