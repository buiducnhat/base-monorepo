# Better-T-Stack Project Rules

This is a erp project created with Better-T-Stack CLI.

## Project Structure

This is a monorepo with the following structure:

- **`apps/web/`** - Frontend application (React with TanStack Router)

- **`apps/server/`** - Backend server (Elysia)

- **`packages/api/`** - Shared API logic and types
- **`packages/auth/`** - Authentication logic and utilities
- **`packages/db/`** - Database schema and utilities
- **`packages/env/`** - Environment variables (T3 env)

## Available Scripts

- `bun run dev` - Start all apps in development mode
- `bun run dev:web` - Start only the web app
- `bun run dev:server` - Start only the server

## Database Commands

All database operations should be run from the server workspace:

- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open database studio
- `bun run db:generate` - Generate Drizzle files
- `bun run db:migrate` - Run database migrations

Database schema files are located in `apps/server/src/db/schema/`

## API Structure

- oRPC endpoints are in `apps/server/src/api/`
- Client-side API utils are in `apps/web/src/utils/api.ts`

## Authentication

Authentication is enabled in this project:

- Server auth logic is in `apps/server/src/lib/auth.ts`
- Web app auth client is in `apps/web/src/lib/auth-client.ts`

## Project Configuration

This project includes a `bts.jsonc` configuration file that stores your Better-T-Stack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed
- Updated automatically when using the `add` command

## Key Points

- This is a Turborepo monorepo using bun workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Run workspace-specific commands with `bun run command-name`
- Turborepo handles build caching and parallel execution
