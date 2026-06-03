import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
      include: "**/*.svg?react",
    }),
  ],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      reporter: ["text"],
      include: [
        "src/store/reservationSeatUpdates.ts",
        "src/utils/svgGeometry.ts",
      ],
      thresholds: {
        branches: 97,
        functions: 97,
        lines: 97,
        statements: 97,
      },
    },
  },
});
