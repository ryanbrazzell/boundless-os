# How to Access and Test the Application

## Quick Start

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8788

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd worker
npm run dev
```
Backend will be available at: http://localhost:8788

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```
Frontend will be available at: http://localhost:5174

## Access Points

### Frontend Application
- **URL**: http://localhost:5174
- **Login Page**: http://localhost:5174/login
- **EA Dashboard**: http://localhost:5174/dashboard/ea (requires EA role)
- **Admin Dashboards**: 
  - Clients: http://localhost:5174/dashboard/clients
  - Assistants: http://localhost:5174/dashboard/assistants
  - Pairings: http://localhost:5174/dashboard/pairings

### Backend API
- **URL**: http://localhost:8788
- **Health Check**: http://localhost:8788/health
- **API Base**: http://localhost:8788/api

## Testing

### Run Unit Tests
```bash
npm run test:unit
# or
cd worker && npm run test
```

### Run E2E Tests
```bash
npm run test:e2e
# or
npx playwright test
```

### Run All Tests
```bash
npm test
```

## Database Access

### View Database Schema
```bash
npm run db:studio
```
This opens Drizzle Studio at http://localhost:4983

### Run Migrations
```bash
npm run db:migrate
```

## First Time Setup

If you haven't set up the database yet:

1. **Create D1 Database** (Cloudflare):
   ```bash
   cd worker
   npx wrangler d1 create boundless-os-db
   ```

2. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Set Environment Variables**:
   Create `.dev.vars` in the `worker` directory:
   ```
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:8788
   CLAUDE_API_KEY=your-claude-api-key (optional, for AI features)
   ```

## Default Routes

### Public Routes
- `/login` - Login page
- `/forgot-password` - Password reset
- `/reset-password` - Password reset with token
- `/verify-email` - Email verification
- `/coming-soon` - Placeholder for CLIENT role

### Authenticated Routes (EA Role)
- `/dashboard/ea` - EA Dashboard
- `/reports/submit` - Submit End of Day Report
- `/reports/history` - View Report History
- `/start-day` - Log Start of Day

### Authenticated Routes (Admin Roles)
- `/dashboard/clients` - Clients Dashboard
- `/dashboard/assistants` - Assistants Dashboard
- `/dashboard/pairings` - Pairings Dashboard
- `/admin/users` - User Management
- `/admin/alert-rules` - Alert Rules Management
- `/admin/coaching-notes` - Coaching Notes
- `/admin/announcements` - Company Announcements
- `/admin/pto` - PTO Management
- `/admin/accelerator` - 4-Week Accelerator
- `/admin/pairings/import` - CSV Bulk Import
- `/alerts/kanban` - Alert Management Kanban

## Testing Credentials

You'll need to create a user first. Use the User Management API or admin interface:

```bash
# Create a test EA user
curl -X POST http://localhost:8788/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ea@test.com",
    "password": "password123",
    "name": "Test EA",
    "role": "EA"
  }'
```

## Troubleshooting

### Port Already in Use
The application now uses:
- Frontend: Port **5174** (changed from 5173)
- Backend: Port **8788** (changed from 8787)

If these are also in use, you can change them:
- Frontend: Edit `web/package.json` dev script or use `--port` flag
- Backend: Edit `worker/wrangler.toml` port setting

### Database Not Found
Make sure you've created the D1 database and run migrations:
```bash
cd worker
npx wrangler d1 create boundless-os-db
npm run db:migrate
```

### Tests Failing
Make sure both servers are running before running E2E tests:
```bash
npm run dev
# In another terminal:
npm run test:e2e
```
