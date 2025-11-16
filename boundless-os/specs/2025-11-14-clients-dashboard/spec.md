# Specification: Clients Dashboard

## Goal
Create dashboard for Head of Client Success showing all clients with health indicators, active alert counts, filtering capabilities, and click-through to client detail views for quick identification of clients needing attention.

## User Stories
- As Head of Client Success, I want to see all clients and their health status so that I can quickly identify which clients need attention
- As Head of Client Success, I want to filter clients with issues so that I can focus on relationships needing intervention
- As Head of Client Success, I want to see client details so that I can understand the full context of each relationship

## Specific Requirements

**Client List View**
- Table or card list displaying all clients from Clients table
- Columns/cards: Client name, Health indicator (🟢🟡🔴), Active alerts count (number), Number of pairings, Last report date
- Sortable columns (optional): Sort by name, health, alerts, last report
- Click row/card to navigate to client detail view
- Responsive design (desktop-first, mobile-friendly)

**Health Indicator Calculation**
- Calculate client health based on worst health status of client's pairings
- Query all pairings for client, get health status for each (from Health Scoring System)
- If any pairing is RED → Client shows RED
- If any pairing is YELLOW (and none RED) → Client shows YELLOW
- If all pairings GREEN → Client shows GREEN
- Display visual indicator: 🟢 Green | 🟡 Yellow | 🔴 Red

**Active Alerts Count**
- Sum of all active alerts (status != RESOLVED) across all client's pairings
- Query Alerts table, join with Pairings, filter by clientId
- Display total count, optionally color-coded by severity
- Show breakdown by severity if space allows (CRITICAL: X, HIGH: Y, MEDIUM: Z)

**Filtering Options**
- "Show only clients with issues" filter toggle
- Shows clients with RED or YELLOW health status
- Alternative: Shows clients with any active alerts
- Filter persists in URL or state for bookmarking
- Clear filter button

**Client Detail View**
- Full page showing client information and all pairings
- Display: Client name, All pairings for this client (list), Health status of each pairing, Active alerts per pairing (with details), Recent activity timeline, Client information (if stored)
- Pairing list shows: EA name, Health status, Active alerts count, Last report date
- Click pairing to navigate to pairing detail page

**Access Control**
- Head of Client Success role can access dashboard
- SUPER_ADMIN can access dashboard
- Other roles redirected to appropriate dashboards
- Protect route with role-based middleware

**Data Fetching**
- Use TanStack Query for server state management
- Fetch clients list with aggregated health and alert data
- Efficient queries using database indexes
- Handle loading and error states gracefully

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for dashboard layout patterns and table/card components.

## Existing Code to Leverage

**Dashboard Patterns**
- Follow ShadFlareAi repository dashboard layout patterns
- Use ShadcnUI Table or Card components for list display
- Follow similar filtering and sorting patterns
- Use Health Scoring System for health calculation

**Health Scoring Integration**
- Integrate with Health Scoring System for pairing health status
- Aggregate health statuses to calculate client health
- Use existing health calculation logic

## Out of Scope
- Client editing interface (future feature)
- Client analytics dashboard (separate spec)
- Client communication history (future feature)
- Client notes or tags (future feature)
- Client export functionality (future feature)
- Advanced client search (basic filtering only)
- Client activity feed (future feature)
- Client relationship timeline (future feature)

