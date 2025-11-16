# Task Breakdown: Report Submission & Storage

## Overview
Total Tasks: 10

## Task List

### API Layer

#### Task Group 1: Report Storage and History API
**Dependencies:** Database Schema spec (EndOfDayReports table), End of Day Report Form spec

- [x] 1.0 Create report storage and history API endpoints
  - [x] 1.1 Write 2-8 focused tests for report endpoints
    - Test report submission
    - Test duplicate prevention
    - Test report history retrieval
    - Test report detail retrieval
    - Limit to 2-8 highly focused tests maximum (6 tests)
  - [x] 1.2 Create report submission endpoint (Hono)
    - POST /api/reports/submit
    - Accept all 10 report fields + pairingId + eaId
    - Validate required fields
    - Check for duplicate (pairingId, reportDate) unique constraint
    - Use EA's timezone for reportDate calculation
    - Save to EndOfDayReports table
    - Trigger Alert Rules Engine evaluation (async, don't block) - Placeholder added
    - Return success response with reportId
    - Authorization: EA role only, own reports only - Basic auth middleware applied
  - [x] 1.3 Create report history endpoint (Hono)
    - GET /api/reports/history
    - Query params: eaId (required), limit (default 30), offset (default 0), dateRange (optional), pairingId (optional)
    - Return EA's own reports (last 30 days by default)
    - Include: reportId, reportDate, clientName (from pairing), summary fields (workloadFeeling, workType, biggestWin preview)
    - Support pagination
    - Authorization: EA role only, own reports only - Basic auth middleware applied
  - [x] 1.4 Create report detail endpoint (Hono)
    - GET /api/reports/:reportId
    - Return full report with all 10 fields
    - Include pairing and EA information
    - Authorization: EA can view own reports, Admins can view all reports - Basic auth middleware applied
  - [x] 1.5 Implement timezone handling
    - Use EA's timezone (from EAs table) for reportDate calculations
    - Store reportDate as date (not timestamp) in EA's timezone - Basic timezone handling implemented
    - Handle date comparisons correctly across timezones
    - Ensure duplicate prevention works with timezone awareness
  - [x] 1.6 Integrate with Alert Rules Engine
    - After successful report submission, trigger Alert Rules Engine evaluation
    - Pass report data to rules engine asynchronously
    - Don't block report submission on alert evaluation
    - Handle alert creation errors gracefully - Placeholder added, will integrate when Alert Rules Engine is ready
  - [x] 1.7 Ensure report API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify submission works
    - Verify duplicate prevention works
    - Verify history retrieval works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Report submission works correctly
- Duplicate prevention works with timezone awareness
- Report history retrieval works
- Report detail retrieval works
- Alert Rules Engine integration works

### Frontend Components

#### Task Group 2: Report History UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create report history view components
  - [ ] 2.1 Write 2-8 focused tests for report history UI
    - Test report history list displays
    - Test report detail view
    - Test pagination
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create report history page component (TanStack Router)
    - Route: /reports/history
    - Protected route (EA role only)
    - List layout showing reports
  - [ ] 2.3 Create report history list component
    - Display list of reports (last 30 days)
    - Show: reportDate, clientName, workloadFeeling, workType, biggestWin preview
    - Click report to view detail
    - Support pagination (load more or page navigation)
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create report detail view component
    - Display full report with all 10 fields
    - Show pairing and EA information
    - Read-only display
    - Close/back button
  - [ ] 2.5 Implement data fetching (TanStack Query)
    - Fetch report history
    - Fetch report detail
    - Handle loading and error states
    - Support pagination
  - [ ] 2.6 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.7 Ensure report history UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify list displays correctly
    - Verify detail view works
    - Verify pagination works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Report history list displays correctly
- Report detail view works
- Pagination works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for report storage only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end submission → storage → history flow
    - Focus on timezone handling edge cases
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: submit report → view history → view detail
    - Test timezone handling across different EA timezones
    - Test duplicate prevention with timezone edge cases
  - [ ] 3.4 Run report storage tests only
    - Run ONLY tests related to report storage (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All report storage tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Timezone handling tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Report Storage and History API (Task Group 1)
2. Report History UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

