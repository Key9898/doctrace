import { existsSync, readFileSync } from "node:fs";
import {
  createServer as createHttpServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { homedir } from "node:os";
import { join } from "node:path";

import { HOST, PORT } from "./config.js";
import { applyCors, sendJson } from "./http.js";
import { sendHealth } from "./routes/health.js";

function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
): void {
  if (request.method === "OPTIONS") {
    applyCors(response);
    response.writeHead(204);
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? "/", `http://${HOST}:${PORT}`)
    .pathname;

  if (request.method === "GET" && pathname === "/health") {
    sendHealth(response);
    return;
  }

  if (pathname.startsWith("/auth")) {
    void import("./routes/auth.js")
      .then(({ handleAuth }) => handleAuth(request, response, pathname))
      .catch(() => {
        if (!response.headersSent) {
          sendJson(response, 500, { ok: false, error: "internal" });
        }
      });
    return;
  }

  if (pathname.startsWith("/evidence")) {
    void import("./routes/evidence.js")
      .then(({ handleEvidence }) => handleEvidence(request, response, pathname))
      .catch(() => {
        if (!response.headersSent) {
          sendJson(response, 500, { ok: false, error: "internal" });
        }
      });
    return;
  }

  if (pathname.startsWith("/mail")) {
    void import("./routes/mail.js")
      .then(({ handleMail }) => handleMail(request, response, pathname))
      .catch(() => {
        if (!response.headersSent) {
          sendJson(response, 500, { ok: false, error: "internal" });
        }
      });
    return;
  }

  sendJson(response, 404, { ok: false, error: "not_found" });
}

const certDirectory = join(homedir(), ".office-addin-dev-certs");
const certificatePath = join(certDirectory, "localhost.crt");
const keyPath = join(certDirectory, "localhost.key");
const hasCertificates = existsSync(certificatePath) && existsSync(keyPath);

if (hasCertificates) {
  createHttpsServer(
    {
      cert: readFileSync(certificatePath),
      key: readFileSync(keyPath),
    },
    handleRequest,
  ).listen(PORT, HOST, () => {
    console.log(`DocTrace backend listening on https://${HOST}:${PORT}`);
  });
} else {
  console.warn(
    "Certificate not available, falling back to HTTP. Run 'npm run certs:install' as Administrator to enable HTTPS.",
  );
  createHttpServer(handleRequest).listen(PORT, HOST, () => {
    console.log(`DocTrace backend listening on http://${HOST}:${PORT}`);
  });
}
