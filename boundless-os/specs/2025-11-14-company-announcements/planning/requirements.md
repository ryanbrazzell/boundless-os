# Spec Requirements: Company Announcements

## Initial Description
Create, edit, activate/deactivate company-wide announcements with title, content, optional expiration dates, and display on all EA dashboards.

## Requirements Discussion

### Announcement Creation
- Admin interface to create announcements
- Fields:
  - Title (text input)
  - Content (text area)
  - Expiration Date (optional, date picker)
  - Active Status (toggle, default: active)

### Announcement Management
- List view of all announcements
- Edit announcements
- Activate/deactivate toggle
- Delete announcements (if needed)

### Display on EA Dashboards
- Show active announcements on all EA dashboards
- Only show if:
  - isActive = true
  - expiresAt is null OR expiresAt > current date
- Display format: Card or banner
- Ordered by most recent first

### Announcement Display
- Show title and content
- Optional: "Dismiss" button (if needed)
- Optional: Expiration date display

### Access Control
- SUPER_ADMIN can create/edit announcements
- Head of Client Success can create/edit (if needed)
- Head of EAs can create/edit (if needed)
- EAs can only view

### Data Storage
- Stored in CompanyAnnouncements table
- Fields: title, content, isActive, expiresAt, createdBy, createdAt, updatedAt

## Requirements Summary

### Functional Requirements
- Create announcements
- Edit announcements
- Activate/deactivate toggle
- Expiration date support
- Display on EA dashboards
- Management interface

### Scope Boundaries
**In Scope:**
- Announcement CRUD
- Active/inactive toggle
- Expiration dates
- Display on dashboards

**Out of Scope:**
- Rich text editing (plain text for MVP)
- Announcement categories (future feature)
- Targeted announcements (future feature)

### Technical Considerations
- Database: CompanyAnnouncements table
- Admin interface components
- Dashboard display components
- Expiration date checking

