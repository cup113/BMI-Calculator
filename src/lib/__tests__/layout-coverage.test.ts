import { describe, it, expect } from "vitest";

describe("+layout", () => {
  it("exports prerender as true", async () => {
    const mod = await import("../../routes/+layout");
    expect(mod.prerender).toBe(true);
  });
});
