# Task Breakdown: Report History & Analytics

## Overview
Total Tasks: 12

## Task List

### API Layer

#### Task Group 1: Report History and Analytics API Endpoints
**Dependencies:** Database Schema spec (EndOfDayReports table), Report Submission spec

- [x] 1.0 Create report history and analytics API endpoints
  - [x] 1.1 Write 2-8 focused tests for report history and analytics endpoints
    - Test report history retrieval
    - Test analytics trends calculation
    - Test filtering and pagination
    - Limit to 2-8 highly focused tests maximum (9 tests)
  - [x] 1.2 Create report history endpoint (Hono)
    - GET /api/reports/history
    - Query params: eaId (required for EA), limit (default 30), offset (default 0), startDate, endDate, pairingId
    - Return EA's own reports (last 30 days by default)
    - Include: reportId, reportDate, clientName, summary fields (workloadFeeling, workType, biggestWin preview)
    - Support pagination
    - Authorization: EA can view own reports, Admins can view all (already implemented)
  - [x] 1.3 Create report detail endpoint (Hono)
    - GET /api/reports/:reportId
    - Return full report with all 10 fields
    - Include pairing and EA information
    - Authorization: EA can view own reports, Admins can view all (already implemented)
  - [x] 1.4 Create analytics trends endpoint (Hono)
    - GET /api/analytics/trends
    - Query params: eaId, clientId, pairingId, period (7d, 30d, 90d, custom)
    - Calculate: Report submission rates, Workload distribution, Mood distribution, Daily sync frequency, Win reporting frequency
    - Return aggregated data for charts
    - Authorization: Admin roles only
  - [x] 1.5 Implement analytics calculations
    - Calculate report submission rates over time
    - Calculate workload distribution (Light, Moderate, Heavy, Overwhelming)
    - Calculate mood distribution (Great, Good, Okay, Stressed)
    - Calculate daily sync frequency (% with hadDailySync=true)
    - Calculate win reporting frequency (% with non-empty biggestWin)
  - [x] 1.6 Ensure report history and analytics API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify report history works
    - Verify analytics calculations work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Report history endpoint works
- Analytics trends endpoint works
- Calculations are accurate

### Frontend Components

#### Task Group 2: Report History and Analytics UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create report history and analytics UI components
  - [ ] 2.1 Write 2-8 focused tests for report history and analytics UI
    - Test report history list displays
    - Test analytics charts render
    - Test filtering works
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create report history page component (TanStack Router)
    - Route: /reports/history
    - Protected route (EA role for own reports, Admin roles for all)
    - History list layout
  - [ ] 2.3 Create report history list component
    - Display list of reports (last 30 days)
    - Show: Date, Client name, Summary fields (workloadFeeling, workType, biggestWin preview)
    - Click report to view detail
    - Support pagination (load more or page navigation)
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create report detail view component
    - Display full report with all 10 fields
    - Show pairing and EA information
    - Read-only display
    - Close/back button
  - [ ] 2.5 Create analytics dashboard component (admin)
    - Overview metrics cards (total reports, average per EA, workload distribution, mood distribution, daily sync rate)
    - Time period selector (7 days, 30 days, 90 days, custom)
    - Charts section (workload trend, mood trend, submission trend)
    - Filter by EA, Client, Pairing (optional)
    - Use Recharts for charts (LineChart, PieChart, BarChart)
  - [ ] 2.6 Create filtering components
    - Date range picker
    - Client/pairing dropdown
    - Clear filters button
  - [ ] 2.7 Implement data fetching (TanStack Query)
    - Fetch report history
    - Fetch analytics trends
    - Handle loading and error states
    - Support pagination
  - [ ] 2.8 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
    - Charts are responsive
  - [ ] 2.9 Ensure report history and analytics UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify history list works
    - Verify analytics charts work
    - Verify filtering works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Report history displays correctly
- Analytics charts render correctly
- Filtering works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for report history and analytics only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end history → detail → analytics flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: view history → view detail → view analytics
    - Test analytics calculations accuracy
  - [ ] 3.4 Run report history and analytics tests only
    - Run ONLY tests related to report history and analytics (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All report history and analytics tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Analytics calculations tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Report History and Analytics API Endpoints (Task Group 1)
2. Report History and Analytics UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

