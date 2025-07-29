import { logFunctionCall } from "@/logger";

export async function fetchRandomWord(): Promise<string> {
  logFunctionCall("fetchRandomWord");

  const response = await fetch("https://random-word-api.herokuapp.com/word");
  const data = (await response.json()) as string[];
  return data[0];
}
