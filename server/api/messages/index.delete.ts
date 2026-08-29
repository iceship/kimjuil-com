import { eq } from "drizzle-orm";
import { db, schema } from "hub:db";
import { z } from "zod";

const BodySchema = z.object({
  messageID: z.number().int(),
});

export default eventHandler(async (event) => {
  await requireUserSession(event);
  const { messageID } = await readValidatedBody(event, b => BodySchema.parse(b));

  await db.delete(schema.messages)
    .where(eq(schema.messages.id, messageID));

  return {};
});
