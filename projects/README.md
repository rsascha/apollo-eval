# Apollo Eval Projects

## Development Workflow

`pnpm dev` will run:

- `api`: Apollo server with GraphQL API
- `codegen`: Watches for changes in GraphQL files and generates TypeScript types
- `web-ui`: React application with Apollo Client

### Schema and Resolvers

Modify the following files:

1. `api/src/schema.graphql`
1. `api/src/resolvers.ts`

_Use the Apollo Server playground at: [http://localhost:4000/](http://localhost:4000/)_

Sample Code:

```graphql
type Query {
  actors: [Actor]
}

type Actor {
  id: ID!
  name: String!
}
```

```ts
export const resolvers = {
  Query: {
    actors: () => {
      // ...
      return [];
    },
  },
};
```

The following files are auto-generated:

- `api/src/types.ts`
- `web-ui/src/types.ts`

### Web UI

Modify:

- `web-ui/src/queries`

_Use the Apollo Server playground at: [http://localhost:4000/](http://localhost:4000/)_

Sample Code:

```graphql
query GetActors {
  actors {
    id
    name
  }
}
```

The following file is auto-generated:

- `api/src/types.ts`
- `web-ui/src/types.ts`

Modify the your component.

Sample Code:

```tsx
import GET_ACTORS_QUERY from "@/queries/GetActors.graphql";
import type { GetActorsQuery } from "@/types";
import { useQuery } from "@apollo/client";

export function Actors() {
  const { data, loading, error } = useQuery<GetActorsQuery>(GET_ACTORS_QUERY);
  return null;
}
```
