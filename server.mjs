import { createServer } from "node:http";
import { readFile, realpath } from "node:fs/promises";
import { lstatSync } from "node:fs";
import { extname, join, resolve, relative, isAbsolute, sep } from "node:path";

// This server is intentionally a development/static server. Only an explicit
// public surface is served; secrets, source-control metadata, backups, and
// arbitrary files in the working directory are never part of that surface.
const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const PUBLIC_ROOT_FILES = new Set([
  "index.html",
  "style.css",
  "script.js",
  "api.js",
  "catalog-local.js",
  "hero-skin-catalog.js",
  "feature-engine.js",
  "manifest.json",
  "skins-live.json",
  "sw.js"
]);
const PUBLIC_DIRS = new Set(["assets"]);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf"
};

function isInsideRoot(candidate) {
  const rel = relative(root, candidate);
  return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

function isPublicRelativePath(rel) {
  const normalized = rel.split(sep).join("/");
  if (!normalized || normalized === ".") return false;
  if (PUBLIC_ROOT_FILES.has(normalized)) return true;
  const first = normalized.split("/")[0];
  return PUBLIC_DIRS.has(first);
}

async function resolvePublicFile(urlPath) {
  try {
    const decoded = decodeURIComponent(String(urlPath || "/").split("?")[0]);
    if (decoded.includes("\0")) return null;

    const relativePath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
    const lexical = resolve(root, relativePath);
    if (!isInsideRoot(lexical)) return null;

    const rel = relative(root, lexical);
    if (!isPublicRelativePath(rel)) return null;

    // Resolve the actual filesystem target so a symlink cannot escape the
    // public root. Lexical traversal protection alone is not sufficient.
    const real = await realpath(lexical);
    if (!isInsideRoot(real)) return null;

    const realRel = relative(root, real);
    if (!isPublicRelativePath(realRel)) return null;

    const stat = lstatSync(real);
    if (stat.isDirectory()) return null;
    return real;
  } catch {
    return null;
  }
}

function send(response, status, type, body) {
  response.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://api-mobilelegends.vercel.app https://mlbb-api.vercel.app https://raw.githubusercontent.com https://quickchart.io; media-src 'self' blob:; worker-src 'self' blob:; form-action 'self'"
  });
  response.end(body);
}

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "text/plain; charset=utf-8", "Method Not Allowed");
    return;
  }

  const filePath = await resolvePublicFile(request.url || "/");
  if (!filePath) {
    send(response, 404, "text/plain; charset=utf-8", "Not Found");
    return;
  }

  try {
    const body = request.method === "HEAD" ? null : await readFile(filePath);
    const type = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    send(response, 200, type, body);
  } catch {
    send(response, 404, "text/plain; charset=utf-8", "Not Found");
  }
}).listen(port, host, () => {
  console.log(`MLBB Flex Profile Studio dev server running at http://${host}:${port}`);
});
