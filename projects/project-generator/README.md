# Vite Apollo GraphQL Node.js Express Template

## Usage

```sh
npm create vite-apollo-fs@latest
```

## Result

This template creates a React project (vite) with Apollo Server (Node.js / Express), including:

- api: Apollo Server with GraphQL support
- codegen: Code generation for TypeScript types from GraphQL schema
- web-ui: React frontend with Apollo Client

You get sample code for a GraphQL API and a React frontend that can be used as a starting point for your own projects.

Web-Socket support is included for real-time updates.

## Example Commands

This command will ask you for a destination path, api name and web-ui name:

```sh
npm create vite-apollo-fs@latest
```

Using parameters:

```sh
npm create vite-apollo-fs@latest -- --destinationPath=myProject --apiName=my-api --webUiName=my-web-ui

# or

npx create-vite-apollo-fs@latest --destinationPath=myProject --apiName=my-api --webUiName=my-web-ui
```

Destination File Structure:

```
my-project
├── codegen
├── my-api
└── my-web-ui
```

See: [Development Workflow](https://github.com/rsascha/apollo-eval/blob/main/projects/README.md) for more details on how to use the generated project.

## References

- https://vite.dev/
- https://www.apollographql.com/docs/apollo-server
- https://nodejs.org
- https://expressjs.com/

## temp

- Github testing 1
