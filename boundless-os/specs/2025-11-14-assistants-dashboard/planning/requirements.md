# Spec Requirements: Assistants Dashboard

## Initial Description
List view of all EAs with recent alerts, attendance tracking, report submission consistency, filter for EAs with issues, and click-through to EA profile.

## Requirements Discussion

### Dashboard Purpose
- For Head of EAs role
- Overview of all Executive Assistants
- Track EA performance and issues

### EA List View
- Table or card list showing all EAs
- Columns/cards show:
  - EA name
  - Recent alerts count
  - Attendance status (on-time, late, OOO)
  - Report submission consistency (% submitted)
  - Health indicator (based on pairings)
  - Click to view EA profile

### Recent Alerts
- Count of alerts triggered in last 7 days
- Shows by severity (if possible)
- Links to alert details

### Attendance Tracking
- Based on Start of Day logs
- Shows: On-time, Late (with count), OOO
- Calculated from last 30 days
- OOO indicator if currently out of office

### Report Submission Consistency
- Percentage of expected reports submitted
- Last 30 days calculation
- Expected reports = business days in period
- Shows as percentage (e.g., "95%")

### Filtering
- "Show only EAs with issues" filter
- Shows EAs with:
  - Recent alerts
  - Low report submission rate (<80%)
  - Frequent late arrivals
  - RED/YELLOW health status

### EA Profile View
- Click EA to see:
  - EA information
  - All pairings
  - Attendance history
  - Report submission history
  - Recent alerts
  - Coaching notes (EA-level)
  - PTO records
  - Set coaching notes
  - Mark Out of Office

### Access Control
- Head of EAs role can access
- SUPER_ADMIN can access
- Other roles cannot access

## Requirements Summary

### Functional Requirements
- List view of all EAs
- Recent alerts display
- Attendance tracking
- Report submission consistency
- Filter for EAs with issues
- Click-through to EA profile
- EA profile view with management tools

### Scope Boundaries
**In Scope:**
- EA list view
- Performance metrics
- Filtering
- EA profile view
- Management actions

**Out of Scope:**
- EA performance reviews (future feature)
- EA training tracking (future feature)
- Advanced analytics (separate spec)

### Technical Considerations
- Role-based access (Head of EAs, SUPER_ADMIN)
- Database: Users (EA role), StartOfDayLogs, EndOfDayReports, Alerts
- Attendance calculation logic
- Report submission rate calculation

