# Spec Requirements: Alert Management Kanban

## Initial Description
Drag-and-drop Kanban board with columns (New, Investigating, Working On, Resolved), alert cards showing EA/client/type/severity/date, filters by severity/pairing/date/assignee, and detailed alert view with notes.

## Requirements Discussion

### Kanban Board Layout
- Four columns:
  - **New**: Newly detected alerts
  - **Investigating**: Alerts being looked into
  - **Working On**: Alerts with active intervention
  - **Resolved**: Alerts that have been resolved

### Alert Cards
Each card shows:
- EA name
- Client name
- Alert type (rule name)
- Severity badge (CRITICAL | HIGH | MEDIUM | LOW)
- Date created
- Color-coded by severity

### Drag and Drop
- Drag alerts between columns
- Updates alert status automatically
- Smooth animations (react-beautiful-dnd or @dnd-kit/core)
- Accessible (keyboard navigation)

### Filtering
- Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)
- Filter by pairing (EA-Client)
- Filter by date range
- Filter by assignee
- Multiple filters can be active

### Alert Detail View
- Click alert card to see:
  - Full alert information
  - Rule that triggered it
  - Evidence (quotes, confidence, reasoning)
  - Pairing details
  - Related reports
  - Notes (add/edit)
  - Assign to user
  - Change status
  - Resolve alert

### Alert Assignment
- Assign alerts to users (CSMs, admins)
- Shows assignee on card
- Filter by assignee

### Alert Notes
- Add notes to alerts
- Edit notes
- Show note history (if needed)
- Notes visible in detail view

### Access Control
- Head of Client Success can access
- Head of EAs can access
- SUPER_ADMIN can access
- Can assign alerts to other users

## Requirements Summary

### Functional Requirements
- Kanban board with 4 columns
- Drag-and-drop functionality
- Alert cards with key information
- Filtering (severity, pairing, date, assignee)
- Alert detail view
- Alert assignment
- Alert notes
- Status updates

### Scope Boundaries
**In Scope:**
- Kanban board UI
- Drag and drop
- Filtering
- Alert details
- Notes and assignment

**Out of Scope:**
- Alert notifications (separate feature)
- Alert escalation (future feature)
- Alert analytics (future feature)

### Technical Considerations
- Drag-and-drop library (react-beautiful-dnd or @dnd-kit/core)
- Database: Alerts table
- Real-time updates (polling or websockets)
- Accessibility (keyboard navigation, screen readers)

