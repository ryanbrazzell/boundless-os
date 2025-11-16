# Specification: Company Announcements

## Goal
Enable admins to create, edit, and manage company-wide announcements with expiration dates, and display active announcements on all EA dashboards.

## User Stories
- As SUPER_ADMIN, I want to create company announcements so that all EAs see important updates
- As an EA, I want to see company announcements on my dashboard so that I stay informed
- As an admin, I want to set expiration dates so that announcements automatically become inactive

## Specific Requirements

**Announcement Creation**
- Admin interface to create announcements (accessible from admin dashboard or settings)
- Form fields: Title (text input, required), Content (text area, required), Expiration Date (optional, date picker), Active Status (toggle/switch, default: active)
- Validation: Title and content required, expiration date must be future date (if set)
- Submit creates record in CompanyAnnouncements table: title, content, isActive (boolean, default true), expiresAt (timestamp, nullable), createdBy (current user), createdAt, updatedAt

**Announcement Management**
- List view of all announcements: Table showing title, content preview, active status, expiration date, created date, actions (edit, delete, toggle active)
- Edit announcements: Update title, content, expiration date, active status
- Activate/deactivate toggle: Quick toggle to activate or deactivate announcement
- Delete announcements: Remove announcement (with confirmation dialog)
- Filter by active status, expiration status (active, expired, upcoming)

**Display on EA Dashboards**
- Show active announcements on all EA dashboards (EA Dashboard component)
- Display logic: Only show if isActive=true AND (expiresAt is null OR expiresAt > current date)
- Display format: Card or banner above dashboard content, Show title and content, Ordered by most recent first (createdAt DESC), Multiple announcements stacked vertically
- Optional: "Dismiss" button per announcement (if needed, store dismissal in localStorage or database)

**Announcement Display Format**
- Card component with: Title (heading), Content (text), Expiration date display (if set: "Expires on [date]"), Dismiss button (optional)
- Styling: Consistent with dashboard design, Stripe/Linear/Notion quality, Accessible (keyboard navigation, screen readers)

**Access Control**
- SUPER_ADMIN can create/edit/delete announcements
- Head of Client Success can create/edit (if needed, configurable)
- Head of EAs can create/edit (if needed, configurable)
- EAs can only view (on their dashboard)
- Protect management routes with role-based middleware

**Data Storage**
- Store in CompanyAnnouncements table: id, title (text), content (text), isActive (boolean), expiresAt (timestamp nullable), createdBy (UUID, foreign key to Users), createdAt, updatedAt
- Index on (isActive, expiresAt) for efficient active announcement queries
- Support multiple active announcements simultaneously

**Expiration Handling**
- Check expiration dates when displaying announcements
- Expired announcements automatically don't display (even if isActive=true)
- Optional: Background job to set isActive=false when expired (or rely on display logic)
- Display "Expires on [date]" if expiration date set and in future

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for card components and announcement display patterns.

## Existing Code to Leverage

**Dashboard Integration**
- Integrate with EA Dashboard spec for announcement display
- Use ShadcnUI Card component for announcement cards
- Follow dashboard layout patterns from ShadFlareAi repository

**Admin Interface Patterns**
- Follow ShadFlareAi repository patterns for admin forms and tables
- Use ShadcnUI Form, Input, Textarea, Switch, DatePicker components
- Follow similar CRUD interface patterns

## Out of Scope
- Rich text editing (plain text for MVP)
- Announcement categories or tags (future feature)
- Targeted announcements (all EAs see all active announcements)
- Announcement attachments (future feature)
- Announcement read receipts (future feature)
- Announcement scheduling (future feature - create and activate immediately)
- Announcement templates (future feature)
- Announcement analytics (views, reads - future feature)

