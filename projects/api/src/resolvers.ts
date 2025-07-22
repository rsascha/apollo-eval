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

const movies = [
  { id: "1", title: "Inception", actorIds: ["1", "3"] },
  { id: "2", title: "The Matrix", actorIds: ["2"] },
  { id: "3", title: "John Wick", actorIds: ["2"] },
];

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

const actors = [
  { id: "1", name: "Leonardo DiCaprio", movieIds: ["1"] },
  { id: "2", name: "Keanu Reeves", movieIds: ["2", "3"] },
  { id: "3", name: "Marion Cotillard", movieIds: ["1"] },
];

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
    // actors: () => actors,
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
    // actor: (_: any, { id }: { id: string }) =>
    //   actors.find((actor) => actor.id === id),
  },

  // Movie: {
  //   actors: (parent: any) => {
  //     return actors.filter((actor) => parent.actorIds.includes(actor.id));
  //   },
  // },

  // Actor: {
  //   movies: (parent: any) => {
  //     return movies.filter((movie) => parent.movieIds.includes(movie.id));
  //   },
  // },
};
