# Spec Requirements: EA Dashboard

## Initial Description
Card-based dashboard showing status card, quick actions (Start My Day, Submit Report), coaching notes, company announcements, and resources.

## Requirements Discussion

### Dashboard Layout
Card-based layout with the following sections:

**Status Card:**
- On-time status today (based on Start of Day log)
- Healthcare eligibility date (if set)
- Visual indicator (green/yellow/red) for status

**Quick Actions:**
- "Start My Day" button (logs timestamp, checks against expected show-up time)
- "Submit End of Day Report" button (navigates to report form)
- "View My Reports" button (shows last 30 days of reports)

**Coaching Notes Card:**
- Single text field showing current EA-level coaching note
- Real-time updates (when admin updates, EA sees it immediately)
- Display format: Card with heading "Coaching Notes" and content below

**Company Announcements:**
- List of active company-wide announcements
- Shows title and content
- Only active announcements (isActive=true, not expired)
- Ordered by most recent first

**Company Resources:**
- Links section with:
  - Handbook link
  - Training resources link
  - IT support link
  - Forms link
- Configurable links (stored in database or config)

### User Context
- EA role users see this dashboard after login
- Dashboard is main landing page for EAs
- All data is specific to the logged-in EA

### Data Sources
- Start of Day logs (for status)
- EA record (for healthcare eligibility date, expected show-up time)
- Coaching Notes (EA-level)
- Company Announcements (active only)
- End of Day Reports (for "View My Reports")

### Design Requirements
- Card-based layout (ShadcnUI Card components)
- Responsive design (desktop-first, mobile-friendly)
- Stripe/Linear/Notion quality design
- Clean, uncluttered interface
- Clear visual hierarchy

## Requirements Summary

### Functional Requirements
- Status card with on-time status and healthcare eligibility
- Quick action buttons (Start My Day, Submit Report, View Reports)
- Coaching notes display (real-time updates)
- Company announcements list (active only)
- Company resources links section
- EA-specific data display

### Scope Boundaries
**In Scope:**
- Card-based layout
- Status display
- Quick actions
- Coaching notes display
- Announcements display
- Resources links

**Out of Scope:**
- Report form (separate spec)
- Report history detail view (separate spec)
- Profile editing (future feature)

### Technical Considerations
- React components (ShadcnUI)
- TanStack Query for data fetching
- Real-time updates for coaching notes (polling or websockets)
- Role-based access (EA role only)

