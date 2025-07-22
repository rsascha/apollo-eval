const movies = [
  { id: "1", title: "Inception", actorIds: ["1", "3"] },
  { id: "2", title: "The Matrix", actorIds: ["2"] },
  { id: "3", title: "John Wick", actorIds: ["2"] },
];

const actors = [
  { id: "1", name: "Leonardo DiCaprio", movieIds: ["1"] },
  { id: "2", name: "Keanu Reeves", movieIds: ["2", "3"] },
  { id: "3", name: "Marion Cotillard", movieIds: ["1"] },
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

  Movie: {
    actors: (parent: any) => {
      return actors.filter((actor) => parent.actorIds.includes(actor.id));
    },
  },

  Actor: {
    movies: (parent: any) => {
      return movies.filter((movie) => parent.movieIds.includes(movie.id));
    },
  },
};
