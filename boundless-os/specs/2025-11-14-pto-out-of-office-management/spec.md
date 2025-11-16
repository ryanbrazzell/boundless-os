# Specification: PTO/Out of Office Management

## Goal
Enable admins to mark EAs as Out of Office with date ranges and reasons, suppress alerts during OOO periods, and display OOO indicators on dashboards.

## User Stories
- As Head of EAs, I want to mark EAs as Out of Office so that alerts are suppressed during approved absences
- As the system, I want to suppress alerts during PTO so that false positives don't occur
- As an admin, I want to see OOO indicators so that I know which EAs are currently out

## Specific Requirements

**PTO Record Creation**
- Admin interface to create PTO records (accessible from EA Profile page)
- Form fields: EA (dropdown/select from EA users), Start Date (date picker), End Date (date picker), Reason (dropdown: PTO, Sick, Other)
- Validation: Start date <= End date, End date >= today (or allow past dates for historical records), EA required
- Submit creates record in PTORecords table: eaId, startDate, endDate, reason (enum), createdAt, updatedAt

**Alert Suppression Logic**
- Check PTORecords table when evaluating alerts (in Alert Rules Engine and Start of Day Tracking)
- Active PTO check: Current date between startDate and endDate (inclusive)
- If EA has active PTO covering date: Suppress alert creation (for late to shift, missing reports, attendance-related alerts)
- Still log Start of Day (for attendance tracking) but don't create alert
- Query efficiently: Index on (eaId, startDate, endDate) for date range queries

**OOO Indicators on Dashboards**
- Assistants Dashboard: Show "OOO" badge/indicator next to EA name if currently OOO, Display date range (optional: "OOO until Jan 15")
- Pairings Dashboard: Show "OOO" indicator if EA is currently OOO (affects pairing display)
- EA Dashboard: Show "You are currently Out of Office" banner if EA is OOO (optional)
- Visual indicator: Badge, icon, or colored indicator (consistent across dashboards)

**PTO Management Interface**
- View all PTO records: List view showing EA name, date range, reason, status (active/upcoming/past)
- Create new PTO record: Form accessible from EA Profile page
- Edit PTO record: Edit date range or reason (if needed)
- Delete PTO record: Remove PTO record (if needed, with confirmation)
- Filter by EA, date range, reason, status

**Active PTO Check**
- Function to check if EA has active PTO: Query PTORecords where eaId matches and current date between startDate and endDate
- Used by: Start of Day Tracking (suppress late alerts), Alert Rules Engine (suppress missing report alerts), Dashboards (show OOO indicators)
- Efficient query using database indexes
- Handle timezone correctly (use EA's timezone for date comparisons)

**Access Control**
- Head of EAs can manage PTO (create, edit, delete)
- SUPER_ADMIN can manage PTO
- Other roles cannot manage PTO (but can see OOO indicators)
- Protect PTO management routes with role-based middleware

**Data Storage**
- Store in PTORecords table: id, eaId (foreign key to Users), startDate (date), endDate (date), reason (enum: PTO, SICK, OTHER), createdAt, updatedAt
- Index on (eaId, startDate, endDate) for efficient date range queries
- Support overlapping PTO records (EA can have multiple PTO records)

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for form patterns and badge/indicator components.

## Existing Code to Leverage

**Alert Suppression Integration**
- Integrate with Start of Day Tracking spec for late alert suppression
- Integrate with Alert Rules Engine spec for missing report alert suppression
- Follow existing alert creation patterns

**Dashboard Indicator Patterns**
- Use ShadcnUI Badge component for OOO indicators
- Follow consistent indicator patterns across dashboards
- Ensure indicators are accessible (screen reader support)

## Out of Scope
- PTO approval workflow (future feature - direct creation for MVP)
- PTO balance tracking (future feature)
- Recurring PTO (future feature - single date ranges only)
- PTO calendar view (future feature)
- PTO notifications (future feature)
- PTO export functionality (future feature)
- PTO analytics (future feature)
- Half-day PTO (full days only for MVP)

