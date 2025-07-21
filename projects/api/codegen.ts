import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "../web-ui/src/queries/**/*.ts",
  generates: {
    "./src/types.ts": { plugins: ["typescript", "typescript-operations"] },
  },
};
export default config;
