import { DatabaseActor, db } from "@/db";
import { Actor } from "@/types";

export function getActors(): Actor[] {
  const dbResult = db.connection
    .prepare("SELECT id, name FROM actors")
    .all() as DatabaseActor[];
  const result: Actor[] = dbResult.map((actor) => ({
    id: actor.id,
    name: actor.name,
  }));
  return result;
}
