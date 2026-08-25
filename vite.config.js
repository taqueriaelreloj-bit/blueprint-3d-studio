import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Keep Blueprint 3D Studio on its own Vite dependency cache so an older
  // dev-server session cannot leave stale optimized dependency URLs behind.
  cacheDir: "node_modules/.vite-blueprint-v016",

  optimizeDeps: {
    force: true,
    // React Three packages were repeatedly returning Vite 504
    // "Outdated Optimize Dep" responses in Chrome. Serve them directly
    // instead of relying on a stale pre-bundled copy.
    exclude: ["@react-three/drei", "@react-three/fiber", "three"],
  },

  server: {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
});
