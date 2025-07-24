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

const db = { dbSync: new DatabaseSync(dbPath) };

export function getDatabaseConnection() {
  return db.dbSync;
}

export function deleteDatabase() {
  console.log("📊 Deleting database...");
  if (dbExists) {
    db.dbSync.close();
    unlinkSync(dbPath);
    console.log(`📊 Database deleted at path: ${dbPath}`);
    db.dbSync = new DatabaseSync(dbPath);
    console.log(`📊 New database created at path: ${dbPath}`);
  } else {
    console.log("📊 No database to delete.");
  }
}
