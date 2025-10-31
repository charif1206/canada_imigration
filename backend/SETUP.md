# Canada Immigration MVP Backend - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your actual credentials:

```env
# Database - Replace with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/immigration_db?schema=public"

# Server
PORT=3000
NODE_ENV=development

# WhatsApp Integration (Optional - Using Twilio)
# Get credentials from https://www.twilio.com/console
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts
WHATSAPP_ACCOUNT_SID=your_twilio_account_sid
WHATSAPP_AUTH_TOKEN=your_twilio_auth_token
WHATSAPP_FROM_NUMBER=whatsapp:+14155238886
WHATSAPP_ADMIN_NUMBER=whatsapp:+1234567890

# Google Sheets Integration (Optional)
# Get credentials from https://console.cloud.google.com/
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 3. Setup PostgreSQL Database

Create a new database:

```sql
CREATE DATABASE immigration_db;
```

### 4. Run Prisma Migrations

```powershell
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate Prisma Client
- Create all database tables
- Apply migrations

### 5. (Optional) Open Prisma Studio

To view and manage your database:

```powershell
npm run prisma:studio
```

### 6. Start the Development Server

```powershell
npm run start:dev
```

The server will start on http://localhost:3000

### 7. Access Admin Panel

Open your browser and go to:
- **Admin Dashboard**: http://localhost:3000/admin

## API Endpoints

### Clients
- `POST /clients` - Create new client
- `GET /clients` - Get all clients
- `GET /clients/:id` - Get client by ID
- `GET /clients/:id/validation-status` - Check validation status
- `PATCH /clients/:id/validate` - Validate client (admin)
- `POST /clients/messages` - Send message from client
- `GET /clients/:id/messages` - Get client messages

### Admin
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/messages` - Get all messages
- `PATCH /admin/messages/:id/read` - Mark message as read
- `GET /admin/clients/recent` - Get recent clients
- `GET /admin/clients/pending` - Get pending validations

## WebSocket Events

### Client Events
- `join-client` - Join client-specific room
- `validation-{clientId}` - Receive validation notifications

### Admin Events
- `join-admin` - Join admin room
- `client-created` - New client registered
- `new-message` - New message from client

## Setting Up WhatsApp (Twilio)

1. Create account at https://www.twilio.com
2. Get a Twilio phone number with WhatsApp enabled
3. Add credentials to `.env` file
4. Test by sending a message

## Setting Up Google Sheets

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Sheets API
4. Create a service account
5. Download the JSON key file
6. Share your Google Sheet with the service account email
7. Add credentials to `.env` file

## Testing the API

### Create a Client

```powershell
curl -X POST http://localhost:3000/clients `
  -H "Content-Type: application/json" `
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "passportNumber": "AB123456",
    "nationality": "Canadian",
    "dateOfBirth": "1990-01-01",
    "address": "123 Main St, Toronto",
    "immigrationType": "Express Entry"
  }'
```

### Send a Message

```powershell
curl -X POST http://localhost:3000/clients/messages `
  -H "Content-Type: application/json" `
  -d '{
    "clientId": "client-id-here",
    "subject": "Question about my application",
    "content": "When will my application be processed?"
  }'
```

### Validate a Client (Admin)

```powershell
curl -X PATCH http://localhost:3000/clients/client-id-here/validate `
  -H "Content-Type: application/json" `
  -d '{
    "isValidated": true,
    "notes": "All documents verified"
  }'
```

## Production Build

```powershell
npm run build
npm run start:prod
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### Port Already in Use
- Change PORT in `.env` file
- Or stop other services using port 3000

### WhatsApp Not Sending
- Verify Twilio credentials
- Check account balance
- Ensure WhatsApp sandbox is set up

### TypeScript Errors
The errors you're seeing are expected because some dependencies haven't been installed yet. Run:

```powershell
npm install
```

This will install all required packages including:
- `@nestjs/config`
- `@nestjs/websockets`
- `@nestjs/platform-socket.io`
- `class-validator`
- `class-transformer`
- `googleapis`
- And all other dependencies

## Next Steps

1. **Install dependencies**: `npm install`
2. **Setup database**: Update `.env` with your PostgreSQL credentials
3. **Run migrations**: `npm run prisma:migrate`
4. **Start server**: `npm run start:dev`
5. **Test the admin panel**: http://localhost:3000/admin
6. **Optional**: Configure WhatsApp and Google Sheets integrations

## Support

For issues or questions, please check the logs or contact the development team.
