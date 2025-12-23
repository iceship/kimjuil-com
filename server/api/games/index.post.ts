import { db, schema } from "hub:db";
import { z } from "zod";

const BodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fen: z.string().optional(),
  pgn: z.string().min(1),
});

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, b => BodySchema.parse(b));

  const post = await db.insert(schema.games).values({
    userId: user.id,
    title: body.title,
    description: body.description || "",
    fen: body.fen || "",
    pgn: body.pgn,
    createdAt: new Date(),
  }).returning();

  return post[0];
});
