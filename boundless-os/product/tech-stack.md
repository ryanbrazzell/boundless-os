# Technology Stack

## Architecture Philosophy

**Edge-First Architecture**: This product uses Cloudflare's edge computing platform to deliver low-latency, globally distributed performance from day one. All components are designed to run at the edge, eliminating the need for future migrations as scale increases.

## Frontend

### Core Framework
- **React 19** + **TypeScript 5**
  - What: Modern React with latest features and full type safety
  - Why: Type safety prevents bugs, React 19 provides better performance and developer experience
  - Version: React 19.x, TypeScript 5.x

### Routing
- **TanStack Router** (file-based routing)
  - What: Type-safe, file-based routing system for React
  - Why: Provides type-safe navigation, code splitting, and excellent developer experience
  - Alternative considered: React Router (rejected - less type-safe, more boilerplate)

### State Management
- **Legend State v3** (UI state)
  - What: Fast, observable state management library
  - Why: Minimal boilerplate, excellent performance, simple mental model
- **TanStack Query** (server state)
  - What: Powerful data synchronization for server state
  - Why: Automatic caching, background updates, optimistic updates, perfect for API data

### Styling & Components
- **Tailwind CSS**
  - What: Utility-first CSS framework
  - Why: Rapid UI development, consistent design system, small bundle size
- **ShadcnUI**
  - What: High-quality, accessible React component library
  - Why: Copy-paste components (not npm package), full customization, WCAG 2.1 AA compliant, Stripe/Linear/Notion quality
- **Recharts**
  - What: Composable charting library built on D3
  - Why: Simple API, responsive charts, good for dashboards and analytics

### Build Tool
- **Vite**
  - What: Next-generation frontend build tool
  - Why: Lightning-fast dev server, optimized production builds, excellent HMR

### UI Libraries
- **react-beautiful-dnd** or **@dnd-kit/core**
  - What: Drag-and-drop library for Kanban board
  - Why: Smooth drag interactions, accessible, battle-tested
  - Note: Evaluate both and choose based on accessibility and bundle size

### Hosting
- **Cloudflare Pages**
  - What: JAMstack hosting platform with global CDN
  - Why: Automatic deployments, preview URLs, edge-optimized, generous free tier

## Backend

### API Framework
- **Hono**
  - What: Ultrafast web framework designed for edge runtimes
  - Why: Built for Cloudflare Workers, excellent TypeScript support, OpenAPI docs generation, minimal overhead
  - Version: Latest stable

### Runtime
- **Cloudflare Workers**
  - What: Serverless compute platform running at the edge
  - Why: Global distribution, low latency, auto-scaling, pay-per-use pricing, no cold starts

### Database
- **D1 Database** (SQLite at edge)
  - What: Cloudflare's serverless SQL database built on SQLite
  - Why: Edge-optimized, SQL familiarity, integrated with Workers
  - **Note**: If D1 proves insufficient for production (scale, features, or reliability concerns), migrate to:
    - **Neon Postgres** (serverless Postgres with edge support via HTTP driver)
    - **PlanetScale** (MySQL-compatible, serverless, edge-ready)
  - **Migration Path**: Drizzle ORM abstracts database differences, making migration straightforward

### ORM
- **Drizzle ORM**
  - What: TypeScript-first ORM with excellent TypeScript inference
  - Why: Type-safe queries, migrations, fast performance, works with D1/SQLite and can migrate to Postgres/MySQL if needed
  - Version: Latest stable

### Authentication
- **Better Auth**
  - What: Edge-optimized authentication library
  - Why: Built for edge runtimes, TypeScript-first, flexible providers, session management, role-based access control
  - Features: Email/password, OAuth (if needed), JWT sessions, role management

### AI Integration
- **Claude API (Anthropic)**
  - What: Large language model API for text analysis
  - Why: Excellent at pattern detection, sentiment analysis, and understanding context in EA reports
  - Use cases: Analyze report text fields for churn signals, detect patterns across multiple reports, extract insights
  - **Alternative**: OpenAI GPT-4 (if Claude unavailable, but Claude preferred for this use case)

