# Spec Requirements: Health Scoring System

## Initial Description
Calculate pairing health (Green/Yellow/Red) based on active alerts, report recency (2 business days), and manual override support.

## Requirements Discussion

### Health Calculation Logic

**🔴 RED (Critical) - Show Pairing as Red If:**
- Has active CRITICAL severity alert
- Missing reports (2+ business days)
- "Overwhelming" workload selected (from latest report)
- Client dissatisfaction detected
- Pay/compensation violation detected
- Trust breakdown from errors detected

**🟡 YELLOW (At Risk) - Show Pairing as Yellow If:**
- Has active HIGH severity alert
- Has 3+ active MEDIUM severity alerts
- No daily syncs (3+ days per week)
- Heavy OR light workload sustained
- No wins reported (10+ days)

**🟢 GREEN (Healthy) - Show Pairing as Green If:**
- No active CRITICAL or HIGH alerts
- Less than 3 MEDIUM alerts
- Regular report submissions (within 2 business days)
- PLUS bonus points for:
  - Specific wins reported regularly
  - Proactive communication detected
  - Consistent quality reporting

### Manual Override
- Admins can manually set pairing health status
- Overrides automatic calculation
- Stored in Pairings table: healthStatus, healthStatusOverride (boolean)
- Can clear override to return to automatic calculation

### Report Recency Check
- Check if report submitted within last 2 business days
- Business days = Monday-Friday (exclude weekends)
- If no report in 2+ business days → RED status

### Alert-Based Scoring
- Check active alerts for pairing
- Filter by severity (CRITICAL, HIGH, MEDIUM)
- Count alerts by severity
- Apply scoring logic based on alert counts and severities

### Calculation Frequency
- Calculate on-demand (when viewing pairing)
- Recalculate after:
  - New report submitted
  - New alert created
  - Alert resolved
  - Manual override changed

### Positive Indicators
- Can offset negative signals
- Examples: Specific wins, proactive communication, quality reporting
- Boost health score if present

## Requirements Summary

### Functional Requirements
- Calculate health status (Green/Yellow/Red)
- Check active alerts
- Check report recency (2 business days)
- Support manual override
- Consider positive indicators
- Real-time calculation

### Scope Boundaries
**In Scope:**
- Health calculation logic
- Manual override
- Report recency check
- Alert-based scoring

**Out of Scope:**
- Complex ML-based scoring (keep simple)
- Historical health trends (future feature)
- Health prediction (future feature)

### Technical Considerations
- Backend calculation function
- Database: Pairings, Alerts, EndOfDayReports tables
- Business day calculation
- Caching (optional, for performance)

