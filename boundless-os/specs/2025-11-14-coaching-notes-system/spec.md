# Specification: Coaching Notes System

## Goal
Implement two-tier coaching notes system (EA-level and pairing-level) with real-time updates, admin editing interface, and display on EA dashboard and report form.

## User Stories
- As Head of EAs, I want to set coaching notes for EAs so that they know what to focus on
- As an EA, I want to see coaching notes so that I understand expectations and guidance
- As Head of Client Success, I want to set client-specific coaching notes so that EAs get pairing-level guidance

## Specific Requirements

**Two Types of Coaching Notes**
- EA-Level: Single text field per EA, general skill development and performance feedback, stored in CoachingNotes table with noteType=EA_LEVEL, eaId set, pairingId null
- Pairing-Level: Single text field per pairing, client-specific guidance, stored in CoachingNotes table with noteType=PAIRING_LEVEL, pairingId set, eaId null
- Unique constraints: One note per EA (EA-level), one note per pairing (pairing-level)

**Admin Editing Interface**
- Edit from EA Profile page: Text area for EA-level coaching note, Save button, Real-time update indicator
- Edit from Pairing Detail page: Text area for pairing-level coaching note, Save button, Real-time update indicator
- Text area: Plain text input (no rich text for MVP), Character limit (optional, e.g., 1000 characters), Placeholder text with guidance
- Save updates CoachingNotes table: content, updatedBy (current user), updatedAt (timestamp)

**Display Locations**
- EA Dashboard: Show EA-level coaching note in Coaching Notes Card, Read-only display for EA, Real-time updates (polling or websockets)
- End of Day Report Form: Show pairing-level coaching note at top of form (above form fields), Card or banner format, Read-only display, Real-time updates
- EA Profile: Show EA-level note with edit capability (for admins), Read-only for EA
- Pairing Detail: Show pairing-level note with edit capability (for admins), Read-only for EA

**Real-Time Updates**
- When admin updates note, EA sees changes immediately (no page refresh)
- Implementation: Polling (every 30-60 seconds) or websockets (preferred if available)
- Show "Updated X minutes ago" timestamp (optional)
- Handle conflicts gracefully (last write wins)

**Data Storage**
- Store in CoachingNotes table: id, noteType (enum), eaId (nullable), pairingId (nullable), content (text), updatedBy (UUID), createdAt, updatedAt
- Unique constraints: (noteType, eaId) for EA-level, (noteType, pairingId) for pairing-level
- Foreign keys: eaId references Users, pairingId references Pairings, updatedBy references Users

**Access Control**
- Admins can edit: Head of EAs (EA-level and pairing-level), Head of Client Success (pairing-level), SUPER_ADMIN (all notes)
- EAs can view: Their own EA-level note, Pairing-level notes for their pairings
- Real-time visibility: EAs see updates immediately when admins change notes

**API Endpoints**
- GET /api/coaching-notes/ea/:eaId - Get EA-level note
- GET /api/coaching-notes/pairing/:pairingId - Get pairing-level note
- PUT /api/coaching-notes/ea/:eaId - Update EA-level note (admin only)
- PUT /api/coaching-notes/pairing/:pairingId - Update pairing-level note (admin only)
- Authorization checks: Verify user role before allowing edits

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for form patterns and text area components.

## Existing Code to Leverage

**ShadcnUI Components**
- Use ShadcnUI Textarea component for note input
- Use ShadcnUI Card component for note display
- Follow ShadcnUI form patterns for editing interface

**Real-Time Update Patterns**
- Use TanStack Query with polling or websockets
- Follow similar real-time update patterns from other features
- Handle update conflicts appropriately

## Out of Scope
- Note history/versioning (future feature - single note per type)
- Rich text editing (plain text for MVP)
- Note templates (future feature)
- Note categories or tags (future feature)
- Note attachments (future feature)
- Note notifications (EAs see notes on dashboard/form - no separate notifications)
- Note expiration dates (future feature)
- Note sharing between admins (future feature)

