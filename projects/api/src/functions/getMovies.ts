import { DatabaseMovie, db } from "@/db";
import { Movie } from "@/types";
import { logFunctionCall } from "@/logger";

export function getMovies(): Movie[] {
  logFunctionCall("getMovies");

  const dbResult = db.connection
    .prepare("SELECT id, title FROM movies")
    .all() as unknown as DatabaseMovie[];
  const result: Movie[] = dbResult.map((movie) => ({
    id: movie.id.toString(),
    title: movie.title,
  }));
  return result;
}
