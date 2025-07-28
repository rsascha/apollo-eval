import { DatabaseMovie, db } from "@/db";
import { Movie } from "@/types";

export function getMovies(): Movie[] {
  const dbResult = db.connection
    .prepare("SELECT id, title FROM movies")
    .all() as DatabaseMovie[];
  const result: Movie[] = dbResult.map((movie) => ({
    id: movie.id.toString(),
    title: movie.title,
  }));
  return result;
}
