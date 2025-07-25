import ADD_MOVIE_MUTATION from "@/queries/AddMovie.graphql";
import GET_ACTORS_QUERY from "@/queries/GetActors.graphql";
import GET_RANDOM_WORD_QUERY from "@/queries/GetRandomWord.graphql";
import type {
  AddMovieMutation,
  AddMovieMutationVariables,
  GetActorsQuery,
  GetRandomWordQuery,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AddMovie() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedActorIds, setSelectedActorIds] = useState<string[]>([]);
  const [isRefetchingRandomWord, setIsRefetchingRandomWord] = useState(false);

  const { data: actorsData, loading: actorsLoading } =
    useQuery<GetActorsQuery>(GET_ACTORS_QUERY);

  const { loading: randomWordLoading, refetch: refetchRandomWord } =
    useQuery<GetRandomWordQuery>(GET_RANDOM_WORD_QUERY, {
      onCompleted: (data) => {
        if (data.randomWord && !title) {
          setTitle(data.randomWord);
        }
      },
    });

  const [addMovie, { loading: addingMovie, error }] = useMutation<
    AddMovieMutation,
    AddMovieMutationVariables
  >(ADD_MOVIE_MUTATION, {
    onCompleted: (data) => {
      navigate(`/movies/${data.addMovie.id}`);
    },
  });

  function handleActorToggle(actorId: string) {
    setSelectedActorIds((prev) =>
      prev.includes(actorId)
        ? prev.filter((id) => id !== actorId)
        : [...prev, actorId]
    );
  }

  function handleGenerateRandomTitle() {
    setIsRefetchingRandomWord(true);
    refetchRandomWord()
      .then((result) => {
        if (result.data?.randomWord) {
          setTitle(result.data.randomWord);
        }
      })
      .finally(() => {
        setIsRefetchingRandomWord(false);
      });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a movie title");
      return;
    }

    addMovie({
      variables: {
        input: {
          title: title.trim(),
          actorIds: selectedActorIds,
        },
      },
    });
  }

  if (actorsLoading || randomWordLoading) {
    return <div className="p-8 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Movie Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter movie title"
              required
            />
            <button
              type="button"
              onClick={handleGenerateRandomTitle}
              disabled={randomWordLoading || isRefetchingRandomWord}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isRefetchingRandomWord ? "..." : "🎲 Random"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Actors
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
            {actorsData?.actors
              ?.filter((actor) => actor != null)
              .map((actor) => (
                <label
                  key={actor.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedActorIds.includes(actor.id)}
                    onChange={() => handleActorToggle(actor.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{actor.name}</span>
                </label>
              ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Selected: {selectedActorIds.length} actor(s)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error.message}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={addingMovie || !title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingMovie ? "Adding Movie..." : "Add Movie"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
