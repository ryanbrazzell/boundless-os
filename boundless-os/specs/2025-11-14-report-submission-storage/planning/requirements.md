# Spec Requirements: Report Submission & Storage

## Initial Description
Save End of Day reports to database with all 10 fields, link to pairing and EA, timestamp tracking, and report history view (last 30 days).

## Requirements Discussion

### Report Storage
- Save all 10 fields to EndOfDayReports table
- Link to pairingId (which pairing this report is for)
- Link to eaId (which EA submitted)
- reportDate = date of submission
- Timestamp tracking (createdAt, updatedAt)

### Database Fields
All 10 fields mapped to database:
1. workloadFeeling (enum)
2. workType (enum)
3. feelingDuringWork (enum)
4. biggestWin (text)
5. whatCompleted (text)
6. pendingTasks (text, nullable)
7. hadDailySync (boolean)
8. difficulties (text, nullable)
9. supportNeeded (text, nullable)
10. additionalNotes (text, nullable)

### Report History View
- EA can view their own reports (last 30 days)
- Display: Date, Client name, summary of key fields
- Click to view full report details
- Filter by date range
- Filter by client/pairing

### Report Submission Flow
1. EA fills out form
2. Clicks submit
3. Form validates required fields
4. API saves to database
5. Success message shown
6. Optionally: Trigger alert rules evaluation

### Data Integrity
- One report per EA per pairing per day (unique constraint)
- Prevent duplicate submissions
- Handle timezone correctly (use EA's timezone)

## Requirements Summary

### Functional Requirements
- Save all 10 fields to database
- Link to pairing and EA
- Timestamp tracking
- Report history view (last 30 days)
- Duplicate prevention
- Timezone handling

### Scope Boundaries
**In Scope:**
- Report storage
- Report history view
- Basic filtering

**Out of Scope:**
- Report editing after submission (future feature)
- Report deletion (future feature)
- Advanced analytics (separate spec)

### Technical Considerations
- Database: EndOfDayReports table
- Unique constraint: (pairingId, reportDate)
- Timezone handling
- Alert Rules Engine trigger (after submission)

