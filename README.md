# Zephyr Deploy Dashboard

A deploy monitoring dashboard built with Module Federation, Express, and MongoDB. Technical challenge submission for the Senior Backend Node.js position at Valor Software.

## Challenge Submission: Zephyr Platform Feedback

### How it works

Zephyr Cloud is an edge deployment platform. This project uses it to host two independent React applications (Host Dashboard and Remote Metrics Widget) that communicate via Module Federation, which loads remote components at runtime.

Workflow:
1. Host app is deployed to Zephyr Cloud edge and acts as the main dashboard
2. Remote app is deployed separately to another Zephyr Cloud edge location
3. Host loads the remote's `remoteEntry.js` at runtime and imports the Metrics component
4. Both apps call a BFF (Backend for Frontend) Express API on Render for data and authentication
5. Environment variables are injected at build-time via webpack DefinePlugin, with runtime overrides through Zephyr's `ZE_PUBLIC_*` system

### What worked well

- One-click deployments via Git integration. No manual configuration after setup.
- Environment abstraction. `ZE_PUBLIC_*` variables separate build-time defaults from runtime values.
- Zero-downtime deployments. Version numbers in URLs prevent cache conflicts.
- Clear deployment logs and straightforward CLI.

### What could improve

- Documentation. A worked example showing Module Federation with Zephyr would help adoption.
- Error messages. Build failures should show more context about missing `ZE_PUBLIC_*` variables.
- Local development. How to simulate Zephyr's `ZE_PUBLIC_*` injection locally is not clear.

