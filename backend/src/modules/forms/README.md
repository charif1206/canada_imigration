# Forms Module - Refactored

This module handles form submissions for equivalence, residence, and partner applications, including file uploads and client status tracking.

## Structure

```
forms/
├── constants/
│   └── forms.constants.ts         # Configuration, messages, field mappings
├── dto/
│   ├── index.ts                   # Centralized exports
│   ├── equivalence-form.dto.ts    # Equivalence form validation
│   ├── residence-form.dto.ts      # Residence form validation
│   └── partner-form.dto.ts        # Partner form validation
├── helpers/
│   ├── client-update.helper.ts    # Client status update utilities
│   ├── file-upload.helper.ts      # File upload to Cloudinary
│   ├── form-data.helper.ts        # Form data creation utilities
│   └── response.helper.ts         # Response formatting
├── interfaces/
│   └── forms.interface.ts         # TypeScript interfaces
├── forms.controller.ts            # HTTP endpoint handlers
├── forms.module.ts                # Module definition
├── forms.service.ts               # Business logic layer
└── forms.service.spec.ts          # Unit tests (13 tests)
```

## Features

### Form Types
- **Equivalence Form**: Educational credential equivalence with portfolio upload
- **Residence Form**: Permanent residence application with document upload
- **Partner Form**: Partnership/agency application (no file upload)

### File Management
- **Cloudinary Integration**: Automatic file upload to cloud storage
- **Multiple Folders**: Separate folders for each form type
- **Error Handling**: Continues processing if file upload fails

### Client Tracking
- **Status Updates**: Automatically updates client status when forms submitted
- **Folder URLs**: Saves Cloudinary URLs to client record
- **Rejection Tracking**: Clears rejection data on new submission

## API Endpoints

### Form Submission (All require JWT authentication)

| Method | Endpoint            | Description                      | File Upload |
|--------|---------------------|----------------------------------|-------------|
| POST   | `/forms/equivalence`| Submit equivalence form          | Optional    |
| POST   | `/forms/residence`  | Submit residence form            | Optional    |
| POST   | `/forms/partner`    | Submit partner application       | No          |

### Form Retrieval (Requires JWT authentication)

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| GET    | `/forms`      | Get all form submissions |
| GET    | `/forms/:id`  | Get form by ID           |

## Helper Functions

### File Upload Helper (`file-upload.helper.ts`)
- `uploadFileToCloudinary(file, service, folder)` - Upload file to Cloudinary
- `formatLogMessage(template, values)` - Format log messages with placeholders

### Form Data Helper (`form-data.helper.ts`)
- `createEquivalenceFormData(dto, fileUrl)` - Create equivalence form data object
- `createResidenceFormData(dto, fileUrl)` - Create residence form data object
- `createPartnerFormData(dto)` - Create partner form data object
- `generateFormId(formType)` - Generate unique form ID

### Client Update Helper (`client-update.helper.ts`)
- `updateClientEquivalenceStatus(prisma, clientId, fileUrl)` - Update equivalence status
- `updateClientResidenceStatus(prisma, clientId, fileUrl)` - Update residence status
- `updateClientPartnerStatus(prisma, clientId)` - Update partner status

### Response Helper (`response.helper.ts`)
- `createFormSubmissionResponse(formType)` - Create standardized success response

## Constants

### Form Types
```typescript
FORM_TYPES = {
  EQUIVALENCE: 'EQUIVALENCE',
  RESIDENCE: 'RESIDENCE',
  PARTNER: 'PARTNER',
}
```

### Form Status
```typescript
FORM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}
```

### Cloudinary Folders
```typescript
CLOUDINARY_FOLDERS = {
  EQUIVALENCE: 'forms/equivalence',
  RESIDENCE: 'forms/residence',
}
```

### File Upload Configuration
```typescript
FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  UPLOAD_DIRECTORY: './uploads/forms',
}
```

### Client Update Fields Mapping
```typescript
CLIENT_UPDATE_FIELDS = {
  EQUIVALENCE: {
    FLAG: 'isSendingFormulaireEquivalence',
    STATUS: 'equivalenceStatus',
    REJECTED_AT: 'equivalenceRejectedAt',
    REJECTION_REASON: 'equivalenceRejectionReason',
    FOLDER: 'folderEquivalence',
  },
  // Similar for RESIDENCE and PARTNER
}
```

## Form Data Structures

### Equivalence Form
```typescript
{
  prenom: string
  nom: string
  adresse: string
  codePostal: string
  niveau: string
  universite: string
  titreLicence: string
  titreMaster?: string
  anneeDebut: string
  anneeObtentionLicence: string
  anneeObtentionMaster?: string
  email: string
  telephone: string
  portfolio?: File
}
```

