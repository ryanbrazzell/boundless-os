# Spec Requirements: Alert Rules System (UI)

## Initial Description
Admin interface to create, edit, enable/disable alert rules with rule builder supporting immediate triggers and pattern-over-time detection, threshold adjustment, and severity levels.

## Requirements Discussion

### Rule Management Interface
- List view of all 26 rules (from Churn Detection System spec)
- Each rule shows: Name, Type, Severity, Status (Enabled/Disabled)
- Click rule to edit configuration

### Rule Configuration Panel
For each rule, admin can configure:
- **Rule Name**: Display name
- **Status**: Enable/disable toggle
- **Severity**: CRITICAL | HIGH | MEDIUM | LOW (dropdown)
- **Trigger Conditions**: 
  - For logic rules: Adjust thresholds (days, word counts, etc.)
  - For AI rules: Add/remove patterns, adjust thresholds
- **Alert Settings**:
  - Title (editable)
  - Description (editable)
  - Suggested Action (editable)
- **Actions**: Save Rule, Test Rule, Reset to Default

### Rule Builder (for creating new rules)
- Select rule type: Logic or AI Text
- Configure trigger conditions
- Set data source (which fields to check)
- Set severity level
- Set thresholds
- For AI rules: Add patterns to detect
- Save as new rule

### Rule Types Supported
- **Immediate/Per-Report Rules**: Fire instantly when single report meets criteria
- **Pattern-Over-Time Rules**: Fire when pattern detected across multiple reports

### Default Rules
- 26 pre-configured rules from Churn Detection System spec
- All rules have default thresholds and settings
- Admins can modify or disable any rule

### Rule Testing
- "Test Rule" button runs rule against historical data
- Shows how many alerts would fire
- Helps admins tune thresholds

## Requirements Summary

### Functional Requirements
- List view of all rules
- Rule configuration panel
- Enable/disable toggles
- Threshold adjustment
- Severity level editing
- Alert message customization
- Rule builder for new rules
- Test rule functionality
- Reset to default

### Scope Boundaries
**In Scope:**
- Rule management UI
- Configuration editing
- Rule builder
- Testing functionality

**Out of Scope:**
- Rule execution (separate backend spec)
- Advanced rule logic (keep simple)
- Rule versioning (future feature)

### Technical Considerations
- Admin-only interface
- Database: AlertRules table
- React form components
- Real-time updates
- Integration with Alert Rules Engine (Backend)

