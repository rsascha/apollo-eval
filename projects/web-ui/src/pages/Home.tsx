import DELETE_DATABASE_QUERY from "@/queries/DeleteDatabase.graphql";
import type { DeleteDatabaseMutation, OnGreetingsSubscription } from "@/types";
import { useMutation, useApolloClient, useSubscription } from "@apollo/client";
import { useState } from "react";
import ON_GREETINGS from "@/queries/OnGreetings.graphql";

export function Home() {
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const client = useApolloClient();

  const [deleteDatabase, { loading: isDeleting }] =
    useMutation<DeleteDatabaseMutation>(DELETE_DATABASE_QUERY, {
      onCompleted: async (data) => {
        if (data.deleteDatabase) {
          await client.clearStore();
          setDeleteResult("Database deleted successfully!");
        } else {
          setDeleteResult("Failed to delete database.");
        }
        setTimeout(() => setDeleteResult(null), 3000);
      },
      onError: (error) => {
        setDeleteResult(`Error: ${error.message}`);
        setTimeout(() => setDeleteResult(null), 5000);
      },
    });

  const { data: subscriptionData, loading: subscriptionLoading } =
    useSubscription<OnGreetingsSubscription>(ON_GREETINGS);

  console.debug("Subscription Data:", subscriptionData);
  console.debug("Subscription Loading:", subscriptionLoading);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Apollo Evaluation</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the GraphQL demo application
      </p>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Live Greetings
        </h2>
        {subscriptionLoading ? (
          <div className="flex items-center text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            Loading greetings...
          </div>
        ) : subscriptionData?.greetings ? (
          <p className="text-blue-700 font-medium">
            {subscriptionData.greetings}
          </p>
        ) : (
          <p className="text-blue-600">No greetings received yet</p>
        )}
      </div>

      <div className="mb-6">
        <a
          href="http://localhost:4000/graphql"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          🚀 Open Apollo Server Playground
        </a>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Database Management
        </h2>
        <p className="text-red-700 text-sm mb-4">
          Danger Zone: This will delete all movies, actors, and relationships
          from the database.
        </p>
        <button
          onClick={() => deleteDatabase()}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "🗑️ Delete Database"}
        </button>

        {deleteResult && (
          <div
            className={`mt-3 text-sm ${
              deleteResult.includes("Error") ? "text-red-700" : "text-green-700"
            }`}
          >
            {deleteResult}
          </div>
        )}
      </div>
    </div>
  );
}
