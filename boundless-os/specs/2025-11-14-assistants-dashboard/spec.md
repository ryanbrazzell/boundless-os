# Specification: Assistants Dashboard

## Goal
Create dashboard for Head of EAs showing all Executive Assistants with performance metrics (recent alerts, attendance, report submission consistency), filtering capabilities, and click-through to EA profile management.

## User Stories
- As Head of EAs, I want to see all EAs and their performance so that I can identify which EAs need support
- As Head of EAs, I want to track attendance and report submission so that I can ensure consistency
- As Head of EAs, I want to manage EA profiles so that I can set coaching notes and mark PTO

## Specific Requirements

**EA List View**
- Table or card list displaying all EA users (role=EA from Users table)
- Columns/cards: EA name, Recent alerts count (last 7 days), Attendance status (on-time/late/OOO), Report submission consistency (%), Health indicator (based on pairings), Click to view EA profile
- Sortable columns (optional): Sort by name, alerts, attendance, submission rate
- Responsive design with clear visual hierarchy

**Recent Alerts Display**
- Count alerts triggered in last 7 days for EA's pairings
- Query Alerts table, join with Pairings, filter by eaId and detectedAt >= 7 days ago
- Show total count, optionally breakdown by severity (CRITICAL: X, HIGH: Y, etc.)
- Click count to navigate to alerts filtered by this EA

**Attendance Tracking**
- Calculate attendance status from StartOfDayLogs table (last 30 days)
- Status options: On-time (most logs on-time), Late (frequent late arrivals), OOO (currently out of office)
- Calculate: Total logs, On-time count, Late count, OOO indicator
- Display: "On-time" badge, "Late (X times)" badge, "OOO" badge if currently OOO
- OOO check: Query PTORecords for active PTO covering today

**Report Submission Consistency**
- Calculate percentage of expected reports submitted (last 30 days)
- Expected reports = business days in 30-day period (Monday-Friday, exclude holidays if configured)
- Actual reports = Count EndOfDayReports for EA in last 30 days
- Percentage = (actual / expected) * 100
- Display as percentage: "95%" or progress bar
- Highlight if <80% (low submission rate)

**Filtering Options**
- "Show only EAs with issues" filter toggle
- Shows EAs with: Recent alerts (any in last 7 days), Low report submission rate (<80%), Frequent late arrivals (3+ late in last 30 days), RED/YELLOW health status (based on pairings)
- Multiple filter options can be combined
- Clear filters button

**EA Profile View**
- Full page showing EA information and management tools
- Display: EA information (name, email, expected show-up time, timezone, healthcare eligibility), All pairings (list with health status), Attendance history (last 30 days), Report submission history (last 30 days), Recent alerts (last 7 days), Coaching notes (EA-level, editable), PTO records (list, add/edit), Management actions: Set coaching notes, Mark Out of Office
- Edit EA information (if needed)
- View detailed pairing information

**Access Control**
- Head of EAs role can access dashboard
- SUPER_ADMIN can access dashboard
- Other roles cannot access
- Protect route with role-based middleware

**Performance Metrics Calculation**
- Efficient queries using database indexes
- Cache calculations if needed (attendance, submission rate)
- Use TanStack Query for data fetching and caching
- Handle loading states gracefully

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for dashboard patterns and admin interface layouts.

## Existing Code to Leverage

**Dashboard Patterns**
- Follow ShadFlareAi repository dashboard layout patterns
- Use ShadcnUI Table or Card components
- Follow similar metric calculation and display patterns
- Integrate with Start of Day Tracking and Report Submission systems

**Attendance and Submission Logic**
- Use StartOfDayLogs data for attendance calculation
- Use EndOfDayReports data for submission rate calculation
- Follow business day calculation patterns

## Out of Scope
- EA performance reviews system (future feature)
- EA training tracking (future feature)
- Advanced EA analytics (separate spec)
- EA goal setting (future feature)
- EA skill assessments (future feature)
- EA communication history (future feature)
- EA export functionality (future feature)

