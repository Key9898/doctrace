import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { getHttpsServerOptions } from "office-addin-dev-certs";

export default defineConfig(async ({ command }) => {
  const https =
    command === "build"
      ? undefined
      : await getHttpsServerOptions(undefined, ["127.0.0.1", "localhost"]);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
      strictPort: true,
      hmr: {
        host: "127.0.0.1",
        port: 3000,
        clientPort: 3000,
        protocol: "wss",
      },
      ...(https ? { https } : {}),
    },
    preview: {
      host: "127.0.0.1",
      port: 4173,
      ...(https ? { https } : {}),
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      target: "es2022",
    },
  };
});
