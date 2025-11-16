# Spec Requirements: Clients Dashboard

## Initial Description
List view of all clients with health indicators, active alert counts, filter for clients with issues, and click-through to pairing details.

## Requirements Discussion

### Dashboard Purpose
- For Head of Client Success role
- Overview of all clients and their health
- Quick identification of clients needing attention

### Client List View
- Table or card list showing all clients
- Columns/cards show:
  - Client name
  - Health indicator (🟢 Green | 🟡 Yellow | 🔴 Red)
  - Active alerts count (number)
  - Number of pairings
  - Last report date
  - Click to view client details

### Health Indicators
- Based on worst health status of client's pairings
- If any pairing is RED → Client shows RED
- If any pairing is YELLOW → Client shows YELLOW
- If all pairings GREEN → Client shows GREEN

### Active Alerts Count
- Sum of active alerts across all client's pairings
- Shows total count
- Color-coded by severity (if possible)

### Filtering
- "Show only clients with issues" filter
- Shows clients with RED or YELLOW health
- Or clients with active alerts

### Client Detail View
- Click client to see:
  - All pairings for this client
  - Health status of each pairing
  - Active alerts per pairing
  - Recent activity
  - Client information

### Access Control
- Head of Client Success role can access
- SUPER_ADMIN can access
- Other roles cannot access

## Requirements Summary

### Functional Requirements
- List view of all clients
- Health indicators per client
- Active alerts count
- Filter for clients with issues
- Click-through to client details
- Client detail view

### Scope Boundaries
**In Scope:**
- Client list view
- Health indicators
- Alert counts
- Filtering
- Client detail view

**Out of Scope:**
- Client editing (future feature)
- Client analytics (separate spec)
- Client communication history (future feature)

### Technical Considerations
- Role-based access (Head of Client Success, SUPER_ADMIN)
- Database: Clients, Pairings, Alerts tables
- Health Scoring System integration
- React table/card components

