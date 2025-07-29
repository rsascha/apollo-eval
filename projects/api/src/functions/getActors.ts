import { DatabaseActor, db } from "@/db";
import { Actor } from "@/types";
import { logFunctionCall } from "@/logger";

export function getActors(): Actor[] {
  logFunctionCall("getActors");

  const dbResult = db.connection
    .prepare("SELECT id, name FROM actors")
    .all() as unknown as DatabaseActor[];
  const result: Actor[] = dbResult.map((actor) => ({
    id: actor.id,
    name: actor.name,
  }));
  return result;
}
