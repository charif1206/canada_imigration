# Auth Module - Refactored

This module handles all authentication and authorization functionality following SOLID principles and best practices.

## Structure

```
auth/
├── constants/
│   └── auth.constants.ts          # Configuration constants, error/success messages
├── dto/
│   ├── index.ts                   # Centralized exports for DTOs and types
│   ├── login.dto.ts               # Login validation DTO
│   └── register-admin.dto.ts      # Registration validation DTO
├── helpers/
│   ├── admin.helper.ts            # Admin data transformation utilities
│   ├── password.helper.ts         # Password hashing and validation
│   └── token.helper.ts            # Token generation for email/password flows
├── interfaces/
│   └── auth.interface.ts          # TypeScript interfaces and types
├── auth.controller.ts             # HTTP endpoint handlers
├── auth.module.ts                 # Module definition
├── auth.service.ts                # Business logic layer
├── auth.service.spec.ts           # Unit tests
├── jwt-auth.guard.ts              # JWT authentication guard
└── jwt.strategy.ts                # Passport JWT strategy
```

## Features

### Authentication
- **Login**: Username/password authentication with JWT token generation
- **Registration**: Admin user registration with email verification
- **Profile**: Get authenticated user profile
- **Guards**: JWT-based route protection

### Email Verification
- **Verify Email**: Token-based email verification
- **Resend Verification**: Resend verification email if expired
- **Auto-verification**: Default admin is pre-verified

### Password Management
- **Change Password**: Change password for authenticated users
- **Forgot Password**: Request password reset via email
- **Reset Password**: Reset password using secure token

## API Endpoints

### Public Endpoints

| Method | Endpoint                    | Description                    |
|--------|----------------------------|--------------------------------|
| POST   | `/auth/login`              | Login with credentials         |
| POST   | `/auth/register`           | Register new admin             |
| GET    | `/auth/verify-email/:token`| Verify email with token        |
| POST   | `/auth/resend-verification`| Resend verification email      |
| POST   | `/auth/forgot-password`    | Request password reset         |
| POST   | `/auth/reset-password/:token`| Reset password with token   |

### Protected Endpoints (Requires JWT)

| Method | Endpoint                 | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/auth/profile`         | Get current user profile |
| POST   | `/auth/change-password` | Change user password     |

## Helper Functions

### Password Helper (`password.helper.ts`)
- `hashPassword(password: string)` - Hash password using bcrypt
- `comparePasswords(plain: string, hashed: string)` - Verify password
- `validatePasswordStrength(password: string)` - Validate password requirements

### Token Helper (`token.helper.ts`)
- `generateToken()` - Generate secure random token
- `generateEmailVerificationToken()` - Generate email verification token with expiry
- `generatePasswordResetToken()` - Generate password reset token with expiry
- `isTokenExpired(date: Date | null)` - Check if token is expired

### Admin Helper (`admin.helper.ts`)
- `sanitizeAdmin(admin: Admin)` - Remove password from admin object
- `transformToProfileResponse(admin: Admin)` - Transform to profile response
- `createJwtPayload(admin: Admin)` - Create JWT payload
- `formatMessage(template: string, values: Record<string, any>)` - Format log/error messages

## Constants

### Password Configuration
```typescript
PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
}
```

### Token Expiry
```typescript
TOKEN_EXPIRY = {
  EMAIL_VERIFICATION: 24 hours,
  PASSWORD_RESET: 1 hour,
  JWT: 7 days,
}
```

### Error Messages
Centralized error messages for consistent error handling.

### Success Messages
Centralized success messages for consistent responses.

## Security Features

1. **Password Hashing**: Uses bcrypt with configurable salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Email Verification**: Required for account activation
4. **Password Reset**: Secure token-based password reset
5. **Token Expiration**: All tokens have expiry times
6. **Error Hiding**: Doesn't reveal if email exists in forgot password
7. **Input Validation**: DTOs with class-validator

## Testing

All service methods are tested with 11 passing unit tests:

```bash
npm test -- auth.service.spec.ts
```

Test Coverage:
- ✓ User validation
- ✓ Login with JWT
- ✓ Registration with email verification
- ✓ Password change
- ✓ Profile retrieval
- ✓ Error handling

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each helper file has a single, focused responsibility
- Service methods are focused on specific tasks
- Controller methods only handle HTTP concerns

### Open/Closed Principle (OCP)
- Helper functions can be extended without modifying existing code
- Constants allow configuration without code changes

### Liskov Substitution Principle (LSP)
- Interfaces ensure consistent contracts
- Mock implementations in tests work seamlessly

### Interface Segregation Principle (ISP)
- Small, focused interfaces (SafeAdmin, JwtPayload, etc.)
- DTOs separate concerns for different operations

### Dependency Inversion Principle (DIP)
- Service depends on abstractions (PrismaService, JwtService)
- Helpers are pure functions with no dependencies

## Environment Variables

```env
# Default Admin
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=admin123

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Email Service (configured in NotificationsModule)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=587
```

## Best Practices

1. **Type Safety**: Full TypeScript coverage with interfaces
2. **Error Handling**: Centralized error messages and proper exceptions
3. **Logging**: Comprehensive logging for debugging
4. **Async Operations**: Non-blocking email sending
5. **Security**: Password hashing, token expiry, input validation
6. **Testing**: Comprehensive unit test coverage
7. **Documentation**: JSDoc comments on all public methods
8. **Code Organization**: Clear separation of concerns

## Future Improvements

- [ ] Add rate limiting for login attempts
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Add session management
- [ ] Add OAuth integration (Google, GitHub, etc.)
- [ ] Add refresh token rotation
- [ ] Add password history to prevent reuse
- [ ] Add account lockout after failed attempts
- [ ] Add audit logging for security events
