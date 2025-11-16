# Task Breakdown: Start of Day Tracking

## Overview
Total Tasks: 11

## Task List

### API Layer

#### Task Group 1: Start of Day Logging API
**Dependencies:** Database Schema spec (StartOfDayLogs, PTORecords, EAs tables)

- [x] 1.0 Create start of day logging API endpoint
  - [x] 1.1 Write 2-8 focused tests for start of day endpoint
    - Test start of day log creation
    - Test late detection logic
    - Test duplicate prevention
    - Test OOO suppression
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Create start of day log endpoint (Hono)
    - POST /api/start-of-day/log
    - Accept: eaId, loggedAt (optional, defaults to now)
    - Check for duplicate (eaId, logDate) unique constraint
    - Retrieve expectedShowUpTime from EA record
    - Calculate wasLate and minutesLate
    - Create StartOfDayLogs record
    - Check for active PTO (PTORecords table)
    - Create alert if late and not OOO (via Alert Rules Engine) - Placeholder added
    - Return success response with logId, wasLate, minutesLate
  - [x] 1.3 Implement late detection logic
    - Compare loggedAt against expectedShowUpTime
    - Calculate difference in minutes
    - Mark wasLate=true if difference > 30 minutes
    - Store minutesLate value
  - [x] 1.4 Implement OOO suppression logic
    - Query PTORecords for active PTO (current date between startDate and endDate)
    - Use efficient query with index on (eaId, startDate, endDate)
    - Suppress alert creation if active PTO exists
    - Still log Start of Day even if OOO
  - [x] 1.5 Integrate with Alert Rules Engine
    - Trigger alert creation if late and not OOO
    - Use "Late to Shift" rule (or similar rule name)
    - Link alert to EA's active pairings
    - Handle alert creation asynchronously - Placeholder added, will integrate when Alert Rules Engine is ready
  - [x] 1.6 Ensure start of day API tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify logging works
    - Verify late detection works
    - Verify OOO suppression works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Start of day logging works
- Late detection calculates correctly
- Duplicate prevention works
- OOO suppression works
- Alert creation works when appropriate

### Frontend Components

#### Task Group 2: Start of Day Button Integration
**Dependencies:** Task Group 1, EA Dashboard spec

- [ ] 2.0 Integrate start of day button with API
  - [ ] 2.1 Write 2-8 focused tests for start of day button
    - Test button click triggers API call
    - Test button disabled after click
    - Test success feedback display
    - Limit to 2-8 highly focused tests maximum
  - [ ] 2.2 Update EA Dashboard Quick Actions component
    - "Start My Day" button already exists
    - Add onClick handler to call API endpoint
    - Show loading state during API call
    - Disable button after successful log (prevent duplicate clicks)
    - Show success feedback message
    - Handle error states gracefully
  - [ ] 2.3 Implement button state management
    - Check if already logged today (query StartOfDayLogs)
    - Disable button if already logged
    - Show "Already logged today" message if applicable
    - Use TanStack Query for data fetching
  - [ ] 2.4 Update status card display
    - Show on-time status based on today's Start of Day log
    - Display "Logged at X:XX AM" if logged
    - Display "Not logged yet" if not logged
    - Visual indicator (green/yellow/red) based on wasLate
  - [ ] 2.5 Ensure start of day button tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify button works correctly
    - Verify state management works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Button triggers API call correctly
- Button disabled after successful log
- Success feedback displays
- Status card updates correctly

### Testing

#### Task Group 3: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-2

- [ ] 3.0 Review existing tests and fill critical gaps only
  - [ ] 3.1 Review tests from Task Groups 1-2
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Total existing tests: approximately 4-16 tests
  - [ ] 3.2 Analyze test coverage gaps for start of day tracking only
    - Identify critical workflows that lack test coverage
    - Focus on end-to-end button click → log → alert flow
    - Focus on OOO suppression edge cases
  - [ ] 3.3 Write up to 10 additional strategic tests maximum
    - Test complete flow: button click → API call → log creation → alert creation (if late)
    - Test OOO suppression prevents alert creation
    - Test duplicate prevention works
  - [ ] 3.4 Run start of day tracking tests only
    - Run ONLY tests related to start of day tracking (tests from 1.1, 2.1, and 3.3)
    - Expected total: approximately 14-26 tests maximum
    - Do NOT run entire application test suite
    - Verify critical workflows pass

**Acceptance Criteria:**
- All start of day tracking tests pass (approximately 14-26 tests total)
- Critical workflows covered
- OOO suppression tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. Start of Day Logging API (Task Group 1)
2. Start of Day Button Integration (Task Group 2)
3. Test Review & Gap Analysis (Task Group 3)

