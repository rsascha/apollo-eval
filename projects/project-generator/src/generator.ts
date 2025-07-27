#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function generateApiProject(config: ProjectConfig) {
  const sourceApiPath = path.resolve(__dirname, "../../api");
  const targetApiPath = path.join(config.destinationPath, config.apiName);

  console.log(`📦 Creating API project at: ${targetApiPath}`);

  // Create API directory
  await fs.ensureDir(targetApiPath);

  // Copy package.json and modify
  const apiPackageJson = await fs.readJson(
    path.join(sourceApiPath, "package.json")
  );
  apiPackageJson.name = `@${config.apiName}/api`;
  await fs.writeJson(path.join(targetApiPath, "package.json"), apiPackageJson, {
    spaces: 2,
  });

  // Copy tsconfig.json
  await fs.copy(
    path.join(sourceApiPath, "tsconfig.json"),
    path.join(targetApiPath, "tsconfig.json")
  );

  // Create src directory
  const srcDir = path.join(targetApiPath, "src");
  await fs.ensureDir(srcDir);

  // Create dummy schema.graphql
  const dummySchema = `type Query {
  hello: String!
  users: [User!]!
}

type Mutation {
  addUser(name: String!): User!
}

type Subscription {
  greetings: String!
}

type User {
  id: ID!
  name: String!
}`;

  await fs.writeFile(path.join(srcDir, "schema.graphql"), dummySchema);

  // Create dummy resolvers.ts
  const dummyResolvers = `export const resolvers = {
  Query: {
    hello: () => 'Hello World!',
    users: () => [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' }
    ]
  },
  Mutation: {
    addUser: (_: any, { name }: { name: string }) => {
      const newUser = { id: Date.now().toString(), name };
      console.log('Adding user:', newUser);
      return newUser;
    }
  },
  Subscription: {
    greetings: {
      subscribe: () => {
        const messages = ['Hello!', 'Hi there!', 'Welcome!', 'Good day!'];
        let index = 0;
        
        return {
          [Symbol.asyncIterator]: async function* () {
            while (true) {
              yield { greetings: messages[index % messages.length] };
              index++;
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        };
      }
    }
  }
};`;

  await fs.writeFile(path.join(srcDir, "resolvers.ts"), dummyResolvers);

  // Copy server.ts from the source API project
  await fs.copy(
    path.join(sourceApiPath, "src/server.ts"),
    path.join(srcDir, "server.ts")
  );

  console.log("✅ API project created successfully");
}

async function generateCodegenProject(config: ProjectConfig) {
  const sourceCodegenPath = path.resolve(__dirname, "../../codegen");
  const targetCodegenPath = path.join(config.destinationPath, "codegen");

  console.log(`📦 Creating Codegen project at: ${targetCodegenPath}`);

  // Create codegen directory
  await fs.ensureDir(targetCodegenPath);

  // Copy and modify package.json
  const codegenPackageJson = await fs.readJson(
    path.join(sourceCodegenPath, "package.json")
  );
  codegenPackageJson.name = `@${config.apiName}/codegen`;
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
  const { execSync } = await import("child_process");

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

    // Install Apollo Client dependencies
    console.log("🔄 Installing Apollo Client dependencies...");
    execSync(`pnpm add @apollo/client graphql graphql-ws`, {
      cwd: targetWebUiPath,
      stdio: "inherit",
    });

    console.log("✅ Apollo dependencies installed");

    // Create queries directory
    await fs.ensureDir(path.join(targetWebUiPath, "src/queries"));

    // Create GraphQL queries
    const helloQuery = `query GetHello {
  hello
}`;
    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/GetHello.graphql"),
      helloQuery
    );

    const usersQuery = `query GetUsers {
  users {
    id
    name
  }
}`;
    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/GetUsers.graphql"),
      usersQuery
    );

    const addUserMutation = `mutation AddUser($name: String!) {
  addUser(name: $name) {
    id
    name
  }
}`;
    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/AddUser.graphql"),
      addUserMutation
    );

    const greetingsSubscription = `subscription OnGreetings {
  greetings
}`;
    await fs.writeFile(
      path.join(targetWebUiPath, "src/queries/OnGreetings.graphql"),
      greetingsSubscription
    );

    // Create simple App.tsx for the generated project
    const appTsx = `import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import Dashboard from './Dashboard';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Dashboard />
    </ApolloProvider>
  );
}

export default App;`;

    await fs.writeFile(path.join(targetWebUiPath, "src/App.tsx"), appTsx);

    // Create Dashboard component
    const dashboardTsx = `import React, { useState } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_HELLO = gql\`
  query GetHello {
    hello
  }
\`;

const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
    }
  }
\`;

const ADD_USER = gql\`
  mutation AddUser($name: String!) {
    addUser(name: $name) {
      id
      name
    }
  }
\`;

const ON_GREETINGS = gql\`
  subscription OnGreetings {
    greetings
  }
\`;

function Dashboard() {
  const [userName, setUserName] = useState('');
  
  const { data: helloData, loading: helloLoading } = useQuery(GET_HELLO);
  const { data: usersData, loading: usersLoading, refetch } = useQuery(GET_USERS);
  const [addUser, { loading: addUserLoading }] = useMutation(ADD_USER);
  const { data: greetingData } = useSubscription(ON_GREETINGS);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      await addUser({ variables: { name: userName } });
      setUserName('');
      refetch();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GraphQL Dashboard</h1>

      {/* Query Example */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Query Example</h2>
        <div style={{ padding: '10px', backgroundColor: 'black', borderRadius: '5px' }}>
          {helloLoading ? (
            <p>Loading...</p>
          ) : (
            <p><strong>Hello Query:</strong> {helloData?.hello}</p>
          )}
        </div>
      </section>

      {/* Users List */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Users (Query)</h2>
        <div style={{ padding: '10px', backgroundColor: 'black', borderRadius: '5px' }}>
          {usersLoading ? (
            <p>Loading users...</p>
          ) : (
            <ul>
              {usersData?.users?.map((user: any) => (
                <li key={user.id}>{user.name} (ID: {user.id})</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Mutation Example */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Add User (Mutation)</h2>
        <form onSubmit={handleAddUser} style={{ padding: '10px', backgroundColor: 'black', borderRadius: '5px' }}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <button 
            type="submit" 
            disabled={addUserLoading}
            style={{ padding: '5px 10px' }}
          >
            {addUserLoading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </section>

      {/* Subscription Example */}
      <section>
        <h2>Live Greetings (Subscription)</h2>
        <div style={{ padding: '10px', backgroundColor: 'black', borderRadius: '5px' }}>
          <p><strong>Latest Greeting:</strong> {greetingData?.greetings || 'Waiting for messages...'}</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;`;

    await fs.writeFile(
      path.join(targetWebUiPath, "src/Dashboard.tsx"),
      dashboardTsx
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
      "install:all": "pnpm install",
      build: "pnpm --recursive run build",
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
    const { execSync } = await import("child_process");
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
