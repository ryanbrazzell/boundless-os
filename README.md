# Boundless OS - Churn Detection Platform

AI-powered platform for monitoring Executive Assistant → Client relationships through daily reports and automatically detecting churn risk.

## Tech Stack

- **Frontend**: React 19 + TypeScript, TanStack Router, Tailwind CSS + ShadcnUI
- **Backend**: Cloudflare Workers, Hono, D1 Database, Drizzle ORM
- **AI**: Claude API (Anthropic) for text analysis
- **Infrastructure**: Cloudflare Pages + Workers

## Project Structure

```
/
├── web/              # Frontend React app (to be created)
├── worker/           # Backend Cloudflare Worker
│   ├── src/
│   │   ├── db/      # Drizzle schema and migrations
│   │   └── routes/  # Hono API routes
│   └── drizzle/     # Database migrations
└── tests/           # Playwright e2e tests (to be created)
```

## Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Cloudflare account (for D1 Database)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a D1 database:
```bash
cd worker
wrangler d1 create boundless-os-dev
```

3. Update `wrangler.toml` with your database ID

4. Run migrations:
```bash
npm run db:migrate
```

5. Start development servers:
```bash
npm run dev
```

## Database Migrations

Generate a new migration:
```bash
npm run db:generate
```

Apply migrations:
```bash
npm run db:migrate
```

Push schema changes (dev only):
```bash
npm run db:push
```

## Testing

Run database tests:
```bash
npm run test:db
```

## Deployment

Deploy to Cloudflare:
```bash
cd worker
npm run deploy
```

## License

See LICENSE file.
