import { db } from "@/db";
import { pubsub } from "@/pubsub";
import { logFunctionCall } from "@/logger";

export function deleteDatabase(): boolean {
  logFunctionCall("deleteDatabase");

  const result = db.delete() && db.create();
  if (result) pubsub.emit("MOVIES_UPDATED");
  return result;
}
