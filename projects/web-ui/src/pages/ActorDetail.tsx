import GET_ACTOR from "@/queries/GetActor.graphql";
import type { GetActorQuery } from "@/types";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

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
      <p className="text-gray-600">Actor ID: {data.actor.id}</p>
    </div>
  );
}
