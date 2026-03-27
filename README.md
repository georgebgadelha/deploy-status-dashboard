# Zephyr Deploy Dashboard

A deploy monitoring dashboard built with Module Federation, Express, and MongoDB. Technical challenge submission for the Senior Backend Node.js position at Valor Software.

## Overview

This project simulates a simplified version of a deploy monitoring platform. A host application displays project listings and deploy history, while a remote application provides metrics widgets loaded dynamically via Webpack Module Federation. A BFF (Backend for Frontend) in Express serves aggregated data from MongoDB.

## Architecture

```
┌──────────────┐     MF remoteEntry.js     ┌──────────────────┐
│   Host App   │ ◄─────────────────────── │  Remote Metrics  │
│  (port 3000) │                           │   (port 3002)    │
└──────┬───────┘                           └────────┬─────────┘
       │                                            │
       │  REST /api/v1/*                            │  REST /api/v1/*
       │  x-api-key auth                            │  x-api-key auth
       ▼                                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BFF (port 3001)                         │
│  Express + Mongoose                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   MongoDB    │
                   └──────────────┘
```

| Package | Description |
| --- | --- |
| `packages/shared` | Constants, types, and utility functions used across apps |
| `packages/bff` | Express REST API with Mongoose models, services, and aggregation pipelines |
| `packages/host` | React dashboard with routing, project listing, deploy history |
| `packages/remote-metrics` | React metrics widget exposed via Module Federation |

## Tech stack

| Technology | Role | Reason |
| --- | --- | --- |
| TypeScript 5.7 | Language | Type safety across the monorepo |
| React 18.3 | Frontend | Component model, hooks, Suspense for lazy loading |
| Webpack 5 + Module Federation | Micro-frontends | Dynamic remote loading without rebuilding the host |
| Express 4.21 | BFF server | Familiar, well-documented, sufficient for the scope |
| Mongoose 8.9 | ODM | Document-oriented data maps well to deploy records |
| MongoDB 8.x | Database | Flexible schema, native aggregation pipelines for metrics |
| CSS Modules | Styling | Scoped styles with zero runtime cost |
| Jest + React Testing Library | Testing | Standard tooling, co-located tests |
| npm workspaces | Monorepo | Built-in, no extra tooling needed |

## Getting started

### Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- MongoDB running locally (or a connection string)
- npm >= 10

### Installation

```bash
git clone <repo-url>
cd Zephyr
npm install
cp .env.example .env
# Edit .env if your MongoDB runs on a different URI
npm run seed
```

### Running the apps

```bash
# Start all three in separate terminals:
npm run dev:bff          # BFF on http://localhost:3001
npm run dev:remote       # Remote metrics on http://localhost:3002
npm run dev:host         # Host dashboard on http://localhost:3000

# Or start BFF alone and build frontend:
npm run build
```

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | BFF server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/zephyr-deploy-dashboard` |
| `API_KEY` | API key for x-api-key auth | `zephyr-dev-api-key-2024` |
| `NODE_ENV` | Environment mode | `development` |
| `HOST_PORT` | Host app dev server port | `3000` |
| `REMOTE_PORT` | Remote metrics dev server port | `3002` |
| `API_BASE_URL` | Base URL for frontend API calls | `http://localhost:3001/api/v1` |

### Running tests

```bash
npm test                # All packages
npm run test:coverage   # With coverage report
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

## Live demo

> Links will be added after deployment to Zephyr Cloud.

- Host App: TBD
- Remote Metrics: TBD
- BFF API: TBD

## Zephyr Cloud experience

### How it works

Zephyr Cloud integrates into the Webpack build process through a plugin. During builds, it captures the Module Federation manifest and deploys the output to edge infrastructure. Each build gets a unique version, making rollbacks straightforward. The platform manages remote entry URLs so the host always resolves the correct version of each remote.

### Module Federation + Zephyr

Zephyr handles the versioning and distribution of Module Federation remotes. Instead of hardcoding remote URLs, the platform resolves them at runtime based on version rules. This decouples deploy cycles between host and remote apps, so either can ship independently without coordinating releases.

### Feedback

What worked well:
- The concept of edge-deployed Module Federation with versioning is strong. It addresses a real pain point in micro-frontend architectures where coordinating remote versions is error-prone.
- The build plugin approach means minimal changes to existing Webpack configs.

What could be improved:
- Documentation around local development setup and debugging federation issues would help adoption.
- Clearer examples of rollback flows and version pinning strategies in the docs.

## Trade-offs and future work

### Key decisions

| Decision | Trade-off |
| --- | --- |
| Simulated auth (x-api-key) | Simplicity over real security. Production would need JWT + OAuth2. |
| MongoDB over PostgreSQL | Deploy data is document-oriented. Relational integrity is less critical here. |
| CSS Modules over Tailwind | Zero runtime cost, sufficient for the project size. |
| Express over Fastify | More recognizable in code review, despite lower throughput. |
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

## License

MIT
