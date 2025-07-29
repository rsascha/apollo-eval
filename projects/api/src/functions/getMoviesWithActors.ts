import { db } from "@/db";
import { logFunctionCall } from "@/logger";
import { Actor, Movie } from "@/types";

interface MovieWithActorData {
  movieId: string;
  movieTitle: string;
  actorId: string | null;
  actorName: string | null;
}

export function getMoviesWithActors(): Movie[] {
  logFunctionCall("getMoviesWithActors");

  const dbResult = db.connection
    .prepare(
      `
      SELECT 
        m.id as movieId,
        m.title as movieTitle,
        a.id as actorId,
        a.name as actorName
      FROM movies m
      LEFT JOIN movies_actors ma ON m.id = ma.movie_id
      LEFT JOIN actors a ON a.id = ma.actor_id
      ORDER BY m.id, a.id
    `
    )
    .all() as unknown as MovieWithActorData[];

  // Group the results by movie
  const moviesMap = new Map<string, Movie>();

  for (const row of dbResult) {
    const movieId = row.movieId.toString();

    if (!moviesMap.has(movieId)) {
      moviesMap.set(movieId, {
        id: movieId,
        title: row.movieTitle,
        actors: [],
      });
    }

    const movie = moviesMap.get(movieId)!;

    // Add actor if exists (LEFT JOIN might return null actors)
    if (row.actorId && row.actorName) {
      const actor: Actor = {
        id: row.actorId,
        name: row.actorName,
      };

      // Check if actor is already added (shouldn't happen with proper data, but safety check)
      if (!movie.actors?.some((a) => a.id === actor.id)) {
        if (!movie.actors) movie.actors = [];
        movie.actors.push(actor);
      }
    }
  }

  return Array.from(moviesMap.values());
}
