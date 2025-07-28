import { DatabaseMovie, db } from "@/db";
import {
  addMovie,
  deleteDatabase,
  fetchRandomWord,
  getActor,
  getActors,
  getActorsForMovie,
  getMovie,
  getMovies,
  getMoviesForActor,
  subscribeToGreetings,
  subscribeToMoviesReload,
} from "./functions";
import {
  AddMovieInput,
  QueryActorArgs,
  QueryMovieArgs,
  Resolvers,
} from "./types";

export const resolvers: Resolvers = {
  Query: {
    movies: () => getMovies(),
    actors: () => getActors(),
    movie: (_: any, { id }: QueryMovieArgs) => getMovie(id),
    actor: (_: any, { id }: QueryActorArgs) => getActor(id),
    randomWord: async () => fetchRandomWord(),
  },

  Mutation: {
    addMovie: (_: any, { input }: { input: AddMovieInput }) =>
      addMovie(input.title, input.actorIds),
    deleteDatabase: () => deleteDatabase(),
  },
  Movie: {
    actors: (parent: any) => getActorsForMovie(parent.id),
  },
  Actor: {
    movies: (parent: any) => getMoviesForActor(parent.id),
  },
  Subscription: {
    greetings: {
      subscribe: () => subscribeToGreetings(),
    },
    triggerMoviesReload: {
      subscribe: () => subscribeToMoviesReload(),
    },
  },
};
