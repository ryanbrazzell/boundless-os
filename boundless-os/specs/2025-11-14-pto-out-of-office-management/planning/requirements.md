# Spec Requirements: PTO/Out of Office Management

## Initial Description
Mark EAs as Out of Office with date ranges and reasons, suppress alerts during OOO periods, and show OOO indicators on dashboards.

## Requirements Discussion

### PTO Record Creation
- Admin interface to mark EA as Out of Office
- Fields:
  - EA (select from EA users)
  - Start Date (date picker)
  - End Date (date picker)
  - Reason (dropdown: PTO, Sick, Other)
- Creates record in PTORecords table

### Alert Suppression
- During OOO period, suppress alerts:
  - Late to shift alerts
  - Missing report alerts
  - Other attendance-related alerts
- Check PTORecords table when evaluating alerts
- If EA has active PTO covering date → suppress alert

### OOO Indicators
- Show "OOO" indicator on dashboards:
  - Assistants Dashboard (EA list)
  - Pairings Dashboard (if EA is OOO)
  - EA Dashboard (if currently OOO)
- Visual indicator (badge or icon)
- Shows date range (optional)

### Active PTO Check
- Check if EA has active PTO:
  - Current date between startDate and endDate
  - Query PTORecords table
  - Used by Start of Day Tracking and Alert Rules Engine

### PTO Management Interface
- View all PTO records
- Create new PTO record
- Edit PTO record (if needed)
- Delete PTO record (if needed)
- Accessible from EA Profile page

### Access Control
- Head of EAs can manage PTO
- SUPER_ADMIN can manage PTO
- Other roles cannot manage PTO

## Requirements Summary

### Functional Requirements
- Create PTO records
- Date range selection
- Reason selection
- Alert suppression during OOO
- OOO indicators on dashboards
- PTO management interface

### Scope Boundaries
**In Scope:**
- PTO record creation
- Alert suppression
- OOO indicators
- Management interface

**Out of Scope:**
- PTO approval workflow (future feature)
- PTO balance tracking (future feature)
- Recurring PTO (future feature)

### Technical Considerations
- Database: PTORecords table
- Alert suppression logic
- Date range checking
- Dashboard indicator components

