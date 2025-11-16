# Product Roadmap

1. [ ] Authentication & User Management — Multi-role authentication system (SUPER_ADMIN, Head of Client Success, Head of EAs, EA, CLIENT) with role-based access control and session management `M`

2. [x] Database Schema & Core Models — Complete database schema for users, clients, EAs, pairings, reports, alerts, rules, coaching notes, and all relationships with migrations `S`

3. [ ] EA Dashboard — Card-based dashboard showing status card, quick actions (Start My Day, Submit Report), coaching notes, company announcements, and resources `M`

4. [ ] End of Day Report Form — Structured 10-question form with client-facing questions (workload, work type, mood, wins, completions, pending, daily sync) and internal questions (difficulties, support needs, notes) with coaching note display `M`

5. [ ] Start of Day Tracking — EA "Start My Day" button with timestamp logging, expected show-up time comparison, late-shift alerts (30+ minutes), and OOO suppression `S`

6. [ ] Pairing Management — Create, view, edit, and manage EA-Client pairings with start dates, accelerator status, and health indicators `S`

7. [ ] Report Submission & Storage — Save End of Day reports to database with all 10 fields, link to pairing and EA, timestamp tracking, and report history view (last 30 days) `M`

8. [ ] Alert Rules System (UI) — Admin interface to create, edit, enable/disable alert rules with rule builder supporting immediate triggers and pattern-over-time detection, threshold adjustment, and severity levels `L`

9. [ ] Alert Rules Engine (Backend) — Backend system to evaluate reports against enabled rules, detect immediate triggers and patterns over time, calculate alert severity, and create alert records `L`

10. [ ] AI Analysis Integration — Claude API integration to analyze report text fields for sentiment, keywords, and patterns, feeding into alert rules engine for churn detection `M`

11. [ ] Health Scoring System — Calculate pairing health (Green/Yellow/Red) based on active alerts, report recency (2 business days), and manual override support `S`

12. [ ] Clients Dashboard — List view of all clients with health indicators, active alert counts, filter for clients with issues, and click-through to pairing details `M`

13. [ ] Assistants Dashboard — List view of all EAs with recent alerts, attendance tracking, report submission consistency, filter for EAs with issues, and click-through to EA profile `M`

14. [ ] Pairings Dashboard — List view of all EA-Client pairings with health status indicators, manual override toggle, last report date, accelerator status, and detailed pairing view `M`

15. [ ] Alert Management Kanban — Drag-and-drop Kanban board with columns (New, Investigating, Working On, Resolved), alert cards showing EA/client/type/severity/date, filters by severity/pairing/date/assignee, and detailed alert view with notes `L`

16. [ ] Coaching Notes System — EA-level and pairing-level coaching notes with real-time updates, admin editing interface, and display on EA dashboard and report form `S`

17. [ ] 4-Week Accelerator Management — Enable accelerator on pairings, set weekly goals (4 text fields), week progression buttons (Week 1→2→3→4→Complete), and display in pairing detail page `S`

18. [ ] PTO/Out of Office Management — Mark EAs as Out of Office with date ranges and reasons, suppress alerts during OOO periods, and show OOO indicators on dashboards `S`

19. [ ] Company Announcements — Create, edit, activate/deactivate company-wide announcements with title, content, optional expiration dates, and display on all EA dashboards `S`

20. [ ] CSV Bulk Import — Import pairings from CSV with validation (EA email/name, client name, start date, accelerator settings, goals), error handling, and bulk creation `M`

21. [ ] Report History & Analytics — EA view of their own report history (last 30 days), admin views of report trends, and basic analytics for CSM insights `M`

22. [ ] Testing & Quality Assurance — Comprehensive Playwright tests for all user flows, alert rule testing, AI analysis validation, and accessibility compliance `L`

> Notes
> - Order items by technical dependencies and product architecture
> - Each item should represent an end-to-end (frontend + backend) functional and testable feature
> - Foundation features (auth, database, core models) must be completed before dependent features
> - Alert system requires both UI and backend engine to be functional
> - Dashboards depend on health scoring and alert data being available

