# Apollo Eval

A GraphQL evaluation project demonstrating development with Apollo Server and React.

## Generator

This project includes a template for quickly setting up a full-stack application with Apollo Server (Node.js Express), Graph QL Code Generation (for TypeScript types) and a React frontend (vite).

More information:

- [npm package](https://www.npmjs.com/package/create-vite-apollo-fs)
- [source code](projects/project-generator/README.md)

Or run:

```sh
npm create vite-apollo-fs@latest
```

## Project Description (not part of generated project)

### Technologies & Features

**Backend (Apollo Server):**

- GraphQL schema with Queries, Mutations and Subscriptions
- SQLite database with automatic schema creation
- TypeScript with automatic code generation
- WebSocket support for real-time updates

**Frontend (React):**

- Apollo Client for GraphQL integration
- TypeScript with automatic type generation
- React Router for navigation
- Tailwind CSS for styling
- Vite as build tool

**Architecture:**

- Monorepo structure with pnpm Workspaces
- Automatic code generation from GraphQL schema
- Hot reload for backend and frontend
- Separate `*.graphql` query files

### Features

- **Movie management:** Add and display movies
- **Actor management:** Actors and their movies
- **Relations:** Many-to-many relationships between movies and actors
- **Real-time updates:** WebSocket subscriptions
- **Database management:** Create and delete database
- **GraphQL Playground:** Integrated development environment

For more details on the development workflow, see [projects](projects/README.md).

## Development

```sh
pnpm install
pnpm dev # starts the Apollo Server, the Web UI and the Code Generator
```

- Apollo Server: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- WebSocket Server: http://localhost:4000/subscriptions
- Web UI: [http://localhost:5173/](http://localhost:5173/)
