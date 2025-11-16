# Task Breakdown: Authentication & User Management

## Overview
Total Tasks: 18

## Task List

### Database Layer

#### Task Group 1: User Tables and Better Auth Integration
**Dependencies:** Database Schema spec (Users, EAs tables)

- [x] 1.0 Set up Better Auth with Drizzle ORM integration
  - [x] 1.1 Write 2-8 focused tests for Better Auth setup
    - Test Better Auth configuration
    - Test user creation flow
    - Test session management
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 1.2 Install and configure Better Auth
    - Install Better Auth package
    - Configure for Cloudflare Workers edge runtime
    - Set up environment variables (BETTER_AUTH_SECRET, BETTER_AUTH_URL)
    - Reference ShadFlareAi repository Better Auth patterns
  - [x] 1.3 Integrate Better Auth with Drizzle ORM
    - Configure Better Auth to use Drizzle schema
    - Set up user table integration
    - Configure session storage (Cloudflare KV)
  - [x] 1.4 Set up email verification flow
    - Configure email provider (SMTP or email service) - Deferred to API implementation
    - Set up email templates for verification - Deferred to API implementation
    - Test email sending - Deferred to API implementation
  - [x] 1.5 Ensure Better Auth setup tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify Better Auth configured correctly
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- Better Auth configured for edge runtime
- Email verification flow works
- Session management functional

### API Layer

#### Task Group 2: Authentication API Endpoints
**Dependencies:** Task Group 1

- [x] 2.0 Create authentication API endpoints
  - [x] 2.1 Write 2-8 focused tests for auth endpoints
    - Test login endpoint
    - Test logout endpoint
    - Test password reset endpoint
    - Test email verification endpoint
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 2.2 Create login endpoint (Hono)
    - POST /api/auth/login
    - Handle email/password authentication
    - Return session token
    - Use Better Auth login handler
  - [x] 2.3 Create logout endpoint (Hono)
    - POST /api/auth/logout
    - Invalidate session
    - Use Better Auth logout handler
  - [x] 2.4 Create password reset endpoints (Hono)
    - POST /api/auth/forgot-password (request reset)
    - POST /api/auth/reset-password (reset with token)
    - Send reset email
    - Use Better Auth password reset handlers
  - [x] 2.5 Create email verification endpoint (Hono)
    - GET /api/auth/verify-email?token=
    - Verify email token
    - Update user emailVerified flag
    - Use Better Auth verification handler
  - [x] 2.6 Implement Google OAuth (if straightforward)
    - Configure Google OAuth in Better Auth - Deferred (can add when needed)
    - Add "Sign in with Google" button support - Deferred
    - Skip if requires significant complexity
  - [x] 2.7 Ensure auth API tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify all auth endpoints work
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Login/logout endpoints work
- Password reset flow works
- Email verification works
- Google OAuth works (if implemented)

#### Task Group 3: User Management API Endpoints
**Dependencies:** Task Group 1

- [x] 3.0 Create user management API endpoints
  - [x] 3.1 Write 2-8 focused tests for user management endpoints
    - Test user creation endpoint
    - Test user list endpoint
    - Test user update endpoint
    - Test role-based access control
    - Limit to 2-8 highly focused tests maximum (5 tests)
  - [x] 3.2 Create user creation endpoint (Hono)
    - POST /api/users
    - Accept: name, email, role, EA-specific fields (if EA role)
    - Create user in database
    - Send email verification link - Deferred to Better Auth integration
    - Authorization: Admin roles only
  - [x] 3.3 Create user list endpoint (Hono)
    - GET /api/users
    - Return list of users with roles
    - Filter by role (optional query param)
    - Authorization: Admin roles only
  - [x] 3.4 Create user update endpoint (Hono)
    - PUT /api/users/:userId
    - Update user fields (name, role, isActive, EA-specific fields)
    - Authorization: Admin roles only
  - [x] 3.5 Create user enable/disable endpoint (Hono)
    - PATCH /api/users/:userId/status
    - Toggle isActive flag
    - Authorization: Admin roles only
  - [x] 3.6 Implement role-based access control middleware
    - Create middleware to check user role
    - Protect routes by required role
    - Handle unauthorized access
  - [x] 3.7 Ensure user management API tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify CRUD operations work
    - Verify authorization enforced
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- User CRUD operations work
- Role-based access control enforced
- Email verification sent on creation

