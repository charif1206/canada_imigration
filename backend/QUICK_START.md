# 🚀 Quick Start Guide - Canada Immigration MVP

## What You Need to Do to Run the Backend

### Step 1: Install Node Packages
```powershell
cd backend
npm install
```

This installs all dependencies including:
- NestJS framework
- Prisma ORM
- Socket.IO for real-time notifications
- Google Sheets API
- Axios for HTTP requests
- Class validators

### Step 2: Setup PostgreSQL Database

**Option A: Local PostgreSQL**
1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create a database:
```sql
CREATE DATABASE immigration_db;
```
3. Update `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/immigration_db?schema=public"
```

**Option B: Cloud Database (Easier)**
Use a free PostgreSQL database from:
- **Neon**: https://neon.tech (Recommended - Free tier)
- **Supabase**: https://supabase.com
- **ElephantSQL**: https://www.elephantsql.com

Update `.env` with the connection string they provide.

### Step 3: Setup Prisma (Database Schema)
```powershell
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) View database in browser
npm run prisma:studio
```

### Step 4: Start the Server
```powershell
npm run start:dev
```

### Step 5: Access Admin Panel
Open browser: **http://localhost:3000/admin**

## 🎯 That's It! MVP is Running!

The basic MVP will work with just these steps. The following integrations are OPTIONAL:

---

## 📱 Optional: WhatsApp Integration

**Why**: Send notifications to admin when clients register or send messages

**How to Setup:**

### Option 1: Twilio (Recommended)
1. Sign up at https://www.twilio.com (Free trial: $15 credit)
2. Get a phone number with WhatsApp enabled
3. Go to Console → Account Info
4. Copy Account SID and Auth Token
5. Update `.env`:
```env
WHATSAPP_ACCOUNT_SID=ACxxxx...
WHATSAPP_AUTH_TOKEN=your_token
WHATSAPP_FROM_NUMBER=whatsapp:+14155238886
WHATSAPP_ADMIN_NUMBER=whatsapp:+1234567890
```

### Option 2: Skip for Now
The app will work without WhatsApp - notifications just show in console logs.

---

## 📊 Optional: Google Sheets Integration

**Why**: Automatically save client data to Google Sheets for backup/reporting

**How to Setup:**

1. Go to https://console.cloud.google.com/
2. Create new project → Enable "Google Sheets API"
3. Create Service Account:
   - IAM & Admin → Service Accounts → Create
   - Download JSON key file
4. Create a Google Sheet and share it with the service account email
5. Copy credentials to `.env`:
```env
GOOGLE_SHEETS_ID=your_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### Or Skip for Now
The app works without Google Sheets - data is stored in database only.

---

## 🧪 Testing the MVP

### Test 1: Create a Client (Simulate Frontend Form)

**PowerShell:**
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    phone = "+1234567890"
    passportNumber = "AB123456"
    nationality = "Canadian"
    dateOfBirth = "1990-01-01"
    address = "123 Main St"
    immigrationType = "Express Entry"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/clients -Method Post -Body $body -ContentType "application/json"
```

**Or use Postman/Thunder Client:**
- Method: POST
- URL: http://localhost:3000/clients
- Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "passportNumber": "AB123456",
  "nationality": "Canadian",
  "dateOfBirth": "1990-01-01",
  "address": "123 Main St",
  "immigrationType": "Express Entry"
}
```

### Test 2: View in Admin Panel
1. Go to http://localhost:3000/admin
2. You should see the new client
3. Click "Validate" to approve them

### Test 3: Send a Message (Contact Form)
```powershell
$message = @{
    clientId = "paste-client-id-from-step-1"
    subject = "Question about my application"
    content = "When will I hear back?"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/clients/messages -Method Post -Body $message -ContentType "application/json"
```

### Test 4: Real-time Notifications
1. Open admin panel in browser
2. In another tab/window, create a new client (Test 1)
3. Watch admin panel update in real-time with notification

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                          # App entry point
│   ├── app.module.ts                    # Main module
│   ├── modules/
│   │   ├── clients/                     # Client management
│   │   │   ├── clients.controller.ts    # API endpoints
│   │   │   ├── clients.service.ts       # Business logic
│   │   │   └── dto/                     # Data validation
│   │   ├── admin/                       # Admin functionality
│   │   ├── whatsapp/                    # WhatsApp integration
│   │   ├── sheets/                      # Google Sheets
│   │   └── notifications/               # Socket.IO
│   └── prisma/                          # Database service
├── prisma/
│   └── schema.prisma                    # Database schema
├── public/
│   └── admin/
│       └── index.html                   # Admin dashboard
├── .env                                 # Configuration
└── package.json                         # Dependencies
```

---

## 🔧 Common Issues & Solutions

### ❌ Error: "Cannot find module '@nestjs/config'"
**Fix:** Run `npm install`

### ❌ Error: "Can't reach database server"
**Fix:** 
1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env`
3. Test connection: `npm run prisma:studio`

### ❌ Error: "Port 3000 already in use"
**Fix:** 
- Change PORT in `.env` to 3001
- Or stop other apps using port 3000

### ❌ Decorators error in TypeScript
**Fix:** Already fixed in `tsconfig.json` - just run `npm install`

### ❌ Admin page shows "Loading..." forever
**Fix:** 
1. Check backend is running
2. Open browser console (F12) for errors
3. Verify API URL in admin/index.html matches your server

---

## 📡 API Reference

### Client Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/clients` | Register new client |
| GET | `/clients` | Get all clients |
| GET | `/clients/:id` | Get client details |
| GET | `/clients/:id/validation-status` | Check if validated |
| PATCH | `/clients/:id/validate` | Validate client (admin) |
| POST | `/clients/messages` | Send message to admin |
| GET | `/clients/:id/messages` | Get client messages |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard statistics |
| GET | `/admin/messages` | All client messages |
| PATCH | `/admin/messages/:id/read` | Mark message read |
| GET | `/admin/clients/recent` | Recent clients |
| GET | `/admin/clients/pending` | Pending validations |

---

## 🎨 Features Included in MVP

✅ Client registration form handling  
✅ Store client data in PostgreSQL  
✅ Admin dashboard (HTML/JavaScript)  
✅ View all clients  
✅ Validate/approve clients  
✅ Real-time notifications (Socket.IO)  
✅ Client message system  
✅ WhatsApp notifications (optional)  
✅ Google Sheets export (optional)  
✅ Client validation status check  

---

## 🔜 Next Steps After MVP

1. **Frontend**: Connect your Next.js frontend to these APIs
2. **Authentication**: Add JWT auth for admin panel
3. **File Upload**: Add document upload for clients
4. **Email**: Add email notifications
5. **Payment**: Integrate payment processing
6. **Reporting**: Add analytics dashboard

---

## 💡 Tips

- Use Prisma Studio (`npm run prisma:studio`) to view/edit database
- Check terminal logs for debugging
- Admin panel auto-refreshes every 30 seconds
- WebSocket shows real-time updates instantly
- Keep `.env` file secure - never commit to git

---

## 🆘 Need Help?

1. Check terminal logs for errors
2. Check browser console (F12) for frontend errors
3. Verify `.env` configuration
4. Ensure PostgreSQL is running
5. Try `npm run prisma:studio` to check database

---

## Summary: Minimum Steps to Run

1. `npm install`
2. Setup PostgreSQL and update `.env`
3. `npm run prisma:generate`
4. `npm run prisma:migrate`
5. `npm run start:dev`
6. Open http://localhost:3000/admin

**That's it! 🎉**
