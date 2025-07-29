import { DatabaseActor, db } from "@/db";
import { Actor } from "@/types";
import { logFunctionCall } from "@/logger";

export function getActor(id: string): Actor | null {
  logFunctionCall("getActor", id);

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
