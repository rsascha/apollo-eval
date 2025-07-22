import GET_MOVIES_WITH_ACTORS_QUERY from "@/queries/GetMoviesWithActors.graphql";
import type { GetMoviesWithActorsQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

export function MoviesWithActors() {
  const { data, loading, error } = useQuery<GetMoviesWithActorsQuery>(
    GET_MOVIES_WITH_ACTORS_QUERY
  );

  if (loading)
    return (
      <div className="p-8 text-gray-600">Loading movies with actors...</div>
    );
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Movies with Actors</h1>
      <div className="flex flex-col gap-6">
        {data?.movies
          ?.filter((movie) => movie != null)
          .map((movie) => (
            <div
              key={movie.id}
              className="p-6 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow bg-white"
            >
              <Link
                to={`/movies/${movie.id}`}
                className="text-2xl font-semibold text-blue-600 hover:text-blue-800 no-underline transition-colors block mb-4"
              >
                {movie.title}
              </Link>

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Cast:
                </h3>
                {movie.actors && movie.actors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {movie.actors
                      .filter((actor) => actor != null)
                      .map((actor) => (
                        <Link
                          key={actor.id}
                          to={`/actors/${actor.id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors no-underline"
                        >
                          {actor.name}
                        </Link>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No actors listed</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
