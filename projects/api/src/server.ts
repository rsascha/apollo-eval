import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import { resolvers } from "./resolvers";
import express from "express";
import { createServer } from "http";

const __dirname = new URL(".", import.meta.url).pathname;

const typeDefs = readFileSync(`${__dirname}/schema.graphql`, {
  encoding: "utf-8",
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

interface MyContext extends BaseContext {
  token?: String;
}

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/subscriptions",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

// const { url } = await startStandaloneServer(server);
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ token: req.headers.token }),
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);

// https://www.apollographql.com/docs/apollo-server/data/subscriptions
