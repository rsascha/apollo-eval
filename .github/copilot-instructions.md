# Apollo Evaluation Project - AI Coding Assistant Instructions

## Project Architecture

This is a **pnpm workspace monorepo** with 3 packages:

- `projects/api/` - GraphQL Apollo Server with in-memory database
- `projects/web-ui/` - React + TypeScript + Vite frontend with Apollo Client
- `projects/shared/` - Shared TypeScript interfaces and types

## Essential Workflows

**Development**: Use `make dev` (or `pnpm dev`) from root - starts all 3 services concurrently with colored output
**Package management**: Always use `pnpm` - this is a pnpm workspace, not npm
**Clean install**: `make clean` removes all node_modules across workspace

## Data Layer Architecture

**Database Schema**: Based on `material/db.plantuml` - 6 entities with specific relationships:

- User (1:many Cards, 1:many Accounts)
- Card (1:many CardHistory, many:many Accounts via CardsAccounts)
- Account, Stream, CardHistory, CardsAccounts

**Repository Pattern**: Each entity has dedicated repository in `projects/api/src/repositories/`

- Standard CRUD: `create()`, `findById()`, `findAll()`, `update()`, `delete()`
- Entity-specific methods: `UserRepository.findByName()`, `CardRepository.findByUserId()`

**Data Access Layer**: Central `DataAccessLayer` class exposes all repositories as properties:

```typescript
const dal = new DataAccessLayer();
await dal.initialize();
// Access via: dal.users, dal.cards, dal.accounts, etc.
```

## GraphQL Patterns

**Schema Location**: `projects/api/src/server.ts` - all types and resolvers in single file
**Resolvers**: Direct DAL calls - `() => dal.users.findAll()`
**Input Types**: Use `CreateUserInput`, `CreateCardInput` for mutations
**Cache Updates**: Frontend mutations use `refetchQueries: [{ query: GET_USERS }]`

## Frontend Patterns

**Apollo Setup**: Client configured in `main.tsx` with `/api` URI
**Query Organization**: GraphQL queries/mutations in `projects/web-ui/src/queries/` directory

- One file per query/mutation: `GET_USERS.ts`, `CREATE_USER.ts`
- Re-exported via `queries/index.ts`

**Component Structure**:

- Import queries from `"src/queries"`
- Use controlled inputs with loading/error states
- Reset forms after successful mutations

## Key Conventions

**TypeScript Interfaces**: All database types in `projects/shared/src/database.ts`

- Use shared types via `import type { User } from "@shared"`
- Input types exclude auto-generated IDs

**Documentation Language**: Maintain consistent English documentation throughout the project

**File Naming**:

- Repository files: `[entity]Repository.ts`
- Query files: `[OPERATION_NAME].ts` (uppercase)
- No index.ts for components exports

## Development Gotchas

**In-Memory Database**: No persistence between restarts - data resets on server restart
**Port Configuration**: API likely on :4000, frontend on Vite default
**Transaction Support**: `dal.withTransaction()` available but currently synchronous for in-memory impl
**Apollo DevTools**: Available when GraphQL server running

When modifying schemas, update both GraphQL typeDefs in `server.ts` AND TypeScript interfaces in `shared/database.ts`.

## React Coding Guidelines

- use the function statement if possible - no arrow functions
- don't use too many comments - the code should be self-documenting - sample: projects/api/src/database/create-db.ts
