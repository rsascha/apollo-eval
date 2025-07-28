import { DatabaseActor, db } from "@/db";
import { Actor } from "@/types";

export function getActor(id: string): Actor | null {
  const dbResult = db.connection
    .prepare("SELECT id, name FROM actors WHERE id = ?")
    .get(id) as DatabaseActor | undefined;
  if (!dbResult) {
    return null;
  }
  const result: Actor = {
    id: dbResult.id,
    name: dbResult.name,
  };
  return result;
}
