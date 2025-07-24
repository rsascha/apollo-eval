import { existsSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, "..", "database", "db.sqlite");

const dbExists = existsSync(dbPath);

if (dbExists) {
  console.log(`📊 Use existing database at path: ${dbPath}`);
} else {
  console.log(`📊 DB created at path: ${dbPath}`);
}

const db = new DatabaseSync(dbPath);

export function getDatabaseConnection() {
  return db;
}
