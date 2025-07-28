export async function fetchRandomWord(): Promise<string> {
  const response = await fetch("https://random-word-api.herokuapp.com/word");
  const data = (await response.json()) as string[];
  return data[0];
}
