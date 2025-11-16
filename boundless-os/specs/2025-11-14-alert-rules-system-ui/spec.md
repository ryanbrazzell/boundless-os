# Specification: Alert Rules System (UI)

## Goal
Create admin interface for managing 26 churn detection rules with enable/disable toggles, threshold adjustment, severity editing, alert message customization, rule builder for new rules, and test functionality.

## User Stories
- As Head of Client Success, I want to adjust alert rule thresholds so that I can tune sensitivity based on what I learn
- As an admin, I want to disable rules that create too many false positives so that CSMs aren't overwhelmed
- As an admin, I want to test rules against historical data so that I can validate threshold changes

## Specific Requirements

**Rule List View**
- Table or card list showing all 26 rules from Churn Detection System spec
- Columns/cards: Rule Name, Type (Logic/AI Text), Severity (CRITICAL/HIGH/MEDIUM/LOW), Status (Enabled/Disabled badge)
- Sortable by name, type, severity, status
- Filter by type, severity, status
- Click rule row/card to open configuration panel

**Rule Configuration Panel**
- Side panel or modal for editing rule configuration
- Rule Name: Display name (editable)
- Status: Enable/disable toggle (ShadcnUI Switch)
- Severity: Dropdown (CRITICAL | HIGH | MEDIUM | LOW)
- Trigger Conditions section:
  - For logic rules: Numeric inputs for thresholds (days, word counts, percentages)
  - For AI rules: Text area for patterns (one per line, add/remove buttons)
  - Dynamic form based on rule type
- Alert Settings section:
  - Title: Text input (editable)
  - Description: Text area (editable)
  - Suggested Action: Text area (editable, optional)
- Actions: Save Rule button, Test Rule button, Reset to Default button

**Rule Builder (New Rule Creation)**
- Form to create new custom rules
- Select rule type: Logic or AI Text (radio buttons)
- Configure trigger conditions based on type
- Set data source: Which report fields to check (multi-select)
- Set severity level (dropdown)
- Set thresholds (numeric inputs or pattern list)
- For AI rules: Add patterns to detect (text area, one per line)
- Save as new rule (adds to rule list)

**Rule Testing**
- "Test Rule" button in configuration panel
- Runs rule against historical reports (last 30-90 days)
- Shows results: How many alerts would fire, sample alerts, confidence distribution
- Helps admins tune thresholds before saving
- Loading state during test execution

**Default Rules Management**
- 26 pre-configured rules loaded from Churn Detection System spec
- All rules have default thresholds and settings
- "Reset to Default" button restores original configuration
- Confirmation dialog before reset

**Data Storage**
- Store rule configuration in AlertRules table
- Fields: name, ruleNumber, ruleType, severity, isEnabled, triggerCondition (JSONB), adjustableThresholds (JSONB), defaultThresholds (JSONB), alertTitle, alertDescription, suggestedAction
- Update rule configuration via API endpoint
- Fetch rules for display via API endpoint

**Access Control**
- Head of Client Success can manage rules
- Head of EAs can manage rules
- SUPER_ADMIN can manage rules
- Other roles cannot access rule management

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for admin interface patterns and form layouts.

## Existing Code to Leverage

**Admin Interface Patterns**
- Follow ShadFlareAi repository patterns for admin forms and tables
- Use ShadcnUI Form, Input, Select, Switch, Textarea components
- Follow similar configuration interface patterns

**User Management Pattern**
- Rule management should follow similar pattern to user management interface
- Toggle on/off, database storage, admin UI controls
- Reference alert rules structure for consistency

## Out of Scope
- Rule execution (separate backend spec)
- Advanced rule logic beyond basic threshold/pattern matching
- Rule versioning and history (future feature)
- Rule templates library (26 pre-configured rules sufficient)
- Advanced rule testing with custom date ranges (basic testing only)
- Rule import/export (future feature)
- Rule sharing between instances (future feature)

