# Spec Requirements: CSV Bulk Import

## Initial Description
Import pairings from CSV with validation (EA email/name, client name, start date, accelerator settings, goals), error handling, and bulk creation.

## Requirements Discussion

### CSV Format
Expected CSV columns:
- EA Email (required)
- EA Name (required)
- Client Name (required)
- Start Date (required, format: YYYY-MM-DD)
- Accelerator Enabled (Y/N, optional)
- Week 1 Goals (optional, if accelerator enabled)
- Week 2 Goals (optional, if accelerator enabled)
- Week 3 Goals (optional, if accelerator enabled)
- Week 4 Goals (optional, if accelerator enabled)

### Import Interface
- File upload component
- CSV file selection
- Preview of data before import
- Validation results display
- Import button

### Validation
- Validate each row:
  - EA Email: Must exist in Users table (EA role) or create new EA
  - EA Name: Required
  - Client Name: Must exist in Clients table or create new client
  - Start Date: Valid date format
  - Accelerator fields: Valid if accelerator enabled
- Show validation errors per row
- Highlight invalid rows

### Error Handling
- Display validation errors clearly
- Show which rows failed and why
- Allow partial import (valid rows only) or require all valid
- Show summary: X successful, Y failed

### Bulk Creation
- Create pairings for valid rows
- Create EAs if email doesn't exist (with EA role)
- Create clients if name doesn't exist
- Set accelerator settings if specified
- Set weekly goals if accelerator enabled

### Import Results
- Show import summary
- List created pairings
- List errors (if any)
- Option to download error report

### Access Control
- SUPER_ADMIN can import
- Head of Client Success can import (if needed)
- Other roles cannot import

## Requirements Summary

### Functional Requirements
- CSV file upload
- Data validation
- Preview before import
- Error handling
- Bulk creation
- Import results display

### Scope Boundaries
**In Scope:**
- CSV import
- Validation
- Bulk creation
- Error reporting

**Out of Scope:**
- Excel file import (CSV only)
- Template download (future feature)
- Scheduled imports (future feature)

### Technical Considerations
- CSV parsing library
- File upload component
- Validation logic
- Database bulk insert
- Error reporting

