# Spec Requirements: Authentication & User Management

## Initial Description
Multi-role authentication system (SUPER_ADMIN, Head of Client Success, Head of EAs, EA, CLIENT) with role-based access control and session management.

## Requirements Discussion

### First Round Questions

**Q1:** User sign-up: Should users sign up themselves, or should admins create accounts? I'm assuming admins create accounts for EAs and Clients, and SUPER_ADMIN creates admin accounts. Is that correct?

**Answer:** ✅ Correct - Admins create accounts for EAs and Clients. SUPER_ADMIN creates admin accounts (Head of Client Success, Head of EAs).

**Q2:** Email verification: Should users verify their email after account creation? I'm assuming yes for security. Is that correct?

**Answer:** ✅ Yes - Users should verify their email after account creation for security.

**Q3:** Password reset: Should users be able to reset forgotten passwords via email? I'm assuming yes. Is that correct?

**Answer:** ✅ Yes - Users should be able to reset forgotten passwords via email.

**Q4:** Login methods: For MVP, should login be email + password only, or also Google/Microsoft OAuth? I'm assuming email + password only for MVP, with OAuth added later if needed. Is that correct?

**Answer:** 
- Primary: Email + password (required)
- Optional: Add Google OAuth if it's straightforward with Better Auth (not a blocker for MVP)
- Skip for now: Microsoft OAuth (can add post-MVP if needed)

**Q5:** Role assignment: When an admin creates a user, should they assign the role (EA, Head of Client Success, etc.) at creation? I'm assuming yes. Is that correct?

**Answer:** ✅ Yes - When admin creates a user, they assign the role (EA, Head of Client Success, Head of EAs, CLIENT) at creation time.

**Q6:** CLIENT role: Clients can log in but won't have features in MVP—just authentication. Should they see a "Coming Soon" message after login? Is that correct?

**Answer:** ✅ Yes - After login, clients should see a "Coming Soon - Client Portal" message with a brief description that features are being built.

**Q7:** Session duration: How long should users stay logged in? I'm assuming 30 days of inactivity before requiring re-login. Is that correct, or do you prefer a different duration?

**Answer:** ✅ 30 days of inactivity is fine.

**Q8:** SUPER_ADMIN: Should SUPER_ADMIN be a special role with full access, or should it work like other roles? I'm assuming SUPER_ADMIN can do everything other admins can do, plus system-level settings. Is that correct?

**Answer:** ✅ Correct - SUPER_ADMIN has full access to everything other admins can do, PLUS:
- Create/manage other admin accounts (Head of Client Success, Head of EAs)
- System-level settings
- Manage company announcements
- Access to all dashboards

### Existing Code to Reference

