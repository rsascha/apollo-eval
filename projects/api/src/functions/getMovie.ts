import { DatabaseMovie, db } from "@/db";
import { Movie } from "@/types";
import { logFunctionCall } from "@/logger";

export function getMovie(id: string): Movie | null {
  logFunctionCall("getMovie", id);

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
