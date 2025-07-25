import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/src/schema.graphql",
  documents: "../web-ui/src/queries/**/*.graphql",
  generates: {
    "../web-ui/src/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "../api/src/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
