# Spec Requirements: Coaching Notes System

## Initial Description
EA-level and pairing-level coaching notes with real-time updates, admin editing interface, and display on EA dashboard and report form.

## Requirements Discussion

### Two Types of Coaching Notes

**EA-Level Coaching Notes:**
- Single text field per EA
- General skill development, performance feedback
- Visible to EA on their dashboard
- Admins (Head of EAs, SUPER_ADMIN) can edit

**Pairing-Level Coaching Notes:**
- Single text field per pairing
- Client-specific guidance
- Visible to EA when submitting End of Day report for that client
- Admins (Head of Client Success, Head of EAs, SUPER_ADMIN) can edit

### Admin Editing Interface
- Edit coaching notes from:
  - EA Profile page (for EA-level notes)
  - Pairing Detail page (for pairing-level notes)
- Text area input
- Save button
- Real-time updates (EA sees changes immediately)

### Display Locations
- **EA Dashboard**: Shows EA-level coaching note
- **End of Day Report Form**: Shows pairing-level coaching note at top of form
- **EA Profile**: Shows EA-level note (editable)
- **Pairing Detail**: Shows pairing-level note (editable)

### Real-Time Updates
- When admin updates note, EA sees it immediately
- No page refresh needed
- Polling or websockets for updates
- Shows "Updated X minutes ago" (optional)

### Data Storage
- Stored in CoachingNotes table
- Unique constraint: One note per EA (EA-level), one note per pairing (pairing-level)
- Fields: noteType, eaId (nullable), pairingId (nullable), content, updatedBy, updatedAt

### Access Control
- Admins can edit (Head of EAs, Head of Client Success, SUPER_ADMIN)
- EAs can view (their own notes only)
- Real-time visibility for EAs

## Requirements Summary

### Functional Requirements
- EA-level coaching notes
- Pairing-level coaching notes
- Admin editing interface
- Display on EA dashboard
- Display on report form
- Real-time updates
- Access control

### Scope Boundaries
**In Scope:**
- Two types of notes
- Admin editing
- EA viewing
- Real-time updates

**Out of Scope:**
- Note history/versioning (future feature)
- Rich text editing (plain text for MVP)
- Note templates (future feature)

### Technical Considerations
- Database: CoachingNotes table
- Real-time updates (polling or websockets)
- Text area components
- Access control logic

