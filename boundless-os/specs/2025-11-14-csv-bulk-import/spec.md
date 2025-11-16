# Specification: CSV Bulk Import

## Goal
Enable admins to import multiple EA-Client pairings from CSV file with validation, error handling, and bulk creation support.

## User Stories
- As Head of Client Success, I want to import multiple pairings at once so that I can onboard many relationships quickly
- As an admin, I want validation before import so that I catch errors before creating data
- As an admin, I want to see import results so that I know what was created and what failed

## Specific Requirements

**CSV Format Specification**
- Expected columns: EA Email (required), EA Name (required), Client Name (required), Start Date (required, format: YYYY-MM-DD), Accelerator Enabled (Y/N, optional), Week 1 Goals (optional), Week 2 Goals (optional), Week 3 Goals (optional), Week 4 Goals (optional)
- CSV parsing: Handle CSV format with headers, Support quoted fields, Handle commas in text fields, Support UTF-8 encoding
- File size limit: Reasonable limit (e.g., 5MB, 1000 rows max)

**Import Interface**
- File upload component: Drag-and-drop or file picker, Accept .csv files only, Show file name after selection
- Preview section: Display parsed CSV data in table format, Show first 10-20 rows as preview, Highlight any validation errors in preview
- Validation results: Display validation errors per row, Show which rows are valid/invalid, Count: X valid, Y invalid
- Import button: Disabled until file selected and validated, Show loading state during import

**Row-Level Validation**
- Validate each row before import:
  - EA Email: Must exist in Users table (role=EA) OR create new EA user (with EA role, email verification required)
  - EA Name: Required, non-empty string
  - Client Name: Must exist in Clients table OR create new client
  - Start Date: Valid date format (YYYY-MM-DD), Valid date (not future dates if validation needed)
  - Accelerator Enabled: Valid value (Y/N, case-insensitive), If Y: Validate Week 1-4 Goals are provided (optional validation)
- Show validation errors: Row number, Field name, Error message, Highlight invalid rows in preview

**Error Handling**
- Display validation errors clearly: List all errors per row, Show row number and field, Explain what's wrong
- Import options: "Import valid rows only" (partial import), "Require all rows valid" (all-or-nothing), Default: Import valid rows only
- Show import summary: X pairings created successfully, Y rows skipped (with reasons), Z errors encountered
- Error report: Option to download CSV with errors (rows that failed with error messages)

**Bulk Creation Logic**
- Process valid rows: Create EAs if email doesn't exist (with EA role, name from CSV, send email verification), Create clients if name doesn't exist, Create pairings with all fields (EA, Client, Start Date, Accelerator settings, Goals)
- Transaction handling: Use database transactions for atomicity, Rollback if critical error occurs, Handle partial success gracefully
- Performance: Batch inserts for efficiency, Process in chunks if large file (100 rows at a time)

**Import Results Display**
- Success summary: Number of pairings created, Number of EAs created (if any), Number of clients created (if any)
- Error summary: Number of rows skipped, List of errors (row number, error message)
- Created items list: Show created pairings (EA-Client pairs), Link to view created pairings
- Download error report: CSV file with failed rows and error messages

**Access Control**
- SUPER_ADMIN can import pairings
- Head of Client Success can import pairings (if needed)
- Other roles cannot import
- Protect import route with role-based middleware

**API Endpoint**
- POST /api/pairings/import
- Accept CSV file (multipart/form-data)
- Validate and parse CSV
- Return validation results (preview)
- Process import and return results
- Handle errors gracefully

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for file upload components and table display patterns.

## Existing Code to Leverage

**File Upload Patterns**
- Use file upload component from ShadcnUI or similar
- Follow file upload best practices (drag-and-drop, file validation)
- Handle file parsing and validation client-side and server-side

**CSV Parsing**
- Use CSV parsing library (e.g., papaparse for frontend, csv-parse for backend)
- Handle edge cases (quoted fields, special characters, encoding)
- Validate data types and formats

## Out of Scope
- Excel file import (CSV only for MVP)
- Template download (future feature - provide CSV template)
- Scheduled imports (future feature - one-time import only)
- Import history/audit (future feature)
- Import rollback (future feature - manual deletion if needed)
- Advanced validation rules (basic validation only)
- Import preview editing (fix CSV and re-upload)
- Multiple file formats (CSV only)

