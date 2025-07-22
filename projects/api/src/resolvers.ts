import { getDatabaseConnection } from "./database";

const db = getDatabaseConnection();

interface DatabaseMovie {
  id: number;
  title: string;
}

db.exec(`
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

interface DatabaseActor {
  id: string;
  name: string;
}

db.exec(`
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

db.exec(`
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

export const resolvers = {
  Query: {
    movies: () => {
      const dbResult = db
        .prepare("SELECT id, title FROM movies")
        .all() as DatabaseMovie[];
      const result = dbResult.map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
      }));
      return result;
    },
    actors: () => {
      const dbResult = db
        .prepare("SELECT id, name FROM actors")
        .all() as DatabaseActor[];
      const result = dbResult.map((actor) => ({
        id: actor.id,
        name: actor.name,
      }));
      return result;
    },
    movie: (_: any, { id }: { id: string }) => {
      const dbResult = db
        .prepare("SELECT id, title FROM movies WHERE id = ?")
        .get(id) as DatabaseMovie | undefined;
      if (!dbResult) {
        return null;
      }
      const result = {
        id: dbResult.id.toString(),
        title: dbResult.title,
      };
      return result;
    },
    actor: (_: any, { id }: { id: string }) => {
      const dbResult = db
        .prepare("SELECT id, name FROM actors WHERE id = ?")
        .get(id) as DatabaseActor | undefined;
      if (!dbResult) {
        return null;
      }
      const result = {
        id: dbResult.id,
        name: dbResult.name,
      };
      return result;
    },
  },
  Movie: {
    actors: (parent: any) => {
      const dbResult = db
        .prepare(
          `
          SELECT a.id, a.name 
          FROM actors a
          JOIN movies_actors ma ON a.id = ma.actor_id
          WHERE ma.movie_id = ?
        `
        )
        .all(parent.id) as DatabaseActor[];

      return dbResult.map((actor) => ({
        id: actor.id,
        name: actor.name,
      }));
    },
  },
  Actor: {
    movies: (parent: any) => {
      const dbResult = db
        .prepare(
          `
          SELECT m.id, m.title 
          FROM movies m
          JOIN movies_actors ma ON m.id = ma.movie_id
          WHERE ma.actor_id = ?
        `
        )
        .all(parent.id) as DatabaseMovie[];

      return dbResult.map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
      }));
    },
  },
};
