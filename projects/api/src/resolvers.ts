import { DatabaseActor, DatabaseMovie, db } from "@/db";
import {
  AddMovieInput,
  QueryActorArgs,
  QueryMovieArgs,
  Resolvers,
} from "./types";
import { EventEmitter } from "events";
import {
  fetchRandomWord,
  getActor,
  getActors,
  getMovie,
  getMovies,
} from "./functions";

const pubsub = new EventEmitter();

export const resolvers: Resolvers = {
  Query: {
    movies: () => getMovies(),
    actors: () => getActors(),
    movie: (_: any, { id }: QueryMovieArgs) => getMovie(id),
    actor: (_: any, { id }: QueryActorArgs) => getActor(id),
    randomWord: async () => fetchRandomWord(),
  },

  Mutation: {
    addMovie: (_: any, { input }: { input: AddMovieInput }) => {
      const insertMovie = db.connection.prepare(
        "INSERT INTO movies (title) VALUES (?)"
      );
      const movieResult = insertMovie.run(input.title);
      const movieId = movieResult.lastInsertRowid.toString();

      if (input.actorIds.length > 0) {
        const insertMovieActor = db.connection.prepare(
          "INSERT INTO movies_actors (movie_id, actor_id) VALUES (?, ?) ON CONFLICT(movie_id, actor_id) DO NOTHING"
        );

        for (const actorId of input.actorIds) {
          insertMovieActor.run(movieId, actorId);
        }
      }

      pubsub.emit("MOVIES_UPDATED");

      return {
        id: movieId,
        title: input.title,
      };
    },
    deleteDatabase: () => {
      const result = db.delete() && db.create();

      pubsub.emit("MOVIES_UPDATED");

      return result;
    },
  },
  Movie: {
    actors: (parent: any) => {
      const dbResult = db.connection
        .prepare(
          `
          SELECT a.id, a.name 
          FROM actors a
          JOIN movies_actors ma ON a.id = ma.actor_id
          WHERE ma.movie_id = ?
        `
        )
        .all(parent.id) as DatabaseActor[];
      return dbResult.map((actor) => ({
        id: actor.id,
        name: actor.name,
      }));
    },
  },
  Actor: {
    movies: (parent: any) => {
      const dbResult = db.connection
        .prepare(
          `
          SELECT m.id, m.title 
          FROM movies m
          JOIN movies_actors ma ON m.id = ma.movie_id
          WHERE ma.actor_id = ?
        `
        )
        .all(parent.id) as DatabaseMovie[];
      return dbResult.map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
      }));
    },
  },
  Subscription: {
    greetings: {
      subscribe: async function* () {
        while (true) {
          for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
            const randomDelay = Math.floor(Math.random() * 9000) + 1000;
            await new Promise((resolve) => setTimeout(resolve, randomDelay));
            yield { greetings: hi };
          }
        }
      },
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
