import { defineQueryOptions } from "@pinia/colada";

export const gamesQuery = defineQueryOptions({
  key: ["games"],
  // NOTE: the cast sometimes avoids an "Excessive depth check" TS error
  // using $fetch directly doesn't avoid the round trip to the server
  // when doing SSR
  // https://github.com/nuxt/nuxt/issues/24813
  query: () => useRequestFetch()("/api/games") as Promise<Game[]>,
});
