import { desc } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async () => {
  const posts = await db.select()
    .from(schema.games)
    .orderBy(desc(schema.games.createdAt));

  return posts;
});
