import GET_MOVIES_QUERY from "@/queries/GetMovies.graphql";
import type { GetMoviesQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export function Movies() {
  const { data, loading, error } = useQuery<GetMoviesQuery>(GET_MOVIES_QUERY);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Movies</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {data?.movies
          ?.filter((movie) => movie != null)
          .map((movie) => (
            <div
              key={movie.id}
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <Link
                to={`/movies/${movie.id}`}
                style={{ textDecoration: "none", fontSize: "1.2rem" }}
              >
                {movie.title}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
