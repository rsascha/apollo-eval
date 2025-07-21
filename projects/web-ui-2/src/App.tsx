import { gql, useQuery } from "@apollo/client";
import type { GetMoviesQuery } from "./types";

export const GET_MOVIES = gql`
  query GetMovies {
    movies {
      id
      title
    }
  }
`;

export default function App() {
  const { data } = useQuery<GetMoviesQuery>(GET_MOVIES);

  console.debug(data?.movies[0]?.title);

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
