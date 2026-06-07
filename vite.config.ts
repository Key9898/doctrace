import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";
import { getHttpsServerOptions } from "office-addin-dev-certs";

export default defineConfig(async ({ command }) => {
  let httpsOptions:
    | Awaited<ReturnType<typeof getHttpsServerOptions>>
    | undefined;

  if (command !== "build") {
    try {
      httpsOptions = await getHttpsServerOptions(undefined, [
        "127.0.0.1",
        "localhost",
      ]);
    } catch {
      console.warn(
        "Certificate not available, falling back to HTTP. Run 'npm run certs:install' as Administrator to enable HTTPS.",
      );
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "client-logger",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/api/log" && req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", () => {
                try {
                  const data = JSON.parse(body);
                  const logLine = `[${new Date().toISOString()}] [${data.type || "ERROR"}] ${data.message}\n${data.stack ? data.stack + "\n" : ""}\n`;
                  fs.appendFileSync(
                    path.resolve(__dirname, "client_errors.log"),
                    logLine,
                    "utf-8",
                  );
                  res.statusCode = 200;
                  res.end("OK");
                } catch {
                  res.statusCode = 500;
                  res.end("Fail");
                }
              });
            } else {
              next();
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
      strictPort: true,
      hmr: httpsOptions
        ? {
            host: "127.0.0.1",
            port: 3000,
            clientPort: 3000,
            protocol: "wss",
          }
        : undefined,
      ...(httpsOptions ? { https: httpsOptions } : {}),
    },
    preview: {
      host: "127.0.0.1",
      port: 4173,
      ...(httpsOptions ? { https: httpsOptions } : {}),
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      target: "es2022",
    },
  };
});
