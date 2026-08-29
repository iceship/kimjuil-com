import { kv } from "hub:kv";
import { parseURL } from "ufo";

let cachedRedirects: Record<string, string> | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache per worker instance

async function getRedirects(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedRedirects && now < cacheExpiresAt) {
    return cachedRedirects;
  }
  try {
    const data = await kv.get<Record<string, string>>("redirects");
    cachedRedirects = data || {};
    cacheExpiresAt = now + CACHE_TTL_MS;
    return cachedRedirects;
  }
  catch {
    return cachedRedirects || {};
  }
}

export default eventHandler(async (event) => {
  // Skip during prerendering
  if (import.meta.prerender)
    return;

  const { pathname } = parseURL(event.path);

  // Skip static assets, APIs, and internal endpoints
  if (
    pathname.startsWith("/api/")
    || pathname.startsWith("/_")
    || pathname.startsWith("/images/")
    || pathname.includes(".")
  ) {
    return;
  }

  const redirects = await getRedirects();

  if (redirects?.[pathname]) {
    return sendRedirect(event, redirects[pathname]);
  }
});
