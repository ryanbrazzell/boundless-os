# Specification: 4-Week Accelerator Management

## Goal
Enable structured onboarding accelerator on EA-Client pairings with weekly goals (4 text fields), manual week progression controls, and display in pairing detail pages.

## User Stories
- As Head of Client Success, I want to enable accelerator on new pairings so that onboarding is structured
- As Head of Client Success, I want to set weekly goals so that EAs know what to accomplish each week
- As Head of Client Success, I want to track accelerator progress so that I can see how onboarding is going

## Specific Requirements

**Accelerator Enablement**
- Toggle checkbox/switch to enable/disable accelerator on pairing
- Available during pairing creation (Pairing Management form) and pairing edit
- Stored in Pairings table: acceleratorEnabled (boolean, default false)
- When enabled: Show weekly goals fields, Set acceleratorWeek to 1 (start at Week 1)
- When disabled: Hide goals fields, Clear acceleratorWeek (set to null)

**Weekly Goals Configuration**
- Four text area fields for goals: Week 1 Goals, Week 2 Goals, Week 3 Goals, Week 4 Goals
- Display when accelerator is enabled
- Stored in Pairings table: acceleratorWeek1Goals (text, nullable), acceleratorWeek2Goals (text, nullable), acceleratorWeek3Goals (text, nullable), acceleratorWeek4Goals (text, nullable)
- All goals optional (can set some weeks, leave others empty)
- Character limit (optional, e.g., 500 characters per goal)

**Week Progression Controls**
- Buttons to manually advance weeks: "Advance to Week 2", "Advance to Week 3", "Advance to Week 4", "Mark Complete"
- Current week displayed: "Week 1", "Week 2", "Week 3", "Week 4", or "Complete"
- Stored in Pairings table: acceleratorWeek (integer: 1, 2, 3, 4, or null for complete)
- When Complete: acceleratorWeek = null, acceleratorEnabled remains true (to show completed status)
- Buttons only show appropriate options (e.g., if Week 2, show "Advance to Week 3" and "Mark Complete")

**Display in Pairing Detail Page**
- Show accelerator section with: Enabled/disabled indicator (badge), Current week display (Week 1-4 or Complete), All 4 weekly goals (display all, highlight current week's goals), Progress indicator (optional: visual progress bar 0-100%)
- Display format: Card or section in pairing detail view
- Goals visible to admins and CSMs (not visible to EAs in MVP)

**Admin Interface**
- Enable/disable toggle in Pairing Management interface
- Edit weekly goals (4 text areas) in Pairing Detail page
- Week progression buttons in Pairing Detail page
- All controls accessible from Pairing Detail page
- Save changes updates Pairings table

**Use Case Flow**
- CSM creates new pairing, enables accelerator, sets Week 1-4 goals
- As onboarding progresses, CSM manually advances weeks (Week 1 → Week 2 → Week 3 → Week 4 → Complete)
- Goals and progress visible in pairing detail view
- Accelerator status visible in Pairings Dashboard list view

**Data Storage**
- All fields stored in Pairings table: acceleratorEnabled, acceleratorWeek, acceleratorWeek1Goals, acceleratorWeek2Goals, acceleratorWeek3Goals, acceleratorWeek4Goals
- No separate Accelerator table needed (simple enough for Pairings table)
- Timestamps track when accelerator was enabled/updated

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for form patterns and progress indicators.

## Existing Code to Leverage

**Pairing Management Integration**
- Integrate with Pairing Management spec for creation and editing
- Use same form components and patterns
- Follow Pairing Detail page layout patterns

**ShadcnUI Components**
- Use ShadcnUI Switch for enable/disable toggle
- Use ShadcnUI Textarea for goals input
- Use ShadcnUI Button for week progression
- Use ShadcnUI Progress or Badge for progress display

## Out of Scope
- Automatic week progression based on dates (manual only for MVP)
- Goal completion tracking (future feature - just display goals, don't track completion)
- Accelerator templates (future feature)
- Accelerator analytics (future feature)
- EA-facing accelerator view (goals visible to admins/CSMs only in MVP)
- Accelerator reminders or notifications (future feature)
- Multiple accelerators per pairing (one accelerator per pairing)
- Accelerator history/audit (future feature)

