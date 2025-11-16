# Spec Requirements: Start of Day Tracking

## Initial Description
EA "Start My Day" button with timestamp logging, expected show-up time comparison, late-shift alerts (30+ minutes), and OOO suppression.

## Requirements Discussion

### Start of Day Button
- Button on EA Dashboard: "Start My Day"
- EA clicks button each morning
- System logs timestamp (loggedAt)
- Creates record in StartOfDayLogs table

### Expected Show-Up Time
- Stored in EA record (expectedShowUpTime field)
- Same time daily for each EA
- Compared against loggedAt timestamp

### Late Detection
- Alert fires if EA logs in more than 30 minutes late
- Calculate: loggedAt - expectedShowUpTime > 30 minutes
- Creates alert (if not suppressed by OOO)
- Stores minutesLate in StartOfDayLogs record

### OOO Suppression
- Check if EA is marked as "Out of Office" (PTORecords table)
- If EA has active PTO record covering today's date:
  - Suppress late-shift alert
  - Still log the Start of Day (for attendance tracking)
  - Don't create alert

### Attendance Logging
- Creates StartOfDayLogs record for every "Start My Day" click
- Fields: eaId, logDate, loggedAt, expectedShowUpTime, wasLate, minutesLate
- Unique constraint: (eaId, logDate) - one log per EA per day

### Alert Creation
- If late and not OOO: Create alert via Alert Rules Engine
- Alert type: "Late to Shift"
- Severity: Based on rule configuration
- Links to pairing (EA's active pairings)

## Requirements Summary

### Functional Requirements
- "Start My Day" button on EA Dashboard
- Timestamp logging
- Expected show-up time comparison
- Late detection (30+ minutes)
- OOO suppression logic
- Attendance log creation
- Alert generation (when late and not OOO)

### Scope Boundaries
**In Scope:**
- Button and logging
- Late detection
- OOO suppression
- Alert creation

**Out of Scope:**
- Multiple "Start My Day" clicks per day (prevented by unique constraint)
- Early arrival tracking (future feature)
- Break tracking (future feature)

### Technical Considerations
- Button on EA Dashboard
- Backend API endpoint for logging
- Alert Rules Engine integration
- PTO record checking logic

