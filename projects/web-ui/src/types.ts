export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Actor = {
  __typename?: 'Actor';
  id: Scalars['ID']['output'];
  movies: Array<Movie>;
  name: Scalars['String']['output'];
};

export type AddMovieInput = {
  actorIds: Array<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type Movie = {
  __typename?: 'Movie';
  actors: Array<Actor>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMovie: Movie;
};


export type MutationAddMovieArgs = {
  input: AddMovieInput;
};

export type Query = {
  __typename?: 'Query';
  actor?: Maybe<Actor>;
  actors?: Maybe<Array<Maybe<Actor>>>;
  movie?: Maybe<Movie>;
  movies?: Maybe<Array<Maybe<Movie>>>;
  randomMovieName: Scalars['String']['output'];
};


export type QueryActorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMovieArgs = {
  id: Scalars['ID']['input'];
};

export type AddMovieMutationVariables = Exact<{
  input: AddMovieInput;
}>;


export type AddMovieMutation = { __typename?: 'Mutation', addMovie: { __typename?: 'Movie', id: string, title: string, actors: Array<{ __typename?: 'Actor', id: string, name: string }> } };

export type GetActorQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetActorQuery = { __typename?: 'Query', actor?: { __typename?: 'Actor', id: string, name: string, movies: Array<{ __typename?: 'Movie', id: string, title: string }> } | null };

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename?: 'Query', actors?: Array<{ __typename?: 'Actor', id: string, name: string } | null> | null };

export type GetActorsWithMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsWithMoviesQuery = { __typename?: 'Query', actors?: Array<{ __typename?: 'Actor', id: string, name: string, movies: Array<{ __typename?: 'Movie', id: string, title: string }> } | null> | null };

export type GetMovieQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMovieQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', id: string, title: string, actors: Array<{ __typename?: 'Actor', id: string, name: string }> } | null };

export type GetMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMoviesQuery = { __typename?: 'Query', movies?: Array<{ __typename?: 'Movie', id: string, title: string } | null> | null };

export type GetMoviesWithActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMoviesWithActorsQuery = { __typename?: 'Query', movies?: Array<{ __typename?: 'Movie', id: string, title: string, actors: Array<{ __typename?: 'Actor', id: string, name: string }> } | null> | null };

export type GetRandomMovieNameQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRandomMovieNameQuery = { __typename?: 'Query', randomMovieName: string };
