# Apollo Eval Projects

## Development Workflow

### Schema and Resolvers

Modify the following files:

1. `api/src/schema.graphql`
2. `api/src/resolvers.ts`

Use the Apollo Server playground at: http://localhost:4000/

The following files are auto-generated:

- `api/src/types.ts`
- `web-ui/src/types.ts`

### Web UI

Modify: `web-ui/src/queries`

Use the Apollo Server playground at: http://localhost:4000/

The following file is auto-generated:

- web-ui/src/types.ts

Modify the your component.

Sample:

```tsx
import GET_ACTORS_QUERY from "@/queries/GetActors.graphql";
import type { GetActorsQuery } from "@/types";
import { useQuery } from "@apollo/client";

export function Actors() {
  const { data, loading, error } = useQuery<GetActorsQuery>(GET_ACTORS_QUERY);
  return null;
}
```
