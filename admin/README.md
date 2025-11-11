# Canada Immigration Admin Dashboard

A Next.js-based admin dashboard for managing client applications and validations for Canada immigration services.

## Features

- 📊 **Real-time Dashboard Stats**: View total clients, validated clients, pending clients, and unread messages
- 👥 **Client Management**: View, validate, and manage client applications
- 💬 **Message Center**: Read and respond to client messages
- 🔔 **Real-time Notifications**: Get instant updates via WebSocket when new clients register or messages arrive
- 🎨 **Modern UI**: Built with Next.js 16, React 19, and Tailwind CSS 4

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.IO Client
- **Backend API**: http://localhost:3000

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 3000

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The admin dashboard will be available at **http://localhost:3001**

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Project Structure

```
admin/
├── app/
│   ├── page.tsx          # Main admin dashboard
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json
```

## Features Overview

### Dashboard Stats
- Total clients count
- Validated clients count
- Pending clients count
- Unread messages count

### Client Table
- View client details (name, email, phone, immigration type)
- Validation status badges
- Quick validate button for pending clients
- Date of registration

### Message Center
- View all client messages
- Read/unread status
- Mark messages as read
- Client information display

### Real-time Updates
- WebSocket connection to backend
- Instant notifications for new clients
- Instant notifications for new messages
- Auto-refresh every 30 seconds

## API Endpoints Used

- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/clients/recent?limit=20` - Recent clients list
- `GET /admin/messages` - All messages
- `PATCH /clients/:id/validate` - Validate a client
- `PATCH /admin/messages/:id/read` - Mark message as read

## Socket.IO Events

- `connect` - WebSocket connection established
- `join-admin` - Join admin room for real-time updates
- `client-created` - New client registered
- `new-message` - New message received

## Color Scheme

- Primary: Purple (#667eea - #764ba2)
- Success: Green (#10b981)
- Warning: Yellow (#fef3c7)
- Info: Blue (#3b82f6)
