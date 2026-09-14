/**
 * GitHub Pages has no server-side rewrite rule, so a hard refresh on a client
 * route (e.g. /tsa-website/gallery) asks Pages for a file that does not exist
 * and it serves 404.html. Shipping a copy of index.html as 404.html lets the
 * SPA boot and React Router resolve the route on the client.
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const index = path.join(dist, "index.html");
const fallback = path.join(dist, "404.html");

if (!fs.existsSync(index)) {
  console.error("copy-404: dist/index.html not found — did `vite build` run?");
  process.exit(1);
}

fs.copyFileSync(index, fallback);
console.log("copy-404: wrote dist/404.html (SPA fallback).");
