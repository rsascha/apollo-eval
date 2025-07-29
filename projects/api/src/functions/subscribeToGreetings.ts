import { logFunctionCall } from "@/logger";

export async function* subscribeToGreetings(): AsyncGenerator<{
  greetings: string;
}> {
  logFunctionCall("subscribeToGreetings");
  while (true) {
    for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
      const randomDelay = Math.floor(Math.random() * 9000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      yield { greetings: hi };
    }
  }
}
