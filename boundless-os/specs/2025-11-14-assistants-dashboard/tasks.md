# Task Breakdown: Assistants Dashboard

## Overview
Total Tasks: 13

## Task List

### API Layer

#### Task Group 1: Assistants Dashboard API Endpoints
**Dependencies:** Database Schema spec (Users, Pairings, Alerts, StartOfDayLogs, EndOfDayReports, PTORecords tables)

- [x] 1.0 Create assistants dashboard API endpoints
  - [x] 1.1 Write 2-8 focused tests for assistants dashboard endpoints
    - Test EA list retrieval
    - Test attendance calculation
    - Test report submission consistency calculation
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create EAs list endpoint (Hono)
    - GET /api/dashboard/assistants
    - Return list of all EA users with aggregated metrics
    - Include: eaId, name, recentAlertsCount (last 7 days), attendanceStatus, reportSubmissionRate (%), healthIndicator
    - Calculate attendance from StartOfDayLogs (last 30 days)
    - Calculate submission rate from EndOfDayReports (last 30 days)
    - Check OOO status from PTORecords
    - Authorization: Head of EAs, SUPER_ADMIN only
  - [x] 1.3 Create EA profile endpoint (Hono)
    - GET /api/dashboard/assistants/:eaId
    - Return full EA profile with all data
    - Include: EA info, pairings list, attendance history, report submission history, recent alerts, coaching notes, PTO records
    - Authorization: Head of EAs, SUPER_ADMIN only
  - [x] 1.4 Implement attendance calculation logic
    - Query StartOfDayLogs for last 30 days
    - Count on-time vs late logs
    - Check PTORecords for active OOO
    - Return status: On-time, Late (X times), OOO
  - [x] 1.5 Implement report submission consistency calculation
    - Calculate expected reports (business days in 30-day period)
    - Count actual reports from EndOfDayReports
    - Calculate percentage: (actual / expected) * 100
    - Return percentage and status
  - [x] 1.6 Ensure assistants dashboard API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify EA list works
    - Verify attendance calculation works
    - Verify submission rate calculation works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- EAs list endpoint works
- Attendance calculation works
- Report submission consistency calculation works

### Frontend Components

#### Task Group 2: Assistants Dashboard UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create assistants dashboard UI components
  - [ ] 2.1 Write 2-8 focused tests for assistants dashboard UI
    - Test EA list displays
    - Test filtering works
    - Test EA profile view
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create assistants dashboard page component (TanStack Router)
    - Route: /dashboard/assistants
    - Protected route (Head of EAs, SUPER_ADMIN only)
    - Dashboard layout
  - [ ] 2.3 Create EAs list component
    - Table/card list showing all EAs
    - Columns: EA name, Recent alerts count, Attendance status, Report submission consistency (%), Health indicator
    - Sortable columns
    - Click row/card to navigate to EA profile
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create filtering component
    - "Show only EAs with issues" toggle
    - Filter by alerts, submission rate, attendance, health status
    - Multiple filters can be combined
    - Clear filters button
  - [ ] 2.5 Create EA profile view component
    - Display EA information
    - Show all pairings with health status
    - Show attendance history (last 30 days)
    - Show report submission history (last 30 days)
    - Show recent alerts (last 7 days)
    - Show coaching notes (EA-level, editable for admins)
    - Show PTO records (list, add/edit)
    - Management actions: Set coaching notes, Mark Out of Office
  - [ ] 2.6 Implement data fetching (TanStack Query)
    - Fetch EAs list
    - Fetch EA profile
    - Handle loading and error states
  - [ ] 2.7 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.8 Ensure assistants dashboard UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify list displays correctly
    - Verify filtering works
    - Verify EA profile works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- EAs list displays correctly
- Filtering works
- EA profile view works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for assistants dashboard only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end dashboard load → filter → profile flow
    - Focus on metric calculations
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: load dashboard → filter → view profile
    - Test attendance and submission rate calculations
  - [ ] 3.4 Run assistants dashboard tests only
    - Run ONLY tests related to assistants dashboard (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All assistants dashboard tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Metric calculations tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Assistants Dashboard API Endpoints (Task Group 1)
2. Assistants Dashboard UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

