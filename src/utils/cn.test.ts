import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const isBar = false;
    expect(cn("foo", isBar && "bar", "baz")).toBe("foo baz");
  });

  it("should merge tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle undefined values", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });

  it("should handle null values", () => {
    expect(cn("foo", null, "bar")).toBe("foo bar");
  });

  it("should handle empty strings", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });

  it("should handle object notation", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should handle arrays", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });
});
