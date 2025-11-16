# Spec Requirements: 4-Week Accelerator Management

## Initial Description
Enable accelerator on pairings, set weekly goals (4 text fields), week progression buttons (Week 1→2→3→4→Complete), and display in pairing detail page.

## Requirements Discussion

### Accelerator Enablement
- Toggle to enable/disable accelerator on pairing
- Set during pairing creation or edit
- Stored in Pairings table: acceleratorEnabled (boolean)

### Weekly Goals
- Four text fields for goals:
  - Week 1 Goals
  - Week 2 Goals
  - Week 3 Goals
  - Week 4 Goals
- Set when enabling accelerator or editing pairing
- Stored in Pairings table: acceleratorWeek1Goals, acceleratorWeek2Goals, acceleratorWeek3Goals, acceleratorWeek4Goals

### Week Progression
- Buttons to advance weeks:
  - Week 1 → Week 2
  - Week 2 → Week 3
  - Week 3 → Week 4
  - Week 4 → Complete
- Stored in Pairings table: acceleratorWeek (integer: 1, 2, 3, 4, null)
- When Complete: acceleratorWeek = null, acceleratorEnabled = true (to show completed)

### Display in Pairing Detail Page
- Show accelerator status:
  - Enabled/disabled indicator
  - Current week (if enabled)
  - All 4 weekly goals
  - Progress indicator (optional)

### Admin Interface
- Enable/disable toggle
- Edit weekly goals (4 text fields)
- Week progression buttons
- All accessible from Pairing Detail page

### Use Case
- CSM enables accelerator when creating new pairing
- Sets goals for each week
- Manually advances weeks as onboarding progresses
- Goals visible to CSM and admins

## Requirements Summary

### Functional Requirements
- Enable/disable accelerator
- Set weekly goals (4 text fields)
- Week progression buttons
- Display in pairing detail
- Admin interface

### Scope Boundaries
**In Scope:**
- Accelerator toggle
- Weekly goals
- Week progression
- Display

**Out of Scope:**
- Automatic week progression (manual only)
- Goal completion tracking (future feature)
- Accelerator templates (future feature)

### Technical Considerations
- Database: Pairings table fields
- Admin interface components
- Week progression logic
- Display components

