import { eq } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  // List todos for the current user
  const todos = await db.select().from(schema.todos).where(eq(schema.todos.userId, user.id));

  return todos;
});
