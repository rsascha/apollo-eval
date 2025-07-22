import { existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "db.sqlite");

// if (existsSync(dbPath)) {
//   unlinkSync(dbPath);
//   console.log("Existing database file removed");
// }

const db = new DatabaseSync(dbPath);

export function getDatabaseConnection() {
  return db;
}
