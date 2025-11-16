# Specification: EA Dashboard

## Goal
Create card-based dashboard for EA role users showing status card, quick action buttons, coaching notes, company announcements, and resources for easy daily workflow access.

## User Stories
- As an EA, I want to see my status and quick actions so that I can start my day and submit reports efficiently
- As an EA, I want to see coaching notes so that I know what to focus on
- As an EA, I want to see company announcements so that I stay informed

## Specific Requirements

**Card-Based Layout**
- Use ShadcnUI Card components for visual organization
- Responsive grid layout (desktop-first, mobile-friendly)
- Clean, uncluttered interface with clear visual hierarchy
- Stripe/Linear/Notion quality design standards

**Status Card**
- Display on-time status for today (based on Start of Day log)
- Show healthcare eligibility date (if set in EA record)
- Visual indicator (green/yellow/red) for status
- Card header: "Your Status" or similar

**Quick Actions Section**
- "Start My Day" button (logs timestamp, triggers Start of Day Tracking)
- "Submit End of Day Report" button (navigates to report form)
- "View My Reports" button (shows last 30 days of reports)
- Button styling: Primary action buttons, clear labels

**Coaching Notes Card**
- Display current EA-level coaching note (from CoachingNotes table, noteType=EA_LEVEL)
- Real-time updates (polling or websockets - EA sees updates immediately when admin changes)
- Card header: "Coaching Notes"
- Text area display (read-only for EA)
- Show "Updated X minutes ago" timestamp (optional)

**Company Announcements Section**
- List of active company-wide announcements (CompanyAnnouncements table, isActive=true, not expired)
- Show title and content for each announcement
- Ordered by most recent first (createdAt DESC)
- Card or banner format
- Only show active, non-expired announcements

**Company Resources Section**
- Links section with: Handbook link, Training resources link, IT support link, Forms link
- Configurable links (stored in database/config or hardcoded for MVP)
- Clear link styling, opens in new tab or navigates appropriately

**Data Fetching**
- Use TanStack Query for server state management
- Fetch EA-specific data (status, coaching notes)
- Fetch company-wide data (announcements, resources)
- Handle loading and error states gracefully

**Access Control**
- EA role users only
- Redirect other roles to appropriate dashboards
- Protect route with role-based middleware

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for dashboard layout patterns and ShadcnUI card component usage.

## Existing Code to Leverage

**ShadFlareAi Dashboard Patterns**
- Study dashboard layout structure from ShadFlareAi repository
- Replicate card-based component organization
- Follow navigation and routing patterns
- Use similar state management patterns (Legend State + TanStack Query)

**ShadcnUI Card Components**
- Use ShadcnUI Card, CardHeader, CardTitle, CardContent components
- Follow ShadcnUI design system for spacing, typography, colors
- Ensure WCAG 2.1 AA accessibility compliance

## Out of Scope
- Report form (separate spec)
- Report history detail view (separate spec)
- Profile editing (future feature)
- Customizable dashboard layout (future feature)
- Notification center (future feature)
- Activity feed (future feature)
- Advanced analytics widgets (future feature)
- Mobile app (desktop-first for MVP)

