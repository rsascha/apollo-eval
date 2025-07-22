import GET_ACTORS_QUERY from "@/queries/GetActors.graphql";
import type { GetActorsQuery } from "@/types";
import { useQuery } from "@apollo/client";

export function Actors() {
  const { data, loading, error } = useQuery<GetActorsQuery>(GET_ACTORS_QUERY);

  if (loading)
    return <div className="p-8 text-gray-600">Loading actors...</div>;
  if (error)
    return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!data) return null;

  return JSON.stringify(data.actors, null, 2);
}
