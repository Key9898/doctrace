import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseCorsOrigins, resolveCorsOrigin } from "./cors-origin.js";

describe("parseCorsOrigins", () => {
  it("defaults to local pane origin when unset or blank", () => {
    assert.deepEqual(parseCorsOrigins(undefined), ["https://127.0.0.1:3000"]);
    assert.deepEqual(parseCorsOrigins(""), ["https://127.0.0.1:3000"]);
    assert.deepEqual(parseCorsOrigins("   "), ["https://127.0.0.1:3000"]);
  });

  it("parses a comma-separated allowlist", () => {
    assert.deepEqual(
      parseCorsOrigins(
        "https://127.0.0.1:3000, https://doctrace-one.vercel.app",
      ),
      ["https://127.0.0.1:3000", "https://doctrace-one.vercel.app"],
    );
  });

  it("drops star entries and falls back to default when only star", () => {
    assert.deepEqual(parseCorsOrigins("*"), ["https://127.0.0.1:3000"]);
    assert.deepEqual(parseCorsOrigins("*,https://doctrace-one.vercel.app"), [
      "https://doctrace-one.vercel.app",
    ]);
  });
});

describe("resolveCorsOrigin", () => {
  const allowlist = [
    "https://127.0.0.1:3000",
    "https://doctrace-one.vercel.app",
  ];

  it("echoes an exact allowlist match", () => {
    assert.equal(
      resolveCorsOrigin("https://doctrace-one.vercel.app", allowlist),
      "https://doctrace-one.vercel.app",
    );
  });

  it("rejects an unknown origin", () => {
    assert.equal(resolveCorsOrigin("https://evil.example", allowlist), null);
  });

  it("rejects star and missing origin", () => {
    assert.equal(resolveCorsOrigin("*", allowlist), null);
    assert.equal(resolveCorsOrigin(null, allowlist), null);
    assert.equal(resolveCorsOrigin(undefined, allowlist), null);
  });
});
