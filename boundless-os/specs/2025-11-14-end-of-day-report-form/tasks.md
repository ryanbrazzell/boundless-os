# Task Breakdown: End of Day Report Form

## Overview
Total Tasks: 13

## Task List

### API Layer

#### Task Group 1: Report Submission API
**Dependencies:** Database Schema spec (EndOfDayReports table), Report Submission spec

- [x] 1.0 Create report submission API endpoint
  - [x] 1.1 Write 2-8 focused tests for report submission endpoint
    - Test report submission with all fields
    - Test duplicate prevention
    - Test validation errors
    - Limit to 2-8 highly focused tests maximum (already covered in reports.test.ts)
  - [x] 1.2 Create report submission endpoint (Hono)
    - POST /api/reports/submit
    - Accept all 10 report fields + pairingId
    - Validate required fields
    - Check for duplicate (pairingId, reportDate)
    - Save to EndOfDayReports table
    - Trigger Alert Rules Engine evaluation (async)
    - Return success response (already implemented)
  - [x] 1.3 Create pairing list endpoint for EA (Hono)
    - GET /api/pairings/ea/:eaId
    - Return EA's active pairings (for dropdown selection)
    - Include client name, pairingId
    - Authorization: EA role only, own pairings only
  - [x] 1.4 Create pairing coaching note endpoint (Hono)
    - GET /api/pairings/:pairingId/coaching-note
    - Return pairing-level coaching note (noteType=PAIRING_LEVEL)
    - Authorization: EA role can view own pairing notes
  - [x] 1.5 Ensure report API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify submission works
    - Verify duplicate prevention works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Report submission endpoint works
- Duplicate prevention works
- Pairing list endpoint works
- Coaching note endpoint works

### Frontend Components

#### Task Group 2: Report Form UI Components
**Dependencies:** Task Group 1

- [ ] 2.0 Create End of Day report form components
  - [ ] 2.1 Write 2-8 focused tests for report form components
    - Test form renders correctly
    - Test form submission
    - Test validation errors
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Create report form page component (TanStack Router)
    - Route: /reports/submit
    - Protected route (EA role only)
    - Form layout with sections
  - [ ] 2.3 Create pairing selection component
    - Dropdown/select for pairing selection
    - Pre-select if EA has only one active pairing
    - Required field
    - Use ShadcnUI Select component
  - [ ] 2.4 Create coaching note display component
    - Display pairing-level coaching note at top
    - Card or banner format
    - Read-only display
    - Real-time updates (fetch on pairing selection change)
  - [ ] 2.5 Create Section 1 form fields (Client-Facing)
    - Workload feeling (Radio: Light | Moderate | Heavy | Overwhelming)
    - Work type (Radio: Not much | Regular | Mix | Mostly new)
    - Feeling during work (Radio: Great | Good | Okay | Stressed)
    - Biggest win (Text area, required)
    - What completed (Text area, required)
    - Pending tasks (Text area, optional)
    - Daily Sync call (Yes/No toggle, required)
    - Use ShadcnUI Form, RadioGroup, Textarea, Switch components
    - Use React Hook Form for form management
  - [ ] 2.6 Create Section 2 form fields (Internal)
    - Difficulties (Text area, optional)
    - Support needed (Text area, optional)
    - Additional notes (Text area, optional)
    - Use ShadcnUI Textarea components
  - [ ] 2.7 Implement form validation (React Hook Form + Zod)
    - Validate required fields
    - Show inline error messages
    - Prevent submission if validation fails
  - [ ] 2.8 Implement form submission handler
    - Submit all 10 fields + pairingId
    - Handle success/error states
    - Show success message
    - Redirect to dashboard or report history
    - Handle duplicate submission error
  - [ ] 2.9 Apply styling and UX
    - Clear section labels ("Buy Back Time Report Questions", "Internal Team Questions")
    - Helpful placeholder text
    - Loading state during submission
    - Form designed for 2-3 minute completion
    - Follow ShadcnUI design system
    - WCAG 2.1 AA accessibility
  - [ ] 2.10 Ensure report form UI tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify form renders correctly
    - Verify submission works
    - Verify validation works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Form renders with all 10 fields
- Pairing selection works
- Coaching note displays correctly
- Form validation works
- Form submission works
- Design matches quality standards

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for report form only
    - Identify critical form workflows that lack test coverage
    - Focus on end-to-end submission flow
    - Focus on validation edge cases
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete form fill → submit → success flow
    - Test duplicate submission prevention
    - Test pairing selection → coaching note display
  - [ ] 3.4 Run report form tests only
    - Run ONLY tests related to report form (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All report form tests pass (approximately 14-26 tests total)
- Critical form workflows covered
- Validation tested thoroughly
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Report Submission API (Task Group 1)
2. Report Form UI Components (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

