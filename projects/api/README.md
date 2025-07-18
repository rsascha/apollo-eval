````markdown
# Apollo Evaluation API

A GraphQL API with In-Memory Data-Layer based on the PlantUML schema.

## Setup

```bash
cd projects/api
pnpm install
```

## Development

```bash
pnpm run dev
```

The server starts on `http://localhost:4000` with an in-memory database.

## Database Schema

The schema is based on the `material/db.plantuml` file and includes the following entities:

- **User**: Users with ID, name and description
- **Card**: Cards with sync functionality and versioning
- **Account**: Accounts linked to users
- **Stream**: Data streams with search functionality
- **CardHistory**: Version history for cards
- **CardsAccounts**: Many-to-Many relationship between cards and accounts

## Data Access Layer

The Data Access Layer (`DataAccessLayer`) provides:

- **Repository Pattern**: Each entity has its own repository
- **Transaction Support**: With `withTransaction()` for complex operations
- **Utility Methods**: For common operations like linking cards and accounts

### Example Usage

```typescript
import { DataAccessLayer } from "./dataAccessLayer.js";

const dal = new DataAccessLayer();
await dal.initialize();

// Create user
const user = await dal.users.create({
  name: "John Doe",
  description: "An example user",
});

// Create card
const card = await dal.cards.create({
  sync_enabled: true,
  version: 1,
  last_sync_version: 0,
  user_id: user.user_id,
});

// Get all users
const users = await dal.users.findAll();

await dal.close();
```

## GraphQL API

### Queries

```graphql
# All users
query {
  users {
    user_id
    name
    description
  }
}

# Single user
query {
  user(id: 1) {
    user_id
    name
    description
  }
}

# Cards of a user
query {
  cardsByUser(userId: 1) {
    card_id
    sync_enabled
    version
  }
}
```

### Mutations

```graphql
# Create user
mutation {
  createUser(input: { name: "John Doe", description: "A new user" }) {
    user_id
    name
    description
  }
}

# Create card
mutation {
  createCard(
    input: { sync_enabled: true, version: 1, last_sync_version: 0, user_id: 1 }
  ) {
    card_id
    sync_enabled
    version
  }
}
```

## Repositories

Each repository provides standard CRUD operations:

- `create(data)`: Create new record
- `findById(id)`: Find record by ID
- `findAll()`: Get all records
- `update(id, data)`: Update record
- `delete(id)`: Delete record

Plus specific methods per entity:

- **UserRepository**: `findByName(name)`
- **CardRepository**: `findByUserId(userId)`, `findBySyncEnabled(enabled)`
- **StreamRepository**: `searchByText(text)`, `findByOwnerId(ownerId)`
- **CardHistoryRepository**: `findByCardId(cardId)`, `getLatestVersionByCardId(cardId)`

## Run Example

```bash
npx tsx src/example.ts
```

This example shows the complete usage of the Data Access Layer.

## Architecture

```
src/
├── database/
│   └── inMemoryDatabase.ts  # In-Memory database implementation
├── repositories/
│   ├── userRepository.ts    # User CRUD operations
│   ├── cardRepository.ts    # Card CRUD operations
│   ├── accountRepository.ts # Account CRUD operations
│   ├── streamRepository.ts  # Stream CRUD operations
│   ├── cardHistoryRepository.ts # CardHistory CRUD operations
│   └── cardsAccountsRepository.ts # CardsAccounts CRUD operations
├── types/
│   └── database.ts          # TypeScript Interfaces
├── dataAccessLayer.ts       # Main DAL class
├── server.ts               # GraphQL Apollo Server
├── example.ts              # Usage example
└── index.ts                # Export file
```
````
