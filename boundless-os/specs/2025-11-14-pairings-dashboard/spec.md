# Specification: Pairings Dashboard

## Goal
Create dashboard for both Head of Client Success and Head of EAs showing all EA-Client pairings with health status, manual override controls, filtering options, and detailed pairing views.

## User Stories
- As Head of Client Success, I want to see all pairings and their health so that I can prioritize interventions
- As an admin, I want to manually override health status so that I can handle false positives
- As an admin, I want to filter pairings so that I can focus on specific relationships

## Specific Requirements

**Pairing List View**
- Table or card list displaying all pairings from Pairings table
- Columns/cards: EA name, Client name, Health status (🟢🟡🔴), Manual override indicator (if set), Last report date, Accelerator status (enabled/disabled, current week), Active alerts count
- Sortable columns: Sort by EA, Client, Health, Last report, Alerts
- Click row/card to navigate to pairing detail view
- Visual indicators for health status and override

**Health Status Display**
- Display health status calculated by Health Scoring System
- Visual indicators: 🟢 Green | 🟡 Yellow | 🔴 Red
- Show manual override indicator (badge or icon) when healthStatusOverride=true
- Tooltip or indicator showing "Manually overridden" when applicable

**Manual Override Toggle**
- Quick toggle/button in list view to override health status
- Opens modal or inline editor: Select health status (Green/Yellow/Red), Toggle override on/off, Save button
- Updates Pairings table: healthStatus, healthStatusOverride (boolean)
- Can set to Green even if alerts exist (for false positives)
- Clear override button returns to automatic calculation

**Last Report Date Display**
- Show date of most recent End of Day report for pairing
- Format: "X days ago" or actual date
- Highlight if >2 business days (RED indicator or warning badge)
- Query EndOfDayReports table, order by reportDate DESC, get most recent

**Accelerator Status Display**
- Show if accelerator is enabled (acceleratorEnabled boolean)
- If enabled: Display current week (1, 2, 3, 4, or "Complete")
- Visual indicator: Badge or icon showing accelerator status
- Click to view accelerator details in pairing detail page

**Filtering Options**
- Filter by health status: Green only, Yellow only, Red only, All
- Filter by EA: Dropdown/select EA from list
- Filter by Client: Dropdown/select client from list
- Filter by accelerator status: Enabled, Disabled, All
- Filter by alerts: Has alerts, No alerts, All
- Multiple filters can be active simultaneously
- Filter state persists in URL or local state

**Pairing Detail View**
- Full page showing complete pairing information
- Display: Full pairing information (EA, Client, Start date), Health status with manual override controls, Recent reports (last 30 days, list with summaries), Active alerts (list with details, links to alert management), Accelerator progress and goals (if enabled), Coaching notes (pairing-level, editable), Manual override controls, Edit pairing button
- Navigate to related EA or Client profiles
- View full report details
- View full alert details

**Access Control**
- Head of Client Success can access dashboard
- Head of EAs can access dashboard
- SUPER_ADMIN can access dashboard
- Other roles cannot access
- Protect route with role-based middleware

**Data Fetching**
- Use TanStack Query for efficient data fetching
- Fetch pairings with aggregated data (health, alerts, last report)
- Use database indexes for performance
- Handle loading and error states

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for dashboard patterns and admin interface layouts.

## Existing Code to Leverage

**Dashboard Patterns**
- Follow ShadFlareAi repository dashboard layout patterns
- Use ShadcnUI Table or Card components
- Follow similar filtering and sorting patterns
- Integrate with Health Scoring System for health display

**Health Scoring Integration**
- Use Health Scoring System for automatic health calculation
- Support manual override functionality
- Display health status consistently across dashboards

## Out of Scope
- Pairing analytics dashboard (separate spec)
- Pairing history/audit trail (future feature)
- Bulk pairing operations (separate CSV import spec)
- Pairing templates (future feature)
- Advanced pairing search (basic filtering only)
- Pairing comparison view (future feature)
- Pairing relationship timeline (future feature)

