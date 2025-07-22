import GET_ACTORS_WITH_MOVIES_QUERY from "@/queries/GetActorsWithMovies.graphql";
import type { GetActorsWithMoviesQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export function ActorsWithMovies() {
  const { data, loading, error } = useQuery<GetActorsWithMoviesQuery>(
    GET_ACTORS_WITH_MOVIES_QUERY
  );

  if (loading)
    return (
      <div className="p-8 text-gray-600">Loading actors with movies...</div>
    );
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Actors with Movies</h1>
      <div className="flex flex-col gap-6">
        {data?.actors
          ?.filter((actor) => actor != null)
          .map((actor) => (
            <div
              key={actor.id}
              className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-white"
            >
              <Link
                to={`/actors/${actor.id}`}
                className="text-2xl font-semibold text-blue-600 hover:text-blue-800 no-underline transition-colors block mb-4"
              >
                {actor.name}
              </Link>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Movies:
                </h3>
                {actor.movies && actor.movies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {actor.movies
                      .filter((movie) => movie != null)
                      .map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movies/${movie.id}`}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors no-underline"
                        >
                          {movie.title}
                        </Link>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No movies listed</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
