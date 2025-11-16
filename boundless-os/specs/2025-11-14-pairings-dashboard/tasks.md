# Task Breakdown: Pairings Dashboard

## Overview
Total Tasks: 12

## Task List

### API Layer

#### Task Group 1: Pairings Dashboard API Endpoints
**Dependencies:** Database Schema spec (Pairings, Alerts, EndOfDayReports tables), Health Scoring System spec

- [x] 1.0 Create pairings dashboard API endpoints
  - [x] 1.1 Write 2-8 focused tests for pairings dashboard endpoints
    - Test pairings list retrieval
    - Test health status override
    - Test filtering
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create pairings list endpoint (Hono)
    - GET /api/dashboard/pairings
    - Return list of all pairings with aggregated data
    - Include: pairingId, eaName, clientName, healthStatus, healthStatusOverride, lastReportDate, acceleratorStatus, activeAlertsCount
    - Calculate health from Health Scoring System
    - Support filters: healthStatus, eaId, clientId, acceleratorStatus, hasAlerts (query params)
    - Authorization: Head of Client Success, Head of EAs, SUPER_ADMIN only
  - [x] 1.3 Create pairing detail endpoint (Hono)
    - GET /api/dashboard/pairings/:pairingId
    - Return full pairing details
    - Include: pairing info, health status, recent reports, active alerts, accelerator progress, coaching notes
    - Authorization: Head of Client Success, Head of EAs, SUPER_ADMIN only
  - [x] 1.4 Create health status override endpoint (Hono)
    - PATCH /api/dashboard/pairings/:pairingId/health-status
    - Accept: healthStatusOverride (boolean), manualHealthStatus (optional enum)
    - Update Pairings table
    - Authorization: Head of Client Success, Head of EAs, SUPER_ADMIN only
  - [x] 1.5 Integrate with Health Scoring System
    - Call health scoring API for each pairing
    - Support manual override
    - Cache health calculations if needed (using pairing healthStatus field)
  - [x] 1.6 Ensure pairings dashboard API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify pairings list works
    - Verify health override works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Pairings list endpoint works
- Health status override works
- Filtering works

### Frontend Components

#### Task Group 2: Pairings Dashboard UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create pairings dashboard UI components
  - [ ] 2.1 Write 2-8 focused tests for pairings dashboard UI
    - Test pairings list displays
    - Test health override toggle
    - Test filtering works
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create pairings dashboard page component (TanStack Router)
    - Route: /dashboard/pairings
    - Protected route (Head of Client Success, Head of EAs, SUPER_ADMIN only)
    - Dashboard layout
  - [ ] 2.3 Create pairings list component
    - Table/card list showing all pairings
    - Columns: EA name, Client name, Health status (🟢🟡🔴), Override indicator, Last report date, Accelerator status, Active alerts count
    - Sortable columns
    - Click row/card to navigate to detail view
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create health override component
    - Quick toggle/button in list view
    - Modal or inline editor for override
    - Select health status (Green/Yellow/Red)
    - Toggle override on/off
    - Clear override button
  - [ ] 2.5 Create filtering component
    - Filter by health status, EA, Client, accelerator status, alerts
    - Multiple filters can be active
    - Filter state persists
    - Clear filters button
  - [ ] 2.6 Create pairing detail view component
    - Display full pairing information
    - Health status with override controls
    - Recent reports list
    - Active alerts list
    - Accelerator progress and goals
    - Coaching notes (editable)
  - [ ] 2.7 Implement data fetching (TanStack Query)
    - Fetch pairings list
    - Fetch pairing detail
    - Handle loading and error states
  - [ ] 2.8 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.9 Ensure pairings dashboard UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify list displays correctly
    - Verify override works
    - Verify filtering works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Pairings list displays correctly
- Health override works
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
  - [ ] 3.2 Analyze test coverage gaps for pairings dashboard only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end dashboard load → override → detail flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: load dashboard → override health → view detail
    - Test filtering combinations
  - [ ] 3.4 Run pairings dashboard tests only
    - Run ONLY tests related to pairings dashboard (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All pairings dashboard tests pass (approximately 14-26 tests total)
- Critical workflows covered
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Pairings Dashboard API Endpoints (Task Group 1)
2. Pairings Dashboard UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

