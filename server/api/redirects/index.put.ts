import { kv } from "hub:kv";
import { z } from "zod";

const RedirectsSchema = z.record(z.string().min(1), z.string().min(1));

export default eventHandler(async (event) => {
  await requireUserSession(event);
  const body = await readValidatedBody(event, b => RedirectsSchema.parse(b));

  // Used in server/middleware/redirects.ts
  await kv.set("redirects", body);

  return body;
});
