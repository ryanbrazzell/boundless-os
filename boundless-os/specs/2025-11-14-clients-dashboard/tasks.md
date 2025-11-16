# Task Breakdown: Clients Dashboard

## Overview
Total Tasks: 11

## Task List

### API Layer

#### Task Group 1: Clients Dashboard API Endpoints
**Dependencies:** Database Schema spec (Clients, Pairings, Alerts tables), Health Scoring System spec

- [x] 1.0 Create clients dashboard API endpoints
  - [x] 1.1 Write 2-8 focused tests for clients dashboard endpoints
    - Test clients list retrieval
    - Test client health calculation
    - Test alert count aggregation
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create clients list endpoint (Hono)
    - GET /api/dashboard/clients
    - Return list of all clients with aggregated data
    - Include: clientId, name, healthStatus (worst pairing health), activeAlertsCount, pairingsCount, lastReportDate
    - Calculate health from worst pairing health status
    - Calculate alert count from all pairings
    - Authorization: Head of Client Success, SUPER_ADMIN only
  - [x] 1.3 Create client detail endpoint (Hono)
    - GET /api/dashboard/clients/:clientId
    - Return client details with all pairings
    - Include: client info, pairings list with health status, active alerts per pairing, recent activity
    - Authorization: Head of Client Success, SUPER_ADMIN only
  - [x] 1.4 Integrate with Health Scoring System
    - Call health scoring API for each pairing
    - Aggregate to calculate client health (worst pairing health)
    - Cache health calculations if needed (using pairing healthStatus field)
  - [x] 1.5 Ensure clients dashboard API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify clients list works
    - Verify health calculation works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Clients list endpoint works
- Client health calculation works
- Alert count aggregation works

### Frontend Components

#### Task Group 2: Clients Dashboard UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create clients dashboard UI components
  - [ ] 2.1 Write 2-8 focused tests for clients dashboard UI
    - Test clients list displays
    - Test filtering works
    - Test client detail view
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create clients dashboard page component (TanStack Router)
    - Route: /dashboard/clients
    - Protected route (Head of Client Success, SUPER_ADMIN only)
    - Dashboard layout
  - [ ] 2.3 Create clients list component
    - Table/card list showing all clients
    - Columns: Client name, Health indicator (🟢🟡🔴), Active alerts count, Pairings count, Last report date
    - Sortable columns
    - Click row/card to navigate to detail view
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create filtering component
    - "Show only clients with issues" toggle
    - Filter by health status (RED/YELLOW)
    - Filter state management
    - Clear filters button
  - [ ] 2.5 Create client detail view component
    - Display client information
    - Show all pairings with health status
    - Show active alerts per pairing
    - Navigate to pairing detail pages
  - [ ] 2.6 Implement data fetching (TanStack Query)
    - Fetch clients list
    - Fetch client detail
    - Handle loading and error states
  - [ ] 2.7 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.8 Ensure clients dashboard UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify list displays correctly
    - Verify filtering works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Clients list displays correctly
- Filtering works
- Client detail view works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for clients dashboard only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end dashboard load → filter → detail flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: load dashboard → filter → view detail
    - Test health calculation aggregation
  - [ ] 3.4 Run clients dashboard tests only
    - Run ONLY tests related to clients dashboard (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All clients dashboard tests pass (approximately 14-26 tests total)
- Critical workflows covered
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Clients Dashboard API Endpoints (Task Group 1)
2. Clients Dashboard UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

