import { sql } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async () => {
  // Count the total number of todos
  const result = await db.select({
    todos: sql<number>`count(*)`,
    users: sql<number>`count(distinct(${schema.todos.userId}))`,
  }).from(schema.todos);

  return result[0];
});
