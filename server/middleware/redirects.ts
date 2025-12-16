import { kv } from "hub:kv";
import { parseURL } from "ufo";

export default eventHandler(async (event) => {
  // Skip during prerendering
  if (import.meta.prerender)
    return;

  const { pathname } = parseURL(event.path);
  const redirects = await kv.get<{ [key: string]: string }>("redirects");

  if (redirects?.[pathname]) {
    return sendRedirect(event, redirects[pathname]);
  }
});
