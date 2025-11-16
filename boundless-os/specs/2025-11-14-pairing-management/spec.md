# Specification: Pairing Management

## Goal
Create admin interface for creating, viewing, editing, and managing EA-Client pairings with start dates, accelerator status, health indicators, and manual override capabilities.

## User Stories
- As Head of Client Success, I want to create EA-Client pairings so that relationships are tracked in the system
- As an admin, I want to see pairing health status so that I know which relationships need attention
- As an admin, I want to manually override health status so that I can handle false positives

## Specific Requirements

**Pairing Creation Interface**
- Admin form to create new pairings
- Fields: EA (dropdown/select from EA users), Client (dropdown/select or create new), Start Date (date picker), Accelerator Enabled (checkbox)
- If accelerator enabled: Show Week 1-4 Goals fields (4 text areas)
- Form validation: EA and Client required, start date required, valid date format
- Submit creates pairing in database with all fields

**Pairing List View**
- Table or card list showing all pairings
- Columns/cards: EA name, Client name, Start date, Health status (🟢🟡🔴), Accelerator status, Last report date
- Sortable columns (optional)
- Click row/card to view detailed pairing page
- Filter by EA, Client, Health status, Accelerator status

**Pairing Edit Interface**
- Edit existing pairing details
- Update start date (with validation)
- Toggle accelerator on/off (show/hide goals fields)
- Edit accelerator weekly goals (4 text fields)
- Update health status with manual override toggle
- Save changes to database

**Health Status Display**
- Visual indicators: 🟢 Green | 🟡 Yellow | 🔴 Red
- Calculated by Health Scoring System (automatic)
- Can be manually overridden by admin (healthStatusOverride flag)
- Show override indicator when manual override is active
- Clear override button to return to automatic calculation

**Accelerator Management**
- Enable/disable accelerator checkbox on pairing
- When enabled: Show 4 weekly goal text fields (Week 1-4 Goals)
- Week progression buttons: Week 1 → Week 2 → Week 3 → Week 4 → Complete
- Store acceleratorWeek (1, 2, 3, 4, null for complete)
- Display accelerator status in list view and detail view

**Pairing Detail Page**
- Full pairing information display
- Health status with manual override controls
- Recent reports list (last 10-20 reports)
- Active alerts list with details
- Accelerator progress and goals display
- Coaching notes (pairing-level) display and edit
- Edit pairing button
- Delete pairing (optional, soft delete)

**Access Control**
- Head of Client Success can create/edit pairings
- Head of EAs can view/edit pairings
- SUPER_ADMIN can do everything
- Other roles cannot access pairing management

**Data Storage**
- Store in Pairings table with all fields
- Foreign key relationships to Users (EA) and Clients
- Unique constraint: (eaId, clientId) prevents duplicate pairings
- Timestamps for created/updated tracking

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for admin interface patterns and form layouts.

## Existing Code to Leverage

**Admin Interface Patterns**
- Follow ShadFlareAi repository patterns for admin forms and tables
- Use ShadcnUI Form, Input, Select, DatePicker components
- Follow similar CRUD interface patterns from other admin features

**Health Scoring System Integration**
- Integrate with Health Scoring System for automatic health calculation
- Display health status from calculated values
- Support manual override functionality

## Out of Scope
- Pairing deletion (use soft delete flag if needed)
- Pairing history/audit trail (future feature)
- Bulk pairing operations (separate CSV import spec)
- Pairing templates (future feature)
- Pairing analytics (separate spec)
- Pairing communication history (future feature)
- Advanced filtering and search (basic filtering only)

