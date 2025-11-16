# Spec Requirements: Churn Detection System

## Initial Description
AI-powered churn detection system that analyzes EA daily reports using two types of rules: Logic Rules (fast, free pattern matching on structured fields) and AI Text Rules (Claude API analyzes text fields for patterns and sentiment). The system automatically detects churn risk patterns and triggers prioritized alerts when risk is detected.

## Complete System Documentation

### System Overview

The churn detection system analyzes EA daily reports using two types of rules:

- **Logic Rules**: Fast, free pattern matching on structured fields (radio buttons, toggles)
- **AI Text Rules**: Claude API analyzes text fields for patterns and sentiment

Each rule has:

- Clear trigger condition - What makes it fire
- Data source - Which field(s) to check
- Business rationale - Why it matters for churn detection
- Severity level - CRITICAL | HIGH | MEDIUM | LOW
- Adjustable thresholds - Admins can tune sensitivity
- Default status - Enabled or disabled out of the box

---

### CRITICAL RED FLAGS (Immediate Escalation)

**RULE #1: Report Not Submitted**

- Type: Logic
- Trigger: No EOD report submitted for 1+ business days
- Data Source: Report submission timestamps
- Why It Matters: EA abandonment, severe crisis, or client relationship already ended
- Severity: CRITICAL
- Adjustable Threshold: Number of days (default: 1)
- Default Status: ENABLED

**RULE #2: Overwhelming Workload Crisis**

- Type: Logic
- Trigger: Workload feeling = "Overwhelming - need help"
- Data Source: "How's your workload feeling?" field
- Why It Matters: EA burnout imminent - needs immediate support or will quit/fail
- Severity: CRITICAL
- Adjustable Threshold: None (any instance is critical)
- Default Status: ENABLED

**RULE #3: No Work Available Pattern**

- Type: Logic
- Trigger: Work type = "Not much work today" for 3+ days in a 7-day period
- Data Source: "What type of work did you do today?" field
- Why It Matters: Client not delegating - no ROI - client won't renew if they're not using the service
- Severity: CRITICAL
- Adjustable Thresholds:
  - Days threshold (default: 3)
  - Period window (default: 7 days)
- Default Status: ENABLED

**RULE #4: Health/Stress Crisis**

- Type: Logic
- Trigger: Feeling = "Not great - felt sick/stressed" for 2+ consecutive days
- Data Source: "How did you feel during work today?" field
- Why It Matters: EA reliability at risk - will lead to poor performance and client dissatisfaction
- Severity: CRITICAL
- Adjustable Threshold: Consecutive days (default: 2)
- Default Status: ENABLED

**RULE #5: Empty Client Reports Pattern**

- Type: Logic
- Trigger: "What did you complete today?" field is empty or <10 words for 3+ consecutive days
- Data Source: "What did you complete today?" field (client-facing)
- Why It Matters: EA disengagement OR no work being done - either way, client sees no value
- Severity: CRITICAL
- Adjustable Thresholds:
  - Minimum words (default: 10)
  - Consecutive days (default: 3)
- Default Status: ENABLED

**RULE #6: Client Dissatisfaction Detected**

- Type: AI Text Analysis
- Trigger: AI detects client dissatisfaction language in text fields
- Data Source: "Difficulties", "Support needed", "Additional notes", "What completed"
- AI Patterns to Detect:
  - "client dissatisfied", "client unhappy", "client complained"
  - "not worth it", "takes too long to explain", "easier myself"
  - "client wants to cancel", "client frustrated with me"
  - "client mentioned ending", "client reconsidering"
- Why It Matters: Direct churn signal from client expressing dissatisfaction
- Severity: CRITICAL
- Adjustable: Add/remove patterns, change severity
- Default Status: ENABLED

**RULE #7: Pay/Compensation Boundary Violation**

- Type: AI Text Analysis
- Trigger: EA mentions sharing pay rates with client OR client brings up pay comparisons
- Data Source: "Additional notes", "Support needed", "Difficulties"
- AI Patterns to Detect:
  - "told client my pay", "client asked about my salary"
  - "discussed compensation with client", "client compared my pay"
  - "pay rate", "hourly rate", "what I'm paid"
- Why It Matters: Professional boundary breach that damages relationship and violates company policy
- Severity: CRITICAL
- Adjustable: Add/remove patterns
- Default Status: ENABLED

**RULE #8: Trust Breakdown from Errors**