GitHub: [georgebgadelha/deploy-status-dashboard](https://github.com/georgebgadelha/deploy-status-dashboard) (see [Live Demo](#live-demo) for deployed URLs)

---

## Overview

This project simulates a simplified version of a deploy monitoring platform. It demonstrates three independent applications working together:

- **Host App**: React dashboard deployed on Zephyr Cloud edge. Main entry point with project listings, deploy history, and dynamic metrics loading.
- **Remote Metrics Widget**: React component served separately and loaded dynamically into the host via Module Federation. Displays success rates, build times, and deploy distribution.
- **BFF (Backend for Frontend)**: Express API deployed on Render, serving aggregated data from MongoDB Atlas. Handles authentication and complex queries.

## Live Demo

- **Host Dashboard**: [https://dev-george-gadelha-gmail-com-78-zephyr-deploy-hos-0890232ef-ze.zephyrcloud.app/](https://dev-george-gadelha-gmail-com-78-zephyr-deploy-hos-0890232ef-ze.zephyrcloud.app/)
- **Remote Metrics Widget**: [https://dev-george-gadelha-gmail-com-77-zephyr-deploy-rem-617de04df-ze.zephyrcloud.app/](https://dev-george-gadelha-gmail-com-77-zephyr-deploy-rem-617de04df-ze.zephyrcloud.app/)
- **BFF API**: [https://zephyr-deploy-bff.onrender.com/api/v1/projects](https://zephyr-deploy-bff.onrender.com/api/v1/projects) (requires `x-api-key: zephyr-dev-api-key-2024` header)

## Architecture

```
┌──────────────────────┐  MF remoteEntry.js    ┌──────────────────────┐
│  Host App (Zephyr)   │ ◄──────────────────   │ Remote (Zephyr)      │
│ Dashboard & routing  │                       │ Metrics Widget       │
└──────────┬───────────┘                       └──────────┬───────────┘
           │                                              │
           │ REST /api/v1/*                               │ REST /api/v1/*
           │ x-api-key auth                               │ x-api-key auth
           ▼                                              ▼
┌────────────────────────────────────────────────────────────────┐
│         BFF API (Express on Render.com)                        │
│ Database queries, auth, rate limiting, data aggregation        │
└─────────────────────────────┬──────────────────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │  MongoDB Atlas       │
                   │ 3 projects, 63 deploys
                   │ with metrics         │
                   └──────────────────────┘
```

| Package | Description | Deployed at |
| --- | --- | --- |
| `packages/shared` | Constants, types, and utilities | Local monorepo |
| `packages/bff` | Express REST API, Mongoose models | https://zephyr-deploy-bff.onrender.com |
| `packages/host` |React dashboard, Module Federation host | Zephyr Cloud edge (see live demo) |
| `packages/remote-metrics` | Metrics widget loaded dynamically | Zephyr Cloud edge (separate deployment) |

## Tech Stack

| Technology | Role | Why chosen |
| --- | --- | --- |
| TypeScript 5.7 | Language | Full type safety across monorepo |
| React 18.3 | Frontend | Efficient rendering, hooks, Suspense support |
| Webpack 5 + MF | Micro-frontends | Independent deployments, zero host rebuild |
| Express 4.21 | BFF server | Lightweight, perfect for aggregation layer |
| Mongoose 8.9 | Data layer | Clean schema modeling for deploys/projects |
| MongoDB 8.x | Database | Flexible documents, built-in aggregation pipelines |
| Zephyr Cloud | Frontend hosting | Edge deployment, automatic rollouts |
| Render.com | BFF hosting | Simple serverless deployment, includes health checks |
| CSS Modules | Styling | Scoped, zero-JavaScript overhead |

## Features

### Dashboard
- **Project Listing**: Browse all projects with status badges (active, inactive, archived)
- **Deploy History**: Timeline of deploys per project with environment tags
- **Metrics Overview**: Real-time success rates, build times, deploy distribution (loaded from remote widget)
- **Intelligent Navigation**: Back button remembers whether you came from Dashboard or Projects page
- **Quick Deploy Button**: Floating action button to simulate triggering a new deploy and watch metrics update in real-time

### BFF API
- **Authentication**: Simple `x-api-key` header validation
- **Pagination**: All list endpoints support `page` and `limit` query parameters (max 100)
- **Rate Limiting**: Global limit 100 req/min, writes 10 req/min
- **Aggregation**: Complex MongoDB pipelines for metrics (success rate, avg build time, deploys per environment)
- **Health Check**: GET `/health` endpoint for Render monitoring

### Data Model
- **Projects**: 3 demo projects with static details
- **Deploys**: 15-25 deploys per project across production/staging/preview environments
- **Statuses**: success (~70%), failed (~15%), in_progress (~5%), cancelled (~10%)
- **Metrics**: Aggregated per project and globally

## Getting Started

### Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- MongoDB connection string (MongoDB Atlas or local)
- npm >= 10

### Installation (Local Development)

```bash
git clone https://github.com/georgebgadelha/deploy-status-dashboard.git
cd Zephyr
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/zephyr-deploy-dashboard

# Seed the database
npm run seed
```

### Running Locally

```bash
# Terminal 1: Start BFF
npm run dev:bff          # http://localhost:3001

# Terminal 2: Start Remote metrics widget
npm run dev:remote       # http://localhost:3002

# Terminal 3: Start Host dashboard
npm run dev:host         # http://localhost:3000
```

### Building for Deployment

Builds capture `ZE_PUBLIC_*` environment variables at build-time via webpack DefinePlugin:

```bash
# Build all packages
npm run build

# Build with environment variables (for Zephyr/Render CI/CD)
ZE_PUBLIC_REMOTE_METRICS_URL="https://..." \
ZE_PUBLIC_API_BASE_URL="https://zephyr-deploy-bff.onrender.com/api/v1" \
ZE_PUBLIC_API_KEY="your-api-key" \
npm run build -w packages/host

# Backend (BFF) builds with regular env vars
NODE_ENV=production \
MONGODB_URI="mongodb+srv://..." \
API_KEY="your-api-key" \
npm run build -w packages/bff
```

## Environment Variables

Copy `.env.example` to `.env` for local development. This project uses **Zephyr's `ZE_PUBLIC_*` system**:

- **Build-time**: Zephyr captures all `ZE_PUBLIC_*` variables during build (includes in `zephyr-manifest.json`)
- **Runtime**: Each environment (dev, staging, prod) can override values **without rebuilding**
- **Security**: Only non-sensitive values are client-side. Backend secrets stay on Render.

| Variable | Scope | Required | Description | Set at |
| --- | --- | --- | --- | --- |
| **Frontend (Host & Remote):** | | | | |
| `ZE_PUBLIC_REMOTE_METRICS_URL` | Host | ✅ | Remote widget remoteEntry.js URL (webpack injects at build-time) | Zephyr dashboard → Environment Variables |
| `ZE_PUBLIC_API_BASE_URL` | Host+Remote | ✅ | BFF API endpoint (webpack injects at build-time) | Zephyr dashboard → Environment Variables |
| `ZE_PUBLIC_API_KEY` | Host+Remote | ✅ | API key sent in x-api-key header (webpack injects at build-time) | Zephyr dashboard → Environment Variables |
| **Backend (BFF on Render):** | | | | |
| `MONGODB_URI` | BFF | ✅ | MongoDB Atlas connection string | Render.com dashboard → Environment |
| `API_KEY` | BFF | ✅ | Server-side API key for client validation | Render.com dashboard → Environment |
| `NODE_ENV` | BFF | ✅ | Runtime environment (development/production) | Render.com dashboard → Environment |
| `PORT` | BFF | ❌ | Server port (default: 3001, auto-assigned on Render) | Render.com dashboard or .env
| **Local dev only:** | | | | |
| `HOST_PORT` | Local dev | ❌ | Host dev server port (default 3000) | .env file |
| `REMOTE_PORT` | Local dev | ❌ | Remote dev server port (default 3002) | .env file |
| `PORT` | Local dev | ❌ | BFF dev server port (default 3001) | .env file |

**Local development setup**:
```bash
# Copy template and edit with localhost URLs
cp .env.example .env

# Default values in .env for local development:
# ZE_PUBLIC_REMOTE_METRICS_URL=http://localhost:3002/remoteEntry.js
# ZE_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

**Production setup (Zephyr Cloud)**:
1. Go to your app in [Zephyr Cloud dashboard](https://app.zephyr-cloud.io)
2. Navigate to **Environment Variables** section
3. Set these variables:
   - `ZE_PUBLIC_REMOTE_METRICS_URL`: https://dev-george-gadelha-gmail-com-77-zephyr-deploy-rem-617de04df-ze.zephyrcloud.app/remoteEntry.js
   - `ZE_PUBLIC_API_BASE_URL`: https://zephyr-deploy-bff.onrender.com/api/v1
   - `ZE_PUBLIC_API_KEY`: Your API key
4. Run `npm run build` — Zephyr captures these values at build time
5. Later, change values in dashboard and they apply immediately without rebuild

## Testing

**Testing infrastructure is configured but tests are not yet implemented.** To add tests:

```bash
# Jest is configured for all packages
npm test                # Run tests across all packages
npm run test:coverage   # Run with coverage reports

# Create tests in packages/bff, packages/host, or packages/remote-metrics
# Example: packages/bff/src/controllers/__tests__/project.controller.spec.ts
```

## API Reference

### BFF Endpoints

#### Projects
```
GET    /api/v1/projects                      # List all projects
GET    /api/v1/projects?page=1&limit=10
GET    /api/v1/projects/:id                  # Get project by ID
GET    /api/v1/projects/:id/deploys          # Get deploys for project
GET    /api/v1/projects/:id/deploys?env=production&status=success
```

#### Deploys
```
GET    /api/v1/deploys                       # List all deploys
GET    /api/v1/deploys?page=1&limit=20&status=success
GET    /api/v1/deploys/:id                   # Get deploy by ID
POST   /api/v1/deploys                       # Create deploy (for simulation)
PATCH  /api/v1/deploys/:id/status            # Update deploy status
```

#### Metrics
```
GET    /api/v1/metrics/overview?period=7d   # Global metrics (7d or 30d)
GET    /api/v1/metrics/projects/:id?period=30d
```

All endpoints require `x-api-key: zephyr-dev-api-key-2024` header.

## Code Structure

### Backend (`packages/bff`)
```
src/
 ├── controllers/        # Request handlers
 ├── services/           # Business logic
 ├── repositories/       # Database queries
 ├── models/             # Mongoose schemas
 ├── middlewares/        # Express middlewares
 ├── routes/             # API endpoint definitions
 ├── config/             # Environment, database
 ├── utils/              # Shared utilities
 └── seed/               # Demo data generator
```

### Frontend Host (`packages/host`)
```
src/
 ├── components/
 │  ├── layout/          # DashboardLayout, Sidebar, Header
 │  ├── projects/        # ProjectList, ProjectCard
 │  ├── deploys/         # DeployHistory, DeployDetail
 │  └── common/          # StatusIndicator, LoadingSpinner, QuickDeploy
 ├── pages/              # Route components (Dashboard, Projects, ProjectDetail)
 ├── hooks/              # useApi, useProjects, useDeploys
 ├── services/           # api.ts (HTTP client)
 ├── config/             # constants.ts (centralized config)
 └── utils/              # module-federation.ts (MF utilities)
```

### Remote Metrics (`packages/remote-metrics`)
```
src/
 ├── components/         # MetricsWidget, charts
 ├── hooks/              # useMetricsOverview
 ├── services/           # api.ts (HTTP client)
 └── App.tsx             # Standalone root
```

## Key Design Decisions

1. **Module Federation for Remote Widget**: Allows independent deployment and versioning of the metrics widget. Host doesn't need rebuilding when remote updates.

2. **Monorepo with npm Workspaces**: Enables code sharing (`packages/shared`) without extra tooling. Simpler collaboration within a single graph.

3. **Express BFF**: Aggregates MongoDB queries (e.g., computing success rates) server-side, reducing frontend complexity and network overhead.

4. **CSS Modules**: Scoped styles eliminate naming conflicts and bundle bloat. No runtime CSS-in-JS needed.

5. **MongoDB Aggregation Pipelines**: Complex metrics are computed at query time with `$group` and `$match`. No separate metrics table.

6. **Render + Atlas**: Simple deployment for BFF and data persistence. Render redeploys on git push automatically.

## Development Workflow

```bash
# Make changes
git checkout -b feature/your-feature

# Test locally
npm run dev:bff &
npm run dev:remote &
npm run dev:host &

# Run tests
npm test

# Commit (follow conventional commits)
git commit -m "feat: add feature" -m "Detailed description"

# Build and verify
npm run build

# Push and deploy via Zephyr/Render dashboards
git push origin feature/your-feature
```

### API endpoints

All endpoints require the `x-api-key` header.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/projects` | List projects (paginated, filterable by status) |
| GET | `/api/v1/projects/:id` | Get a single project |
| GET | `/api/v1/projects/:id/deploys` | List deploys for a project |
| GET | `/api/v1/deploys` | List all deploys (paginated, filterable) |
| GET | `/api/v1/deploys/:id` | Get a single deploy |
| POST | `/api/v1/deploys` | Create a deploy |
| PATCH | `/api/v1/deploys/:id/status` | Update deploy status (state machine) |
| GET | `/api/v1/metrics/overview` | Aggregated metrics across all projects |
| GET | `/api/v1/metrics/projects/:id` | Metrics for a specific project |
| GET | `/health` | Health check (no auth required) |

## Trade-offs and future work

### Key decisions

| Decision | Trade-off |
| --- | --- |
| Simulated auth (x-api-key) | Simplicity over real security. Production would need JWT + OAuth2. |
| MongoDB over PostgreSQL | Deploy data is document-oriented. Relational integrity is less critical here. |
| No global state management | React hooks + fetch are enough for ~5 screens. |
| Metrics computed on-demand | Small dataset makes aggregation pipelines instant. Production: pre-computed with cron. |

### With more time

1. JWT + OAuth2 authentication with RBAC
2. WebSocket/SSE for real-time deploy status updates
3. CI/CD with GitHub Actions (build, test, lint, deploy)
4. Increase test coverage above 80% with integration and E2E tests
5. Caching layer (Redis) for pre-computed metrics
6. Observability with OpenTelemetry (tracing, structured logging)
7. Cursor-based pagination for large datasets
8. Deploy log streaming via SSE