import { parseURL } from "ufo";

const BLOCKED_EXTENSIONS = new Set([
  "php",
  "asp",
  "aspx",
  "jsp",
  "cgi",
  "env",
  "bak",
  "old",
  "sql",
  "config",
  "ini",
]);

const BLOCKED_PATH_PATTERNS = [
  /\/wp-(admin|includes|content|login)/i,
  /\/xmlrpc\.php/i,
  /\/(phpmyadmin|pma|adminer|myadmin)/i,
  /\/\.(env|git|svn|hg|bzr|aws|ssh|vscode)/i,
  /\/(cgi-bin|actuator|boaform)/i,
  /\/(autodiscover|remote\/login|setup\.cgi|shell)/i,
];

export default eventHandler((event) => {
  if (import.meta.prerender)
    return;

  const { pathname } = parseURL(event.path);

  // Check blocked path patterns
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      setResponseStatus(event, 404);
      return "Not Found";
    }
  }

  // Check file extension
  const parts = pathname.split(".");
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase();
    if (ext && BLOCKED_EXTENSIONS.has(ext)) {
      setResponseStatus(event, 404);
      return "Not Found";
    }
  }
});
