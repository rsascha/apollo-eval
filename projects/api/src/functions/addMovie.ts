import { db } from "@/db";
import { pubsub } from "@/pubsub";

export function addMovie(title: string, actorIds: string[]) {
  const insertMovie = db.connection.prepare(
    "INSERT INTO movies (title) VALUES (?)"
  );
  const movieResult = insertMovie.run(title);
  const movieId = movieResult.lastInsertRowid.toString();

  if (actorIds.length > 0) {
    const insertMovieActor = db.connection.prepare(
      "INSERT INTO movies_actors (movie_id, actor_id) VALUES (?, ?) ON CONFLICT(movie_id, actor_id) DO NOTHING"
    );

    for (const actorId of actorIds) {
      insertMovieActor.run(movieId, actorId);
    }
  }

  pubsub.emit("MOVIES_UPDATED");

  return {
    id: movieId,
    title: title,
  };
}
