import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "**/*.graphql",
  generates: {
    "./src/types.ts": { plugins: ["typescript", "typescript-operations"] },
  },
};
export default config;
