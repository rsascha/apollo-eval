# Apollo Eval

Ein GraphQL-Evaluationsprojekt, das Entwicklung mit Apollo Server und React demonstriert.

### Technologien & Features

**Backend (Apollo Server):**

- GraphQL-Schema mit Queries, Mutations und Subscriptions
- SQLite-Datenbank mit automatischer Schema-Erstellung
- TypeScript mit automatischer Code-Generierung
- WebSocket-Support für Real-time Updates

**Frontend (React):**

- Apollo Client für GraphQL-Integration
- TypeScript mit automatischer Type-Generierung
- React Router für Navigation
- Tailwind CSS für Styling
- Vite als Build-Tool

**Architektur:**

- Monorepo-Struktur mit pnpm Workspaces
- Automatische Code-Generierung aus GraphQL-Schema
- Hot Reload für Backend und Frontend
- Separate `*.graphql` Query-Dateien

### Funktionalitäten

- **Movies verwalten:** Filme hinzufügen und anzeigen
- **Actors verwalten:** Schauspieler und ihre Filme
- **Relationen:** Many-to-Many Beziehungen zwischen Filmen und Schauspielern
- **Real-time Updates:** WebSocket Subscriptions
- **Database Management:** Datenbank erstellen und löschen
- **GraphQL Playground:** Integrierte Entwicklungsumgebung

Weitere Details zum Entwicklungsworkflow findest du in [projects](projects/README.md).

## Development

```sh
pnpm install
pnpm dev # starts the Apollo Server, the Web UI and the Code Generator
```

- Apollo Server: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- WebSocket Server: http://localhost:4000/subscriptions
- Web UI: [http://localhost:5173/](http://localhost:5173/)
