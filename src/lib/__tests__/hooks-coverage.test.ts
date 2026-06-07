import { describe, it, expect } from "vitest";
import { reroute } from "../../hooks";

describe("reroute hook", () => {
  it("de-localizes URL pathname", () => {
    const result = reroute({ url: new URL("http://test.com/zh-CN/page") });
    expect(result).toBe("/zh-CN/page");
  });
});
