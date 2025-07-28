# Vite Apollo GraphQL Node.js Express Template

## Usage

```sh
npm create vite-apollo-fs@latest
```

## Result

This template creates a Vite project with Apollo Server and Node.js Express, including:

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

This command will create a project in the specified destination path with the given API and web UI names:

```sh
npm create vite-apollo-fs@latest -- --destinationPath=myProject --apiName=my-api --webUiName=my-web-ui
# or
npx create-vite-apollo-fs@latest --destinationPath=myProject --apiName=my-api --webUiName=my-web-ui
```

Destination File Structure:

```
myProject
├── codegen
├── my-api
└── my-web-ui
```

## References

- https://vite.dev/
- https://www.apollographql.com/docs/apollo-server
- https://nodejs.org
- https://expressjs.com/

## Temp

- Testing Github Action 1
