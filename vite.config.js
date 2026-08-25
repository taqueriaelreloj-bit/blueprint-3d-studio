import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Keep Blueprint 3D Studio on its own Vite dependency cache so an older
  // dev-server session cannot leave stale optimized dependency URLs behind.
  cacheDir: "node_modules/.vite-blueprint-v017",

  optimizeDeps: {
    force: true,
    // Prebundle the React Three stack together so CommonJS/ESM interop stays
    // consistent. `use-sync-external-store/shim/with-selector` is CommonJS and
    // must be wrapped by Vite for the default import used downstream.
    include: [
      "@react-three/drei",
      "@react-three/fiber",
      "three",
      "use-sync-external-store/shim/with-selector",
    ],
    needsInterop: ["use-sync-external-store/shim/with-selector"],
  },

  server: {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
});
