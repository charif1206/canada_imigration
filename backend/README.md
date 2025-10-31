# NestJS MVP

This project is a minimum viable product (MVP) built with NestJS and Prisma, designed to handle client data integration, send messages to the admin via WhatsApp, send data to Google Sheets, and utilize WebSockets for sending notifications for validation.

## Features

- **Client Management**: Create and manage client data.
- **Admin Interface**: An admin page to view and validate client data.
- **WhatsApp Notifications**: Send messages to the admin via WhatsApp for important updates.
- **Google Sheets Integration**: Automatically send client data to Google Sheets for easy access and management.
- **Real-time Notifications**: Use WebSockets to send real-time notifications for validation processes.

## Project Structure

```
nestjs-mvp
├── src
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── modules
│   │   ├── clients
│   │   │   ├── clients.module.ts
│   │   │   ├── clients.controller.ts
│   │   │   ├── clients.service.ts
│   │   │   └── dto
│   │   │       └── create-client.dto.ts
│   │   ├── notifications
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.gateway.ts
│   │   │   └── notifications.service.ts
│   │   ├── whatsapp
│   │   │   ├── whatsapp.module.ts
│   │   │   └── whatsapp.service.ts
│   │   ├── sheets
│   │   │   ├── sheets.module.ts
│   │   │   └── sheets.service.ts
│   │   └── admin
│   │       ├── admin.module.ts
│   │       ├── admin.controller.ts
│   │       └── admin.service.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── common
│       ├── guards
│       └── decorators
├── prisma
│   ├── schema.prisma
│   └── migrations
├── public
│   └── admin
│       └── index.html
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nestjs-mvp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

4. Run the application:
   ```
   npm run start
   ```

5. Access the admin interface at `http://localhost:3000/admin`.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prisma**: A modern database toolkit for TypeScript and Node.js.
- **WebSockets**: For real-time communication.
- **WhatsApp API**: For sending notifications to the admin.
- **Google Sheets API**: For integrating and sending data to Google Sheets.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.