import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import { useServer } from "graphql-ws/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { resolvers } from "./resolvers";

const __dirname = new URL(".", import.meta.url).pathname;

const typeDefs = readFileSync(`${__dirname}/schema.graphql`, {
  encoding: "utf-8",
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/subscriptions",
});

const serverCleanup = useServer({ schema }, wsServer);

interface MyContext extends BaseContext {
  token?: String;
}
const server = new ApolloServer<MyContext>({
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

await server.start();

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

httpServer.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:4000/subscriptions`);
});

// References:
// - https://www.apollographql.com/docs/apollo-server/api/standalone
// - https://www.apollographql.com/docs/apollo-server/builtin-plugins
// - https://www.apollographql.com/docs/apollo-server/data/subscriptions
// - https://www.apollographql.com/docs/apollo-server/api/express-middleware
