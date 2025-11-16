# Task Breakdown: EA Dashboard

## Overview
Total Tasks: 12

## Task List

### API Layer

#### Task Group 1: Dashboard Data API Endpoints
**Dependencies:** Database Schema spec (Users, EAs, CoachingNotes, CompanyAnnouncements, StartOfDayLogs tables)

- [x] 1.0 Create dashboard data API endpoints
  - [x] 1.1 Write 2-8 focused tests for dashboard endpoints
    - Test EA status data endpoint
    - Test coaching notes endpoint
    - Test announcements endpoint
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create EA status endpoint (Hono)
    - GET /api/dashboard/ea/status
    - Return: onTimeStatus (today), healthcareEligibilityDate, lastStartOfDayLog
    - Authorization: EA role only, own data only
  - [x] 1.3 Create coaching notes endpoint (Hono)
    - GET /api/dashboard/ea/coaching-notes
    - Return: EA-level coaching note (noteType=EA_LEVEL)
    - Real-time data (no caching for MVP)
    - Authorization: EA role only
  - [x] 1.4 Create announcements endpoint (Hono)
    - GET /api/dashboard/announcements
    - Return: Active announcements (isActive=true, not expired)
    - Ordered by createdAt DESC
    - Public endpoint (all authenticated users)
  - [x] 1.5 Ensure dashboard API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify endpoints return correct data
    - Verify authorization works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Status endpoint returns correct EA data
- Coaching notes endpoint returns EA-level note
- Announcements endpoint returns active announcements only

### Frontend Components

#### Task Group 2: Dashboard Layout and Cards
**Dependencies:** Task Group 1

- [ ] 2.0 Create EA dashboard layout and card components
  - [ ] 2.1 Write 2-8 focused tests for dashboard components
    - Test dashboard renders correctly
    - Test status card displays data
    - Test quick actions buttons work
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create dashboard page component (TanStack Router)
    - Route: /dashboard/ea
    - Protected route (EA role only)
    - Card-based grid layout (ShadcnUI Card components)
    - Responsive grid (desktop-first)
  - [ ] 2.3 Create Status Card component
    - Display on-time status for today
    - Display healthcare eligibility date
    - Visual indicator (green/yellow/red)
    - Use ShadcnUI Card, CardHeader, CardTitle, CardContent
  - [ ] 2.4 Create Quick Actions Card component
    - "Start My Day" button (triggers Start of Day Tracking)
    - "Submit End of Day Report" button (navigates to report form)
    - "View My Reports" button (navigates to report history)
    - Use ShadcnUI Button components
  - [ ] 2.5 Create Coaching Notes Card component
    - Display EA-level coaching note content
    - Read-only display
    - Real-time updates (polling every 30 seconds or on focus)
    - Show "Updated X minutes ago" timestamp
  - [ ] 2.6 Create Company Announcements Card component
    - List active announcements (title, content)
    - Ordered by most recent first
    - Card or banner format
    - Handle empty state (no announcements)
  - [ ] 2.7 Create Company Resources Card component
    - Links: Handbook, Training, IT Support, Forms
    - Configurable links (hardcoded for MVP or from config)
    - Clear link styling
  - [ ] 2.8 Implement data fetching (TanStack Query)
    - Fetch EA status data
    - Fetch coaching notes
    - Fetch announcements
    - Handle loading and error states
  - [ ] 2.9 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive grid
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.10 Ensure dashboard UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify cards render correctly
    - Verify buttons navigate correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Dashboard renders with all cards
- Status card shows correct data
- Quick actions buttons work
- Coaching notes display correctly
- Announcements display correctly
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for EA dashboard only
    - Identify critical dashboard workflows that lack test coverage
    - Focus on end-to-end dashboard load flow
    - Focus on real-time updates
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete dashboard load → display flow
    - Test coaching notes real-time update
    - Test quick actions navigation
  - [ ] 3.4 Run EA dashboard tests only
    - Run ONLY tests related to EA dashboard (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All EA dashboard tests pass (approximately 14-26 tests total)
- Critical dashboard workflows covered
- Real-time updates tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Dashboard Data API Endpoints (Task Group 1)
2. Dashboard Layout and Cards (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

