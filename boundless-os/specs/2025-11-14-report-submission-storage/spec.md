# Specification: Report Submission & Storage

## Goal
Implement backend storage system for End of Day reports with all 10 fields, proper linking to pairings and EAs, timestamp tracking, duplicate prevention, and report history view for EAs.

## User Stories
- As an EA, I want my reports saved securely so that CSMs can analyze relationship health
- As an EA, I want to view my report history so that I can see what I've submitted
- As the system, I want to prevent duplicate reports so that data integrity is maintained

## Specific Requirements

**Report Storage API**
- POST endpoint: /api/reports/submit
- Accept all 10 report fields: workloadFeeling, workType, feelingDuringWork, biggestWin, whatCompleted, pendingTasks, hadDailySync, difficulties, supportNeeded, additionalNotes
- Also accept: pairingId, eaId, reportDate (optional, defaults to today)
- Validate required fields before saving
- Save to EndOfDayReports table with all fields
- Return success response with reportId

**Database Field Mapping**
- Map form fields to database columns: workloadFeeling (enum), workType (enum), feelingDuringWork (enum), biggestWin (text), whatCompleted (text), pendingTasks (text nullable), hadDailySync (boolean), difficulties (text nullable), supportNeeded (text nullable), additionalNotes (text nullable)
- Link to pairingId (foreign key to Pairings)
- Link to eaId (foreign key to Users)
- reportDate = date of submission (use EA's timezone)
- Timestamps: createdAt, updatedAt

**Duplicate Prevention**
- Unique constraint: (pairingId, reportDate) prevents duplicate reports
- Check for existing report before saving
- Return error if report already exists for this pairing on this date
- Handle timezone correctly (same date in EA's timezone = duplicate)

**Report History View**
- GET endpoint: /api/reports/history?eaId=&limit=30&offset=0
- Return EA's own reports (last 30 days by default)
- Include: reportId, reportDate, clientName (from pairing), summary fields (workloadFeeling, workType, biggestWin preview)
- Support pagination with limit/offset
- Filter by date range (optional query params)
- Filter by pairingId (optional query param)

**Report Detail View**
- GET endpoint: /api/reports/:reportId
- Return full report with all 10 fields
- Include pairing and EA information
- Only EA can view their own reports (authorization check)
- Admins can view all reports

**Timezone Handling**
- Use EA's timezone (from EAs table) for reportDate calculations
- Store reportDate as date (not timestamp) in EA's timezone
- Handle date comparisons correctly across timezones
- Ensure duplicate prevention works with timezone awareness

**Alert Rules Engine Trigger**
- After successful report submission, trigger Alert Rules Engine evaluation
- Pass report data to rules engine
- Rules engine evaluates and creates alerts if rules fire
- This happens asynchronously (don't block report submission)

**Data Integrity**
- Foreign key constraints ensure valid pairingId and eaId
- Enum validation for workloadFeeling, workType, feelingDuringWork
- Text field length limits (reasonable max lengths)
- Required field validation at database level

## Visual Design
No visual assets provided. Report history view uses list/table components.

## Existing Code to Leverage

**Database Schema**
- Use EndOfDayReports table structure from Database Schema spec
- Follow Drizzle ORM patterns for queries and inserts
- Use existing indexes for performance

**Alert Rules Engine Integration**
- Integrate with Alert Rules Engine after report submission
- Follow existing alert creation patterns
- Handle async processing appropriately

## Out of Scope
- Report editing after submission (reports are immutable)
- Report deletion (future feature)
- Report versioning (future feature)
- Advanced analytics (separate spec)
- Report export (future feature)
- Report templates (future feature)
- Bulk report operations (not applicable)

