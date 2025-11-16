# Task Breakdown: Company Announcements

## Overview
Total Tasks: 10

## Task List

### API Layer

#### Task Group 1: Announcements API Endpoints
**Dependencies:** Database Schema spec (CompanyAnnouncements table)

- [x] 1.0 Create announcements API endpoints
  - [x] 1.1 Write 2-8 focused tests for announcements endpoints
    - Test announcement creation
    - Test active announcements retrieval
    - Test announcement update
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create announcement list endpoint (Hono)
    - GET /api/announcements
    - Return list of all announcements
    - Support filters: isActive, expirationStatus (query params)
    - Authorization: Admin roles for management, all authenticated users for viewing
  - [x] 1.3 Create active announcements endpoint (Hono)
    - GET /api/announcements/active
    - Return only active, non-expired announcements
    - Ordered by createdAt DESC
    - Public endpoint (all authenticated users)
  - [x] 1.4 Create announcement creation endpoint (Hono)
    - POST /api/announcements
    - Accept: title, content, expiresAt (optional), isActive
    - Create CompanyAnnouncements record
    - Set createdBy to current user
    - Authorization: SUPER_ADMIN, optionally Head of Client Success/Head of EAs
  - [x] 1.5 Create announcement update endpoint (Hono)
    - PUT /api/announcements/:announcementId
    - Accept: title, content, expiresAt, isActive
    - Update CompanyAnnouncements record
    - Authorization: SUPER_ADMIN, optionally Head of Client Success/Head of EAs
  - [x] 1.6 Create announcement deletion endpoint (Hono)
    - DELETE /api/announcements/:announcementId
    - Delete CompanyAnnouncements record
    - Authorization: SUPER_ADMIN, optionally Head of Client Success/Head of EAs
  - [x] 1.7 Ensure announcements API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify CRUD operations work
    - Verify active announcements filtering works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Announcement CRUD operations work
- Active announcements filtering works

### Frontend Components

#### Task Group 2: Announcements UI Components
**Dependencies:** Task Group 1, EA Dashboard spec

- [ ] 2.0 Create announcements UI components
  - [ ] 2.1 Write 2-8 focused tests for announcements UI
    - Test announcement display on EA dashboard
    - Test announcement management interface
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Update EA Dashboard Company Announcements Card
    - Display active announcements (isActive=true, not expired)
    - Show title and content
    - Ordered by most recent first
    - Card or banner format
    - Optional dismiss button (localStorage)
    - Use ShadcnUI Card component
  - [ ] 2.3 Create announcement management interface (admin)
    - List view: Table showing all announcements
    - Columns: Title, content preview, active status, expiration date, created date, actions
    - Edit, delete, toggle active buttons
    - Use ShadcnUI Table components
  - [ ] 2.4 Create announcement creation form (admin)
    - Fields: Title, Content, Expiration Date (optional), Active Status toggle
    - Form validation
    - Submit handler
    - Use ShadcnUI Form, Input, Textarea, DatePicker, Switch components
  - [ ] 2.5 Create announcement edit form (admin)
    - Edit existing announcement fields
    - Save changes
  - [ ] 2.6 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.7 Ensure announcements UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify announcement display works
    - Verify management interface works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Announcements display correctly on EA dashboard
- Management interface works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for announcements only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end announcement creation → display flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: create announcement → display on dashboard → expire
  - [ ] 3.4 Run announcements tests only
    - Run ONLY tests related to announcements (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All announcements tests pass (approximately 14-26 tests total)
- Critical workflows covered
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Announcements API Endpoints (Task Group 1)
2. Announcements UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

