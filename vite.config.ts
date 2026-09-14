import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Deployed at https://campuscoderscrew.github.io/tsa-website/, so every asset
 * URL needs the repo name in front of it. Vite exposes this as
 * `import.meta.env.BASE_URL`, which the app already uses for /public assets.
 *
 * Override with the VITE_BASE env var when the target changes:
 *   - custom domain (tsa.campuscoderscrew.com) -> VITE_BASE=/
 *   - local dev / preview                      -> unset (defaults below)
 */
const base = process.env.VITE_BASE ?? "/tsa-website/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
