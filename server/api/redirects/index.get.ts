import { kv } from "hub:kv";

export default eventHandler(async (event) => {
  await requireUserSession(event);
  return (await kv.get("redirects") || {});
});