- Type: AI Text Analysis
- Trigger: Client mentions EA mistakes requiring rework OR EA reports making errors 3+ times per week
- Data Source: "Difficulties", "Additional notes", "What completed"
- AI Patterns to Detect:
  - "made a mistake", "had to redo", "client said it was wrong"
  - "error", "incorrect", "messed up", "fix my mistake"
  - "client frustrated with mistake", "lost trust"
- Why It Matters: Trust erosion from repeated errors leads directly to churn
- Severity: CRITICAL
- Adjustable Threshold: Errors per week (default: 3)
- Default Status: ENABLED

---

### HIGH-RISK PATTERNS (Action Needed This Week)

**RULE #9: No Daily Sync Meetings**

- Type: Logic
- Trigger: Daily sync = "No" for 3+ days per week
- Data Source: "Did you have a Daily Sync call?" field
- Why It Matters: Client-EA disconnection - lack of communication leads to misalignment
- Severity: HIGH
- Adjustable Threshold: Days per week (default: 3 out of 7)
- Default Status: ENABLED

**RULE #10: Recurring Blockers**

- Type: AI Text Analysis (Pattern Matching)
- Trigger: Same issue mentioned in "Difficulties" field 3+ times in 7 days
- Data Source: "Did anything make work difficult today?" field
- AI Analysis: Detect repeated mentions of same blocker/problem using semantic similarity
- Why It Matters: Systemic problems not being resolved - frustration building
- Severity: HIGH
- Adjustable Threshold: Mentions (default: 3 in 7 days)
- Default Status: ENABLED

**RULE #11: Heavy Workload Sustained**

- Type: Logic
- Trigger: Workload = "Heavy - but manageable" for 5+ consecutive days
- Data Source: "How's your workload feeling?" field
- Why It Matters: EA heading toward burnout - "manageable" today becomes "overwhelming" soon
- Severity: HIGH
- Adjustable Threshold: Consecutive days (default: 5)
- Default Status: ENABLED

**RULE #12: Light Workload Pattern**

- Type: Logic
- Trigger: Workload = "Light - have extra capacity" for 5+ consecutive days
- Data Source: "How's your workload feeling?" field
- Why It Matters: Underutilization - client not seeing value or not using service properly
- Severity: HIGH
- Adjustable Threshold: Consecutive days (default: 5)
- Default Status: ENABLED

**RULE #13: No Wins Reported**

- Type: Logic
- Trigger: "Biggest win" field is empty, "none", or "nothing" for 10 business days (2 weeks)
- Data Source: "What was your biggest win today?" field
- Why It Matters: EA morale issue OR lack of meaningful work - either way, relationship in trouble
- Severity: HIGH
- Adjustable Threshold: Days (default: 10 business days)
- Default Status: ENABLED

**RULE #14: EA Pay/Promotion Concerns**

- Type: AI Text Analysis
- Trigger: EA raises concerns about pay, promotion, or career growth
- Data Source: "Support needed", "Additional notes"
- AI Patterns to Detect:
  - "promotion", "career growth", "advancement"
  - "pay raise", "compensation increase", "more money"
  - "other opportunities", "job offer", "considering leaving"
- Why It Matters: EA considering other opportunities - retention risk
- Severity: HIGH
- Default Status: ENABLED

**RULE #15: Client Holding Too Much Work**

- Type: AI Text Analysis
- Trigger: EA reports "waiting for client" frequently OR mentions client not delegating enough
- Data Source: "Difficulties", "Pending tasks"
- AI Patterns to Detect:
  - "waiting for client", "client hasn't sent work", "no tasks from client"
  - "client doing it themselves", "client not delegating"
  - "not enough to do", "waiting on client response"
- Why It Matters: Client not using service properly - won't see value and will churn
- Severity: HIGH
- Adjustable Threshold: Frequency (default: 3+ mentions in 7 days)
- Default Status: ENABLED

---

### MEDIUM-RISK WARNING SIGNS (Monitor Closely)

**RULE #16: Surface-Level Reporting**

- Type: AI Text Analysis + Logic
- Trigger: "What completed" field consistently thin (<50 words) OR uses similar text 3+ days
- Data Source: "What did you complete today?" field
- Logic Check: Word count < 50
- AI Analysis: Detect low detail, copy-paste behavior (>80% text similarity), generic descriptions
- Why It Matters: Low engagement, lazy reporting, or truly minimal work being done
- Severity: MEDIUM
- Adjustable Thresholds:
  - Word count (default: 50)
  - Similarity threshold (default: 80%)
  - Days (default: 3)
- Default Status: ENABLED

**RULE #17: Only Routine Work**

