# Task Breakdown: Alert Management Kanban

## Overview
Total Tasks: 13

## Task List

### API Layer

#### Task Group 1: Alert Management API Endpoints
**Dependencies:** Database Schema spec (Alerts table)

- [x] 1.0 Create alert management API endpoints
  - [x] 1.1 Write 2-8 focused tests for alert management endpoints
    - Test alert list retrieval
    - Test alert status update
    - Test alert assignment
    - Test alert notes update
    - Limit to 2-8 highly focused tests maximum (7 tests)
  - [x] 1.2 Create alert list endpoint (Hono)
    - GET /api/alerts
    - Return list of alerts with filters
    - Support filters: severity, pairingId, dateRange, assignedTo, status (query params)
    - Include: alertId, pairingId, ruleId, severity, status, assignedTo, detectedAt, EA name, client name
    - Authorization: Admin roles only
  - [x] 1.3 Create alert detail endpoint (Hono)
    - GET /api/alerts/:alertId
    - Return full alert details
    - Include: all alert fields, rule info, pairing info, related reports
    - Authorization: Admin roles only
  - [x] 1.4 Create alert status update endpoint (Hono)
    - PATCH /api/alerts/:alertId/status
    - Accept: status (NEW, INVESTIGATING, WORKING_ON, RESOLVED)
    - Update Alerts.status field
    - Set resolvedAt timestamp when status=RESOLVED
    - Authorization: Admin roles only
  - [x] 1.5 Create alert assignment endpoint (Hono)
    - PATCH /api/alerts/:alertId/assign
    - Accept: assignedTo (userId or null)
    - Update Alerts.assignedTo field
    - Authorization: Admin roles only
  - [x] 1.6 Create alert notes update endpoint (Hono)
    - PATCH /api/alerts/:alertId/notes
    - Accept: notes (text)
    - Update Alerts.notes field
    - Authorization: Admin roles only
  - [x] 1.7 Ensure alert management API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify CRUD operations work
    - Verify authorization enforced
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Alert list endpoint works
- Alert status update works
- Alert assignment works
- Alert notes update works

### Frontend Components

#### Task Group 2: Kanban Board UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create Kanban board interface
  - [ ] 2.1 Write 2-8 focused tests for Kanban board UI
    - Test Kanban board renders
    - Test drag and drop works
    - Test alert detail view
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Install drag-and-drop library
    - Install react-beautiful-dnd or @dnd-kit/core
    - Evaluate both for accessibility
    - Choose library with better keyboard navigation support
  - [ ] 2.3 Create Kanban board page component (TanStack Router)
    - Route: /dashboard/alerts
    - Protected route (Admin roles only)
    - Board layout with 4 columns
  - [ ] 2.4 Create Kanban columns component
    - Four columns: New, Investigating, Working On, Resolved
    - Column headers with alert count badges
    - Responsive layout (horizontal scroll on mobile)
    - Use ShadcnUI Card or custom components
  - [ ] 2.5 Create alert card component
    - Display: EA name, Client name, Alert type, Severity badge, Date created, Assignee name
    - Color-coded by severity (CRITICAL=red, HIGH=orange, MEDIUM=yellow, LOW=blue)
    - Hover effects
    - Click to open detail view
    - Use ShadcnUI Card, Badge components
  - [ ] 2.6 Implement drag-and-drop functionality
    - Drag alert cards between columns
    - Update alert status on drop
    - Smooth animations (200-300ms transitions)
    - Visual feedback during drag
    - Keyboard navigation support
    - Screen reader announcements
  - [ ] 2.7 Create filtering component
    - Filter by severity (multi-select checkboxes)
    - Filter by pairing (dropdown)
    - Filter by date range (date picker)
    - Filter by assignee (dropdown)
    - Multiple filters can be active
    - Clear filters button
  - [ ] 2.8 Create alert detail view component
    - Modal or side panel
    - Display: Full alert info, Rule info, Evidence, Pairing details, Related reports, Notes section, Assignment section, Status controls, Resolve button
    - Close button or click outside to dismiss
  - [ ] 2.9 Implement real-time updates
    - Polling or websockets for alert updates
    - Update board when new alerts created
    - Update board when alert status changes
    - Show "Updated X seconds ago" indicator (optional)
  - [ ] 2.10 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
    - Smooth animations
  - [ ] 2.11 Ensure Kanban board UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify board renders correctly
    - Verify drag and drop works
    - Verify filtering works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Kanban board renders correctly
- Drag and drop works
- Alert detail view works
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
  - [ ] 3.2 Analyze test coverage gaps for Kanban board only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end drag → status update flow
    - Focus on filtering combinations
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: load board → drag alert → update status → view detail
    - Test filtering combinations
  - [ ] 3.4 Run Kanban board tests only
    - Run ONLY tests related to Kanban board (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All Kanban board tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Drag and drop tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Alert Management API Endpoints (Task Group 1)
2. Kanban Board UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

