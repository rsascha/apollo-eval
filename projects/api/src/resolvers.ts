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
  getMoviesWithActors,
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
    movies: (_: any, __: any, ___: any, info: any) => {
      const selections = info.fieldNodes[0]?.selectionSet?.selections || [];
      const hasActorsField = selections.some(
        (selection: any) => selection.name?.value === "actors"
      );
      if (hasActorsField) {
        return getMoviesWithActors();
      } else {
        return getMovies();
      }
    },
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
    actors: (parent: any) => {
      if (parent.actors) {
        return parent.actors;
      }
      return getActorsForMovie(parent.id);
    },
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
