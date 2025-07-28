import { DatabaseMovie, db } from "@/db";

export function getMovies() {
  const dbResult = db.connection
    .prepare("SELECT id, title FROM movies")
    .all() as DatabaseMovie[];
  const result = dbResult.map((movie) => ({
    id: movie.id.toString(),
    title: movie.title,
  }));
  return result;
}
