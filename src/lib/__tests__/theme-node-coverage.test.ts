// @vitest-environment node
import { describe, it, expect } from "vitest";

describe("theme.svelte in node environment", () => {
  it("defaults to light when window is not defined", async () => {
    const { theme } = await import("../theme.svelte");
    expect(theme.value).toBe("light");
  });
});