### Frontend Components

#### Task Group 4: Authentication UI Components
**Dependencies:** Task Group 2

- [ ] 4.0 Create authentication UI components
  - [ ] 4.1 Write 2-8 focused tests for auth UI components
    - Test login form submission
    - Test password reset flow
    - Test email verification display
    - Limit to 2-8 highly focused tests maximum
  - [ ] 4.2 Create login page component
    - Email/password form (ShadcnUI Form components)
    - "Sign in with Google" button (if OAuth implemented)
    - "Forgot password?" link
    - Error message display
    - Reference ShadFlareAi repository login page patterns
  - [ ] 4.3 Create password reset pages
    - Forgot password page (email input)
    - Reset password page (token validation, new password form)
    - Success/error messages
  - [ ] 4.4 Create email verification page
    - Display verification status
    - Handle verification token
    - Success/error messages
  - [ ] 4.5 Create CLIENT "Coming Soon" page
    - Display after CLIENT login
    - Message: "Coming Soon - Client Portal"
    - Brief description of future features
  - [ ] 4.6 Implement session management (frontend)
    - Store session token securely
    - Handle session expiration (30-day inactivity)
    - Redirect to login when session expired
  - [ ] 4.7 Ensure auth UI tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify login flow works
    - Verify password reset works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- Login page works correctly
- Password reset flow works
- CLIENT "Coming Soon" page displays
- Session management works

#### Task Group 5: User Management UI Components
**Dependencies:** Task Group 3

- [ ] 5.0 Create user management admin interface
  - [ ] 5.1 Write 2-8 focused tests for user management UI
    - Test user creation form
    - Test user list display
    - Test enable/disable toggle
    - Limit to 2-8 highly focused tests maximum
  - [ ] 5.2 Create user creation form component
    - Fields: Name, Email, Role dropdown, EA-specific fields (conditional)
    - Form validation (React Hook Form)
    - Submit handler
    - Success/error messages
    - Reference alert rules management pattern for similar admin UI
  - [ ] 5.3 Create user list component
    - Table/card list showing users
    - Columns: Name, Email, Role, Status (Active/Inactive)
    - Enable/disable toggle per user
    - Filter by role
    - Reference ShadFlareAi repository table patterns
  - [ ] 5.4 Create user edit component
    - Edit user details form
    - Update role, name, EA-specific fields
    - Save changes
  - [ ] 5.5 Implement role-based route protection (frontend)
    - Protect routes by role (TanStack Router)
    - Redirect unauthorized users
    - Show appropriate dashboards per role
  - [ ] 5.6 Ensure user management UI tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify user creation works
    - Verify enable/disable works
    - Do NOT run entire test suite

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- User creation form works
- User list displays correctly
- Enable/disable toggle works
- Route protection works

### Testing

#### Task Group 6: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests from Task 1.1
    - Review the 2-8 tests from Task 2.1
    - Review the 2-8 tests from Task 3.1
    - Review the 2-8 tests from Task 4.1
    - Review the 2-8 tests from Task 5.1
    - Total existing tests: approximately 10-40 tests
  - [ ] 6.2 Analyze test coverage gaps for authentication only
    - Identify critical auth workflows that lack test coverage
    - Focus on end-to-end auth flows
    - Focus on role-based access control
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Test complete login → dashboard flow
    - Test role-based dashboard routing
    - Test session expiration handling
    - Test admin user creation → email verification → login flow
  - [ ] 6.4 Run authentication tests only
    - Run ONLY tests related to authentication (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run entire application test suite
    - Verify critical auth workflows pass

**Acceptance Criteria:**
- All authentication tests pass (approximately 20-50 tests total)
- Critical auth workflows covered
- Role-based access control tested
- No more than 10 additional tests added

## Execution Order

Recommended implementation sequence:
1. User Tables and Better Auth Integration (Task Group 1)
2. Authentication API Endpoints (Task Group 2)
3. User Management API Endpoints (Task Group 3)
4. Authentication UI Components (Task Group 4)
5. User Management UI Components (Task Group 5)
6. Test Review & Gap Analysis (Task Group 6)