- Type: Logic
- Trigger: Work type = "Regular tasks I always do" for 7+ consecutive days
- Data Source: "What type of work did you do today?" field
- Why It Matters: No growth in responsibilities - client not expanding EA's role
- Severity: MEDIUM
- Adjustable Threshold: Consecutive days (default: 7)
- Default Status: ENABLED

**RULE #18: Pending Tasks Accumulation**

- Type: AI Text Analysis (Pattern Matching)
- Trigger: Same items appear in "Pending tasks" field for 5+ consecutive days
- Data Source: "Which projects/tasks are pending?" field
- AI Analysis: Detect repeated mentions of same pending items using semantic similarity
- Why It Matters: EA stuck or blocked on projects - not making progress
- Severity: MEDIUM
- Adjustable Threshold: Days (default: 5)
- Default Status: ENABLED

**RULE #19: Support Requests Ignored**

- Type: AI Text Analysis (Pattern Matching)
- Trigger: Same request in "Support needed" appears multiple times without resolution
- Data Source: "Anything we can do to support you?" field
- AI Analysis: Track repeated support requests (same issue mentioned 2+ times)
- Why It Matters: Company not supporting EA properly - EA will become frustrated
- Severity: MEDIUM
- Adjustable Threshold: Repeated requests (default: 2+ same request)
- Default Status: ENABLED

**RULE #20: Energy Decline Pattern**

- Type: Logic
- Trigger: Feeling = "Not great - stressed/sick" more than once per week (2+ in 7 days)
- Data Source: "How did you feel during work today?" field
- Why It Matters: EA morale declining - early warning before crisis
- Severity: MEDIUM
- Adjustable Threshold: Occurrences per week (default: 2 in 7 days)
- Default Status: ENABLED

**RULE #21: Grammar/Communication Quality Issues**

- Type: AI Text Analysis
- Trigger: EOD reports contain multiple typos, grammar errors, or unclear communication
- Data Source: All text fields in EOD report
- AI Analysis: Assess writing quality, grammar, clarity
- Why It Matters: Professionalism concerns, potential language barriers affecting client communication
- Severity: MEDIUM
- Adjustable Threshold: Error count threshold
- Default Status: DISABLED (can be sensitive, enable if needed)

**RULE #22: Non-ROI Task Focus**

- Type: AI Text Analysis
- Trigger: EA primarily doing low-value tasks (basic admin, personal errands only, no strategic work)
- Data Source: "What completed" field
- AI Analysis: Categorize tasks - flag if no email/calendar/project management mentioned
- AI Patterns to Detect:
  - Mostly: filing, basic data entry, personal errands
  - Missing: email management, calendar, meeting prep, project coordination
- Why It Matters: Not delivering core value proposition - client won't see ROI
- Severity: MEDIUM
- Adjustable: Define what counts as "strategic" vs "administrative"
- Default Status: ENABLED

**RULE #23: Life/Infrastructure Challenges**

- Type: AI Text Analysis
- Trigger: EA mentions personal challenges affecting work
- Data Source: "Difficulties", "Additional notes", "Support needed"
- AI Patterns to Detect:
  - Financial: "money problems", "financial stress", "emergency expenses"
  - Health: "couldn't sleep", "exhausted", "sick", "health issues"
  - Family: "childcare problems", "family emergency", "taking care of family"
  - Tech: "computer problems", "software issues", "internet down" (repeated)
  - Environment: "power outage", "weather", "natural disaster"
- Why It Matters: External factors affecting EA reliability and performance
- Severity: MEDIUM (context-dependent)
- Note: One mention is different from pattern - look for repeated issues
- Default Status: ENABLED

---

### POSITIVE INDICATORS (Success Signals)

These rules identify thriving relationships and can offset negative signals.

**RULE #24: Specific Wins Reported**

- Type: AI Text Analysis (Positive Signal)
- Trigger: EA describes concrete accomplishments with details, metrics, or clear outcomes
- Data Source: "Biggest win" field
- AI Analysis: Assess specificity, detail level, measurable outcomes
- Good Example: "Scheduled 5 client meetings for next week, cleared inbox to zero, completed Q1 expense report"
- Bad Example: "Worked on stuff", "Busy day", "Did tasks"
- Why It Matters: Indicates engagement, meaningful work, and EA taking pride in accomplishments
- Use: Counterbalance negative signals, identify thriving relationships
- Default Status: ENABLED

**RULE #25: Proactive Communication**

- Type: AI Text Analysis (Positive Signal)
- Trigger: EA suggests improvements, identifies opportunities, anticipates needs
- Data Source: "What completed", "Biggest win", "Additional notes"
- AI Patterns to Detect:
  - "suggested to client", "proposed solution", "identified opportunity"
  - "streamlined process", "implemented new system", "automated"
