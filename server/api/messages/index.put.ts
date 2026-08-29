import { eq } from "drizzle-orm";
import { db, schema } from "hub:db";
import { z } from "zod";

const BodySchema = z.object({
  messageID: z.number().int(),
  text: z.string().min(1).max(1000),
});

export default eventHandler(async (event) => {
  await requireUserSession(event);
  const { messageID, text } = await readValidatedBody(event, b => BodySchema.parse(b));

  await db.update(schema.messages)
    .set({ text })
    .where(eq(schema.messages.id, messageID));

  return {};
});