## Infrastructure

### Hosting & Compute
- **Cloudflare Pages** (frontend)
  - What: Static site hosting with automatic deployments
  - Why: Global CDN, preview URLs, GitHub integration, zero config
- **Cloudflare Workers** (backend)
  - What: Edge compute platform
  - Why: Runs API routes, database queries, AI analysis at the edge

### Storage & Caching
- **Cloudflare KV**
  - What: Global key-value store at the edge
  - Why: Session storage, caching, fast reads/writes globally
  - Use cases: Session management, caching alert rules, temporary data

### Analytics & Monitoring
- **Cloudflare Analytics**
  - What: Built-in analytics for Pages and Workers
  - Why: No additional setup, privacy-focused, performance insights
- **Cloudflare Workers Logs**
  - What: Real-time logging for Workers
  - Why: Debug API issues, monitor errors, track performance

### CI/CD
- **GitHub Actions**
  - What: Automated workflows for testing and deployment
  - Why: Free for public repos, integrates with Cloudflare, runs tests before deploy
  - Workflow: Push to main → Run tests → Build → Deploy to Cloudflare

## Development Tools

### Required MCP Tools (for AI Development)
- **Context7 MCP** ⚠️ REQUIRED
  - What: Documentation lookup tool for Claude Code
  - Why: Always check latest docs before implementing, cite sources
  - Setup: Must be installed in Claude Code settings

- **Playwright MCP** ⚠️ REQUIRED
  - What: Visual/e2e testing automation
  - Why: Test real user flows, catch UI issues, founder can see it working
  - Setup: Must be installed in Claude Code settings + `npm install -D playwright`

### Testing
- **Playwright**
  - What: End-to-end testing framework
  - Why: Visual testing, cross-browser support, screenshots, founder-visible test results
- **Vitest** (optional, for unit tests)
  - What: Fast unit test runner
  - Why: If unit tests needed for complex logic, integrates with Vite

### Code Quality
- **ESLint** + **TypeScript**
  - What: Linting and type checking
  - Why: Catch errors early, enforce code standards
- **Prettier**
  - What: Code formatter
  - Why: Consistent code style, automatic formatting

## Design Standards

### Quality Target
- **Stripe/Linear/Notion quality**
  - Clean, professional UI
  - Smooth interactions
  - Thoughtful micro-interactions
  - Consistent spacing and typography

### Accessibility
- **WCAG 2.1 AA compliance**
  - Keyboard navigation
  - Screen reader support
  - Proper ARIA labels
  - Color contrast ratios
  - Focus indicators

### Responsiveness
- **Desktop-first** (mobile-friendly not required for forms)
  - Optimized for desktop/laptop screens
  - Forms work on tablets but not optimized
  - Mobile optimization deferred to post-MVP

## Project Structure

```
/
├── web/                    # Frontend React app
│   ├── src/
│   │   ├── routes/        # TanStack Router file-based routes
│   │   ├── components/    # React components (ShadcnUI + custom)
│   │   ├── lib/           # Utilities, hooks, state
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── vite.config.ts     # Vite configuration
│
├── worker/                # Backend Cloudflare Worker
│   ├── src/
│   │   ├── routes/        # Hono API routes
│   │   ├── db/            # Drizzle schema and migrations
│   │   ├── lib/           # Utilities, AI integration
│   │   └── types/         # Shared types
│   └── wrangler.toml      # Cloudflare Workers config
│
├── drizzle/               # Database migrations
│   └── migrations/        # Drizzle migration files
│
├── tests/                 # Playwright e2e tests
│   └── *.spec.ts
│
├── package.json           # Root package.json (monorepo)
├── wrangler.toml          # Cloudflare config
└── README.md
```

## Environment Variables

