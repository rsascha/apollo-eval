import GET_MOVIE from "@/queries/GetMovie.graphql";
import type { GetMovieQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetMovieQuery>(GET_MOVIE, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="p-8 text-gray-600">Loading movie...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!data?.movie)
    return <div className="p-8 text-gray-600">Movie not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{data.movie.title}</h1>
      <p className="text-gray-600 mb-6">Movie ID: {data.movie.id}</p>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Cast</h2>
        <div className="flex flex-col gap-2">
          {data.movie.actors?.map(actor => (
            <Link
              key={actor.id}
              to={`/actors/${actor.id}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {actor.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
