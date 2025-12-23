import { eq } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const post = await db.select()
    .from(schema.games)
    .where(eq(schema.games.id, Number(id)))
    .get();

  if (!post) {
    throw createError({ statusCode: 404, message: "Post not found" });
  }

  return post;
});
