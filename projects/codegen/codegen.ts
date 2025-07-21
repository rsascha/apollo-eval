import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "../web-ui-2/src/**/*.tsx",
  generates: {
    "../api/src/modules/": {
      preset: "graphql-modules",
      presetConfig: {
        baseTypesPath: "../api/src/types.ts",
        filename: "../api/src/module-types.ts",
      },
    },
    "../web-ui-2/src/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "../api/src/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
