# ERM frontend

Vue 3 SPA for **ERM** — a CRM-for-schools system for small businesses. This is the `frontend` slice of the ERM monorepo; see [docs/architecture/](../docs/architecture/) for full system design. (Repo is public as the frontend slice only — links to `../docs/` and `../backend/` are private siblings.)

## What this is

ERM has a **fixed skeleton**: time, relationships, permissions, and tenant isolation are modeled by the system, never per customer. Everything else — a name, allergies, a phone — lives in `attrs`, described by a backend-served `FieldDefinition`. No per-tenant `if` anywhere: forms, lists, and filters render generically from one field registry (`src/fields/`). The app talks to the Go backend only via its REST API and never computes permissions itself — it reads the backend's effective `mode` (RCUD bitmask) and hides/disables accordingly.

## Core features

- **RCUD permission model, not roles** — client has no `Can()`, only reads `mode`. A `403` means permissions changed, not a bug.
- **Fully generated API client** — `pnpm gen:api` runs `openapi-typescript` against the backend's `openapi.json` into `src/api/schema.d.ts`; `openapi-fetch` is the only runtime caller. CI fails if the schema is stale.
- **One generic field registry** drives every form/list/filter via `src/fields/registry.ts` (`type → component`). No per-entity custom form code.
- **Idempotent mutations by construction** — every write carries a client-generated `Idempotency-Key` (UUIDv7, one per user intent), reused across retries.
- **Append-only history** — e.g. attendance has no edit button; a correction is a new record referencing the old one.
- **Tenant isolation enforced in the client** — tenant lives in the URL (`/t/:tenant/...`), never global state; every query cache key is tenant-prefixed.

## Ideology

1. **One mechanism per task** — one field registry, one patch mechanism (`set_attrs`), one way to express a schedule.
2. **The client is a thin, honest renderer of backend state** — never a second source of truth for permissions, schedules, or validation.
3. **Explicit over hidden** — explicit `vue-router` routes, no implicit global state for anything with one true source.
4. **Boring technology, deliberately** — no SSR, no Pinia until needed, shadcn-vue + Tailwind over a heavy UI framework.
5. **No comments in code**, enforced by ESLint — only a bare `docs/...` or ticket reference allowed; design decisions live in `docs/`.
6. **Layering enforced, not aspirational** — `eslint-plugin-boundaries` fails CI on violations.

## Layout

| Directory | Contains | May import |
| --- | --- | --- |
| `src/model/` | Pure TS: `FieldDefinition` → form schema, mode/period helpers | nothing |
| `src/api/` | Generated types + `client.ts` | `model/` |
| `src/ui/` | shadcn-vue components, design tokens | nothing domain-specific |
| `src/fields/` | Registry `type → component` | `model/`, `ui/` |
| `src/features/` | Pages + composables per domain | everything above |
| `src/app/` | Shell, router, bootstrap | everything |

## Development

Requires the [`backend`](../backend/) sibling repo for the API and OpenAPI schema.

```bash
cp .env.example .env.local && pnpm install && pnpm dev
```

Open `http://localhost:5173/login`, sign in with `00000000-0000-4000-8000-0000000000a1` (admin, both seeded schools) or `…a2` (teacher). Mock login requires backend started with `APP_ENV=dev`.

### Scripts

```bash
pnpm dev         # vite dev server
pnpm build       # vue-tsc -b && vite build
pnpm typecheck   # vue-tsc -b
pnpm lint        # eslint .
pnpm format      # prettier --write src
pnpm test        # vitest run
pnpm e2e         # playwright, against a real backend (reseeds first)
pnpm gen:api     # regenerate src/api/schema.d.ts from ../backend/api/openapi.json
```

CI runs `lint`, `typecheck`, `test`, `build`.

### Updating API types

`src/api/schema.d.ts` is generated — never edit directly.

1. Change the API shape in `backend/` first.
2. Regenerate `backend/api/openapi.json` (see backend repo docs).
3. Run `pnpm gen:api` here. CI fails if `schema.d.ts` is stale.

`scripts/gen-api.mjs` also strips transport-only header params (`X-Tenant-ID`, `Idempotency-Key`, `X-Trace-ID`) and types schema-less `attrs: object` as `Record<string, unknown>`.

## Further reading

- [18-frontend-architecture.md](../docs/architecture/18-frontend-architecture.md) — full stack rationale, rules, status
- [03-design-principles.md](../docs/architecture/03-design-principles.md) — Torvalds-derived principles
- [16-development-standards.md](../docs/architecture/16-development-standards.md) — no-comments rule and code standards
