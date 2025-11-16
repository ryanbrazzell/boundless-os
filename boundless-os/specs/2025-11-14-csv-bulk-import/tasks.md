# Task Breakdown: CSV Bulk Import

## Overview
Total Tasks: 12

## Task List

### API Layer

#### Task Group 1: CSV Import API Endpoint
**Dependencies:** Database Schema spec (Users, Clients, Pairings tables), Authentication spec

- [x] 1.0 Create CSV import API endpoint
  - [x] 1.1 Write 2-8 focused tests for CSV import endpoint
    - Test CSV parsing
    - Test row validation
    - Test bulk creation
    - Limit to 2-8 highly focused tests maximum (11 tests)
  - [x] 1.2 Create CSV import endpoint (Hono)
    - POST /api/pairings/import
    - Accept CSV file (multipart/form-data)
    - Parse CSV file
    - Validate each row
    - Create EAs, clients, pairings in bulk
    - Return import results (success count, errors)
    - Authorization: SUPER_ADMIN, Head of Client Success only
  - [x] 1.3 Implement CSV parsing logic
    - Parse CSV file (custom parser)
    - Handle quoted fields, commas in text, UTF-8 encoding
    - Validate file size (5MB max, 1000 rows max)
    - Return parsed rows array
  - [x] 1.4 Implement row validation logic
    - Validate EA Email (exists or will create)
    - Validate EA Name (required)
    - Validate Client Name (exists or will create)
    - Validate Start Date (YYYY-MM-DD format)
    - Validate Accelerator Enabled (Y/N)
    - Validate Week Goals (if accelerator enabled)
    - Return validation errors per row
  - [x] 1.5 Implement bulk creation logic
    - Create EAs if email doesn't exist (with EA role)
    - Create clients if name doesn't exist
    - Create pairings with all fields
    - Process rows sequentially (transaction handling)
  - [x] 1.6 Ensure CSV import API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify CSV parsing works
    - Verify validation works
    - Verify bulk creation works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- CSV parsing works
- Row validation works
- Bulk creation works

### Frontend Components

#### Task Group 2: CSV Import UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create CSV import UI components
  - [ ] 2.1 Write 2-8 focused tests for CSV import UI
    - Test file upload
    - Test preview display
    - Test import execution
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create CSV import page component (TanStack Router)
    - Route: /admin/pairings/import
    - Protected route (SUPER_ADMIN, Head of Client Success only)
    - Import interface layout
  - [ ] 2.3 Create file upload component
    - Drag-and-drop or file picker
    - Accept .csv files only
    - Show file name after selection
    - File size validation
    - Use ShadcnUI file upload component or custom
  - [ ] 2.4 Create CSV preview component
    - Display parsed CSV data in table
    - Show first 10-20 rows as preview
    - Highlight validation errors in preview
    - Show validation results (X valid, Y invalid)
    - Use ShadcnUI Table component
  - [ ] 2.5 Create import results display component
    - Success summary (pairings created, EAs created, clients created)
    - Error summary (rows skipped, error messages)
    - Created items list (link to view pairings)
    - Download error report button (CSV with failed rows)
  - [ ] 2.6 Implement import execution
    - "Import" button (disabled until file selected and validated)
    - Show loading state during import
    - Handle import results
    - Display success/error messages
  - [ ] 2.7 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.8 Ensure CSV import UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify file upload works
    - Verify preview works
    - Verify import works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- File upload works
- CSV preview works
- Import execution works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for CSV import only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end file upload → validation → import flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: upload CSV → validate → import → view results
    - Test error handling
  - [ ] 3.4 Run CSV import tests only
    - Run ONLY tests related to CSV import (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All CSV import tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Error handling tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. CSV Import API Endpoint (Task Group 1)
2. CSV Import UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

