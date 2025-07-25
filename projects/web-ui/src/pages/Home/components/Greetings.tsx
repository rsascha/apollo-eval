import ON_GREETINGS from "@/queries/OnGreetings.graphql";
import type { OnGreetingsSubscription } from "@/types";
import { useSubscription } from "@apollo/client";

export function Greetings() {
  const { data: subscriptionData, loading: subscriptionLoading } =
    useSubscription<OnGreetingsSubscription>(ON_GREETINGS);

  return (
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
  );
}
