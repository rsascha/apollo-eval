import { DatabaseMovie, db } from "@/db";
import { Movie } from "@/types";

export function getMovie(id: string): Movie | null {
  const dbResult = db.connection
    .prepare("SELECT id, title FROM movies WHERE id = ?")
    .get(id) as DatabaseMovie | undefined;
  if (!dbResult) {
    return null;
  }
  const result: Movie = {
    id: dbResult.id.toString(),
    title: dbResult.title,
  };
  return result;
}
