import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const movies = [
  { id: "1", title: "Inception" },
  { id: "2", title: "The Matrix" },
];

const typeDefs = `#graphql
  type Movie {
    id: ID!
    title: String!
  }
    
  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
  }
`;

const resolvers = {
  Query: {
    movies: () => movies,
    movie: (_: any, { id }: { id: string }) =>
      movies.find((movie) => movie.id === id),
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
console.log("📊 Database initialized with SQLite backend");
