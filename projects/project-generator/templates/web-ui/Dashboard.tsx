// @ts-nocheck

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import ADD_USER from "./queries/AddUser.graphql";
import GET_HELLO from "./queries/GetHello.graphql";
import GET_USERS from "./queries/GetUsers.graphql";
import ON_GREETINGS from "./queries/OnGreetings.graphql";
import {
  type AddUserMutation,
  type GetHelloQuery,
  type GetUsersQuery,
  type OnGreetingsSubscription,
} from "./types";

function Dashboard() {
  const [userName, setUserName] = useState("");

  const { data: helloData, loading: helloLoading } =
    useQuery<GetHelloQuery>(GET_HELLO);
  const {
    data: usersData,
    loading: usersLoading,
    refetch,
  } = useQuery<GetUsersQuery>(GET_USERS);
  const [addUser, { loading: addUserLoading }] =
    useMutation<AddUserMutation>(ADD_USER);
  const { data: greetingData } =
    useSubscription<OnGreetingsSubscription>(ON_GREETINGS);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      await addUser({ variables: { name: userName } });
      setUserName("");
      refetch();
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        color: "#333",
      }}
    >
      <h1>Vite Apollo Fullstack Template</h1>

      {/* Query Example */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Query Example</h2>
        <div
          style={{
            padding: "10px",
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
            borderRadius: "5px",
          }}
        >
          {usersLoading ? (
            <p>Loading users...</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {usersData?.users?.map((user) => (
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
            borderRadius: "5px",
          }}
        >
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            style={{
              padding: "5px",
              marginRight: "10px",
              color: "#333",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={addUserLoading}
            style={{
              padding: "5px 10px",
              color: "#333",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
            }}
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
