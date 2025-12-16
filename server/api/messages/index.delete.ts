import { eq } from "drizzle-orm";
import { db, schema } from "hub:db";

export default eventHandler(async (event) => {
  const { messageID } = await readBody(event);

  await db.delete(schema.messages)
    .where(eq(schema.messages.id, messageID));

  return {};
});
