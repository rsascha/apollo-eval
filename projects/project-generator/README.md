# Apollo GraphQL Project Generator

Ein TypeScript-Tool, das neue Apollo GraphQL-Projekte basierend auf der bestehenden apollo-eval Konfiguration generiert.

## Installation

```bash
cd projects/project-generator
pnpm install
```

## Verwendung

```bash
pnpm generate
```

Das Script fragt nach:

1. **Destination Path**: Zielordner für das neue Projekt
2. **API Name**: Name für das API-Projekt (wird in package.json verwendet)
3. **Web UI Name**: Name für das Web UI-Projekt

## Generierte Projektstruktur

```
my-project/
├── package.json (Root workspace)
├── pnpm-workspace.yaml
├── api/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── schema.graphql (Dummy Schema)
│       ├── resolvers.ts (Dummy Resolvers)
│       └── server.ts (Apollo Server Setup)
├── codegen/
│   ├── package.json
│   └── codegen.ts (GraphQL Code Generator)
└── web-ui/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx (Apollo Client Setup)
        ├── Dashboard.tsx (Demo Component)
        ├── index.css
        └── queries/
            ├── GetHello.graphql
            ├── GetUsers.graphql
            ├── AddUser.graphql
            └── OnGreetings.graphql
```

## Features des generierten Projekts

### API (Apollo Server)

- Dummy GraphQL Schema mit Query, Mutation und Subscription
- Einfache Resolver-Implementierung
- WebSocket-Support für Subscriptions
- TypeScript-Setup

### Web UI (React + Apollo Client)

- Apollo Client mit HTTP und WebSocket Links
- Beispiel-Komponenten für alle GraphQL-Operationen:
  - **Query**: Hello World und User-Liste
  - **Mutation**: User hinzufügen
  - **Subscription**: Live Greetings
- Keine UI-Frameworks (kein Tailwind/MUI) - nur natives CSS
- TypeScript-Setup

### Code Generation

- Automatische TypeScript-Type-Generierung
- Konfiguration für API und Web UI

## Nach der Generierung

```bash
cd /path/to/generated/project
pnpm install
pnpm dev
```

**Endpoints:**

- GraphQL Playground: http://localhost:4000/graphql
- Web UI: http://localhost:5173

## Dependencies

Das Tool benötigt:

- `fs-extra`: Dateisystem-Operationen
- `inquirer`: Interactive CLI-Prompts
- `@types/*`: TypeScript-Type-Definitionen