### Residence Form
```typescript
{
  nomComplet: string
  dateNaissance: string
  paysResidence: string
  programme: string
  numeroDossier: string
  etape: string
  diplome?: string           // New: Diploma/degree
  anneesEtudes?: string      // New: Years of study
  anneesExperience?: string  // New: Years of experience
  situationFamiliale?: string // New: Family situation
  fileUpload?: File
}
```

### Partner Form
```typescript
{
  agencyName: string
  managerName: string
  email: string
  phone: string
  address?: string
  city?: string
  clientCount?: string
  message?: string
}
```

## Response Format

### Success Response
```typescript
{
  success: true,
  message: string,  // Form-specific success message
  formId: string,   // Generated form ID (e.g., "EQUIV-1703012345678")
  status: 'pending'
}
```

## Database Persistence

Forms are stored in the `formSubmission` table with:
- `clientId` - Associated client (if authenticated)
- `type` - Form type (EQUIVALENCE, RESIDENCE, PARTNER)
- `data` - JSON object with form data
- `fileUrl` - Cloudinary URL (if file uploaded)
- `createdAt` - Submission timestamp
- `updatedAt` - Last update timestamp

## Client Status Updates

When a form is submitted by an authenticated client:

1. **Flag Field**: Set to `true` (e.g., `isSendingFormulaireEquivalence`)
2. **Status Field**: Set to `'pending'` (e.g., `equivalenceStatus`)
3. **Rejection Fields**: Cleared (`rejectedAt`, `rejectionReason`)
4. **Folder Field**: Saved with Cloudinary URL (if file uploaded)

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
✅ Each helper file has one focused responsibility:
- `file-upload.helper.ts` - Only handles file uploads
- `form-data.helper.ts` - Only creates form data objects
- `client-update.helper.ts` - Only updates client status
- `response.helper.ts` - Only formats responses

✅ Service methods are focused on orchestration
✅ Controller methods only handle HTTP concerns

### Open/Closed Principle (OCP)
✅ Helper functions can be extended without modifying existing code
✅ Constants allow configuration changes without code modifications
✅ New form types can be added by extending helpers

### Liskov Substitution Principle (LSP)
✅ Interfaces ensure consistent contracts
✅ All form submission methods return `FormSubmissionResponse`
✅ Helper functions can be replaced with compatible implementations

### Interface Segregation Principle (ISP)
✅ Small, focused interfaces for specific purposes
✅ Separate DTOs for each form type
✅ Separate data interfaces for each form type

### Dependency Inversion Principle (DIP)
✅ Service depends on abstractions (PrismaService, CloudinaryService)
✅ Helper functions are pure with minimal dependencies
✅ Easy to test with mocked dependencies

## Error Handling

### File Upload Failures
- Logs error but continues processing
- Form submission succeeds even if file upload fails
- Client can resubmit file later

### Database Failures
- Logs warning but doesn't throw exception
- Returns success response to client
- Manual intervention may be needed

### Client Update Failures
- Catches and logs errors
- Doesn't block form submission
- Client status can be updated manually

## Logging

Comprehensive logging with emoji indicators:
- 📝 Form submission
- 📁 File upload success
- ❌ File upload failure
- ✅ Database persistence success
- 📂 Folder URL saved
- ⚠️ Database save failure

## File Upload Flow

1. **Receive File**: Multer stores file in `./uploads/forms`
2. **Upload to Cloudinary**: Helper uploads to appropriate folder
3. **Get URL**: Cloudinary returns secure URL
4. **Save URL**: Store in database and client record
5. **Cleanup**: Local file can be deleted (handled by multer)

## Best Practices

1. **Type Safety**: Full TypeScript coverage with interfaces
2. **Error Handling**: Graceful degradation on failures
3. **Logging**: Comprehensive logging for debugging
4. **Validation**: DTOs with class-validator decorators
5. **Security**: JWT authentication required
6. **Separation**: Clear separation of concerns
7. **Documentation**: JSDoc comments on all public methods
8. **Constants**: Centralized configuration

## Testing

All service methods are tested with 13 passing unit tests:

```bash
npm test -- forms.service.spec.ts
```

### Test Coverage

**Equivalence Form Tests:**
- ✓ Submit with file upload
- ✓ Submit without file
- ✓ Submit without client ID

**Residence Form Tests:**
- ✓ Submit with file upload
- ✓ Submit without file

**Partner Form Tests:**
- ✓ Submit with client ID
- ✓ Submit without client ID

**Form Retrieval Tests:**
- ✓ Get all forms with client information
- ✓ Handle database errors gracefully
- ✓ Get form by ID with client information
- ✓ Return null when form not found
- ✓ Handle database errors in getFormById

**Test Results:** 13/13 passing ✅

## Future Enhancements

- [ ] Add file size validation
- [ ] Add file type validation
- [ ] Add form status update endpoint
- [ ] Add form deletion endpoint
- [ ] Add email notifications on submission
- [ ] Add admin form review/approval workflow
- [ ] Add form submission history
- [ ] Add form analytics
- [ ] Add bulk form operations
- [ ] Add form export functionality
