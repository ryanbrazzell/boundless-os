# Specification: Alert Management Kanban

## Goal
Create drag-and-drop Kanban board interface for triaging and managing alerts with four status columns, filtering capabilities, alert assignment, and detailed alert views with notes.

## User Stories
- As a CSM, I want to triage alerts in a Kanban board so that I can track which alerts need attention
- As a CSM, I want to assign alerts to team members so that work is distributed
- As a CSM, I want to add notes to alerts so that I can track investigation progress

## Specific Requirements

**Kanban Board Layout**
- Four columns: "New" (status=NEW), "Investigating" (status=INVESTIGATING), "Working On" (status=WORKING_ON), "Resolved" (status=RESOLVED)
- Columns display alert count badges
- Responsive layout (horizontal scroll on mobile if needed)
- Column headers show status name and count

**Alert Cards**
- Each card represents one alert from Alerts table
- Card displays: EA name, Client name, Alert type (rule name from AlertRules), Severity badge (CRITICAL/HIGH/MEDIUM/LOW with color coding), Date created (formatted), Assignee name (if assigned)
- Color-coded by severity: CRITICAL (red), HIGH (orange), MEDIUM (yellow), LOW (blue)
- Hover effect shows more details
- Click card to open alert detail view

**Drag and Drop Functionality**
- Use react-beautiful-dnd or @dnd-kit/core library
- Drag alert cards between columns
- Update alert status automatically on drop
- Smooth animations during drag (200-300ms transitions)
- Visual feedback during drag (card opacity, column highlight)
- Accessible: Keyboard navigation support, screen reader announcements

**Filtering Options**
- Filter by severity: CRITICAL, HIGH, MEDIUM, LOW (multi-select checkboxes)
- Filter by pairing: Dropdown/select EA-Client pairing
- Filter by date range: Date picker for start and end dates
- Filter by assignee: Dropdown/select user (CSMs, admins)
- Multiple filters can be active simultaneously
- Filter state persists in URL or local state
- Clear filters button

**Alert Detail View**
- Modal or side panel showing full alert information
- Display: Full alert information (all fields), Rule that triggered it (rule name, description), Evidence (quotes, confidence score, reasoning from evidence JSONB), Pairing details (EA, Client, health status), Related reports (reports that contributed to this alert), Notes section (add/edit notes, note history), Assignment section (assign to user dropdown), Status controls (change status dropdown), Resolve button (sets status=RESOLVED)
- Close button or click outside to dismiss

**Alert Assignment**
- Assign alerts to users (CSMs, Head of Client Success, Head of EAs, SUPER_ADMIN)
- Dropdown/select user in alert detail view
- Update Alerts.assignedTo field
- Show assignee name on alert card
- Filter by assignee in Kanban board
- Unassign option (set assignedTo to null)

**Alert Notes**
- Add notes to alerts (text area in alert detail view)
- Edit existing notes (if single note) or add multiple notes (if note history supported)
- Store in Alerts.notes field (text) or separate Notes table (if history needed)
- Notes visible in alert detail view
- Show note author and timestamp if multiple notes supported

**Status Updates**
- Update alert status via drag-and-drop or detail view
- Status options: NEW, INVESTIGATING, WORKING_ON, RESOLVED
- Update Alerts.status field
- Optional: Set resolvedAt timestamp when status=RESOLVED
- Status change triggers UI update (card moves to new column)

**Access Control**
- Head of Client Success can access Kanban board
- Head of EAs can access Kanban board
- SUPER_ADMIN can access Kanban board
- Can assign alerts to other users (within role permissions)
- Protect route with role-based middleware

**Real-Time Updates**
- Polling or websockets for real-time alert updates
- Update board when new alerts created
- Update board when alert status changes (from other users)
- Show "Updated X seconds ago" indicator (optional)

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for Kanban board patterns and drag-and-drop implementations.

## Existing Code to Leverage

**Drag-and-Drop Library**
- Use react-beautiful-dnd or @dnd-kit/core (evaluate both for accessibility)
- Follow library best practices for smooth animations
- Ensure keyboard navigation and screen reader support

**Alert Data Structure**
- Use Alerts table structure from Database Schema spec
- Follow alert creation patterns from Alert Rules Engine
- Integrate with existing alert data

## Out of Scope
- Alert notifications (email/Slack - separate feature)
- Alert escalation (future feature)
- Alert analytics and reporting (future feature)
- Alert templates (future feature)
- Bulk alert operations (future feature)
- Alert comments/threading (notes are sufficient for MVP)
- Alert due dates (future feature)
- Alert priority beyond severity (future feature)

