# Specification: Start of Day Tracking

## Goal
Implement "Start My Day" button functionality that logs EA arrival time, compares against expected show-up time, detects late arrivals (30+ minutes), and creates alerts while suppressing alerts during OOO periods.

## User Stories
- As an EA, I want to log my start time so that attendance is tracked automatically
- As Head of EAs, I want to know when EAs are late so that I can provide support
- As the system, I want to suppress alerts during approved PTO so that false positives don't occur

## Specific Requirements

**Start My Day Button**
- Button on EA Dashboard in Quick Actions section
- EA clicks button each morning to log arrival
- Button disabled after first click of the day (prevent duplicates)
- Show loading state during API call
- Success feedback after logging

**Timestamp Logging**
- Create StartOfDayLogs record with: eaId, logDate (today's date), loggedAt (timestamp), expectedShowUpTime (from EA record), wasLate (boolean), minutesLate (integer, nullable)
- Unique constraint: (eaId, logDate) prevents multiple logs per EA per day
- Use EA's timezone for date calculations

**Expected Show-Up Time Comparison**
- Retrieve expectedShowUpTime from EA record (EAs table)
- Compare loggedAt timestamp against expectedShowUpTime
- Calculate difference in minutes
- Mark wasLate=true if difference > 30 minutes

**Late Detection Logic**
- Calculate: loggedAt - expectedShowUpTime > 30 minutes
- Store minutesLate in StartOfDayLogs record
- Create alert via Alert Rules Engine if late and not OOO
- Alert type: "Late to Shift" (or similar rule name)
- Alert severity based on rule configuration
- Link alert to EA's active pairings

**OOO Suppression**
- Before creating late alert, check PTORecords table for active PTO
- Active PTO: Current date between startDate and endDate
- If active PTO exists: Suppress alert creation, still log Start of Day
- If no active PTO: Create alert normally
- Query PTORecords efficiently (index on eaId, date range)

**Attendance Logging**
- Log every "Start My Day" click (even if OOO)
- Maintain attendance history for reporting
- Support attendance analytics on Assistants Dashboard
- Data stored in StartOfDayLogs table with proper indexes

**API Endpoint**
- POST endpoint: /api/start-of-day/log
- Request: { eaId, loggedAt (optional, defaults to now) }
- Response: { success, logId, wasLate, minutesLate }
- Handle errors gracefully (duplicate log, invalid EA, etc.)

## Visual Design
No visual assets provided. Button follows ShadcnUI button component patterns.

## Existing Code to Leverage

**EA Dashboard Integration**
- Button already exists in EA Dashboard Quick Actions
- Integrate with existing dashboard component structure
- Follow dashboard state management patterns

**Alert Rules Engine Integration**
- Use existing Alert Rules Engine to create alerts
- Follow alert creation patterns from churn detection system
- Link alerts to pairings appropriately

## Out of Scope
- Multiple "Start My Day" clicks per day (prevented by unique constraint)
- Early arrival tracking or rewards (future feature)
- Break tracking or time tracking (future feature)
- Attendance calendar view (future feature)
- Attendance reports export (future feature)
- Automatic timezone detection (use EA's stored timezone)
- GPS location verification (future feature)

