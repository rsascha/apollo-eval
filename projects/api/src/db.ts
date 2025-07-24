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

interface DbObject {
  connection: DatabaseSync;
  create: () => boolean;
  delete: () => boolean;
}

export const db: DbObject = {
  connection: new DatabaseSync(dbPath),
  create: createDatabase,
  delete: deleteDatabase,
};

db.create();

export interface DatabaseActor {
  id: string;
  name: string;
}

export interface AddMovieInput {
  title: string;
  actorIds: string[];
}

export interface DatabaseMovie {
  id: number;
  title: string;
}

function createDatabase(this: DbObject) {
  this.connection.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL
  );
  -- Insert some dummy data
  INSERT INTO movies (id, title) VALUES
    (1, 'Inception'),
    (2, 'The Matrix'),
    (3, 'John Wick'), 
    (4, 'The Dark Knight')
  ON CONFLICT(id) DO NOTHING;
`);

  this.connection.exec(`
  CREATE TABLE IF NOT EXISTS actors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  ); 
  -- Insert some dummy data
  INSERT INTO actors (id, name) VALUES
    ('1', 'Leonardo DiCaprio'),
    ('2', 'Keanu Reeves'),
    ('3', 'Marion Cotillard')
  ON CONFLICT(id) DO NOTHING;
`);

  this.connection.exec(`
  CREATE TABLE IF NOT EXISTS movies_actors (
    movie_id TEXT,
    actor_id TEXT,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (actor_id) REFERENCES actors(id)
  ); 
  -- Insert some dummy data
  INSERT INTO movies_actors (movie_id, actor_id) VALUES
    ('1', '1'),
    ('1', '3'),
    ('2', '2'),
    ('3', '2')
  ON CONFLICT(movie_id, actor_id) DO NOTHING;
`);

  return true;
}

function deleteDatabase(this: DbObject) {
  if (!existsSync(dbPath)) {
    console.log("📊 No database to delete.");
    return false;
  }
  console.log("📊 Deleting database...");
  this.connection.close();
  console.log("📊 Database connection closed.");
  unlinkSync(dbPath);
  console.log(`📊 Database deleted at path: ${dbPath}`);
  this.connection = new DatabaseSync(dbPath);
  console.log(`📊 New database created at path: ${dbPath}`);
  console.log("📊 New database connection established.");
  return true;
}
