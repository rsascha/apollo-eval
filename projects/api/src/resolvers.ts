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
} from "./functions";
import { pubsub } from "./pubsub";
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
      subscribe: subscribeToGreetings(),
    },
    triggerMoviesReload: {
      subscribe: async function* () {
        while (true) {
          await new Promise<void>((resolve) => {
            const handler = () => {
              pubsub.removeListener("MOVIES_UPDATED", handler);
              resolve();
            };
            pubsub.on("MOVIES_UPDATED", handler);
          });
          yield { triggerMoviesReload: true };
        }
      },
    },
  },
};