- Why It Matters: Shows strategic thinking and ownership - high-value EA behavior
- Use: Identify exceptional EAs and successful relationships
- Default Status: ENABLED

**RULE #26: Consistent Quality Reporting**

- Type: AI Text Analysis + Logic (Positive Signal)
- Trigger: Reports >100 words in "What completed" field with specific tasks and outcomes
- Data Source: "What completed" field
- Logic Check: Word count > 100
- AI Analysis: Assess detail, specificity, variety
- Why It Matters: Indicates engaged EA doing meaningful, varied work
- Use: Identify high-performing relationships
- Default Status: ENABLED

---

### PATTERN DETECTION GUIDANCE

**Weight Patterns Over Single Incidents**

The system should NOT alert on isolated incidents. Examples:

✅ **Correct - Pattern-Based Alerting:**
- EA misses 1 daily sync after 3 months of consistent meetings → No alert
- EA misses 3 daily syncs in one week → Alert fires

❌ **Incorrect - Single Incident Alerting:**
- EA has one "stressed" day after weeks of "great" → Don't alert
- EA has "stressed" 3 times in 7 days → Alert fires

**Implementation:** Most rules should track occurrences over time windows (3-day, 7-day, 14-day) rather than reacting to single data points.

**Account for External Factors (Optional - If Easy to Implement)**

If straightforward to build, consider these exceptions:

**Holiday Periods:**
- Filipino holidays (especially Christmas season - mid-December to early January)
- LATAM holidays
- US holidays affecting client availability

**Implementation:**
- Admin can mark "holiday period" date ranges
- During holidays, suppress low-severity alerts (MEDIUM/LOW)
- Keep CRITICAL alerts active (missing reports, overwhelming workload)

**Natural Disasters/Infrastructure:**
- If EA mentions "power outage", "typhoon", "internet issues" in difficulties
- Suppress alerts for that EA for 24-48 hours
- Resume monitoring after period ends

**Only implement if simple - don't overcomplicate.**

---

### DASHBOARD PRIORITY LOGIC

**🔴 RED (Critical) - Show Pairing as Red If:**

Any of these conditions are true:
- Has active CRITICAL severity alert
- Missing reports (2+ days)
- "Overwhelming" workload selected
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
- Regular report submissions
- PLUS bonus points for:
  - Specific wins reported regularly
  - Proactive communication detected
  - Consistent quality reporting

**Manual Override:** Admins can manually set pairing status to override automatic calculation (in case of false positives).

---

### RULE CONFIGURATION UI REQUIREMENTS

Each rule needs a configuration panel accessible to admins:

**Rule Name:** [No Daily Sync Meetings]

**Status:** [ENABLED ▼] | [DISABLED ▼]

**Severity:** [HIGH ▼] | CRITICAL | MEDIUM | LOW

**Trigger Conditions:**
- Daily Sync = "No" for [3 ▼] days in past [7 ▼] days

