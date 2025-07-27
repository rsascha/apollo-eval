#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer").default;
const { execSync } = require("child_process");

interface ProjectConfig {
  apiName: string;
  webUiName: string;
  destinationPath: string;
}

async function promptForProjectConfig(): Promise<ProjectConfig> {
  // Check for command line arguments
  const args = process.argv.slice(2);
  const destinationArg = args.find((arg) =>
    arg.startsWith("--destinationPath=")
  );
  const apiNameArg = args.find((arg) => arg.startsWith("--apiName="));
  const webUiNameArg = args.find((arg) => arg.startsWith("--webUiName="));

  // Create prompts only for missing parameters
  const prompts = [];

  if (!destinationArg) {
    prompts.push({
      type: "input",
      name: "destinationPath",
      message: "Enter destination path for the new project:",
      default: process.cwd(),
    });
  }

  if (!apiNameArg) {
    prompts.push({
      type: "input",
      name: "apiName",
      message: "Enter API project name:",
      default: "my-api",
    });
  }

  if (!webUiNameArg) {
    prompts.push({
      type: "input",
      name: "webUiName",
      message: "Enter Web UI project name:",
      default: "my-web-ui",
    });
  }

  // Get answers for missing parameters
  const answers = await inquirer.prompt(prompts);

  // Combine CLI args with prompted answers
  return {
    destinationPath: destinationArg
      ? destinationArg.split("=")[1]
      : answers.destinationPath,
    apiName: apiNameArg ? apiNameArg.split("=")[1] : answers.apiName,
    webUiName: webUiNameArg ? webUiNameArg.split("=")[1] : answers.webUiName,
  };
}

// Templates will be read from filesystem
const readTemplate = (templateName: string): string => {
  const templatePath = path.join(__dirname, "..", "templates", templateName);
  let content = fs.readFileSync(templatePath, "utf-8");

  // Remove @ts-nocheck comments before copying templates
  content = content.replace(/^\/\/ @ts-nocheck\s*\n/m, "");

  return content;
};

async function generateApiProject(config: ProjectConfig) {
  const targetApiPath = path.join(config.destinationPath, config.apiName);

  console.log(`📦 Creating API project at: ${targetApiPath}`);

  // Create API directory
  await fs.ensureDir(targetApiPath);

  // Read and modify package.json from template
  const apiPackageJsonTemplate = readTemplate("api/package.json");
  const apiPackageJson = JSON.parse(apiPackageJsonTemplate);
  apiPackageJson.name = `${config.apiName}`;
  await fs.writeJson(path.join(targetApiPath, "package.json"), apiPackageJson, {
    spaces: 2,
  });

  // Write tsconfig.json from template
  await fs.writeFile(
    path.join(targetApiPath, "tsconfig.json"),
    readTemplate("api/tsconfig.json")
  );

  // Create src directory
  const srcDir = path.join(targetApiPath, "src");
  await fs.ensureDir(srcDir);

  // Write GraphQL schema from template
  await fs.writeFile(
    path.join(srcDir, "schema.graphql"),
    readTemplate("api/schema.graphql")
  );

  // Write resolvers from template
  await fs.writeFile(
    path.join(srcDir, "resolvers.ts"),
    readTemplate("api/resolvers.ts")
  );

  // Write server.ts from template
  await fs.writeFile(
    path.join(srcDir, "server.ts"),
    readTemplate("api/server.ts")
  );

  console.log("✅ API project created successfully");
}

async function generateCodegenProject(config: ProjectConfig) {
  const targetCodegenPath = path.join(config.destinationPath, "codegen");

  console.log(`📦 Creating Codegen project at: ${targetCodegenPath}`);

  // Create codegen directory
  await fs.ensureDir(targetCodegenPath);

  // Read and modify package.json from template
  const codegenPackageJsonTemplate = readTemplate("codegen/package.json");
  const codegenPackageJson = JSON.parse(codegenPackageJsonTemplate);
  codegenPackageJson.name = `codegen`;
  await fs.writeJson(
    path.join(targetCodegenPath, "package.json"),
    codegenPackageJson,
    { spaces: 2 }
  );

  // Create codegen.ts
  const codegenConfig = `import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../${config.apiName}/src/schema.graphql",
  documents: "../${config.webUiName}/src/queries/**/*.graphql",
  generates: {
    "../${config.webUiName}/src/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    "../${config.apiName}/src/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;`;

  await fs.writeFile(path.join(targetCodegenPath, "codegen.ts"), codegenConfig);

  console.log("✅ Codegen project created successfully");
}

