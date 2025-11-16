# Spec Requirements: Report History & Analytics

## Initial Description
EA view of their own report history (last 30 days), admin views of report trends, and basic analytics for CSM insights.

## Requirements Discussion

### EA Report History View
- EA can view their own reports (last 30 days)
- Display: Date, Client name, summary of key fields
- Click to view full report details
- Filter by date range
- Filter by client/pairing
- Simple list or table view

### Admin Report Trends View
- Admins can view report trends across:
  - All EAs
  - Specific EA
  - All clients
  - Specific client
  - All pairings
  - Specific pairing
- Show trends over time
- Basic charts/graphs (optional)

### Basic Analytics
- Report submission rates
- Workload trends (light/moderate/heavy/overwhelming)
- Mood trends (great/good/okay/stressed)
- Daily sync frequency
- Win reporting frequency
- Basic visualizations (charts)

### Analytics Dashboard
- Overview metrics:
  - Total reports submitted
  - Average reports per EA
  - Workload distribution
  - Mood distribution
- Time period selection (last 7 days, 30 days, 90 days)
- Export data (optional, future feature)

### Access Control
- EAs: View own reports only (last 30 days)
- Admins: View all reports and analytics
- Role-based access

## Requirements Summary

### Functional Requirements
- EA report history view (last 30 days)
- Admin report trends view
- Basic analytics
- Analytics dashboard
- Filtering options
- Basic visualizations

### Scope Boundaries
**In Scope:**
- Report history view
- Basic analytics
- Trend visualization
- Filtering

**Out of Scope:**
- Advanced analytics (future feature)
- Custom reports (future feature)
- Data export (future feature)
- Predictive analytics (future feature)

### Technical Considerations
- Database: EndOfDayReports table
- Analytics calculations
- Chart library (Recharts)
- Filtering logic
- Role-based access

