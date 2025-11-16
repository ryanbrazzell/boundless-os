# Task Breakdown: Coaching Notes System

## Overview
Total Tasks: 11

## Task List

### API Layer

#### Task Group 1: Coaching Notes API Endpoints
**Dependencies:** Database Schema spec (CoachingNotes table)

- [x] 1.0 Create coaching notes API endpoints
  - [x] 1.1 Write 2-8 focused tests for coaching notes endpoints
    - Test EA-level note retrieval
    - Test pairing-level note retrieval
    - Test note update
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create EA-level note endpoint (Hono)
    - GET /api/coaching-notes/ea/:eaId
    - Return EA-level coaching note (noteType=EA_LEVEL)
    - Authorization: EA can view own note, Admins can view all
  - [x] 1.3 Create pairing-level note endpoint (Hono)
    - GET /api/coaching-notes/pairing/:pairingId
    - Return pairing-level coaching note (noteType=PAIRING_LEVEL)
    - Authorization: EA can view own pairing notes, Admins can view all
  - [x] 1.4 Create EA-level note update endpoint (Hono)
    - PUT /api/coaching-notes/ea/:eaId
    - Accept: content (text)
    - Update or create EA-level note
    - Set updatedBy and updatedAt
    - Authorization: Admin roles only
  - [x] 1.5 Create pairing-level note update endpoint (Hono)
    - PUT /api/coaching-notes/pairing/:pairingId
    - Accept: content (text)
    - Update or create pairing-level note
    - Set updatedBy and updatedAt
    - Authorization: Admin roles only
  - [x] 1.6 Ensure coaching notes API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify note retrieval works
    - Verify note update works
    - Verify authorization works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- EA-level note endpoints work
- Pairing-level note endpoints work
- Authorization enforced

### Frontend Components

#### Task Group 2: Coaching Notes UI Components
**Dependencies:** Task Group 1, EA Dashboard spec, End of Day Report Form spec

- [ ] 2.0 Create coaching notes UI components
  - [ ] 2.1 Write 2-8 focused tests for coaching notes UI
    - Test note display on EA dashboard
    - Test note display on report form
    - Test note editing
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Update EA Dashboard Coaching Notes Card
    - Display EA-level coaching note (read-only for EA)
    - Real-time updates (polling every 30-60 seconds or websockets)
    - Show "Updated X minutes ago" timestamp (optional)
    - Use ShadcnUI Card component
  - [ ] 2.3 Update End of Day Report Form
    - Display pairing-level coaching note at top of form
    - Card or banner format above form fields
    - Read-only display for EA
    - Real-time updates (fetch on pairing selection change)
  - [ ] 2.4 Create coaching notes edit component (admin)
    - Text area for note content (plain text)
    - Character limit (optional, e.g., 1000 characters)
    - Placeholder text with guidance
    - Save button
    - Real-time update indicator
    - Use ShadcnUI Textarea, Button components
  - [ ] 2.5 Integrate with EA Profile page
    - Show EA-level note with edit capability (for admins)
    - Read-only for EA
  - [ ] 2.6 Integrate with Pairing Detail page
    - Show pairing-level note with edit capability (for admins)
    - Read-only for EA
  - [ ] 2.7 Implement real-time updates
    - Polling: Fetch notes every 30-60 seconds
    - Or websockets: Update when admin changes note
    - Handle update conflicts gracefully (last write wins)
  - [ ] 2.8 Apply styling and responsive design
    - Follow ShadcnUI design system
    - Desktop-first responsive layout
    - WCAG 2.1 AA accessibility
    - Stripe/Linear/Notion quality design
  - [ ] 2.9 Ensure coaching notes UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify note display works
    - Verify note editing works
    - Verify real-time updates work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Notes display correctly on EA dashboard
- Notes display correctly on report form
- Note editing works
- Real-time updates work
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for coaching notes only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end note edit → real-time update flow
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: admin edits note → EA sees update
    - Test real-time update behavior
  - [ ] 3.4 Run coaching notes tests only
    - Run ONLY tests related to coaching notes (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All coaching notes tests pass (approximately 14-26 tests total)
- Critical workflows covered
- Real-time updates tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Coaching Notes API Endpoints (Task Group 1)
2. Coaching Notes UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