async function generateWebUiProject(config: ProjectConfig) {
  const targetWebUiPath = path.join(config.destinationPath, config.webUiName);

  console.log(`📦 Creating Web UI project at: ${targetWebUiPath}`);

  // Use npm create vite to generate the React project
  console.log("🔄 Creating Vite React project...");

  try {
    // Create Vite project with React + TypeScript template
    execSync(
      `npm create vite@latest ${config.webUiName} -- --template react-ts`,
      {
        cwd: config.destinationPath,
        stdio: "inherit",
      }
    );

    console.log("✅ Vite project created");

    // Install Apollo Client dependencies und vite-plugin-graphql-loader
    console.log(
      "🔄 Installing Apollo Client dependencies und vite-plugin-graphql-loader..."
    );
    execSync(
      `pnpm add @apollo/client graphql graphql-ws vite-plugin-graphql-loader`,
      {
        cwd: targetWebUiPath,
        stdio: "inherit",
      }
    );

    console.log(
      "✅ Apollo dependencies und vite-plugin-graphql-loader installiert"
    );

    // Patch vite.config.ts to add vite-plugin-graphql-loader only
    const viteConfigPath = path.join(targetWebUiPath, "vite.config.ts");
    let viteConfig = await fs.readFile(viteConfigPath, "utf-8");
    // Add vite-plugin-graphql-loader import if not present
    if (!viteConfig.includes("vite-plugin-graphql-loader")) {
      if (/import\s+tailwindcss[^;]+;/.test(viteConfig)) {
        viteConfig = viteConfig.replace(
          /(import\s+tailwindcss[^;]+;)/,
          `$1\nimport graphqlLoader from 'vite-plugin-graphql-loader';`
        );
      } else if (/import\s+react[^;]+;/.test(viteConfig)) {
        viteConfig = viteConfig.replace(
          /(import\s+react[^;]+;)/,
          `$1\nimport graphqlLoader from 'vite-plugin-graphql-loader';`
        );
      } else {
        viteConfig =
          `import graphqlLoader from 'vite-plugin-graphql-loader';\n` +
          viteConfig;
      }
    }
    // Remove vite-tsconfig-paths import if present
    viteConfig = viteConfig.replace(
      /\n?import tsconfigPaths from ['"]vite-tsconfig-paths['"];?/,
      ""
    );
    // Remove tsconfigPaths() from plugins array if present
    viteConfig = viteConfig.replace(/,?\s*tsconfigPaths\(\)/g, "");
    // Add graphqlLoader() to plugins array if not present
    viteConfig = viteConfig.replace(
      /(plugins:\s*\[)([^\]]*)\]/,
      (match: string, p1: string, p2: string) => {
        let plugins = p2.trim().replace(/,$/, "");
        if (!plugins.includes("graphqlLoader()"))
          plugins += ", graphqlLoader()";
        // Clean up any double commas
        plugins = plugins.replace(/,,/g, ",");
        return `${p1}${plugins}]`;
      }
    );
    await fs.writeFile(viteConfigPath, viteConfig);

    // Create queries directory
    await fs.ensureDir(path.join(targetWebUiPath, "src/queries"));

    // Create GraphQL queries from templates
    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/GetHello.graphql"),
      readTemplate("web-ui/queries/GetHello.graphql")
    );

    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/GetUsers.graphql"),
      readTemplate("web-ui/queries/GetUsers.graphql")
    );

    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/AddUser.graphql"),
      readTemplate("web-ui/queries/AddUser.graphql")
    );

    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/OnGreetings.graphql"),
      readTemplate("web-ui/queries/OnGreetings.graphql")
    );

    // Create App.tsx from template
    await fs.writeFile(
      path.join(targetWebUiPath, "src/App.tsx"),
      readTemplate("web-ui/App.tsx")
    );

    // Create Dashboard component from template
    await fs.writeFile(
      path.join(targetWebUiPath, "src/Dashboard.tsx"),
      readTemplate("web-ui/Dashboard.tsx")
    );

    // Create graphql.d.ts for GraphQL module declarations
    await fs.writeFile(
      path.join(targetWebUiPath, "src/graphql.d.ts"),
      readTemplate("web-ui/graphql.d.ts")
    );

    console.log("✅ Web UI project created successfully");
  } catch (error) {
    console.error("❌ Error creating Vite project:", error);
    throw error;
  }
}

async function createRootPackageJson(config: ProjectConfig) {
  const rootPackageJson = {
    name: config.apiName,
    version: "1.0.0",
    description: "Generated Apollo GraphQL project",
    private: true,
    workspaces: [config.apiName, "codegen", config.webUiName],
    scripts: {
      dev: "pnpm --recursive --parallel run dev",
      "dev:api": `pnpm --filter ${config.apiName} dev`,
      "dev:web": `pnpm --filter ${config.webUiName} dev`,
      "dev:codegen": "pnpm --filter codegen dev",
    },
  };

  await fs.writeJson(
    path.join(config.destinationPath, "package.json"),
    rootPackageJson,
    { spaces: 2 }
  );

  // Create pnpm-workspace.yaml
  const workspaceConfig = `packages:
  - '${config.apiName}'
  - 'codegen'
  - '${config.webUiName}'`;

  await fs.writeFile(
    path.join(config.destinationPath, "pnpm-workspace.yaml"),
    workspaceConfig
  );

  console.log("✅ Root workspace configuration created");
}

async function generateProject() {
  console.log("🚀 Apollo GraphQL Project Generator");
  console.log("==================================\n");

  try {
    const config = await promptForProjectConfig();

    // Ensure destination directory exists
    await fs.ensureDir(config.destinationPath);

    console.log(`\n📁 Generating project in: ${config.destinationPath}`);
    console.log(`🔧 API Name: ${config.apiName}`);
    console.log(`🌐 Web UI Name: ${config.webUiName}\n`);

    // Generate all projects
    await createRootPackageJson(config);
    await generateApiProject(config);
    await generateCodegenProject(config);
    await generateWebUiProject(config);

    // Install dependencies in the root workspace
    console.log("\n🔄 Installing dependencies in workspace...");
    execSync("pnpm install", {
      cwd: config.destinationPath,
      stdio: "inherit",
    });
    console.log("✅ Dependencies installed");

    console.log("\n🎉 Project generated successfully!");
    console.log("\nNext steps:");
    console.log(`cd ${config.destinationPath}`);
    console.log("pnpm dev");
    console.log("\nEndpoints:");
    console.log("- GraphQL Playground: http://localhost:4000/graphql");
    console.log("- Web UI: http://localhost:5173");
  } catch (error) {
    console.error("❌ Error generating project:", error);
    process.exit(1);
  }
}

// Run the generator
generateProject();
