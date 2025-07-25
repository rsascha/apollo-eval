import DELETE_DATABASE_QUERY from "@/queries/DeleteDatabase.graphql";
import type { DeleteDatabaseMutation } from "@/types";
import { useMutation, useApolloClient } from "@apollo/client";
import { useState } from "react";

export function DatabaseManagement() {
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

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Database Management
      </h2>
      <p className="text-red-700 text-sm mb-4">
        Danger Zone: This will delete all movies, actors, and relationships from
        the database.
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
  );
}
