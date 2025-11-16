# Task Breakdown: Pairing Management

## Overview
Total Tasks: 15

## Task List

### API Layer

#### Task Group 1: Pairing CRUD API Endpoints
**Dependencies:** Database Schema spec (Pairings table)

- [x] 1.0 Create pairing management API endpoints
  - [x] 1.1 Write 2-8 focused tests for pairing endpoints
    - Test pairing creation
    - Test pairing list retrieval
    - Test pairing update
    - Test health status override
    - Limit to 2-8 highly focused tests maximum (7 tests)
  - [x] 1.2 Create pairing creation endpoint (Hono)
    - POST /api/pairings
    - Accept: eaId, clientId, startDate, acceleratorEnabled, weekGoals (if enabled)
    - Validate required fields
    - Check for duplicate (eaId, clientId) unique constraint
    - Create pairing in database
    - Return success response with pairingId
    - Authorization: Admin roles only
  - [x] 1.3 Create pairing list endpoint (Hono)
    - GET /api/pairings
    - Return list of all pairings with EA name, client name, health status, etc.
    - Support filters: eaId, clientId, healthStatus, acceleratorStatus (query params)
    - Support sorting (optional) - Basic filtering implemented
    - Authorization: Admin roles only
  - [x] 1.4 Create pairing detail endpoint (Hono)
    - GET /api/pairings/:pairingId
    - Return full pairing details including recent reports, alerts, accelerator progress
    - Basic pairing data returned - TODO: Include reports/alerts when available
    - Authorization: Admin roles only
  - [x] 1.5 Create pairing update endpoint (Hono)
    - PUT /api/pairings/:pairingId
    - Accept: startDate, acceleratorEnabled, weekGoals, acceleratorWeek
    - Update pairing fields
    - Return updated pairing
    - Authorization: Admin roles only
  - [x] 1.6 Create health status override endpoint (Hono)
    - PATCH /api/pairings/:pairingId/health-status
    - Accept: healthStatusOverride (boolean), manualHealthStatus (enum, optional)
    - Update healthStatusOverride flag
    - If override=true: Set manual health status
    - If override=false: Clear override, return to automatic calculation
    - Authorization: Admin roles only
  - [x] 1.7 Create accelerator week progression endpoint (Hono)
    - PATCH /api/pairings/:pairingId/accelerator-week
    - Accept: acceleratorWeek (1, 2, 3, 4, null for complete)
    - Update acceleratorWeek field
    - Authorization: Admin roles only
  - [x] 1.8 Ensure pairing API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify CRUD operations work
    - Verify authorization enforced
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Pairing CRUD operations work
- Health status override works
- Accelerator week progression works
- Authorization enforced

### Frontend Components

#### Task Group 2: Pairing Management UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create pairing management admin interface
  - [ ] 2.1 Write 2-8 focused tests for pairing UI components
    - Test pairing creation form
    - Test pairing list display
    - Test health status override toggle
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create pairing creation form component
    - Fields: EA dropdown (select from EA users), Client dropdown/select, Start Date (date picker), Accelerator Enabled (checkbox)
    - Conditional fields: Week 1-4 Goals (4 text areas, shown if accelerator enabled)
    - Form validation (React Hook Form + Zod)
    - Submit handler
    - Success/error messages
    - Use ShadcnUI Form, Input, Select, DatePicker, Checkbox, Textarea components
  - [ ] 2.3 Create pairing list component
    - Table or card list showing all pairings
    - Columns/cards: EA name, Client name, Start date, Health status (🟢🟡🔴), Accelerator status, Last report date
    - Sortable columns (optional)
    - Filters: EA, Client, Health status, Accelerator status
    - Click row/card to view detail page
    - Use ShadcnUI Table or Card components
  - [ ] 2.4 Create pairing detail page component
    - Display full pairing information
    - Health status with manual override controls (toggle + status selector)
    - Recent reports list (last 10-20 reports)
    - Active alerts list with details
    - Accelerator progress and goals display
    - Week progression buttons (Week 1 → Week 2 → Week 3 → Week 4 → Complete)
    - Coaching notes (pairing-level) display and edit
    - Edit pairing button
  - [ ] 2.5 Create pairing edit component
    - Edit existing pairing details form
    - Update start date, accelerator enabled, week goals
    - Save changes
  - [ ] 2.6 Implement health status override UI
    - Toggle switch for manual override
    - Status selector (🟢🟡🔴) when override enabled
    - Clear override button
    - Show override indicator when active
  - [ ] 2.7 Implement accelerator week progression UI
    - Display current week (1, 2, 3, 4, or Complete)
    - Week progression buttons
    - Goals display for each week
    - Edit goals functionality
  - [ ] 2.8 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.9 Ensure pairing management UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify forms work correctly
    - Verify list displays correctly
    - Verify override functionality works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Pairing creation form works
- Pairing list displays correctly
- Health status override works
- Accelerator week progression works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for pairing management only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end pairing creation → list → detail flow
    - Focus on health status override workflow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: create pairing → view list → view detail → edit → override health status
    - Test accelerator week progression
    - Test duplicate prevention
  - [ ] 3.4 Run pairing management tests only
    - Run ONLY tests related to pairing management (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All pairing management tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Health status override tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Pairing CRUD API Endpoints (Task Group 1)
2. Pairing Management UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

