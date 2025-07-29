import type {
  GetActorsWithMoviesQuery,
  GetMoviesQuery,
  GetMoviesWithActorsQuery,
  OnMoviesReloadSubscription,
} from "@/types";
import { useQuery, useSubscription } from "@apollo/client";
import ON_MOVIES_RELOAD_SUBSCRIPTION from "@/queries/OnMoviesReload.graphql";
import GET_MOVIES_QUERY from "@/queries/GetMovies.graphql";
import GET_ACTORS_WITH_MOVIES_QUERY from "@/queries/GetActorsWithMovies.graphql";
import GET_MOVIES_WITH_ACTORS_QUERY from "@/queries/GetMoviesWithActors.graphql";

export function useRefetch() {
  const { refetch: refetchMovies } = useQuery<GetMoviesQuery>(GET_MOVIES_QUERY);
  const { refetch: refetchActorsWithMovies } =
    useQuery<GetActorsWithMoviesQuery>(GET_ACTORS_WITH_MOVIES_QUERY);
  const { refetch: refetchMoviesWithActors } =
    useQuery<GetMoviesWithActorsQuery>(GET_MOVIES_WITH_ACTORS_QUERY);

  useSubscription<OnMoviesReloadSubscription>(ON_MOVIES_RELOAD_SUBSCRIPTION, {
    onData: () => {
      refetchMovies();
      refetchActorsWithMovies();
      refetchMoviesWithActors();
    },
  });
  return;
}
