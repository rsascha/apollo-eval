import GET_ACTOR from "@/queries/GetActor.graphql";
import type { GetActorQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

export function ActorDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetActorQuery>(GET_ACTOR, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div className="p-8 text-gray-600">Loading actor...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!data?.actor)
    return <div className="p-8 text-gray-600">Actor not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{data.actor.name}</h1>
      <p className="text-gray-600 mb-6">Actor ID: {data.actor.id}</p>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Movies</h2>
        <div className="flex flex-col gap-2">
          {data.actor.movies?.map(movie => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {movie.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
