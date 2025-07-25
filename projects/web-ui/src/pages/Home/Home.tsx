import { Greetings, ApolloPlayground, DatabaseManagement } from "./components";

export function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Apollo Evaluation</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the GraphQL demo application
      </p>

      <Greetings />
      <ApolloPlayground />
      <DatabaseManagement />
    </div>
  );
}
