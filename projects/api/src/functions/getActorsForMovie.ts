import { DatabaseActor, db } from "@/db";
import { Actor } from "@/types";

export function getActorsForMovie(movieId: string): Actor[] {
  const dbResult = db.connection
    .prepare(
      `
          SELECT a.id, a.name 
          FROM actors a
          JOIN movies_actors ma ON a.id = ma.actor_id
          WHERE ma.movie_id = ?
        `
    )
    .all(movieId) as unknown as DatabaseActor[];
  const result: Actor[] = dbResult.map((actor) => ({
    id: actor.id,
    name: actor.name,
  }));
  return result;
}
