# Spec Requirements: Alert Rules Engine (Backend)

## Initial Description
Backend system to evaluate reports against enabled rules, detect immediate triggers and patterns over time, calculate alert severity, and create alert records.

## Requirements Discussion

### Rule Evaluation
- When report is submitted, evaluate against all enabled rules
- Two evaluation types:
  - **Logic Rules**: Fast, free pattern matching on structured fields
  - **AI Text Rules**: Claude API analysis (only if logic suggests risk)

### Immediate Trigger Detection
- Evaluate rules that fire on single reports
- Check structured fields (radio buttons, toggles)
- Instant evaluation (no API calls needed)

### Pattern-Over-Time Detection
- Track patterns across multiple reports
- Time windows: 3-day, 7-day, 14-day, 21-day
- Detect repeated occurrences
- Store pattern state in database or cache

### Alert Creation
- When rule fires, create Alert record
- Fields: pairingId, ruleId, severity, status (NEW), detectedAt, evidence
- Evidence stores: confidence, reasoning, quotes from text
- Link alert to pairing

### Severity Calculation
- Use severity from rule configuration
- Can be overridden by rule logic (some rules always CRITICAL)

### Optimization Strategies
- Run logic rules first (free, instant)
- Only call AI if logic rules suggest risk
- Batch multiple AI rules in single API call
- Cache results (don't re-analyze same report)

### Pattern State Management
- Track pattern occurrences over time
- Store in database or KV store
- Reset when pattern window expires
- Handle timezone correctly

### Integration Points
- Triggered after report submission
- Can be triggered manually (for testing)
- Integrates with AI Analysis Integration
- Creates alerts in Alerts table

## Requirements Summary

### Functional Requirements
- Evaluate reports against enabled rules
- Detect immediate triggers
- Detect patterns over time
- Create alert records
- Calculate severity
- Optimize AI API calls
- Manage pattern state

### Scope Boundaries
**In Scope:**
- Rule evaluation engine
- Alert creation
- Pattern detection
- Optimization

**Out of Scope:**
- Alert resolution workflow (separate feature)
- Alert notification system (separate feature)
- Advanced ML models (using Claude API only)

### Technical Considerations
- Backend API (Hono)
- Database: AlertRules, Alerts tables
- Claude API integration
- Pattern state storage (D1 or KV)
- Performance optimization

