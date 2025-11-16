# Task Breakdown: PTO/Out of Office Management

## Overview
Total Tasks: 11

## Task List

### API Layer

#### Task Group 1: PTO Management API Endpoints
**Dependencies:** Database Schema spec (PTORecords table), Start of Day Tracking spec, Alert Rules Engine spec

- [x] 1.0 Create PTO management API endpoints
  - [x] 1.1 Write 2-8 focused tests for PTO endpoints
    - Test PTO record creation
    - Test active PTO check
    - Test alert suppression logic
    - Limit to 2-8 highly focused tests maximum (9 tests)
  - [x] 1.2 Create PTO list endpoint (Hono)
    - GET /api/pto
    - Return list of PTO records
    - Support filters: eaId, dateRange, reason, status (query params)
    - Authorization: Admin roles only
  - [x] 1.3 Create PTO creation endpoint (Hono)
    - POST /api/pto
    - Accept: eaId, startDate, endDate, reason
    - Validate: startDate <= endDate
    - Create PTORecords record
    - Authorization: Admin roles only
  - [x] 1.4 Create PTO update endpoint (Hono)
    - PUT /api/pto/:ptoId
    - Accept: startDate, endDate, reason
    - Update PTORecords record
    - Authorization: Admin roles only
  - [x] 1.5 Create PTO deletion endpoint (Hono)
    - DELETE /api/pto/:ptoId
    - Delete PTORecords record
    - Authorization: Admin roles only
  - [x] 1.6 Create active PTO check function
    - Function to check if EA has active PTO
    - Query PTORecords where eaId matches and current date between startDate and endDate
    - Use efficient query with index
    - Handle timezone correctly (basic implementation)
  - [x] 1.7 Integrate alert suppression logic
    - Update Start of Day Tracking to check active PTO before creating late alerts
    - Update Alert Rules Engine to check active PTO before creating missing report alerts
    - Suppress alerts if active PTO exists
  - [x] 1.8 Ensure PTO API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify PTO CRUD works
    - Verify active PTO check works
    - Verify alert suppression works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- PTO CRUD operations work
- Active PTO check works
- Alert suppression works

### Frontend Components

#### Task Group 2: PTO Management UI Components
**Dependencies:** Task Group 1, Assistants Dashboard spec

- [ ] 2.0 Create PTO management UI components
  - [ ] 2.1 Write 2-8 focused tests for PTO UI
    - Test PTO list displays
    - Test PTO creation form
    - Test OOO indicators
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create PTO list component
    - Table/card list showing all PTO records
    - Columns: EA name, date range, reason, status (active/upcoming/past)
    - Filter by EA, date range, reason, status
    - Use ShadcnUI Table or Card components
  - [ ] 2.3 Create PTO creation form component
    - Fields: EA dropdown, Start Date picker, End Date picker, Reason dropdown
    - Form validation
    - Submit handler
    - Use ShadcnUI Form, Input, Select, DatePicker components
  - [ ] 2.4 Create OOO indicators component
    - Badge/indicator for OOO status
    - Display on Assistants Dashboard (next to EA name)
    - Display on Pairings Dashboard (if EA is OOO)
    - Display on EA Dashboard (optional banner)
    - Use ShadcnUI Badge component
  - [ ] 2.5 Integrate with EA Profile page
    - Show PTO records list
    - Add/edit/delete PTO records
  - [ ] 2.6 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.7 Ensure PTO UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify PTO list works
    - Verify PTO creation works
    - Verify OOO indicators work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- PTO list displays correctly
- PTO creation works
- OOO indicators work
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for PTO management only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end PTO creation → alert suppression flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: create PTO → verify alert suppression → verify OOO indicators
  - [ ] 3.4 Run PTO management tests only
    - Run ONLY tests related to PTO management (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All PTO management tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Alert suppression tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. PTO Management API Endpoints (Task Group 1)
2. PTO Management UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

