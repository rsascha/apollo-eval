import { DatabaseMovie, db } from "@/db";
import { Movie } from "@/types";
import { logFunctionCall } from "@/logger";

export function getMoviesForActor(actorId: string): Movie[] {
  logFunctionCall("getMoviesForActor", actorId);

  const dbResult = db.connection
    .prepare(
      `
          SELECT m.id, m.title 
          FROM movies m
          JOIN movies_actors ma ON m.id = ma.movie_id
          WHERE ma.actor_id = ?
        `
    )
    .all(actorId) as unknown as DatabaseMovie[];
  const result: Movie[] = dbResult.map((movie) => ({
    id: movie.id,
    title: movie.title,
  }));
  return result;
}
