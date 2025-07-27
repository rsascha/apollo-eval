// @ts-nocheck

import React, { useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_HELLO = gql`
  query GetHello {
    hello
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($name: String!) {
    addUser(name: $name) {
      id
      name
    }
  }
`;

const ON_GREETINGS = gql`
  subscription OnGreetings {
    greetings
  }
`;

function Dashboard() {
  const [userName, setUserName] = useState("");

  const { data: helloData, loading: helloLoading } = useQuery(GET_HELLO);
  const {
    data: usersData,
    loading: usersLoading,
    refetch,
  } = useQuery(GET_USERS);
  const [addUser, { loading: addUserLoading }] = useMutation(ADD_USER);
  const { data: greetingData } = useSubscription(ON_GREETINGS);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      await addUser({ variables: { name: userName } });
      setUserName("");
      refetch();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>GraphQL Dashboard</h1>

      {/* Query Example */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Query Example</h2>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          {helloLoading ? (
            <p>Loading...</p>
          ) : (
            <p>
              <strong>Hello Query:</strong> {helloData?.hello}
            </p>
          )}
        </div>
      </section>

      {/* Users List */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Users (Query)</h2>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          {usersLoading ? (
            <p>Loading users...</p>
          ) : (
            <ul>
              {usersData?.users?.map((user: any) => (
                <li key={user.id}>
                  {user.name} (ID: {user.id})
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Mutation Example */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Add User (Mutation)</h2>
        <form
          onSubmit={handleAddUser}
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <button
            type="submit"
            disabled={addUserLoading}
            style={{ padding: "5px 10px" }}
          >
            {addUserLoading ? "Adding..." : "Add User"}
          </button>
        </form>
      </section>

      {/* Subscription Example */}
      <section>
        <h2>Live Greetings (Subscription)</h2>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Latest Greeting:</strong>{" "}
            {greetingData?.greetings || "Waiting for messages..."}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
