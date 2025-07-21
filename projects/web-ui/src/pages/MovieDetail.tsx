import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_MOVIE = gql`
  query GetMovie($id: ID!) {
    movie(id: $id) {
      id
      title
    }
  }
`;

interface GetMovieQuery {
  movie?: {
    id: string;
    title: string;
  } | null;
}

export function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<GetMovieQuery>(GET_MOVIE, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <div>Loading movie...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.movie) return <div>Movie not found</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{data.movie.title}</h1>
      <p>Movie ID: {data.movie.id}</p>
    </div>
  );
}
