import { db } from "@/db";
import { pubsub } from "@/pubsub";

export function deleteDatabase(): boolean {
  const result = db.delete() && db.create();
  if (result) pubsub.emit("MOVIES_UPDATED");
  return result;
}
