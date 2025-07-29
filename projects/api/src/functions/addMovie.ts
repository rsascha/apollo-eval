import { db } from "@/db";
import { pubsub } from "@/pubsub";
import { logFunctionCall } from "@/logger";

export function addMovie(title: string, actorIds: string[]) {
  logFunctionCall("addMovie", title, actorIds);

  // Get the next available ID
  const maxIdResult = db.connection
    .prepare("SELECT MAX(CAST(id AS INTEGER)) as maxId FROM movies")
    .get() as { maxId: number | null };
  const nextId = ((maxIdResult?.maxId || 0) + 1).toString();

  const insertMovie = db.connection.prepare(
    "INSERT INTO movies (id, title) VALUES (?, ?)"
  );
  insertMovie.run(nextId, title);

  if (actorIds.length > 0) {
    const insertMovieActor = db.connection.prepare(
      "INSERT INTO movies_actors (movie_id, actor_id) VALUES (?, ?) ON CONFLICT(movie_id, actor_id) DO NOTHING"
    );

    for (const actorId of actorIds) {
      insertMovieActor.run(nextId, actorId);
    }
  }

  pubsub.emit("MOVIES_UPDATED");

  return {
    id: nextId,
    title: title,
  };
}
