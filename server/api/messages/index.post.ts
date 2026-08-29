import { db, schema } from "hub:db";
import { z } from "zod";

const BodySchema = z.object({
  text: z.string().min(1).max(1000),
});

export default eventHandler(async (event) => {
  await requireUserSession(event);
  const { text } = await readValidatedBody(event, b => BodySchema.parse(b));

  await db.insert(schema.messages).values({
    text,
    createdAt: Date.now(),
  });

  return {};
});