**Design Reference - ShadFlareAi Repository:**
The user has specified that the ShadFlareAi repository (https://github.com/codevibesmatter/ShadFlareAi) should be used as the exact architecture and design system template. This repository demonstrates:

- **ShadcnUI component usage patterns** - How to structure and use ShadcnUI components
- **Better Auth implementation with Cloudflare** - Edge-optimized authentication setup
- **Page layouts and navigation structure** - Overall UI structure and navigation patterns
- **TanStack Router file-based routing patterns** - How to organize routes
- **Legend State + TanStack Query state management patterns** - State management approach
- **Hono API structure** - Backend API organization
- **Drizzle ORM with D1 database patterns** - Database schema and query patterns
- **Overall UI/UX design language** - Design system and visual language

**Note:** This repository should be studied carefully during implementation to replicate the exact patterns and architecture.

**Alert Rules System Pattern:**
The user-editable alert rules system has a similar pattern to what we need for user/role management:

- **Key similarity:** Just like rules can be created/edited/toggled in the app, user accounts need to be created/managed by admins.
- **Reference pattern:**
  - Rules have: id, name, isEnabled, severity, configurable thresholds
  - Rules can be toggled on/off by admins
  - Rules are stored in database and fetched/updated via API
- **Apply similar pattern to users:**
  - Users have: id, name, email, role, isActive
  - Users can be enabled/disabled by admins
  - Users are stored in database and managed via admin UI
- **Location:** Check rebuild documentation (EXACT_SPECIFICATIONS.md and REBUILD_CONTEXT.md) for alert rules structure - that's the pattern we want for admin management interfaces.

### Follow-up Questions

**Follow-up 1:** Better Auth with Google OAuth - Better Auth supports Google OAuth relatively easily. If it's just adding a configuration option and a "Sign in with Google" button, go ahead and implement it. If it requires significant additional complexity, skip it for MVP and we'll add it later.

**Answer:** Implement Google OAuth if straightforward (just configuration + button). Skip if complex.

**Follow-up 2:** Admin User Creation Flow - When an admin creates a new user, what fields should the form have?

**Answer:** 
- Name (text input)
- Email (text input)
- Role (dropdown: EA | Head of Client Success | Head of EAs | CLIENT)
- For EAs specifically: Expected show-up time, timezone
- For EAs specifically: Healthcare eligibility date (optional, can set later)

After creation:
- System sends email verification link to the new user
- User clicks link, verifies email, sets their password
- User can then log in

## Visual Assets

### Files Provided:
No visual files found in the visuals folder.

### Visual Insights:
- **Design Reference:** Use ShadFlareAi repository as visual reference - it already has the exact design language we want (Stripe/Linear quality using ShadcnUI)
- **For authentication specifically, reference:**
  - ShadFlareAi's login page implementation
  - ShadFlareAi's Better Auth setup
  - Any user management patterns in that repo
- **Fidelity level:** Use existing ShadFlareAi patterns as high-fidelity reference

## Requirements Summary

### Functional Requirements

**User Account Creation:**
- Admins create accounts for EAs and Clients
- SUPER_ADMIN creates admin accounts (Head of Client Success, Head of EAs)
- Admin form includes: Name, Email, Role (dropdown), EA-specific fields (show-up time, timezone, healthcare eligibility date)
- After creation: System sends email verification link
- User verifies email and sets password
- User can then log in

**Authentication Methods:**
- Primary: Email + password (required)
- Optional: Google OAuth (implement if straightforward with Better Auth)
- Skip for MVP: Microsoft OAuth

**Email Verification:**
- Required after account creation for security
- User receives verification link via email
- Must verify before setting password and logging in

**Password Management:**
- Users can reset forgotten passwords via email
- Password reset flow sends email with reset link

**Role-Based Access Control:**
- Five roles: SUPER_ADMIN, Head of Client Success, Head of EAs, EA, CLIENT
- Roles assigned at user creation time by admin
- Each role has different access levels and dashboards

**Session Management:**
- Users stay logged in for 30 days of inactivity
- Session expires after 30 days, requires re-login

**CLIENT Role Behavior:**
- CLIENT users can log in
- After login, see "Coming Soon - Client Portal" message
- Brief description that features are being built
- No functional features in MVP

**SUPER_ADMIN Capabilities:**
- Full access to everything other admins can do
- PLUS: Create/manage other admin accounts
- PLUS: System-level settings
- PLUS: Manage company announcements
- PLUS: Access to all dashboards

**User Management Interface:**
- Admin interface to create, edit, enable/disable users
- Similar pattern to alert rules management (toggle on/off, stored in database, managed via UI)
- Users have: id, name, email, role, isActive status

### Reusability Opportunities

**ShadFlareAi Repository Patterns:**
- ShadcnUI component structure and usage
- Better Auth implementation patterns
- Page layout and navigation structure
- TanStack Router file-based routing
- Legend State + TanStack Query state management
- Hono API organization
- Drizzle ORM with D1 patterns
- Overall UI/UX design language

**Alert Rules System Pattern:**
- Admin management interface pattern (create/edit/toggle)
- Database storage and API patterns
- UI components for admin controls

### Scope Boundaries

**In Scope:**
- Multi-role authentication (5 roles)
- Admin-created user accounts
- Email verification
- Password reset
- Google OAuth (if straightforward)
- Role-based access control
- Session management (30-day inactivity)
- CLIENT "Coming Soon" page
- Admin user management interface
- User enable/disable functionality

**Out of Scope:**
- Microsoft OAuth (post-MVP)
- Self-service user sign-up
- Social login beyond Google (if added)
- Advanced session management features
- User profile editing (separate feature)
- Password complexity requirements (use Better Auth defaults)

### Technical Considerations

**Technology Stack:**
- Better Auth (edge-optimized authentication library)
- Cloudflare Workers (edge runtime)
- D1 Database (via Drizzle ORM)
- Hono API framework
- TanStack Router (file-based routing)
- Legend State + TanStack Query (state management)
- ShadcnUI components

**Design System:**
- Follow ShadFlareAi repository patterns exactly
- Stripe/Linear/Notion quality design
- ShadcnUI component library
- WCAG 2.1 AA accessibility compliance

**Implementation Notes:**
- Study ShadFlareAi repo carefully before implementation
- Replicate exact architecture patterns from that repository
- Use alert rules management pattern for user management UI
- Google OAuth: Implement if straightforward, skip if complex

## Additional Context

### Churn Detection Rules System
The user has provided comprehensive documentation for a churn detection rules system. This is noted as a critical feature that may need its own separate specification document. The system includes:

- Logic rules (fast, free pattern matching)
- AI text rules (Claude API analysis)
- 26 total rules across CRITICAL, HIGH, MEDIUM severity levels
- Positive indicators (success signals)
- Rule configuration UI requirements
- Pattern detection guidance
- Dashboard priority logic

**Note:** This churn detection system should be referenced when building the alert rules management interface, as the user management pattern should mirror the alert rules management pattern.

