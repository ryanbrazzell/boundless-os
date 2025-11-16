# Specification: Report History & Analytics

## Goal
Provide EA view of their own report history (last 30 days) and admin views of report trends with basic analytics and visualizations for CSM insights.

## User Stories
- As an EA, I want to view my report history so that I can see what I've submitted
- As Head of Client Success, I want to see report trends so that I can understand relationship patterns
- As a CSM, I want basic analytics so that I can identify trends and insights

## Specific Requirements

**EA Report History View**
- EA can view their own reports (last 30 days by default)
- Display format: List or table showing: Date, Client name (from pairing), Summary fields (workloadFeeling, workType, biggestWin preview - first 50 chars), Click to view full report details
- Filtering: Filter by date range (date picker for start and end dates), Filter by client/pairing (dropdown select), Clear filters button
- Pagination: Show 20-30 reports per page, Load more or pagination controls
- Access control: EA can only view their own reports (eaId matches logged-in user)

**Admin Report Trends View**
- Admins can view report trends across: All EAs, Specific EA (dropdown select), All clients, Specific client (dropdown select), All pairings, Specific pairing (dropdown select)
- Time period selection: Last 7 days, Last 30 days, Last 90 days, Custom date range
- Display trends: Report submission rate over time (line chart), Workload distribution (pie/bar chart), Mood distribution (pie/bar chart), Daily sync frequency (bar chart)
- Basic charts using Recharts library: Line charts for trends, Pie/bar charts for distributions

**Basic Analytics Calculations**
- Report submission rates: Total reports submitted, Average reports per EA, Reports per day trend
- Workload trends: Distribution of workloadFeeling (Light, Moderate, Heavy, Overwhelming), Trend over time
- Mood trends: Distribution of feelingDuringWork (Great, Good, Okay, Stressed), Trend over time
- Daily sync frequency: Percentage of reports with hadDailySync=true, Trend over time
- Win reporting frequency: Percentage of reports with non-empty biggestWin, Trend over time

**Analytics Dashboard**
- Overview metrics cards: Total reports submitted (number), Average reports per EA (number), Workload distribution (pie chart), Mood distribution (pie chart), Daily sync rate (percentage)
- Time period selector: Dropdown or buttons (7 days, 30 days, 90 days, custom)
- Charts section: Workload trend over time (line chart), Mood trend over time (line chart), Report submission trend (line chart)
- Filter by EA, Client, or Pairing (optional filters)

**Report Detail View**
- Click report in history to view full details
- Display all 10 report fields: Workload feeling, Work type, Feeling during work, Biggest win (full text), What completed (full text), Pending tasks, Daily sync, Difficulties, Support needed, Additional notes
- Show pairing information: EA name, Client name, Report date
- Read-only view (reports are immutable)

**Data Fetching**
- Use TanStack Query for efficient data fetching and caching
- API endpoints: GET /api/reports/history?eaId=&limit=30&offset=0&startDate=&endDate=&pairingId=, GET /api/reports/:reportId, GET /api/analytics/trends?eaId=&clientId=&pairingId=&period=
- Efficient queries using database indexes
- Handle loading and error states

**Access Control**
- EAs: View own reports only (last 30 days), Filter by own pairings only
- Admins: View all reports, View all analytics, Filter by any EA/Client/Pairing
- Role-based access enforced in API endpoints

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for chart patterns and Recharts usage.

## Existing Code to Leverage

**Recharts Library**
- Use Recharts for chart visualizations
- Follow Recharts patterns for line charts, pie charts, bar charts
- Ensure charts are responsive and accessible

**Report Data Structure**
- Use EndOfDayReports table structure from Database Schema spec
- Follow existing report query patterns
- Use existing indexes for performance

## Out of Scope
- Advanced analytics (predictive analytics, ML insights - future feature)
- Custom reports builder (future feature)
- Data export (CSV/Excel - future feature)
- Report comparison (future feature)
- Advanced filtering (basic filtering only)
- Report annotations (future feature)
- Report sharing (future feature)
- Real-time analytics (batch calculations only)