### Required Secrets
```bash
# Authentication
BETTER_AUTH_SECRET=          # Secret key for Better Auth
BETTER_AUTH_URL=             # Public URL of the app

# Database
DATABASE_URL=                # D1 database binding (or connection string if using Neon)

# AI
ANTHROPIC_API_KEY=           # Claude API key

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=       # Cloudflare account ID
CLOUDFLARE_API_TOKEN=        # API token for deployments
```

### Development Setup
- `.env.local` for local secrets (gitignored)
- `.env.example` template without secrets
- Wrangler handles Cloudflare bindings automatically

## Deployment Workflow

### Local Development
1. Run `npm run dev` in `/web` (Vite dev server)
2. Run `wrangler dev` in `/worker` (Workers dev server)
3. Access app at `http://localhost:5173` (or configured port)

### Preview Deployments
1. Push to feature branch → GitHub Actions runs
2. Cloudflare Pages creates preview URL automatically
3. Share preview URL for review

### Production Deployment
1. Merge to `main` branch
2. GitHub Actions runs tests
3. If tests pass → Build and deploy to Cloudflare
4. Production URL updates automatically

### Post-Deploy Verification
- Check Cloudflare dashboard for deployment status
- Run smoke tests against production URL
- Monitor Workers logs for errors
- Verify database migrations applied

## Performance Targets

- **Page Load**: < 2s (edge-optimized)
- **API Response**: < 500ms (edge compute)
- **Time to Interactive**: < 3s
- **Uptime**: 99.9%+ (Cloudflare SLA)

## Security Considerations

- ✅ HTTPS enforced (Cloudflare provides TLS)
- ✅ Environment variables for secrets (never commit)
- ✅ Input validation on all forms
- ✅ Role-based access control (Better Auth)
- ✅ SQL injection prevention (Drizzle ORM parameterized queries)
- ✅ XSS prevention (React escapes by default)
- ✅ CORS configured via Hono middleware
- ✅ Rate limiting (Cloudflare Workers built-in)

## Cost Considerations

### Free Tier Limits
- **Cloudflare Workers**: 100,000 requests/day free
- **Cloudflare Pages**: Unlimited (within reason)
- **Cloudflare KV**: 100,000 reads/day free
- **D1 Database**: 5GB storage, 5M reads/month free
- **GitHub Actions**: 2,000 minutes/month free (private repos)

### Estimated Monthly Costs (MVP)
- **Cloudflare**: $0 (within free tier for MVP)
- **Claude API**: ~$50-200/month (depends on report volume)
- **Total**: ~$50-200/month for MVP

### Scaling Considerations
- Monitor Workers usage → upgrade if needed ($5/month for 10M requests)
- Monitor D1 usage → migrate to Neon if needed (~$20/month for production Postgres)
- Claude API costs scale with report volume

## Migration Path (If D1 Insufficient)

If D1 Database proves insufficient for production:

1. **Migrate to Neon Postgres**
   - Use Neon HTTP driver (`@neondatabase/serverless`)
   - Drizzle ORM works with Postgres (same queries)
   - Migrate data using Drizzle migrations
   - Estimated effort: 1-2 days

2. **Alternative: PlanetScale**
   - MySQL-compatible, serverless
   - Drizzle supports MySQL
   - Similar migration path

**Decision Point**: Evaluate D1 after MVP with real usage data. If scale/features insufficient, migrate using Drizzle's abstraction layer.

## Summary

**Frontend**: React 19 + TypeScript, TanStack Router, Legend State + TanStack Query, Tailwind + ShadcnUI, Vite, Cloudflare Pages

**Backend**: Hono, Cloudflare Workers, D1 Database (with Neon migration path), Drizzle ORM, Better Auth, Claude API

**Infrastructure**: Cloudflare Pages + Workers, Cloudflare KV, GitHub Actions

**Philosophy**: Edge-first, type-safe, production-ready from day one, no migrations needed for scale

