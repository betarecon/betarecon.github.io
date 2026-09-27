import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * GitHub Pages serves a project site from a subpath, not from the domain root:
 *
 *   https://<user>.github.io/<repo>/
 *
 * Vite has to know that, or every asset it emits is requested from
 * /assets/... instead of /<repo>/assets/... and you get a blank page with a
 * console full of 404s. That is by far the most common Pages deploy failure.
 *
 * Set BASE_PATH to "/<repo-name>/" for Pages, or to "/" for a custom domain
 * or any host serving from the root. Keep the leading and trailing slashes.
 */
const BASE_PATH = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    watch: {
      // Windows throws EBUSY when a file is replaced while the watcher is
      // mid-registration on it — which happens constantly with atomic-write
      // editors (they write a temp file, then rename over the target). Vite
      // treats that thrown error as fatal and the whole dev server dies.
      //
      // Removing the temp files from the watch set before the watcher ever
      // sees them is what actually prevents it; `usePolling` only papers over
      // it and burns CPU. The `ignored` entries also cover Vite's own cache.
      ignored: ["**/.*tmpdir/**", "**/.git/**", "**/node_modules/**"],
    },
  },
});
