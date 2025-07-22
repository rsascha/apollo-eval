import GET_MOVIES_QUERY from "@/queries/GetMovies.graphql";
import type { GetMoviesQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export function Movies() {
  const { data, loading, error } = useQuery<GetMoviesQuery>(GET_MOVIES_QUERY);

  if (loading)
    return <div className="p-8 text-gray-600">Loading movies...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>
      <div className="flex flex-col gap-4">
        {data?.movies
          ?.filter((movie) => movie != null)
          .map((movie) => (
            <div
              key={movie.id}
              className="p-4 border border-gray-300 rounded-md hover:shadow-md transition-shadow"
            >
              <Link
                to={`/movies/${movie.id}`}
                className="text-xl text-blue-600 hover:text-blue-800 no-underline transition-colors"
              >
                {movie.title}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
