# Spec Requirements: Pairings Dashboard

## Initial Description
List view of all EA-Client pairings with health status indicators, manual override toggle, last report date, accelerator status, and detailed pairing view.

## Requirements Discussion

### Dashboard Purpose
- For both Head of Client Success and Head of EAs
- Overview of all EA-Client pairings
- Health status at a glance

### Pairing List View
- Table or card list showing all pairings
- Columns/cards show:
  - EA name
  - Client name
  - Health status (🟢 Green | 🟡 Yellow | 🔴 Red)
  - Manual override indicator (if set)
  - Last report date
  - Accelerator status (enabled/disabled, current week)
  - Active alerts count
  - Click to view pairing details

### Health Status Indicators
- Calculated by Health Scoring System
- Visual indicators: 🟢 🟡 🔴
- Can be manually overridden

### Manual Override Toggle
- Quick toggle to override health status
- Shows indicator when override is active
- Can set to Green even if alerts exist (for false positives)

### Last Report Date
- Date of most recent End of Day report
- Shows "X days ago" format
- Highlights if >2 business days (RED indicator)

### Accelerator Status
- Shows if accelerator is enabled
- If enabled: Shows current week (1, 2, 3, 4, Complete)
- Visual indicator

### Filtering
- Filter by health status (Green/Yellow/Red)
- Filter by EA
- Filter by Client
- Filter by accelerator status
- Filter by alerts (has alerts / no alerts)

### Pairing Detail View
- Click pairing to see:
  - Full pairing information
  - Health status and history
  - Recent reports (last 30 days)
  - Active alerts (with details)
  - Accelerator progress and goals
  - Coaching notes (pairing-level)
  - Manual override controls
  - Edit pairing button

### Access Control
- Head of Client Success can access
- Head of EAs can access
- SUPER_ADMIN can access
- Other roles cannot access

## Requirements Summary

### Functional Requirements
- List view of all pairings
- Health status indicators
- Manual override toggle
- Last report date display
- Accelerator status display
- Filtering options
- Pairing detail view

### Scope Boundaries
**In Scope:**
- Pairing list view
- Health status display
- Manual override
- Filtering
- Detail view

**Out of Scope:**
- Pairing analytics (separate spec)
- Pairing history/audit (future feature)
- Bulk operations (separate CSV import spec)

### Technical Considerations
- Role-based access (multiple admin roles)
- Database: Pairings, Alerts, EndOfDayReports tables
- Health Scoring System integration
- Manual override logic

