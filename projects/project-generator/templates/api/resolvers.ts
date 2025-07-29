// @ts-nocheck

import { Resolvers } from "./types";

const users = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

export const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello World!",
    users: () => users,
  },
  Mutation: {
    addUser: (_: any, { name }: { name: string }) => {
      const newUser = { id: Date.now().toString(), name };
      console.log("Adding user:", newUser);
      users.push(newUser);
      return newUser;
    },
  },
  Subscription: {
    greetings: {
      subscribe: () => {
        const messages = ["Hello!", "Hi there!", "Welcome!", "Good day!"];
        let index = 0;
        return {
          [Symbol.asyncIterator]: async function* () {
            while (true) {
              yield { greetings: messages[index % messages.length] };
              index++;
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          },
        };
      },
    },
  },
};
