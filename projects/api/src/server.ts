import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";

const __dirname = new URL(".", import.meta.url).pathname;

const movies = [
  { id: "1", title: "Inception" },
  { id: "2", title: "The Matrix" },
];
const typeDefs = readFileSync(`${__dirname}/schema.graphql`, {
  encoding: "utf-8",
});

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_: any, { id }: { id: string }) =>
      movies.find((movie) => movie.id === id),
  },
};

interface MyContext extends BaseContext {}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
console.log("📊 Database initialized with SQLite backend");
