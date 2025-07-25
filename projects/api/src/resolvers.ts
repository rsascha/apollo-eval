import { DatabaseActor, DatabaseMovie, db } from "@/db";
import { AddMovieInput } from "./types";

async function fetchRandomWord(): Promise<string> {
  const response = await fetch("https://random-word-api.herokuapp.com/word");
  const data = (await response.json()) as string[];
  return data[0];
}

export const resolvers = {
  Query: {
    movies: () => {
      const dbResult = db.connection
        .prepare("SELECT id, title FROM movies")
        .all() as DatabaseMovie[];
      const result = dbResult.map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
      }));
      return result;
    },
    actors: () => {
      const dbResult = db.connection
        .prepare("SELECT id, name FROM actors")
        .all() as DatabaseActor[];
      const result = dbResult.map((actor) => ({
        id: actor.id,
        name: actor.name,
      }));
      return result;
    },
    movie: (_: any, { id }: { id: string }) => {
      const dbResult = db.connection
        .prepare("SELECT id, title FROM movies WHERE id = ?")
        .get(id) as DatabaseMovie | undefined;
      if (!dbResult) {
        return null;
      }
      const result = {
        id: dbResult.id.toString(),
        title: dbResult.title,
      };
      return result;
    },
    actor: (_: any, { id }: { id: string }) => {
      const dbResult = db.connection
        .prepare("SELECT id, name FROM actors WHERE id = ?")
        .get(id) as DatabaseActor | undefined;
      if (!dbResult) {
        return null;
      }
      const result = {
        id: dbResult.id,
        name: dbResult.name,
      };
      return result;
    },
    randomWord: async () => {
      return await fetchRandomWord();
    },
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
      return {
        id: movieId,
        title: input.title,
      };
    },
    deleteDatabase: () => {
      return db.delete() && db.create();
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
    greeting: {
      subscribe: async function* () {
        while (true) {
          for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield { greeting: hi };
          }
        }
      },
    },
  },
};
