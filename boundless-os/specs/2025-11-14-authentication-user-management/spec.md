# Specification: Authentication & User Management

## Goal
Implement multi-role authentication system with five user roles (SUPER_ADMIN, Head of Client Success, Head of EAs, EA, CLIENT) enabling secure login, role-based access control, and admin user management.

## User Stories
- As an admin, I want to create user accounts for EAs and Clients so that I can onboard new users without self-signup
- As a user, I want to log in with email and password so that I can access the platform securely
- As an admin, I want to assign roles when creating users so that each user has appropriate access permissions

## Specific Requirements

**Multi-Role Authentication System**
- Implement Better Auth library configured for Cloudflare Workers edge runtime
- Support five roles: SUPER_ADMIN, HEAD_CLIENT_SUCCESS, HEAD_EAS, EA, CLIENT
- Store user roles in database linked to Better Auth user records
- Implement role-based access control middleware for API routes
- Session management with 30-day inactivity timeout
- Email verification required after account creation
- Password reset flow via email link

**Admin User Creation**
- Admin interface to create new users (SUPER_ADMIN creates admin accounts, admins create EA/Client accounts)
- User creation form with fields: Name, Email, Role dropdown (EA | Head of Client Success | Head of EAs | CLIENT)
- For EA role: Additional fields for expected show-up time, timezone, healthcare eligibility date (optional)
- System sends email verification link to new user after creation
- User verifies email and sets password before first login

**Authentication Methods**
- Primary: Email + password authentication (required)
- Optional: Google OAuth integration if straightforward with Better Auth (not blocker for MVP)
- Skip Microsoft OAuth for MVP (can add post-MVP)
- Better Auth handles session management, JWT tokens, and secure password hashing

**CLIENT Role Behavior**
- CLIENT users can authenticate and log in
- After login, display "Coming Soon - Client Portal" message with brief description
- No functional features for CLIENT role in MVP (authentication only)

**SUPER_ADMIN Capabilities**
- Full access to all admin features plus system-level settings
- Can create and manage other admin accounts (Head of Client Success, Head of EAs)
- Can manage company announcements
- Access to all dashboards regardless of role restrictions

**User Management Interface**
- Admin interface to view, edit, enable/disable users
- Similar pattern to alert rules management: toggle on/off, stored in database, managed via UI
- User fields: id, name, email, role, isActive status
- Enable/disable users without deleting accounts

**Database Schema**
- Users table with Better Auth integration fields
- Role stored as enum: SUPER_ADMIN, HEAD_CLIENT_SUCCESS, HEAD_EAS, EA, CLIENT
- isActive boolean flag for enabling/disabling users
- emailVerified boolean flag
- Link to EAs table for EA-specific fields (expected show-up time, timezone, healthcare eligibility)

**Role-Based Access Control**
- Middleware checks user role before allowing access to routes
- Different dashboards for different roles (EA Dashboard, Admin Dashboards)
- API endpoints protected by role checks
- Frontend routes protected by role checks

## Visual Design
No visual assets provided. Reference ShadFlareAi repository for login page and Better Auth implementation patterns.

## Existing Code to Leverage

**ShadFlareAi Repository Patterns**
- Study Better Auth implementation with Cloudflare Workers from ShadFlareAi repo
- Replicate login page UI patterns and component structure
- Follow authentication flow patterns and session management approach
- Use similar user management interface patterns if present in repo

**Alert Rules Management Pattern**
- User management UI should follow similar pattern to alert rules management
- Toggle on/off functionality, database storage, admin UI controls
- Reference alert rules structure for admin management interface patterns

## Out of Scope
- Microsoft OAuth authentication (post-MVP feature)
- Self-service user sign-up (admins create all accounts)
- Social login beyond Google (if Google OAuth added)
- Advanced session management features beyond 30-day timeout
- User profile editing interface (separate feature)
- Password complexity requirements beyond Better Auth defaults
- Two-factor authentication (future feature)
- SSO integration (future feature)
- User activity logging/audit trail (future feature)
- Bulk user import (separate CSV import spec handles pairings, not users)

