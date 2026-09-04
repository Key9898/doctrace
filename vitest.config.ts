import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./frontend/src/test/setup.ts"],
    include: ["frontend/src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["frontend/src/**/*.{ts,tsx}"],
      exclude: [
        "frontend/src/**/*.d.ts",
        "frontend/src/test/**/*",
        "frontend/src/main.tsx",
        "frontend/src/types/**/*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./frontend/src"),
    },
  },
});
