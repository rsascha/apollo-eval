const movies = [
  { id: "1", title: "Inception" },
  { id: "2", title: "The Matrix" },
];

const actors = [
  { id: "1", name: "Leonardo DiCaprio" },
  { id: "2", name: "Keanu Reeves" },
];

export const resolvers = {
  Query: {
    movies: () => movies,
    actors: () => actors,
    movie: (_: any, { id }: { id: string }) =>
      movies.find((movie) => movie.id === id),
    actor: (_: any, { id }: { id: string }) =>
      actors.find((actor) => actor.id === id),
  },
};
