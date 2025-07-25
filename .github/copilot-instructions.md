# Apollo Evaluation Project - AI Coding Assistant Instructions

## React Coding Guidelines

- use the function statement if possible - no arrow functions
- don't use too many comments - the code should be self-documenting - sample: projects/api/src/database/create-db.ts

Sample:

```ts
// Navigate to the new movie detail page
navigate(`/movies/${data.addMovie.id}`);
```

This comment is not necessary, as the code is self-explanatory. Instead, focus on writing clear and concise code that communicates its purpose without excessive comments.

## File Structure

- ./components - reusable components

When a component is used only in one place, it can be placed in the same directory as the page component. For example, the `Greetings` component is used only in the `Home` page, so it is located in `pages/Home/components/Greetings.tsx`.

Sample:

```
pages/Home/
├── Home.tsx
├── index.ts
└── components/
    ├── index.ts
    ├── Greetings.tsx
    ├── ApolloPlayground.tsx
    └── DatabaseManagement.tsx
```

## References

- [README.md](../README.md) - main project description
- [projects/README.md](../projects/README.md) - development workflow
