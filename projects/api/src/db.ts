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

const DatabaseActorSql = `
CREATE TABLE IF NOT EXISTS actors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
); 
INSERT INTO actors (id, name) VALUES
  ('1', 'Leonardo DiCaprio'),
  ('2', 'Keanu Reeves'),
  ('3', 'Marion Cotillard')
ON CONFLICT(id) DO NOTHING;
  `;

export interface DatabaseActor {
  id: string;
  name: string;
}

const DatabaseMovieSql = `
CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);
INSERT INTO movies (id, title) VALUES
  ('1', 'Inception'),
  ('2', 'The Matrix'),
  ('3', 'John Wick'), 
  ('4', 'The Dark Knight')
ON CONFLICT(id) DO NOTHING;
  `;

export interface DatabaseMovie {
  id: string;
  title: string;
}

const DatabaseMovieActorSql = `
CREATE TABLE IF NOT EXISTS movies_actors (
  movie_id TEXT,
  actor_id TEXT,
  PRIMARY KEY (movie_id, actor_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (actor_id) REFERENCES actors(id)
); 
INSERT INTO movies_actors (movie_id, actor_id) VALUES
  ('1', '1'),
  ('1', '3'),
  ('2', '2'),
  ('3', '2')
ON CONFLICT(movie_id, actor_id) DO NOTHING;
  `;

export interface DatabaseMovieActor {
  movie_id: string;
  actor_id: string;
}

class Database {
  private _connection: DatabaseSync | null = null;

  get connection(): DatabaseSync {
    if (!this._connection) {
      console.log("📊 Creating new database connection...");
      this._connection = new DatabaseSync(dbPath);
      return this._connection;
    }

    try {
      this._connection.exec("SELECT 1");
      return this._connection;
    } catch (error) {
      console.log("📊 Connection test failed, reconnecting...");
      this.reconnect();
      return this._connection!;
    }
  }

  private reconnect(): void {
    try {
      if (this._connection) {
        try {
          this._connection.close();
        } catch (error) {
          console.log("📊 Error closing old connection:", error);
        }
      }
      this._connection = new DatabaseSync(dbPath);
      console.log("📊 Database connection reestablished");
    } catch (error) {
      console.error("📊 Failed to reconnect:", error);
      throw error;
    }
  }

  create(): boolean {
    this.connection.exec(DatabaseMovieSql);
    this.connection.exec(DatabaseActorSql);
    this.connection.exec(DatabaseMovieActorSql);
    return true;
  }

  delete(): boolean {
    if (!existsSync(dbPath)) {
      console.log("📊 No database to delete.");
      return false;
    }
    console.log("📊 Deleting database...");

    if (this._connection) {
      this._connection.close();
      console.log("📊 Database connection closed.");
    }

    unlinkSync(dbPath);
    console.log(`📊 Database deleted at path: ${dbPath}`);

    this._connection = new DatabaseSync(dbPath);
    console.log(`📊 New database created at path: ${dbPath}`);
    console.log("📊 New database connection established.");
    return true;
  }
}

export const db = new Database();

db.create();
