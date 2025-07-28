import { pubsub } from "@/pubsub";

export async function* subscribeToMoviesReload(): AsyncGenerator<{
  triggerMoviesReload: boolean;
}> {
  while (true) {
    await new Promise<void>((resolve) => {
      const handler = () => {
        pubsub.removeListener("MOVIES_UPDATED", handler);
        resolve();
      };
      pubsub.on("MOVIES_UPDATED", handler);
    });
    yield { triggerMoviesReload: true };
  }
}
