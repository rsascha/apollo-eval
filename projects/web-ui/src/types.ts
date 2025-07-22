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
  name: Scalars['String']['output'];
};

export type Movie = {
  __typename?: 'Movie';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  actors?: Maybe<Array<Maybe<Actor>>>;
  movie?: Maybe<Movie>;
  movies?: Maybe<Array<Maybe<Movie>>>;
};


export type QueryMovieArgs = {
  id: Scalars['ID']['input'];
};

export type GetActorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActorsQuery = { __typename?: 'Query', actors?: Array<{ __typename?: 'Actor', id: string, name: string } | null> | null };

export type GetMovieQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetMovieQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', id: string, title: string } | null };

export type GetMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMoviesQuery = { __typename?: 'Query', movies?: Array<{ __typename?: 'Movie', id: string, title: string } | null> | null };