**Alert Settings:**
- Title: [Client-EA Disconnection]
- Description: [Missing daily sync meetings indicating relationship disconnect]
- Suggested Action: [Schedule check-in with EA to understand why syncs aren't happening]

**[Save Rule] [Test Rule] [Reset to Default]**

**Key Features:**
- Enable/disable toggle
- Adjust numeric thresholds (days, word counts, percentages)
- Edit severity levels
- Customize alert title and description
- Add/remove AI patterns for text analysis rules
- Test rule against historical data
- Reset to default settings

---

### AI IMPLEMENTATION NOTES

**For AI Text Analysis Rules:**

Use Claude API with this prompt structure:

```
You are analyzing an EA's daily report for potential churn risk signals.

Report Fields:
- Difficulties: "{difficulties_text}"
- Support Needed: "{support_needed_text}"
- Additional Notes: "{additional_notes_text}"
- What Completed: "{what_completed_text}"
- Biggest Win: "{biggest_win_text}"

Analyze for: [RULE NAME - e.g., "Client Dissatisfaction"]

Patterns to detect:
{list_of_patterns}

Return JSON:
{
  "detected": boolean,
  "confidence": 0.0 to 1.0,
  "evidence": ["specific quotes from text"],
  "reasoning": "brief explanation"
}

Only return detected:true if there is clear evidence. When in doubt, return false.
```

**Optimization Strategies:**
- Batch multiple rules in single API call when analyzing same report
- Run logic rules first - only call AI if logic rules suggest risk
- Cache results - don't re-analyze same report multiple times
- Rate limiting - respect API limits

**Cost Estimation:**
- Per report with all AI rules: ~$0.02-$0.04
- Logic rules: $0 (free, instant)
- Recommended: Run logic rules always, run AI rules only on reports flagged by logic

---

### IMPLEMENTATION PHASES

**Phase 1: Core Logic Rules (Build First)**
Free, instant, no AI required:
- Rules #1-5 (Critical logic rules)
- Rules #9, #11-13, #17, #20 (High/Medium logic rules)

These alone provide ~60% of churn detection value.

**Phase 2: Essential AI Rules**
Most important AI-powered detection:
- Rule #6: Client dissatisfaction
- Rule #7: Pay/compensation violations
- Rule #8: Trust breakdown from errors
- Rule #10: Recurring blockers

These add the "soft signal" detection that humans see but simple logic misses.

**Phase 3: Advanced AI Rules**
Enhanced pattern detection:
- Rules #14-16, #18-19, #21-23
- Positive indicators (Rules #24-26)

**Phase 4: User Configuration UI**
- Rule management interface
- Threshold adjustment
- Enable/disable toggles
- Custom alert messages

---

### CRITICAL SUCCESS METRICS

Track these to validate rule effectiveness:

- **Alert Precision:** % of alerts that are real issues (target: 70%+)
- **Alert Recall:** % of actual churn cases that were flagged (target: 85%+)
- **False Positive Rate:** % of alerts that were dismissed (target: <30%)
- **Time to Detection:** Days between issue starting and alert firing (target: <3 days)
- **Resolution Rate:** % of alerts that get resolved (target: 80%+)

**Rule Tuning:** If a rule has >50% false positive rate, adjust thresholds or disable it.

---

## Requirements Summary

### Functional Requirements

**Rule Types:**
- Logic Rules: Fast pattern matching on structured fields (radio buttons, toggles)
- AI Text Rules: Claude API analysis of text fields for patterns and sentiment

**Rule Structure:**
- Clear trigger conditions
- Data source identification
- Business rationale
- Severity levels (CRITICAL, HIGH, MEDIUM, LOW)
- Adjustable thresholds
- Default enabled/disabled status

**26 Total Rules:**
- 8 CRITICAL rules (immediate escalation)
- 7 HIGH rules (action needed this week)
- 11 MEDIUM rules (monitor closely)
- 3 POSITIVE indicators (success signals)

**Rule Configuration:**
- Admin interface to enable/disable rules
- Adjust thresholds (days, word counts, percentages)
- Edit severity levels
- Customize alert titles and descriptions
- Add/remove AI patterns
- Test rules against historical data
- Reset to default settings

**Dashboard Priority Logic:**
- RED: CRITICAL alerts or missing reports
- YELLOW: HIGH alerts or 3+ MEDIUM alerts
- GREEN: No CRITICAL/HIGH alerts, <3 MEDIUM alerts
- Manual override capability

**AI Implementation:**
- Claude API integration for text analysis
- Batch processing for efficiency
- Logic rules run first (free, instant)
- AI rules run only when logic suggests risk
- Cost optimization strategies

**Pattern Detection:**
- Weight patterns over single incidents
- Time windows (3-day, 7-day, 14-day)
- Account for external factors (holidays, disasters) if simple to implement

### Scope Boundaries

**In Scope:**
- 26 churn detection rules (all documented)
- Logic rule engine (free, instant)
- AI text analysis engine (Claude API)
- Rule configuration UI
- Alert generation and prioritization
- Dashboard health scoring
- Pattern detection over time windows
- Success metrics tracking

**Out of Scope:**
- Complex external factor handling (only if simple)
- Advanced ML models (using Claude API only)
- Real-time alert notifications (separate feature)
- Alert resolution workflow (separate feature)

### Technical Considerations

**Technology Stack:**
- Claude API (Anthropic) for AI text analysis
- Logic rules: Database queries and pattern matching
- D1 Database (via Drizzle ORM) for rule storage
- Hono API for rule evaluation endpoints
- React UI for rule configuration

**Implementation Phases:**
1. Core Logic Rules (Phase 1 - Build First)
2. Essential AI Rules (Phase 2)
3. Advanced AI Rules (Phase 3)
4. User Configuration UI (Phase 4)

**Cost Optimization:**
- Logic rules: Free (always run)
- AI rules: ~$0.02-$0.04 per report
- Run AI only when logic suggests risk
- Batch multiple rules in single API call
- Cache results to avoid re-analysis

**Success Metrics:**
- Alert Precision: 70%+
- Alert Recall: 85%+
- False Positive Rate: <30%
- Time to Detection: <3 days
- Resolution Rate: 80%+

