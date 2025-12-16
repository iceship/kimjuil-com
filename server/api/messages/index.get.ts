import { desc } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async () => {
  return db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));
});
